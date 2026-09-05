hey yall :3 (made by jamie)

# ClydeDeobf

a Clyde deobfuscator i made because why not.

supports newer Clyde versions and different VM/protection setups. it doesn't run the input script either — everything is done statically.

also used in **OmniDBF**, my own deobfuscation bot.

## use

```bash
node cli.js obfuscated.lua
node cli.js obfuscated.lua -o clean.lua
```

## current support

* Clyde V2 - V6
* stack VM
* register VM
* debug / normal / max
* most protection combinations

some stuff is still being worked on, so don't expect it to magically fix everything.

## how it works

basically it finds the Clyde stuff, decodes the constants/instructions, rebuilds the control flow and turns it back into readable Luau.

no execution of the obfuscated script.

## ai / open code

some parts were made with help from AI and open code.

i'm not gonna lie and say i manually wrote every single line lol.

## credits

made by Jamie

part of **OmniDBF**

jesus loves u

if you find something broken, open an issue instead of spamming my dms.

## license

MIT
