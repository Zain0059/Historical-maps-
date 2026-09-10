import { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_SLIDES } from './data/historicalData';
import { getReviewedSlide } from './data/boundaryReview';
import { buildTimelineEntries, findTimelineIndex } from './lib/timelineEntries';
import { PeriodCategory } from './types';
import { Header } from './components/Header';
import { AtlasMap } from './components/AtlasMap';
import { NarrativePanel } from './components/NarrativePanel';
import { TimelineStrip } from './components/TimelineStrip';
import { EraListModal } from './components/EraListModal';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showModernBorder, setShowModernBorder] = useState<boolean>(false);
  const [showFrontierLandmarks, setShowFrontierLandmarks] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<PeriodCategory | 'all'>('all');
  const [narrativeTab, setNarrativeTab] = useState<'narrative' | 'statistics'>('narrative');

  const [phaseByEra, setPhaseByEra] = useState<Record<number, string>>({});
  const currentSlide = useMemo(() => getReviewedSlide(ALL_SLIDES[currentIndex], phaseByEra[ALL_SLIDES[currentIndex].id]), [currentIndex, phaseByEra]);

  const timelineEntries = useMemo(() => buildTimelineEntries(ALL_SLIDES), []);
  const timelineSlides = useMemo(() => timelineEntries.map(entry => entry.slide), [timelineEntries]);
  const timelineIndex = findTimelineIndex(timelineEntries, currentIndex, currentSlide.boundaryPhase?.id);
  const handleSelectTimeline = useCallback((index: number) => {
    const entry = timelineEntries[index];
    if (!entry) return;
    setCurrentIndex(entry.eraIndex);
    if (entry.phaseId) {
      setPhaseByEra(prev => ({...prev, [entry.slide.id]: entry.phaseId!}));
    }
  }, [timelineEntries]);
  const handlePrev = useCallback(() => {
    handleSelectTimeline(Math.max(0, timelineIndex - 1));
  }, [handleSelectTimeline, timelineIndex]);
  const handleNext = useCallback(() => {
    handleSelectTimeline(Math.min(timelineEntries.length - 1, timelineIndex + 1));
  }, [handleSelectTimeline, timelineEntries.length, timelineIndex]);

  // Keyboard navigation listener (Arrow Left/Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        return;
      }

      // Do not hijack arrow keys if focus is within interactive inputs or map container
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          target.isContentEditable ||
          target.closest('.leaflet-container') ||
          target.closest('#era-scrubber-slider') ||
          target.closest('#timeline-bar input[type="range"]')
        ) {
          return;
        }
      }

      // In RTL, ArrowLeft progresses forward, ArrowRight goes back
      if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Handle category selection
  const handleSelectCategory = (cat: PeriodCategory | 'all') => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setCurrentIndex(0);
    } else {
      const matchIndex = ALL_SLIDES.findIndex(s => s.periodCategory === cat && s.id !== 0);
      if (matchIndex !== -1) {
        setCurrentIndex(matchIndex);
      }
    }
  };

  return (
    <div id="atlas-app-root" className="flex flex-col h-screen w-screen overflow-hidden bg-[#141c17] text-[#e9e0c7]">
      {/* Top Header */}
      <Header
        currentIndex={currentIndex}
        totalSlides={ALL_SLIDES.length}
        onOpenModal={() => setIsModalOpen(true)}
        showModernBorder={showModernBorder}
        onToggleModernBorder={() => setShowModernBorder(prev => !prev)}
        showLegend={showLegend}
        onToggleLegend={() => setShowLegend(prev => !prev)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        showDataPanel={narrativeTab === 'statistics'}
        onToggleDataPanel={() => setNarrativeTab(prev => prev === 'statistics' ? 'narrative' : 'statistics')}
      />

      {/* Main split: Map and Historical Narrative Panel */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative overflow-hidden">
        {/* Right side in RTL (Left visually): Narrative panel */}
        <section
          id="narrative-section"
          className={`min-h-0 overflow-hidden border-b md:border-b-0 md:border-l border-[#a9863f]/30 z-20 transition-all ${
            narrativeTab === 'narrative'
              ? 'order-2 md:order-1 flex-1 h-[48vh] sm:h-[50vh] md:h-full md:flex-initial md:w-[48%] lg:w-[46%] xl:w-[45%] min-w-[320px] max-w-[720px]'
              : 'w-full flex-1 h-full'
          }`}
        >
          <NarrativePanel
            slide={currentSlide}
            onSelectPhase={id => setPhaseByEra(prev => ({...prev, [currentSlide.id]: id}))}
            activeTab={narrativeTab}
            onTabChange={setNarrativeTab}
            onSelectSlideIndex={(idx) => setCurrentIndex(idx)}
          />
        </section>

        {/* Left side in RTL (Right visually): Interactive Atlas Map (Loads ONLY in the first tab) */}
        {narrativeTab === 'narrative' && (
          <section
            id="map-section"
            className="order-1 md:order-2 flex-1 h-[52vh] sm:h-[50vh] md:h-full min-h-[200px] min-w-0 relative z-10 flex-shrink-0 md:flex-shrink"
          >
            <AtlasMap
              currentSlide={currentSlide}
              showModernBorder={showModernBorder}
              onToggleModernBorder={() => setShowModernBorder(prev => !prev)}
              showFrontierLandmarks={showFrontierLandmarks}
              onToggleFrontierLandmarks={() => setShowFrontierLandmarks(prev => !prev)}
              showLegend={showLegend}
              onToggleLegend={() => setShowLegend(prev => !prev)}
              activeTab={narrativeTab}
            />
          </section>
        )}
      </main>

      {/* Bottom Timeline and Navigation Bar */}
      <footer className="flex-shrink-0 z-20">
        <TimelineStrip
          slides={timelineSlides}
          currentIndex={timelineIndex}
          onSelectSlide={handleSelectTimeline}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </footer>

      {/* 18 Eras Index Modal */}
      <EraListModal
        slides={ALL_SLIDES}
        currentIndex={currentIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectSlide={idx => setCurrentIndex(idx)}
      />
    </div>
  );
}
