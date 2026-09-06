import React from 'react';
import { Layers, List, Map } from 'lucide-react';
import { PeriodCategory } from '../types';

interface HeaderProps {
  currentIndex: number;
  totalSlides: number;
  onOpenModal: () => void;
  showModernBorder: boolean;
  onToggleModernBorder: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: PeriodCategory | 'all') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentIndex,
  totalSlides,
  onOpenModal,
  showModernBorder,
  onToggleModernBorder,
  selectedCategory,
  onSelectCategory
}) => {
  const categories: { id: PeriodCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة الحقب' },
    { id: 'ancient', label: 'العصور الفرعونية' },
    { id: 'greco_roman', label: 'الهلنستي والروماني' },
    { id: 'islamic_medieval', label: 'الإسلامي والوسيط' },
    { id: 'modern', label: 'الحديث والمعاصر' }
  ];

  return (
    <header className="flex-shrink-0 bg-gradient-to-b from-[#1c261f] to-[#141c17] border-b border-[#a9863f]/40 px-4 py-2.5 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#8a3b24] border border-[#a9863f] flex items-center justify-center text-white shrink-0 shadow">
            <Map className="w-5 h-5 text-[#e9e0c7]" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg md:text-xl text-[#e9e0c7] tracking-wide leading-tight">
              أطلس حدود مصر التاريخية عبر العصور
            </h1>
            <p className="text-xs text-[#7d9992] hidden sm:block mt-0.5">
              سرد تفاعلي بالخرائط لتطور حدود الدولة المصرية وسيادتها وعواصمها عبر 18 حقبة
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Epoch Categories */}
          <div className="hidden lg:flex items-center bg-[#141c17] rounded p-0.5 border border-[#a9863f]/30">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              showModernBorder
                ? 'bg-[#0d9488]/20 border-[#0d9488] text-[#2dd4bf]'
                : 'bg-[#1c261f] border-[#a9863f]/40 text-[#d9cfae] hover:bg-[#2a382e]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مقارنة الحدود المعاصرة</span>
            <span className="sm:hidden">مقارنة</span>
          </button>

          {/* Open All Eras Catalog Modal */}
          <button
            id="hdr-catalog-btn"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[#1c261f] border border-[#a9863f]/50 text-[#e9e0c7] hover:bg-[#a9863f] hover:text-[#141c17] transition-colors"
          >
            <List className="w-3.5 h-3.5" />
            <span>فهرس العصور (18)</span>
          </button>

          {/* Slide Indicator */}
          <div className="font-serif text-xs text-[#a9863f] border border-[#a9863f]/40 px-3 py-1 rounded bg-[#141c17] dir-ltr text-center">
            {currentIndex + 1} / {totalSlides}
          </div>
        </div>
      </div>
    </header>
  );
};
