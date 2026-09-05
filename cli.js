// hey yall :3 (jesus loves u)
'use strict';
const fs = require('fs');
const path = require('path');
const { detectClyde, deobfuscateClyde } = require('./clyde_static_deob.js');

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: clyde-deob <script.lua> [-o out.lua]');
  process.exit(2);
}

const src = args[0];
let dst = null;
for (let i = 1; i < args.length; i++) {
  if ((args[i] === '-o' || args[i] === '--out') && args[i + 1]) dst = args[++i];
}
if (!fs.existsSync(src)) {
  console.error('no such file: ' + src);
  process.exit(2);
}

const content = fs.readFileSync(src, 'utf8');
const det = detectClyde(content);
if (!det || !det.isClyde) {
  console.error("this does not look like Clyde output, so there is nothing here I know how to undo.");
  process.exit(1);
}

const res = deobfuscateClyde(content);
if (!res.success) {
  console.error('failed: ' + res.error);
  if (res.decodedStrings && res.decodedStrings.length) {
    console.error('strings recovered before giving up:');
    for (const s of res.decodedStrings) console.error('  ' + JSON.stringify(s));
  }
  process.exit(1);
}

if (!dst) {
  const ext = path.extname(src);
  dst = src.slice(0, src.length - ext.length) + '.deob' + (ext || '.lua');
}
fs.writeFileSync(dst, res.output);
console.log('wrote ' + dst + ' (' + res.output.length + ' bytes, mode ' + (res.stats && res.stats.mode) + ')');
