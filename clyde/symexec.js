// hey yall :3 (jesus loves u)
'use strict';

const { E, isIdent } = require('./luaemit.js');
const { OPNAME } = require('./vmspec.js');

const BIN = {
  9: '+', 10: '-', 11: '*', 12: '/', 13: '%', 14: '^', 15: '..',
  16: '==', 17: '~=', 18: '<', 19: '<=', 20: '>', 21: '>=', 48: '//',
};

function isSafe(e) {
  if (!e) return false;
  switch (e.k) {
    case 'nil': case 'bool': case 'num': case 'str': case 'vararg': return true;
    case 'paren': return isSafe(e.e);
    case 'bin': return isSafe(e.a) && isSafe(e.b);
    case 'un': return isSafe(e.a);
    case 'name': return e.tmp === true;
    default: return false;
  }
}

function scan(e, acc) {
  if (!e || typeof e !== 'object') return acc;
  switch (e.k) {
    case 'name': acc.names.add(e.n); break;
    case 'index': acc.index = true; scan(e.o, acc); scan(e.i, acc); break;
    case 'call': acc.call = true; scan(e.f, acc); e.args.forEach(x => scan(x, acc)); break;
    case 'method': acc.call = true; scan(e.o, acc); e.args.forEach(x => scan(x, acc)); break;
    case 'bin': scan(e.a, acc); scan(e.b, acc); break;
    case 'un': scan(e.a, acc); break;
    case 'paren': scan(e.e, acc); break;
    case 'table': for (const it of e.items) { if (it.key) scan(it.key, acc); scan(it.value, acc); } break;
    case 'func': case 'raw': acc.call = true; break;
    default: break;
  }
  return acc;
}

function info(e) { return scan(e, { names: new Set(), index: false, call: false }); }

function writesOf(s) {
  const w = { names: new Set(), index: false, call: false };
  const rd = (e) => { if (info(e).call) w.call = true; };
  switch (s.k) {
    case 'assign':
      for (const t of s.targets) { if (t.k === 'name') w.names.add(t.n); else { w.index = true; rd(t); } }
      (s.values || []).forEach(rd);
      break;
    case 'local':
      for (const n of s.names) w.names.add(n);
      (s.values || []).forEach(rd);
      break;
    case 'callstat': w.call = true; break;
    case 'close': break;
    case 'iterprep': for (const n of s.names) w.names.add(n); break;
    default: w.call = true; w.index = true; break;
  }
  return w;
}

function overlaps(a, b) { for (const x of a) if (b.has(x)) return true; return false; }

function kexpr(K, i) {
  if (i === undefined || i === null) throw new Error('symexec: missing constant index');
  if (i < 0 || i >= K.length) throw new Error('symexec: constant index ' + i + ' out of range (' + K.length + ')');
  const v = K[i];
  if (v === null || v === undefined) return E.nil();
  if (typeof v === 'string') return E.str(v);
  if (typeof v === 'number') return E.num(v);
  if (typeof v === 'boolean') return E.bool(v);
  throw new Error('symexec: unsupported constant type ' + typeof v);
}

function kname(K, i) {
  const e = kexpr(K, i);
  if (e.k !== 'str') throw new Error('symexec: name constant is not a string');
  return e.v;
}

function execBlock(instrs, ctx, pure) {
  const st = [];
  const marks = [];
  const stmts = [];
  let cond = null;
  const K = ctx.K;

  const V = (e) => ({ e, safe: isSafe(e), multi: false, self: null });
  const MV = (e) => ({ e, safe: false, multi: true, self: null });
  const TMP = (n) => ({ e: { k: 'name', n, tmp: true }, safe: true, multi: false, self: null });
  const pop = () => { if (!st.length) throw new Error('symexec: stack underflow'); return st.pop(); };

  const one = (v) => {
    if (v.self) throw new Error('symexec: method receiver used as a value');
    return v.multi ? E.paren(v.e) : v.e;
  };

  function tmpFor(e) {
    const n = ctx.fresh('t');
    stmts.push({ k: 'local', names: [n], values: [e] });
    return TMP(n);
  }

  function spillAt(i) {
    const v = st[i];
    if (v.self) { if (!v.self.obj.safe) v.self.obj = tmpFor(v.self.obj.e); return; }
    if (v.multi) throw new Error('symexec: a multi-value crossed a statement boundary');
    st[i] = tmpFor(v.e);
  }

  function emit(s) {
    if (pure) throw new Error('symexec: side effect inside an and/or operand');
    const w = writesOf(s);
    for (let i = 0; i < st.length; i++) {
      const v = st[i];
      if (!v.self && v.safe) continue;
      const r = info(v.self ? v.self.obj.e : v.e);
      if (r.call || w.call || (w.index && r.index) || overlaps(r.names, w.names)) spillAt(i);
    }
    stmts.push(s);
  }

  function callAt(nargs) {
    let need = nargs + 1;
    let i = st.length;
    while (i > 0 && need > 0) { i--; need -= st[i].self ? 2 : 1; }

    if (need !== 0) {
      throw new Error('symexec: malformed call (nargs=' + nargs + ', depth=' + st.length + ')');
    }
    const taken = st.splice(i);
    const head = taken[0];
    if (head.self) return { f: null, args: taken.slice(1), self: head.self };
    return { f: head, args: taken.slice(1), self: null };
  }

  function mkCall(c, multi) {
    const args = c.args.map((v, i) => (v.multi && i === c.args.length - 1 ? v.e : one(v)));
    if (!c.self) return E.call(one(c.f), args, multi);
    if (isIdent(c.self.name)) return E.method(one(c.self.obj), c.self.name, args, multi);
    if (!c.self.obj.safe) c.self.obj = tmpFor(c.self.obj.e);
    return E.call(E.index(c.self.obj.e, E.str(c.self.name)), [c.self.obj.e].concat(args), multi);
  }

  function pushResults(call, nres) {
    if (nres < 0) { st.push(MV(call)); return; }
    if (nres === 0) { emit({ k: 'callstat', call }); return; }
    if (nres === 1) { st.push(V(call)); return; }
    const names = [];
    for (let i = 0; i < nres; i++) names.push(ctx.fresh('t'));
    emit({ k: 'local', names, values: [call] });
    for (const n of names) st.push(TMP(n));
  }

  for (let idx = 0; idx < instrs.length; idx++) {
    const ins = instrs[idx];
    const a = ins.args || [];

    if (ins.op === 36 && idx + 3 < instrs.length && instrs[idx + 1].op === 4
        && instrs[idx + 2].op === 28 && instrs[idx + 3].op === 51) {
      st.push({ e: null, safe: false, multi: false, self: { obj: pop(), name: kname(K, instrs[idx + 1].args[0]) } });
      idx += 3;
      continue;
    }
    switch (ins.op) {
      case -1: {
        const left = pop();
        st.push(V(E.bin(ins.logic, one(left), one(evalSub(ins.sub, ctx)))));
        break;
      }
      case 0: break;
      case 1: st.push(V(E.nil())); break;
      case 2: st.push(V(E.bool(true))); break;
      case 3: st.push(V(E.bool(false))); break;
      case 4: st.push(V(kexpr(K, a[0]))); break;
      case 5: st.push(V(E.name(ctx.slotName(a[0])))); break;
      case 6: emit({ k: 'assign', targets: [E.name(ctx.slotName(a[0]))], values: [one(pop())] }); break;
      case 7: st.push(V(ctx.globalRead(kname(K, a[0])))); break;
      case 8: emit({ k: 'assign', targets: [ctx.globalRead(kname(K, a[0]))], values: [one(pop())] }); break;
      case 22: case 23: {
        for (let i = st.length - 2; i < st.length; i++) if (i >= 0 && !st[i].safe) spillAt(i);
        const b = pop(), x = pop();
        st.push(V(E.bin(ins.op === 22 ? 'and' : 'or', one(x), one(b))));
        break;
      }
      case 24: st.push(V(E.un('not', one(pop())))); break;
      case 25: st.push(V(E.un('-', one(pop())))); break;
      case 26: st.push(V(E.un('#', one(pop())))); break;
      case 27: st.push({ e: E.table([]), safe: false, multi: false, self: null }); break;
      case 28: { const k = pop(), t = pop(); st.push(V(E.index(one(t), one(k)))); break; }
      case 29: { const v = pop(), k = pop(), t = pop(); emit({ k: 'assign', targets: [E.index(one(t), one(k))], values: [one(v)] }); break; }
      case 30: pushResults(mkCall(callAt(a[0]), false), 1); break;
      case 39: { const c = callAt(a[0]); pushResults(mkCall(c, a[1] !== 1), a[1]); break; }
      case 41: { const c = callAt(a[0]); st.length = 0; emit({ k: 'return', values: [mkCall(c, true)] }); break; }
      case 31: {
        const n = a[0];
        let vs;
        if (n === 0) vs = [];
        else if (n > 0) {
          if (n > st.length) throw new Error('symexec: RETURN ' + n + ' with depth ' + st.length);
          vs = st.splice(st.length - n, n);
        } else vs = st.splice(0);
        st.length = 0;
        emit({ k: 'return', values: vs.map((v, i) => (v.multi && i === vs.length - 1 ? v.e : one(v))) });
        break;
      }
      case 32: break;
      case 33:
        if (idx !== instrs.length - 1) throw new Error('symexec: JMP_F is not the last instruction of its block');
        cond = one(pop());
        break;
      case 34: {
        const n = a[0];
        if (n > st.length) throw new Error('symexec: POP ' + n + ' with depth ' + st.length);
        const vs = st.splice(st.length - n, n);
        for (const v of vs) {
          if (v.self) throw new Error('symexec: POP of a method receiver');

          if (v.e.k === 'call' || v.e.k === 'method') emit({ k: 'callstat', call: v.e });
          else if (info(v.e).call) emit({ k: 'local', names: [ctx.fresh('t')], values: [v.e] });
        }
        break;
      }
      case 35: st.push(V(ctx.closure(a[0]))); break;
      case 36: {
        const i = st.length - 1;
        if (i < 0) throw new Error('symexec: DUP on an empty stack');
        if (st[i].self) throw new Error('symexec: DUP of a method receiver');
        if (!st[i].safe) spillAt(i);
        st.push({ e: st[i].e, safe: true, multi: false, self: null });
        break;
      }
      case 37: st.push(V(E.name(ctx.upName(a[0])))); break;
      case 38: emit({ k: 'assign', targets: [E.name(ctx.upName(a[0]))], values: [one(pop())] }); break;
      case 40: {
        const n = a[0];
        if (n < 0) { st.push(MV(E.vararg())); break; }
        if (n === 0) break;
        if (n === 1) { st.push(V(E.paren(E.vararg()))); break; }
        const names = [];
        for (let i = 0; i < n; i++) names.push(ctx.fresh('t'));
        emit({ k: 'local', names, values: [E.vararg()] });
        for (const nm of names) st.push(TMP(nm));
        break;
      }
      case 44: {
        const n = a[0];
        if (n < 1 || n > st.length) throw new Error('symexec: CONCAT_MULTI ' + n + ' with depth ' + st.length);
        const vs = st.splice(st.length - n, n);
        const ts = vs.map(v => E.call(E.name('tostring'), [one(v)], false));
        let e = ts[0];
        for (let i = 1; i < ts.length; i++) e = E.bin('..', e, ts[i]);
        st.push(V(e));
        break;
      }
      case 45: for (let i = 0; i < a[0]; i++) st.push(V(E.nil())); break;
      case 46: marks.push(st.length); break;
      case 47: {
        if (!marks.length) throw new Error('symexec: CALL_DYNAMIC without a MARK');
        const base = marks.pop();
        const vs = st.splice(base);
        if (!vs.length) throw new Error('symexec: CALL_DYNAMIC with no callee');
        const c = vs[0].self ? { f: null, args: vs.slice(1), self: vs[0].self }
                             : { f: vs[0], args: vs.slice(1), self: null };
        pushResults(mkCall(c, a[0] !== 1), a[0]);
        break;
      }
      case 49:
        if (pure) throw new Error('symexec: CLOSE_UPVAL inside an and/or operand');
        if (ctx.onClose) ctx.onClose(a[0]);

        stmts.push({ k: 'close', slots: [a[0]], names: [ctx.slotName(a[0])] });
        break;
      case 50: {
        if (!marks.length) throw new Error('symexec: SETLIST without a MARK');
        const base = marks.pop();
        const vs = st.splice(base);
        const ti = st.length - 1;
        if (ti < 0) throw new Error('symexec: SETLIST with no table');
        if (!st[ti].safe) spillAt(ti);
        const tbl = st[ti].e;
        for (let i = 0; i < vs.length; i++) {
          const v = vs[i];
          if (v.self) throw new Error('symexec: SETLIST of a method receiver');
          if (v.multi) {
            if (i !== vs.length - 1) throw new Error('symexec: SETLIST multi-value is not last');
            const pk = ctx.fresh('t');
            emit({ k: 'local', names: [pk], values: [E.call(E.index(E.name('table'), E.str('pack')), [v.e], false)] });
            emit({ k: 'callstat', call: E.call(E.index(E.name('table'), E.str('move')),
              [E.name(pk), E.num(1), E.index(E.name(pk), E.str('n')), E.num(a[0] + i), tbl], false) });
          } else {
            emit({ k: 'assign', targets: [E.index(tbl, E.num(a[0] + i))], values: [one(v)] });
          }
        }
        break;
      }

      case 51: {
        if (st.length < 2) throw new Error('symexec: SWAP with depth ' + st.length);
        const t = st[st.length - 1];
        st[st.length - 1] = st[st.length - 2];
        st[st.length - 2] = t;
        break;
      }
      case 52: {
        const o = pop();
        st.push({ e: null, safe: false, multi: false, self: { obj: o, name: kname(K, a[0]) } });
        break;
      }
      case 56:
        emit({ k: 'iterprep', slots: [a[0], a[1], a[2]],
               names: [ctx.slotName(a[0]), ctx.slotName(a[1]), ctx.slotName(a[2])] });
        break;

      case 42: case 43: case 53: case 54: case 55:
        throw new Error('symexec: ' + (OPNAME[ins.op] || ins.op) + ' is not emitted by this compiler');
      default: {
        const bop = BIN[ins.op];
        if (bop) { const b = pop(), x = pop(); st.push(V(E.bin(bop, one(x), one(b)))); break; }
        throw new Error('symexec: unhandled op ' + ins.op + ' (' + (OPNAME[ins.op] || '?') + ')');
      }
    }
  }
  if (marks.length) throw new Error('symexec: ' + marks.length + ' unclosed MARK(s)');
  return { stmts, stack: st, cond };
}

function evalSub(sub, ctx) {
  const r = execBlock(sub, ctx, true);
  if (r.stmts.length) throw new Error('symexec: and/or operand emitted a statement');
  if (r.stack.length !== 1) throw new Error('symexec: and/or operand left ' + r.stack.length + ' values');
  return r.stack[0];
}

module.exports = { isSafe, info, writesOf, overlaps, kexpr, kname, BIN, execBlock, evalSub };
