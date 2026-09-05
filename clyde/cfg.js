// hey yall :3 (jesus loves u)
'use strict';

const { ARGCNT, OPNAME } = require('./vmspec.js');

const OP = {
  NOP: 0, PUSH_NIL: 1, PUSH_TRUE: 2, PUSH_FALSE: 3, PUSH_K: 4, LOAD_L: 5, STORE_L: 6,
  LOAD_G: 7, STORE_G: 8, ADD: 9, SUB: 10, MUL: 11, DIV: 12, MOD: 13, POW: 14, CONCAT: 15,
  EQ: 16, NE: 17, LT: 18, LE: 19, GT: 20, GE: 21, AND: 22, OR: 23, NOT: 24, UNM: 25,
  LEN: 26, NEW_TABLE: 27, GET_TABLE: 28, SET_TABLE: 29, CALL: 30, RETURN: 31, JMP: 32,
  JMP_F: 33, POP: 34, CLOSURE: 35, DUP: 36, LOAD_UPVAL: 37, STORE_UPVAL: 38,
  CALL_MULTI: 39, LOAD_VARARG: 40, TAILCALL: 41, FORPREP: 42, FORLOOP: 43,
  CONCAT_MULTI: 44, PUSH_NILS: 45, MARK: 46, CALL_DYNAMIC: 47, IDIV: 48, CLOSE_UPVAL: 49,
  SETLIST: 50, SWAP: 51, NAMECALL: 52, TFOR: 53, PCALL: 54, XPCALL: 55, ITER_PREP: 56,
  SO_ADD_LLL: 57, SO_SUB_LLL: 58, SO_MUL_LLL: 59, SO_LOADK_L: 60, SO_MOVE_LL: 61,
  SO_ADD_LLK: 62, SO_CONCAT_LLL: 63, SO_TOP: 64, SO_STACKREAD: 65, SO_BXOR: 66,
  CTX_LOAD: 67,
};

const JUMP_ARG = { 32: 0, 33: 0, 42: 0, 43: 0, 53: 1 };
const TERMINATORS = new Set([OP.RETURN, OP.TAILCALL, OP.JMP]);

function instrSize(op) { return 1 + (ARGCNT[op] || 0); }

function decode(code) {
  const instrs = [];
  const byPos = new Map();
  let i = 0;
  while (i < code.length) {
    const op = code[i];
    if (!Number.isFinite(op) || op < 0 || op > 67) return null;
    const n = ARGCNT[op] || 0;
    if (i + n >= code.length + 0 && i + n > code.length - 1) return null;
    const args = code.slice(i + 1, i + 1 + n);
    byPos.set(i, instrs.length);
    instrs.push({ pos: i, op, args, size: 1 + n });
    i += 1 + n;
  }
  return { instrs, byPos };
}

function isJump(op) { return JUMP_ARG[op] !== undefined; }
function jumpTarget(ins) {
  const ai = JUMP_ARG[ins.op];
  return ai === undefined ? null : ins.args[ai];
}

function buildCFG(dec) {
  const { instrs, byPos } = dec;
  const leaders = new Set([0]);
  for (const ins of instrs) {
    const t = jumpTarget(ins);
    if (t !== null && byPos.has(t)) leaders.add(byPos.get(t));
    const nextIdx = byPos.get(ins.pos + ins.size);
    if (t !== null && nextIdx !== undefined) leaders.add(nextIdx);
    if ((ins.op === OP.RETURN || ins.op === OP.TAILCALL) && nextIdx !== undefined) leaders.add(nextIdx);
  }
  const sorted = [...leaders].filter(x => x < instrs.length).sort((a, b) => a - b);
  const blocks = [];
  const blockOfInstr = new Map();
  for (let bi = 0; bi < sorted.length; bi++) {
    const s = sorted[bi];
    const e = bi + 1 < sorted.length ? sorted[bi + 1] : instrs.length;
    const b = { id: bi, first: s, last: e - 1, instrs: instrs.slice(s, e), succs: [], preds: [], cond: null };
    for (let k = s; k < e; k++) blockOfInstr.set(k, bi);
    blocks.push(b);
  }

  const blockAtTarget = (word) => {
    const ii = byPos.get(word);
    return ii === undefined ? undefined : blockOfInstr.get(ii);
  };
  for (const b of blocks) {
    const last = b.instrs[b.instrs.length - 1];
    const fall = blockOfInstr.get(b.last + 1);
    if (last.op === OP.JMP) {
      const t = blockAtTarget(last.args[0]);
      b.succs = t === undefined ? [] : [t];
      b.kind = 'jmp';
    } else if (last.op === OP.JMP_F) {
      const t = blockAtTarget(last.args[0]);

      b.succs = [];
      if (fall !== undefined) b.succs.push(fall);
      if (t !== undefined) b.succs.push(t);
      b.kind = 'cond';
    } else if (last.op === OP.RETURN || last.op === OP.TAILCALL) {
      b.succs = [];
      b.kind = 'ret';
    } else if (last.op === OP.FORPREP || last.op === OP.FORLOOP || last.op === OP.TFOR) {
      const t = blockAtTarget(jumpTarget(last));
      b.succs = [];
      if (fall !== undefined) b.succs.push(fall);
      if (t !== undefined && t !== fall) b.succs.push(t);
      b.kind = 'cond';
    } else {
      b.succs = fall === undefined ? [] : [fall];
      b.kind = 'fall';
    }
  }
  for (const b of blocks) for (const s of b.succs) blocks[s].preds.push(b.id);
  return { blocks, instrs, byPos, blockOfInstr };
}

function relinearize(cfg) {
  const { blocks } = cfg;
  const order = [];
  const placed = new Uint8Array(blocks.length);
  const stack = [0];
  while (stack.length) {
    let id = stack.pop();
    if (placed[id]) continue;

    while (id !== undefined && !placed[id]) {
      placed[id] = 1;
      order.push(id);
      const b = blocks[id];

      for (let k = b.succs.length - 1; k >= 1; k--) if (!placed[b.succs[k]]) stack.push(b.succs[k]);
      const nxt = b.succs[0];
      id = (nxt !== undefined && !placed[nxt]) ? nxt : undefined;
    }
  }
  for (let i = 0; i < blocks.length; i++) if (!placed[i]) order.push(i);

  const jmpSize = 1 + (ARGCNT[OP.JMP] || 0);
  const needJump = new Array(blocks.length).fill(-1);
  for (let i = 0; i < order.length; i++) {
    const b = blocks[order[i]];
    if (b.kind === 'jmp' || b.kind === 'ret') continue;
    const ft = b.succs[0];
    if (ft !== undefined && order[i + 1] !== ft) needJump[order[i]] = ft;
  }

  const movedTo = new Array(blocks.length).fill(-1);
  let pos = 0;
  for (const id of order) {
    movedTo[id] = pos;
    for (const ins of blocks[id].instrs) pos += ins.size;
    if (needJump[id] !== -1) pos += jmpSize;
  }
  const total = pos;

  const out = [];
  for (const id of order) {
    const b = blocks[id];
    for (const ins of b.instrs) {
      out.push(ins.op);
      const ai = JUMP_ARG[ins.op];
      for (let k = 0; k < ins.args.length; k++) {
        if (k !== ai) { out.push(ins.args[k]); continue; }
        const tb = cfg.blockOfInstr.get(cfg.byPos.get(ins.args[k]));

        out.push(tb === undefined ? total : movedTo[tb]);
      }
    }
    if (needJump[id] !== -1) { out.push(OP.JMP); out.push(movedTo[needJump[id]]); }
  }
  return out;
}

function dropRedundantJumps(code) {
  const dec = decode(code);
  if (!dec) return code;
  const drop = new Set();
  for (const ins of dec.instrs) {
    if (ins.op === OP.JMP && ins.args[0] === ins.pos + ins.size) drop.add(ins.pos);
  }
  if (!drop.size) return code;

  const remap = new Map();
  let np = 0;
  for (const ins of dec.instrs) { remap.set(ins.pos, np); if (!drop.has(ins.pos)) np += ins.size; }
  remap.set(code.length, np);
  const out = [];
  for (const ins of dec.instrs) {
    if (drop.has(ins.pos)) continue;
    out.push(ins.op);
    const ai = JUMP_ARG[ins.op];
    for (let k = 0; k < ins.args.length; k++) {
      out.push(k === ai ? (remap.has(ins.args[k]) ? remap.get(ins.args[k]) : ins.args[k]) : ins.args[k]);
    }
  }
  return out;
}

function reversePostorder(blocks, entry) {
  const seen = new Uint8Array(blocks.length);
  const post = [];
  const st = [[entry, 0]];
  seen[entry] = 1;
  while (st.length) {
    const top = st[st.length - 1];
    const b = blocks[top[0]];
    if (top[1] < b.succs.length) {
      const s = b.succs[top[1]++];
      if (!seen[s]) { seen[s] = 1; st.push([s, 0]); }
    } else { post.push(top[0]); st.pop(); }
  }
  return post.reverse();
}

function dominators(blocks, entry = 0) {
  const rpo = reversePostorder(blocks, entry);
  const rpoNum = new Array(blocks.length).fill(-1);
  rpo.forEach((b, i) => { rpoNum[b] = i; });
  const idom = new Array(blocks.length).fill(-1);
  idom[entry] = entry;
  const intersect = (a, b) => {
    while (a !== b) {
      while (rpoNum[a] > rpoNum[b]) a = idom[a];
      while (rpoNum[b] > rpoNum[a]) b = idom[b];
    }
    return a;
  };
  let changed = true;
  while (changed) {
    changed = false;
    for (const b of rpo) {
      if (b === entry) continue;
      let newIdom = -1;
      for (const p of blocks[b].preds) {
        if (idom[p] === -1) continue;
        newIdom = newIdom === -1 ? p : intersect(p, newIdom);
      }
      if (newIdom !== -1 && idom[b] !== newIdom) { idom[b] = newIdom; changed = true; }
    }
  }
  return { idom, rpo, rpoNum };
}

function dominates(idom, a, b) {
  let x = b;
  for (;;) {
    if (x === a) return true;
    const p = idom[x];
    if (p === x || p === -1) return false;
    x = p;
  }
}

function postdominators(blocks) {
  const n = blocks.length;
  const VE = n;
  const rsucc = new Array(n + 1);
  const rpred = new Array(n + 1);
  for (let i = 0; i < n; i++) { rsucc[i] = blocks[i].preds.slice(); rpred[i] = blocks[i].succs.slice(); }
  rsucc[VE] = [];
  rpred[VE] = [];
  for (let i = 0; i < n; i++) {
    if (blocks[i].succs.length === 0) { rsucc[VE].push(i); rpred[i].push(VE); }
  }

  const seen = new Uint8Array(n + 1);
  const post = [];
  const st = [[VE, 0]];
  seen[VE] = 1;
  while (st.length) {
    const top = st[st.length - 1];
    const ss = rsucc[top[0]];
    if (top[1] < ss.length) {
      const s = ss[top[1]++];
      if (!seen[s]) { seen[s] = 1; st.push([s, 0]); }
    } else { post.push(top[0]); st.pop(); }
  }
  const rpo = post.reverse();
  const rpoNum = new Array(n + 1).fill(-1);
  rpo.forEach((b, i) => { rpoNum[b] = i; });
  const ipdom = new Array(n + 1).fill(-1);
  ipdom[VE] = VE;
  const intersect = (a, b) => {
    while (a !== b) {
      while (rpoNum[a] > rpoNum[b]) a = ipdom[a];
      while (rpoNum[b] > rpoNum[a]) b = ipdom[b];
    }
    return a;
  };
  let changed = true;
  while (changed) {
    changed = false;
    for (const b of rpo) {
      if (b === VE) continue;
      let nd = -1;
      for (const p of rpred[b]) {
        if (ipdom[p] === -1 || rpoNum[p] === -1) continue;
        nd = nd === -1 ? p : intersect(p, nd);
      }
      if (nd !== -1 && ipdom[b] !== nd) { ipdom[b] = nd; changed = true; }
    }
  }
  return { ipdom, exit: VE };
}

function findLoops(blocks, dom) {
  const { idom, rpoNum } = dom;
  const byHeader = new Map();
  for (const b of blocks) {
    for (const s of b.succs) {
      if (rpoNum[s] === -1 || rpoNum[b.id] === -1) continue;
      if (dominates(idom, s, b.id)) {
        let L = byHeader.get(s);
        if (!L) { L = { header: s, latches: [], body: new Set([s]), exits: new Set() }; byHeader.set(s, L); }
        L.latches.push(b.id);
      }
    }
  }
  for (const L of byHeader.values()) {
    const st = [...L.latches];
    while (st.length) {
      const n = st.pop();
      if (L.body.has(n)) continue;
      L.body.add(n);
      for (const p of blocks[n].preds) if (!L.body.has(p)) st.push(p);
    }
    for (const n of L.body) for (const s of blocks[n].succs) if (!L.body.has(s)) L.exits.add(s);
  }
  return byHeader;
}

module.exports = {
  OP, OPNAME, JUMP_ARG, TERMINATORS, instrSize, decode, buildCFG, relinearize,
  dropRedundantJumps, isJump, jumpTarget, dominators, dominates, findLoops,
  reversePostorder, postdominators,
};
