// hey yall :3 (jesus loves u)
'use strict';

const { ARGCNT } = require('./vmspec.js');

const JUMP_ARG = { 32: 0, 33: 0, 42: 0, 43: 0, 53: 1 };

function argCount(op) { return ARGCNT[op] || 0; }

function rewrite(code, fn) {
  const items = [];
  let i = 0;
  while (i < code.length) {
    const op = code[i];
    const n = argCount(op);
    if (i + n >= code.length + 1 && i + n > code.length - 1) break;
    const args = code.slice(i + 1, i + 1 + n);
    const rep = fn(op, args, i);
    items.push({ pos: i, words: rep === null ? [op].concat(args) : rep });
    i += 1 + n;
  }

  const map = new Map();
  let np = 0;
  for (const it of items) { map.set(it.pos, np); np += it.words.length; }
  map.set(code.length, np);

  const out = [];
  const fix = [];
  for (const it of items) {
    const base = out.length;
    for (const w of it.words) out.push(w);
    let j = 0;
    while (j < it.words.length) {
      const op = it.words[j];
      const ai = JUMP_ARG[op];
      if (ai !== undefined) fix.push(base + j + 1 + ai);
      j += 1 + argCount(op);
    }
  }
  for (const idx of fix) {
    const t = out[idx];
    if (map.has(t)) out[idx] = map.get(t);
  }
  return out;
}

function ctxBit(ctxInit, ctxPrime, pos) {
  const m = Math.imul(pos + 1, ctxPrime) >>> 0;
  return (((ctxInit ^ m) >>> 0) >>> 16) & 1;
}

function ctxLoads(code, ctxInit, ctxPrime) {
  if (!ctxInit) return code;
  let seen = 0;
  const out = rewrite(code, (op, args, pos) => {
    if (op !== 67) return null;
    seen++;
    return [ctxBit(ctxInit, ctxPrime, pos) === 0 ? 5 : 4, args[0]];
  });
  return seen ? out : code;
}

function ctxLoadsByShape(code, nK) {
  const slots = new Set();
  let i = 0, any = false;
  while (i < code.length) {
    const op = code[i];
    if (op === 5 || op === 6) slots.add(code[i + 1]);
    else if (op === 49) slots.add(code[i + 1]);
    else if (op === 67) any = true;
    i += 1 + argCount(op);
  }
  if (!any) return code;
  let undecided = 0;
  const out = rewrite(code, (op, args) => {
    if (op !== 67) return null;
    const n = args[0];
    const canK = n >= 0 && n < nK;
    const canL = slots.has(n);
    if (canL && !canK) return [5, n];
    if (canK && !canL) return [4, n];
    undecided++;
    return null;
  });
  return undecided ? null : out;
}

const DEAD_OPS = new Set([0, 64, 65, 66]);

function stripDead(code) {
  let any = false;
  for (let i = 0; i < code.length; i += 1 + argCount(code[i])) {
    if (DEAD_OPS.has(code[i])) { any = true; break; }
  }
  if (!any) return code;
  return rewrite(code, (op) => (DEAD_OPS.has(op) ? [] : null));
}

const ARITH_OF = { 57: 9, 58: 10, 59: 11, 63: 15 };

function expandSuperops(code) {
  let any = false;
  for (let i = 0; i < code.length; i += 1 + argCount(code[i])) {
    const op = code[i];
    if (ARITH_OF[op] !== undefined || op === 60 || op === 61 || op === 62) { any = true; break; }
  }
  if (!any) return code;
  return rewrite(code, (op, args) => {
    const ar = ARITH_OF[op];
    if (ar !== undefined) return [5, args[0], 5, args[1], ar, 6, args[2]];
    if (op === 62) return [5, args[0], 4, args[1], 9, 6, args[2]];
    if (op === 61) return [5, args[0], 6, args[1]];
    if (op === 60) return [4, args[0], 6, args[1]];
    return null;
  });
}

function decodeJumpTargets(code, jumpKey) {
  if (!jumpKey) return code;
  const out = code.slice();
  let i = 0;
  while (i < out.length) {
    const op = out[i];
    const ai = JUMP_ARG[op];
    if (ai !== undefined) out[i + 1 + ai] = (out[i + 1 + ai] ^ jumpKey) >>> 0;
    i += 1 + argCount(op);
  }
  return out;
}

function canonicalize(code, opts) {
  const o = opts || {};
  let c = code;
  if (o.jumpKey) c = decodeJumpTargets(c, o.jumpKey);
  if (o.ctxInit) c = ctxLoads(c, o.ctxInit, o.ctxPrime);
  else if (o.nK !== undefined) {
    const byShape = ctxLoadsByShape(c, o.nK);
    if (byShape === null) throw new Error('canon: CTX_LOAD without ctx keys');
    c = byShape;
  }
  c = stripDead(c);
  c = expandSuperops(c);
  return c;
}

function hasMaxOps(code) {
  for (let i = 0; i < code.length; i += 1 + argCount(code[i])) {
    if (code[i] >= 57) return true;
  }
  return false;
}

module.exports = {
  rewrite, ctxBit, ctxLoads, ctxLoadsByShape, stripDead,
  expandSuperops, decodeJumpTargets, canonicalize, hasMaxOps, JUMP_ARG,
};
