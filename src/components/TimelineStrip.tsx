import React, { useEffect, useRef } from 'react';
import { SlideData } from '../types';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';

interface TimelineStripProps {
  slides: SlideData[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onPrev,
  onNext
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentSlide = slides[currentIndex] || slides[0];

  const eraGroups: { era: SlideData; entries: { slide: SlideData; index: number }[] }[] = [];
  slides.forEach((slide: SlideData, index: number) => {
    const previous = eraGroups[eraGroups.length - 1];
    if (previous?.era.id === slide.id) previous.entries.push({ slide, index });
    else eraGroups.push({ era: slide, entries: [{ slide, index }] });
  });

  // Keep the selected map visible within its parent era.
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector(`[data-index="${currentIndex}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentIndex]);

  return (
    <div id="timeline-bar" className="bg-[#1c261f] border-t border-[#a9863f]/30 select-none z-30">
      {/* Era headings span their own row of map stages. */}
      <div className="px-2 py-1 border-b border-[#a9863f]/20 bg-[#17211b]">
        <div
          ref={scrollContainerRef}
          dir="rtl"
          className="flex items-stretch gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#a9863f] scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {eraGroups.map(({ era, entries }) => {
            const isActiveEra = entries.some(entry => entry.index === currentIndex);
            const isOverview = era.id === 0;
            const hasStages = entries.length > 1;
            const headingId = `timeline-era-${era.id}`;
            return (
              <section
                key={era.id}
                aria-labelledby={headingId}
                className={`shrink-0 rounded border ${isActiveEra ? 'border-[#a9863f]/70 bg-[#222e25]' : 'border-[#a9863f]/20'}`}
              >
                <h3 id={headingId} className="border-b border-[#a9863f]/30">
                  <button
                    onClick={() => onSelectSlide(isActiveEra ? currentIndex : entries[0].index)}
                    className={`block w-full px-2 py-1 text-start text-[11px] font-bold rounded-t focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9e0c7] ${isActiveEra ? 'text-[#e9e0c7] bg-[#344032]' : 'text-[#a9863f] hover:bg-[#2a382e]'}`}
                    title={era.headline}
                  >
                    <span className="sticky right-0 block w-max max-w-[260px] truncate">
                      {isOverview ? 'البداية' : `الحقبة ${era.id} · ${era.categoryLabel}`}
                      {hasStages && <span className="ms-2 text-[10px] font-normal">({entries.length} مراحل)</span>}
                    </span>
                  </button>
                </h3>
                <div role="group" aria-label={`خرائط ${era.categoryLabel}`} className="flex gap-1 p-1">
                  {entries.map(({ slide, index }, phaseIndex) => {
                    const isActive = index === currentIndex;
                    const label = hasStages
                      ? slide.boundaryPhase!.label.replace(/^\d+\s*\/\s*\d+\s*—\s*/, '')
                      : isOverview ? 'مقدمة' : slide.headline;
                    return (
                      <button
                        key={`${slide.id}-${slide.boundaryPhase?.id ?? 'era'}`}
                        id={`timeline-node-${index}`}
                        data-index={index}
                        aria-current={isActive ? 'step' : undefined}
                        aria-label={`${era.headline} — ${label}`}
                        onClick={() => onSelectSlide(index)}
                        title={label}
                        className={`shrink-0 rounded px-2 py-1 text-center border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9e0c7] ${hasStages ? 'w-[150px]' : 'w-[130px]'} ${
                          isActive
                            ? 'bg-[#8a3b24] border-[#d5b76e] text-white'
                            : 'border-transparent text-[#d9cfae]/80 hover:bg-[#2a382e] hover:text-white'
                        }`}
                      >
                        <span className="block text-[9px] leading-tight opacity-80">
                          {hasStages ? `المرحلة ${phaseIndex + 1}` : isOverview ? 'الأطلس' : 'خريطة الحقبة'}
                        </span>
                        <span className="block text-[10px] leading-tight mt-0.5 truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Interactive Slider Scrubber & Compact Navigation Row */}
      <div className="px-2.5 py-1 bg-[#141c17]">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 max-w-7xl mx-auto">
          {/* Right Controls (in RTL): Jump to Start + Step Prev */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id="nav-first-era-btn"
              onClick={() => onSelectSlide(0)}
              disabled={currentIndex === 0}
              title="أول العصور (3100 ق.م)"
              className="p-1 rounded text-[#d9cfae]/70 hover:text-[#e9e0c7] hover:bg-[#2a382e] disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="nav-prev-btn"
              onClick={onPrev}
              disabled={currentIndex === 0}
              title="الخريطة السابقة" aria-label="الخريطة السابقة"
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-[#a9863f]/40 bg-[#1c261f] text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] disabled:opacity-25 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">السابق</span>
            </button>
          </div>

          {/* Center: Compact Active Era Indicator + Range Scrubber */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            {/* Active Era Chip */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0 truncate max-w-[200px] lg:max-w-[260px]">
              <span className="bg-[#8a3b24] text-white font-bold text-[10px] px-1.5 py-0.2 rounded shadow-xs shrink-0">
                {currentIndex === 0 ? 'مقدمة' : `الحقبة ${currentSlide.id}`}
              </span>
              <span className="text-[#f2b880] font-serif font-bold text-xs truncate">
                {currentSlide.boundaryPhase?.label ?? currentSlide.headline}
              </span>
            </div>

            {/* Slider track with dates */}
            <span className="text-[10px] font-serif text-[#d9cfae]/60 shrink-0 select-none hidden xs:inline">
              3100 ق.م
            </span>

            <div className="relative flex-1 flex items-center py-0.5">
              <input
                id="era-scrubber-slider"
                type="range"
                min={0}
                max={slides.length - 1}
                step={1}
                value={currentIndex}
                onChange={(e) => onSelectSlide(Number(e.target.value))}
                onInput={(e) => onSelectSlide(Number((e.target as HTMLInputElement).value))}
                aria-label="شريط التمرير الزمني السريع بين الخرائط والمراحل التاريخية"
                aria-valuetext={currentSlide.boundaryPhase?.label ?? currentSlide.headline}
                className="timeline-scrubber-slider w-full z-10"
                title={`اسحب للتمرير السريع: ${currentSlide.boundaryPhase?.label ?? currentSlide.headline}`}
              />
            </div>

            <span className="text-[10px] font-serif text-[#d9cfae]/60 shrink-0 select-none hidden xs:inline">
              المعاصر
            </span>
          </div>

          {/* Left Controls (in RTL): Step Next + Jump to End + Counter */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id="nav-next-btn"
              onClick={onNext}
              disabled={currentIndex === slides.length - 1}
              title="الخريطة التالية" aria-label="الخريطة التالية"
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-[#a9863f]/40 bg-[#1c261f] text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] disabled:opacity-25 disabled:pointer-events-none transition-colors"
            >
              <span className="hidden sm:inline">التالي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              id="nav-last-era-btn"
              onClick={() => onSelectSlide(slides.length - 1)}
              disabled={currentIndex === slides.length - 1}
              title="العصر المعاصر"
              className="p-1 rounded text-[#d9cfae]/70 hover:text-[#e9e0c7] hover:bg-[#2a382e] disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>

            {/* Slide Index Badge */}
            <div className="font-serif text-[11px] text-[#a9863f] border border-[#a9863f]/40 px-1.5 py-0.5 rounded bg-[#1c261f] shrink-0 text-center font-bold dir-ltr">
              {currentIndex + 1}/{slides.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

