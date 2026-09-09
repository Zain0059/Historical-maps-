import L from 'leaflet';
import type { ControlFeature, ControlType } from '../types';
import { BOUNDARY_SOURCES } from '../data/boundaryReview';
export const CONTROL_STYLES: Record<ControlType, {color:string; dashArray?:string; label:string}> = {
 direct_administration:{color:'#8a3b24',label:'إدارة مباشرة / قلب إقليمي'},
 dependency:{color:'#147d69',dashArray:'9 4',label:'تبعية / نفوذ'},
 temporary_occupation:{color:'#b45309',dashArray:'12 4 2 4',label:'احتلال أو حكم مؤقت'},
 campaign:{color:'#b45309',dashArray:'2 6',label:'حملة — ليست ضماً'},
 trade_mining_garrison:{color:'#0369a1',dashArray:'3 5',label:'محطة / حامية / تجارة'},
 uncertain_frontier:{color:'#6d28d9',dashArray:'2 7',label:'حد غير مؤكد / اختلاف إسناد'},
 disputed_territory:{color:'#be123c',dashArray:'8 4',label:'مطالبات متعارضة / نزاع'},
 treaty_boundary:{color:'#334155',dashArray:'12 3',label:'خط اتفاقية'},
 holy_sanctuary:{color:'#147d69',dashArray:'3 6',label:'حماية الحرمين'},
 maritime_zone:{color:'#0369a1',dashArray:'6 5',label:'نفوذ بحري — ليس أرضاً'},
};
export const escapeHtml=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function featurePoints(f:ControlFeature): [number,number][] {
 return (f.polygons ? f.polygons.flat(2) : f.coords ?? []).filter(p=>p.length===2 && Number.isFinite(p[0]) && Number.isFinite(p[1]) && Math.abs(p[0])<=90 && Math.abs(p[1])<=180);
}
export function drawBoundaryFeatures(features:ControlFeature[], pane='historicalOverlayPane'): L.FeatureGroup {
 const group=L.featureGroup();
 features.forEach((f)=>{
  const points=featurePoints(f);
  if(points.length<(f.geometryType==='point'?1:f.geometryType==='line'?2:3)) return;
  const style={...CONTROL_STYLES[f.type],...(f.color?{color:f.color}:{})};
  const options={pane,color:style.color,weight:2,dashArray:style.dashArray ?? (f.certainty==='schematic'?'5 4':undefined),fillColor:style.color,fillOpacity:f.type==='direct_administration'?0.12:0.18};
  const layer=f.geometryType==='point'?L.circleMarker(points[0],{...options,radius:7,fillOpacity:0.8}):f.geometryType==='line'?L.polyline(points,options):L.polygon(f.polygons ?? points,options);
  const sources=(f.sourceIds??[]).map(id=>BOUNDARY_SOURCES[id]).filter(Boolean);
  const certainty=f.geometryType==='point'?'علامة موقع؛ لا تثبت حدود الإقليم المحيط':f.certainty==='schematic'?'رسم توضيحي؛ موضع الحافة غير محقق':'هندسة معممة؛ ليست مسحاً قانونياً';
  const content=`<div dir="rtl"><strong>${escapeHtml(f.name??f.label??style.label)}</strong><p>${escapeHtml(style.label)}</p><p>${escapeHtml(f.description??'')}</p><p>${certainty}</p>${sources.map(s=>`<p><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)}</a></p>`).join('')}</div>`;
  layer.bindTooltip(escapeHtml(f.name??style.label),{sticky:true,className:'historical-tooltip'});
  layer.bindPopup(content,{maxWidth:300});
  if(f.type==='disputed_territory') layer.on('add',()=>{
   const path=layer.getElement(); const svg=(path as SVGElement | undefined)?.ownerSVGElement;
   if(!svg||!path)return;
   const id=`boundary-hatch-${L.stamp(group)}`;
   if(!svg.querySelector(`#${id}`)){
    const ns='http://www.w3.org/2000/svg';
    const defs=document.createElementNS(ns,'defs');const pattern=document.createElementNS(ns,'pattern');
    pattern.setAttribute('id',id);pattern.setAttribute('width','8');pattern.setAttribute('height','8');pattern.setAttribute('patternUnits','userSpaceOnUse');pattern.setAttribute('patternTransform','rotate(45)');
    const line=document.createElementNS(ns,'line');line.setAttribute('x1','0');line.setAttribute('y1','0');line.setAttribute('x2','0');line.setAttribute('y2','8');line.setAttribute('stroke',style.color);line.setAttribute('stroke-width','3');
    pattern.appendChild(line);defs.appendChild(pattern);svg.prepend(defs);
   }
   path.setAttribute('fill',`url(#${id})`);path.setAttribute('fill-opacity','0.55');
  });
  group.addLayer(layer);
 });
 group.on('remove',()=>document.querySelectorAll(`#boundary-hatch-${L.stamp(group)}`).forEach(p=>p.parentElement?.remove()));
 return group;
}
