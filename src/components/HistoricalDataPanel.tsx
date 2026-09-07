import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { ERA_STATISTICS, EraStat, MODERN_EGYPT_AREA_KM2, getStatBySlideId } from '../data/eraStatistics';
import { TrendingUp, Compass, Landmark, Shield, Layers, ArrowUpRight, ArrowDownRight, Equal, BookOpen, Globe } from 'lucide-react';

interface HistoricalDataPanelProps {
  currentSlideId: number;
  onSelectEra: (slideIndex: number) => void;
  className?: string;
}

type MetricMode = 'area' | 'external' | 'internal';

export const HistoricalDataPanel: React.FC<HistoricalDataPanelProps> = ({
  currentSlideId,
  onSelectEra,
  className = ''
}) => {
  const [metric, setMetric] = useState<MetricMode>('area');

  // Active current era stat
  const currentStat = useMemo(() => getStatBySlideId(currentSlideId), [currentSlideId]);

  // Format numbers to Arabic localized string
  const formatArea = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(2)} مليون كم²`;
    }
    return `${val.toLocaleString('ar-EG')} كم²`;
  };

  // Calculate percentage difference from modern area
  const diffFromModern = useMemo(() => {
    const diff = ((currentStat.estimatedAreaKm2 - MODERN_EGYPT_AREA_KM2) / MODERN_EGYPT_AREA_KM2) * 100;
    return diff;
  }, [currentStat]);

  // Chart data mapping
  const chartData = useMemo(() => {
    return ERA_STATISTICS.map((era) => ({
      ...era,
      areaMillions: +(era.estimatedAreaKm2 / 1000000).toFixed(2),
      isActive: era.id === currentSlideId
    }));
  }, [currentSlideId]);

  // Custom Recharts tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: EraStat & { areaMillions: number; isActive: boolean } = payload[0].payload;

      return (
        <div
          dir="rtl"
          className="bg-[#1c261f] border-2 border-[#a9863f] text-[#e9e0c7] p-3 rounded-lg shadow-2xl text-right max-w-[290px] select-none pointer-events-none"
        >
          <div className="flex items-center justify-between border-b border-[#a9863f]/30 pb-1.5 mb-2">
            <span className="text-[11px] font-bold text-[#f2b880]">{data.date}</span>
            {data.id === currentSlideId && (
              <span className="text-[10px] bg-[#8a3b24] text-white px-1.5 py-0.5 rounded font-bold">
                الحقبة المعروضة
              </span>
            )}
          </div>

          <div className="font-serif font-bold text-sm text-[#f7f4ea] leading-tight mb-2">
            {data.fullName}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between bg-[#141c17] p-1.5 rounded border border-[#a9863f]/20">
              <span className="text-[#a9863f] font-medium">المساحة التقديرية:</span>
              <span className="font-bold text-white font-mono">{formatArea(data.estimatedAreaKm2)}</span>
            </div>

            <div className="flex items-center justify-between bg-[#141c17] p-1.5 rounded border border-[#a9863f]/20">
              <span className="text-[#a9863f] font-medium">التبعيات والأقاليم الخارجية:</span>
              <span className="font-bold text-[#2dd4bf] font-mono">
                {data.externalDependenciesCount} {data.externalDependenciesCount === 1 ? 'إقليم تابع' : 'أقاليم وولايات'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#141c17] p-1.5 rounded border border-[#a9863f]/20">
              <span className="text-[#a9863f] font-medium">التقسيم الإداري الداخلي:</span>
              <span className="font-bold text-[#fcd34d] font-mono text-[11px]">
                {data.internalProvincesLabel}
              </span>
            </div>

            <div className="text-[11px] text-[#c9bd97] leading-relaxed pt-1 border-t border-[#a9863f]/20">
              <span className="text-[#a9863f] font-semibold">منهجية التقدير: </span>
              {data.areaCalculationMethod}
            </div>

            <div className="text-[10px] text-[#93c5fd] leading-tight">
              <span className="font-bold">المصدر: </span>
              {data.areaSource}
            </div>

            <div className="text-[10px] text-[#7d9992] pt-1 text-center font-bold border-t border-[#a9863f]/20">
              ⚡ انقر للانتقال إلى الخريطة التفاعلية
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="historical-data-panel" className={`flex flex-col space-y-4 ${className}`}>
      {/* Top Header & Metric Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#a9863f]/30">
        <div>
          <h2 className="font-serif font-bold text-base md:text-lg text-[#141c17] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8a3b24]" />
            <span>لوحة التحليل الإقليمي والمساحي الموثق</span>
          </h2>
          <p className="text-xs text-[#5c4f39] mt-0.5">
            فصل إحصائيات التبعيات الخارجية عن التقسيمات الإدارية الداخلية وتوثيق منهجيات حساب المساحة
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center self-start sm:self-auto bg-[#ddd3b7]/70 p-1 rounded-lg border border-[#c9bd97]">
          <button
            id="metric-btn-area"
            type="button"
            onClick={() => setMetric('area')}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all flex items-center gap-1.5 ${
              metric === 'area'
                ? 'bg-[#8a3b24] text-white shadow-sm'
                : 'text-[#3c3324] hover:text-[#141c17] hover:bg-[#c9bd97]/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>المساحة (كم²)</span>
          </button>

          <button
            id="metric-btn-external"
            type="button"
            onClick={() => setMetric('external')}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all flex items-center gap-1.5 ${
              metric === 'external'
                ? 'bg-[#3f6259] text-white shadow-sm'
                : 'text-[#3c3324] hover:text-[#141c17] hover:bg-[#c9bd97]/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>التبعيات الخارجية</span>
          </button>

          <button
            id="metric-btn-internal"
            type="button"
            onClick={() => setMetric('internal')}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all flex items-center gap-1.5 ${
              metric === 'internal'
                ? 'bg-[#b45309] text-white shadow-sm'
                : 'text-[#3c3324] hover:text-[#141c17] hover:bg-[#c9bd97]/50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>التقسيم الإداري الداخلي</span>
          </button>
        </div>
      </div>

      {/* Dynamic Highlight Cards for the Currently Active Slide */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Card 1: Estimated Area */}
        <div className="bg-[#f7f4ea] p-3 rounded-lg border border-[#c9bd97] shadow-xs">
          <div className="text-[11px] font-bold text-[#8a3b24] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>المساحة التقديرية</span>
          </div>
          <div className="font-serif font-extrabold text-lg md:text-xl text-[#141c17] mt-1">
            {formatArea(currentStat.estimatedAreaKm2)}
          </div>
          <div className="text-[11px] text-[#594d38] mt-0.5">
            {currentStat.ratioToModern >= 1
              ? `${currentStat.ratioToModern.toFixed(2)}× مساحة مصر المعاصرة`
              : `${(currentStat.ratioToModern * 100).toFixed(0)}% من مساحة مصر المعاصرة`}
          </div>
        </div>

        {/* Card 2: Modern Comparison */}
        <div className="bg-[#f7f4ea] p-3 rounded-lg border border-[#c9bd97] shadow-xs">
          <div className="text-[11px] font-bold text-[#3f6259] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>مقارنة بالحدود المعاصرة</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {Math.abs(diffFromModern) < 1 ? (
              <span className="flex items-center gap-1 font-bold text-base text-[#0d9488]">
                <Equal className="w-4 h-4" /> مطابق للحدود الحالية
              </span>
            ) : diffFromModern > 0 ? (
              <span className="flex items-center gap-1 font-extrabold text-lg md:text-xl text-[#8a3b24]">
                <ArrowUpRight className="w-5 h-5 text-[#8a3b24]" />
                +{diffFromModern.toFixed(0)}%
              </span>
            ) : (
              <span className="flex items-center gap-1 font-extrabold text-lg md:text-xl text-[#b45309]">
                <ArrowDownRight className="w-5 h-5 text-[#b45309]" />
                {diffFromModern.toFixed(0)}%
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#594d38] mt-0.5">
            مقياس الأساس: 1,002,450 كم²
          </div>
        </div>

        {/* Card 3: External Dependencies */}
        <div className="bg-[#f7f4ea] p-3 rounded-lg border border-[#c9bd97] shadow-xs">
          <div className="text-[11px] font-bold text-[#2a695d] flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>التبعيات والأقاليم الخارجية</span>
          </div>
          <div className="font-serif font-extrabold text-lg md:text-xl text-[#141c17] mt-1">
            {currentStat.externalDependenciesCount}{' '}
            <span className="text-xs font-normal text-[#594d38]">
              {currentStat.externalDependenciesCount === 1 ? 'إقليم تابع' : 'أقاليم وولايات'}
            </span>
          </div>
          <div className="text-[11px] text-[#594d38] mt-0.5 truncate">
            {currentStat.expansionType}
          </div>
        </div>

        {/* Card 4: Internal Administrative Division */}
        <div className="bg-[#f7f4ea] p-3 rounded-lg border border-[#c9bd97] shadow-xs">
          <div className="text-[11px] font-bold text-[#92400e] flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5" />
            <span>التقسيم الإداري الداخلي</span>
          </div>
          <div className="font-serif font-bold text-sm text-[#141c17] mt-1 leading-snug">
            {currentStat.internalProvincesLabel}
          </div>
          <div className="text-[11px] text-[#8a3b24] font-medium mt-0.5">
            {currentStat.date}
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Graph */}
      <div className="bg-[#fdfbf7] p-3.5 rounded-xl border border-[#c9bd97] shadow-sm relative">
        <div className="flex items-center justify-between text-xs text-[#594d38] mb-2 px-1">
          <span className="font-bold text-[#141c17]">
            {metric === 'area'
              ? 'مخطط مقارنة المساحة عبر الـ 18 حقبة (بملايين الكيلومترات المربعة):'
              : metric === 'external'
              ? 'مخطط عدد الأقاليم والتبعيات الخارجية (الولايات الإمبراطورية خارج مصر المركزية):'
              : 'مخطط عدد الوحدات الإدارية الداخلية في مصر (المقاطعات / الكُوَر / المحافظات):'}
          </span>
          <span className="text-[11px] text-[#8a3b24] font-bold">
            ★ الحقبة المحددة مميزة باللون الذهبي البارز
          </span>
        </div>

        <div className="w-full h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 10, left: 10, bottom: 45 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  const clicked = state.activePayload[0].payload as EraStat;
                  if (clicked && typeof clicked.slideIndex === 'number') {
                    onSelectEra(clicked.slideIndex);
                  }
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e3dac3" vertical={false} />

              <XAxis
                dataKey="shortName"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={55}
                tick={{ fill: '#352c1e', fontSize: 10.5, fontFamily: 'serif' }}
                stroke="#c9bd97"
              />

              <YAxis
                orientation="right"
                tick={{ fill: '#594d38', fontSize: 11 }}
                stroke="#c9bd97"
                unit={metric === 'area' ? ' م' : ''}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(169, 134, 63, 0.12)' }} />

              {/* Reference line showing Modern Egypt Area baseline (1.002 million km²) */}
              {metric === 'area' && (
                <ReferenceLine
                  y={1.0}
                  stroke="#0d9488"
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                  label={{
                    value: 'الحدود المعاصرة (1.002 مليون كم²)',
                    position: 'insideTopLeft',
                    fill: '#0f766e',
                    fontSize: 10,
                    fontWeight: 'bold',
                    offset: 8
                  }}
                />
              )}

              <Bar
                dataKey={
                  metric === 'area'
                    ? 'areaMillions'
                    : metric === 'external'
                    ? 'externalDependenciesCount'
                    : 'internalProvincesCount'
                }
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={600}
                className="cursor-pointer"
              >
                {chartData.map((entry) => {
                  const isCurrent = entry.id === currentSlideId;
                  const fillColor = isCurrent
                    ? '#8a3b24'
                    : metric === 'area'
                    ? '#3f6259'
                    : metric === 'external'
                    ? '#0d9488'
                    : '#b45309';

                  const strokeColor = isCurrent ? '#f59e0b' : '#2a443e';

                  return (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isCurrent ? 2.5 : 1}
                      opacity={isCurrent ? 1 : 0.75}
                      className="transition-all duration-300 hover:opacity-100"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Guidance Footer */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-[#63563f] pt-2 border-t border-[#e3dac3] mt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#8a3b24] border border-[#f59e0b]"></span>
              <span className="font-bold text-[#141c17]">الحقبة النشطة المعروضة حالياً</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#3f6259]"></span>
              <span>باقي الحقب التاريخية</span>
            </span>
            {metric === 'area' && (
              <span className="flex items-center gap-1.5 text-[#0f766e]">
                <span className="w-3 h-0.5 bg-[#0d9488]"></span>
                <span>خط أساس مساحة مصر المعاصرة</span>
              </span>
            )}
          </div>
          <div className="text-[#8a3b24] font-medium hidden md:block">
            يمكن النقر على أي عمود للانتقال الفوري للحقبة
          </div>
        </div>
      </div>

      {/* Methodological Documentation & Source Citation Box */}
      <div className="bg-[#fbf9f4] p-3.5 rounded-lg border border-[#c9bd97] space-y-2 text-xs">
        <div className="flex items-center gap-2 font-serif font-bold text-[#8a3b24] border-b border-[#c9bd97]/40 pb-1.5">
          <BookOpen className="w-4 h-4" />
          <span>منهجية التقدير الجغرافي والتوثيق الأكاديمي ({currentStat.fullName}):</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-[#f4efe1] p-2.5 rounded border border-[#d8cdb2]">
            <span className="font-bold text-[#3f6259] block mb-1">منهجية حساب المساحة الجغرافية:</span>
            <p className="text-[#2a2419] leading-relaxed">{currentStat.areaCalculationMethod}</p>
          </div>

          <div className="bg-[#f4efe1] p-2.5 rounded border border-[#d8cdb2]">
            <span className="font-bold text-[#8a3b24] block mb-1">المصادر والمراجع الأكاديمية:</span>
            <p className="text-[#2a2419] leading-relaxed">{currentStat.areaSource}</p>
          </div>
        </div>

        {currentStat.externalDependenciesList && currentStat.externalDependenciesList.length > 0 && (
          <div className="pt-1.5 text-[#4a3e2a]">
            <span className="font-bold text-[#141c17]">بيان الأقاليم والتبعيات في هذه الحقبة: </span>
            <span className="text-[#3f6259]">{currentStat.externalDependenciesList.join(' • ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
