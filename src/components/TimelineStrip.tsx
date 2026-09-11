import React, { useEffect, useRef } from 'react';
import { SlideData } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface TimelineStripProps {
  slides: SlideData[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({
  slides, currentIndex, onSelectSlide, onPrev, onNext
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const eraGroups: { era: SlideData; entries: { slide: SlideData; index: number }[] }[] = [];
  slides.forEach((slide, index) => {
    const previous = eraGroups[eraGroups.length - 1];
    if (previous?.era.id === slide.id) previous.entries.push({ slide, index });
    else eraGroups.push({ era: slide, entries: [{ slide, index }] });
  });

  useEffect(() => {
    const container = scrollContainerRef.current;
    const active = container?.querySelector<HTMLElement>(`[data-index="${currentIndex}"]`);
    if (!container || !active) return;
    // Scroll only the shared timeline viewport, never the page or map.
    const viewport = container.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.left < viewport.left || item.right > viewport.right) {
      container.scrollBy({
        left: item.left + item.width / 2 - viewport.left - viewport.width / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      });
    }
  }, [currentIndex]);

  if (!slides.length) return null;

  return (
    <nav id="timeline-bar" dir="rtl" aria-label="الشريط الزمني: الحقب ومراحلها"
      className="flex shrink-0 min-w-0 border-t border-[#a9863f]/50 bg-[#17211b] select-none z-30">
      {/* Navigation sits beside the two rows, without adding a third row. */}
      <div className="grid grid-rows-[44px_76px] shrink-0 border-l border-[#a9863f]/40 bg-[#141c17]">
        <span className="flex items-center justify-center px-2 text-[11px] text-[#d9cfae] border-b border-[#a9863f]/40">الحقبة</span>
        <button id="nav-prev-btn" onClick={onPrev} disabled={currentIndex === 0}
          title="المرحلة السابقة" aria-label="المرحلة السابقة"
          className="px-2 text-[#e9e0c7] hover:bg-[#344032] disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-[#e9e0c7]">
          <ChevronRight className="w-4 h-4 mx-auto" />
          <span className="block text-[10px] mt-1">المراحل</span>
        </button>
      </div>
      <div ref={scrollContainerRef} dir="rtl"
        className="flex flex-1 min-w-0 overflow-x-auto overscroll-x-contain"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#a9863f #17211b' }}>
        {eraGroups.map(({ era, entries }) => {
          const isActiveEra = entries.some(entry => entry.index === currentIndex);
          const isOverview = era.id === 0;
          const hasStages = entries.length > 1;
          const headingId = `timeline-era-${era.id}`;
          const eraLabel = era.id === 1 ? 'بداية الأسرات' : era.categoryLabel;
          return (
            <section key={era.id} aria-labelledby={headingId}
              className="shrink-0 grid grid-rows-[44px_76px] border-l border-[#a9863f]/50">
              <h3 id={headingId} className="m-0 min-w-0 border-b border-[#a9863f]/40">
                <button onClick={() => onSelectSlide(isActiveEra ? currentIndex : entries[0].index)}
                  aria-current={isActiveEra ? 'true' : undefined}
                  className={`h-full w-full text-start px-3 text-[12px] font-bold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#e9e0c7] ${isActiveEra ? 'bg-[#344032] text-[#fff1c9]' : 'bg-[#202c24] text-[#d9cfae] hover:bg-[#344032]'}`}
                  title={era.headline}>
                  <span className="sticky right-3 inline-flex max-w-full items-center gap-2">
                    <span>{isOverview ? 'البداية' : `${era.id} · ${eraLabel}`}</span>
                    {hasStages && <span className="text-[10px] font-normal opacity-75">{entries.length} مراحل</span>}
                  </span>
                </button>
              </h3>
              <div role="group" aria-label={`مراحل ${era.categoryLabel}`} className="flex">
                {entries.map(({ slide, index }, phaseIndex) => {
                  const isActive = index === currentIndex;
                  const fullLabel = slide.boundaryPhase?.label.replace(/^\d+\s*\/\s*\d+\s*—\s*/, '') ?? slide.headline;
                  const separator = fullLabel.indexOf(':');
                  const date = hasStages && separator >= 0 ? fullLabel.slice(0, separator) : '';
                  const label = hasStages && separator >= 0 ? fullLabel.slice(separator + 1).trim() : isOverview ? 'مقدمة الأطلس' : fullLabel;
                  return (
                    <button key={`${slide.id}-${slide.boundaryPhase?.id ?? 'era'}`}
                      id={`timeline-node-${index}`} data-index={index}
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${era.categoryLabel} — ${hasStages ? `المرحلة ${phaseIndex + 1} من ${entries.length} — ` : ''}${fullLabel}`}
                      onClick={() => onSelectSlide(index)} title={fullLabel}
                      className={`h-full w-[164px] sm:w-[184px] shrink-0 px-2 py-1.5 border-l last:border-l-0 border-[#a9863f]/20 border-b-[3px] text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#e9e0c7] ${isActive ? 'bg-[#8a3b24] border-b-[#e6c777] text-white' : 'border-b-transparent text-[#e9e0c7] hover:bg-[#2a382e]'}`}>
                      <span className="flex items-center gap-1.5 text-[10px] leading-4 text-[#e6d4a8]">
                        {hasStages && <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 rounded-full border border-current text-[9px]">{phaseIndex + 1}</span>}
                        <span>{date || (isOverview ? 'الأطلس' : 'خريطة الحقبة')}</span>
                      </span>
                      <span className="line-clamp-2 text-[12px] font-medium leading-[17px] mt-1 whitespace-normal">{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <div className="grid grid-rows-[44px_76px] shrink-0 border-r border-[#a9863f]/40 bg-[#141c17]">
        <span className="flex items-center justify-center px-1 text-[10px] tabular-nums text-[#d9cfae] border-b border-[#a9863f]/40" dir="ltr" aria-label={`الخريطة ${currentIndex + 1} من ${slides.length}`}>{currentIndex + 1}/{slides.length}</span>
        <button id="nav-next-btn" onClick={onNext} disabled={currentIndex === slides.length - 1}
          title="المرحلة التالية" aria-label="المرحلة التالية"
          className="px-2 text-[#e9e0c7] hover:bg-[#344032] disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-[#e9e0c7]">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
