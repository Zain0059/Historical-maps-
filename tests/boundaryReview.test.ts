import assert from 'node:assert/strict';
import { ALL_SLIDES } from '../src/data/historicalData';
import { BOUNDARY_REVIEWS, BOUNDARY_SOURCES, getReviewedSlide, MODERN_DISPUTES } from '../src/data/boundaryReview';
import geography from '../src/data/referenceGeography.json';

for (const slide of ALL_SLIDES) {
 const r=BOUNDARY_REVIEWS[slide.id];
 assert.ok(r, `Missing audit: ${slide.id}`);
 for(const id of r.sourceIds) assert.ok(BOUNDARY_SOURCES[id],id);
 for(const phase of r.phases??[]) {
  for(const id of phase.sourceIds) assert.ok(BOUNDARY_SOURCES[id],id);
  const result=getReviewedSlide(slide,phase.id);
  assert.equal(result.boundaryPhase?.id,phase.id);
  assert.equal(result.extent?.core.length,0,'Do not retain the old sovereign polygon under phase features');
  assert.equal(result.extent?.outposts,undefined,'Do not inherit out-of-phase outposts');
  assert.equal(result.geographicalStats,undefined,'No inherited maximum-extent statistics');
  assert.equal(result.capital,phase.capital,'Do not inherit a capital across historical phases');
  for(const f of phase.features) {
   assert.ok(f.sourceIds?.length);
   for(const id of f.sourceIds??[]) assert.ok(BOUNDARY_SOURCES[id],id);
   const points=f.polygons?.flat(2)??f.coords??[];
   assert.ok(points.length>=(f.geometryType==='point'?1:f.geometryType==='line'?2:3));
   for(const [lat,lon] of points) assert.ok(Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=-90&&lat<=90&&lon>=-180&&lon<=180);
  }
 }
}
const ptolemy=ALL_SLIDES.find(s=>s.id===8)!;
assert.equal(getReviewedSlide(ptolemy,'ptolemy-240').extent?.controlFeatures?.length,4);
assert.equal(getReviewedSlide(ptolemy,'ptolemy-100').extent?.controlFeatures?.length,3);
assert.equal(getReviewedSlide(ptolemy,'ptolemy-55').extent?.controlFeatures?.length,1);
assert.equal(getReviewedSlide(ptolemy,'invalid').boundaryPhase?.id,'ptolemy-240');
assert.equal(MODERN_DISPUTES[0].type,'disputed_territory');
assert.equal(MODERN_DISPUTES[1].type,'uncertain_frontier','Bir Tawil is not a dual claim like Halaib');
const island=geography.features.find(f=>f.properties.name==='Cyprus')!;
assert.equal(island.geometry.type,'MultiPolygon');
const coast=(island.geometry.coordinates as number[][][][]).flat(2);
assert.ok(Math.max(...coast.map(p=>p[1]))>35.6,'Cyprus must include its northern coastline, not modern political partition');
const roman=ALL_SLIDES.find(s=>s.id===9)!;
assert.equal(getReviewedSlide(roman,'sasanian-625').extent?.controlFeatures?.[0].type,'temporary_occupation');
assert.equal(getReviewedSlide(roman,'byzantine-635').extent?.controlFeatures?.[0].type,'direct_administration');
for(const id of [0,21]) assert.ok(getReviewedSlide(ALL_SLIDES.find(s=>s.id===id)!).extent?.controlFeatures?.some(f=>f.name==='مثلث حلايب'));
console.log('Boundary audit coverage, phase isolation, source references, coordinates, and dispute semantics passed.');
