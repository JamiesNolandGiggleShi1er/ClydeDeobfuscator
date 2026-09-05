// hey yall :3 (jesus loves u)
'use strict';

const { E } = require('./luaemit.js');

const LOCAL_RE = /^[vpt][0-9]+$/;
function isLocalName(n) { return LOCAL_RE.test(n); }

const BODY_KINDS = new Set(['do', 'while', 'repeat', 'fornum', 'forin', 'localfunc']);
function isLoopStmt(s) { return s.k === 'while' || s.k === 'repeat' || s.k === 'fornum' || s.k === 'forin'; }

function mapStmts(list, fn) {
  const out = [];
  for (const s of list) {
    let t = s;
    if (BODY_KINDS.has(t.k)) t = Object.assign({}, t, { body: mapStmts(t.body, fn) });
    else if (t.k === 'if') {
      t = Object.assign({}, t, {
        clauses: t.clauses.map(c => Object.assign({}, c, { body: mapStmts(c.body, fn) })),
        orelse: t.orelse ? mapStmts(t.orelse, fn) : null,
      });
    }
    const r = fn(t);
    if (r === null || r === undefined) out.push(t);
    else if (Array.isArray(r)) for (const x of r) out.push(x);
    else out.push(r);
  }
  return out;
}

function eachExpr(s, fn) {
  const go = (e) => { if (e) fn(e); };
  switch (s.k) {
    case 'local': (s.values || []).forEach(go); break;
    case 'assign': s.targets.forEach(go); (s.values || []).forEach(go); break;
    case 'callstat': go(s.call); break;
    case 'return': (s.values || []).forEach(go); break;
    case 'while': go(s.cond); break;
    case 'repeat': go(s.cond); break;
    case 'fornum': go(s.start); go(s.limit); go(s.step); break;
    case 'forin': (s.iters || []).forEach(go); break;
    case 'if': s.clauses.forEach(c => go(c.cond)); break;
    default: break;
  }
}

function mapExpr(e, fn) {
  if (!e || typeof e !== 'object') return e;
  let t = e;
  switch (e.k) {
    case 'bin': t = Object.assign({}, e, { a: mapExpr(e.a, fn), b: mapExpr(e.b, fn) }); break;
    case 'un': t = Object.assign({}, e, { a: mapExpr(e.a, fn) }); break;
    case 'paren': t = Object.assign({}, e, { e: mapExpr(e.e, fn) }); break;
    case 'index': t = Object.assign({}, e, { o: mapExpr(e.o, fn), i: mapExpr(e.i, fn) }); break;
    case 'call': t = Object.assign({}, e, { f: mapExpr(e.f, fn), args: e.args.map(x => mapExpr(x, fn)) }); break;
    case 'method': t = Object.assign({}, e, { o: mapExpr(e.o, fn), args: e.args.map(x => mapExpr(x, fn)) }); break;
    case 'table': t = Object.assign({}, e, {
      items: e.items.map(it => ({ key: it.key ? mapExpr(it.key, fn) : null, value: mapExpr(it.value, fn) })),
    }); break;

    default: break;
  }
  const r = fn(t);
  return r === null || r === undefined ? t : r;
}

function mapStmtExprs(s, fn) {
  const M = (e) => (e ? mapExpr(e, fn) : e);
  switch (s.k) {
    case 'local': return Object.assign({}, s, { values: (s.values || []).map(M) });
    case 'assign': return Object.assign({}, s, { targets: s.targets.map(M), values: (s.values || []).map(M) });
    case 'callstat': return Object.assign({}, s, { call: M(s.call) });
    case 'return': return Object.assign({}, s, { values: (s.values || []).map(M) });
    case 'while': return Object.assign({}, s, { cond: M(s.cond) });
    case 'repeat': return Object.assign({}, s, { cond: M(s.cond) });
    case 'fornum': return Object.assign({}, s, { start: M(s.start), limit: M(s.limit), step: M(s.step) });
    case 'forin': return Object.assign({}, s, { iters: (s.iters || []).map(M) });
    case 'if': return Object.assign({}, s, { clauses: s.clauses.map(c => Object.assign({}, c, { cond: M(c.cond) })) });
    default: return s;
  }
}

function mapAllExprs(list, fn) {
  return mapStmts(list, (s) => mapStmtExprs(s, fn));
}

function isLit(e) { return e && (e.k === 'num' || e.k === 'str' || e.k === 'bool' || e.k === 'nil'); }
function truthy(e) { return e.k === 'nil' ? false : (e.k === 'bool' ? e.v : true); }

function foldBin(op, a, b) {
  if (a.k === 'num' && b.k === 'num') {
    const x = a.v, y = b.v;
    switch (op) {
      case '+': return E.num(x + y);
      case '-': return E.num(x - y);
      case '*': return E.num(x * y);
      case '/': return y === 0 ? null : E.num(x / y);
      case '%': return y === 0 ? null : E.num(x - Math.floor(x / y) * y);
      case '//': return y === 0 ? null : E.num(Math.floor(x / y));
      case '^': return E.num(Math.pow(x, y));
      case '..': return null;
      case '<': return E.bool(x < y);
      case '<=': return E.bool(x <= y);
      case '>': return E.bool(x > y);
      case '>=': return E.bool(x >= y);
      case '==': return E.bool(x === y);
      case '~=': return E.bool(x !== y);
      default: return null;
    }
  }
  if (a.k === 'str' && b.k === 'str') {
    switch (op) {
      case '..': return E.str(a.v + b.v);
      case '==': return E.bool(a.v === b.v);
      case '~=': return E.bool(a.v !== b.v);
      default: return null;
    }
  }

  if (isLit(a) && isLit(b) && a.k !== b.k) {
    if (op === '==') return E.bool(false);
    if (op === '~=') return E.bool(true);
  }
  if (a.k === 'bool' && b.k === 'bool') {
    if (op === '==') return E.bool(a.v === b.v);
    if (op === '~=') return E.bool(a.v !== b.v);
  }
  if (a.k === 'nil' && b.k === 'nil') {
    if (op === '==') return E.bool(true);
    if (op === '~=') return E.bool(false);
  }
  return null;
}

function foldNode(e) {
  if (e.k === 'paren' && isLit(e.e)) return e.e;
  if (e.k === 'un') {
    if (e.op === 'not' && isLit(e.a)) return E.bool(!truthy(e.a));
    if (e.op === '-' && e.a.k === 'num') return E.num(-e.a.v);
    if (e.op === '#' && e.a.k === 'str') return E.num(e.a.v.length);
    return null;
  }
  if (e.k !== 'bin') return null;

  if (e.op === 'and') {
    if (isLit(e.a)) return truthy(e.a) ? e.b : e.a;
    return null;
  }
  if (e.op === 'or') {
    if (isLit(e.a)) return truthy(e.a) ? e.a : e.b;
    return null;
  }
  if (isLit(e.a) && isLit(e.b)) return foldBin(e.op, e.a, e.b);
  return null;
}

function foldExprs(list) { return mapAllExprs(list, foldNode); }

function foldIf(s) {
  if (s.k !== 'if') return null;
  const clauses = [];
  let orelse = s.orelse;
  for (const c of s.clauses) {
    if (!isLit(c.cond)) { clauses.push(c); continue; }
    if (truthy(c.cond)) {
      if (!clauses.length) return c.body.length ? c.body : [];
      orelse = c.body;
      break;
    }
  }
  if (!clauses.length) return orelse && orelse.length ? orelse : [];
  return Object.assign({}, s, { clauses, orelse: orelse && orelse.length ? orelse : null });
}

function pullCloses(list) {
  const names = [];
  const add = (ns) => { for (const n of ns) if (!names.includes(n)) names.push(n); };
  const out = [];
  for (const s of list) {
    if (s.k === 'close') { add(s.names); continue; }
    if (s.k === 'if') {
      const clauses = s.clauses.map(c => { const r = pullCloses(c.body); add(r.names); return Object.assign({}, c, { body: r.list }); });
      let orelse = s.orelse;
      if (orelse) { const r = pullCloses(orelse); add(r.names); orelse = r.list; }
      out.push(Object.assign({}, s, { clauses, orelse }));
      continue;
    }
    if (s.k === 'do') {
      const r = pullCloses(s.body); add(r.names);
      out.push(Object.assign({}, s, { body: r.list }));
      continue;
    }
    out.push(s);
  }
  return { list: out, names };
}

function renameAll(list, m) {
  const R = (n) => (m.has(n) ? m.get(n) : n);
  const rx = (e) => {
    if (!e || typeof e !== 'object') return e;
    switch (e.k) {
      case 'name': return m.has(e.n) ? Object.assign({}, e, { n: m.get(e.n) }) : e;
      case 'bin': return Object.assign({}, e, { a: rx(e.a), b: rx(e.b) });
      case 'un': return Object.assign({}, e, { a: rx(e.a) });
      case 'paren': return Object.assign({}, e, { e: rx(e.e) });
      case 'index': return Object.assign({}, e, { o: rx(e.o), i: rx(e.i) });
      case 'call': return Object.assign({}, e, { f: rx(e.f), args: e.args.map(rx) });
      case 'method': return Object.assign({}, e, { o: rx(e.o), args: e.args.map(rx) });
      case 'table': return Object.assign({}, e, {
        items: e.items.map(it => ({ key: it.key ? rx(it.key) : null, value: rx(it.value) })),
      });
      case 'func': return Object.assign({}, e, {
        params: (e.params || []).slice(),
        body: renameAll(e.body || [], e.params && e.params.some(p => m.has(p))
          ? new Map([...m].filter(([k]) => !e.params.includes(k)))
          : m),
      });
      default: return e;
    }
  };
  return list.map((s) => {
    switch (s.k) {
      case 'local': return Object.assign({}, s, { names: s.names.map(R), values: (s.values || []).map(rx) });
      case 'assign': return Object.assign({}, s, { targets: s.targets.map(rx), values: (s.values || []).map(rx) });
      case 'callstat': return Object.assign({}, s, { call: rx(s.call) });
      case 'return': return Object.assign({}, s, { values: (s.values || []).map(rx) });
      case 'close': case 'iterprep': return Object.assign({}, s, { names: (s.names || []).map(R) });
      case 'while': return Object.assign({}, s, { cond: rx(s.cond), body: renameAll(s.body, m) });
      case 'repeat': return Object.assign({}, s, { body: renameAll(s.body, m), cond: rx(s.cond) });
      case 'do': return Object.assign({}, s, { body: renameAll(s.body, m) });
      case 'fornum': return Object.assign({}, s, {
        var: R(s.var), start: rx(s.start), limit: rx(s.limit), step: rx(s.step), body: renameAll(s.body, m) });
      case 'forin': return Object.assign({}, s, {
        vars: s.vars.map(R), iters: (s.iters || []).map(rx), body: renameAll(s.body, m) });
      case 'localfunc': return Object.assign({}, s, { name: R(s.name), body: renameAll(s.body, m) });
      case 'if': return Object.assign({}, s, {
        clauses: s.clauses.map(c => Object.assign({}, c, { cond: rx(c.cond), body: renameAll(c.body, m) })),
        orelse: s.orelse ? renameAll(s.orelse, m) : null });
      default: return s;
    }
  });
}

function hoistCloses(list, ctx) {
  const done = mapStmts(list, (s) => {
    if (!isLoopStmt(s)) return null;
    const r = pullCloses(s.body);
    if (!r.names.length) return null;
    const m = new Map();
    for (const n of r.names) m.set(n, ctx ? ctx.fresh('v') : n);
    const body = renameAll(r.list, m);
    const decl = { k: 'local', names: r.names.map(n => m.get(n)), values: [], perIter: true };
    return Object.assign({}, s, { body: [decl].concat(body) });
  });
  return mapStmts(done, (s) => (s.k === 'close' ? [] : null));
}

function expandIterPrep(s, ctx) {
  const [it, state, ctl] = s.names;
  const ok = ctx.fresh('t'), mt = ctx.fresh('t');
  const isTable = (e) => E.bin('==', E.call(E.name('type'), [e], false), E.str('table'));
  const mtOk = E.bin('and', E.name(ok), isTable(E.name(mt)));
  return {
    k: 'if',
    clauses: [{
      cond: isTable(E.name(it)),
      body: [
        { k: 'local', names: [ok, mt], values: [E.call(E.name('pcall'), [E.name('getmetatable'), E.name(it)], false)] },
        {
          k: 'if',
          clauses: [
            { cond: E.bin('and', mtOk, E.index(E.name(mt), E.str('__iter'))),
              body: [{ k: 'assign', targets: [E.name(it)],
                       values: [E.call(E.index(E.name(mt), E.str('__iter')), [E.name(it)], false)] }] },

            { cond: E.bin('and', mtOk, E.index(E.name(mt), E.str('__call'))), body: [] },
          ],
          orelse: [{ k: 'assign', targets: [E.name(it), E.name(state), E.name(ctl)],
                     values: [E.name('next'), E.name(it), E.nil()] }],
        },
      ],
    }],
    orelse: null,
  };
}

function scanOwn(list, kinds) {
  for (const s of list) {
    if (kinds.has(s.k)) return true;
    if (s.k === 'if') {
      for (const c of s.clauses) if (scanOwn(c.body, kinds)) return true;
      if (s.orelse && scanOwn(s.orelse, kinds)) return true;
    } else if (s.k === 'do') {
      if (scanOwn(s.body, kinds)) return true;
    }
  }
  return false;
}
const K_CONT = new Set(['continue']);
function hasOwnContinue(list) { return scanOwn(list, K_CONT); }

function pureExpr(e) {
  if (!e || typeof e !== 'object') return true;
  switch (e.k) {
    case 'call': case 'method': case 'func': case 'raw': return false;
    case 'bin': return pureExpr(e.a) && pureExpr(e.b);
    case 'un': return pureExpr(e.a);
    case 'paren': return pureExpr(e.e);
    case 'index': return pureExpr(e.o) && pureExpr(e.i);
    case 'table': return e.items.every(it => (!it.key || pureExpr(it.key)) && pureExpr(it.value));
    default: return true;
  }
}

function endsHard(list) {
  if (!list.length) return false;
  const s = list[list.length - 1];
  if (s.k === 'return' || s.k === 'break' || s.k === 'continue') return true;
  if (s.k === 'do') return endsHard(s.body);
  if (s.k === 'if') {
    if (!s.orelse) return false;
    for (const c of s.clauses) if (!endsHard(c.body)) return false;
    return endsHard(s.orelse);
  }
  return false;
}

function trimTailContinue(list) {
  let out = list;
  for (;;) {
    if (!out.length) return out;
    const last = out[out.length - 1];
    if (last.k === 'continue') { out = out.slice(0, -1); continue; }
    if (last.k === 'if') {
      const t = Object.assign({}, last, {
        clauses: last.clauses.map(c => Object.assign({}, c, { body: trimTailContinue(c.body) })),
        orelse: last.orelse ? trimTailContinue(last.orelse) : null,
      });
      out = out.slice(0, -1).concat([t]);
      return out;
    }
    if (last.k === 'do') {
      const t = Object.assign({}, last, { body: trimTailContinue(last.body) });
      return out.slice(0, -1).concat([t]);
    }
    return out;
  }
}

function isBreakOnly(body) { return body && body.length === 1 && body[0].k === 'break'; }

function negate(e) {
  if (e.k === 'un' && e.op === 'not') return condOf(e.a);
  if (e.k === 'bool') return E.bool(!e.v);
  if (e.k === 'paren') return negate(e.e);
  return E.un('not', e);
}

function condOf(e) {
  if (!e) return e;
  if (e.k === 'paren' && e.e.k !== 'call' && e.e.k !== 'method' && e.e.k !== 'vararg') return condOf(e.e);
  if (e.k === 'un' && e.op === 'not' && e.a.k === 'un' && e.a.op === 'not') return condOf(e.a.a);
  return e;
}

function simplifyConds(s) {
  if (s.k === 'while' || s.k === 'repeat') {
    const c = condOf(s.cond);
    return c === s.cond ? null : Object.assign({}, s, { cond: c });
  }
  if (s.k === 'if') {
    let ch = false;
    const clauses = s.clauses.map(c => {
      const n = condOf(c.cond);
      if (n === c.cond) return c;
      ch = true;
      return Object.assign({}, c, { cond: n });
    });
    return ch ? Object.assign({}, s, { clauses }) : null;
  }
  return null;
}

function mentions(e, names) {
  let hit = false;
  mapExpr(e, (x) => { if (x.k === 'name' && names.has(x.n)) hit = true; return null; });
  return hit;
}

function resugarLoop(s) {
  if (s.k !== 'while' || !s.cond || s.cond.k !== 'bool' || s.cond.v !== true) return null;
  const body = trimTailContinue(s.body);

  let n = 0;
  while (n < body.length && body[n].k === 'local' && body[n].perIter) n++;
  const lead = body.slice(0, n);
  const rest = body.slice(n);
  const leadNames = new Set();
  for (const l of lead) for (const nm of l.names) leadNames.add(nm);

  const liftable = (c) => !leadNames.size || !mentions(c, leadNames);

  const first = rest[0];

  if (rest.length === 1 && first.k === 'if' && first.clauses.length === 1
      && isBreakOnly(first.orelse) && liftable(first.clauses[0].cond)) {
    return { k: 'while', cond: condOf(first.clauses[0].cond),
             body: lead.concat(trimTailContinue(first.clauses[0].body)) };
  }

  if (rest.length >= 1 && first.k === 'if' && first.clauses.length === 1
      && !first.orelse && isBreakOnly(first.clauses[0].body) && liftable(first.clauses[0].cond)) {
    return { k: 'while', cond: negate(first.clauses[0].cond),
             body: lead.concat(trimTailContinue(rest.slice(1))) };
  }

  const last = rest[rest.length - 1];
  if (rest.length >= 2 && last && last.k === 'if' && last.clauses.length === 1
      && !last.orelse && isBreakOnly(last.clauses[0].body)) {
    const b = rest.slice(0, -1);
    if (!hasOwnContinue(b)) return { k: 'repeat', body: lead.concat(b), cond: last.clauses[0].cond };
  }
  return body === s.body ? null : Object.assign({}, s, { body });
}

function flattenElse(s) {
  if (s.k !== 'if' || !s.orelse || s.clauses.length !== 1) return null;
  if (!endsHard(s.clauses[0].body)) return null;
  return [Object.assign({}, s, { orelse: null })].concat(s.orelse);
}

function dropEmptyIf(s) {
  if (s.k !== 'if') return null;
  for (const c of s.clauses) { if (c.body.length || !pureExpr(c.cond)) return null; }
  if (s.orelse && s.orelse.length) return null;
  return [];
}

function census(list, acc) {
  const rd = (e) => {
    if (!e || typeof e !== 'object') return;
    switch (e.k) {
      case 'name': acc.reads.set(e.n, (acc.reads.get(e.n) || 0) + 1); break;
      case 'bin': rd(e.a); rd(e.b); break;
      case 'un': rd(e.a); break;
      case 'paren': rd(e.e); break;
      case 'index': rd(e.o); rd(e.i); break;
      case 'call': rd(e.f); e.args.forEach(rd); break;
      case 'method': rd(e.o); e.args.forEach(rd); break;
      case 'table': for (const it of e.items) { if (it.key) rd(it.key); rd(it.value); } break;
      case 'func': for (const p of e.params || []) acc.writes.set(p, (acc.writes.get(p) || 0) + 1);
                   census(e.body || [], acc); break;
      default: break;
    }
  };
  const wr = (n) => acc.writes.set(n, (acc.writes.get(n) || 0) + 1);
  for (const s of list) {
    switch (s.k) {
      case 'local':
        for (const n of s.names) if ((s.values || []).length) wr(n);
        (s.values || []).forEach(rd);
        break;
      case 'assign':
        for (const t of s.targets) { if (t.k === 'name') wr(t.n); else rd(t); }
        (s.values || []).forEach(rd);
        break;
      case 'callstat': rd(s.call); break;
      case 'return': (s.values || []).forEach(rd); break;
      case 'iterprep': case 'close': for (const n of s.names || []) wr(n); break;
      case 'while': rd(s.cond); census(s.body, acc); break;
      case 'repeat': census(s.body, acc); rd(s.cond); break;
      case 'do': census(s.body, acc); break;
      case 'fornum': wr(s.var); rd(s.start); rd(s.limit); rd(s.step); census(s.body, acc); break;
      case 'forin': for (const v of s.vars) wr(v); (s.iters || []).forEach(rd); census(s.body, acc); break;
      case 'localfunc': wr(s.name); for (const p of s.params || []) wr(p); census(s.body, acc); break;
      case 'if':
        for (const c of s.clauses) { rd(c.cond); census(c.body, acc); }
        if (s.orelse) census(s.orelse, acc);
        break;
      default: break;
    }
  }
  return acc;
}
function nameCensus(list) { return census(list, { reads: new Map(), writes: new Map() }); }

function substReads(s, sub) {
  const f = (e) => (e.k === 'name' && sub.has(e.n) ? sub.get(e.n) : null);
  if (s.k === 'assign') {
    return Object.assign({}, s, {
      targets: s.targets.map(t => (t.k === 'name' ? t : mapExpr(t, f))),
      values: (s.values || []).map(v => mapExpr(v, f)),
    });
  }
  return mapStmtExprs(s, f);
}

function propagateLiterals(list) {
  const { writes } = nameCensus(list);
  const sub = new Map();
  const out = [];
  for (const s of list) {
    const t = sub.size ? mapStmts([s], (x) => substReads(x, sub)) : [s];
    for (const x of t) out.push(x);
    if (s.k === 'assign' && s.targets.length === 1 && s.values && s.values.length === 1
        && s.targets[0].k === 'name' && isLocalName(s.targets[0].n)
        && writes.get(s.targets[0].n) === 1 && isLit(s.values[0])) {
      sub.set(s.targets[0].n, s.values[0]);
    }
  }
  return out;
}

function dropDeadStores(list) {
  for (let round = 0; round < 4; round++) {
    const { reads } = nameCensus(list);
    let changed = false;
    const next = mapStmts(list, (s) => {
      if (s.k !== 'assign' || s.targets.length !== 1 || s.targets[0].k !== 'name') return null;
      const n = s.targets[0].n;
      if (!isLocalName(n) || reads.get(n)) return null;
      if (!(s.values || []).every(pureExpr)) return null;
      changed = true;
      return [];
    });
    list = next;
    if (!changed) break;
  }
  return list;
}

function pruneDecls(list) {
  const c = nameCensus(list);
  return mapStmts(list, (s) => {
    if (s.k !== 'local' || (s.values || []).length) return null;
    const keep = s.names.filter(n => !isLocalName(n) || c.reads.get(n) || c.writes.get(n));
    if (keep.length === s.names.length) return null;
    return keep.length ? Object.assign({}, s, { names: keep }) : [];
  });
}

function chainElseif(s) {
  if (s.k !== 'if' || !s.orelse || s.orelse.length !== 1 || s.orelse[0].k !== 'if') return null;
  const inner = s.orelse[0];
  return { k: 'if', clauses: s.clauses.concat(inner.clauses), orelse: inner.orelse };
}

function pass(list, fn) {
  let ch = false;
  const out = mapStmts(list, (s) => {
    const r = fn(s);
    if (r !== null && r !== undefined) ch = true;
    return r;
  });
  return { list: out, ch };
}

function foldPass(list) {
  let ch = false;
  const out = mapAllExprs(list, (e) => {
    const r = foldNode(e);
    if (r !== null && r !== undefined) ch = true;
    return r;
  });
  return { list: out, ch };
}

function resugar(stmts, ctx) {
  let list = mapStmts(stmts, (s) => (s.k === 'iterprep' ? expandIterPrep(s, ctx) : null));
  list = hoistCloses(list, ctx);

  for (let guard = 0; guard < 64; guard++) {
    let ch = false;
    let r;
    r = foldPass(list); list = r.list; ch = ch || r.ch;
    r = pass(list, foldIf); list = r.list; ch = ch || r.ch;
    r = pass(list, resugarLoop); list = r.list; ch = ch || r.ch;
    r = pass(list, flattenElse); list = r.list; ch = ch || r.ch;
    r = pass(list, dropEmptyIf); list = r.list; ch = ch || r.ch;
    r = pass(list, simplifyConds); list = r.list; ch = ch || r.ch;
    const before = list;
    list = propagateLiterals(list);
    if (list !== before && JSON.stringify(list) !== JSON.stringify(before)) ch = true; else list = before;
    if (!ch) break;
  }

  list = dropDeadStores(list);
  list = pruneDecls(list);
  list = pass(list, chainElseif).list;
  return list;
}

module.exports = {
  isLocalName, mapStmts, eachExpr, isLoopStmt, mapExpr, mapStmtExprs, mapAllExprs,
  isLit, truthy, foldBin, foldNode, foldExprs, foldIf,
  pullCloses, hoistCloses, expandIterPrep, renameAll,
  hasOwnContinue, pureExpr, endsHard, trimTailContinue, resugarLoop, flattenElse, dropEmptyIf,
  negate, condOf, simplifyConds, mentions,
  nameCensus, substReads, propagateLiterals, dropDeadStores, pruneDecls, chainElseif,
  pass, foldPass, resugar,
};
