import React from 'react';
import { SlideData } from '../types';
import { X, Check, MapPin, Calendar } from 'lucide-react';

interface EraListModalProps {
  slides: SlideData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
}

export const EraListModal: React.FC<EraListModalProps> = ({
  slides,
  currentIndex,
  isOpen,
  onClose,
  onSelectSlide
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#1c261f] border border-[#a9863f] text-[#e9e0c7] rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#a9863f]/30 bg-[#141c17]">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#e9e0c7]">فهرس العصور التاريخية لمصر (18 حقبة)</h2>
            <p className="text-xs text-[#7d9992] mt-0.5">انقر على أي عصر للانتقال المباشر وتحديث إطار الخريطة</p>
          </div>
          <button
            id="close-era-modal-btn"
            onClick={onClose}
            className="p-1.5 text-[#d9cfae]/70 hover:text-white hover:bg-[#2a382e] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid list of eras */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {slides.map((slide, idx) => {
            const isSelected = idx === currentIndex;
            const isOverview = idx === 0;

            return (
              <button
                key={slide.id}
                id={`modal-era-card-${idx}`}
                onClick={() => {
                  onSelectSlide(idx);
                  onClose();
                }}
                className={`text-right p-3.5 rounded border transition-all relative ${
                  isSelected
                    ? 'bg-[#8a3b24]/20 border-[#8a3b24] shadow-md ring-1 ring-[#8a3b24]'
                    : 'bg-[#141c17] border-[#a9863f]/25 hover:border-[#a9863f] hover:bg-[#222e25]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif text-xs font-bold text-[#a9863f] bg-[#1c261f] px-2 py-0.5 rounded border border-[#a9863f]/30">
                    {isOverview ? 'مقدمة' : `العصر ${slide.id}`}
                  </span>
                  {slide.categoryLabel && (
                    <span className="text-[10px] text-[#7d9992]">{slide.categoryLabel}</span>
                  )}
                </div>

                <div className="font-serif font-bold text-sm text-[#e9e0c7] line-clamp-1 mb-1">
                  {slide.headline}
                </div>

                {slide.date && (
                  <div className="text-[11px] text-[#d9cfae]/70 line-clamp-1 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#a9863f]" />
                    <span>{slide.date}</span>
                  </div>
                )}

                {slide.capital && (
                  <div className="text-[10.5px] text-[#7d9992] line-clamp-1 flex items-center gap-1 border-t border-[#a9863f]/15 pt-1.5 mt-1.5">
                    <MapPin className="w-3 h-3 text-[#8a3b24]" />
                    <span className="truncate">{slide.capital.name}</span>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-2 left-2 text-[#8a3b24]">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
