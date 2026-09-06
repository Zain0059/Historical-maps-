import React, { useEffect, useRef } from 'react';
import { SlideData } from '../types';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, History } from 'lucide-react';

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
    <div id="timeline-bar" className="bg-[#1c261f] border-t border-[#a9863f]/30 select-none">
      {/* Horizontal timeline cards */}
      <div className="px-3 py-1.5 border-b border-[#a9863f]/20">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-[#a9863f] scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const isOverview = idx === 0;

            return (
              <button
                key={slide.id}
                id={`timeline-node-${idx}`}
                data-index={idx}
                onClick={() => onSelectSlide(idx)}
                className={`group flex-shrink-0 px-2.5 py-1 rounded text-center transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'bg-[#2a382e] border-[#8a3b24] text-[#e9e0c7] shadow-sm'
                    : 'bg-transparent border-transparent text-[#d9cfae]/60 hover:text-[#e9e0c7] hover:bg-[#222e25]'
                }`}
                style={{
                  minWidth: isOverview ? '72px' : '90px',
                  maxWidth: '135px'
                }}
              >
                <span className={`block font-serif text-[10.5px] leading-tight ${isActive ? 'text-[#a9863f] font-bold' : 'text-[#a9863f]/80'}`}>
                  {isOverview ? 'البداية' : `العصر ${slide.id}`}
                </span>
                <span
                  className={`block text-[11px] mt-0.5 truncate leading-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}
                  title={slide.headline}
                >
                  {isOverview ? 'مقدمة الأطلس' : slide.headline.replace(/^(عصر|الدولة|المملكة|جمهورية)\s+/, '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Slider Scrubber & Quick Navigation Controls */}
      <div className="px-3 sm:px-4 py-2 bg-[#141c17]">
        <div className="flex flex-col gap-1.5 max-w-7xl mx-auto">
          {/* Top scrubber info row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-serif font-bold text-[11px] text-[#c9bd97] flex items-center gap-1 shrink-0">
                <History className="w-3.5 h-3.5 text-[#a9863f]" />
                <span className="hidden sm:inline">شريط التمرير الزمني:</span>
                <span className="sm:hidden">التمرير:</span>
              </span>

              <div className="flex items-center gap-1.5 truncate">
                <span className="bg-[#8a3b24] text-white font-bold text-[10.5px] px-1.5 py-0.5 rounded shadow-sm shrink-0">
                  {currentIndex === 0 ? 'مقدمة الأطلس' : `الحقبة ${currentIndex}`}
                </span>
                <span className="text-[#f2b880] font-serif font-bold text-xs truncate">
                  {currentSlide.headline}
                </span>
              </div>
            </div>

            {/* Date range badge */}
            <div className="text-[11px] font-sans text-[#a9863f] shrink-0 font-medium mr-2">
              {currentSlide.dateRange || ''}
            </div>
          </div>

          {/* Slider track row with Jump & Step Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick jump to beginning (3200 BC) */}
            <button
              id="nav-first-era-btn"
              onClick={() => onSelectSlide(0)}
              disabled={currentIndex === 0}
              title="الانتقال إلى أول العصور (3200 ق.م)"
              className="p-1 rounded text-[#d9cfae]/70 hover:text-[#e9e0c7] hover:bg-[#2a382e] disabled:opacity-20 disabled:pointer-events-none transition-colors shrink-0"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>

            {/* Step Previous button */}
            <button
              id="nav-prev-btn"
              onClick={onPrev}
              disabled={currentIndex === 0}
              title="الحقبة السابقة (السهم الأيمن)"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border border-[#a9863f]/40 bg-[#1c261f] text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] disabled:opacity-25 disabled:pointer-events-none transition-colors shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hidden md:inline">السابق</span>
            </button>

            {/* Antiquity label */}
            <span className="text-[10.5px] font-serif text-[#d9cfae]/70 shrink-0 select-none hidden xs:inline">
              3200 ق.م
            </span>

            {/* Interactive Range Scrubber */}
            <div className="relative flex-1 flex items-center py-1">
              <input
                id="era-scrubber-slider"
                type="range"
                min={0}
                max={slides.length - 1}
                step={1}
                value={currentIndex}
                onChange={(e) => onSelectSlide(Number(e.target.value))}
                onInput={(e) => onSelectSlide(Number((e.target as HTMLInputElement).value))}
                aria-label="شريط التمرير الزمني السريع بين الحقب التاريخية"
                aria-valuetext={currentSlide.headline}
                className="timeline-scrubber-slider w-full z-10"
                title={`اسحب للتمرير السريع: ${currentSlide.headline}`}
              />
            </div>

            {/* Modern era label */}
            <span className="text-[10.5px] font-serif text-[#d9cfae]/70 shrink-0 select-none hidden xs:inline">
              1989 م
            </span>

            {/* Step Next button */}
            <button
              id="nav-next-btn"
              onClick={onNext}
              disabled={currentIndex === slides.length - 1}
              title="الحقبة التالية (السهم الأيسر)"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border border-[#a9863f]/40 bg-[#1c261f] text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] disabled:opacity-25 disabled:pointer-events-none transition-colors shrink-0"
            >
              <span className="hidden md:inline">التالي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Quick jump to modern era (1989 AD) */}
            <button
              id="nav-last-era-btn"
              onClick={() => onSelectSlide(slides.length - 1)}
              disabled={currentIndex === slides.length - 1}
              title="الانتقال إلى العصر المعاصر (1989 م)"
              className="p-1 rounded text-[#d9cfae]/70 hover:text-[#e9e0c7] hover:bg-[#2a382e] disabled:opacity-20 disabled:pointer-events-none transition-colors shrink-0"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Slide Index Badge */}
            <div className="font-serif text-xs text-[#a9863f] border border-[#a9863f]/40 px-2 py-0.5 rounded bg-[#1c261f] shrink-0 text-center min-w-[52px] dir-ltr">
              {currentIndex + 1} / {slides.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

