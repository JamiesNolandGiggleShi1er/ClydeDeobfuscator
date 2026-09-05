// hey yall :3 (jesus loves u)
'use strict';

const { E } = require('./luaemit.js');
const { dominators, findLoops } = require('./cfg.js');
const { execBlock } = require('./symexec.js');

function compact(blocks) {
  const map = new Map();
  const live = [];
  for (const b of blocks) if (b) { map.set(b.id, live.length); live.push(b); }
  const out = live.map((b, i) => ({ id: i, instrs: b.instrs, kind: b.kind, succs: [], preds: [] }));
  for (let i = 0; i < live.length; i++) {
    for (const s of live[i].succs) {
      const t = map.get(s);
      if (t === undefined) throw new Error('structure: edge to a removed block');
      out[i].succs.push(t);
    }
  }
  for (const b of out) for (const s of b.succs) out[s].preds.push(b.id);
  return out;
}

function reachable(blocks, start, terminal) {
  const seen = new Set([start]);
  const q = [start];
  while (q.length) {
    const n = q.pop();
    if (terminal.has(n)) continue;
    for (const s of blocks[n].succs) if (!seen.has(s)) { seen.add(s); q.push(s); }
  }
  return seen;
}

function withAdded(set, x) { const s = new Set(set); s.add(x); return s; }

function mkIf(cond, thenS, elseS) {
  if (!thenS.length && elseS.length) {
    return { k: 'if', clauses: [{ cond: E.un('not', cond), body: elseS }], orelse: null };
  }
  return { k: 'if', clauses: [{ cond, body: thenS }], orelse: elseS.length ? elseS : null };
}

function structure(rawBlocks, ctx) {
  const blocks = compact(rawBlocks);
  const dom = dominators(blocks, 0);
  const rpoNum = dom.rpoNum;
  const loops = findLoops(blocks, dom);

  for (const L of loops.values()) {
    const ex = [...L.exits].filter(e => rpoNum[e] !== -1);
    if (!ex.length) { L.follow = null; continue; }
    if (ex.length === 1) { L.follow = ex[0]; continue; }
    let pick = null;
    for (const c of ex) {
      let all = true;
      for (const x of ex) if (x !== c && !reachable(blocks, x, new Set()).has(c)) { all = false; break; }
      if (all) { pick = c; break; }
    }
    if (pick === null) { ex.sort((a, b) => rpoNum[a] - rpoNum[b]); pick = ex[ex.length - 1]; }
    L.follow = pick;
  }

  const emitted = new Set();
  const active = new Set();
  const stack = [];

  function findJoin(T, F, stops) {
    const L = stack[stack.length - 1];
    const terminal = new Set(stops);
    if (L) { terminal.add(L.header); if (L.follow !== null) terminal.add(L.follow); }
    const rT = reachable(blocks, T, terminal);
    const rF = reachable(blocks, F, terminal);
    let best = -1;
    for (const x of rT) {
      if (!rF.has(x) || terminal.has(x) || rpoNum[x] === -1) continue;
      if (best === -1 || rpoNum[x] < rpoNum[best]) best = x;
    }
    return best === -1 ? null : best;
  }

  function edgeTo(target, stops) {
    if (stops.has(target)) return { stmts: [], exit: target, fall: false };
    const L = stack[stack.length - 1];
    if (L) {
      if (target === L.header) return { stmts: [{ k: 'continue' }], exit: null, fall: false };
      if (target === L.follow) return { stmts: [{ k: 'break' }], exit: null, fall: false };
    }
    for (let i = stack.length - 2; i >= 0; i--) {
      if (target === stack[i].header || target === stack[i].follow) {
        throw new Error('structure: jump out of a nested loop to block ' + target);
      }
    }
    return { stmts: [], exit: null, fall: true };
  }

  function branchInto(target, stops) {
    const e = edgeTo(target, stops);
    if (!e.fall) return { stmts: e.stmts, exit: e.exit };
    return region(target, stops);
  }

  function loopStmt(L) {
    active.add(L.header);
    stack.push(L);
    const r = region(L.header, new Set());
    stack.pop();
    active.delete(L.header);
    if (r.exit !== null) throw new Error('structure: loop body fell out to block ' + r.exit);
    return { k: 'while', cond: E.bool(true), body: r.stmts, loopHeader: L.header };
  }

  function region(start, stops) {
    const stmts = [];
    let cur = start;
    let exit = null;
    for (;;) {
      if (cur === null || cur === undefined) { exit = null; break; }
      if (stops.has(cur)) { exit = cur; break; }
      if (loops.has(cur) && !active.has(cur)) {
        const L = loops.get(cur);
        stmts.push(loopStmt(L));
        if (L.follow === null) { exit = null; break; }
        const e = edgeTo(L.follow, stops);
        for (const s of e.stmts) stmts.push(s);
        if (e.fall) { cur = L.follow; continue; }
        exit = e.exit;
        break;
      }
      if (emitted.has(cur)) throw new Error('structure: block ' + cur + ' would have to be emitted twice');
      emitted.add(cur);
      const b = blocks[cur];

      const r = (ctx.exec || execBlock)(b.instrs, ctx, false);
      if (r.stack.length) {
        throw new Error('structure: block ' + cur + ' left ' + r.stack.length + ' value(s) on the stack');
      }
      for (const s of r.stmts) stmts.push(s);

      if (b.kind === 'ret') { exit = null; break; }
      if (b.kind === 'cond') {
        if (r.cond === null) throw new Error('structure: conditional block ' + cur + ' produced no test');
        const T = b.succs[0], F = b.succs[1];
        if (T === undefined || F === undefined) {
          throw new Error('structure: conditional block ' + cur + ' has ' + b.succs.length + ' successor(s)');
        }
        const join = findJoin(T, F, stops);
        const inner = join === null ? stops : withAdded(stops, join);
        const a = branchInto(T, inner);
        const c = branchInto(F, inner);
        stmts.push(mkIf(r.cond, a.stmts, c.stmts));
        if (a.exit !== null && c.exit !== null && a.exit !== c.exit) {
          throw new Error('structure: branches of block ' + cur + ' fell out to ' + a.exit + ' and ' + c.exit);
        }
        const ex = a.exit !== null ? a.exit : c.exit;
        if (ex === null) { exit = null; break; }
        if (stops.has(ex)) { exit = ex; break; }
        cur = ex;
        continue;
      }
      const nxt = b.succs[0];
      if (nxt === undefined) { exit = null; break; }
      const e = edgeTo(nxt, stops);
      for (const s of e.stmts) stmts.push(s);
      if (e.fall) { cur = nxt; continue; }
      exit = e.exit;
      break;
    }
    return { stmts, exit };
  }

  const r = region(0, new Set());
  for (let i = 0; i < blocks.length; i++) {
    if (!emitted.has(i) && rpoNum[i] !== -1) {
      throw new Error('structure: block ' + i + ' is reachable but was never emitted');
    }
  }
  return r.stmts;
}

module.exports = { compact, reachable, withAdded, mkIf, structure };
