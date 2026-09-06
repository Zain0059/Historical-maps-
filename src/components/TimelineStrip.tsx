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
  slides,
  currentIndex,
  onSelectSlide,
  onPrev,
  onNext
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      {/* Horizontal timeline items */}
      <div className="px-3 py-2">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#a9863f] scrollbar-track-transparent"
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
                className={`group flex-shrink-0 px-3 py-1.5 rounded text-center transition-all duration-200 border-b-3 ${
                  isActive
                    ? 'bg-[#2a382e] border-[#8a3b24] text-[#e9e0c7] shadow-sm'
                    : 'bg-transparent border-transparent text-[#d9cfae]/60 hover:text-[#e9e0c7] hover:bg-[#222e25]'
                }`}
                style={{
                  minWidth: isOverview ? '76px' : '96px',
                  maxWidth: '140px'
                }}
              >
                <span className={`block font-serif text-[11px] leading-tight ${isActive ? 'text-[#a9863f] font-bold' : 'text-[#a9863f]/80'}`}>
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

      {/* Navigation and quick controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#141c17] border-t border-[#a9863f]/20">
        <div className="flex items-center gap-2">
          <button
            id="nav-prev-btn"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded text-xs font-medium border border-[#a9863f]/50 text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <button
            id="nav-next-btn"
            onClick={onNext}
            disabled={currentIndex === slides.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded text-xs font-medium border border-[#a9863f]/50 text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Current slide indicator */}
        <div className="text-xs font-serif text-[#a9863f] border border-[#a9863f]/40 px-2.5 py-0.5 rounded bg-[#1c261f]">
          <span>{currentIndex + 1} / {slides.length}</span>
          <span className="text-[#d9cfae]/60 mr-2">
            ({currentIndex === 0 ? 'نظرة عامة' : slides[currentIndex].headline})
          </span>
        </div>
      </div>
    </div>
  );
};
