import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {analyticsHead} from '../scripts/analytics.mjs';

test('analytics is disabled in previews and validates the measurement destination',()=>{
 assert.equal(analyticsHead(''), '');
 assert.equal(analyticsHead('G-VD3JR25R7P',{preview:true}), '');
 assert.match(analyticsHead('G-VD3JR25R7P'), /data-measurement-id="G-VD3JR25R7P"/);
 assert.throws(()=>analyticsHead('G-123456"><script>'));
});
test('public pages contain one analytics loader, editorial preview contains none',async()=>{
 for(const path of ['index.html','servicos/emissoes-fugitivas.html','blog/o-que-e-ldar.html','politica-privacidade.html']){
  const html=await readFile('dist/'+path,'utf8');
  assert.equal((html.match(/src="\/analytics.js"/g)||[]).length,1);
  assert.equal((html.match(/googletagmanager.com\/gtag/g)||[]).length,0);
 }
 assert.doesNotMatch(await readFile('dist-preview/index.html','utf8'),/src="\/analytics.js"/);
});
