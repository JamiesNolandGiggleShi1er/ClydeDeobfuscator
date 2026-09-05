// hey yall :3 (jesus loves u)
'use strict';

const lift2 = require('./clyde/lift2.js');

const STACK_OP = {
  0:'NOP',1:'PUSH_NIL',2:'PUSH_TRUE',3:'PUSH_FALSE',4:'PUSH_K',5:'LOAD_L',
  6:'STORE_L',7:'LOAD_G',8:'STORE_G',9:'ADD',10:'SUB',11:'MUL',12:'DIV',
  13:'MOD',14:'POW',15:'CONCAT',16:'EQ',17:'NE',18:'LT',19:'LE',20:'GT',
  21:'GE',22:'AND',23:'OR',24:'NOT',25:'UNM',26:'LEN',27:'NEW_TABLE',
  28:'GET_TABLE',29:'SET_TABLE',30:'CALL',31:'RETURN',32:'JMP',33:'JMP_F',
  34:'POP',35:'CLOSURE',36:'DUP',37:'LOAD_UPVAL',38:'STORE_UPVAL',39:'CALL_MULTI',
  40:'LOAD_VARARG',41:'TAILCALL',42:'FORPREP',43:'FORLOOP',44:'CONCAT_MULTI',
  45:'PUSH_NILS',46:'MARK',47:'CALL_DYNAMIC',48:'IDIV',49:'CLOSE_UPVAL',
  50:'SETLIST',51:'SWAP',52:'NAMECALL',53:'TFOR',54:'PCALL',55:'XPCALL',56:'ITER_PREP',
 57:'SO_ADD_LLL',58:'SO_SUB_LLL',59:'SO_MUL_LLL',60:'SO_LOADK_L',61:'SO_MOVE_LL',
 62:'SO_ADD_LLK',63:'SO_CONCAT_LLL',64:'SO_TOP',65:'SO_STACKREAD',66:'SO_BXOR',67:'CTX_LOAD'
};
const DBG_SKELETON_MAP = {"":0,"$PUSH(nil)":1,"$PUSH(true)":2,"$PUSH(false)":3,"$PUSH($RESK($CODE[$IP]+1)) $IP=$IP+1":4,"$PUSH($GETL($CODE[$IP])) $IP=$IP+1":5,"$SETL($CODE[$IP],$POP()) $IP=$IP+1":6,"$PUSH($ENV[$RESK($CODE[$IP]+1)]) $IP=$IP+1":7,"$ENV[$RESK($CODE[$IP]+1)]=$POP() $IP=$IP+1":8,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return $V+$V end,\"$V\"))":9,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return $V-$V end,\"$V\"))":10,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return $V*$V end,\"$V\"))":11,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return $V/$V end,\"$V\"))":12,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return $V%$V end,\"$V\"))":13,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return $V^$V end,\"$V\"))":14,"local $V,$V=$POP(),$POP() local $V,$V=pcall(function() return $V..$V end) if $V then $PUSH($V) else $PUSH(tostring($V)..tostring($V)) end":15,"local $V,$V=$POP(),$POP() $PUSH($V==$V)":16,"local $V,$V=$POP(),$POP() $PUSH($V~=$V)":17,"local $V,$V=$POP(),$POP() $PUSH($V<$V)":18,"local $V,$V=$POP(),$POP() $PUSH($V<=$V)":19,"local $V,$V=$POP(),$POP() $PUSH($V>$V)":20,"local $V,$V=$POP(),$POP() $PUSH($V>=$V)":21,"local $V,$V=$POP(),$POP() $PUSH($V and $V)":22,"local $V,$V=$POP(),$POP() $PUSH($V or $V)":23,"$PUSH(not $POP())":24,"$PUSH(-$POP())":25,"$PUSH(#$POP())":26,"$PUSH({})":27,"local $V,$V=$POP(),$POP() $PUSH($V[$V])":28,"local $V,$V,$V=$POP(),$POP(),$POP() $V[$V]=$V":29,"local $V=$CODE[$IP] $IP=$IP+1 local $V={} for $V=1,$V do $V[$V-$V+1]=$POP() end local $V=$POP() if type($V)~=\"$V\" then local $V=$V($V,\"$V\") if $V then table.$V($V,1,$V) $V=$V+1 $V=$V else error(\"$V\"..type($V)..\"$V\") end end local $V if $V==0 then $V={$V()} else $V={$V(table.unpack($V,1,$V))} end $PUSH($V[1])":30,"local $V=$CODE[$IP] $IP=$IP+1 $V=true if $V==0 then $V=0 elseif $V>0 then if $V>$TOP then $V=$TOP end $V=$V $V=true $V=$TOP $V=$TOP-$V else $V=$TOP $V=true $V=$TOP $V=0 end":31,"$IP=$CODE[$IP]+1":32,"local $V=$CODE[$IP] $IP=$IP+1 if not $POP() then $IP=$V+1 end":33,"local $V=$CODE[$IP] $IP=$IP+1 for $V=1,$V do $POP() end":34,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$V[$V] if $V then local $V,$V,$V=$V,$V.$V or $V,$V.$V or {} local $V={} if $V.$V then for $V,$V in ipairs($V.$V) do local $V,$V=$V[1],$V[2] if $V==1 then $V[$V]=$V($V) else $V[$V]=$V[$V+1] end end end local $V=$V.$V or 0 $PUSH(function(...) local $V={...} local $V=select(\"$V\",...) local $V={} $V.$V=$V for $V=1,($V<$V and $V or $V) do $V[$V-1]=$V[$V] end local $V={} if $V>$V then for $V=$V+1,$V do $V[$V-$V]=$V[$V] end end $V.$V=$V-$V return $V($V,$V,$ENV,$V.$V or {},$V,$V,$V) end) else $PUSH(nil) end":35,"$PUSH($V())":36,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$V[$V+1] $PUSH($V and $V[1] or nil)":37,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$V[$V+1] if $V then $V[1]=$POP() else $POP() end":38,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V={} for $V=1,$V do $V[$V-$V+1]=$POP() end local $V=$POP() if type($V)~=\"$V\" then local $V=$V($V,\"$V\") if $V then table.$V($V,1,$V) $V=$V+1 $V=$V else error(\"$V\"..type($V)..\"$V\") end end local $V if $V==0 then $V=table.$V($V()) else $V=table.$V($V(table.unpack($V,1,$V))) end local $V=$V<0 and $V.$V or $V for $V=1,$V do $PUSH($V[$V]) end":39,"local $V=$CODE[$IP] $IP=$IP+1 if $V<0 then for $V=1,$V do $PUSH($V[$V]) end else for $V=1,$V do $PUSH($V[$V]) end end":40,"local $V=$CODE[$IP] $IP=$IP+1 local $V={} for $V=$V,1,-1 do $V[$V]=$POP() end local $V=$POP() if type($V)~=\"$V\" then local $V=$V($V,\"$V\") if $V then table.$V($V,1,$V) $V=$V+1 $V=$V end end $V=true $V=table.$V($V(table.unpack($V,1,$V)))":41,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$POP() local $V=$POP() local $V=$POP() $PUSH($V) $PUSH($V) $PUSH($V) if $V>=0 then if $V>$V then $IP=$V+1 end else if $V<$V then $IP=$V+1 end end":42,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$ST[$TOP] local $V=$ST[$TOP-2]+$V $ST[$TOP-2]=$V local $V=$ST[$TOP-1] if $V>=0 then if $V<=$V then $IP=$V+1 end else if $V>=$V then $IP=$V+1 end end":43,"local $V=$CODE[$IP] $IP=$IP+1 local $V={} for $V=1,$V do $V[$V-$V+1]=tostring($POP()) end $PUSH(table.$V($V))":44,"local $V=$CODE[$IP] $IP=$IP+1 for $V=1,$V do $PUSH(nil) end":45,"$V=$V+1 $V[$V]=$TOP":46,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$V[$V] $V=$V-1 local $V=$ST[$V+1] local $V=$TOP-$V-1 local $V={} for $V=1,$V do $V[$V]=$ST[$V+1+$V] end $TOP=$V if type($V)~=\"$V\" then local $V=$V($V,\"$V\") if $V then table.$V($V,1,$V) $V=$V+1 $V=$V else error(\"$V\"..type($V)..\"$V\") end end local $V if $V==0 then $V=table.$V($V()) else $V=table.$V($V(table.unpack($V,1,$V))) end local $V=$V<0 and $V.$V or $V for $V=1,$V do $PUSH($V[$V]) end":47,"local $V,$V=$POP(),$POP() $PUSH($V($V,$V,function($V,$V) return math.$V($V/$V) end,\"$V\"))":48,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$BX[$V] if $V then $LC[$V]=$V[1] $BX[$V]=nil end":49,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$V[$V] $V=$V-1 local $V=$ST[$V] local $V=$V for $V=$V+1,$TOP do $V[$V]=$ST[$V] $V=$V+1 end $TOP=$V $ST[$TOP]=$V":50,"local $V=$ST[$TOP] $ST[$TOP]=$ST[$TOP-1] $ST[$TOP-1]=$V":51,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$RESK($V+1) local $V=$POP() local $V=$V[$V] $PUSH($V) $PUSH($V) local $V,$V=$POP(),$POP() $PUSH($V) $PUSH($V)":52,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$ST[$TOP-2] local $V=$ST[$TOP-1] local $V=$ST[$TOP] local $V={$V($V,$V)} for $V=1,$V do $PUSH($V[$V]) end if $V[1]~=nil then $ST[$TOP-$V]= $V[1] else $IP=$V+1 end":53,"local $V=$CODE[$IP] $IP=$IP+1 local $V={} for $V=1,$V do $V[$V-$V+1]=$POP() end local $V=$POP() local $V if $V==0 then $V=table.$V(pcall($V)) else $V=table.$V(pcall($V,table.unpack($V,1,$V))) end local $V=$V[1] $PUSH($V) if $V then for $V=2,$V.$V do $PUSH($V[$V]) end else $PUSH($V[2]) end":54,"local $V=$CODE[$IP] $IP=$IP+1 local $V={} for $V=1,$V do $V[$V-$V+1]=$POP() end local $V=$POP() local $V=$POP() local $V if $V==0 then $V=table.$V(xpcall($V,$V)) else $V=table.$V(xpcall($V,$V,table.unpack($V,1,$V))) end local $V=$V[1] $PUSH($V) for $V=2,$V.$V do $PUSH($V[$V]) end":55,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$GETL($V) if type($V)==\"$V\" then local $V,$V=pcall(getmetatable,$V) if $V and type($V)==\"$V\" and $V.$V then local $V=$V.$V($V) $SETL($V,$V) elseif $V and type($V)==\"$V\" and $V.$V then else $SETL($V,next) $SETL($V,$V) $SETL($V,nil) end end":56,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$GETL($V)+$GETL($V))":57,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$GETL($V)-$GETL($V))":58,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$GETL($V)*$GETL($V))":59,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$RESK($V+1))":60,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$GETL($V))":61,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$GETL($V)+$RESK($V+1))":62,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 $SETL($V,$GETL($V)..$GETL($V))":63,"local $V=$TOP":64,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$ST[$V] or 0":65,"local $V=$CODE[$IP] $IP=$IP+1 local $V=$CODE[$IP] $IP=$IP+1 local $V=bit32.$V($V,$V)":66,"local $V=$CODE[$IP] $IP=$IP+1 if $V==0 then $PUSH($GETL($V)) else $PUSH($RESK($V+1)) end":67};

const STACK_ARGCNT = {4:1,5:1,6:1,7:1,8:1,30:1,31:1,32:1,33:1,34:1,35:1,37:1,38:1,39:2,40:1,41:1,42:1,43:1,44:1,45:1,47:1,49:1,50:1,52:1,53:2,54:1,55:1,56:3,57:3,58:3,59:3,60:2,61:2,62:3,63:3,65:1,66:2,67:1};

const REG_OP = {0:'NOP',1:'LOADK',2:'LOADNIL',3:'LOADBOOL',4:'MOVE',5:'GETGLOBAL',6:'SETGLOBAL',7:'GETTABLE',8:'SETTABLE',9:'NEWTABLE',10:'ADD',11:'SUB',12:'MUL',13:'DIV',14:'MOD',15:'POW',16:'IDIV',17:'UNM',18:'NOT',19:'LEN',20:'CONCAT',21:'JMP',22:'EQ',23:'LT',24:'LE',25:'TEST',26:'TESTSET',27:'CALL',28:'TAILCALL',29:'RETURN',30:'FORPREP',31:'FORLOOP',32:'TFORLOOP',33:'SETLIST',34:'CLOSURE',35:'VARARG',36:'SELF',37:'GETUPVAL',38:'SETUPVAL'};

function detectClyde(content) {
  let s = 0;
  if (content.includes('clyde') || content.includes('Clyde')) s += 3;
  if (content.includes('clydeprotection')) s += 5;
  if (/local _\w+=\(""\)\["\\99\\104/.test(content)) s += 5;
  if (content.includes('https://clydeprotectionde.cloud')) s += 10;
  if (/\["\\98\\121\\116\\101"\]/.test(content)) s += 3;
  const hasBanner = /clydeprotectionde\.cloud/.test(content);
  let mode = 'direct';
  if (/local _dK=\{/.test(content) && /return _run\(_dK,_dC/.test(content)) mode = 'reg-debug';
  else if (/local function _run\(K,code/.test(content) && /handlers\[0\]=function/.test(content)) mode = 'stack-debug';
  else if (/^return\(function\(\.\.\.\)/s.test(content) || /ClydeProtection Just like VMProtect/.test(content)) mode = 'reg-vm';
  else if (hasBanner) mode = 'stack-vm';
  return { isClyde: s >= 6, score: s, mode };
}

function stripBanner(code) {
  return code.replace(/--\[\[[\s\S]*?build [A-F0-9]{8}[\s\S]*?\]\]\s*\n/, '')
    .replace(/--\[\[[\s\S]*?clydeprotectionde\.cloud[\s\S]*?\]\]\s*\n?/i, '').trim();
}

function luaLit(v) {
  if (v === null || v === undefined) return 'nil';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  return 'nil';
}

function parseLitTable(src, startIdx) {
  let i = startIdx + 1, depth = 1, cur = '', vals = [], instr = false, q = '';
  const pushCur = () => { const t = cur.trim(); if (t) vals.push(t); cur = ''; };
  while (i < src.length) {
    const ch = src[i];
    if (instr) { cur += ch; if (ch === q && src[i-1] !== '\\') instr = false; i++; continue; }
    if (ch === '"' || ch === "'") { instr = true; q = ch; cur += ch; i++; continue; }
    if (ch === '{') { depth++; cur += ch; i++; continue; }
    if (ch === '}') { depth--; if (depth === 0) { pushCur(); return { values: vals, endIdx: i }; } cur += ch; i++; continue; }
    if (ch === ',' && depth === 1) { pushCur(); i++; continue; }
    cur += ch; i++;
  }
  return null;
}

function litVal(tok) {
  const t = tok.trim();
  if (t === 'nil') return null;
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (/^-?0x[0-9a-fA-F]+$/.test(t)) return parseInt(t, 16);
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    try { return JSON.parse(t.startsWith("'") ? '"' + t.slice(1,-1).replace(/"/g,'\\"') + '"' : t); }
    catch (_) { return t.slice(1, -1); }
  }
  return undefined;
}

function decodeStrings(code) {
  let out = code, decoded = [];
  const reAssign = /(\w+)\s*=\s*(\w+)\(\{([\d,\s]+)\},\s*(\d+)\)/g;
  let m;
  while ((m = reAssign.exec(code)) !== null) {
    const bytes = m[3].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const key = parseInt(m[4]);
    let s = '', ok = bytes.length >= 1;
    for (const v of bytes) { const c = (v - key + 256) % 256; if (c < 32 && c !== 10 && c !== 13) { ok = false; break; } s += String.fromCharCode(c); }
    if (ok && /^[\x20-\x7E\r\n\t]{1,500}$/.test(s)) { decoded.push(s); out = out.split(m[0]).join(`${m[1]} = ${JSON.stringify(s)}`); }
  }
  const reCall = /(\w+)\(\{([\d,\s]+)\},\s*(\d+)\)/g;
  while ((m = reCall.exec(out)) !== null) {
    if (m[0].includes('=')) continue;
    const bytes = m[2].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (bytes.length < 2 || bytes.length > 60) continue;
    const key = parseInt(m[3]);
    let s = '', ok = true;
    for (const v of bytes) { const c = (v - key + 256) % 256; if (c < 32 && c !== 10 && c !== 13) { ok = false; break; } s += String.fromCharCode(c); }
    if (ok && /^[\x20-\x7E]{2,120}$/.test(s)) { decoded.push(s); out = out.split(m[0]).join(JSON.stringify(s)); }
  }
  return { code: out, decoded };
}

function tailTables(code) {
  const runCall = code.match(/return\s+_run\(\s*(_\w+)\s*,\s*(_\w+)/);
  if (!runCall) return null;
  const [, kVar, cVar] = runCall;
  const kDef = code.match(new RegExp(`local\\s+${kVar}\\s*=\\s*\\{`));
  const cDef = code.match(new RegExp(`local\\s+${cVar}\\s*=\\s*\\{`));
  if (!kDef || !cDef) return null;
  const kStart = code.indexOf('{', kDef.index);
  const cStart = code.indexOf('{', cDef.index);
  const kT = parseLitTable(code, kStart);
  const cT = parseLitTable(code, cStart);
  if (!kT || !cT) return null;
  const K = kT.values.map(litVal);
  const C = cT.values.map(litVal);
  if (K.some(v => v === undefined) || C.some(v => v === undefined || typeof v !== 'number')) return null;
  return { kVar, cVar, K, C };
}

function liftStackDebug(K, code) {
  const out = [];
  const stack = [];
  const locals = {};
  const pop = () => stack.pop() ?? 'nil';
  let i = 0;
  while (i < code.length) {
    const op = code[i++];
    const name = STACK_OP[op] ?? `OP_${op}`;
    const argc = STACK_ARGCNT[op] ?? 0;
    const args = code.slice(i, i + argc); i += argc;
    switch (name) {
      case 'PUSH_NIL': stack.push('nil'); break;
      case 'PUSH_TRUE': stack.push('true'); break;
      case 'PUSH_FALSE': stack.push('false'); break;
      case 'PUSH_K': stack.push(luaLit(K[args[0]])); break;
      case 'LOAD_L': stack.push(locals[args[0]] ?? `l${args[0]}`); break;
      case 'STORE_L': locals[args[0]] = pop(); break;
      case 'LOAD_G': stack.push(typeof K[args[0]] === 'string' ? K[args[0]] : luaLit(K[args[0]])); break;
      case 'STORE_G': { const v = pop(); out.push(`${K[args[0]]} = ${v};`); break; }
      case 'ADD': case 'SUB': case 'MUL': case 'DIV': case 'MOD': case 'POW': {
        const b = pop(), a = pop();
        stack.push(`(${a} ${{ADD:'+',SUB:'-',MUL:'*',DIV:'/',MOD:'%',POW:'^'}[name]} ${b})`); break;
      }
      case 'CONCAT': { const b = pop(), a = pop(); stack.push(`(${a} .. ${b})`); break; }
      case 'CALL': { const n = args[0]; const a = []; for (let k = 0; k < n; k++) a.unshift(pop()); const f = pop(); const call = `${f}(${a.join(', ')})`; out.push(call + ';'); stack.push('nil'); break; }
      case 'POP': for (let k = 0; k < args[0]; k++) pop(); break;
      case 'RETURN': {
        if (args[0] === 0) { out.push('return;'); }
        else { const a = []; for (let k = 0; k < args[0]; k++) a.unshift(pop()); out.push(`return ${a.join(', ')};`); }
        break;
      }
      case 'JMP': case 'JMP_F': out.push(`__JMP__`); break;
      case 'NOP': break;
      default:
        if (op >= 64 && op <= 66) break;
        if (op === 67) { stack.push(locals[args[0]] ?? `l${args[0]}`); break; }

        if (op === 57 || op === 58 || op === 59 || op === 63) {
          const m = { 57: '+', 58: '-', 59: '*', 63: '..' }[op];
          stack.push(`(${locals[args[1]] ?? 'l' + args[1]} ${m} ${locals[args[2]] ?? 'l' + args[2]})`);
          locals[args[0]] = stack.pop();
          break;
        }
        if (op === 60) { stack.push(luaLit(K[args[1]])); locals[args[0]] = stack.pop(); break; }
        if (op === 61) { locals[args[1]] = (locals[args[0]] ?? `l${args[0]}`); break; }
        if (op === 62) { stack.push(`(${luaLit(K[args[1]])} + ${locals[args[2]] ?? 'l' + args[2]})`); locals[args[0]] = stack.pop(); break; }
        out.push(`__UNHANDLED_${name}__`);
    }
  }
  const decls = Object.entries(locals).map(([k, v]) => `local l${k} = ${v};`);
  return [...decls, ...out].join('\n');
}

function liftUnshuffled(K, code, opMap) {
  const real = [];
  let i = 0;
  while (i < code.length) {
    const sOp = code[i++];
    const name = STACK_OP[opMap[sOp]];
    if (name === undefined) return { out: '', bad: `unknown shuffled op ${sOp}` };
    const argc = STACK_ARGCNT[opMap[sOp]] ?? 0;

    real.push(opMap[sOp], ...code.slice(i, i + argc));
    i += argc;
  }
  const via = lift2.liftProgram({
    K, code: real, shufMap: null, jumpKey: 0,
    ctxBits: null, ctxInit: null, ctxPrime: null, ctxConst: null, protos: [],
  });
  if (!via.bad) return { out: via.out, bad: null };
  if (process.env.CLYDE_NO_LEGACY) return { out: '', bad: via.bad };
  const out = liftStackDebug(K, real);
  if (out.includes('__JMP__') || out.includes('__UNHANDLED_')) {
    return { out, bad: 'control-flow or exotic ops need CFG: ' + via.bad };
  }
  return { out, bad: null };
}

function liftRegDebug(K, code) {
  const out = [];
  const R = {};
  const rk = (v) => (v >= 256 ? luaLit(K[v - 256]) : (R[v] ?? `r${v}`));
  for (let i = 0; i + 3 < code.length; i += 4) {
    const [op, A, B, C] = code.slice(i, i + 4);
    const name = REG_OP[op] ?? `OP_${op}`;
    switch (name) {
      case 'LOADK': R[A] = luaLit(K[B]); break;
      case 'LOADNIL': R[A] = 'nil'; break;
      case 'LOADBOOL': R[A] = B ? 'true' : 'false'; break;
      case 'MOVE': R[A] = rk(B); break;
      case 'GETGLOBAL': R[A] = typeof K[B] === 'string' ? K[B] : luaLit(K[B]); break;
      case 'GETTABLE': R[A] = `${rk(B)}[${rk(C)}]`; break;
      case 'NEWTABLE': R[A] = '{}'; break;
      case 'ADD': case 'SUB': case 'MUL': case 'DIV': case 'MOD': case 'POW':
        R[A] = `(${rk(B)} ${{ADD:'+',SUB:'-',MUL:'*',DIV:'/',MOD:'%',POW:'^'}[name]} ${rk(C)})`; break;
      case 'CONCAT': { const p = []; for (let r = B; r <= C; r++) p.push(rk(r)); R[A] = `(${p.join(' .. ')})`; break; }
      case 'UNM': R[A] = `(-${rk(B)})`; break;
      case 'NOT': R[A] = `(not ${rk(B)})`; break;
      case 'LEN': R[A] = `(#${rk(B)})`; break;
      case 'CALL': {
        const args = []; for (let r = A + 1; r <= A + B - 1; r++) args.push(rk(r));
        const call = `${rk(A)}(${args.join(', ')})`;
        if (C === 1) out.push(call + ';'); else if (C === 2) R[A] = call; else out.push(call + ';');
        break;
      }
      case 'RETURN':
        if (B === 1) out.push('return;');
        else if (B === 2) out.push(`return ${rk(A)};`);
        else { const a = []; for (let r = A; r < A + B - 1; r++) a.push(rk(r)); out.push(`return ${a.join(', ')};`); }
        break;
      case 'JMP': out.push(`-- jmp ${B} (structured CFG needed)`); break;
      default: out.push(`-- [${name} ${A} ${B} ${C}] (unhandled reg op)`);
    }
  }

  return out.join('\n');
}

function handlerBodies(src, tab) {
  const out = {};
  const re = new RegExp(tab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\[(\\d+)\\]=function\\(\\)', 'g');
  let m;
  while ((m = re.exec(src)) !== null) {
    const i = m.index + m[0].length;
    let depth = 1, j = i, instr = false, q = '';
    while (j < src.length) {
      const ch = src[j];
      if (instr) { if (ch === q && src[j - 1] !== '\\') instr = false; j++; continue; }
      if (ch === '"' || ch === "'") { instr = true; q = ch; j++; continue; }
      if (ch === '-' && src[j + 1] === '-') { const nl = src.indexOf('\n', j); j = nl === -1 ? src.length : nl + 1; continue; }
      const rest = src.slice(j);
      if (/^elseif\b/.test(rest)) { j += 6; continue; }
      let kw = rest.match(/^(function|if|while)\b/);
      if (kw) {
        depth++; j += kw[1].length;
        if (kw[1] === 'while') { const d = rest.slice(kw[1].length).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; }
        continue;
      }
      kw = rest.match(/^for\b/);
      if (kw) { depth++; j += 3; const d = rest.slice(3).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; continue; }
      kw = rest.match(/^do\b/);
      if (kw) { depth++; j += 2; continue; }
      const endm = rest.match(/^end\b/);
      if (endm) { depth--; j += 3; if (depth === 0) { out[m[1]] = src.slice(i, j - 3); break; } continue; }
      j++;
    }
  }
  return out;
}

const SKEL_KEEP = new Set('function,end,if,then,else,elseif,for,while,do,return,local,true,false,nil,bit32,string,table,math,pcall,getmetatable,rawget,tostring,tonumber,ipairs,type,select,unpack,error,assert,xpcall,next,pairs,break,repeat,until,in,or,and,not'.split(','));

function unshadow(body) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let from = 0;
  for (;;) {
    const re = /(^|[;\s])local ([A-Za-z_]\w*)=/g;
    re.lastIndex = from;
    const m = re.exec(body);
    if (!m) break;
    const name = m[2];
    if (!SKEL_KEEP.has(name)) { from = m.index + m[0].length; continue; }
    const initStart = m.index + m[0].length;

    let j = initStart, depth = 0, ins = false, q = '';
    while (j < body.length) {
      const ch = body[j];
      if (ins) { if (ch === q && body[j - 1] !== '\\') ins = false; j++; continue; }
      if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
      if (ch === '(' || ch === '{' || ch === '[') depth++;
      else if (ch === ')' || ch === '}' || ch === ']') { if (depth === 0) break; depth--; }
      else if (ch === ';' || ch === '\n') { if (depth === 0) break; }
      j++;
    }
    const initEnd = j;
    const namere = new RegExp(`\\b${esc(name)}\\b`, 'g');
    const head = body.slice(0, m.index + m[1].length) + 'local $V=';
    const init = body.slice(initStart, initEnd);
    const tail = body.slice(initEnd).replace(namere, '$V');
    const next = head + init + tail;
    if (next === body) break;
    body = next;
    from = 0;
  }
  return body;
}

function dunderDot(body) {
  return body.replace(/\[\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\]/g, (m, q) => {
    const inner = q.slice(1, -1).replace(/\\(\d{1,3})/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
    if (inner === '__call' || inner === '__iter') return '.' + inner;
    return m;
  });
}

function stripJumpXor(body, pureHelpers, content) {
  const out = body.replace(/(\w+)\(\s*(\w+\[\w+\])\s*,\s*(\w+)\s*\)/g, (m, fn, codeExpr, jk) => {
    if (pureHelpers[fn] !== 'bit32.bxor') return m;
    if (localNum(content, jk) === null) return m;
    return codeExpr;
  });
  return out === body ? null : out;
}
function skeletonOf(body, aliasMap) {
  let s = body;
  s = s.replace(/"([^"\\]|\\.)*"/g, '"S"');
  s = s.replace(/\b0x[0-9a-fA-F]+\b/g, 'N');
  s = s.replace(/(?<![\w])(_*[A-Za-z_][A-Za-z0-9_]*)/g, (m) => {
    if (SKEL_KEEP.has(m)) return m;
    if (aliasMap[m]) return aliasMap[m];
    return '$V';
  });
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}
const VM_ALIAS_TAGS = { push: '$PUSH', pop: '$POP', getL: '$GETL', setL: '$SETL', resK: '$RESK', code: '$CODE', ip: '$IP', htab: '$H', env: '$ENV', stack: '$ST', top: '$TOP', locals: '$LC', boxes: '$BX' };
function aliasTagMap(A) { const o = {}; for (const k of Object.keys(VM_ALIAS_TAGS)) if (A[k]) o[A[k]] = VM_ALIAS_TAGS[k]; return o; }
function vmAliases(src) {
  const A = {};
  let m;
  m = src.match(/local function (\w+)\(v\) \w+=\w+\+1/); if (m) A.push = m[1];
  if (!A.push) {
    m = src.match(/local function (\w+)\(v\) \w+=\w+\+\w+\(2,1\)/);
    if (m) A.push = m[1];
  }
  m = src.match(/local function (\w+)\(\) local v=/); if (m) A.pop = m[1];
  for (const n of [...src.matchAll(/local function (\w+)\(slot\)/g)].map(x => x[1])) {
    const i = src.indexOf(`local function ${n}(slot)`);
    const seg = src.slice(i, i + 300);
    if (/box\[1\]/.test(seg) && /return \w+\[slot\] end/.test(seg)) A.getL = n;
  }
  m = src.match(/local function (\w+)\(slot,val\)/); if (m) A.setL = m[1];
  m = src.match(/local function (\w+)\(_idx\) return \w+\[_idx\] end/); if (m) A.resK = m[1];
  if (!A.resK) {
    m = src.match(/local function (\w+)\((\w+)\) local \w+=\w+\[\2\]/);
    if (m) A.resK = m[1];
  }
  m = src.match(/local op=(\w+)\[(\w+)\][\s;]*\2=\2\+1[\s;]*local h=(\w+)\[op\]/);
  if (m) { A.code = m[1]; A.ip = m[2]; A.htab = m[3]; }
  if (!A.code) {
    m = src.match(/while true do (\w+)=\w+\(\1,(\w+)\) if \w+ or \1>#(\w+) then break end/);
    if (m) { A.ip = m[1]; A.maskVar = m[2]; A.code = m[3]; }

    m = src.match(/(\w+)\[\w+\(\d+,(\w+)\)\]=(?:function\(\)|\w+)/);
    if (m) { A.htab = m[1]; A.maskVar = A.maskVar || m[2]; }
    if (A.maskVar) {
      const mm = src.match(new RegExp(`local ${A.maskVar}=(\\d+)`));
      if (mm) A.mask = parseInt(mm[1]);
    }
  }
  if (A.push && A.resK) {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc(A.push) + '\\((\\w+)\\[' + esc(A.resK));
    m = src.match(re); if (m) A.env = m[1];
  }
  if (A.push) {
    const i = src.indexOf(`local function ${A.push}(v)`);
    const seg = src.slice(i, i + 200);
    m = seg.match(/(\w+)=\1\+/); if (m) A.top = m[1];
    if (!A.top) { m = seg.match(/(\w+)=(\w+)\+1/); if (m) A.top = m[1]; }
    m = seg.match(/(\w+)\[\w+\]=v/); if (m) A.stack = m[1];
  }
  if (A.getL) {
    const i = src.indexOf(`local function ${A.getL}(slot)`);
    const seg = src.slice(i, i + 260);
    m = seg.match(/local box=(\w+)\[slot\]/); if (m) A.boxes = m[1];
    m = seg.match(/return (\w+)\[slot\] end/); if (m) A.locals = m[1];
  }
  return A;
}

function parsePoolTable(src, startIdx) {
  if (src[startIdx] !== '{') return null;
  let i = startIdx + 1;
  const entries = [];
  const skipWs = () => { while (i < src.length && /[\s,]/.test(src[i])) i++; };
  skipWs();
  while (i < src.length && src[i] !== '}') {
    if (src[i] === '"' || src[i] === "'") return null;
    if (src[i] !== '{') {
      const nm = src.slice(i).match(/^(-?\d+)/);
      if (!nm) return null;
      entries.push({ num: Number(nm[1]) });
      i += nm[0].length;
      skipWs();
      continue;
    }
    let j = i, depth = 0, instr = false, q = '';
    while (j < src.length) {
      const ch = src[j];
      if (instr) { if (ch === q && src[j - 1] !== '\\') instr = false; j++; continue; }
      if (ch === '"' || ch === "'") { instr = true; q = ch; j++; continue; }
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) break; }
      j++;
    }
    if (depth !== 0) return null;
    const raw = src.slice(i, j + 1);
    const inner = raw.slice(1, -1);
    let frags = null, nums = null;
    if (inner.includes('{')) {
      frags = [];
      const fre = /\{([\d,\s]*)\}/g;
      let fm;
      while ((fm = fre.exec(inner)) !== null) {
        const arr = fm[1].split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
        if (arr.some(n => !Number.isFinite(n))) { frags = null; break; }
        frags.push(arr);
      }
      if (!frags || !frags.length) frags = null;
    } else {
      const arr = inner.split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
      if (!arr.some(n => !Number.isFinite(n))) nums = arr;
    }
    if (!frags && !nums) return null;
    entries.push({ raw, nums, frags });
    i = j + 1;
    skipWs();
  }
  return { entries, endIdx: i };
}
function parseFlatNums(src, startIdx) {
  let i = startIdx + 1;
  const nums = [];
  let cur = '';
  const flush = () => { const t = cur.trim(); if (t) { const n = Number(t); if (!Number.isFinite(n)) return false; nums.push(n); } cur = ''; return true; };
  while (i < src.length) {
    const ch = src[i];
    if (ch === '"' || ch === "'" || ch === '{' || ch === '(') return null;
    if (ch === '}') { if (!flush()) return null; return { nums, endIdx: i }; }
    if (ch === ',') { if (!flush()) return null; i++; continue; }
    cur += ch; i++;
  }
  return null;
}

function invertStackVM(content) {
  const cands = [...content.matchAll(/return\s+(\w+)\((\w+),(\w+),/g)];
  let entryName = null, poolsVar = null, codeVar = null, protoVar = null;
  for (let k = cands.length - 1; k >= 0; k--) {
    const [en, pv, cv, prow] = [cands[k][1], cands[k][2], cands[k][3], cands[k][0]];
    const prowM = cands[k][0].match(/return\s+\w+\(\w+,\w+,(\w+)/);
    const pv4 = prowM ? prowM[1] : null;
    if (new RegExp(`local\\s+${pv}\\s*=\\s*\\{\\{`).test(content) && new RegExp(`local\\s+${cv}\\s*=\\s*\\{`).test(content)) {
      entryName = en; poolsVar = pv; codeVar = cv;
      const full = content.match(new RegExp(`return\\s+${en}\\(${pv},${cv},\\w+,(\\w+)`));
      protoVar = full ? full[1] : null;
      break;
    }
  }
  if (!entryName) return { ok: false, reason: 'no entry call' };
  const poolsDefM = content.match(new RegExp(`local\\s+${poolsVar}\\s*=\\s*\\{\\{`));
  if (!poolsDefM) return { ok: false, reason: 'no pools def' };
  const pools = parsePoolTable(content, content.indexOf('{{', poolsDefM.index));
  if (!pools) return { ok: false, reason: 'pools parse failed' };
  const codeDefM = content.match(new RegExp(`local\\s+${codeVar}\\s*=\\s*\\{`));
  if (!codeDefM) return { ok: false, reason: 'no code def' };
  const codeT = parseFlatNums(content, content.indexOf('{', codeDefM.index));
  if (!codeT) return { ok: false, reason: 'code parse failed' };

  if (protoVar) {
    const pd = content.match(new RegExp(`local\\s+${protoVar}\\s*=\\s*\\{([^}]*)\\}`));
    if (!pd || pd[1].trim() !== '') return { ok: false, reason: 'non-empty protos (nested functions need proto lift)' };
  }
  const entryDefIdx = content.search(new RegExp(`local function ${entryName}\\(`));
  if (entryDefIdx === -1) return { ok: false, reason: 'no entry def' };
  const entryText = content.slice(entryDefIdx, entryDefIdx + 8000);
  const fragM = entryText.match(/band\((\d+)\+_p\*(\d+)\+\(_i-1\)/);
  const flatM = entryText.match(/band\((\d+)\+\(_j-1\)\*(\d+)\+\(_i-1\)/);
  const keyM = entryText.match(/\[_i\]>=0 then \w+\[_i\]=bit32\.bxor\(\w+\[_i\],(\d+)\)/);
  if (!fragM || !flatM) return { ok: false, reason: 'pool formula constants not found' };
  const codeKey = keyM ? parseInt(keyM[1]) : 0;
  const [fragA, fragB] = [parseInt(fragM[1]), parseInt(fragM[2])];
  const [flatA, flatB] = [parseInt(flatM[1]), parseInt(flatM[2])];
  const K = [];
  for (let idx = 0; idx < pools.entries.length; idx++) {
    const e = pools.entries[idx];
    const entryIdx = idx + 1;
    if (e.num !== undefined) { K.push(e.num); continue; }
    if (e.frags) {
      let p = 0, s = '';
      for (const frag of e.frags) for (const b of frag) { s += String.fromCharCode(b ^ ((fragA + p * fragB + (entryIdx - 1)) & 0xFF)); p++; }
      K.push(s);
    } else if (e.nums) {
      let s = '';
      e.nums.forEach((b, j) => { s += String.fromCharCode(b ^ ((flatA + j * flatB + (entryIdx - 1)) & 0xFF)); });
      K.push(s);
    } else return { ok: false, reason: 'bad pool entry' };
  }
  const code = codeT.nums.map(v => (codeKey && v >= 0 ? (v ^ codeKey) : v));
  const A = vmAliases(content);
  if (!A.push || !A.pop || !A.getL || !A.setL || !A.resK || !A.code || !A.ip || !A.htab) return { ok: false, reason: 'alias discovery incomplete' };
  const handlers = handlerBodies(content, A.htab);
  if (!Object.keys(handlers).length) return { ok: false, reason: 'no handlers extracted' };
  const tagMap = aliasTagMap(A);
  const opMap = {};
  const unmapped = [];
  for (const sk of Object.keys(handlers)) {
    const real = DBG_SKELETON_MAP[skeletonOf(handlers[sk], tagMap)];
    if (real === undefined) unmapped.push(sk);
    else opMap[sk] = real;
  }
  if (unmapped.length) return { ok: false, reason: `unmapped handlers: ${unmapped.join(',')}`, K, codeLen: code.length };
  return { ok: true, K, code, opMap, A, codeKey };
}

function wontParse(src) {
  if (src.includes('__UNHANDLED_')) return 'unhandled opcodes';
  if (src.includes('__JMP__')) return 'unresolved jumps';
  if (/\bgoto\s+\w/.test(src) || /::\s*\w+\s*::/.test(src)) return 'goto labels';
  if (src.includes('unhandled')) return 'unhandled opcodes';
  return null;
}

function deobfuscateClydeStatic(content) {
  const det = detectClyde(content);
  if (!det.isClyde) return { success: false, error: 'Not Clyde.' };
  const noComments = (s) => s.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim();

  if (det.mode === 'stack-vm') {
    try {
      const inv = invertStackVM(content);
      let normalWhy = inv.ok ? null : inv.reason;
      if (inv.ok) {
        const lifted = liftUnshuffled(inv.K, inv.code, inv.opMap);
        if (!lifted.bad) {
          const out = noComments(lifted.out);
          return { success: true, output: out, stats: { type: 'Clyde', mode: 'stack-vm-static', inputSize: content.length, outputSize: out.length, decodedStrings: inv.K.filter(v => typeof v === 'string').slice(0, 20) } };
        }

        normalWhy = 'normal lift: ' + lifted.bad;
      }
      const invMax = invertStackMax(content);
      if (invMax.ok) {
        const lifted = liftMaxProtos(invMax);
        if (!lifted.bad) {
          const out = noComments(lifted.out);
          return { success: true, output: out, stats: { type: 'Clyde', mode: 'stack-max-static', inputSize: content.length, outputSize: out.length, decodedStrings: lifted.strings.slice(0, 20) } };
        }
        return { success: false, error: `Clyde stack-max lifted but ${lifted.bad}.`, partial: null, decodedStrings: lifted.strings.slice(0, 20), mode: det.mode };
      }

      {
        const st = peelStub(content);
        if (!st.ok) {
          const stripped = stripBanner(content);
          const { decoded } = decodeStrings(stripped);
          return { success: false, error: `Clyde stack-vm: ${normalWhy || inv.reason}; max-direct: ${invMax.reason}; stub peel: ${st.reason}.`, partial: null, decodedStrings: decoded.slice(0, 20), mode: det.mode + '+max?' };
        }
        const ne = peelNested(st.inner);
        if (!ne.ok) {
          const outPeeled = noComments(st.inner.slice(0, 8 * 1024 * 1024));
          return { success: true, output: outPeeled, stats: { type: 'Clyde', mode: 'stack-max-peeled', inputSize: content.length, outputSize: outPeeled.length, decodedStrings: [], note: `Peeled stub (${st.inner.length}B) but nested failed: ${ne.reason}` } };
        }
        const ci = peelCipher(ne.inner);
        if (!ci.ok) {
          const outPeeled = noComments(ne.inner.slice(0, 8 * 1024 * 1024));
          return { success: true, output: outPeeled, stats: { type: 'Clyde', mode: 'stack-max-peeled', inputSize: content.length, outputSize: outPeeled.length, decodedStrings: [], note: `Peeled stub+nested (${ne.inner.length}B) but cipher failed: ${ci.reason}` } };
        }

        const mc = liftMaxCore(ci.inner);
        if (mc.ok) {
          const out = noComments(mc.output);
          return { success: true, output: out, stats: { type: 'Clyde', mode: 'stack-max-static', inputSize: content.length, outputSize: out.length, decodedStrings: mc.decodedStrings || [] } };
        }
        const mc2 = liftMaxCore2(ci.inner);
        if (mc2.ok) {
          const lifted = liftMaxProtos(mc2);
          if (!lifted.bad) {
            const out = noComments(lifted.out);
            return { success: true, output: out, stats: { type: 'Clyde', mode: 'stack-max-static', inputSize: content.length, outputSize: out.length, decodedStrings: lifted.strings.slice(0, 20) } };
          }
          return { success: false, error: `Clyde max: peeled to core (${ci.inner.length}B) but core lift: ${lifted.bad}.`, partial: null, decodedStrings: lifted.strings.slice(0, 20), mode: det.mode + '+max/peeled' };
        }
        const mc3 = invertStackMax(ci.inner);
        if (mc3.ok) {
          const lifted = liftMaxProtos(mc3);
          if (!lifted.bad) {
            const out = noComments(lifted.out);
            return { success: true, output: out, stats: { type: 'Clyde', mode: 'stack-max-static', inputSize: content.length, outputSize: out.length, decodedStrings: lifted.strings.slice(0, 20) } };
          }
          return { success: false, error: `Clyde max: peeled to core (${ci.inner.length}B) but core lift: ${lifted.bad}.`, partial: null, decodedStrings: lifted.strings.slice(0, 20), mode: det.mode + '+max/peeled' };
        }
        const outPeeled = noComments(ci.inner.slice(0, 8 * 1024 * 1024));
        return { success: true, output: outPeeled, stats: { type: 'Clyde', mode: 'stack-max-peeled', inputSize: content.length, outputSize: outPeeled.length, decodedStrings: [], note: `Peeled outer layers (${ci.inner.length}B inner VM) but core lift failed (${mc.reason}; ${mc2.reason}; ${mc3.reason}).` } };
      }
    } catch (e) {
      return { success: false, error: `Clyde stack-vm inverter threw: ${e.message}`, mode: det.mode };
    }
  }

  if (det.mode === 'reg-vm') {
    try {
      const peeled = peelRegBootstrap(content);
      if (peeled.ok) {
        const inner = peeled.inner;

        const inv = invertRegInner(inner);
        if (inv.ok) {
          const out = noComments(inner.slice(0, 8 * 1024 * 1024));
          return {
            success: true,
            output: out,
            stats: {
              type: 'Clyde',
              mode: 'reg-vm-peeled',
              inputSize: content.length,
              outputSize: out.length,
              decodedStrings: inner.match(/"[^"]{4,}"/g)?.slice(0, 20).map(s => s.slice(1, -1)) || [],
              note: `Peeled outer bootstrap (${peeled.inner.length}B inner VM). Full register structuring via regspec pending for ${inv.unmapped.length} fused leaves.`,
            },
          };
        }

        const out = noComments(inner.slice(0, 8 * 1024 * 1024));
        return {
          success: true,
          output: out,
          stats: {
            type: 'Clyde',
            mode: 'reg-vm-peeled',
            inputSize: content.length,
            outputSize: out.length,
            decodedStrings: inner.match(/"[^"]{4,}"/g)?.slice(0, 20).map(s => s.slice(1, -1)) || [],
            note: `Peeled outer bootstrap (${inner.length}B inner VM). ${inv.reason}`,
          },
        };
      }
    } catch (e) {
    }
    const stripped = stripBanner(content);
    const { decoded } = decodeStrings(stripped);
    return {
      success: false,
      error: `Clyde reg-vm: blob SBox+CBC+Base85 + polymorphic dispatch inversion pending. Static string-decode got ${decoded.length} strings; full source lift pending. Not added to bot as full.`,
      partial: null,
      decodedStrings: decoded.slice(0, 20),
      mode: det.mode,
    };
  }

  if (det.mode === 'direct') {
    const stripped = stripBanner(content);
    const { code, decoded } = decodeStrings(stripped);
    let out = code.replace(/;/g, ';\n').replace(/\n{3,}/g, '\n\n');
    out = noComments(out);

    return { success: true, output: out.slice(0, 7 * 1024 * 1024), stats: { type: 'Clyde', mode: 'direct-static', inputSize: content.length, outputSize: out.length, decodedStrings: decoded.slice(0, 20), note: 'Local names unrecoverable (rename one-way); strings decoded, structure preserved.' } };
  }

  const tail = tailTables(content);
  if (!tail) {
    return { success: false, error: `Clyde ${det.mode}: no K/code tails found, so there is nothing to lift.`, mode: det.mode };
  }
  const full = liftDebugTails(content, tail);
  let cfgWhy = full.ok ? null : full.reason;
  if (full.ok) {
    const out = noComments(full.output);
    const bad = wontParse(out);
    if (!bad) {
      return { success: true, output: out, stats: { type: 'Clyde', mode: full.reg ? 'reg-debug-static' : 'stack-debug-static', inputSize: content.length, outputSize: out.length, decodedStrings: full.strings.slice(0, 20) } };
    }
    cfgWhy = `the lift fell back to a string pass that left ${bad} behind`;
  }
  {
    const kStrings = tail.K.filter(v => typeof v === 'string').slice(0, 20);
    const isReg = /local _dK=/.test(content);

    if (!isReg) {
      const alt = noComments(liftStackDebug(tail.K, tail.C));
      const why = wontParse(alt);
      if (!why) {
        return { success: true, output: alt, stats: { type: 'Clyde', mode: 'stack-debug-static', inputSize: content.length, outputSize: alt.length, decodedStrings: kStrings } };
      }
      return { success: false, error: `Clyde ${det.mode}: ${cfgWhy || 'CFG lift refused'}; the fallback lifter left ${why} behind, which is not valid Luau.`, partial: null, decodedStrings: kStrings, mode: det.mode };
    }
    return { success: false, error: `Clyde ${det.mode}: ${cfgWhy || 'CFG lift refused'}. The register VM has no trustworthy fallback lifter, so nothing is returned rather than a script that looks right and is not.`, partial: null, decodedStrings: kStrings, mode: det.mode };
  }

  const stripped = stripBanner(content);
  const { code, decoded } = decodeStrings(stripped);
  return {
    success: false,
    error: `Clyde ${det.mode} uses shuffled opcodes + cipher/nested/LZSS/blob layers; static string-decode recovered ${decoded.length} strings but full source lift requires opcode-map + cipher inversion (not yet implemented). Not added to bot as full.`,
    partial: noComments(code).slice(0, 50000),
    decodedStrings: decoded.slice(0, 20),
    mode: det.mode,
  };
}

function liftDebugTails(content, tail) {
  try {
    const isReg = /local _dK=/.test(content);

    let protosVar = null;
    {
      const rm = content.match(/return\s+_run\(([^)]*)\)/);
      if (rm) {
        const av = rm[1].split(',').map(s => s.trim());
        if (av[3]) protosVar = av[3];
      }
    }
    if (isReg) {
      const rl = liftRegTails(content, tail);
      if (!rl.ok) return rl;
      return { ok: true, output: rl.output, strings: rl.strings, reg: true };
    }

    let protos = [];
    if (protosVar) {
      const pDefM = content.match(new RegExp(`local\\s+${protosVar}\\s*=\\s*\\{`));
      if (!pDefM) return { ok: false, reason: 'debug: no protos def' };
      const pBrace = braceSpan(content, content.indexOf('{', pDefM.index));
      if (!pBrace) return { ok: false, reason: 'debug: protos unbalanced' };
      const pr = parseDebugProtos(pBrace.text.slice(1, -1));
      if (!pr.ok) return pr;
      protos = pr.protos;
    }

    const ident = {};
    for (let o = 0; o <= 67; o++) ident[o] = o;
    const rm = remapShuffled(tail.C, ident);
    if (rm.badOp !== null && rm.badOp !== undefined) return { ok: false, reason: 'debug: code op ' + rm.badOp + ' out of range' };

    const handlers = handlerBodies(content, 'handlers');
    const cb = ctxBitMap(content, rm.ctxPositions, handlers, ident);
    if (cb.err) return { ok: false, reason: 'debug: ' + cb.err };
    const jk = detectJumpKey(content, handlers, ident);
    if (jk.err) return { ok: false, reason: 'debug: ' + jk.err };
    const inv = {
      K: tail.K, code: rm.remapped, shufMap: ident, jumpKey: jk.jumpKey,
      ctxBits: cb.bits, ctxInit: cb.init ?? null, ctxPrime: cb.prime ?? null, ctxConst: cb.const ?? null,
      protos,
    };
    const lifted = liftMaxProtos(inv);
    if (lifted.bad) return { ok: false, reason: 'debug lift: ' + lifted.bad };
    return { ok: true, output: lifted.out, strings: lifted.strings, reg: false };
  } catch (e) {
    return { ok: false, reason: 'debug tails threw: ' + e.message };
  }
}

function parseDebugProtos(text, depth) {
  depth = depth || 0;
  if (depth > 6) return { ok: false, reason: 'debug: protos too deep' };
  const items = splitTopLevel(text);
  const protos = [];
  for (const t of items) {
    const s = t.trim();
    if (!s.startsWith('{') || !s.endsWith('}')) return { ok: false, reason: 'debug: bad proto item' };
    const fields = {};
    for (const f of splitTopLevel(s.slice(1, -1))) {
      const fm = f.trim().match(/^([A-Za-z_]\w*)\s*=\s*([\s\S]*)$/);
      if (!fm) return { ok: false, reason: 'debug: bad proto field' };
      fields[fm[1]] = fm[2].trim();
    }
    const fv = Object.values(fields);
    if (fv.length !== 5) return { ok: false, reason: `debug: proto has ${fv.length} fields` };
    const [kf, cf, pf, uf, nf] = fv;
    const litArr = (txt) => {
      const tt = txt.trim();
      if (!tt.startsWith('{') || !tt.endsWith('}')) return null;
      const inner = tt.slice(1, -1).trim();
      if (!inner) return [];

      if (inner.includes('{')) return null;
      const out = [];
      for (const el of splitTopLevel(inner)) {
        const t = el.trim();
        let v = constFold(t);
        if (v === null || (typeof v !== 'number' && typeof v !== 'string' && typeof v !== 'boolean')) {
          v = litVal(t);
          if (v === undefined) return null;
        }
        out.push(v);
      }
      return out;
    };
    const K = litArr(kf);
    if (!K) return { ok: false, reason: 'debug: bad proto K' };
    const C = litArr(cf);
    if (!C || C.some(v => typeof v !== 'number')) return { ok: false, reason: 'debug: bad proto C' };
    let P = [];
    if (pf.trim() !== '{}' && pf.trim() !== 'nil') {
      const sub = parseDebugProtos(pf.slice(1, -1), depth + 1);
      if (!sub.ok) return sub;
      P = sub.protos;
    }
    let U = null;
    if (uf.trim() !== 'nil' && uf.trim() !== '{}') {
      U = [];
      for (const u of splitTopLevel(uf.slice(1, -1))) {
        const um = u.trim().match(/^\{(\d+),(\d+)\}$/);
        if (!um) return { ok: false, reason: 'debug: bad U spec' };
        U.push([parseInt(um[1]), parseInt(um[2])]);
      }
    }
    let nParams = 0;
    if (nf !== 'nil') {
      const nv = constFold(nf);
      if (typeof nv !== 'number') return { ok: false, reason: 'debug: bad nParams' };
      nParams = nv;
    }
    protos.push({ K, C, P, U, nParams, lifted: null, name: null });
  }
  return { ok: true, protos };
}

function expandRegFused(code) {
  const out = [];
  let i = 0;
  while (i + 3 < code.length) {
    const op = code[i];
    if (op < 45 || op > 56) { out.push(code[i], code[i + 1], code[i + 2], code[i + 3]); i += 4; continue; }
    const A = code[i + 1], B = code[i + 2], C = code[i + 3];
    const A2 = code[i + 5], B2 = code[i + 6], C2 = code[i + 7];
    const push2 = (o, a, b, c) => { out.push(o, a, b, c); };
    switch (op) {
      case 45: push2(25, A, 0, C); { const J = code[i + 6]; push2(21, J, 0, 0); } i += 8; break;
      case 46: push2(22, A, B, C); { const J = code[i + 6]; push2(21, J, 0, 0); } i += 8; break;
      case 47: push2(23, A, B, C); { const J = code[i + 6]; push2(21, J, 0, 0); } i += 8; break;
      case 48: push2(24, A, B, C); { const J = code[i + 6]; push2(21, J, 0, 0); } i += 8; break;
      case 49: push2(26, A, B, C); { const J = code[i + 6]; push2(21, J, 0, 0); } i += 8; break;
      case 50: push2(5, A, B, 0); push2(7, A2, A, C2); i += 8; break;
      case 51: push2(1, A, B, 0); push2(1, A2, B2, 0); i += 8; break;
      case 52: push2(4, A, B, 0); push2(4, A2, B2, 0); i += 8; break;
      case 53: push2(36, A, B, C); push2(27, A, B2, C2); i += 8; break;
      case 54: {
        const A3 = code[i + 9], B3 = code[i + 10], C3 = code[i + 11];
        push2(5, A, B, 0); push2(7, A2, A, C2); push2(27, A3, B3, C3); i += 12; break;
      }
      case 55: push2(1, A, B, 0); push2(29, A, 2, 0); i += 8; break;
      case 56: push2(4, A, B, 0); push2(29, A, 2, 0); i += 8; break;
      default: return { bad: 'unknown fused op ' + op };
    }
  }
  while (i < code.length) out.push(code[i++]);
  return { code: out };
}

function liftRegChunk(K, code, opts) {
  opts = opts || {};
  const ex = expandRegFused(code);
  if (ex.bad) return { out: '', bad: ex.bad };
  code = ex.code;
  const n = code.length / 4;
  const out = [];
  const R = Object.assign({}, opts.preload || {});
  const forStack = [];
  const rk = (v) => {
    if (v >= 256) return luaLit(K[v - 256]);
    return (R[v] !== undefined ? R[v] : `r${v}`);
  };
  const rname = (a) => `r${a}`;

  const targets = new Set();
  for (let pc = 0; pc < n; pc++) {
    const op = code[pc * 4], A = code[pc * 4 + 1], B = code[pc * 4 + 2], C = code[pc * 4 + 3];
    if (op === 21) targets.add(pc + 1 + B);
    else if (op === 30 || op === 31) targets.add(pc + 1 + B);
    else if (op === 32) { targets.add(pc + 2); }
    else if (op === 22 || op === 23 || op === 24 || op === 25 || op === 26) targets.add(pc + 2);
  }
  const callArgs = (a, b) => {
    if (b <= 1) return [];
    const a0 = [];
    for (let r = a + 1; r <= a + b - 1; r++) a0.push(rk(r));
    return a0;
  };
  for (let pc = 0; pc < n; pc++) {
    if (targets.has(pc)) out.push(`::L${pc}::`);
    const op = code[pc * 4], A = code[pc * 4 + 1], B = code[pc * 4 + 2], C = code[pc * 4 + 3];
    const ra = rname(A);
    if (op === 43) { R[A] = luaLit(K[B]); continue; }
    if (op === 44) { out.push(`-- EXTRAARG ${A}, ${B}, ${C};`); continue; }
    switch (op) {
      case 0: break;
      case 1: R[A] = luaLit(K[B]); break;
      case 2: for (let r = A; r <= A + B; r++) R[r] = 'nil'; break;
      case 3: R[A] = B !== 0 ? 'true' : 'false'; if (C !== 0) { out.push(`goto L${pc + 2};`); targets.add(pc + 2); } break;
      case 4: R[A] = rk(B); break;
      case 5: R[A] = typeof K[B] === 'string' ? K[B] : luaLit(K[B]); break;
      case 6: out.push(`${K[B]} = ${rk(A)};`); break;
      case 7: R[A] = `${rk(B)}[${rk(C)}]`; break;
      case 8: {
        let tb = rk(A);
        if (tb === '{}') {
          tb = `t_set_${pc}`;
          out.push(`local ${tb} = {};`);
          R[A] = tb;
        }
        out.push(`${tb}[${rk(B)}] = ${rk(C)};`);
        break;
      }
      case 9: R[A] = '{}'; break;
      case 10: case 11: case 12: case 13: case 14: case 15:
        R[A] = `(${rk(B)} ${{ 10: '+', 11: '-', 12: '*', 13: '/', 14: '%', 15: '^' }[op]} ${rk(C)})`; break;
      case 16: R[A] = `(math.floor(${rk(B)} / ${rk(C)}))`; break;
      case 17: R[A] = `(-${rk(B)})`; break;
      case 18: R[A] = `(not ${rk(B)})`; break;
      case 19: R[A] = `(#${rk(B)})`; break;
      case 20: {
        if (C - B <= 1) R[A] = `(${rk(B)} .. ${rk(C)})`;
        else { const p = []; for (let r = B; r <= C; r++) p.push(rk(r)); R[A] = `(${p.join(' .. ')})`; }
        break;
      }
      case 21: out.push(`goto L${pc + 1 + B};`); break;
      case 22: case 23: case 24: {
        const sop = { 22: '==', 23: '<', 24: '<=' }[op];
        const cmp = `(${rk(B)} ${sop} ${rk(C)})`;

        out.push(A === 0 ? `if ${cmp} then goto L${pc + 2}; end` : `if not ${cmp} then goto L${pc + 2}; end`);
        targets.add(pc + 2);
        break;
      }
      case 25: {
        out.push(C === 0 ? `if (${ra}) then goto L${pc + 2}; end` : `if (not (${ra})) then goto L${pc + 2}; end`);
        targets.add(pc + 2);
        break;
      }
      case 26: {
        out.push(`if ((not ${rk(B)}) == (${C} ~= 0)) then goto L${pc + 2}; else ${ra} = ${rk(B)}; end`);
        R[A] = ra;
        targets.add(pc + 2);
        break;
      }
      case 27: {
        if (B === 0) { out.push(`${C === 1 ? '' : ra + ' = '}${rk(A)}(); -- args unknown (.._top)`); R[A] = ra; break; }
        if (C === 0) {
          const args = callArgs(A, B);
          out.push(`${ra} = ${rk(A)}(${args.join(', ')}); -- +more (multret)`);
          R[A] = ra;
        } else if (C === 1) { out.push(`${rk(A)}(${callArgs(A, B).join(', ')});`); }
        else {
          const args = callArgs(A, B);
          const lhs = [];
          for (let r = A; r <= A + C - 2; r++) lhs.push(rname(r));
          out.push(`${lhs.join(', ')} = ${rk(A)}(${args.join(', ')});`);
          lhs.forEach((nm, k) => { R[A + k] = nm; });
        }
        break;
      }
      case 28: {
        const args = B === 0 ? [] : callArgs(A, B);
        out.push(`return ${rk(A)}(${args.join(', ')})${B === 0 ? '; -- args unknown (.._top)' : ';'}`);
        break;
      }
      case 29: {
        if (B === 0) out.push(`return ${ra}; -- +more (multret)`);
        else if (B === 1) out.push('return;');
        else { const a = []; for (let r = A; r <= A + B - 2; r++) a.push(rk(r)); out.push(`return ${a.join(', ')};`); }
        break;
      }
      case 30: {
        const vn = `fl_${pc}`;
        const init = rk(A), limit = rk(A + 1), step = rk(A + 2);
        out.push(`local ${vn}_i, ${vn}_l, ${vn}_s = ${init}, ${limit}, ${step};`);
        out.push(`${vn}_i = (${vn}_i - ${vn}_s);`);
        R[A] = `${vn}_i`; R[A + 1] = `${vn}_l`; R[A + 2] = `${vn}_s`; R[A + 3] = `${vn}_c`;
        forStack.push({ head: pc + 1, vn, exit: pc + 1 + B });
        out.push(`goto L${pc + 1 + B};`);
        break;
      }
      case 31: {
        const fr = forStack.pop();
        if (!fr) return { out: out.join('\n'), bad: `FORLOOP without FORPREP at pc ${pc}` };
        out.push(`${fr.vn}_c = (${fr.vn}_i + ${fr.vn}_s);`);
        out.push(`${fr.vn}_i = ${fr.vn}_c;`);
        out.push(`if ((${fr.vn}_s > 0 and ${fr.vn}_c <= ${fr.vn}_l) or (${fr.vn}_s <= 0 and ${fr.vn}_c >= ${fr.vn}_l)) then goto L${fr.head}; end`);
        R[A] = `${fr.vn}_i`; R[A + 3] = `${fr.vn}_c`;
        break;
      }
      case 32: {
        const t = `t_for_${pc}`;
        out.push(`local ${t} = {${rk(A)}(${rk(A + 1)}, ${rk(A + 2)})};`);
        for (let k = 1; k <= C; k++) { R[A + 2 + k] = `${t}[${k}]`; }
        out.push(`if ${t}[1] ~= nil then ${rname(A + 3)} = ${t}[1]; goto L${pc + 2}; end`);
        R[A + 3] = `${t}[1]`;
        targets.add(pc + 2);
        break;
      }
      case 33: {
        if (B === 0) { out.push(`-- SETLIST dynamic into ${rk(A)};`); break; }
        let tn = rk(A);
        if (tn === '{}') {
          tn = `t_list_${pc}`;
          out.push(`local ${tn} = {};`);
          R[A] = tn;
        }
        const parts = [];
        for (let k = 1; k <= B && k <= 64; k++) parts.push(`${tn}[${C - 1 + k}] = ${rk(A + k)}`);
        if (B > 64) parts.push('-- +more');
        out.push(parts.join(' '));
        break;
      }
      case 34: {
        const P = (opts.protos || []).find(q => q.pi === B + 1);
        if (!P || !P.lifted) R[A] = 'nil';
        else R[A] = P.name;
        break;
      }
      case 35: {
        if (B === 0) { out.push(`-- VARARG dynamic at ${ra};`); break; }
        if (!opts.vararg) {
          for (let k = 0; k < B - 1 && k < 32; k++) R[A + k] = 'nil';
          out.push(`-- VARARG ${B - 1} vals at ${ra} (unknown);`);
          break;
        }
        const parts = [];
        for (let k = 0; k < B - 1 && k < 32; k++) parts.push(rname(A + k));
        out.push(`${parts.join(', ')} = ...;`);
        parts.forEach((nm, k) => { R[A + k] = nm; });
        break;
      }
      case 36: R[A + 1] = rk(B); R[A] = `${rk(B)}[${rk(C)}]`; break;
      case 37: R[A] = (opts.uvs && opts.uvs[B] !== undefined) ? opts.uvs[B] : `uv${B}`; break;
      case 38: {
        const v = rk(A);
        if (opts.uvs) opts.uvs[B] = v;
        else out.push(`-- setupval ${B} = ${v};`);
        break;
      }
      case 39: break;
      case 40: case 41: {
        const isX = op === 41;
        const f = rk(A);
        const eh = isX ? rk(A + 1) : null;
        const base = isX ? A + 2 : A + 1;
        const upto = isX ? A + 3 : A + 2;
        let args, unknownArgs = false;
        if ((!isX && B === 1) || (isX && B <= 2)) args = [];
        else if ((!isX && B === 2) || (isX && B === 3)) args = [rk(base)];
        else if ((!isX && B === 0) || (isX && B === 0)) { args = []; unknownArgs = true; }
        else { args = []; for (let r = base; r <= (isX ? A + B : A + B - 1); r++) args.push(rk(r)); }
        const call = isX ? `xpcall(${f}, ${eh}${args.length ? ', ' + args.join(', ') : ''})` : `pcall(${f}${args.length ? ', ' + args.join(', ') : ''})`;
        const unote = unknownArgs ? ' -- args unknown (.._top)' : '';
        if (C === 0) { out.push(`${ra} = ${call}; -- +more (multret)`); R[A] = ra; }
        else if (C === 1) { out.push(`${call};${unote}`); }
        else {
          const lhs = [];
          for (let r = A; r <= A + C - 2; r++) lhs.push(rname(r));
          out.push(`${lhs.join(', ')} = ${call};${unote}`);
          lhs.forEach((nm, k) => { R[A + k] = nm; });
        }
        break;
      }
      case 42: break;
      case 43: case 44: break;
      default: return { out: out.join('\n'), bad: `unhandled reg op ${op} at pc ${pc}` };
    }
  }
  return { out: out.join('\n'), bad: null };
}

function liftRegTails(content, tail) {
  try {
    let protosVar = null, upvalsVar = null, nParams = 0, maxRegs = 0, isVararg = false;
    {
      const all = [...content.matchAll(/return\s+_run\(([^)]*)\)/g)];
      if (!all.length) return { ok: false, reason: 'reg-debug: no _run tail call' };
      const rm = all[all.length - 1];
      const av = rm[1].split(',').map(s => s.trim());
      protosVar = av[2] || null;
      upvalsVar = av[3] || null;
      nParams = parseInt(av[4] || '0', 10) || 0;
      maxRegs = parseInt(av[5] || '0', 10) || 0;
      isVararg = (av[6] || 'false').trim() === 'true';
    }
    let protos = [];
    if (protosVar) {
      const pDefM = content.match(new RegExp(`local\\s+${protosVar}\\s*=\\s*\\{`));
      if (!pDefM) return { ok: false, reason: 'reg-debug: no protos def' };
      const pBrace = braceSpan(content, content.indexOf('{', pDefM.index));
      if (!pBrace) return { ok: false, reason: 'reg-debug: protos unbalanced' };
      const pr = parseRegProtos(pBrace.text.slice(1, -1));
      if (!pr.ok) return pr;
      protos = pr.protos;
    }
    const lifted = liftRegProtos(tail.K, tail.C, protos, { nParams, isVararg });
    if (lifted.bad) return { ok: false, reason: 'reg-debug lift: ' + lifted.bad };
    return { ok: true, output: lifted.out, strings: lifted.strings };
  } catch (e) {
    return { ok: false, reason: 'reg tails threw: ' + e.message };
  }
}

function parseRegProtos(text, depth) {
  depth = depth || 0;
  if (depth > 6) return { ok: false, reason: 'reg: protos too deep' };
  const items = splitTopLevel(text);
  const protos = [];
  for (const t of items) {
    const s = t.trim();
    if (!s.startsWith('{') || !s.endsWith('}')) return { ok: false, reason: 'reg: bad proto item' };
    const fv = splitTopLevel(s.slice(1, -1)).map(x => x.trim());
    if (fv.length !== 7) return { ok: false, reason: `reg: proto has ${fv.length} fields (want 7)` };

    const stripName = (f) => {
      const m = f.match(/^[A-Za-z_]\w*\s*=\s*([\s\S]*)$/);
      return m ? m[1].trim() : null;
    };
    const raw = fv.map(stripName);
    if (raw.some(v => v === null)) return { ok: false, reason: 'reg: bad proto field' };
    const [kf, cf, pf, uf, nf, mrf, vaf] = raw;
    const litArr = (txt) => {
      const tt = txt.trim();
      if (!tt.startsWith('{') || !tt.endsWith('}')) return null;
      const inner = tt.slice(1, -1).trim();
      if (!inner) return [];
      if (inner.includes('{')) return null;
      const out = [];
      for (const el of splitTopLevel(inner)) {
        const tx = el.trim();
        let v = constFold(tx);
        if (v === null || (typeof v !== 'number' && typeof v !== 'string' && typeof v !== 'boolean')) {
          v = litVal(tx);
          if (v === undefined) return null;
        }
        out.push(v);
      }
      return out;
    };
    const K = litArr(kf);
    if (!K) return { ok: false, reason: 'reg: bad proto K' };
    const C = litArr(cf);
    if (!C || C.some(v => typeof v !== 'number')) return { ok: false, reason: 'reg: bad proto C' };
    let P = [];
    if (pf.trim() !== '{}' && pf.trim() !== 'nil') {
      const sub = parseRegProtos(pf.slice(1, -1), depth + 1);
      if (!sub.ok) return sub;
      P = sub.protos;
    }
    let U = null;
    if (uf.trim() !== 'nil' && uf.trim() !== '{}') {
      U = [];
      for (const u of splitTopLevel(uf.slice(1, -1))) {
        const um = u.trim().match(/^\{(\d+),(\d+)\}$/);
        if (!um) return { ok: false, reason: 'reg: bad U spec' };
        U.push([parseInt(um[1]), parseInt(um[2])]);
      }
    }
    const nv = constFold(nf);
    if (typeof nv !== 'number') return { ok: false, reason: 'reg: bad nParams' };
    protos.push({ K, C, P, U, nParams: nv, mR: 0, vA: vaf.trim() === 'true', lifted: null, name: null });
  }
  return { ok: true, protos };
}

function regClosurePis(code) {
  const ex = expandRegFused(code);
  const pis = new Set();
  if (ex.bad) return pis;
  for (let p = 0; p + 3 < ex.code.length; p += 4) {
    if (ex.code[p] === 34) pis.add(ex.code[p + 2] + 1);
  }
  return pis;
}

function liftRegProtos(K, code, protos, opts) {
  opts = opts || {};
  const strings = K.filter(v => typeof v === 'string');
  let protoN = 0;
  const liftProto = (P, parentR, parentUvs, depth) => {
    if (P.lifted) return P;
    if (depth > 6) { P.bad = 'proto nesting too deep'; return P; }
    const uvs = {};
    if (P.U) {
      P.U.forEach((spec, k) => {
        const [iL, idx] = spec;
        if (iL === 1) uvs[k] = { boxOf: { map: parentR, key: idx } };
        else if (parentUvs[idx] !== undefined) uvs[k] = parentUvs[idx];
      });
    }
    const childProtos = [];

    for (const pi of regClosurePis(P.C)) {
      const sub = (P.P || [])[pi - 1];
      if (!sub) { P.bad = 'proto pi ' + pi + ' out of range'; return P; }
      liftProto(sub, {}, uvs, depth + 1);
      if (sub.bad) { P.bad = sub.bad; return P; }
      childProtos.push({ name: sub.name, lifted: sub.lifted, pi });
    }
    const params = [];
    for (let s = 0; s < (P.nParams || 0); s++) params.push(`p${s}`);
    const preload = {};
    for (let s = 0; s < (P.nParams || 0); s++) preload[s] = `p${s}`;
    const lr = liftRegChunk(P.K, P.C, {
      protos: childProtos, uvs,
      params, vararg: !!P.vA,
      preload,
    });
    if (lr.bad) { P.bad = lr.bad; return P; }
    P.name = `__proto_${protoN++}`;
    P.lifted = `local ${P.name} = function(${params.join(', ')}${params.length ? ', ...' : '...'})${P.vA || !params.length ? '' : ''}\n${lr.out}\nend`;
    for (const s of P.K.filter(v => typeof v === 'string')) strings.push(s);
    return P;
  };
  const mainProtos = [];
  const ex = expandRegFused(code);
  if (ex.bad) return { out: '', bad: ex.bad, strings };
  for (const pi of regClosurePis(code)) {
    const P = protos[pi - 1];
    if (!P) return { out: '', bad: 'proto pi ' + pi + ' out of range', strings };
    const r = liftProto(P, {}, {}, 0);
    if (r.bad) return { out: '', bad: 'proto: ' + r.bad, strings };
    mainProtos.push({ name: P.name, lifted: P.lifted, pi });
  }
  const params = [];
  for (let s = 0; s < (opts.nParams || 0); s++) params.push(`p${s}`);
  const preload = {};
  for (let s = 0; s < (opts.nParams || 0); s++) preload[s] = `p${s}`;
  const lr = liftRegChunk(K, code, { protos: mainProtos, params, vararg: !!opts.isVararg, preload });
  if (lr.bad) return { out: lr.out, bad: lr.bad, strings };
  const defs = [];
  const collectDefs = (list) => {
    for (const p of list) {
      if (p.P) collectDefs(p.P);
      if (p.lifted) defs.push(p.lifted);
    }
  };
  collectDefs(protos);
  return { out: (defs.length ? defs.join('\n\n') + '\n\n' : '') + lr.out, bad: null, strings };
}

function findRegStates(content) {
  const lm = content.match(/local (\w+)=(\d+)\s+while true do/);
  if (!lm) return null;
  const sv = lm[1];
  const loopStart = lm.index + lm[0].length;

  const chainRe = new RegExp(`(?:if|elseif) ${sv}==(\\d+) then`, 'g');
  chainRe.lastIndex = loopStart;
  const ids = [];
  let m;
  while ((m = chainRe.exec(content)) !== null) {
    if (m.index > loopStart + 200000) break;
    ids.push([parseInt(m[1]), m.index + m[0].length]);
  }
  if (!ids.length) return null;

  const states = new Map();
  for (let k = 0; k < ids.length; k++) {
    const [id, start] = ids[k];
    let depth = 1, j = start, ins = false, q = '';
    let end = -1;
    while (j < content.length) {
      const ch = content[j];
      if (ins) { if (ch === q && content[j - 1] !== '\\') ins = false; j++; continue; }
      if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
      if (ch === '[' && content[j + 1] === '[') { const e = content.indexOf(']]', j); j = e === -1 ? content.length : e + 2; continue; }
      if (ch === '[' && content[j + 1] === '=') {
        const lvl = content.slice(j).match(/^\[=*\[/);
        if (lvl) { const e = content.indexOf(']' + '='.repeat(lvl[0].length - 2) + ']', j); j = e === -1 ? content.length : e + lvl[0].length; continue; }
      }
      const rest = content.slice(j);
      if (depth === 1 && (/^elseif\b/.test(rest) || /^else\b/.test(rest))) { end = j; break; }
      let kw = rest.match(/^(function|if|while)\b/);
      if (kw) {
        depth++; j += kw[1].length;
        if (kw[1] === 'while') { const d = rest.slice(kw[1].length).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; }
        continue;
      }
      kw = rest.match(/^for\b/);
      if (kw) { depth++; j += 3; const d = rest.slice(3).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; continue; }
      kw = rest.match(/^do\b/);
      if (kw) { depth++; j += 2; continue; }
      const em = rest.match(/^end\b/);
      if (em) { depth--; j += 3; if (depth === 0) { end = j - 3; break; } continue; }
      j++;
    }
    if (end === -1) break;
    states.set(id, content.slice(start, end));
  }
  return { sv, init: parseInt(lm[2]), states };
}

function walkRegChain(found) {
  const { sv, init, states } = found;
  const path = [];
  const seen = new Set();
  let cur = init;
  for (;;) {
    if (seen.has(cur)) return { path, loop: true };
    seen.add(cur);
    const body = states.get(cur);
    if (body === undefined) return { path, missing: cur };
    path.push(cur);
    const assigns = [...body.matchAll(new RegExp(`${sv}=(\\d+)`, 'g'))].map(x => parseInt(x[1]));
    if (!assigns.length) {
      if (/\bbreak\b/.test(body)) return { path, done: true };
      return { path, stuck: true };
    }
    cur = assigns[assigns.length - 1];
  }
}

function byteTable(content, name, depth) {
  depth = depth || 0;
  if (depth > 4) return null;
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  {
    const m = content.match(new RegExp(`local ${esc}=\\{([^}]*)\\}`));
    if (m) {
      const arr = [];
      for (const el of m[1].split(',')) {
        const t = el.trim();
        if (!t) continue;
        const v = constFold(t);
        if (typeof v !== 'number') { arr.length = 0; break; }
        arr.push(v & 0xFF);
      }
      if (arr.length) return arr;
    }
  }

  {
    const writes = [];
    const re = new RegExp(`for \\w+=1,[^\\n]*?do [^\\n]*?${esc}\\[\\w+\\]=([^\\n]*?)(?:;|\\s+end)`, 'g');
    let m;
    while ((m = re.exec(content)) !== null) writes.push(m[1].trim());
    if (writes.length) {
      const out = [];
      for (const rhs of writes) {
        let srcName = null, key = 0;
        let dm = rhs.match(/^(\w+)\[\w+\]$/);
        if (dm) srcName = dm[1];
        else {
          dm = rhs.match(/^\w+\((\w+)\[\w+\],(.+)\)$/);
          if (!dm) continue;
          srcName = dm[1];
          const kv = constFold(dm[2].trim());
          if (typeof kv !== 'number') continue;
          key = kv & 0xFF;
        }

        if (srcName === name) continue;
        const arr = byteTable(content, srcName, depth + 1);
        if (!arr) return null;
        for (const b of arr) out.push((b ^ key) & 0xFF);
      }
      return out.length ? out : null;
    }
  }
  return null;
}

function b85decode(text, truncLen) {
  let s = text.replace(/[\s]/g, '').replace(/z/g, '!!!!!');
  const out = [];
  for (let i = 0; i + 5 <= s.length; i += 5) {
    const d = s.charCodeAt(i) - 33, e = s.charCodeAt(i + 1) - 33, f = s.charCodeAt(i + 2) - 33;
    const g = s.charCodeAt(i + 3) - 33, h = s.charCodeAt(i + 4) - 33;
    if (d < 0 || d > 84 || e < 0 || e > 84 || f < 0 || f > 84 || g < 0 || g > 84 || h < 0 || h > 84) return null;
    const v = d * 52200625 + e * 614125 + f * 7225 + g * 85 + h;
    out.push((v >>> 24) & 0xFF, (v >>> 16) & 0xFF, (v >>> 8) & 0xFF, v & 0xFF);
  }
  const bytes = out.slice(0, truncLen);
  return bytes.map(b => String.fromCharCode(b)).join('');
}

function sboxForward(data, key, sbox) {
  if (!key.length || sbox.length < 256) return null;
  let prev = 0;
  const out = [];
  for (let i = 0; i < data.length; i++) {
    const enc = data.charCodeAt(i) & 0xFF;
    const sub = (enc ^ (key[i % key.length] & 0xFF) ^ (prev & 0xFF)) & 0xFF;
    const v = sbox[sub];
    if (v === undefined) return null;
    out.push(String.fromCharCode(v & 0xFF));
    prev = enc;
  }
  return out.join('');
}

function bareAlias(content, name) {
  let m = content.match(new RegExp(`local (\\w+)\\s*=\\s*${name}(?![\\w([])`));
  if (m) return m[1];

  const re = /local ([\w\s,]+)=\s*([\w.]+(?:\s*,\s*[\w.]+)*)/g;
  while ((m = re.exec(content)) !== null) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
    const vals = m[2].split(',').map(s => s.trim());
    if (names.length !== vals.length) continue;
    const idx = vals.indexOf(name);
    if (idx >= 0 && /^[A-Za-z_]\w*$/.test(names[idx])) return names[idx];
  }
  return null;
}

function resolveLoadstring(content) {
  return bareAlias(content, 'loadstring');
}

function regBlob(body, argText) {
  const t = argText.trim();
  const lb = t.match(/^\[(=*)\[/);
  if (lb) {
    const level = lb[1];
    const close = ']' + level + ']';
    const start = t.indexOf('[', 0) + 1 + level.length + 1;
    const end = t.indexOf(close, start);
    if (end === -1) return null;
    return { kind: 'text', text: t.slice(start, end) };
  }
  if (t.startsWith('"')) {
    const lit = luaStrLit(t);
    return lit ? { kind: 'text', text: lit.str } : null;
  }
  if (/^\w+$/.test(t)) return { kind: 'var', text: t };
  return null;
}

function decoderKind(content, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const dm = content.match(new RegExp(`local function ${esc}\\([^)]*\\)`));
  if (!dm) return null;

  let j = dm.index + dm[0].length, depth = 1, ins = false, q = '';
  while (j < content.length) {
    const ch = content[j];
    if (ins) { if (ch === q && content[j - 1] !== '\\') ins = false; j++; continue; }
    if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
    const rest = content.slice(j);
    if (/^elseif\b/.test(rest)) { j += 6; continue; }
    let kw = rest.match(/^(function|if|while)\b/);
    if (kw) {
      depth++; j += kw[1].length;
      if (kw[1] === 'while') { const d = rest.slice(kw[1].length).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; }
      continue;
    }
    kw = rest.match(/^for\b/);
    if (kw) { depth++; j += 3; const d = rest.slice(3).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; continue; }
    kw = rest.match(/^do\b/);
    if (kw) { depth++; j += 2; continue; }
    const em = rest.match(/^end\b/);
    if (em) { depth--; j += 3; if (depth === 0) break; continue; }
    j++;
  }
  const body = content.slice(dm.index, j);

  if (body.includes('52200625')) {
    const offM = body.match(/\(\w+-(\d+)\)\*52200625/);
    const truncM = body.match(/,\s*1\s*,\s*(\d+)\s*\)\s*end/);
    return { kind: 'b85', offset: offM ? parseInt(offM[1]) : 33, trunc: truncM ? parseInt(truncM[1]) : null };
  }

  if (/prev\s*=\s*0/.test(body) && /prev\s*=\s*enc/.test(body)) {
    const km = body.match(/(\w+)\[(\(\(i-1\)%\w+\)\+1|i)\]/);
    const keyM = body.match(/byte\(\w+,i\)[^\n]*?(\w+)\[/);
    const boxM = body.match(/=\w+\((\w+)\[sub\+1\]\)|char\((\w+)\[sub\+1\]\)/) || body.match(/(\w+)\[sub\+1\]/);
    void km; void keyM;

    const kUse = body.match(/(\w+)\[(\(\(i-1\)%(\w+)\)\+1|i)\]/);
    const sUse = body.match(/(\w+)\[sub\+1\]/);
    if (!kUse || !sUse) return null;
    return { kind: 'sbox', keyVar: kUse[1], keyLenVar: kUse[3] || null, sboxVar: sUse[1] };
  }

  {
    const rm = body.match(/byte\(\w+,_0i\)[^\n;]*?(\w+)\(\s*_0i\s*\*\s*(\d+)\s*\+\s*(\d+)\s*,/);
    if (rm) return { kind: 'rollxor', k: parseInt(rm[2]), c: parseInt(rm[3]) };
    const rm2 = body.match(/byte\(\w+,_0i\)[^\n;]*?\(\s*_0i\s*\+\s*(\d+)\s*,/);
    if (rm2) return { kind: 'rollxor', k: 1, c: parseInt(rm2[1]) };
  }
  return null;
}

function applyRegDecoder(shape, input, content) {
  if (shape.kind === 'b85') {
    if (shape.trunc === null) return null;
    let s = input.replace(/[\s]/g, '');

    const zrep = String.fromCharCode(shape.offset).repeat(5);
    s = s.split('z').join(zrep);
    const out = [];
    for (let i = 0; i + 5 <= s.length; i += 5) {
      const ws = [0, 1, 2, 3, 4].map(k => s.charCodeAt(i + k) - shape.offset);
      if (ws.some(w => w < 0 || w > 84)) return null;
      const v = ws[0] * 52200625 + ws[1] * 614125 + ws[2] * 7225 + ws[3] * 85 + ws[4];
      out.push((v >>> 24) & 0xFF, (v >>> 16) & 0xFF, (v >>> 8) & 0xFF, v & 0xFF);
    }
    return out.slice(0, shape.trunc).map(b => String.fromCharCode(b)).join('');
  }
  if (shape.kind === 'sbox') {
    const key = byteTable(content, shape.keyVar);
    if (!key || !key.length) return null;
    const sbox = byteTable(content, shape.sboxVar);
    if (!sbox || sbox.length < 200) return null;
    return sboxForward(input, key, sbox);
  }
  if (shape.kind === 'rollxor') {
    const out = [];
    for (let i = 0; i < input.length; i++) {
      out.push(String.fromCharCode((input.charCodeAt(i) ^ (((i + 1) * shape.k + shape.c) & 0xFF)) & 0xFF));
    }
    return out.join('');
  }
  return null;
}

function peelRegBootstrap(content) {
  try {
    const found = findRegStates(content);
    if (!found) return { ok: false, reason: 'reg: no state machine' };
    const walk = walkRegChain(found);
    if (walk.loop) return { ok: false, reason: 'reg: state loop without exit' };
    if (walk.missing !== undefined) return { ok: false, reason: 'reg: missing state ' + walk.missing };
    if (walk.stuck) return { ok: false, reason: 'reg: state chain stuck' };
    if (!walk.done) return { ok: false, reason: 'reg: chain has no exit' };
    const { states } = found;
    const loadstr = resolveLoadstring(content);

    const helpers = {};
    {
      const re = /local function (\w+)\(/g;
      let m;
      while ((m = re.exec(content)) !== null) {
        if (helpers[m[1]]) continue;
        const shape = decoderKind(content, m[1]);
        if (shape) helpers[m[1]] = shape;
      }
    }

    let execPayloads = [];
    const pcallAlias = bareAlias(content, 'pcall') || 'pcall';
    for (const id of walk.path) {
      const body = states.get(id);
      if (!loadstr || !body.includes(pcallAlias + '(' + loadstr)) continue;
      const re = new RegExp(`${pcallAlias}\\(${loadstr},`, 'g');
      let m;
      while ((m = re.exec(body)) !== null) {
        let j = m.index + m[0].length, depth = 0, ins = false, q = '';
        const astart = j;
        let aend = -1;
        while (j < body.length) {
          const ch = body[j];
          if (ins) { if (ch === q && body[j - 1] !== '\\') ins = false; j++; continue; }
          if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
          if (ch === '(') depth++;
          else if (ch === ')') { if (depth === 0) { aend = j; break; } depth--; }
          else if (ch === ',' && depth === 0) { aend = j; break; }
          j++;
        }
        if (aend === -1) continue;
        const arg = body.slice(astart, aend).trim();
        const dm = arg.match(/^(\w+)\((\w+)\)$/);
        execPayloads.push(dm ? { dec: dm[1], src: dm[2] } : { dec: null, src: arg });
      }
      if (execPayloads.length) break;
    }
    if (!execPayloads.length) return { ok: false, reason: 'reg: no EXEC state found' };

    const values = {};
    const applyOne = (varName, fnName, argText) => {
      const shape = helpers[fnName];
      if (!shape) return `unknown decoder ${fnName}`;

      let input = null;
      const t = argText.trim();
      if (t.startsWith('[')) {
        const blob = regBlob(null, t);
        if (!blob || blob.kind !== 'text') return 'bad blob literal';
        input = blob.text;
      } else if (t.startsWith('"')) {
        const lit = luaStrLit(t);
        if (!lit) return 'bad string literal';
        input = lit.str;
      } else {
        const vm = t.match(/^(\w+)( or "")?$/);
        if (!vm || values[vm[1]] === undefined) return `unknown input ${t}`;
        input = values[vm[1]];
      }
      const dec = applyRegDecoder(shape, input, content);
      if (dec === null) return `decode failed (${fnName})`;
      values[varName] = dec;
      return null;
    };
    for (const id of walk.path) {
      const body = states.get(id);

      const re = /(?:^|[;\s])(\w+)=([A-Za-z_]\w*)\(/g;
      let m;
      if (process.env.CLYDE_DEBUG) console.error(`[replay] state ${id} len=${body.length}`);
      while ((m = re.exec(body)) !== null) {
        const [varName, fnName] = [m[1], m[2]];
        if (/^(if|while|for|do|local|return|break|end)$/.test(fnName)) continue;
        if (fnName === found.sv) continue;
        if (process.env.CLYDE_DEBUG) console.error(`[replay] ${varName} = ${fnName}(...)`);

      let j = m.index + m[0].length, depth = 1, ins = false, q = '';
        while (j < body.length) {
          const ch = body[j];
          if (ins) { if (ch === q && body[j - 1] !== '\\') ins = false; j++; continue; }
          if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
          if (ch === '[' && body[j + 1] === '[') { const e = body.indexOf(']]', j); j = e === -1 ? body.length : e + 2; continue; }
          if (ch === '[' && body[j + 1] === '=') {
            const lvl = body.slice(j).match(/^\[=*\[/);
            if (lvl) { const e = body.indexOf(']' + '='.repeat(lvl[0].length - 2) + ']', j); j = e === -1 ? body.length : e + lvl[0].length; continue; }
          }
          if (ch === '(') depth++;
          else if (ch === ')') { depth--; if (depth === 0) break; }
          j++;
        }
        const argText = body.slice(m.index + m[0].length, j);
        const err = applyOne(varName, fnName, argText);

        if (process.env.CLYDE_DEBUG && err) console.error(`[replay]   err: ${err}`);
        void err;
      }
    }

    for (const execPayload of execPayloads) {
      let inner = null;
      if (execPayload.dec) {
        const src = values[execPayload.src];
        if (src === undefined) continue;
        const shape = helpers[execPayload.dec];
        if (!shape) continue;
        inner = applyRegDecoder(shape, src, content);
      } else {
        inner = values[execPayload.src];
        if (inner === undefined) continue;
      }
      if (typeof inner === 'string' && inner.length > 100) return { ok: true, inner };
    }
    return { ok: false, reason: 'reg: EXEC payload not Lua' };
  } catch (e) {
    return { ok: false, reason: 'reg bootstrap threw: ' + e.message };
  }
}

function constFold(expr) {
  const s = String(expr).trim();
  const toks = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if ('()+*/'.includes(ch)) { toks.push(ch); i++; continue; }
    if (ch === '-') { toks.push('-'); i++; continue; }
    const m = s.slice(i).match(/^(0x[0-9a-fA-F]+|\d+)/);
    if (!m) return null;
    toks.push(parseInt(m[1], m[1].startsWith('0x') ? 16 : 10));
    i += m[1].length;
  }
  let p = 0;
  function parseE() {
    let v = parseT();
    while (p < toks.length && (toks[p] === '+' || toks[p] === '-')) {
      const op = toks[p++];
      const r = parseT();
      if (v === null || r === null) return null;
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  function parseT() {
    let v = parseF();
    while (p < toks.length && (toks[p] === '*' || toks[p] === '/')) {
      const op = toks[p++];
      const r = parseF();
      if (v === null || r === null) return null;
      v = op === '*' ? v * r : Math.trunc(v / r);
    }
    return v;
  }
  function parseF() {
    if (toks[p] === '-') { p++; const v = parseF(); return v === null ? null : -v; }
    if (toks[p] === '(') { p++; const v = parseE(); if (toks[p] !== ')') return null; p++; return v; }
    if (typeof toks[p] === 'number') return toks[p++];
    return null;
  }
  const v = parseE();
  return p === toks.length ? v : null;
}
function luaStrLit(s) {
  if (s[0] !== '"') return null;
  let out = '', j = 1;
  while (j < s.length) {
    const ch = s[j];
    if (ch === '"') return { str: out, end: j };
    if (ch === '\\') {
      const m = s.slice(j).match(/^\\(\d{1,3})/);
      if (m) { out += String.fromCharCode(parseInt(m[1], 10) & 0xFF); j += m[0].length; continue; }
      const e2 = s[j + 1];
      if (e2 === 'n') { out += '\n'; j += 2; continue; }
      if (e2 === 'r') { out += '\r'; j += 2; continue; }
      if (e2 === '"') { out += '"'; j += 2; continue; }
      if (e2 === '\\') { out += '\\'; j += 2; continue; }
      out += ch; j++; continue;
    }
    out += ch; j++;
  }
  return null;
}
function isLuaLike(s) {
  if (!s || s.length < 10) return false;
  return /local\s+\w|function\s*\(|return\s|if\s+.*\sthen|for\s+.*\sdo|print\s*\(|getfenv|_G/.test(s);
}

function findFragConcat(code) {
  const isIdStart = (ch) => (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_';
  const isIdChar = (ch) => isIdStart(ch) || (ch >= '0' && ch <= '9');
  const readIdent = (p) => {
    if (p >= code.length || !isIdStart(code[p])) return null;
    let j = p + 1;
    while (j < code.length && isIdChar(code[j])) j++;
    return { name: code.slice(p, j), end: j };
  };
  const declRe = /local (\w+)=/g;
  let dm;
  while ((dm = declRe.exec(code)) !== null) {
    let p = dm.index + dm[0].length;
    const f0 = readIdent(p);
    if (!f0) continue;
    const order = [f0.name];
    p = f0.end;
    for (;;) {
      if (!code.startsWith('..', p)) break;
      const fn = readIdent(p + 2);
      if (!fn) break;
      order.push(fn.name);
      p = fn.end;
    }
    if (order.length >= 2) return { mode: 'dotdot', outVar: dm[1], order };
  }
  const tRe = /local (\w+)=\{/g;
  while ((dm = tRe.exec(code)) !== null) {
    const tName = dm[1];
    let p = dm.index + dm[0].length;
    const order = [];
    let ok = true;
    for (;;) {
      while (p < code.length && (code[p] === ' ' || code[p] === '\t' || code[p] === ',')) p++;
      if (p < code.length && code[p] === '}') break;
      const fn = readIdent(p);
      if (!fn) { ok = false; break; }
      order.push(fn.name);
      p = fn.end;
    }
    if (!ok || order.length < 2) continue;

    const tail = code.slice(p + 1, p + 160);
    const tm = tail.match(/^\s*\nlocal (\w+)=\w+\(/);
    if (!tm) continue;
    const after = code.slice(p + 1 + tm[0].length, p + 1 + tm[0].length + tName.length + 2);
    if (after.startsWith(tName + ')')) return { mode: 'table', outVar: tm[1], order };
  }
  return null;
}
function getStrLit(code, varName) {
  const m = code.match(new RegExp(`local ${varName}="([^"]*)"`));
  if (!m) return null;
  const p = luaStrLit('"' + m[1] + '"');
  return p ? p.str : null;
}
function getNumArr(code, varName) {
  const m = code.match(new RegExp(`local ${varName}=\\{([\\d,\\s]+)\\}`));
  if (!m) return null;
  return m[1].split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
}
function b64decode(encoded, alpha) {
  const lut = {};
  for (let i = 0; i < alpha.length; i++) lut[alpha[i]] = i;
  const out = [];
  for (let i = 0; i < encoded.length; i += 4) {
    const a = lut[encoded[i]] ?? 0, b = lut[encoded[i + 1]] ?? 0;
    const c2 = encoded[i + 2], d2 = encoded[i + 3];
    const cc = c2 === '=' ? 0 : (lut[c2] ?? 0);
    const dd = d2 === '=' ? 0 : (lut[d2] ?? 0);
    out.push(((a << 2) | (b >> 4)) & 0xFF);
    if (c2 !== '=' && c2 !== undefined) out.push((((b & 0xF) << 4) | (cc >> 2)) & 0xFF);
    if (d2 !== '=' && d2 !== undefined) out.push((((cc & 0x3) << 6) | dd) & 0xFF);
  }
  return out;
}
function lzssDecompress(data) {
  const out = [];
  let p = 0;
  while (p < data.length) {
    const flag = data[p++];
    for (let bit = 0; bit < 8 && p < data.length; bit++) {
      if ((flag >> bit) & 1) { out.push(data[p++]); }
      else {
        if (p + 1 >= data.length) break;
        const v = data[p] * 256 + data[p + 1]; p += 2;
        const off = (v >> 4) + 1, len = (v & 0xF) + 3;
        for (let k = 0; k < len; k++) out.push(out[out.length - off]);
      }
    }
  }
  return out;
}

function peelStub(code) {
  const asm = findFragConcat(code);
  if (!asm) return { ok: false, reason: 'stub: no frag concat' };
  let encoded = '';
  for (const v of asm.order) {
    const s = getStrLit(code, v);
    if (s === null) return { ok: false, reason: 'stub: frag ' + v + ' missing' };
    encoded += s;
  }

  const loopRe = /for (\w+)=1,#(\w+) do (\w+)=\3\.\.\w+\(\w+\((\w+)\[\1\],(\d+)\)\) end/g;
  let m;
  const pieces = [];
  while ((m = loopRe.exec(code)) !== null) pieces.push([m[2], parseInt(m[5])]);
  if (!pieces.length) return { ok: false, reason: 'stub: no alpha loops' };
  let alpha = '';
  for (const [p, key] of pieces) {
    const arr = getNumArr(code, p);
    if (!arr) return { ok: false, reason: 'stub: alpha piece ' + p + ' missing' };
    for (const b of arr) alpha += String.fromCharCode(b ^ key);
  }
  const std = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  if ([...alpha].sort().join('') !== std.split('').sort().join('')) return { ok: false, reason: 'stub: bad alpha' };

  const ktM = code.match(/local (\w+)=\{([\d,\s]{20,}?)\}[\s\S]{0,400}?local (\w+)=0 for _i=1,#\1 do \3=(\w+)\(\3,\1\[_i\]\) end/);
  if (!ktM) return { ok: false, reason: 'stub: no keytable' };
  const ktArr = ktM[2].split(',').map(s => parseInt(s.trim())).filter(n => Number.isFinite(n));
  let kv = 0;
  for (const b of ktArr) kv ^= b;
  kv &= 0xFF;
  if (kv === 0) kv = 1;
  const raw = b64decode(encoded, alpha);

  const rollM = code.match(/local _dk=(\w+)\s*\n\s*local _ds=(\d+)/) || code.match(/local (\w+)=(\w+)\s*\n\s*local (\w+)=(\d+)\s*\nfor [^\n]*_dk/);
  let dec;
  if (/local _dk=/.test(code)) {
    const dsM = code.match(/local _ds=(\d+)/);
    const ds = dsM ? parseInt(dsM[1]) : 0;

    const dkM = code.match(/local _dk=(\w+)/);
    dec = [];
    let rk = kv;
    for (let i = 0; i < raw.length; i++) { dec.push((raw[i] ^ rk) & 0xFF); rk = (rk + ds) & 0xFF; }
  } else {
    const cands = [
      raw.map(b => (b ^ kv) & 0xFF),
      raw.map(b => (b - kv + 256) & 0xFF),
      raw.map(b => (b + kv) & 0xFF),
    ];
    dec = null;
    for (const c of cands) {
      const de = lzssDecompress(c);
      const s = de.map(b => String.fromCharCode(b)).join('');
      if (isLuaLike(s)) { dec = c; break; }
    }
    if (!dec) return { ok: false, reason: 'stub: no decrypt variant validates' };
  }
  const inner = lzssDecompress(dec).map(b => String.fromCharCode(b)).join('');
  if (!isLuaLike(inner)) return { ok: false, reason: 'stub: inner not Lua' };
  return { ok: true, inner };
}

function peelNested(code) {
  const asm = findFragConcat(code);
  if (!asm) return { ok: false, reason: 'nested: no frag concat' };
  let encoded = '';
  for (const v of asm.order) {
    const s = getStrLit(code, v);
    if (s === null) return { ok: false, reason: 'nested: frag ' + v + ' missing' };
    encoded += s;
  }

  const loopRe = /for (\w+)=1,#(\w+) do (\w+)=\3\.\.\w+\(\w+\((\w+)\[(\w+)\],(\d+)\)\) end/g;

  const loopRe2 = /for \w+=1,#(\w+) do \w+=\w+\.\.\w+\(\w+\((\w+)\[\w+\],(\d+)\)\) end/g;
  let m;
  const pieces = [];
  const loopRe3 = /#(\w+)\]=\w+\(\w+\((\w+)\[\w+\],(\d+)\)\) end/g;

  const allLoops = [...code.matchAll(/for (\w+)=1,#(\w+) do ([\s\S]{0,160}?) end/g)];
  for (const lm of allLoops) {
    const bm = lm[3].match(/(\w+)\[(\w+)\],(\d+)\)\)/);
    if (bm && lm[3].includes('..')) pieces.push([lm[2], parseInt(bm[3])]);
  }
  if (!pieces.length) return { ok: false, reason: 'nested: no alpha loops' };
  let alpha = '';
  for (const [p, key] of pieces) {
    const arr = getNumArr(code, p);
    if (!arr) return { ok: false, reason: 'nested: alpha piece ' + p + ' missing' };
    for (const b of arr) alpha += String.fromCharCode(b ^ key);
  }
  const std = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  if ([...alpha].sort().join('') !== std.split('').sort().join('')) return { ok: false, reason: 'nested: bad alpha' };
  const raw = b64decode(encoded, alpha);

  const rotUse = code.match(/(\w+)\[(\w+)\]=(\w+)\((\w+)\[(\w+)\](\w+),(\w+)\+256,0xFF\)/);

  const rotUse2 = code.match(/(\w+)\[(\w+)\]=(\w+)\((\w+)\[(\w+)\]-(\w+)\+256,0xFF\)/);
  let rotKey = null;
  if (rotUse2) {
    const rv = rotUse2[6];
    const av = (v) => { if (v.startsWith('(0-')) return -parseInt(v.slice(3, -1)); return parseInt(v); };
    let rm0 = code.match(new RegExp(`local ${rv}=(-?\\d+|\\(0-\\d+\\))\\s+${rv}=${rv}\\+(-?\\d+|\\(\\d+-\\d+\\))`));
    if (rm0) rotKey = (av(rm0[1]) + av(rm0[2])) & 0xFF;
    else {
      const rm1 = code.match(new RegExp(`local (\\w+)=(-?\\d+|\\(0-\\d+\\))\\s+local (\\w+)=(-?\\d+|\\(0-\\d+\\))[\\s\\S]{0,80}?local ${rv}=\\1\\+\\3`));
      if (rm1) rotKey = (av(rm1[2]) + av(rm1[4])) & 0xFF;
    }
  }
  if (rotKey === null) return { ok: false, reason: 'nested: no rotKey' };
  const arr = raw.map(b => (b - rotKey + 256) & 0xFF);

  const kbRe = /do local (\w+)=([^\n]*)\nfor (\w+)=1,#(\w+) do \4\[\3\]=(\w+)\(\4\[\3\],\1\) \1=(\w+)\(\1\+(\d+),0xFF\) end\nend/g;
  while ((m = kbRe.exec(code)) !== null) {
    const initExpr = m[2];
    let xk;
    let mm2 = initExpr.match(/^(\d+)\+(-?\d+|\(\d+-\d+\))$/);
    const av2 = (v) => v.startsWith('(') ? constFold(v) : parseInt(v);
    if (mm2) xk = (av2(mm2[1]) + av2(mm2[2])) & 0xFF;
    else {
      mm2 = initExpr.match(/^(\d+)\*(\d+)\+(-?\d+|\(\d+-\d+\))$/);
      if (!mm2) return { ok: false, reason: 'nested: bad key init ' + initExpr.slice(0, 40) };
      xk = (av2(mm2[1]) * av2(mm2[2]) + av2(mm2[3])) & 0xFF;
    }
    const step = parseInt(m[7]);
    let rk = xk;
    for (let i = 0; i < arr.length; i++) { arr[i] = (arr[i] ^ rk) & 0xFF; rk = (rk + step) & 0xFF; }
  }
  if (!arr.length) return { ok: false, reason: 'nested: empty' };
  const prefixLen = arr[0];
  const inner = arr.slice(1 + prefixLen).map(b => String.fromCharCode(b)).join('');
  if (!isLuaLike(inner)) return { ok: false, reason: 'nested: inner not Lua' };
  return { ok: true, inner };
}

function peelCipher(code) {
  let encoded = '';
  {
    const asm = findFragConcat(code);
    if (asm) {
      for (const v of asm.order) {
        const s = getStrLit(code, v);
        if (s === null) return { ok: false, reason: 'cipher: frag ' + v + ' missing' };
        encoded += s;
      }
    } else {
      const b64m = code.match(/for \w+=1,#(\w+),4 do/);
      if (!b64m) return { ok: false, reason: 'cipher: no frag concat' };
      const dataVar = b64m[1];
      const cm = code.match(new RegExp(`local ${dataVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=\\w+\\((\\w+)\\)`));
      if (!cm) return { ok: false, reason: 'cipher: no concat source' };
      const tbl = cm[1];
      const parts = [];
      const fre = new RegExp(`${tbl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[(\\d+)\\]="([^"]*)"`, 'g');
      let fm;
      while ((fm = fre.exec(code)) !== null) parts.push([parseInt(fm[1]), fm[2]]);
      if (!parts.length) return { ok: false, reason: 'cipher: no indexed frags' };
      parts.sort((a, b) => a[0] - b[0]);
      const litOf = (s) => { const p = luaStrLit('"' + s + '"'); return p ? p.str : null; };
      for (const [, s] of parts) {
        const d = litOf(s);
        if (d === null) return { ok: false, reason: 'cipher: bad frag escapes' };
        encoded += d;
      }
    }
  }
  const std = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const sorted = std.split('').sort().join('');
  let alpha = null;
  const re = /local (\w+)="([^"]{64})"/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    if ([...m[2]].sort().join('') === sorted) { alpha = m[2]; break; }
  }
  if (!alpha) return { ok: false, reason: 'cipher: no alpha' };
  const raw = b64decode(encoded, alpha);

  let boxT = null, pkV = null;
  {
    const dl = code.match(/for (\w+)=1,#(\w+) do\s+(\w+)\[(\w+)\]=(\w+)\((\w+)\.(\w+)\((\w+)\[(\w+)\[(\w+)\]\],(\w+)\)\)/);
    if (dl) { boxT = dl[8]; pkV = dl[11]; }
    else {
      const gdl = code.match(/(\w+)\[(\w+)\]\s*=\s*(?:\w+\.)?\w+\(\s*(\w+)\[\s*(\w+)\[\s*(\w+)\s*\]\s*\]\s*,\s*(\w+)\s*\)/);
      if (!gdl) return { ok: false, reason: 'cipher: no decrypt loop' };
      boxT = gdl[3]; pkV = gdl[6];
    }
  }
  const seedM = code.match(new RegExp(`local ${pkV}=(\\d+)`));
  if (!seedM) return { ok: false, reason: 'cipher: no seed' };
  const stepM = code.match(new RegExp(`${pkV}=(\\w+)\\.\\w+\\(${pkV}\\+(\\d+),0xFF\\)`));
  if (!stepM) return { ok: false, reason: 'cipher: no step' };
  const boxRe = new RegExp(`${boxT}\\[(\\d+)\\]=(\\d+)`, 'g');
  const isbox = new Array(256);
  let n = 0;
  while ((m = boxRe.exec(code)) !== null) { isbox[parseInt(m[1])] = parseInt(m[2]); n++; }

  if (n < 200) {
    const chunkRe = /do local _t=\{([\d,\s]+)\} for _i=1,(\d+) do (\w+)\[(\d+)\+_i-1\]=_t\[_i\] end end/g;
    while ((m = chunkRe.exec(code)) !== null) {
      const vals = m[1].split(',').map(s => parseInt(s.trim())).filter(v => Number.isFinite(v));
      const off = parseInt(m[4]);
      vals.forEach((v, k) => { isbox[off + k] = v; n++; });
    }
  }
  if (n < 200) return { ok: false, reason: 'cipher: isbox incomplete ' + n };
  let pk = parseInt(seedM[1]);
  const step = parseInt(stepM[2]);
  const chars = [];
  for (let i = 0; i < raw.length; i++) { chars.push(String.fromCharCode(isbox[raw[i]] ^ pk)); pk = (pk + step) & 0xFF; }
  const s = chars.join('');
  if (!s.length) return { ok: false, reason: 'cipher: empty' };
  const prefixLen = s.charCodeAt(0);
  const inner = s.slice(1 + prefixLen);
  if (!isLuaLike(inner)) return { ok: false, reason: 'cipher: inner not Lua' };
  return { ok: true, inner };
}

function maxHelperAliases(core) {
  const H = {};
  const re = /local (\w+)=(\w+)\["((?:\\\d+)+)"\]\["((?:\\\d+)+)"\]/g;
  let m;
  const dec = (s) => s.replace(/\\(\d{1,3})/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  while ((m = re.exec(core)) !== null) {
    const lib = dec(m[3]), fn = dec(m[4]);
    H[`${lib}.${fn}`] = m[1];
  }
  return H;
}
function liftMaxCore(core) {
  try {
    const tailM = core.match(/local (\w+)=\{\{-[\s\S]{0,200}?\}\}\s*\nlocal (\w+)="((?:\\[0-9]{3}|[^"])*)"\s*\nreturn (\w+)\(\1,\2,/);

    let poolsVar, codeVar, entryName;
    {
      const cands = [...core.matchAll(/return\s+(\w+)\((\w+),(\w+),/g)];
      let found = false;
      for (let k = cands.length - 1; k >= 0; k--) {
        const [en, pv, cv] = [cands[k][1], cands[k][2], cands[k][3]];
        if (new RegExp(`local\\s+${pv}\\s*=\\s*\\{\\{`).test(core)) {
          entryName = en; poolsVar = pv; codeVar = cv; found = true; break;
        }
      }
      if (!found) return { ok: false, reason: 'maxcore: no pools tail' };
    }

    const codeDefM = core.match(new RegExp(`local\\s+${codeVar}\\s*="((?:\\\\[0-9]{3}|[^"])*)"`));
    if (!codeDefM) return { ok: false, reason: 'maxcore: no code string' };
    const codeLit = luaStrLit('"' + codeDefM[1] + '"');
    if (!codeLit) return { ok: false, reason: 'maxcore: bad code string escapes' };
    const codeBytes = [...codeLit.str].map(ch => ch.charCodeAt(0));

    const entryDefIdx = core.search(new RegExp(`local function ${entryName}\\(`));
    if (entryDefIdx === -1) return { ok: false, reason: 'maxcore: no entry def' };
    const entryText = core.slice(entryDefIdx, entryDefIdx + 12000);
    const H = maxHelperAliases(core);
    const bxor = H['bit32.bxor'], band = H['bit32.band'];
    if (!bxor || !band) return { ok: false, reason: 'maxcore: helpers not found' };

    const bkM = entryText.match(/local (\w+)=\w+\((0x[0-9a-fA-F]+),(\w+)\*(0x[0-9a-fA-F]+)\)/);
    if (!bkM) return { ok: false, reason: 'maxcore: no rolling key' };
    const baseKey = parseInt(bkM[2], 16), idxMul = parseInt(bkM[4], 16);

    const plM = entryText.match(/if \w+\[1\]==-998 then local \w+=(\w+)\[\w+\[2\]\]/);
    if (!plM) return { ok: false, reason: 'maxcore: no pools list ref' };
    const poolsListVar = plM[1];

    const plDefM = core.match(new RegExp(`(?:local\\s+)?${poolsListVar}\\s*=\\s*\\{\\{`));
    if (!plDefM) return { ok: false, reason: 'maxcore: no pools list def' };
    const poolsT = parsePoolTable(core, core.indexOf('{{', plDefM.index));
    if (!poolsT) return { ok: false, reason: 'maxcore: pools parse failed' };

    const pvM = entryText.match(/local _pv=\w+\((0x[0-9a-fA-F]+),0xFF\)/);
    const kaM = entryText.match(/local _ka=\w+\((0x[0-9a-fA-F]+),0xFF\)[\s\S]{0,120}?local _kb=\w+\((0x[0-9a-fA-F]+),0xFF\)|local _ka=\w+\((0x[0-9a-fA-F]+),0xFF\)/);
    const csM = entryText.match(/local _cs=(0x[0-9a-fA-F]+)/);

    const kDefM = core.match(new RegExp(`local\\s+${poolsVar}\\s*=\\s*(\\{)`));
    if (!kDefM) return { ok: false, reason: 'maxcore: no K table def' };
    const kStart = core.indexOf('{', kDefM.index);

    const K = [];
    {
      let j = kStart, depth = 0, instr = false, q = '';
      while (j < core.length) {
        const ch = core[j];
        if (instr) { if (ch === q && core[j - 1] !== '\\') instr = false; j++; continue; }
        if (ch === '"' || ch === "'") { instr = true; q = ch; j++; continue; }
        if (ch === '{') depth++;
        if (ch === '}') { depth--; if (depth === 0) break; }
        j++;
      }
      const kText = core.slice(kStart + 1, j);

      const items = [];
      let d2 = 0, cur = '', ins2 = false, q2 = '';
      for (let k = 0; k < kText.length; k++) {
        const ch = kText[k];
        if (ins2) { cur += ch; if (ch === q2 && kText[k - 1] !== '\\') ins2 = false; continue; }
        if (ch === '"' || ch === "'") { ins2 = true; q2 = ch; cur += ch; continue; }
        if (ch === '{') d2++;
        if (ch === '}') d2--;
        if (ch === ',' && d2 === 0) { items.push(cur); cur = ''; continue; }
        cur += ch;
      }
      if (cur.trim()) items.push(cur);

      const poolsList = [];
      for (const e of poolsT.entries) {
        if (e.nums) poolsList.push(e.nums);
        else poolsList.push(null);
      }
      const doStrat = (byteV, dk, st) => {
        if (st === 0) return (byteV ^ dk) & 0xFF;
        if (st === 1) return (byteV - dk + 256) & 0xFF;
        if (st === 2) return (byteV ^ (((dk << 3) | (dk >>> 5)) & 0xFF)) & 0xFF;
        return (byteV - (dk ^ 0xAA) + 256) & 0xFF;
      };
      for (let idx = 0; idx < items.length; idx++) {
        const t = items[idx].trim();
        if (!t.startsWith('{')) { const v = constFold(t); K.push(v === null ? t : v); continue; }
        const inner = t.slice(1, -1).trim();
        if (inner.startsWith('-998')) {
          const parts = inner.split(',').map(s => s.trim());
          const pi = constFold(parts[1]) - 1, off = constFold(parts[2]), len = constFold(parts[3]);
          const pool = poolsList[pi];
          if (!pool) return { ok: false, reason: 'maxcore: bad pool idx' };
          let key = ((baseKey ^ ((idx + 1) * idxMul)) >>> 0);
          const st = ((key >>> 16) & 3) >>> 0;

          const out = [];
          for (let b = 0; b < len; b++) {
            const dk = key & 0xFF;
            const dc = doStrat(pool[off + b - 1], dk, st);
            out.push(String.fromCharCode(dc));
            key = ((key ^ dc) >>> 0);
            key = (((key << 7) | (key >>> 25)) >>> 0);
          }
          K.push(out.join(''));
        } else if (inner.startsWith('-999')) {
          const parts = inner.split(',').map(s => s.trim());
          K.push((constFold(parts[1]) ^ constFold(parts[2])) & 0xFF);
        } else {
          const bytes = inner.split(',').map(s => constFold(s.trim()));
          if (bytes.some(v => v === null)) return { ok: false, reason: 'maxcore: bad inline K' };
          let key = ((baseKey ^ ((idx + 1) * idxMul)) >>> 0);
          const st = ((key >>> 16) & 3) >>> 0;
          const out = [];
          for (const b of bytes) {
            const dk = key & 0xFF;
            const dc = doStrat(b, dk, st);
            out.push(String.fromCharCode(dc));
            key = ((key ^ dc) >>> 0);
            key = (((key << 7) | (key >>> 25)) >>> 0);
          }
          K.push(out.join(''));
        }
      }
    }

    let vleM = null;
    {
      const decDef = entryText.match(/local function (\w+)\(_enc\)/) || core.match(/local function (\w+)\(_enc\)/);
      const bodies = [];
      if (decDef) {
        const bs = entryText.indexOf(`local function ${decDef[1]}(_enc)`);
        bodies.push(entryText.slice(bs < 0 ? 0 : bs, (bs < 0 ? 0 : bs) + 3000));
      }
      bodies.push(entryText);
      for (const body of bodies) {
        const seeds = [...body.matchAll(/local \w+=\w+\((0x[0-9a-fA-F]+),0xFF\)/g)].map(x => x[1]);

        const kbM = body.match(/local \w+=\w+\(\w+\((0x[0-9a-fA-F]+),8\),0xFF\)/);
        const csM = body.match(/local \w+=(0x[0-9a-fA-F]{7,8})(?![0-9a-fA-F])/);
        if (seeds.length >= 1 && kbM && csM) {
          const h = parseInt(kbM[1], 16);
          vleM = [null, seeds[0], '0x' + (h & 0xFF).toString(16), '0x' + ((h >> 8) & 0xFF).toString(16), csM[1]];
          break;
        }
        if (seeds.length >= 3 && csM) { vleM = [null, seeds[0], seeds[1], seeds[2], csM[1]]; break; }
      }
    }
    if (!vleM) return { ok: false, reason: 'maxcore: no VLE seeds' };
    let _b = codeBytes.slice();
    const pvS = parseInt(vleM[1], 16) & 0xFF;
    _b = _b.map(v => (v ^ pvS) & 0xFF);
    let ka = parseInt(vleM[2], 16) & 0xFF, kb = parseInt(vleM[3], 16) & 0xFF;
    _b = _b.map(v => { const o = (v - ka + 256) & 0xFF; const t = (ka + kb) & 0xFF; ka = kb; kb = t; return o; });
    let cs = parseInt(vleM[4], 16) >>> 0;
    _b = _b.map((v, i) => {
      const o = (v ^ (cs & 0xFF)) & 0xFF;
      if (cs % 2 === 0) cs = cs >>> 1;
      else cs = ((cs * 3 + 1) & 0x7FFFFFFF) >>> 0;
      if (cs <= 1) cs = ((parseInt(vleM[4], 16) ^ (i + 1)) | 2) >>> 0;
      return o;
    });

    const code = [];
    {
      let p = 0;
      while (p < _b.length) {
        const v = _b[p];
        if (v === 255) { code.push(-1); p += 1; }
        else if (v < 128) { code.push(v); p += 1; }
        else if (v < 192) { code.push((v - 128) * 256 + _b[p + 1]); p += 2; }
        else if (v < 224) { code.push((v - 192) * 65536 + _b[p + 1] * 256 + _b[p + 2]); p += 3; }
        else { code.push((v - 224) * 16777216 + _b[p + 1] * 65536 + _b[p + 2] * 256 + _b[p + 3]); p += 4; }
      }
    }

    const A = vmAliases(core);
    if (!A.push || !A.pop || !A.getL || !A.setL || !A.resK) return { ok: false, reason: 'maxcore: alias discovery incomplete' };

    const opVarM = core.match(/if (\w+)==\d+ then do local \w+=/);
    if (!opVarM) return { ok: false, reason: 'maxcore: no inline chain' };
    const opVar = opVarM[1];
    const branchRe = new RegExp('(?:if|elseif) ' + opVar + '==(\\d+) then do', 'g');
    let bm;
    const shufMap = {};
    const branchMiss = [];
    const tagMap = aliasTagMap(A);
    while ((bm = branchRe.exec(core)) !== null) {
      const key = parseInt(bm[1]);
      const body = bodyFrom(core, bm.index + bm[0].length);
      if (body === null) { branchMiss.push(key); continue; }
      const hit = DBG_SKELETON_MAP[skeletonOf(body, tagMap)];
      if (hit === undefined) { branchMiss.push(key); continue; }
      shufMap[key] = hit;
    }
    if (!Object.keys(shufMap).length) return { ok: false, reason: 'maxcore: no inline branches mapped' };
    if (branchMiss.length > 20) return { ok: false, reason: 'maxcore: ' + branchMiss.length + ' branches unmapped' };

    let jumpKey = 0;
    {
      const jm = core.match(/local target=\w+\(\w+\[(\w+)\],(\w+)\)/);
      if (jm) {
        const jkm = core.match(new RegExp('local ' + jm[2] + '=(0x[0-9a-fA-F]+|\\d+)'));
        if (jkm) jumpKey = parseInt(jkm[1].startsWith('0x') ? jkm[1] : jkm[1], jkm[1].startsWith('0x') ? 16 : 10);
      }
    }

    const remapped = [];
    {
      let i = 0, badOp = null;
      while (i < code.length) {
        const sOp = code[i++];
        const base = shufMap[sOp];
        if (base === undefined) { badOp = sOp; break; }
        const argc = STACK_ARGCNT[base] ?? 0;
        remapped.push(base, ...code.slice(i, i + argc));
        i += argc;
      }
      if (badOp !== null && badOp !== undefined) return { ok: false, reason: 'maxcore: code op ' + badOp + ' not in map' };
    }

    const lifted = liftWithGoto(K, remapped, jumpKey);
    if (lifted.bad) return { ok: false, reason: 'maxcore lift: ' + lifted.bad };
    return { ok: true, output: lifted.out, K };
  } catch (e) {
    return { ok: false, reason: 'maxcore threw: ' + e.message };
  }
}

function parseNamedProtos(text, depth) {
  depth = depth || 0;
  if (depth > 6) return { ok: false, reason: 'max: protos too deep' };
  const items = splitTopLevel(text);
  const protos = [];
  for (const t of items) {
    const s = t.trim();
    if (!s.startsWith('{') || !s.endsWith('}')) return { ok: false, reason: 'max: bad proto item' };
    const fields = [];
    for (const f of splitTopLevel(s.slice(1, -1))) {
      const fm = f.trim().match(/^([A-Za-z_]\w*)\s*=\s*([\s\S]*)$/);
      if (!fm) return { ok: false, reason: 'max: bad proto field' };
      fields.push(fm[2].trim());
    }
    if (fields.length !== 5) return { ok: false, reason: `max: proto has ${fields.length} fields (want 5)` };
    const [kRaw, cRaw, pRaw, uRaw, nRaw] = fields;
    let nParams = 0;
    if (nRaw !== 'nil') {
      const nv = constFold(nRaw);
      if (typeof nv === 'number' && nv >= 0 && nv < 256) nParams = nv;
      else return { ok: false, reason: 'max: bad nParams' };
    }
    protos.push({ kRaw, cRaw, pRaw, uRaw, nParams, K: null, C: null, P: [], U: null, lifted: null, name: null });
  }
  return { ok: true, protos };
}

function liftMaxCore2(core) {
  try {
    let entryName = null, kVar = null, codeVar = null, protosVar = null;
    {
      const cands = [...core.matchAll(/return\s+(\w+)\((\w+),(\w+),(\w+)(?:,(\w+))?\)/g)];
      let found = false;
      for (let k = cands.length - 1; k >= 0; k--) {
        const [en, kv, cv] = [cands[k][1], cands[k][2], cands[k][3]];
        const kOk = new RegExp(`local\\s+${kv}\\s*=\\s*\\{`).test(core);
        const cOk = new RegExp(`local\\s+${cv}\\s*=\\s*[\\{"]`).test(core);
        if (kOk && cOk) { entryName = en; kVar = kv; codeVar = cv; protosVar = cands[k][5] || null; found = true; break; }
      }
      if (!found) return { ok: false, reason: 'maxcore2: no entry call' };
    }
    const runDefM = core.match(new RegExp(`local function ${entryName}\\(([^)]*)\\)`));
    if (!runDefM) return { ok: false, reason: 'maxcore2: no runner def' };

    let handlers = null, shufMap = {}, unmapped = [];
    const ht = mapHandlerTable(core);
    if (ht && !ht.reason) {
      handlers = ht.handlers;
      shufMap = ht.shufMap;
      unmapped = ht.unmapped;
    } else {
      const ic = mapInlineChain(core);
      if (!ic) return { ok: false, reason: 'maxcore2: no dispatch (' + (ht && ht.reason ? ht.reason : 'no chain') + ')' };
      shufMap = ic.shufMap; unmapped = ic.branchMiss; handlers = ic.handlers;
    }
    if (!Object.keys(shufMap).length) return { ok: false, reason: 'maxcore2: nothing mapped' };

    let kctx = null;
    {
      const schedM = core.match(/=\w+\((0x[0-9a-fA-F]{6,}),(\w+)\*(0x[0-9a-fA-F]{6,})\)/);
      if (schedM) {
        const plM = core.match(/local \w+=(\w+)\[_v\[2\]\]/);
        if (!plM) return { ok: false, reason: 'maxcore2: no pools ref' };
        const plDefM = core.match(new RegExp(`(?:local\\s+)?${plM[1]}\\s*=\\s*\\{\\{`));
        if (!plDefM) return { ok: false, reason: 'maxcore2: no pools def' };
        const poolsT = parsePoolTable(core, core.indexOf('{{', plDefM.index));
        if (!poolsT) return { ok: false, reason: 'maxcore2: pools parse failed' };
        const pools = poolsT.entries.map(e => e.nums || null);
        if (pools.some(p => !p)) return { ok: false, reason: 'maxcore2: non-flat pools' };
        kctx = { mode: 'sched', pools, baseKey: parseInt(schedM[1], 16) >>> 0, idxMul: parseInt(schedM[3], 16) >>> 0 };
      } else {
        const f1 = core.match(/band\((\d+)\+_p\*(\d+)\+\(_i-1\)/);
        const f2 = core.match(/band\((\d+)\+\(_j-1\)\*(\d+)\+\(_i-1\)/);
        if (!f1 && !f2) return { ok: false, reason: 'maxcore2: no K recipe' };
        const b = f1 ? parseInt(f1[1]) : parseInt(f2[1]);
        const s = f1 ? parseInt(f1[2]) : parseInt(f2[2]);
        kctx = { mode: 'plain', base: b, step: s };
      }
    }

    const kDefM = core.match(new RegExp(`local\\s+${kVar}\\s*=\\s*\\{`));
    if (!kDefM) return { ok: false, reason: 'maxcore2: no K table def' };
    const kBrace = braceSpan(core, core.indexOf('{', kDefM.index));
    if (!kBrace) return { ok: false, reason: 'maxcore2: K table unbalanced' };
    const rawItems = [];
    for (const t of splitTopLevel(kBrace.text.slice(1, -1))) {
      const e = parseKItemRaw(t);
      if (!e) return { ok: false, reason: 'maxcore2: bad K item' };
      rawItems.push(e);
    }
    const K = decodeKEntries(rawItems, kctx);
    if (!K) return { ok: false, reason: 'maxcore2: K decode failed' };

    let codeWords = null;
    {
      const cStrM = core.match(new RegExp(`local\\s+${codeVar}\\s*="((?:\\\\[0-9]{3}|[^"])*)"`));
      if (cStrM) {
        const lit = luaStrLit('"' + cStrM[1] + '"');
        if (!lit) return { ok: false, reason: 'maxcore2: bad code escapes' };
        const seeds = findVleSeeds(core);
        if (!seeds) return { ok: false, reason: 'maxcore2: no VLE seeds' };
        const bytes = [...lit.str].map(ch => ch.charCodeAt(0));
        codeWords = vleDecodeStage(bytes, seeds);
      } else {
        const cDefM = core.match(new RegExp(`local\\s+${codeVar}\\s*=\\s*\\{`));
        if (!cDefM) return { ok: false, reason: 'maxcore2: no code def' };
        const cBrace = braceSpan(core, core.indexOf('{', cDefM.index));
        if (!cBrace) return { ok: false, reason: 'maxcore2: code unbalanced' };
        const nums = numList(cBrace.text.slice(1, -1));
        if (!nums) return { ok: false, reason: 'maxcore2: code not flat' };
        const kd = core.match(/\[_i\]>=0 then \w+\[_i\]=bit32\.bxor\(\w+\[_i\],([^)]+)\)/);
        let ck = 0;
        if (kd) {
          const v = constFold(kd[1].trim());
          if (typeof v !== 'number') return { ok: false, reason: 'maxcore2: bad code key' };
          ck = v & 0xFF;
        }
        codeWords = ck ? nums.map(v => (v >= 0 ? (v ^ ck) : v)) : nums.slice();
      }
    }

    const jk = detectJumpKey(core, handlers, shufMap);
    if (jk.err) return { ok: false, reason: 'maxcore2: ' + jk.err };
    const rm = remapShuffled(codeWords, shufMap);
    if (rm.badOp !== null && rm.badOp !== undefined) {
      const near = codeWords.slice(Math.max(0, rm.badPos - 6), rm.badPos + 4).join(',');
      return { ok: false, reason: `maxcore2: code op ${rm.badOp} not in map at word ${rm.badPos}/${codeWords.length} (near: ${near})`, K };
    }
    const cb = ctxBitMap(core, rm.ctxPositions, handlers, shufMap);
    if (cb.err) return { ok: false, reason: 'maxcore2: ' + cb.err };

    let protos = [];
    if (protosVar) {
      const pDefM = core.match(new RegExp(`local\\s+${protosVar}\\s*=\\s*\\{`));
      if (pDefM) {
        const pBrace = braceSpan(core, core.indexOf('{', pDefM.index));
        if (!pBrace) return { ok: false, reason: 'maxcore2: protos unbalanced' };
        const inner = pBrace.text.slice(1, -1).trim();
        if (inner) {
          const pr = decodeNamedProtos(inner, kctx, core, 0);
          if (!pr.ok) return pr;
          protos = pr.protos;
        }
      }
    }
    return {
      ok: true, K, code: rm.remapped, shufMap, jumpKey: jk.jumpKey,
      ctxBits: cb.bits, ctxInit: cb.init ?? null, ctxPrime: cb.prime ?? null, ctxConst: cb.const ?? null,
      protos, kBase: null, kStep: null, codeKey: 0, unmapped,
    };
  } catch (e) {
    return { ok: false, reason: 'maxcore2 threw: ' + e.message };
  }
}

function decodeNamedProtos(text, kctx, core, depth) {
  depth = depth || 0;
  if (depth > 6) return { ok: false, reason: 'max: protos too deep' };
  const pr = parseNamedProtos(text, depth);
  if (!pr.ok) return pr;
  const seeds = findVleSeeds(core);
  const nonEmpty = (v) => v && v.trim() !== '{}' && v.trim() !== 'nil';
  for (const P of pr.protos) {
    if (nonEmpty(P.kRaw)) {
      const items = [];
      for (const t of splitTopLevel(P.kRaw.slice(1, -1))) {
        const e = parseKItemRaw(t);
        if (!e) return { ok: false, reason: 'max: bad proto K' };
        items.push(e);
      }
      const K = decodeKEntries(items, kctx);
      if (!K) return { ok: false, reason: 'max: proto K decode failed' };
      P.K = K;
    } else P.K = null;
    if (P.cRaw && P.cRaw.startsWith('"')) {
      const lit = luaStrLit(P.cRaw);
      if (!lit) return { ok: false, reason: 'max: bad proto code escapes' };
      if (!seeds) return { ok: false, reason: 'max: no VLE seeds for proto' };
      P.C = vleDecodeStage([...lit.str].map(ch => ch.charCodeAt(0)), seeds);
    } else if (nonEmpty(P.cRaw)) {
      const cn = numList(P.cRaw.slice(1, -1));
      if (!cn) return { ok: false, reason: 'max: proto C not flat' };
      P.C = cn;
    } else P.C = null;
    if (nonEmpty(P.pRaw)) {
      const sub = decodeNamedProtos(P.pRaw.slice(1, -1), kctx, core, depth + 1);
      if (!sub.ok) return sub;
      P.P = sub.protos;
    } else P.P = [];
    if (nonEmpty(P.uRaw)) {
      const U = [];
      for (const u of splitTopLevel(P.uRaw.slice(1, -1))) {
        const um = u.trim().match(/^\{(\d+),(\d+)\}$/);
        if (!um) return { ok: false, reason: 'max: bad U spec' };
        U.push([parseInt(um[1]), parseInt(um[2])]);
      }
      P.U = U;
    } else P.U = null;
  }
  return { ok: true, protos: pr.protos };
}

function bodyFrom(src, start) {
  let depth = 1, j = start, instr = false, q = '';
  while (j < src.length) {
    const ch = src[j];
    if (instr) { if (ch === q && src[j - 1] !== '\\') instr = false; j++; continue; }
    if (ch === '"' || ch === "'") { instr = true; q = ch; j++; continue; }
    if (ch === '-' && src[j + 1] === '-') { const nl = src.indexOf('\n', j); j = nl === -1 ? src.length : nl + 1; continue; }
    const rest = src.slice(j);
    if (/^elseif\b/.test(rest)) { j += 6; continue; }
    let kw = rest.match(/^(function|if|while)\b/);
    if (kw) { depth++; j += kw[1].length; if (kw[1] === 'while') { const d = rest.slice(kw[1].length).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; } continue; }
    kw = rest.match(/^for\b/);
    if (kw) { depth++; j += 3; const d = rest.slice(3).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; continue; }
    kw = rest.match(/^do\b/);
    if (kw) { depth++; j += 2; continue; }
    const em = rest.match(/^end\b/);
    if (em) { depth--; j += 3; if (depth === 0) return src.slice(start, j - 3); continue; }
    j++;
  }
  return null;
}

function liftChunk(K, code, jumpKey, opts) {
  jumpKey = jumpKey || 0;
  opts = opts || {};
  const out = [];
  const stack = [];
  const locals = Object.assign({}, opts.preload || {});
  const uvs = Object.assign({}, opts.uvs || {});
  const markStack = [];
  const forStack = [];
  let tmpN = 0;
  const tmp = (p) => `t_${p}_${tmpN++}`;
  const pop = () => stack.pop() ?? 'nil';
  const getL = (s) => (locals[s] !== undefined ? locals[s] : `l${s}`);

  const pcs = [];
  {
    let j = 0;
    while (j < code.length) {
      pcs.push(j);
      const op = code[j++];
      j += (STACK_ARGCNT[op] ?? 0);
    }
  }

  const rawToPc = (raw) => pcs.indexOf(raw);
  const targets = new Set();
  {
    let i = 0, wpc = 0;
    while (i < code.length) {
      const op = code[i++];
      const name = STACK_OP[op] ?? '';
      const argc = STACK_ARGCNT[op] ?? 0;
      const args = code.slice(i, i + argc); i += argc;
      if (name === 'JMP' || name === 'FORLOOP' || name === 'FORPREP' || name === 'JMP_F' || name === 'TFOR') {
        const pc = rawToPc(args[0] ^ jumpKey);
        if (pc !== -1) targets.add(pc);
      }
      if (name === 'FORPREP') targets.add(wpc + 1);
      wpc++;
    }
  }
  const callExpr = (f, a) => {
    if (a.length >= 1) {
      const m = /^(.*)\[(["']?)([A-Za-z_]\w*)\2\]$/.exec(f);
      if (m && m[1] === a[0]) {
        const rest = a.slice(1).join(', ');
        return `${m[1]}:${m[3]}(${rest})`;
      }
    }
    return `${f}(${a.join(', ')})`;
  };
  const doCall = (n, multi) => {
    const a = []; for (let k = 0; k < n; k++) a.unshift(pop());
    const f = pop();
    return { f, a };
  };
  let i = 0, pc = 0, widx = 0;
  while (i < code.length) {
    if (targets.has(pc)) out.push(`::L${pc}::`);
    const thisW = widx;
    const op = code[i++];
    const name = STACK_OP[op] ?? `OP_${op}`;
    const argc = STACK_ARGCNT[op] ?? 0;
    const args = code.slice(i, i + argc); i += argc;
    const thisPc = pc; pc++; widx++;
    switch (name) {
      case 'PUSH_NIL': stack.push('nil'); break;
      case 'PUSH_TRUE': stack.push('true'); break;
      case 'PUSH_FALSE': stack.push('false'); break;
      case 'PUSH_K': stack.push(luaLit(K[args[0]])); break;
      case 'LOAD_L': stack.push(getL(args[0])); break;
      case 'STORE_L': locals[args[0]] = pop(); break;
      case 'LOAD_G': stack.push(typeof K[args[0]] === 'string' ? K[args[0]] : luaLit(K[args[0]])); break;
      case 'STORE_G': { const v = pop(); out.push(`${K[args[0]]} = ${v};`); break; }
      case 'ADD': case 'SUB': case 'MUL': case 'DIV': case 'MOD': case 'POW': case 'IDIV': {
        const b = pop(), a = pop();
        stack.push(`(${a} ${{ADD:'+',SUB:'-',MUL:'*',DIV:'/',MOD:'%',POW:'^',IDIV:'//'}[name]} ${b})`); break;
      }
      case 'UNM': stack.push(`(-${pop()})`); break;
      case 'NOT': stack.push(`(not ${pop()})`); break;
      case 'LEN': stack.push(`(#${pop()})`); break;
      case 'EQ': case 'NE': case 'LT': case 'LE': case 'GT': case 'GE': case 'AND': case 'OR': {
        const b = pop(), a = pop();
        stack.push(`(${a} ${{EQ:'==',NE:'~=',LT:'<',LE:'<=',GT:'>',GE:'>=',AND:'and',OR:'or'}[name]} ${b})`); break;
      }
      case 'CONCAT': { const b = pop(), a = pop(); stack.push(`(${a} .. ${b})`); break; }
      case 'CONCAT_MULTI': { const n = args[0]; const a = []; for (let k = 0; k < n; k++) a.unshift(pop()); stack.push(`(${a.join(' .. ')})`); break; }
      case 'NEW_TABLE': stack.push('{}'); break;
      case 'GET_TABLE': { const k = pop(), t = pop(); stack.push(`${t}[${k}]`); break; }
      case 'SET_TABLE': { const v = pop(), k = pop(), t = pop(); out.push(`${t}[${k}] = ${v};`); break; }
      case 'SETLIST': {
        const m = markStack.pop();
        if (m === undefined) return { out: out.join('\n'), bad: `SETLIST without MARK at pc ${thisPc}` };
        const tbl = stack[m] ?? 'nil';
        stack.length = m + 1;
        out.push(`-- SETLIST into ${tbl};`);
        break;
      }
      case 'CALL': { const { f, a } = doCall(args[0]); out.push(callExpr(f, a) + ';'); stack.push('nil'); break; }
      case 'CALL_MULTI': {
        const n = args[0], nr = args[1];
        const { f, a } = doCall(n);
        out.push(callExpr(f, a) + ';');
        const cnt = nr >= 0 ? nr : 1;
        for (let k = 0; k < cnt; k++) stack.push('nil');
        break;
      }
      case 'TAILCALL': { const { f, a } = doCall(args[0]); out.push(`return ${callExpr(f, a)};`); break; }
      case 'CALL_DYNAMIC': {
        const nr = args[0];
        const m = markStack.pop();
        if (m !== undefined) stack.length = Math.min(stack.length, m);
        out.push(`-- dynamic call;`);
        const cnt = nr >= 0 ? nr : 1;
        for (let k = 0; k < cnt; k++) stack.push('nil');
        break;
      }
      case 'MARK': markStack.push(stack.length); break;
      case 'NAMECALL': {
        const obj = pop();
        const mk = K[args[0]];
        const mname = typeof mk === 'string' ? mk : luaLit(mk);
        const midx = /^[A-Za-z_]\w*$/.test(String(mname)) ? `.${mname}` : `[${mname}]`;
        stack.push(obj);
        stack.push(`${obj}${midx}`);
        break;
      }
      case 'POP': for (let k = 0; k < args[0]; k++) pop(); break;
      case 'PUSH_NILS': for (let k = 0; k < args[0]; k++) stack.push('nil'); break;
      case 'DUP': stack.push(stack.length ? stack[stack.length - 1] : 'nil'); break;
      case 'SWAP': {
        if (stack.length >= 2) { const t = stack[stack.length - 1]; stack[stack.length - 1] = stack[stack.length - 2]; stack[stack.length - 2] = t; }
        break;
      }
      case 'LOAD_UPVAL': stack.push(uvs[args[0]] !== undefined ? uvs[args[0]] : 'nil'); break;
      case 'STORE_UPVAL': {
        const v = pop();
        const cur = uvs[args[0]];
        if (cur && typeof cur === 'object' && cur.boxOf) cur.boxOf.map[cur.boxOf.key] = v;
        else if (cur !== undefined && typeof cur === 'string' && cur.startsWith('__uvbox')) { }
        else uvs[args[0]] = v;
        break;
      }
      case 'CLOSE_UPVAL': break;
      case 'LOAD_VARARG': {
        const n = args[0];
        if (n >= 0) { for (let k = 0; k < n; k++) stack.push('nil'); }
        else stack.push('nil');
        break;
      }
      case 'ITER_PREP': break;
      case 'RETURN': {
        if (args[0] === 0) out.push('return;');
        else { const a = []; for (let k = 0; k < args[0]; k++) a.unshift(pop()); out.push(`return ${a.join(', ')};`); }
        break;
      }
      case 'CLOSURE': {
        const pi = args[0];
        const protos = opts.protos || [];

        const P = protos.find(q => q.pi === pi) || protos[pi - 1];
        if (!P || !P.lifted) { stack.push('nil'); break; }
        stack.push(P.name);
        break;
      }
      case 'JMP': {
        const dp = rawToPc(args[0] ^ jumpKey);
        if (dp === -1) return { out: out.join('\n'), bad: `bad JMP dest ${args[0]}` };
        out.push(`goto L${dp};`);
        break;
      }
      case 'JMP_F': {
        const c = pop();
        const dp = rawToPc(args[0] ^ jumpKey);
        if (dp === -1) return { out: out.join('\n'), bad: `bad JMP_F dest ${args[0]}` };
        out.push(`if not (${c}) then goto L${dp}; end`);
        targets.add(pc);
        break;
      }
      case 'FORPREP': {
        const dp = rawToPc(args[0] ^ jumpKey);
        if (dp === -1) return { out: out.join('\n'), bad: `bad FORPREP dest ${args[0]}` };
        const step = pop(), limit = pop(), init = pop();
        const vn = tmpN++;
        const vi = `f_i_${vn}`, vl = `f_l_${vn}`, vs = `f_s_${vn}`;
        out.push(`local ${vi} = ${init}; local ${vl} = ${limit}; local ${vs} = ${step};`);
        out.push(`if (${vs} >= 0 and ${vi} > ${vl}) or (${vs} < 0 and ${vi} < ${vl}) then goto L${dp}; end`);
        forStack.push({ head: thisPc + 1, vi, vl, vs });
        break;
      }
      case 'FORLOOP': {
        const dp = rawToPc(args[0] ^ jumpKey);
        if (dp === -1) return { out: out.join('\n'), bad: `bad FORLOOP dest ${args[0]}` };
        const fr = forStack.pop();
        if (!fr) return { out: out.join('\n'), bad: `FORLOOP without FORPREP at pc ${thisPc}` };
        out.push(`${fr.vi} = ${fr.vi} + ${fr.vs};`);
        out.push(`if (${fr.vs} >= 0 and ${fr.vi} <= ${fr.vl}) or (${fr.vs} < 0 and ${fr.vi} >= ${fr.vl}) then goto L${fr.head}; end`);
        break;
      }
      case 'TFOR': {
        const nVars = args[0];
        const dp = rawToPc(args[1] ^ jumpKey);
        if (dp === -1) return { out: out.join('\n'), bad: `bad TFOR dest ${args[1]}` };
        const L0 = stack.length;
        const iter = stack[L0 - 3] ?? 'nil', state = stack[L0 - 2] ?? 'nil', ctl = stack[L0 - 1] ?? 'nil';
        const rn = tmp('for');
        out.push(`local ${rn} = {${iter}(${state}, ${ctl})};`);
        for (let k = 1; k <= nVars; k++) stack.push(`${rn}[${k}]`);
        out.push(`if ${rn}[1] == nil then goto L${dp}; end`);
        stack[L0 - 1] = `${rn}[1]`;
        break;
      }
      case 'PCALL': case 'XPCALL': {
        const n = args[0];
        const a = []; for (let k = 0; k < n; k++) a.unshift(pop());
        let handler = null;
        if (name === 'XPCALL') handler = pop();
        const f = pop();
        const rn = tmp('pc');
        const harg = name === 'XPCALL' ? `${handler}, ` : '';
        out.push(`local ${rn}_ok, ${rn}_r = ${name === 'XPCALL' ? 'xpcall' : 'pcall'}(${f}, ${harg}${a.join(', ')});`);
        stack.push(`${rn}_ok`); stack.push(`${rn}_r`);
        break;
      }
      case 'SO_ADD_LLL': case 'SO_SUB_LLL': case 'SO_MUL_LLL': {
        const sop = { SO_ADD_LLL: '+', SO_SUB_LLL: '-', SO_MUL_LLL: '*' }[name];
        locals[args[2]] = `(${getL(args[0])} ${sop} ${getL(args[1])})`; break;
      }
      case 'SO_LOADK_L': locals[args[1]] = luaLit(K[args[0]]); break;
      case 'SO_MOVE_LL': locals[args[1]] = getL(args[0]); break;
      case 'SO_ADD_LLK': locals[args[2]] = `(${getL(args[0])} + ${luaLit(K[args[1]])})`; break;
      case 'SO_CONCAT_LLL': locals[args[2]] = `(${getL(args[0])} .. ${getL(args[1])})`; break;
      case 'SO_TOP': case 'SO_STACKREAD': case 'SO_BXOR': break;
      case 'CTX_LOAD': {
        const bits = opts.ctxBits;
        if (!bits || !bits.has(thisW)) return { out: out.join('\n'), bad: `CTX_LOAD at pc ${thisPc} without ctx bits` };
        if (bits.get(thisW) === 0) stack.push(getL(args[0]));
        else stack.push(luaLit(K[args[0]]));
        break;
      }
      case 'NOP': break;
      default:
        return { out: out.join('\n'), bad: `unhandled ${name} at pc ${thisPc}` };
    }
  }
  const decls = Object.entries(locals).map(([k, v]) => `local l${k} = ${v};`);
  return { out: [...decls, ...out].join('\n'), bad: null };
}

function liftWithGoto(K, code, jumpKey) {
  return liftChunk(K, code, jumpKey, {});
}

function splitTopLevel(text) {
  const items = [];
  let d = 0, cur = '', ins = false, q = '';
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    if (ins) { cur += ch; if (ch === q && text[k - 1] !== '\\') ins = false; continue; }
    if (ch === '"' || ch === "'") { ins = true; q = ch; cur += ch; continue; }
    if (ch === '{') d++;
    if (ch === '}') d--;
    if (ch === ',' && d === 0) { items.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) items.push(cur);
  return items;
}

function braceSpan(src, idx) {
  let j = idx, depth = 0, ins = false, q = '';
  while (j < src.length) {
    const ch = src[j];
    if (ins) { if (ch === q && src[j - 1] !== '\\') ins = false; j++; continue; }
    if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) return { text: src.slice(idx, j + 1), endIdx: j }; }
    j++;
  }
  return null;
}

function numList(text) {
  const arr = text.split(',').map(s => s.trim()).filter(s => s !== '');
  const out = [];
  for (const t of arr) {
    const v = constFold(t);
    if (v === null || typeof v !== 'number') return null;
    out.push(v);
  }
  return out;
}

function decodeKEntry(entry, li, base, step) {
  if (typeof entry === 'number' || typeof entry === 'string') return entry;
  const zb = li - 1;
  if (Array.isArray(entry) && entry.length && Array.isArray(entry[0])) {
    let p = 0, s = '';
    for (const frag of entry) {
      for (const b of frag) { s += String.fromCharCode((b ^ ((base + p * step + zb) & 0xFF)) & 0xFF); p++; }
    }
    return s;
  }
  if (Array.isArray(entry)) {
    let s = '';
    entry.forEach((b, j) => { s += String.fromCharCode((b ^ ((base + j * step + zb) & 0xFF)) & 0xFF); });
    return s;
  }
  return undefined;
}

function parseKItem(t) {
  const s = t.trim();
  if (!s.startsWith('{')) {
    if (/^-99\d/.test(s)) return { recipe: true };
    const v = constFold(s);
    if (v !== null && (typeof v === 'number' || typeof v === 'string')) return v;
    const lv = litVal(s);
    return lv === undefined ? null : lv;
  }
  const inner = s.slice(1, -1).trim();
  if (/^-99\d/.test(inner)) return { recipe: true };
  if (inner.includes('{')) {
    const frags = [];
    const fre = /\{([\d,\s]*)\}/g;
    let fm, ok = true;
    while ((fm = fre.exec(inner)) !== null) {
      const arr = numList(fm[1]);
      if (!arr) { ok = false; break; }
      frags.push(arr);
    }
    if (!ok || !frags.length) return null;
    return frags;
  }
  if (!inner) return [];
  return numList(inner);
}

function ctxBitAt(init, prime, w) {
  const luaIp = w + 1;
  return ((((init ^ Math.imul(luaIp, prime)) >>> 0) >>> 16) & 1);
}

function ctxMask(content, codeLen, needPositions) {
  const upM = content.match(/(\w+)=bit32\.band\(bit32\.rshift\(bit32\.bxor\((0x[0-9a-fA-F]+|\d+),(\w+)\*(0x[0-9a-fA-F]+|\d+)\),16\),1\)/);
  if (upM) {
    const toN = (t) => t.startsWith('0x') ? parseInt(t, 16) : parseInt(t, 10);
    const init = toN(upM[2]) >>> 0, prime = toN(upM[4]) >>> 0;
    const bits = new Map();
    for (const w of needPositions) {
      bits.set(w, ctxBitAt(init, prime, w));
    }
    return { bits, flagVar: upM[1], ipVar: upM[3], init, prime };
  }
  return { bits: null };
}

function localNum(content, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pats = [
    `local ${esc}=(0x[0-9a-fA-F]+|-?\\d+)(?=[\\s;,]|$)`,
    `local ${esc}=\\((-?\\d+)\\)(?=[\\s;,]|$)`,
    `local ${esc}=\\(0-(\\d+)\\)(?=[\\s;,]|$)`,
    `local ${esc}=\\((\\d+-\\d+)\\)(?=[\\s;,]|$)`,
    `local ${esc}=([^\\n;]+)`,
  ];
  for (const p of pats) {
    const m = content.match(new RegExp(p));
    if (!m) continue;
    let v = constFold(m[1].trim());
    if (typeof v === 'number') return v;

    if (/^\(0-\d+\)$/.test(m[1].trim())) {
      const n = parseInt(m[1].trim().slice(3, -1), 10);
      if (Number.isFinite(n)) return -n;
    }
  }
  return null;
}

function invertStackMax(content) {
  let htab = null;
  {
    const cands = {};
    const re = /(\w+)\[(\d+)\]=function\(\)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const t = m[1];
      (cands[t] = cands[t] || []).push(parseInt(m[2]));
    }
    let best = null, bestN = 0;
    for (const t of Object.keys(cands)) {
      const set = new Set(cands[t]);
      if (set.has(0) && set.size >= 40 && set.size > bestN) { best = t; bestN = set.size; }
    }
    if (!best) return { ok: false, reason: 'max: no shuffled handler table' };
    htab = best;
  }
  const handlers = handlerBodies(content, htab);
  const hkeys = Object.keys(handlers);
  if (hkeys.length < 40) return { ok: false, reason: 'max: handler extraction short' };
  const mapped = mapBodies(handlers, content);
  if (mapped.err) return { ok: false, reason: 'max: ' + mapped.err };
  const shufMap = mapped.shufMap;
  const unmapped = mapped.unmapped;

  let entryName = null, kVar = null, codeVar = null, protosVar = null;
  {
    const cands = [...content.matchAll(/return\s+(\w+)\((\w+),(\w+),(\w+)(?:,(\w+))?\)/g)];
    for (let k = cands.length - 1; k >= 0; k--) {
      const [en, kv, cv] = [cands[k][1], cands[k][2], cands[k][3]];
      if (new RegExp(`local\\s+${kv}\\s*=\\s*\\{`).test(content) && new RegExp(`local\\s+${cv}\\s*=\\s*\\{`).test(content)) {
        entryName = en; kVar = kv; codeVar = cv; protosVar = cands[k][5] || null;
        break;
      }
    }
    if (!entryName) return { ok: false, reason: 'max: no entry call' };
  }

  const runDefM = content.match(new RegExp(`local function ${entryName}\\(([^)]*)\\)`));
  if (!runDefM) return { ok: false, reason: 'max: no runner def' };
  const params = runDefM[1].split(',').map(s => s.trim()).filter(Boolean);
  let kParam = params[0], codeParam = params[1];
  {
    const kd = content.match(/for _i,_v in ipairs\((\w+)\) do if type\(_v\)=="table"/);
    if (kd && params.includes(kd[1])) kParam = kd[1];
    const cd = content.match(/if not (\w+)\[0\] then for _i=1,#\1 do/);
    if (cd && params.includes(cd[1])) codeParam = cd[1];
  }

  const entryArgs = [kVar, codeVar];
  {
    const full = content.match(new RegExp(`return\\s+${entryName}\\(([^)]*)\\)`));
    if (full) {
      const av = full[1].split(',').map(s => s.trim());
      if (av[3]) protosVar = av[3];
    }
  }

  const kDefM = content.match(new RegExp(`local\\s+${kVar}\\s*=\\s*\\{`));
  if (!kDefM) return { ok: false, reason: 'max: no K table def' };
  const kBrace = braceSpan(content, content.indexOf('{', kDefM.index));
  if (!kBrace) return { ok: false, reason: 'max: K table unbalanced' };
  const kItems = splitTopLevel(kBrace.text.slice(1, -1));
  const kEntries = [];
  for (const t of kItems) {
    const e = parseKItem(t);
    if (e === null || (typeof e === 'object' && e.recipe)) return { ok: false, reason: 'max: bad K item (recipe?)' };
    kEntries.push(e);
  }

  let kBase = null, kStep = null;
  {
    const f1 = content.match(/band\((\d+)\+_p\*(\d+)\+\(_i-1\)/);
    const f2 = content.match(/band\((\d+)\+\(_j-1\)\*(\d+)\+\(_i-1\)/);
    if (f1) { kBase = parseInt(f1[1]); kStep = parseInt(f1[2]); }
    if (f2) {
      const b2 = parseInt(f2[1]), s2 = parseInt(f2[2]);
      if (kBase === null) { kBase = b2; kStep = s2; }
      else if (kBase !== b2 || kStep !== s2) return { ok: false, reason: 'max: K recipe constants disagree' };
    }
    if (kBase === null) return { ok: false, reason: 'max: no K recipe' };

    if (/_l10O2a|doMutation|strategy/.test(content) && /local _ka=|_cs=0x/.test(content)) {
      return { ok: false, reason: 'max: key-scheduled K strategies unsupported' };
    }
  }
  const K = kEntries.map((e, idx) => decodeKEntry(e, idx + 1, kBase, kStep));
  if (K.some(v => v === undefined)) return { ok: false, reason: 'max: K decode failed' };

  const cDefM = content.match(new RegExp(`local\\s+${codeVar}\\s*=\\s*\\{`));
  if (!cDefM) return { ok: false, reason: 'max: no code table def' };
  const cBrace = braceSpan(content, content.indexOf('{', cDefM.index));
  if (!cBrace) return { ok: false, reason: 'max: code table unbalanced' };
  const codeNums = numList(cBrace.text.slice(1, -1));
  if (!codeNums) return { ok: false, reason: 'max: code not flat numbers' };
  let codeKey = 0;
  {
    const kd = content.match(new RegExp(`if not ${codeParam}\\[0\\] then for _i=1,#${codeParam} do if ${codeParam}\\[_i\\]>=0 then ${codeParam}\\[_i\\]=bit32\\.bxor\\(${codeParam}\\[_i\\],([^)]+)\\)`));
    if (kd) {
      const v = constFold(kd[1].trim());
      if (typeof v !== 'number') return { ok: false, reason: 'max: bad code key' };
      codeKey = v & 0xFF;
    } else {
      codeKey = 0;
    }
  }
  const code = codeKey ? codeNums.map(v => (v >= 0 ? (v ^ codeKey) : v)) : codeNums.slice();

  let jumpKey = 0;
  {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const sk of Object.keys(shufMap)) {
      const base = shufMap[sk];
      if (base !== 32 && base !== 33 && base !== 42 && base !== 43 && base !== 53) continue;
      const body = handlers[sk];
      const jm = body.match(/bxor\(\w+\[\w+\],(\w+)\)/);
      if (jm) {
        const v = localNum(content, jm[1]);
        if (v === null) return { ok: false, reason: 'max: jump key unresolvable' };
        jumpKey = v;
        break;
      }
    }
  }

  const rm = remapShuffled(code, shufMap);
  if (rm.badOp !== null && rm.badOp !== undefined) return { ok: false, reason: 'max: code op ' + rm.badOp + ' not in map', K };
  const remapped = rm.remapped, ctxPositions = rm.ctxPositions;

  let ctxBits = null, ctxInit = null, ctxPrime = null, ctxConst = null;
  if (ctxPositions.length) {
    const cb = ctxMask(content, code.length, ctxPositions);
    if (cb.bits) { ctxBits = cb.bits; ctxInit = cb.init; ctxPrime = cb.prime; }
    else {
      let flagVar = null;
      for (const sk of Object.keys(shufMap)) {
        if (shufMap[sk] !== 67) continue;
        const fm = handlers[sk].match(/if (\w+)==0 then/);
        if (fm) { flagVar = fm[1]; break; }
      }
      const fv = flagVar ? localNum(content, flagVar) : null;
      if (fv === null) return { ok: false, reason: 'max: CTX ops without resolvable flag' };
      ctxConst = fv ? 1 : 0;
      ctxBits = new Map(ctxPositions.map(w => [w, ctxConst]));
    }
  }

  let protos = [];
  if (protosVar) {
    const pDefM = content.match(new RegExp(`local\\s+${protosVar}\\s*=\\s*\\{`));
    if (pDefM) {
      const pBrace = braceSpan(content, content.indexOf('{', pDefM.index));
      if (!pBrace) return { ok: false, reason: 'max: protos unbalanced' };
      const inner = pBrace.text.slice(1, -1).trim();
      if (inner) {
        const pr = parseMaxProtos(inner, { kBase, kStep, codeKey });
        if (!pr.ok) return pr;
        protos = pr.protos;
      }
    }
  }
  return { ok: true, K, code: remapped, shufMap, jumpKey, ctxBits, ctxInit, ctxPrime, ctxConst, protos, kBase, kStep, codeKey, unmapped };
}

function liftMaxProtos(inv) {
  const r = lift2.liftProgram(inv);
  if (!r.bad) return r;
  if (process.env.CLYDE_NO_LEGACY) return r;
  const legacy = liftMaxProtosOld(inv);
  if (!legacy.bad) return legacy;
  return { out: legacy.out, bad: r.bad + ' | legacy: ' + legacy.bad, strings: legacy.strings };
}

function liftMaxProtosOld(inv) {
  const strings = inv.K.filter(v => typeof v === 'string');
  const hoist = [];
  let protoN = 0;
  const notes = [];
  const ctxFor = (positions) => {
    if (!positions.length) return null;
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

  const closurePis = (remapped) => {
    const pis = new Set();
    let p = 0;
    while (p < remapped.length) {
      const op = remapped[p++];
      const argc = STACK_ARGCNT[op] ?? 0;
      const args = remapped.slice(p, p + argc); p += argc;
      if (op === 35 && args[0] >= 1) pis.add(args[0]);
    }
    return pis;
  };
  const liftProto = (P, parentLocals, parentUvs, parentK, depth) => {
    if (P.lifted) return P;
    if (depth > 6) { P.bad = 'proto nesting too deep'; return P; }
    const Kp = P.K || parentK;
    const Cp = P.C || [];
    const rm = remapShuffled(Cp, inv.shufMap);
    if (rm.badOp !== null && rm.badOp !== undefined) { P.bad = 'proto op ' + rm.badOp + ' not in map'; return P; }
    const cb = ctxFor(rm.ctxPositions);
    if (rm.ctxPositions.length && !cb) { P.bad = 'proto CTX without bits'; return P; }

    const uvs = {};
    if (P.U) {
      P.U.forEach((spec, k) => {
        const [iL, idx] = spec;
        if (iL === 1) uvs[k] = { boxOf: { map: parentLocals, key: idx } };
        else if (parentUvs[idx] !== undefined) uvs[k] = parentUvs[idx];
      });
    }

    const childProtos = [];
    for (const pi of closurePis(rm.remapped)) {
      const sub = (P.P || [])[pi - 1];
      if (!sub) { P.bad = 'proto pi ' + pi + ' out of range'; return P; }
      liftProto(sub, {}, uvs, Kp, depth + 1);
      if (sub.bad) { P.bad = sub.bad; return P; }
      childProtos.push({ name: sub.name, lifted: sub.lifted, pi });
    }

    const preload = {};
    for (let s = 0; s < (P.nParams || 0); s++) preload[s] = `p${s}`;
    const lr = liftChunk(Kp, rm.remapped, inv.jumpKey, {
      ctxBits: cb, protos: childProtos,
      uvs, preload, isProto: true,
    });
    if (lr.bad) { P.bad = lr.bad; return P; }
    const params = [];
    for (let s = 0; s < (P.nParams || 0); s++) params.push(`p${s}`);
    params.push('...');
    P.name = `__proto_${protoN++}`;
    P.lifted = `local ${P.name} = function(${params.join(', ')})\n${lr.out}\nend`;
    return P;
  };

  const mainProtos = [];
  const collectStrings = (list) => {
    for (const P of list) {
      if (P.K) for (const s of P.K.filter(v => typeof v === 'string')) strings.push(s);
      if (P.P) collectStrings(P.P);
    }
  };
  collectStrings(inv.protos);
  for (const pi of closurePis(inv.code)) {
    const P = inv.protos[pi - 1];
    if (!P) return { out: '', bad: 'proto pi ' + pi + ' out of range', strings };
    const r = liftProto(P, {}, {}, inv.K, 0);
    if (r.bad) return { out: '', bad: 'proto: ' + r.bad, strings };
    mainProtos.push({ name: P.name, lifted: P.lifted, pi });
  }
  const lr = liftChunk(inv.K, inv.code, inv.jumpKey, { ctxBits: inv.ctxBits, protos: mainProtos });
  if (lr.bad) return { out: lr.out, bad: lr.bad, strings };
  const defs = [];
  const collectDefs = (list) => {
    for (const p of list) {
      if (p.P) collectDefs(p.P);
      if (p.lifted) defs.push(p.lifted);
    }
  };
  collectDefs(inv.protos);
  const approx = inv.protos.length ? '\n-- NOTE: closures/upvalues approximated; multret counts assumed.' : '';
  return { out: (defs.length ? defs.join('\n\n') + '\n\n' : '') + lr.out + approx, bad: null, strings };
}

function remapShuffled(code, shufMap) {
  const remapped = [];
  const ctxPositions = [];
  let w = 0, p = 0, badOp = null, badPos = -1;
  while (p < code.length) {
    const sOp = code[p++];
    const base = shufMap[sOp];
    if (base === undefined) { badOp = sOp; badPos = w; break; }
    if (base === 67) ctxPositions.push(w);
    const argc = STACK_ARGCNT[base] ?? 0;
    remapped.push(base, ...code.slice(p, p + argc));
    p += argc; w++;
  }
  return { remapped, ctxPositions, badOp, badPos };
}

function parseMaxProtos(text, recipe, depth) {
  depth = depth || 0;
  if (depth > 6) return { ok: false, reason: 'max: protos too deep' };
  const items = splitTopLevel(text);
  const protos = [];
  for (const t of items) {
    const s = t.trim();
    if (!s.startsWith('{')) return { ok: false, reason: 'max: bad proto item' };
    const body = s.slice(1, -1);
    const field = (name) => {
      const m = body.match(new RegExp(`${name}\\s*=\\s*`));
      if (!m) return null;
      let st = m.index + m[0].length;
      while (st < body.length && /\s/.test(body[st])) st++;
      if (body[st] === '{') {
        const b = braceSpan(body, st);
        return b ? b.text : null;
      }
      const em = body.slice(st).match(/^([^,}]+)/);
      return em ? em[1].trim() : null;
    };
    const kf = field('K'), cf = field('C'), pf = field('P'), uf = field('U'), nf = field('nParams');
    let K = null, C = null;
    if (kf) {
      const ki = splitTopLevel(kf.slice(1, -1));
      const ke = [];
      for (const it of ki) {
        const e = parseKItem(it);
        if (e === null || (typeof e === 'object' && e.recipe)) return { ok: false, reason: 'max: bad proto K' };
        ke.push(e);
      }
      K = ke.map((e, idx) => decodeKEntry(e, idx + 1, recipe.kBase, recipe.kStep));
      if (K.some(v => v === undefined)) return { ok: false, reason: 'max: proto K decode failed' };
    }
    if (cf) {
      const cn = numList(cf.slice(1, -1));
      if (!cn) return { ok: false, reason: 'max: proto C not flat' };
      C = recipe.codeKey ? cn.map(v => (v >= 0 ? (v ^ recipe.codeKey) : v)) : cn.slice();
    }
    let P = [];
    if (pf && pf.trim() !== '{}' && pf.trim() !== 'nil') {
      const sub = parseMaxProtos(pf.slice(1, -1), recipe, depth + 1);
      if (!sub.ok) return sub;
      P = sub.protos;
    }
    let U = null;
    if (uf && uf.trim() !== 'nil' && uf.trim() !== '{}') {
      const ui = splitTopLevel(uf.slice(1, -1));
      U = [];
      for (const u of ui) {
        const um = u.trim().match(/^\{(\d+),(\d+)\}$/);
        if (!um) return { ok: false, reason: 'max: bad U spec' };
        U.push([parseInt(um[1]), parseInt(um[2])]);
      }
    }
    let nParams = 0;
    if (nf && nf !== 'nil') {
      const nv = constFold(nf);
      if (typeof nv === 'number') nParams = nv;
    }
    protos.push({ K, C, P, U, nParams, lifted: null, name: null });
  }
  return { ok: true, protos };
}

function doStrat4(byteV, dk, st) {
  if (st === 0) return (byteV ^ dk) & 0xFF;
  if (st === 1) return (byteV - dk + 256) & 0xFF;
  if (st === 2) return (byteV ^ (((dk << 3) | (dk >>> 5)) & 0xFF)) & 0xFF;
  return (byteV - (dk ^ 0xAA) + 256) & 0xFF;
}
function rotl7(x) { return (((x << 7) | (x >>> 25)) >>> 0); }

function parseKItemRaw(t) {
  const s = t.trim();
  if (!s.startsWith('{')) {
    const v = constFold(s);
    if (v !== null && (typeof v === 'number' || typeof v === 'string')) return { kind: 'bare', v };
    if (v === null) {
      const lv = litVal(s);
      if (lv !== undefined) return { kind: 'bare', v: lv };
      return null;
    }
    return { kind: 'bare', v };
  }
  const inner = s.slice(1, -1).trim();
  if (/^-99\d/.test(inner)) {
    const nums = [];
    for (const p of splitTopLevel(inner)) {
      const v = constFold(p.trim());
      if (typeof v !== 'number') return null;
      nums.push(v);
    }
    return { kind: 'recipe', nums };
  }
  if (inner.includes('{')) {
    const frags = [];
    for (const g of splitTopLevel(inner)) {
      const gs = g.trim();
      if (!gs.startsWith('{') || !gs.endsWith('}')) return null;
      const nums = [];
      for (const el of splitTopLevel(gs.slice(1, -1))) {
        const v = constFold(el.trim());
        if (typeof v !== 'number') return null;
        nums.push(v);
      }
      frags.push(nums);
    }
    if (!frags.length) return null;
    return { kind: 'frags', frags };
  }
  if (!inner) return { kind: 'bytes', nums: [] };
  const nums = [];
  for (const el of splitTopLevel(inner)) {
    const v = constFold(el.trim());
    if (typeof v !== 'number') return null;
    nums.push(v);
  }
  return { kind: 'bytes', nums };
}

function decodeKEntries(rawItems, kctx) {
  const K = [];
  for (let idx = 0; idx < rawItems.length; idx++) {
    const v = decodeKRaw(rawItems[idx], idx + 1, kctx);
    if (v === undefined) return null;
    K.push(v);
  }
  return K;
}
function decodeKRaw(item, li, kctx) {
  if (item.kind === 'bare') return item.v;
  if (kctx.mode === 'plain') {
    return decodeKEntry(item.kind === 'bytes' ? item.nums : item.frags, li, kctx.base, kctx.step);
  }
  let key = ((kctx.baseKey ^ (li * kctx.idxMul)) >>> 0);
  const st = ((key >>> 16) & 3) >>> 0;
  const take = (b) => { const dk = key & 0xFF; const dc = doStrat4(b, dk, st); key = rotl7((key ^ dc) >>> 0); return dc; };
  if (item.kind === 'bytes' && item.nums.length && item.nums[0] < 0) {
    const r = item.nums;
    const nF = -r[0], fS = r[1], oL = r[3];
    if (!(nF >= 1 && fS >= 1 && oL >= 0)) return undefined;
    const sels = r.slice(4, 4 + nF);
    const data = r.slice(4 + nF);
    if (sels.length !== nF) return undefined;
    const out = [];
    let taken = 0;
    for (const sel of sels) {
      for (let b = 0; b < fS && taken < oL; b++) {
        const byte = data[(sel - 1) * fS + b];
        if (byte === undefined) return undefined;
        out.push(String.fromCharCode(take(byte)));
        taken++;
      }
    }
    return out.join('');
  }
  if (item.kind === 'recipe') {
    const r = item.nums;
    if (r[0] === -999) return (r[1] ^ r[2]) & 0xFF;
    if (r[0] === -998) {
      const pool = kctx.pools[r[1] - 1];
      if (!pool) return undefined;
      const out = [];
      for (let b = 0; b < r[3]; b++) {
        const bv = pool[r[2] + b - 1];
        if (bv === undefined) return undefined;
        out.push(String.fromCharCode(take(bv)));
      }
      return out.join('');
    }

    const nF = -r[0], fS = r[1], oL = r[3];
    if (!(nF >= 1 && fS >= 1 && oL >= 0)) return undefined;
    const sels = r.slice(4, 4 + nF);
    const data = r.slice(4 + nF);
    if (sels.length !== nF || sels.some(s => typeof s !== 'number')) return undefined;
    const out = [];
    let taken = 0;
    for (const sel of sels) {
      for (let b = 0; b < fS && taken < oL; b++) {
        const byte = data[(sel - 1) * fS + b];
        if (byte === undefined) return undefined;
        out.push(String.fromCharCode(take(byte)));
        taken++;
      }
    }
    return out.join('');
  }
  const out = [];
  for (const b of item.nums) out.push(String.fromCharCode(take(b)));
  return out.join('');
}

function vleDecodeStage(bytes, seeds) {
  let b = bytes.slice();
  const pv0 = parseInt(seeds.pv, 16) & 0xFF;
  if (seeds.chained) {
    let pv = pv0;
    b = b.map(v => { const o = (v ^ pv) & 0xFF; pv = v; return o; });
  } else {
    b = b.map(v => (v ^ pv0) & 0xFF);
  }
  let ka = parseInt(seeds.ka, 16) & 0xFF, kb = parseInt(seeds.kb, 16) & 0xFF;
  b = b.map(v => { const o = (v - ka + 256) & 0xFF; const t = (ka + kb) & 0xFF; ka = kb; kb = t; return o; });
  let cs = parseInt(seeds.cs, 16) >>> 0;
  const cs0 = cs;
  b = b.map((v, idx) => {
    const o = (v ^ (cs & 0xFF)) & 0xFF;
    if (cs % 2 === 0) cs = cs >>> 1;
    else cs = ((cs * 3 + 1) & 0x7FFFFFFF) >>> 0;
    if (cs <= 1) cs = ((cs0 ^ (idx + 1)) | 2) >>> 0;
    return o;
  });
  const code = [];
  let p = 0;
  while (p < b.length) {
    const v = b[p];
    if (v === 255) { code.push(-1); p += 1; }
    else if (v < 128) { code.push(v); p += 1; }
    else if (v < 192) { code.push((v - 128) * 256 + b[p + 1]); p += 2; }
    else if (v < 224) { code.push((v - 192) * 65536 + b[p + 1] * 256 + b[p + 2]); p += 3; }
    else { code.push((v - 224) * 16777216 + b[p + 1] * 65536 + b[p + 2] * 256 + b[p + 3]); p += 4; }
  }
  return code;
}

function findVleSeeds(text) {
  const seedM = [...text.matchAll(/local (\w+)=\w+\((0x[0-9a-fA-F]+),0xFF\)/g)];
  const seeds = seedM.map(x => x[2]);
  const kbM = text.match(/local \w+=\w+\(\w+\((0x[0-9a-fA-F]+),8\),0xFF\)/);
  const csM = text.match(/local \w+=(0x[0-9a-fA-F]{7,8})(?![0-9a-fA-F])/);
  const chained = (pvVar) => {
    if (!pvVar) return false;
    const esc = pvVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`${esc}=(\\w+)[\\s;]`).test(text);
  };
  if (seeds.length >= 1 && kbM && csM) {
    const h = parseInt(kbM[1], 16);
    return { pv: seeds[0], ka: '0x' + (h & 0xFF).toString(16), kb: '0x' + ((h >> 8) & 0xFF).toString(16), cs: csM[1], chained: chained(seedM[0][1]) };
  }
  if (seeds.length >= 3 && csM) return { pv: seeds[0], ka: seeds[1], kb: seeds[2], cs: csM[1], chained: chained(seedM[0][1]) };
  return null;
}

function mapHandlerTable(content) {
  const cands = {};
  const re = /(\w+)\[(\d+)\]=function\(\)/g;
  let m;
  while ((m = re.exec(content)) !== null) (cands[m[1]] = cands[m[1]] || []).push(parseInt(m[2]));
  let best = null, bestN = 0;
  for (const t of Object.keys(cands)) {
    const set = new Set(cands[t]);
    if (set.has(0) && set.size >= 40 && set.size > bestN) { best = t; bestN = set.size; }
  }
  if (!best) return { reason: 'no shuffled handler table' };
  const handlers = handlerBodies(content, best);
  if (Object.keys(handlers).length < 40) return { reason: 'handler extraction short' };
  const A = vmAliases(content);
  if (!A.push || !A.pop || !A.getL || !A.setL || !A.resK) return { reason: 'alias discovery incomplete' };
  const tagMap = aliasTagMap(A);
  const shufMap = {};
  const unmapped = [];
  for (const sk of Object.keys(handlers)) {
    const real = DBG_SKELETON_MAP[skeletonOf(handlers[sk], tagMap)];
    if (real === undefined) unmapped.push(sk);
    else shufMap[sk] = real;
  }
  return { htab: best, handlers, shufMap, unmapped };
}

function pureHelperAliases(content) {
  const H = {};
  const re = /local (\w+)=(\w+)\["((?:\\\d+)+)"\]\["((?:\\\d+)+)"\]/g;
  let m;
  const dec = (s) => s.replace(/\\(\d{1,3})/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  const PURE_LIBS = { bit32: 1, string: 1, math: 1 };
  while ((m = re.exec(content)) !== null) {
    const lib = dec(m[3]), fn = dec(m[4]);
    if (PURE_LIBS[lib]) H[m[1]] = `${lib}.${fn}`;
    else if (lib === 'table' && (fn === 'concat' || fn === 'unpack' || fn === 'pack')) H[m[1]] = `${lib}.${fn}`;
  }
  return H;
}

function stripDeadHead(body, pureHelpers, tagMap) {
  const closeBracket = (text) => {
    let depth = 0, ins = false, q = '';
    for (let j = 0; j < text.length; j++) {
      const ch = text[j];
      if (ins) { if (ch === q && text[j - 1] !== '\\') ins = false; continue; }
      if (ch === '"' || ch === "'") { ins = true; q = ch; continue; }
      if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return j; }
    }
    return -1;
  };
  const readPrimary = (text) => {
    let m = text.match(/^([A-Za-z_]\w*)\(/);
    if (m) {
      let depth = 0, ins = false, q = '';
      for (let j = m[0].length - 1; j < text.length; j++) {
        const ch = text[j];
        if (ins) { if (ch === q && text[j - 1] !== '\\') ins = false; continue; }
        if (ch === '"' || ch === "'") { ins = true; q = ch; continue; }
        if (ch === '(') depth++;
        else if (ch === ')') { depth--; if (depth === 0) return { text: text.slice(0, j + 1), kind: 'call', callee: m[1] }; }
      }
      return null;
    }
    m = text.match(/^[A-Za-z_]\w*/);
    if (m) return { text: m[0], kind: 'ident' };
    m = text.match(/^(0x[0-9a-fA-F]+|\d+|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
    if (m) return { text: m[0], kind: 'lit' };
    return null;
  };

  const readRhs = (text) => {
    const p = readPrimary(text);
    if (!p) return null;
    let out = p.text, rest = text.slice(p.text.length), callee = p.kind === 'call' ? p.callee : null;
    for (;;) {
      if (rest[0] === '[') {
        const e = closeBracket(rest);
        if (e < 0) return null;
        out += rest.slice(0, e + 1);
        rest = rest.slice(e + 1);
        continue;
      }
      const dm = rest.match(/^\.([A-Za-z_]\w*)/);
      if (dm) { out += dm[0]; rest = rest.slice(dm[0].length); continue; }
      const om = rest.match(/^\s+or\s+/);
      if (om) {
        const rhs2 = readRhs(rest.slice(om[0].length));
        if (!rhs2) return null;
        out += om[0] + rhs2.full;
        rest = rest.slice(om[0].length + rhs2.full.length);
        if (rhs2.callee) callee = callee || rhs2.callee;
        continue;
      }
      break;
    }
    return { full: out, rest, callee };
  };
  for (;;) {
    const lm = body.match(/^\s*local (\w+)=/);
    if (!lm) break;
    const name = lm[1];
    const after = body.slice(lm.index + lm[0].length);
    const rhs = readRhs(after);
    if (rhs === null) break;
    const rest = after.slice(rhs.full.length);

    if (rest.trim() && !/^[\s;]+[A-Za-z_(]/.test(rest) && !/^[\s;]*$/.test(rest)) break;
    if (new RegExp(`\\b${name}\\b`).test(rest)) break;

    const r = rhs.full;
    const realCallee = rhs.callee ? (tagMap && tagMap[rhs.callee]) || pureHelpers[rhs.callee] || rhs.callee : null;
    const pureLib = realCallee && (/^(bit32|string|math)\./.test(realCallee) || realCallee === 'type'
      || realCallee === 'table.concat' || realCallee === 'table.unpack' || realCallee === 'table.pack');
    let pure = false;
    if (!/[A-Za-z_]\w*\s*\(/.test(r)) pure = true;
    else if (pureLib) {
      const inner = r.slice(rhs.callee.length);
      pure = !/[A-Za-z_]\w*\s*\(/.test(inner);
    }
    if (!pure) break;
    body = rest.replace(/^[\s;]+/, '');
  }
  return body;
}

function tagBranchLocals(content, A, tagMap) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const [role, tag] of Object.entries(VM_ALIAS_TAGS)) {
    const target = A[role];
    if (!target) continue;
    const re = new RegExp(`local (\\w+)=${esc(target)}(?![\\w([])`, 'g');
    let m;
    while ((m = re.exec(content)) !== null) {
      if (m[1].length <= 1) continue;
      if (!tagMap[m[1]]) tagMap[m[1]] = tag;
    }
  }
  return tagMap;
}

function branchBindings(content, A) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const out = {};
  for (const [role, tag] of Object.entries(VM_ALIAS_TAGS)) {
    const target = A[role];
    if (!target) continue;
    const re = new RegExp(`local (\\w+)=${esc(target)}(?![\\w([])`, 'g');
    let m;
    while ((m = re.exec(content)) !== null) {
      if (m[1].length <= 1) continue;
      if (!(m[1] in out)) out[m[1]] = tag;
    }
  }
  return out;
}

function tagsForBody(body, bindings) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const o = {};
  for (const [name, tag] of Object.entries(bindings)) {
    if (new RegExp(`\\blocal\\s+${esc(name)}\\s*=`).test(body)) continue;
    if (new RegExp(`\\b${esc(name)}\\s*[(\\[]`).test(body)) o[name] = tag;
  }
  return o;
}

function tagEnvGlobals(content, tagMap) {
  const BARE = { pcall: 1, xpcall: 1, tostring: 1, tonumber: 1, type: 1, error: 1, assert: 1, select: 1, unpack: 1, next: 1, pairs: 1, ipairs: 1, getmetatable: 1, rawget: 1, setmetatable: 1 };
  const LIBS = { table: 1, string: 1, math: 1, bit32: 1 };
  const dec = (s) => s.replace(/\\(\d{1,3})/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  const re = /local (\w+)=(\w+)\["((?:\\\d+)+)"\](?:\["((?:\\\d+)+)"\])?/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    if (tagMap[name]) continue;
    const first = dec(m[3]);
    if (m[4] !== undefined) {
      if (!LIBS[first]) continue;
      const method = dec(m[4]);

      tagMap[name] = SKEL_KEEP.has(method) ? `${first}.${method}` : `${first}.$V`;
    } else if (BARE[first]) {
      tagMap[name] = first;
    }
  }

  const re2 = /local (\w+)=(pcall|xpcall|tostring|tonumber|type|error|assert|select|unpack|next|pairs|ipairs|getmetatable|rawget|setmetatable)(?![\w([])/g;
  while ((m = re2.exec(content)) !== null) {
    if (!tagMap[m[1]]) tagMap[m[1]] = m[2];
  }
  return tagMap;
}

function mapBodies(handlers, content) {
  const A = vmAliases(content);
  if (!A.push || !A.pop || !A.getL || !A.setL || !A.resK) return { err: 'alias discovery incomplete' };
  const tagMap = aliasTagMap(A);
  tagEnvGlobals(content, tagMap);
  const bindings = branchBindings(content, A);
  const pureHelpers = pureHelperAliases(content);
  const shufMap = {};
  const unmapped = [];
  for (const sk of Object.keys(handlers)) {
    const body = handlers[sk];
    const bt = tagsForBody(body, bindings);
    const merged = Object.assign({}, tagMap, bt);
    const skel = (b) => DBG_SKELETON_MAP[skeletonOf(unshadow(stripDeadHead(dunderDot(b), pureHelpers, merged)), merged)];
    let hit = skel(body);
    if (hit === undefined) {
      const norm = stripJumpXor(body, pureHelpers, content);
      if (norm !== null) hit = skel(norm);
    }
    if (hit === undefined) unmapped.push(sk);
    else shufMap[sk] = hit;
  }
  return { shufMap, unmapped, A };
}

function mapInlineChain(content) {
  const A = vmAliases(content);
  if (!A.push || !A.pop || !A.getL || !A.setL || !A.resK) return null;
  const opVarM = content.match(/if (\w+)==\d+ then do local \w+=/);
  if (!opVarM) return null;
  const opVar = opVarM[1];
  const branchRe = new RegExp('(?:if|elseif) ' + opVar + '==(\\d+) then do', 'g');
  let bm;
  const handlers = {};
  const branchMiss = [];
  while ((bm = branchRe.exec(content)) !== null) {
    const key = parseInt(bm[1]);
    const body = bodyFrom(content, bm.index + bm[0].length);
    if (body === null) { branchMiss.push(key); continue; }
    handlers[String(key)] = body;
  }
  if (!Object.keys(handlers).length) return null;
  const mapped = mapBodies(handlers, content);
  if (mapped.err) return null;
  for (const k of mapped.unmapped) branchMiss.push(k);
  if (!Object.keys(mapped.shufMap).length) return null;
  return { shufMap: mapped.shufMap, branchMiss, handlers };
}

function detectJumpKey(content, handlers, shufMap) {
  const ph = pureHelperAliases(content);
  const bxorNames = new Set(['bxor']);
  for (const [alias, dotted] of Object.entries(ph)) {
    if (dotted === 'bit32.bxor') bxorNames.add(alias);
  }
  for (const sk of Object.keys(shufMap)) {
    const base = shufMap[sk];
    if (base !== 32 && base !== 33 && base !== 42 && base !== 43 && base !== 53) continue;
    const body = handlers[sk];
    if (!body) continue;
    const jm = body.match(/(\w+)\(\w+\[\w+\],(\w+)\)/);
    if (jm && bxorNames.has(jm[1])) {
      const v = localNum(content, jm[2]);
      if (v === null) return { err: 'jump key unresolvable' };
      return { jumpKey: v };
    }
  }
  return { jumpKey: 0 };
}

function ctxBitMap(content, ctxPositions, handlers, shufMap) {
  if (!ctxPositions.length) return { bits: null };
  const cb = ctxMask(content, 0, ctxPositions);
  if (cb.bits) return { bits: cb.bits, init: cb.init, prime: cb.prime };
  let flagVar = null;
  for (const sk of Object.keys(shufMap)) {
    if (shufMap[sk] !== 67) continue;
    const fm = (handlers[sk] || '').match(/if (\w+)==0 then/);
    if (fm) { flagVar = fm[1]; break; }
  }
  const fv = flagVar ? localNum(content, flagVar) : null;
  if (fv === null) return { err: 'CTX ops without resolvable flag' };
  const c = fv ? 1 : 0;
  return { bits: new Map(ctxPositions.map(w => [w, c])), const: c };
}

const REG_SKELETON_MAP = require('./clyde/regskel.js').REG_SKELETON_MAP;

function helperOp(content, varName) {
  const esc = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let m = content.match(new RegExp(`(?:^|[;\\s\\(,])${esc}=\\s*(bit32\\.\\w+)(?![\\w([])`));
  if (m) return m[1];
  m = content.match(new RegExp(`(?:^|[;\\s\\(,])${esc}=\\s*(\\w+)\\[([^\\]]+)\\]`));
  if (m) {
    const [, base, idx] = m;

    const BIT32 = new Set('band,bxor,bor,bnot,lshift,rshift,arshift,lrotate,rrotate,extract,replace,cntlz,cnttz,byteswap'.split(','));
    const um = idx.match(/^(\w+)\(([^()]*)\)$/);
    if (um) {
      const parts = um[2].split(',').map(s => s.trim());
      let name = '';
      for (const p of parts) {
        const v = constFold(p);
        if (typeof v !== 'number') return null;
        name += String.fromCharCode(v & 0xFF);
      }
      if (BIT32.has(name)) return 'bit32.' + name;
      return null;
    }
    return null;
  }
  m = content.match(new RegExp(`local ${esc}=(\\w+)\\["((?:\\\\\\d+)+)"\\]\\["((?:\\\\\\d+)+)"\\]`));
  if (m) {
    const dec = (s) => s.replace(/\\(\d{1,3})/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
    return dec(m[2]) + '.' + dec(m[3]);
  }
  return null;
}

function regRoles(core) {
  const lm = core.match(/while (\w+)<=#(\w+) do/);
  if (!lm) return { err: 'no dispatch loop' };
  const ip = lm[1], code = lm[2];

  const rm = core.match(/local function (\w+)\((\w+)\) if \2>=([A-Za-z_]\w*|\d+) then return (\w+)\[\2-(\w+)\] else return (\w+)\[\2\+1\] end end/);
  if (!rm) return { err: 'no RK resolver' };
  const [rk, param, tRaw, kTable, kOffVar, rTable] = [rm[1], rm[2], rm[3], rm[4], rm[5], rm[6]];
  const numOf = (t) => /^\d+$/.test(t) ? parseInt(t) : localNum(core, t);
  const threshold = numOf(tRaw);
  if (threshold === null) return { err: 'RK threshold unresolvable' };
  const kOff = localNum(core, kOffVar);

  const loopIdx = lm.index;
  const fm = [...core.slice(0, loopIdx).matchAll(/(\w+)=function\(([^)]*)\)/g)].pop();
  let env = null;
  if (fm) {
    const params = fm[2].split(',').map(s => s.trim()).filter(Boolean);
    if (params.length >= 8) env = params[7];
  }
  return { ip, code, rk, threshold, kTable, kOff: kOff === null ? threshold - 1 : kOff, rTable, env };
}

function operandOffset(core, codeVar, name) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = core.match(new RegExp(`local ${esc(name)}=${esc(codeVar)}\\[h\\+(\\d)\\]`));
  return m ? parseInt(m[1]) : null;
}

function invertRegInner(core) {
  try {
    const roles = regRoles(core);
    if (roles.err) return { ok: false, reason: 'reginner: ' + roles.err };
    const { ip, code, rk, threshold, kTable, kOff, rTable } = roles;
    if (threshold !== 256) return { ok: false, reason: 'reginner: RK threshold ' + threshold };

    let kOp = null, lOp = null, tA = null, tB = null, tC = null;
    let kFnName = null, lFnName = null;
    {
      const tm = core.match(/local (\w+)=(\w+)\((\d+)\+h\*(\d+)\+h\*h\*(\d+),0xFF\)/);
      if (!tm) return { ok: false, reason: 'reginner: no position key' };
      lFnName = tm[2];
      lOp = helperOp(core, lFnName);
      if (lOp !== 'bit32.band') return { ok: false, reason: 'reginner: L is ' + lOp };
      [tA, tB, tC] = [parseInt(tm[3]), parseInt(tm[4]), parseInt(tm[5])];
      const km = core.match(/(\w+)\((\w+)\[h\],\w+,\w+\)/);
      kFnName = km ? km[1] : null;
      if (!kFnName) return { ok: false, reason: 'reginner: no op decrypt' };
      kOp = helperOp(core, kFnName);
      if (kOp !== 'bit32.bxor') return { ok: false, reason: 'reginner: K is ' + kOp };
    }

    const leaves = {};
    {
      const re = /if _R==(\d+) then\b/g;
      let m;
      const seen = new Set();
      while ((m = re.exec(core)) !== null) {
        const key = m[1];
        if (seen.has(key)) return { ok: false, reason: 'reginner: ambiguous _R ' + key };
        seen.add(key);
        const start = m.index + m[0].length;
        let depth = 1, j = start, ins = false, q = '';
        let end = -1;
        while (j < core.length) {
          const ch = core[j];
          if (ins) { if (ch === q && core[j - 1] !== '\\') ins = false; j++; continue; }
          if (ch === '"' || ch === "'") { ins = true; q = ch; j++; continue; }
          const rest = core.slice(j);
          if (depth === 1 && (/^elseif _R==/.test(rest) || /^elseif _X==/.test(rest) || /^else\b/.test(rest))) { end = j; break; }
          if (/^elseif\b/.test(rest)) { j += 6; continue; }
          let kw = rest.match(/^(function|if|while)\b/);
          if (kw) { depth++; j += kw[1].length; continue; }
          kw = rest.match(/^for\b/);
          if (kw) { depth++; j += 3; const d = rest.slice(3).match(/[\s\S]*?\bdo\b/); if (d) j += d[0].length; continue; }
          kw = rest.match(/^do\b/);
          if (kw) { depth++; j += 2; continue; }
          const em = rest.match(/^end\b/);
          if (em) { depth--; j += 3; if (depth === 0) { end = j - 3; break; } continue; }
          j++;
        }
        if (end === -1) return { ok: false, reason: 'reginner: unbalanced leaf ' + key };
        leaves[key] = core.slice(start, end);
      }
      if (!Object.keys(leaves).length) return { ok: false, reason: 'reginner: no leaves' };
    }

    const rtags = {
      [roles.rTable]: '$R', [roles.kTable]: '$K', [roles.code]: '$CODE',
      [roles.ip]: '$IP', [roles.rk]: '$RK', A: '$A', B: '$B', C: '$C',
    };
    if (roles.env) rtags[roles.env] = '$ENV';
    const shufMap = {};
    const unmapped = [];
    const operands = {};
    const pureHelpers = pureHelperAliases(core);
    if (kFnName) pureHelpers[kFnName] = 'bit32.bxor';
    if (lFnName) pureHelpers[lFnName] = 'bit32.band';

    tagBranchLocals(core, { push: roles.rk, pop: roles.rk }, rtags);
    tagEnvGlobals(core, rtags);
    for (const [key, body] of Object.entries(leaves)) {
      let body2 = body;
      {
        const rkEsc = roles.rk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const inlineRe = new RegExp(`\\(?\\s*(\\w+)\\s*>=\\s*\\w+\\s+and\\s+\\w+\\[\\s*\\1\\s*-\\s*\\w+\\s*\\]\\s+or\\s+\\w+\\[\\s*\\1\\s*\\+\\s*1\\s*\\]\\s*\\)?`, 'g');
        body2 = body2.replace(inlineRe, `${rkEsc}($1)`);
      }

      let norm = body2;
      const dm = body.match(/local ([A-Za-z_]\w*),([A-Za-z_]\w*),([A-Za-z_]\w*)=(\w+),(\w+),(\w+)/);
      let opNames = null;
      if (dm) {
        const [, a, b, c, x, y, z] = dm;
        opNames = [x, y, z];
        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        norm = norm.replace(new RegExp(`\\b${esc(a)}\\b`, 'g'), 'A')
          .replace(new RegExp(`\\b${esc(b)}\\b`, 'g'), 'B')
          .replace(new RegExp(`\\b${esc(c)}\\b`, 'g'), 'C');
      }

      {
        const re = /;\s*local (\w+)=([^;]+);\s*/g;
        let m;
        while ((m = re.exec(norm)) !== null) {
          const deadName = m[1], rhs = m[2].trim();
          const rest = norm.slice(m.index + m[0].length);
          if (new RegExp(`\\b${deadName}\\b`).test(rest)) continue;
          let pure = false;
          if (/^[A-Za-z_]\w*$/.test(rhs)) pure = true;
          else if (/^(0x[0-9a-fA-F]+|\d+|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')$/.test(rhs)) pure = true;
          else if (!/[()]/.test(rhs)) pure = true;
          else {
            const cm = rhs.match(/^(\w+)\(/);
            if (cm && pureHelpers[cm[1]]) {
              const inner = rhs.slice(cm[1].length);
              pure = !/[A-Za-z_]\w*\s*\(/.test(inner);
            }
          }
          if (!pure) continue;
          norm = norm.slice(0, m.index) + ';' + rest;
          re.lastIndex = m.index + 1;
        }
      }

      norm = stripDeadHead(dunderDot(norm), pureHelpers, rtags);
      norm = unshadow(norm);
      let sk = regSkeleton(norm, rtags);
      let hit = REG_SKELETON_MAP[sk];

      if (hit === undefined) {
        if (sk.includes('function(...) return $V') && sk.includes('$V[$B+#N]')) hit = '34';
        else if (sk.includes('do $R[$A+#N]=$K[$B+#N];$R[$CODE[$IP+#N]+#N]=$K[$CODE[$IP+#N]+#N];$IP=$IP+#N end')) hit = '51';
        else if (sk.includes('do local $V=$K[$B+#N];if $V[#N]==$V then')) hit = '5';
        else if (sk.includes('local $V=$V($R[#N]);$R[$A+#N]=$R[$B+#N]') && sk.includes('[$RK($C)]')) hit = '36';
        else if (sk.includes('local $V=$V($R[#N]);$R[$A+#N]=$R[$B+#N]') && !sk.includes('[$RK')) hit = '4';
        else if (sk.includes('local $V=$R[#N];$IP=$IP+$B*#N')) hit = '21';
        else if (sk.includes('$R[$A+#N]=$RK($B)*$RK($C)') && sk.includes('local $V=$R[#N];')) {
          const stripped2 = sk.replace('local $V=$R[#N];', '');
          hit = REG_SKELETON_MAP[stripped2];
          if (hit !== undefined) sk = stripped2;
        }
      }
      if (hit === undefined) {
        unmapped.push(key); continue;
      }
      shufMap[key] = hit;
      operands[key] = opNames;
    }
    if (!Object.keys(shufMap).length) return { ok: false, reason: 'reginner: nothing mapped' };

    return { ok: true, roles, tConsts: [tA, tB, tC], shufMap, unmapped, operands, leaves };
  } catch (e) {
    return { ok: false, reason: 'reginner threw: ' + e.message };
  }
}

function regSkeleton(body, roles) {
  const shadowed = new Set();
  for (const m of body.matchAll(/\blocal\s+([A-Za-z_]\w*)\b/g)) {
    const name = m[1];
    if (name === 'A' || name === 'B' || name === 'C') continue;
    shadowed.add(name);
  }

  let s = body;
  s = s.replace(/"([^"\\]|\\.)*"/g, '"S"');
  s = s.replace(/\b0x[0-9a-fA-F]+\b/g, '#N');
  s = s.replace(/([A-Za-z_][A-Za-z0-9_]*)/g, (m) => {
    if (shadowed.has(m)) return '$V';
    if (roles[m]) return roles[m];
    if (/^(local|function|end|if|then|else|elseif|for|while|do|return|true|false|nil|and|or|not|in|break)$/.test(m)) return m;
    return '$V';
  });
  s = s.replace(/(?<![\w$#])\d+(?![\w])/g, '#N');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const CREDIT = "-- Deobfed by jamie's deobfuscator at <<https://github.com/JamiesNolandGiggleShi1er/ClydeDeobfuscator>> also join omniDBF pls <<dsc.gg/odbf>>";

function stamp(text) {
  if (typeof text !== 'string' || !text.length) return text;
  return text.startsWith(CREDIT) ? text : CREDIT + '\n' + text;
}

function deobfuscateClyde(content) {
  const r = deobfuscateClydeStatic(content);
  if (!r || typeof r !== 'object') return r;
  if (typeof r.output === 'string') {
    r.output = stamp(r.output);
    if (r.stats) r.stats.outputSize = r.output.length;
  }
  if (typeof r.partial === 'string') r.partial = stamp(r.partial);
  return r;
}

module.exports = { detectClyde, deobfuscateClyde, deobfuscateClydeStatic, peelStub, peelNested, peelCipher, liftMaxCore, liftMaxCore2, invertStackVM, invertStackMax, invertRegInner, regRoles, regSkeleton, helperOp, operandOffset, liftMaxProtos, liftChunk, remapShuffled, constFold, liftDebugTails, liftRegTails, tailTables, peelRegBootstrap, findRegStates, walkRegChain, bareAlias, byteTable, b85decode, sboxForward, decoderKind, applyRegDecoder, resolveLoadstring, regBlob, liftRegProtos, parseRegProtos, liftRegChunk, expandRegFused, regClosurePis, mapInlineChain, mapHandlerTable, stripDeadHead, pureHelperAliases, tagBranchLocals, branchBindings, tagsForBody, tagEnvGlobals, dunderDot, stripJumpXor, unshadow, localNum, ctxMask, detectJumpKey, ctxBitMap, vmAliases, aliasTagMap, skeletonOf, handlerBodies, bodyFrom, DBG_SKELETON_MAP, VM_ALIAS_TAGS };
