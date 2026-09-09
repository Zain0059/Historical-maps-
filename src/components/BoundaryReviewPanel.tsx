import type { SlideData } from '../types';
import { BOUNDARY_SOURCES } from '../data/boundaryReview';
export function BoundaryReviewPanel({slide,onSelectPhase}:{slide:SlideData;onSelectPhase?:(id:string)=>void}) {
 const review=slide.boundaryReview;
 if(!review)return null;
 const ids=slide.boundaryPhase?.sourceIds??review.sourceIds;
 return <section className="boundary-review" aria-label="توثيق الحدود">
  <strong>{review.status==='schematic'?'رسم سابق قيد التحقيق المكاني':'مراجعة جزئية — الدقة موضحة أدناه'}</strong>
  {review.phases && <label className="block mt-2">المرحلة المعروضة
   <select id="boundary-phase-select" value={slide.boundaryPhase?.id} onChange={e=>onSelectPhase?.(e.target.value)} className="block w-full bg-white border border-stone-400 p-2 mt-1 rounded text-sm">
    {review.phases.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
   </select>
  </label>}
  <p className="mt-2" aria-live="polite">{slide.boundaryPhase?.summary??review.finding}</p>
  <p className="mt-2">{slide.boundaryPhase?.limitations??'المصدر التاريخي لا يثبت إحداثيات الرسم. الخط المنقّط يعني أن الترسيم لم يُحقق؛ لا تستخدمه لقياس مساحة أو للفصل في السيادة.'}</p>
  {(slide.id===0||slide.id===21)&&<p className="mt-2">نتوء وادي حلفا واختلاف التفسير موثقان في المصدر، لكن لم تضف لهما رقعة بإحداثيات غير مثبتة. المرجع ليس إعادة بناء للحدود منذ 1952.</p>}
  <details className="mt-2"><summary className="cursor-pointer underline">المصادر ونطاق التوثيق ({ids.length})</summary>
   {ids.length===0?<p>لم يتوفر في هذه المراجعة مصدر مكاني مناسب لهذه الرقعة؛ لا تُعتمد حدودها.</p>:ids.map(id=>{const s=BOUNDARY_SOURCES[id];return <p key={id} className="my-2"><a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.title}</a><br/>{s.scope}</p>})}
  </details>
 </section>;
}
