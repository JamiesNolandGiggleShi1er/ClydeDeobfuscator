// hey yall :3 (jesus loves u)
'use strict';

const { OP, JUMP_ARG } = require('./cfg.js');

function recomputePreds(blocks) {
  for (const b of blocks) if (b) b.preds = [];
  for (const b of blocks) {
    if (!b) continue;
    for (const s of b.succs) if (blocks[s]) blocks[s].preds.push(b.id);
  }
}

function toWorking(cfg) {
  const blocks = cfg.blocks.map(b => ({
    id: b.id,
    instrs: b.instrs.slice(),
    succs: b.succs.slice(),
    preds: [],
    kind: b.kind,
  }));
  recomputePreds(blocks);
  return blocks;
}

function logicSig(instrs, i) {
  if (i < 0 || !instrs[i] || instrs[i].op !== OP.DUP) return null;
  let j = i + 1, neg = false;
  if (instrs[j] && instrs[j].op === OP.NOT) { neg = true; j++; }
  if (!instrs[j] || instrs[j].op !== OP.JMP_F) return null;
  return { neg, jIdx: j };
}

function hasJump(instrs) {
  for (const ins of instrs) {
    if (ins.op === -1) { if (hasJump(ins.sub)) return true; continue; }
    if (JUMP_ARG[ins.op] !== undefined) return true;
  }
  return false;
}

function collapseRun(instrs, endPos) {
  const out = [];
  let i = 0;
  while (i < instrs.length) {
    const sig = logicSig(instrs, i);
    if (sig) {
      const t = instrs[sig.jIdx].args[0];
      let endIdx = -1;
      if (t === endPos) endIdx = instrs.length;
      else for (let k = sig.jIdx + 1; k < instrs.length; k++) if (instrs[k].pos === t) { endIdx = k; break; }
      const popIns = instrs[sig.jIdx + 1];
      if (endIdx > sig.jIdx + 2 && popIns && popIns.op === OP.POP && popIns.args[0] === 1) {
        const subEnd = endIdx < instrs.length ? instrs[endIdx].pos : endPos;
        const sub = collapseRun(instrs.slice(sig.jIdx + 2, endIdx), subEnd);

        if (!hasJump(sub)) {
          out.push({ op: -1, logic: sig.neg ? 'or' : 'and', sub, pos: instrs[i].pos, args: [], size: 0 });
          i = endIdx;
          continue;
        }
      }
    }
    out.push(instrs[i]);
    i++;
  }
  return out;
}

function collapsePass(blocks) {
  let changed = false;
  for (const b of blocks) {
    if (!b || !b.instrs.length || b.kind !== 'cond') continue;
    const n = b.instrs.length;
    let sig = logicSig(b.instrs, n - 2);
    if (!sig || sig.jIdx !== n - 1) sig = logicSig(b.instrs, n - 3);
    if (!sig || sig.jIdx !== n - 1) continue;
    const F = b.succs[0], T = b.succs[1];
    if (F === undefined || T === undefined || F === T || !blocks[F] || !blocks[T]) continue;

    const chain = [];
    const inChain = new Set();
    let cur = F, ok = true;
    while (cur !== T) {
      if (cur === undefined || !blocks[cur] || inChain.has(cur)) { ok = false; break; }
      chain.push(cur); inChain.add(cur);
      if (blocks[cur].succs.length !== 1) { ok = false; break; }
      cur = blocks[cur].succs[0];
    }
    if (!ok || !chain.length) continue;
    let sealed = true;
    for (const c of chain) {
      for (const p of blocks[c].preds) if (p !== b.id && !inChain.has(p)) { sealed = false; break; }
      if (!sealed) break;
    }
    if (!sealed) continue;

    let merged = b.instrs.slice();
    for (const c of chain) {
      let mine = blocks[c].instrs;
      if (mine.length && mine[mine.length - 1].op === OP.JMP) mine = mine.slice(0, -1);
      merged = merged.concat(mine);
    }
    const endPos = blocks[T].instrs.length ? blocks[T].instrs[0].pos : -1;
    const col = collapseRun(merged, endPos);
    if (!col.length || col[col.length - 1].op !== -1) continue;

    b.instrs = col;
    b.succs = [T];
    b.kind = 'fall';
    for (const c of chain) blocks[c] = null;
    recomputePreds(blocks);
    changed = true;
  }
  return changed;
}

function coalescePass(blocks) {
  let changed = false;
  for (const b of blocks) {
    if (!b || (b.kind !== 'fall' && b.kind !== 'jmp') || b.succs.length !== 1) continue;
    const y = blocks[b.succs[0]];
    if (!y || y.id === b.id || y.preds.length !== 1 || y.preds[0] !== b.id) continue;
    let mine = b.instrs;
    if (mine.length && mine[mine.length - 1].op === OP.JMP) mine = mine.slice(0, -1);
    b.instrs = mine.concat(y.instrs);
    b.succs = y.succs.slice();
    b.kind = y.kind;
    blocks[y.id] = null;
    recomputePreds(blocks);
    changed = true;
  }
  return changed;
}

function simplify(blocks) {
  for (let guard = 0; guard < 4096; guard++) {
    const a = collapsePass(blocks);
    const c = coalescePass(blocks);
    if (!a && !c) break;
  }
  return blocks;
}

module.exports = { toWorking, recomputePreds, logicSig, hasJump, collapseRun, collapsePass, coalescePass, simplify };
