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

  // Auto-scroll to keep active era centered in the timeline
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
      {/* Horizontal timeline cards (Compact) */}
      <div className="px-2 py-0.5 border-b border-[#a9863f]/20 bg-[#17211b]">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-[#a9863f] scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const isOverview = idx === 0;

            return (
              <button
                key={`${slide.id}-${slide.boundaryPhase?.id ?? "era"}`}
                id={`timeline-node-${idx}`}
                data-index={idx}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${slide.headline}${slide.boundaryPhase ? ` — ${slide.boundaryPhase.label}` : ""}`}
                onClick={() => onSelectSlide(idx)}
                className={`group flex-shrink-0 px-2 py-0.5 rounded text-center transition-all duration-150 border-b-2 ${
                  isActive
                    ? 'bg-[#2a382e] border-[#8a3b24] text-[#e9e0c7] shadow-xs'
                    : 'bg-transparent border-transparent text-[#d9cfae]/60 hover:text-[#e9e0c7] hover:bg-[#222e25]'
                }`}
                style={{
                  minWidth: isOverview ? '62px' : slide.boundaryPhase ? '170px' : '78px',
                  maxWidth: slide.boundaryPhase ? '220px' : '120px'
                }}
              >
                <span className={`block font-serif text-[9.5px] leading-none ${isActive ? 'text-[#a9863f] font-bold' : 'text-[#a9863f]/80'}`}>
                  {isOverview ? 'البداية' : `الحقبة ${slide.id}${slide.boundaryPhase ? ` · ${slide.categoryLabel}` : ''}`}
                </span>
                <span
                  className={`block text-[10px] mt-0.5 truncate leading-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}
                  title={slide.boundaryPhase?.label ?? slide.headline}
                >
                  {slide.boundaryPhase ? slide.boundaryPhase.label : isOverview ? 'مقدمة' : slide.headline.replace(/^(عصر|الدولة|المملكة|جمهورية)\s+/, '')}
                </span>
              </button>
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
              title="العصر المعاصر (المعاصر)"
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

