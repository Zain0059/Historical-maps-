import React from 'react';
import { Layers, List, Map, Compass, TrendingUp } from 'lucide-react';
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
  const categories: { id: PeriodCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة الحقب' },
    { id: 'ancient', label: 'العصور الفرعونية' },
    { id: 'greco_roman', label: 'الهلنستي والروماني' },
    { id: 'islamic_medieval', label: 'الإسلامي والوسيط' },
    { id: 'modern', label: 'الحديث والمعاصر' }
  ];

  return (
    <header className="flex-shrink-0 bg-gradient-to-b from-[#1c261f] to-[#141c17] border-b border-[#a9863f]/40 px-3 py-1.5 md:py-2 select-none z-30">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        {/* Title and Subtitle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#8a3b24] border border-[#a9863f] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Map className="w-4 h-4 text-[#e9e0c7]" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#e9e0c7] tracking-wide leading-tight truncate max-w-[210px] xs:max-w-[280px] sm:max-w-none">
              أطلس حدود مصر التاريخية عبر العصور
            </h1>
            <p className="text-[10.5px] text-[#7d9992] hidden md:block leading-tight">
              سرد تفاعلي موثق لتطور حدود الدولة المصرية وسيادتها وعواصمها عبر 18 حقبة
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Epoch Categories */}
          <div className="hidden xl:flex items-center bg-[#141c17] rounded p-0.5 border border-[#a9863f]/30">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#8a3b24] text-white font-bold'
                    : 'text-[#d9cfae]/70 hover:text-white hover:bg-[#2a382e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toggle Modern Border Comparison */}
          <button
            id="hdr-compare-btn"
            onClick={onToggleModernBorder}
            title="مقارنة مع حدود جمهورية مصر العربية المعاصرة (1989)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              showModernBorder
                ? 'bg-[#0d9488]/20 border-[#0d9488] text-[#2dd4bf]'
                : 'bg-[#1c261f] border-[#a9863f]/40 text-[#d9cfae] hover:bg-[#2a382e]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حدود 1989</span>
            <span className="sm:hidden">1989</span>
          </button>

          {/* Toggle Recharts Data Panel Button */}
          {onToggleDataPanel && (
            <button
              id="hdr-data-panel-btn"
              onClick={onToggleDataPanel}
              title={showDataPanel ? 'العودة إلى السرد التاريخي' : 'عرض لوحة البيانات والمساحة (Recharts)'}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                showDataPanel
                  ? 'bg-[#8a3b24] border-[#f59e0b] text-white shadow-sm font-bold'
                  : 'bg-[#1c261f] border-[#a9863f]/40 text-[#d9cfae] hover:bg-[#2a382e]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#f2b880]" />
              <span className="hidden sm:inline">بيانات المساحة</span>
              <span className="sm:hidden">بيانات</span>
            </button>
          )}

          {/* Toggle Map Legend Button */}
          <button
            id="hdr-legend-btn"
            onClick={onToggleLegend}
            title={showLegend ? 'إخفاء دليل الخريطة التاريخية' : 'إظهار دليل الخريطة التاريخية'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              showLegend
                ? 'bg-[#8a3b24]/30 border-[#8a3b24] text-[#f2b880]'
                : 'bg-[#1c261f] border-[#a9863f]/40 text-[#d9cfae]/70 hover:bg-[#2a382e]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showLegend ? 'إخفاء الدليل' : 'دليل الخريطة'}</span>
          </button>

          {/* Open All Eras Catalog Modal */}
          <button
            id="hdr-catalog-btn"
            onClick={onOpenModal}
            title="فهرس الحقب الـ 18"
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[#1c261f] border border-[#a9863f]/50 text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] transition-colors"
          >
            <List className="w-3.5 h-3.5" />
            <span>فهرس العصور</span>
          </button>

          {/* Slide Indicator */}
          <div className="font-serif text-xs text-[#a9863f] border border-[#a9863f]/40 px-2 py-0.5 rounded bg-[#141c17] dir-ltr text-center font-bold">
            {currentIndex + 1}/{totalSlides}
          </div>
        </div>
      </div>
    </header>
  );
};
