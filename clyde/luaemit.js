// hey yall :3 (jesus loves u)
'use strict';

const PREC = {
  or: 1, and: 2,
  '<': 3, '>': 3, '<=': 3, '>=': 3, '~=': 3, '==': 3,
  '..': 5,
  '+': 6, '-': 6,
  '*': 7, '/': 7, '//': 7, '%': 7,
  unary: 8,
  '^': 10,
};
const RIGHT_ASSOC = new Set(['..', '^']);

const KEYWORDS = new Set(['and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
  'function', 'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return',
  'then', 'true', 'until', 'while', 'continue', 'export', 'type']);

function isIdent(s) {
  return typeof s === 'string' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(s) && !KEYWORDS.has(s);
}

function numLit(v) {
  if (!Number.isFinite(v)) return v > 0 ? '(1/0)' : (v < 0 ? '(-1/0)' : '(0/0)');
  if (Number.isInteger(v)) return String(v);
  const s = String(v);
  return s;
}

function strLit(s) {
  let out = '"';
  for (let i = 0; i < s.length; i++) {
    const c = s[i], k = s.charCodeAt(i);
    if (c === '"') out += '\\"';
    else if (c === '\\') out += '\\\\';
    else if (c === '\n') out += '\\n';
    else if (c === '\r') out += '\\r';
    else if (c === '\t') out += '\\t';
    else if (k < 32 || k === 127) out += '\\' + k;
    else if (k > 255) out += '\\u{' + k.toString(16) + '}';
    else out += c;
  }
  return out + '"';
}

const E = {
  nil: () => ({ k: 'nil' }),
  bool: (v) => ({ k: 'bool', v }),
  num: (v) => ({ k: 'num', v }),
  str: (v) => ({ k: 'str', v }),
  name: (n) => ({ k: 'name', n }),
  vararg: () => ({ k: 'vararg' }),
  bin: (op, a, b) => ({ k: 'bin', op, a, b }),
  un: (op, a) => ({ k: 'un', op, a }),
  index: (o, i) => ({ k: 'index', o, i }),
  call: (f, args, multi) => ({ k: 'call', f, args, multi: !!multi }),
  method: (o, name, args, multi) => ({ k: 'method', o, name, args, multi: !!multi }),
  table: (items) => ({ k: 'table', items }),
  func: (params, isVararg, body, name) => ({ k: 'func', params, isVararg, body, name }),
  paren: (e) => ({ k: 'paren', e }),
  raw: (s, prec) => ({ k: 'raw', s, prec: prec === undefined ? 99 : prec }),
};

function precOf(e) {
  switch (e.k) {
    case 'bin': return PREC[e.op] || 0;
    case 'un': return PREC.unary;
    case 'raw': return e.prec;
    default: return 99;
  }
}

function expr(e, d) {
  d = d || 0;
  switch (e.k) {
    case 'nil': return 'nil';
    case 'bool': return e.v ? 'true' : 'false';
    case 'num': return numLit(e.v);
    case 'str': return strLit(e.v);
    case 'name': return e.n;
    case 'vararg': return '...';
    case 'raw': return e.s;
    case 'paren': return '(' + expr(e.e, d) + ')';
    case 'bin': {
      const p = PREC[e.op] || 0;
      const ra = RIGHT_ASSOC.has(e.op);
      let a = expr(e.a, d), b = expr(e.b, d);
      if (precOf(e.a) < p || (precOf(e.a) === p && ra)) a = '(' + a + ')';
      if (precOf(e.b) < p || (precOf(e.b) === p && !ra)) b = '(' + b + ')';
      const sp = /^[A-Za-z]/.test(e.op) ? ' ' : (e.op === '..' ? ' ' : ' ');
      return a + sp + e.op + sp + b;
    }
    case 'un': {
      let a = expr(e.a, d);
      if (precOf(e.a) < PREC.unary) a = '(' + a + ')';
      const sp = e.op === 'not' ? ' ' : '';

      if (e.op === '-' && /^[-]/.test(a)) a = '(' + a + ')';
      return e.op + sp + a;
    }
    case 'index': {
      let o = expr(e.o, d);
      if (needParen(e.o)) o = '(' + o + ')';
      if (e.i.k === 'str' && isIdent(e.i.v)) return o + '.' + e.i.v;
      return o + '[' + expr(e.i, d) + ']';
    }
    case 'call': {
      let f = expr(e.f, d);
      if (needParen(e.f)) f = '(' + f + ')';
      return f + '(' + e.args.map(x => expr(x, d)).join(', ') + ')';
    }
    case 'method': {
      let o = expr(e.o, d);
      if (needParen(e.o)) o = '(' + o + ')';
      return o + ':' + e.name + '(' + e.args.map(x => expr(x, d)).join(', ') + ')';
    }
    case 'table': {
      if (!e.items.length) return '{}';
      const parts = e.items.map(it => {
        if (it.key === undefined || it.key === null) return expr(it.value, d);
        if (it.key.k === 'str' && isIdent(it.key.v)) return it.key.v + ' = ' + expr(it.value, d);
        return '[' + expr(it.key, d) + '] = ' + expr(it.value, d);
      });
      const oneLine = '{ ' + parts.join(', ') + ' }';
      return oneLine;
    }
    case 'func': {
      const head = 'function(' + e.params.concat(e.isVararg ? ['...'] : []).join(', ') + ')';
      if (!e.body.length) return head + ' end';
      return head + '\n' + block(e.body, d + 1) + '\n' + pad(d) + 'end';
    }
    default:
      return '--[[?' + e.k + ']]nil';
  }
}

function needParen(e) {
  return !(e.k === 'name' || e.k === 'index' || e.k === 'call' || e.k === 'method' || e.k === 'paren' || e.k === 'raw');
}

const IND = '  ';

function block(stmts, depth) {
  const out = [];
  for (const s of stmts) out.push(stmt(s, depth));
  return out.filter(x => x !== null && x !== '').join('\n');
}

function pad(d) { return IND.repeat(d); }

function stmt(s, d) {
  const p = pad(d);
  const ex = (e) => expr(e, d);
  switch (s.k) {
    case 'local': {
      const names = s.names.join(', ');
      if (!s.values || !s.values.length) return p + 'local ' + names;
      return p + 'local ' + names + ' = ' + s.values.map(ex).join(', ');
    }
    case 'assign':
      return p + s.targets.map(ex).join(', ') + ' = ' + s.values.map(ex).join(', ');
    case 'callstat':
      return p + ex(s.call);
    case 'return':
      return p + 'return' + (s.values && s.values.length ? ' ' + s.values.map(ex).join(', ') : '');
    case 'break': return p + 'break';
    case 'continue': return p + 'continue';
    case 'goto': return p + 'goto ' + s.label;
    case 'label': return pad(Math.max(0, d - 1)) + '::' + s.label + '::';
    case 'do':
      return p + 'do\n' + block(s.body, d + 1) + '\n' + p + 'end';
    case 'while':
      return p + 'while ' + ex(s.cond) + ' do\n' + block(s.body, d + 1) + '\n' + p + 'end';
    case 'repeat':
      return p + 'repeat\n' + block(s.body, d + 1) + '\n' + p + 'until ' + ex(s.cond);
    case 'fornum': {
      const step = s.step ? ', ' + ex(s.step) : '';
      return p + 'for ' + s.var + ' = ' + ex(s.start) + ', ' + ex(s.limit) + step + ' do\n'
        + block(s.body, d + 1) + '\n' + p + 'end';
    }
    case 'forin':
      return p + 'for ' + s.vars.join(', ') + ' in ' + s.iters.map(ex).join(', ') + ' do\n'
        + block(s.body, d + 1) + '\n' + p + 'end';
    case 'if': {
      let out = p + 'if ' + ex(s.clauses[0].cond) + ' then\n' + block(s.clauses[0].body, d + 1);
      for (let i = 1; i < s.clauses.length; i++) {
        out += '\n' + p + 'elseif ' + ex(s.clauses[i].cond) + ' then\n' + block(s.clauses[i].body, d + 1);
      }
      if (s.orelse) out += '\n' + p + 'else\n' + block(s.orelse, d + 1);
      return out + '\n' + p + 'end';
    }
    case 'localfunc':
      return p + 'local function ' + s.name + '(' + s.params.concat(s.isVararg ? ['...'] : []).join(', ') + ')\n'
        + block(s.body, d + 1) + '\n' + p + 'end';
    case 'comment':
      return p + '-- ' + s.text;
    case 'raw':
      return p + s.text;
    default:
      return p + '-- ?' + s.k;
  }
}

function render(stmts) { return block(stmts, 0); }

module.exports = { E, expr, stmt, block, render, isIdent, strLit, numLit, PREC, precOf };
