import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SlideData } from '../types';
import { Shield, BookOpen, Landmark, Calendar, MapPin, ExternalLink, Sparkles, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { BoundaryReviewPanel } from './BoundaryReviewPanel';
import { HistoricalDataPanel } from './HistoricalDataPanel';
import { getStatBySlideId } from '../data/eraStatistics';

interface NarrativePanelProps {
  onSelectPhase?: (id:string) => void;
  slide: SlideData;
  onSelectCapital?: () => void;
  onSelectSlideIndex?: (index: number) => void;
  activeTab?: 'narrative' | 'statistics';
  onTabChange?: (tab: 'narrative' | 'statistics') => void;
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({
  slide,
  onSelectPhase,
  onSelectCapital,
  onSelectSlideIndex,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [localTab, setLocalTab] = useState<'narrative' | 'statistics'>('narrative');
  const [imageError, setImageError] = useState<boolean>(false);
  const currentTab = controlledTab !== undefined ? controlledTab : localTab;

  useEffect(() => {
    setImageError(false);
  }, [slide.id, slide.media?.url]);

  const handleTabSelect = (tab: 'narrative' | 'statistics') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalTab(tab);
    }
  };

  const currentEraStat = getStatBySlideId(slide.id);

  return (
    <div
      id="narrative-scroll-panel"
      className="w-full h-full min-h-0 overflow-y-auto overscroll-contain bg-[#f7f3e8] text-[#17120a] p-4 sm:p-5 md:p-6 lg:p-7 relative z-10 select-text scroll-smooth scrollbar-thin scrollbar-thumb-[#8a3b24] scrollbar-track-[#ddd3b7]/30 transition-colors duration-300"
      style={{
        boxShadow: 'inset 0 0 35px rgba(90, 70, 30, 0.08)'
      }}
    >
      {/* Visual sweep accent line when era changes */}
      <div key={`era-sweep-${slide.id}`} className="era-transition-line" />

      {/* Top Switcher Tabs: Narrative vs Recharts Data Panel */}
      <div className="flex items-center justify-between border-b-2 border-[#cbbd95] pb-2 mb-3.5">
        <div className="flex items-center gap-1.5 bg-[#eae2ce] p-1 rounded-lg border border-[#c5b58c]">
          <button
            id="tab-narrative"
            type="button"
            onClick={() => handleTabSelect('narrative')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'narrative'
                ? 'bg-[#101713] text-[#fdfbf7] shadow-sm'
                : 'text-[#2a2216] hover:text-[#0a100c] hover:bg-[#d8ccb0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>السرد والحدود</span>
          </button>

          <button
            id="tab-statistics"
            type="button"
            onClick={() => handleTabSelect('statistics')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'statistics'
                ? 'bg-[#752612] text-white shadow-sm'
                : 'text-[#2a2216] hover:text-[#0a100c] hover:bg-[#d8ccb0]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>البيانات</span>

          </button>
        </div>

        {/* High-contrast era counter */}
        <span className="text-xs text-[#2a2216] hidden sm:inline font-bold">
          {slide.id === 0 ? 'نظرة عامة على الحدود' : `الحقبة ${slide.id} من 21`}
        </span>
      </div>

      {/* VIEW 1: Recharts Data Panel View */}
      {currentTab === 'statistics' ? (
        slide.boundaryReview ? <div className="p-5 leading-relaxed"><h2 className="font-bold">المساحات قيد المراجعة</h2><p>أُوقف عرض أرقام المساحة والمقارنات القديمة لأنها غير مرتبطة بمرحلة وهندسة موثقتين. لا يمكن استنتاج مساحة سيادية من الرقع التوضيحية أو جمع التبعيات والحملات معها.</p><BoundaryReviewPanel slide={slide} onSelectPhase={onSelectPhase}/></div> : <HistoricalDataPanel
          currentSlideId={slide.id}
          onSelectEra={(slideIdx) => {
            if (onSelectSlideIndex) {
              onSelectSlideIndex(slideIdx);
            }
          }}
        />
      ) : (
        /* VIEW 2: Primary Historical Narrative & Border Details with CSS / motion transition */
        <motion.div
          key={`narrative-view-${slide.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="narrative-era-transition-container space-y-4"
        >
          {/* Era metadata header */}
          <div className="mb-3.5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {slide.categoryLabel && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#173b32]/10 text-[#14382f] border border-[#14382f]/35">
                  {slide.categoryLabel}
                </span>
              )}
              {slide.date && (
                <span className="text-xs font-bold text-[#752612] bg-[#752612]/10 border border-[#752612]/30 px-2.5 py-0.5 rounded flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{slide.date}</span>
                </span>
              )}
            </div>

            <h1 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#101713] leading-snug border-b-2 border-[#8a3b24] pb-2 sm:pb-3">
              {slide.headline}
            </h1>

            {/* Quick Metadata: Capital & Interactive Area Pill */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {slide.capital && (
                <button
                  type="button"
                  onClick={onSelectCapital}
                  className="inline-flex items-center gap-1.5 bg-[#ffffff] hover:bg-[#f2ede0] border border-[#d2c5a2] shadow-xs rounded px-2.5 py-1 text-xs text-[#14382f] cursor-pointer transition-colors"
                  title="انقر للتكبير على العاصمة في الخريطة"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#8a3b24] shrink-0" />
                  <span className="font-medium">العاصمة:</span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#0a1e19]">{slide.capital.name}</span>
                </button>
              )}


            </div>
          </div>

          <BoundaryReviewPanel slide={slide} onSelectPhase={onSelectPhase} />
          {slide.boundaryReview?.status === 'schematic' && <p className="p-2 text-xs text-amber-900">السرد التالي من النسخة السابقة؛ لا يعد توثيقاً للحدود المرسومة.</p>}
          {/* Media figure (if present) */}
          {slide.media?.url && (
            <figure className="my-4 border border-[#cbbd95] bg-[#ffffff] p-3 rounded-lg shadow-sm flex flex-col items-center select-none overflow-hidden transition-all duration-300">
              {!imageError ? (
                <img
                  id="narrative-media-image"
                  src={slide.media.url}
                  alt={slide.media.caption || slide.headline}
                  className="aspect-[3/2] w-auto max-w-[260px] sm:max-w-[320px] max-h-44 sm:max-h-48 object-contain rounded-xs shadow-md ring-1 ring-[#101713]/25 transition-opacity duration-200"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full py-6 px-4 bg-[#f4eee0] border border-dashed border-[#c5b58c] rounded flex flex-col items-center justify-center text-center">
                  <Shield className="w-7 h-7 text-[#752612] mb-1.5" />
                  <span className="font-serif font-bold text-xs text-[#101713]">{slide.media.caption || slide.headline}</span>
                  <span className="text-[11px] text-[#4c3f2b] mt-0.5">{slide.media.credit || 'أطلس حدود مصر التاريخية'}</span>
                </div>
              )}
              {(slide.media.caption || slide.media.credit) && (
                <figcaption className="text-center text-[11.5px] sm:text-xs text-[#1e170e] mt-2.5 border-t border-[#eae2ce] pt-1.5 font-sans w-full">
                  <span className="font-medium">{slide.media.caption}</span>
                  {slide.media.credit && <span className="text-[#4c3f2b]"> — {slide.media.credit}</span>}
                </figcaption>
              )}
            </figure>
          )}

          {/* Main Historical Narrative */}
          <div
            className="era-body text-[15.5px] leading-[1.8] font-sans text-[#17120a] space-y-3"
            dangerouslySetInnerHTML={{ __html: slide.text }}
          />

          {/* Sovereign Borders Description */}
          {slide.borderDescription && (
            <div className="mt-5 p-4 rounded-lg bg-[#ffffff] border-r-4 border-[#8a3b24] border-t border-b border-l border-[#d8cdb1] shadow-xs">
              <h3 className="font-serif font-bold text-base text-[#752612] mb-1.5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8a3b24]" />
                <span>توصيف الحدود السيادية والامتداد الجغرافي:</span>
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[#151009] font-normal">
                {slide.borderDescription}
              </p>
            </div>
          )}

          {/* Geographical Extents Breakdown */}
          {slide.geographicalStats && (
            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              {slide.geographicalStats.maxReachNorth && (
                <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d2c5a2] shadow-xs">
                  <div className="text-[11px] text-[#752612] font-extrabold">أقصى امتداد شمالاً:</div>
                  <div className="font-bold text-[#101713] text-sm mt-0.5">{slide.geographicalStats.maxReachNorth}</div>
                </div>
              )}
              {slide.geographicalStats.maxReachSouth && (
                <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d2c5a2] shadow-xs">
                  <div className="text-[11px] text-[#752612] font-extrabold">أقصى امتداد جنوباً:</div>
                  <div className="font-bold text-[#101713] text-sm mt-0.5">{slide.geographicalStats.maxReachSouth}</div>
                </div>
              )}
              {slide.geographicalStats.maxReachEast && (
                <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d2c5a2] shadow-xs">
                  <div className="text-[11px] text-[#752612] font-extrabold">أقصى امتداد شرقاً:</div>
                  <div className="font-bold text-[#101713] text-sm mt-0.5">{slide.geographicalStats.maxReachEast}</div>
                </div>
              )}
              {slide.geographicalStats.maxReachWest && (
                <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d2c5a2] shadow-xs">
                  <div className="text-[11px] text-[#752612] font-extrabold">أقصى امتداد غرباً:</div>
                  <div className="font-bold text-[#101713] text-sm mt-0.5">{slide.geographicalStats.maxReachWest}</div>
                </div>
              )}
            </div>
          )}

          {/* Frontier Cities & Fortresses */}
          {slide.frontierCities && slide.frontierCities.length > 0 && (
            <div className="mt-5">
              <h3 className="font-serif font-bold text-base text-[#14382f] mb-2.5 flex items-center gap-2 border-b-2 border-[#cbbd95] pb-1">
                <Landmark className="w-4 h-4 text-[#14382f]" />
                <span>أهم المدن والحصون والثغور الحدودية:</span>
              </h3>
              <ul className="space-y-2 text-sm">
                {slide.frontierCities.map((city, idx) => (
                  <li key={idx} className="bg-[#ffffff] p-3 rounded-lg border border-[#d2c5a2] shadow-xs text-[13.5px]">
                    <span className="font-extrabold text-[#752612]">▪ {city.name}: </span>
                    <span className="text-[#1e170e] font-normal leading-relaxed">{city.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Turning Points & Treaties */}
          {slide.keyEvents && slide.keyEvents.length > 0 && (
            <div className="mt-5">
              <h3 className="font-serif font-bold text-base text-[#752612] mb-2.5 flex items-center gap-2 border-b-2 border-[#cbbd95] pb-1">
                <Sparkles className="w-4 h-4 text-[#752612]" />
                <span>أهم الأحداث والمعاهدات والتحولات التاريخية:</span>
              </h3>
              <ul className="space-y-2">
                {slide.keyEvents.map((evt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-[#17120a] bg-[#ffffff] p-3 rounded-lg border border-[#d2c5a2] shadow-xs">
                    <span className="text-[#752612] font-extrabold text-base leading-none mt-0.5">›</span>
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources & Citations */}
          {slide.sources && slide.sources.length > 0 && (
            <div className="mt-8 pt-4 border-t-2 border-[#cbbd95] text-xs">
              <div className="font-bold mb-2 flex items-center gap-1.5 text-[#14382f] text-sm">
                <BookOpen className="w-4 h-4 text-[#14382f]" />
                <span>المصادر والمراجع التاريخية المعتمدة:</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-[12px] text-[#282015] font-medium leading-relaxed">
                {slide.sources.map((src, idx) => (
                  <li key={idx}>{src}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
