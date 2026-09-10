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
const republic=ALL_SLIDES.find(s=>s.id===21)!;
assert.equal(getReviewedSlide(republic).boundaryPhase?.id,'modern-reference');
const occupied=getReviewedSlide(republic,'egypt-1968');
assert.equal(occupied.extent?.controlFeatures?.length,2);
assert.ok(!occupied.extent?.controlFeatures?.some(f=>f.type==='disputed_territory'),'Do not back-project modern Halaib metadata into 1968');
const sinai=occupied.extent!.controlFeatures!.find(f=>f.type==='temporary_occupation')!;
const inside=(p:number[],ring:number[][])=>{
 let yes=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [yi,xi]=ring[i],[yj,xj]=ring[j];
  if((yi>p[0])!==(yj>p[0])&&p[1]<(xj-xi)*(p[0]-yi)/(yj-yi)+xi)yes=!yes;
 }
 return yes;
};
assert.ok(inside([29,34],sinai.polygons![0][0]),'Interior Sinai must be in the occupation layer');
assert.ok(!inside([30.05,31.24],sinai.polygons![0][0]),'Cairo must not be in the occupation layer');
assert.ok(!inside([31.5,34.47],sinai.polygons![0][0]),'Do not merge Gaza into the Sinai geometry');
const lateRoman=getReviewedSlide(roman,'roman-post-diocletian').extent!.controlFeatures!;
assert.equal(lateRoman.length,3);
assert.ok(lateRoman.every(f=>f.type==='administrative_boundary'&&f.geometryType==='line'&&!f.polygons),'Administrative lines must not become closed sovereign polygons');
const colonial=getReviewedSlide(ALL_SLIDES.find(s=>s.id===20)!,'egypt-sudan-1935');
assert.equal(colonial.extent?.controlFeatures?.filter(f=>f.type==='joint_administration').length,1);
assert.ok(!BOUNDARY_REVIEWS[21].phases?.some(p=>p.year===1979),'Do not equate the treaty date with completed withdrawal');
const newKingdom=ALL_SLIDES.find(s=>s.id===5)!;
const megiddo=getReviewedSlide(newKingdom,'new-kingdom-megiddo');
const ramesside=getReviewedSlide(newKingdom,'new-kingdom-ramesside');
assert.ok(megiddo.extent!.controlFeatures!.some(f=>f.type==='campaign'&&f.geometryType==='point'));
assert.ok(!ramesside.extent!.controlFeatures!.some(f=>f.type==='campaign'),'Do not carry a 1457 BCE campaign into the Ramesside snapshot');
for (const result of [megiddo,ramesside]) {
 assert.equal(result.extent!.controlFeatures!.filter(f=>f.geometryType!=='point').length,1,'Do not connect archaeological evidence into an invented empire polygon');
 assert.equal(result.extent?.secondary,undefined);
}
const barkalPoint=ramesside.extent!.controlFeatures!.find(f=>f.geometryType==='point')!.coords![0];
assert.ok(barkalPoint[0]>18.53&&barkalPoint[0]<18.54&&barkalPoint[1]>31.82&&barkalPoint[1]<31.84,'Keep UNESCO site coordinates in latitude/longitude order');
const saite=ALL_SLIDES.find(s=>s.id===7)!;
assert.equal(getReviewedSlide(saite).boundaryPhase?.id,'saite-550');
const raid=getReviewedSlide(saite,'saite-593').extent!.controlFeatures!;
assert.ok(raid.some(f=>f.type==='campaign'&&f.geometryType==='point'));
assert.ok(!getReviewedSlide(saite,'saite-550').extent!.controlFeatures!.some(f=>f.type==='campaign'));
for(const slide of ALL_SLIDES) assert.equal(getReviewedSlide(slide).geographicalStats,undefined,'Do not present unverified maximum reach as geographic fact');
for (const [eraId,count] of [[1,3],[2,4]]) {
 const slide=ALL_SLIDES.find(s=>s.id===eraId)!;
 const phases=BOUNDARY_REVIEWS[eraId].phases!;
 assert.equal(phases.length,count);
 assert.equal(new Set(phases.map(p=>p.id)).size,count);
 assert.ok(phases.every((p,i)=>i===0||p.year>phases[i-1].year),'Chronological map order');
 for(const phase of phases){
  const result=getReviewedSlide(slide,phase.id);
  assert.ok(phase.changes&&phase.narrative?.length===2,'Each map needs its own explanation');
  assert.equal(result.extent!.secondary,undefined);
  assert.ok(phase.features.filter(f=>f.geometryType!=='point').every(f=>f.type==='geographic_context'),'No unverified ancient sovereign outline');
  assert.ok(phase.features.every(f=>(f.sourceIds??[]).every(id=>phase.sourceIds.includes(id))),'Show every feature source in this phase');
 }
}
const oldPhases=BOUNDARY_REVIEWS[2].phases!;
assert.equal(oldPhases.filter(p=>p.features.some(f=>f.name?.startsWith('وادي الجرف'))).length,1,'The port must not persist across all Old Kingdom dynasties');
assert.ok(oldPhases[1].features.some(f=>f.name?.startsWith('وادي الجرف')&&f.certainty==='schematic'));
assert.ok(oldPhases[3].features.some(f=>f.name?.startsWith('عين أصيل')&&f.coords?.[0][0]===25.559380));
assert.ok(oldPhases.slice(0,3).every(p=>!p.features.some(f=>f.name?.startsWith('عين أصيل'))),'Do not backdate Sixth Dynasty governors');
console.log('Boundary audit coverage, phase isolation, source references, coordinates, and dispute semantics passed.');
