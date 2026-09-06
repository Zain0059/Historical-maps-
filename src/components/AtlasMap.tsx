import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SlideData, OutpostPoint, FrontierLandmark } from '../types';
import { MODERN_EGYPT_BORDER } from '../data/modernEgyptBorder';
import { Layers, Eye, Compass, Maximize2, X } from 'lucide-react';

interface AtlasMapProps {
  currentSlide: SlideData;
  showModernBorder: boolean;
  onToggleModernBorder: () => void;
  showFrontierLandmarks: boolean;
  onToggleFrontierLandmarks: () => void;
  showLegend: boolean;
  onToggleLegend: () => void;
}

export const AtlasMap: React.FC<AtlasMapProps> = ({
  currentSlide,
  showModernBorder,
  onToggleModernBorder,
  showFrontierLandmarks,
  onToggleFrontierLandmarks,
  showLegend,
  onToggleLegend
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups refs to easily clear/re-add layers
  const coreLayerRef = useRef<L.Polygon | null>(null);
  const secondaryLayerRef = useRef<L.Polygon | null>(null);
  const outpostsLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarksLayerRef = useRef<L.LayerGroup | null>(null);
  const capitalMarkerRef = useRef<L.Marker | null>(null);
  const modernBorderLayerRef = useRef<L.Polygon | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const container = mapContainerRef.current;
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      minZoom: 3,
      maxZoom: 13
    }).setView([26.8, 30.8], 5);

    // Zoom control on bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Default Tile layer (OpenStreetMap reliable tiles)
    const baseTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    outpostsLayerRef.current = L.layerGroup().addTo(map);
    landmarksLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // ResizeObserver ensures Leaflet updates viewport when container layout changes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    // Additional invalidateSize calls on mount
    const timer1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    const timer2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map features whenever currentSlide changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Clear previous layers
    if (coreLayerRef.current) {
      map.removeLayer(coreLayerRef.current);
      coreLayerRef.current = null;
    }
    if (secondaryLayerRef.current) {
      map.removeLayer(secondaryLayerRef.current);
      secondaryLayerRef.current = null;
    }
    if (capitalMarkerRef.current) {
      map.removeLayer(capitalMarkerRef.current);
      capitalMarkerRef.current = null;
    }
    if (outpostsLayerRef.current) {
      outpostsLayerRef.current.clearLayers();
    }
    if (landmarksLayerRef.current) {
      landmarksLayerRef.current.clearLayers();
    }

    const extent = currentSlide.extent;
    const capital = currentSlide.capital;
    const boundsPoints: L.LatLngExpression[] = [];

    // Custom icons
    const capitalIcon = L.divIcon({
      className: 'capital-pin-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-[#8a3b24] opacity-35 animate-ping"></span>
          <div class="w-6 h-6 rounded-full bg-[#8a3b24] border-2 border-[#e9e0c7] shadow-lg flex items-center justify-center text-white text-[11px] font-bold">
            ★
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // 2. Draw Core Polygon (Red-ochre #8a3b24)
    if (extent?.core && extent.core.length > 0) {
      const corePoly = L.polygon(extent.core, {
        color: '#8a3b24',
        weight: 2.5,
        fillColor: '#8a3b24',
        fillOpacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      const label = extent.coreLabel || 'الحدود السيادية الأساسية';
      corePoly.bindTooltip(`<div dir="rtl" class="font-sans font-bold text-xs p-0.5 text-[#8a3b24] text-right" style="white-space: normal; max-width: 180px;">${label}</div>`, {
        sticky: true,
        direction: 'top',
        className: 'historical-tooltip'
      });

      coreLayerRef.current = corePoly;
      extent.core.forEach(pt => boundsPoints.push(pt));
    }

    // 3. Draw Secondary Polygon (Verdigris #3f6259 dashed)
    if (extent?.secondary && extent.secondary.length > 0) {
      const secPoly = L.polygon(extent.secondary, {
        color: '#3f6259',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#3f6259',
        fillOpacity: 0.18,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      const label = extent.secondaryLabel || 'إقليم تابع / نفوذ إقليمي';
      secPoly.bindTooltip(`<div dir="rtl" class="font-sans font-bold text-xs p-0.5 text-[#3f6259] text-right" style="white-space: normal; max-width: 180px;">${label}</div>`, {
        sticky: true,
        direction: 'top',
        className: 'historical-tooltip'
      });

      secondaryLayerRef.current = secPoly;
      extent.secondary.forEach(pt => boundsPoints.push(pt));
    }

    // 4. Draw Outposts (Golden dots #a9863f)
    if (extent?.outposts && extent.outposts.length > 0 && outpostsLayerRef.current) {
      extent.outposts.forEach((outpost: OutpostPoint) => {
        const marker = L.circleMarker([outpost.lat, outpost.lon], {
          radius: 6,
          color: '#a9863f',
          weight: 2,
          fillColor: '#f7f4ea',
          fillOpacity: 1
        });

        marker.bindTooltip(`
          <div dir="rtl" class="font-sans text-right" style="white-space: normal; width: 190px; max-width: 210px;">
            <div class="font-bold text-xs text-[#8a3b24] border-b border-[#c9bd97] pb-1 mb-1">📍 ${outpost.name}</div>
            ${outpost.desc ? `<div class="text-[11px] text-[#4a4130] leading-snug">${outpost.desc}</div>` : ''}
          </div>
        `, {
          direction: 'top',
          offset: [0, -8],
          className: 'historical-tooltip'
        });

        outpostsLayerRef.current?.addLayer(marker);
        boundsPoints.push([outpost.lat, outpost.lon]);
      });
    }

    // 5. Draw Frontier Landmarks (if enabled)
    if (showFrontierLandmarks && extent?.frontierLandmarks && landmarksLayerRef.current) {
      extent.frontierLandmarks.forEach((lm: FrontierLandmark) => {
        const marker = L.circleMarker([lm.lat, lm.lon], {
          radius: 5,
          color: '#2a443e',
          weight: 2,
          fillColor: '#7d9992',
          fillOpacity: 0.85
        });

        marker.bindTooltip(`
          <div dir="rtl" class="font-sans text-right" style="white-space: normal; width: 190px; max-width: 210px;">
            <div class="font-bold text-xs text-[#3f6259] border-b border-[#c9bd97] pb-0.5 mb-1">🛡️ ${lm.name}</div>
            ${lm.desc ? `<div class="text-[11px] text-[#4a4130] leading-snug">${lm.desc}</div>` : ''}
          </div>
        `, {
          direction: 'top',
          offset: [0, -6],
          className: 'historical-tooltip'
        });

        landmarksLayerRef.current?.addLayer(marker);
        boundsPoints.push([lm.lat, lm.lon]);
      });
    }

    // 6. Draw Capital Marker
    if (capital) {
      const capMarker = L.marker([capital.lat, capital.lon], { icon: capitalIcon }).addTo(map);

      capMarker.bindPopup(`
        <div dir="rtl" class="font-sans text-right p-1" style="white-space: normal; width: 210px; max-width: 230px;">
          <div class="text-xs text-[#8a3b24] font-bold tracking-wide">👑 العاصمة المركزية</div>
          <div class="font-serif font-bold text-base text-[#141c17] mt-0.5">${capital.name}</div>
          ${capital.description ? `<div class="text-xs text-[#4a4130] mt-1.5 leading-relaxed">${capital.description}</div>` : ''}
        </div>
      `, {
        className: 'historical-popup',
        offset: [0, -10]
      });

      capMarker.bindTooltip(`
        <div dir="rtl" class="font-sans font-bold text-xs text-[#8a3b24] text-right" style="white-space: normal;">
          👑 ${capital.name}
        </div>
      `, {
        direction: 'top',
        offset: [0, -16],
        className: 'historical-tooltip'
      });

      capitalMarkerRef.current = capMarker;
      boundsPoints.push([capital.lat, capital.lon]);
    }

    // 7. Smoothly fly map camera to bound all territorial extents
    if (boundsPoints.length > 1) {
      const bounds = L.latLngBounds(boundsPoints);
      if (bounds.isValid()) {
        map.invalidateSize();
        map.flyToBounds(bounds, {
          padding: [45, 45],
          duration: 0.9,
          maxZoom: 7
        });
      }
    } else if (capital) {
      map.flyTo([capital.lat, capital.lon], 6, { duration: 0.9 });
    }

  }, [currentSlide, showFrontierLandmarks]);

  // Handle Modern Border Overlay toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showModernBorder) {
      if (!modernBorderLayerRef.current) {
        const poly = L.polygon(MODERN_EGYPT_BORDER, {
          color: '#0d9488',
          weight: 2,
          dashArray: '4, 6',
          fillColor: '#0d9488',
          fillOpacity: 0.08,
          interactive: true
        }).addTo(map);

        poly.bindTooltip('<div dir="rtl" class="font-sans text-xs font-bold text-[#0f766e] text-right" style="white-space: normal; max-width: 200px;">حدود جمهورية مصر العربية المعاصرة (1989)</div>', {
          sticky: true,
          direction: 'top',
          className: 'historical-tooltip'
        });

        modernBorderLayerRef.current = poly;
      }
    } else {
      if (modernBorderLayerRef.current) {
        map.removeLayer(modernBorderLayerRef.current);
        modernBorderLayerRef.current = null;
      }
    }
  }, [showModernBorder]);

  // Re-center handler
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const boundsPoints: L.LatLngExpression[] = [];
    if (currentSlide.extent?.core) {
      currentSlide.extent.core.forEach(p => boundsPoints.push(p));
    }
    if (currentSlide.extent?.secondary) {
      currentSlide.extent.secondary.forEach(p => boundsPoints.push(p));
    }
    if (currentSlide.capital) {
      boundsPoints.push([currentSlide.capital.lat, currentSlide.capital.lon]);
    }

    if (boundsPoints.length > 1) {
      map.flyToBounds(L.latLngBounds(boundsPoints), { padding: [40, 40], duration: 0.8 });
    } else {
      map.flyTo([26.8, 30.8], 5, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px]">
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        id="historical-leaflet-map"
        dir="ltr"
        className="w-full h-full z-0"
      />

      {/* Floating Legend & Map Controls Bar */}
      {!showLegend ? (
        <button
          id="show-legend-btn"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLegend();
          }}
          title="إظهار دليل الخريطة التاريخية"
          className="absolute top-3.5 right-3.5 z-[1050] bg-[#e9e0c7] hover:bg-[#ded1ab] active:scale-95 text-[#8a3b24] text-xs font-serif font-bold px-3.5 py-2.5 rounded-lg shadow-xl border-2 border-[#8a3b24]/50 flex items-center gap-2 transition-all cursor-pointer select-none"
        >
          <Compass className="w-4 h-4 text-[#8a3b24]" />
          <span>إظهار دليل الخريطة</span>
          <Eye className="w-4 h-4 text-[#8a3b24]" />
        </button>
      ) : (
        <div
          id="map-legend-panel"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="absolute top-3.5 right-3.5 z-[1050] bg-[#e9e0c7]/95 backdrop-blur-sm text-[#241d12] text-xs p-3.5 rounded-lg shadow-xl border border-[#c9bd97] max-w-[280px] select-none transition-all"
        >
          <div className="flex items-center justify-between border-b border-[#c9bd97]/60 pb-2 mb-2.5 gap-2">
            <div className="font-serif font-bold text-sm text-[#8a3b24] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#8a3b24]" />
              <span>دليل الخريطة التاريخية</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                id="recenter-map-btn"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecenter();
                }}
                title="إعادة ضبط إطار الرؤية للمنطقة"
                className="p-1 hover:bg-[#d9cfae] rounded text-[#4a4130] transition-colors flex items-center justify-center cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                id="hide-legend-btn"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLegend();
                }}
                title="إخفاء دليل الخريطة"
                className="px-2 py-1 bg-[#8a3b24]/10 hover:bg-[#8a3b24] hover:text-white rounded text-[#8a3b24] font-medium text-[11px] transition-all flex items-center gap-1 cursor-pointer border border-[#8a3b24]/20"
              >
                <X className="w-3.5 h-3.5" />
                <span>إخفاء</span>
              </button>
            </div>
          </div>

          {/* Legend swatches */}
          <div className="space-y-1.5 text-[11.5px] leading-tight">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#8a3b24] opacity-80 shrink-0 border border-[#8a3b24]"></span>
              <span className="font-medium">المساحة السيادية الأساسية</span>
            </div>

            {currentSlide.extent?.secondary && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#3f6259] opacity-75 shrink-0 border border-dashed border-[#3f6259]"></span>
                <span className="text-[#3f6259] font-medium">{currentSlide.extent.secondaryLabel || 'إقليم تابع / سيادة ثانوية'}</span>
              </div>
            )}

            {currentSlide.extent?.outposts && currentSlide.extent.outposts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f7f4ea] border-2 border-[#a9863f] shrink-0"></span>
                <span>محطات وثغور خارجية منفصلة</span>
              </div>
            )}

            {currentSlide.capital && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8a3b24] border border-[#e9e0c7] flex items-center justify-center text-[8px] text-white font-bold shrink-0">★</span>
                <span>العاصمة والقلب الإداري</span>
              </div>
            )}
          </div>

          {/* Interactive Layer Toggles */}
          <div className="mt-2.5 pt-2 border-t border-[#c9bd97]/60 space-y-1.5">
            <button
              id="toggle-modern-border-btn"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onToggleModernBorder();
              }}
              className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                showModernBorder
                  ? 'bg-[#0d9488]/15 border-[#0d9488] text-[#0f766e]'
                  : 'bg-transparent border-[#c9bd97] text-[#4a4130] hover:bg-[#d9cfae]/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                <span>مقارنة مع حدود مصر المعاصرة</span>
              </span>
              <span className={`text-[10px] px-1 py-0.5 rounded ${showModernBorder ? 'bg-[#0d9488] text-white' : 'bg-[#c9bd97] text-[#241d12]'}`}>
                {showModernBorder ? 'مفعّل' : 'معطّل'}
              </span>
            </button>

            {currentSlide.extent?.frontierLandmarks && currentSlide.extent.frontierLandmarks.length > 0 && (
              <button
                id="toggle-landmarks-btn"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFrontierLandmarks();
                }}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                  showFrontierLandmarks
                    ? 'bg-[#3f6259]/15 border-[#3f6259] text-[#2a443e]'
                    : 'bg-transparent border-[#c9bd97] text-[#4a4130] hover:bg-[#d9cfae]/50'
                }`}
              >
                <span>إظهار قلاع ومعالم الحدود</span>
                <span className={`text-[10px] px-1 py-0.5 rounded ${showFrontierLandmarks ? 'bg-[#3f6259] text-white' : 'bg-[#c9bd97] text-[#241d12]'}`}>
                  {showFrontierLandmarks ? 'مفعّل' : 'معطّل'}
                </span>
              </button>
            )}
          </div>

          {/* Clarification note */}
          <div className="mt-2 text-[10px] text-[#6e5d42] leading-snug border-t border-[#c9bd97]/40 pt-1.5 flex items-center justify-between">
            <span>ⓘ الحدود تقريبية ومبنية على معالم تاريخية.</span>
            <button
              id="hide-legend-text-btn"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLegend();
              }}
              className="text-[#8a3b24] hover:underline cursor-pointer shrink-0 mr-1 font-bold"
            >
              إخفاء الدليل
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
