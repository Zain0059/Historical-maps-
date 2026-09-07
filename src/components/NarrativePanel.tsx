import React, { useState, useEffect } from 'react';
import { SlideData } from '../types';
import { Shield, BookOpen, Landmark, Calendar, MapPin, ExternalLink, Sparkles, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { HistoricalDataPanel } from './HistoricalDataPanel';
import { getStatBySlideId } from '../data/eraStatistics';

interface NarrativePanelProps {
  slide: SlideData;
  onSelectCapital?: () => void;
  onSelectSlideIndex?: (index: number) => void;
  activeTab?: 'narrative' | 'statistics';
  onTabChange?: (tab: 'narrative' | 'statistics') => void;
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({
  slide,
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
      className="w-full h-full min-h-0 overflow-y-auto overscroll-contain bg-[#e9e0c7] text-[#241d12] p-4 sm:p-5 md:p-6 lg:p-7 relative z-10 select-text scroll-smooth scrollbar-thin scrollbar-thumb-[#a9863f] scrollbar-track-[#ddd3b7]/40"
      style={{
        boxShadow: 'inset 0 0 35px rgba(90, 70, 30, 0.12)'
      }}
    >
      {/* Top Switcher Tabs: Narrative vs Recharts Data Panel */}
      <div className="flex items-center justify-between border-b border-[#a9863f]/40 pb-2 mb-3.5">
        <div className="flex items-center gap-1.5 bg-[#ddd3b7]/70 p-1 rounded-lg border border-[#c9bd97]">
          <button
            id="tab-narrative"
            type="button"
            onClick={() => handleTabSelect('narrative')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'narrative'
                ? 'bg-[#1c261f] text-[#e9e0c7] shadow-sm'
                : 'text-[#3c3324] hover:text-[#141c17] hover:bg-[#c9bd97]/50'
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
                ? 'bg-[#8a3b24] text-white shadow-sm'
                : 'text-[#3c3324] hover:text-[#141c17] hover:bg-[#c9bd97]/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>لوحة البيانات (Recharts)</span>
            <span className="text-[10px] bg-[#141c17]/30 text-white px-1.5 py-0.2 rounded font-mono">
              {currentEraStat.estimatedAreaKm2 >= 1000000
                ? `${(currentEraStat.estimatedAreaKm2 / 1000000).toFixed(1)}M`
                : `${Math.round(currentEraStat.estimatedAreaKm2 / 1000)}k`}
            </span>
          </button>
        </div>

        {/* Quick hint for the user */}
        <span className="text-[11px] text-[#63563f] hidden sm:inline font-bold">
          الحقبة {slide.id} من 18
        </span>
      </div>

      {/* VIEW 1: Recharts Data Panel View */}
      {currentTab === 'statistics' ? (
        <HistoricalDataPanel
          currentSlideId={slide.id}
          onSelectEra={(slideIdx) => {
            if (onSelectSlideIndex) {
              onSelectSlideIndex(slideIdx);
            }
          }}
        />
      ) : (
        /* VIEW 2: Primary Historical Narrative & Border Details */
        <>
          {/* Era metadata header */}
          <div className="mb-3.5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {slide.categoryLabel && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#3f6259]/15 text-[#3f6259] border border-[#3f6259]/30">
                  {slide.categoryLabel}
                </span>
              )}
              {slide.date && (
                <span className="text-xs font-bold text-[#8a3b24] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{slide.date}</span>
                </span>
              )}
            </div>

            <h1 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#141c17] leading-snug border-b-2 border-[#a9863f] pb-2 sm:pb-3">
              {slide.headline}
            </h1>

            {/* Quick Metadata: Capital & Interactive Area Pill */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {slide.capital && (
                <div className="inline-flex items-center gap-1.5 bg-[#3f6259]/10 border border-[#3f6259]/30 rounded px-2.5 py-1 text-xs text-[#2a443e]">
                  <MapPin className="w-3.5 h-3.5 text-[#8a3b24] shrink-0" />
                  <span className="font-medium">العاصمة:</span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#141c17]">{slide.capital.name}</span>
                </div>
              )}

              <button
                type="button"
                id="narrative-area-shortcut-btn"
                onClick={() => handleTabSelect('statistics')}
                className="inline-flex items-center gap-1.5 bg-[#8a3b24]/10 hover:bg-[#8a3b24]/20 border border-[#8a3b24]/30 rounded px-2.5 py-1 text-xs text-[#8a3b24] font-medium transition-colors cursor-pointer"
                title="انقر لعرض المخطط البياني في لوحة البيانات (Recharts)"
              >
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>المساحة: <strong>{currentEraStat.estimatedAreaKm2 >= 1000000 ? `${(currentEraStat.estimatedAreaKm2 / 1000000).toFixed(2)} مليون كم²` : `${currentEraStat.estimatedAreaKm2.toLocaleString('ar-EG')} كم²`}</strong></span>
                <span className="text-[10px] text-[#8a3b24] underline">مخطط البيانات ›</span>
              </button>
            </div>
          </div>

      {/* Media figure (if present) */}
      {slide.media?.url && (
        <figure className="my-4 border border-[#c9bd97] bg-gradient-to-b from-[#fbf9f2] to-[#f4eee0] p-2.5 rounded-lg shadow-sm flex flex-col items-center select-none overflow-hidden">
          {!imageError ? (
            <img
              id="narrative-media-image"
              src={slide.media.url}
              alt={slide.media.caption || slide.headline}
              className="aspect-[3/2] w-auto max-w-[260px] sm:max-w-[320px] max-h-44 sm:max-h-48 object-contain rounded-xs shadow-md ring-1 ring-[#141c17]/20 transition-opacity duration-200"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full py-6 px-4 bg-[#ede4ce]/60 border border-dashed border-[#c9bd97] rounded flex flex-col items-center justify-center text-center">
              <Shield className="w-7 h-7 text-[#8a3b24] mb-1.5" />
              <span className="font-serif font-bold text-xs text-[#141c17]">{slide.media.caption || slide.headline}</span>
              <span className="text-[11px] text-[#63563f] mt-0.5">{slide.media.credit || 'أطلس حدود مصر التاريخية'}</span>
            </div>
          )}
          {(slide.media.caption || slide.media.credit) && (
            <figcaption className="text-center text-[11px] sm:text-xs text-[#4a4130] mt-2 border-t border-[#e2d8bd] pt-1.5 font-sans w-full">
              <span>{slide.media.caption}</span>
              {slide.media.credit && <span className="opacity-75"> — {slide.media.credit}</span>}
            </figcaption>
          )}
        </figure>
      )}

      {/* Main Historical Narrative */}
      <div
        className="era-body text-[15px] leading-relaxed font-sans text-[#241d12] space-y-3"
        dangerouslySetInnerHTML={{ __html: slide.text }}
      />

      {/* Sovereign Borders Description */}
      {slide.borderDescription && (
        <div className="mt-6 p-4 rounded bg-[#f2ecdc] border-r-4 border-[#8a3b24] shadow-sm">
          <h3 className="font-serif font-bold text-base text-[#8a3b24] mb-1.5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#8a3b24]" />
            <span>توصيف الحدود السيادية والامتداد الجغرافي:</span>
          </h3>
          <p className="text-[14px] leading-relaxed text-[#352c1e]">
            {slide.borderDescription}
          </p>
        </div>
      )}

      {/* Geographical Extents Breakdown */}
      {slide.geographicalStats && (
        <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
          {slide.geographicalStats.maxReachNorth && (
            <div className="bg-[#f7f4ea] p-2.5 rounded border border-[#c9bd97]">
              <div className="text-[10.5px] text-[#8a3b24] font-bold">أقصى امتداد شمالاً:</div>
              <div className="font-medium text-[#141c17] mt-0.5">{slide.geographicalStats.maxReachNorth}</div>
            </div>
          )}
          {slide.geographicalStats.maxReachSouth && (
            <div className="bg-[#f7f4ea] p-2.5 rounded border border-[#c9bd97]">
              <div className="text-[10.5px] text-[#8a3b24] font-bold">أقصى امتداد جنوباً:</div>
              <div className="font-medium text-[#141c17] mt-0.5">{slide.geographicalStats.maxReachSouth}</div>
            </div>
          )}
          {slide.geographicalStats.maxReachEast && (
            <div className="bg-[#f7f4ea] p-2.5 rounded border border-[#c9bd97]">
              <div className="text-[10.5px] text-[#8a3b24] font-bold">أقصى امتداد شرقاً:</div>
              <div className="font-medium text-[#141c17] mt-0.5">{slide.geographicalStats.maxReachEast}</div>
            </div>
          )}
          {slide.geographicalStats.maxReachWest && (
            <div className="bg-[#f7f4ea] p-2.5 rounded border border-[#c9bd97]">
              <div className="text-[10.5px] text-[#8a3b24] font-bold">أقصى امتداد غرباً:</div>
              <div className="font-medium text-[#141c17] mt-0.5">{slide.geographicalStats.maxReachWest}</div>
            </div>
          )}
        </div>
      )}

      {/* Frontier Cities & Fortresses */}
      {slide.frontierCities && slide.frontierCities.length > 0 && (
        <div className="mt-6">
          <h3 className="font-serif font-bold text-base text-[#3f6259] mb-2.5 flex items-center gap-2 border-b border-[#c9bd97] pb-1">
            <Landmark className="w-4 h-4 text-[#3f6259]" />
            <span>أهم المدن والحصون والثغور الحدودية:</span>
          </h3>
          <ul className="space-y-2 text-sm">
            {slide.frontierCities.map((city, idx) => (
              <li key={idx} className="bg-[#f4efe1] p-2.5 rounded border border-[#ddd3b7] text-[13.5px]">
                <span className="font-bold text-[#141c17] text-[#8a3b24]">▪ {city.name}: </span>
                <span className="text-[#3c3324]">{city.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Turning Points & Treaties */}
      {slide.keyEvents && slide.keyEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="font-serif font-bold text-base text-[#8a3b24] mb-2.5 flex items-center gap-2 border-b border-[#c9bd97] pb-1">
            <Sparkles className="w-4 h-4 text-[#8a3b24]" />
            <span>أهم الأحداث والمعاهدات والتحولات التاريخية:</span>
          </h3>
          <ul className="space-y-2">
            {slide.keyEvents.map((evt, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-[#2f271a] bg-[#faf7ef] p-2.5 rounded border border-[#e1d7bc]">
                <span className="text-[#8a3b24] font-bold text-base leading-none mt-0.5">›</span>
                <span>{evt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources & Citations */}
      {slide.sources && slide.sources.length > 0 && (
        <div className="mt-8 pt-4 border-t border-[#c9bd97]/80 text-xs text-[#594d38]">
          <div className="font-bold mb-1.5 flex items-center gap-1.5 text-[#3f6259]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المصادر والمراجع التاريخية المعتمدة:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11.5px] text-[#63563f]">
            {slide.sources.map((src, idx) => (
              <li key={idx}>{src}</li>
            ))}
          </ul>
        </div>
      )}
        </>
      )}
    </div>
  );
};
