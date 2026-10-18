import test from 'node:test';
import assert from 'node:assert/strict';
import {publicModifiedAt} from '../scripts/public-dates.mjs';
test('public modification begins at publication and advances only for later content edits',()=>{
 const published='2026-10-18T19:12:02.612Z',before='2026-10-17T16:00:00.000Z',after='2026-10-20T16:00:00.000Z';
 const page={first_published_at:published,substantive_updated_at:before};
 assert.equal(publicModifiedAt(page),published);
 assert.equal(publicModifiedAt({...page,substantive_updated_at:after}),after);
 assert.equal(publicModifiedAt({...page,substantive_updated_at:published}),published);
 assert.equal(publicModifiedAt({substantive_updated_at:before}),before);
 assert.equal(publicModifiedAt(null),null);
 assert.throws(()=>publicModifiedAt({first_published_at:'invalid'}));
 assert.deepEqual(page,{first_published_at:published,substantive_updated_at:before});
});
