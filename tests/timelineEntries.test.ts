import assert from 'node:assert/strict';
import { ALL_SLIDES } from '../src/data/historicalData';
import { buildTimelineEntries, findTimelineIndex } from '../src/lib/timelineEntries';
const entries = buildTimelineEntries(ALL_SLIDES);
assert.equal(entries.length, ALL_SLIDES.length + 5);
assert.deepEqual(entries.slice(0,9).map(e=>e.slide.id),[0,1,1,1,2,2,2,2,3]);
for (let i=0;i<entries.length;i++) {
 const entry=entries[i];
 assert.equal(findTimelineIndex(entries,entry.eraIndex,entry.phaseId),i);
 if(entry.phaseId) assert.equal(entry.slide.boundaryPhase?.id,entry.phaseId);
}
assert.equal(findTimelineIndex(entries,2,'missing'),4);
assert.equal(entries[3].phaseId,'early-dynasty2');
assert.equal(entries[4].phaseId,'old-dynasty3');
assert.equal(entries[7].phaseId,'old-dynasty6');
console.log('Timeline phase ordering, era mapping and selected-phase restoration passed.');
