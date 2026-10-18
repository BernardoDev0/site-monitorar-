import { build } from 'vite';
import tailwind from 'tailwindcss';
import loadConfig from 'tailwindcss/loadConfig.js';
import autoprefixer from 'autoprefixer';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const local = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(local, '../../../..');
const storage = process.argv[2];
if (!storage || !path.isAbsolute(storage)) throw new Error('Pass an absolute external snapshot directory.');
const output = path.join(storage, 'erm-preview');
const config = loadConfig(path.join(root,'tailwind.config.ts'));
config.content = [root.replaceAll('\\','/')+'/src/**/*.{ts,tsx}',local.replaceAll('\\','/')+'/src/**/*.{ts,tsx}'];
const common = { configFile:path.join(root,'vite.config.ts'), root:local, publicDir:false,
  css:{postcss:{plugins:[tailwind(config),autoprefixer()]}},
  resolve:{alias:{'@':path.join(root,'src')}} };
await build({...common,build:{outDir:path.join(output,'client'),emptyOutDir:false}});
await build({...common,build:{ssr:path.join(local,'src/server.tsx'),outDir:path.join(local,'.server'),emptyOutDir:false}});
const {render}=await import(pathToFileURL(path.join(local,'.server/server.js')));
const template=await readFile(path.join(output,'client/index.html'),'utf8');
const html=template.replace('<div id="root"></div>','<div id="root">'+render()+'</div>');
for(const variant of ['erm']) await writeFile(path.join(output,variant+'.html'),html.replace('__VARIANT__',variant));
await mkdir(path.join(local,'../evidence'),{recursive:true});
await writeFile(path.join(local,'../evidence/build.json'),JSON.stringify({output,variants:['erm'],production_files_changed:false},null,2));
console.log('Isolated SSR preview built: '+output);
