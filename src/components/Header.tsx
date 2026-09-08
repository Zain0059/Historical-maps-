import React, { useState } from 'react';
import { List, Map, ChevronDown, Layers, TrendingUp, Compass } from 'lucide-react';
import { PeriodCategory } from '../types';

interface HeaderProps {
  currentIndex: number;
  totalSlides: number;
  onOpenModal: () => void;
  showModernBorder: boolean;
  onToggleModernBorder: () => void;
  showLegend: boolean;
  onToggleLegend: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: PeriodCategory | 'all') => void;
  showDataPanel?: boolean;
  onToggleDataPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentIndex,
  totalSlides,
  onOpenModal,
  showModernBorder,
  onToggleModernBorder,
  showLegend,
  onToggleLegend,
  selectedCategory,
  onSelectCategory,
  showDataPanel,
  onToggleDataPanel
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const categories: { id: PeriodCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة الحقب' },
    { id: 'ancient', label: 'العصور الفرعونية' },
    { id: 'greco_roman', label: 'الهلنستي والروماني' },
    { id: 'islamic_medieval', label: 'الإسلامي والوسيط' },
    { id: 'modern', label: 'الحديث والمعاصر' }
  ];

  return (
    <header className="flex-shrink-0 bg-gradient-to-b from-[#1c261f] to-[#141c17] border-b border-[#a9863f]/40 px-3.5 py-2 select-none z-30">
      <div className="flex items-center justify-between gap-3">
        {/* Title and Subtitle */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#8a3b24] border border-[#a9863f] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Map className="w-4 h-4 text-[#e9e0c7]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#e9e0c7] tracking-wide leading-tight truncate">
              أطلس حدود مصر التاريخية عبر العصور
            </h1>
            <p className="text-[11px] text-[#7d9992] hidden sm:block leading-tight truncate">
              سرد تفاعلي موثق لتطور حدود الدولة وسيادتها وعواصمها عبر 21 حقبة تاريخية
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation - Streamlined to eliminate clutter */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Epoch Categories on Large Screens */}
          <div className="hidden lg:flex items-center bg-[#141c17] rounded-lg p-0.5 border border-[#a9863f]/30">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#8a3b24] text-white font-bold shadow-sm'
                    : 'text-[#d9cfae]/70 hover:text-white hover:bg-[#2a382e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Single Unified Menu for mobile/tablets or secondary actions */}
          <div className="relative">
            <button
              id="hdr-catalog-btn"
              onClick={onOpenModal}
              title="فهرس الحقب الـ 21"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold bg-[#8a3b24] hover:bg-[#a0432a] text-[#fdfbf7] border border-[#a9863f]/60 shadow-sm transition-all cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
              <span>فهرس العصور</span>
            </button>
          </div>

          {/* Quick options dropdown for tools */}
          <div className="relative">
            <button
              id="hdr-quick-tools-btn"
              onClick={() => setShowDropdown(prev => !prev)}
              title="خيارات إضافية"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1c261f] border border-[#a9863f]/40 text-[#d9cfae] hover:bg-[#2a382e] transition-colors cursor-pointer"
            >
              <span>أدوات</span>
              <ChevronDown className="w-3 h-3 text-[#a9863f]" />
            </button>

            {showDropdown && (
              <div
                className="absolute left-0 mt-1 w-52 bg-[#1c261f] border border-[#a9863f]/60 rounded-xl shadow-2xl py-1.5 z-50 text-xs text-[#e9e0c7]"
                onClick={() => setShowDropdown(false)}
              >
                <button
                  id="hdr-compare-btn"
                  onClick={onToggleModernBorder}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2a382e] text-right transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#0d9488]" />
                    <span>مقارنة بحدود 1989</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${showModernBorder ? 'bg-[#0d9488] text-white' : 'bg-[#141c17] text-[#d9cfae]/60'}`}>
                    {showModernBorder ? 'مفعّل' : 'معطّل'}
                  </span>
                </button>

                {onToggleDataPanel && (
                  <button
                    id="hdr-data-panel-btn"
                    onClick={onToggleDataPanel}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2a382e] text-right transition-colors border-t border-[#a9863f]/20"
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-[#f2b880]" />
                      <span>لوحة بيانات المساحة</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${showDataPanel ? 'bg-[#8a3b24] text-white' : 'bg-[#141c17] text-[#d9cfae]/60'}`}>
                      {showDataPanel ? 'معروض' : 'سرد'}
                    </span>
                  </button>
                )}

                <button
                  id="hdr-legend-btn"
                  onClick={onToggleLegend}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2a382e] text-right transition-colors border-t border-[#a9863f]/20"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#a9863f]" />
                    <span>دليل خريطة العصر</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${showLegend ? 'bg-[#8a3b24] text-white' : 'bg-[#141c17] text-[#d9cfae]/60'}`}>
                    {showLegend ? 'مفتوح' : 'مغلق'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Slide Indicator */}
          <div className="font-serif text-xs text-[#f2b880] border border-[#a9863f]/50 px-2.5 py-1 rounded-lg bg-[#141c17] dir-ltr text-center font-bold shadow-inner">
            {currentIndex + 1}/{totalSlides}
          </div>
        </div>
      </div>
    </header>
  );
};
