// hey yall :3 (jesus loves u)
'use strict';

const { E, render, isIdent } = require('./luaemit.js');
const { decode, buildCFG, relinearize, dropRedundantJumps } = require('./cfg.js');
const { rewrite, stripDead, expandSuperops, decodeJumpTargets, ctxLoadsByShape } = require('./canon.js');
const { toWorking, simplify } = require('./collapse.js');
const { structure } = require('./structure.js');
const { resugar, nameCensus, isLocalName } = require('./resugar.js');
const { ARGCNT } = require('./vmspec.js');

const MAX_CLOSURES = 512;
const MAX_DEPTH = 6;

function remapOps(code, shufMap) {
  const out = [];
  const ctxPositions = [];
  let w = 0, p = 0;
  while (p < code.length) {
    const sOp = code[p++];
    const base = shufMap[sOp];
    if (base === undefined) throw new Error('lift2: proto op ' + sOp + ' not in map');
    if (base === 67) ctxPositions.push(w);
    const argc = ARGCNT[base] || 0;
    out.push(base);
    for (let k = 0; k < argc; k++) out.push(code[p + k]);
    p += argc;
    w += 1 + argc;
  }
  return { remapped: out, ctxPositions };
}

function makeNamer() {
  let n = 0;
  return (prefix) => prefix + (n++);
}

function resolveCtx(code, bits) {
  let seen = false;
  for (let i = 0; i < code.length; i++) if (code[i] === 67) { seen = true; break; }
  if (!seen) return code;
  if (!bits) return null;
  let missing = false;
  const out = rewrite(code, (op, args, pos) => {
    if (op !== 67) return null;
    const b = bits.get(pos);
    if (b === undefined) { missing = true; return null; }
    return [b === 0 ? 5 : 4, args[0]];
  });
  return missing ? null : out;
}

function bitsByOffset(code, bits) {
  if (!bits) return null;
  const m = new Map();
  let i = 0, w = 0;
  while (i < code.length) {
    if (bits.has(w)) m.set(i, bits.get(w));
    const op = code[i];
    i += 1 + (ARGCNT[op] || 0);
    w++;
  }
  return m;
}

function canonChunk(code, jumpKey, bits, nK) {
  let c = code;
  if (jumpKey) c = decodeJumpTargets(c, jumpKey);
  let r = resolveCtx(c, bitsByOffset(c, bits));
  if (r === null) {
    r = ctxLoadsByShape(c, nK);
    if (r === null) throw new Error('lift2: CTX_LOAD could not be resolved');
  }
  c = stripDead(r);
  c = expandSuperops(c);
  return c;
}

function straighten(code) {
  const dec = decode(code);
  if (!dec) throw new Error('lift2: bytecode did not decode');
  const cfg = buildCFG(dec);
  const lin = relinearize(cfg);
  return dropRedundantJumps(lin);
}

function liftBody(code, env) {
  const canon = canonChunk(code, env.jumpKey, env.bits, env.K.length);
  const straight = straighten(canon);
  const dec = decode(straight);
  if (!dec) throw new Error('lift2: canonical bytecode did not decode');
  const cfg = buildCFG(dec);
  const blocks = simplify(toWorking(cfg));

  const slots = new Map();
  for (let s = 0; s < env.nParams; s++) slots.set(s, 'p' + s);
  const ctx = {
    K: env.K,
    fresh: env.fresh,
    slotName(slot) {
      let n = slots.get(slot);
      if (n === undefined) { n = env.fresh('v'); slots.set(slot, n); }
      return n;
    },
    upName(i) {
      const n = env.upNames[i];
      if (n === undefined) throw new Error('lift2: upvalue ' + i + ' has no binding');
      return n;
    },

    globalRead(name) {
      if (isIdent(name) && !isLocalName(name)) return E.name(name);
      return E.index(E.name('_G'), E.str(name));
    },
    closure(pi) { return env.closure(pi, ctx); },
    onClose: null,
  };

  const stmts = structure(blocks, ctx);
  const body = resugar(stmts, ctx);

  const cen = nameCensus(body);
  const bound = new Set();
  for (let s = 0; s < env.nParams; s++) bound.add('p' + s);
  collectBound(body, bound);
  const decl = [];
  for (const n of slots.values()) {
    if (bound.has(n) || decl.includes(n)) continue;
    if (cen.reads.has(n) || cen.writes.has(n)) decl.push(n);
  }

  return decl.length ? [{ k: 'local', names: decl, values: [] }].concat(body) : body;
}

function collectBound(list, acc) {
  for (const s of list) {
    if (s.k === 'local') for (const n of s.names) acc.add(n);
    if (s.k === 'localfunc') acc.add(s.name);
    if (s.k === 'if') {
      for (const c of s.clauses) collectBound(c.body, acc);
      if (s.orelse) collectBound(s.orelse, acc);
    } else if (s.body) collectBound(s.body, acc);
  }
  return acc;
}

function liftProgram(inv) {
  const strings = inv.K.filter(v => typeof v === 'string');
  const collectStrings = (list) => {
    for (const P of list || []) {
      if (P.K) for (const s of P.K) if (typeof s === 'string') strings.push(s);
      if (P.P) collectStrings(P.P);
    }
  };
  collectStrings(inv.protos);

  const fresh = makeNamer();
  let closures = 0;

  const ctxBitsFor = (positions) => {
    if (!positions || !positions.length) return null;
    if (inv.ctxInit !== null && inv.ctxInit !== undefined) {
      const m = new Map();
      for (const w of positions) m.set(w, ctxBitAt(inv.ctxInit, inv.ctxPrime, w));
      return m;
    }
    if (inv.ctxConst !== null && inv.ctxConst !== undefined) {
      return new Map(positions.map(w => [w, inv.ctxConst]));
    }
    return null;
  };

  function liftClosure(scope, pi, depth) {
    if (++closures > MAX_CLOSURES) throw new Error('lift2: too many closures');
    if (depth > MAX_DEPTH) throw new Error('lift2: proto nesting deeper than ' + MAX_DEPTH);
    const P = (scope.protos || [])[pi - 1];
    if (!P) throw new Error('lift2: CLOSURE ' + pi + ' has no proto');

    const K = P.K || scope.K;
    let code = P.C || [];
    let bits = inv.ctxBits;
    if (inv.shufMap) {
      const rm = remapOps(code, inv.shufMap);
      code = rm.remapped;
      bits = ctxBitsFor(rm.ctxPositions);
    }

    const upNames = [];
    (P.U || []).forEach((spec, k) => {
      const kind = Array.isArray(spec) ? spec[0] : spec;
      const idx = Array.isArray(spec) ? spec[1] : spec;
      upNames[k] = kind === 1 ? scope.ctx.slotName(idx) : scope.ctx.upName(idx);
    });

    const nParams = P.nParams || 0;
    const env = {
      K, jumpKey: inv.jumpKey, bits, nParams, fresh, upNames,
      closure: (childPi, childCtx) =>
        liftClosure({ protos: P.P || [], K, ctx: childCtx }, childPi, depth + 1),
    };
    const body = liftBody(code, env);
    const params = [];
    for (let s = 0; s < nParams; s++) params.push('p' + s);

    return E.func(params, true, body);
  }

  try {
    const env = {
      K: inv.K, jumpKey: inv.jumpKey, bits: inv.ctxBits, nParams: 0, fresh, upNames: [],
      closure: (pi, ctx) => liftClosure({ protos: inv.protos || [], K: inv.K, ctx }, pi, 1),
    };
    const body = liftBody(inv.code, env);
    return { out: render(body), bad: null, strings };
  } catch (e) {
    return { out: '', bad: String((e && e.message) || e), strings };
  }
}

function ctxBitAt(init, prime, pos) {
  const m = Math.imul(pos + 1, prime) >>> 0;
  return (((init ^ m) >>> 0) >>> 16) & 1;
}

module.exports = { liftProgram, liftBody, canonChunk, straighten, collectBound, makeNamer, ctxBitAt, remapOps };
