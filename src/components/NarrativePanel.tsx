import React from 'react';
import { SlideData } from '../types';
import { Shield, BookOpen, Landmark, Calendar, MapPin, ExternalLink, Sparkles } from 'lucide-react';

interface NarrativePanelProps {
  slide: SlideData;
  onSelectCapital?: () => void;
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({
  slide
}) => {
  return (
    <div
      id="narrative-scroll-panel"
      className="h-full overflow-y-auto bg-[#e9e0c7] text-[#241d12] p-6 md:p-8 relative shadow-inner select-text"
      style={{
        boxShadow: 'inset 0 0 40px rgba(90, 70, 30, 0.12)'
      }}
    >
      {/* Era metadata header */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
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

        <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#141c17] leading-snug border-b-2 border-[#a9863f] pb-3">
          {slide.headline}
        </h1>

        {slide.capital && (
          <div className="mt-3 inline-flex items-center gap-2 bg-[#3f6259]/10 border border-[#3f6259]/30 rounded px-3 py-1.5 text-xs text-[#2a443e]">
            <MapPin className="w-4 h-4 text-[#8a3b24] shrink-0" />
            <span className="font-medium">العاصمة والقلب الإداري:</span>
            <span className="font-serif font-bold text-sm text-[#141c17]">{slide.capital.name}</span>
          </div>
        )}
      </div>

      {/* Media figure (if present) */}
      {slide.media?.url && (
        <figure className="my-5 border border-[#c9bd97] bg-white p-2 rounded shadow-sm">
          <img
            src={slide.media.url}
            alt={slide.media.caption || slide.headline}
            className="w-full max-h-56 object-contain rounded"
            loading="lazy"
          />
          {(slide.media.caption || slide.media.credit) && (
            <figcaption className="text-center text-[11.5px] text-[#4a4130] mt-2 border-t border-[#f0ebda] pt-1 font-sans">
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
    </div>
  );
};
