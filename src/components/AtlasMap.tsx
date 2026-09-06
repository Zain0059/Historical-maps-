import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutpostPoint, FrontierLandmark } from '../types';
import { MODERN_EGYPT_BORDER } from '../data/modernEgyptBorder';
import { Layers, Eye, Compass, Maximize2, X } from 'lucide-react';

/**
 * Bulletproof camera transition helper.
 * Prevents Leaflet's getBoundsZoom from calculating Math.log(negative)
 * when container dimensions are 0 or smaller than padding, which causes
 * "Uncaught Error: Invalid LatLng object: (NaN, NaN)".
 */
function safeFlyToBounds(
  map: L.Map | null,
  points: [number, number][],
  fallbackCenter?: [number, number]
) {
  if (!map) return;

  const defaultCenter: [number, number] = [26.8, 30.8];
  const safeFallback: [number, number] =
    fallbackCenter &&
    typeof fallbackCenter[0] === 'number' &&
    !isNaN(fallbackCenter[0]) &&
    isFinite(fallbackCenter[0]) &&
    typeof fallbackCenter[1] === 'number' &&
    !isNaN(fallbackCenter[1]) &&
    isFinite(fallbackCenter[1])
      ? fallbackCenter
      : defaultCenter;

  const validPoints = points.filter(
    (pt) =>
      Array.isArray(pt) &&
      pt.length >= 2 &&
      typeof pt[0] === 'number' &&
      !isNaN(pt[0]) &&
      isFinite(pt[0]) &&
      typeof pt[1] === 'number' &&
      !isNaN(pt[1]) &&
      isFinite(pt[1])
  );

  if (validPoints.length === 0) {
    try {
      map.flyTo(safeFallback, 5, { duration: 0.8 });
    } catch {
      map.setView(safeFallback, 5);
    }
    return;
  }

  if (validPoints.length === 1) {
    try {
      map.flyTo(validPoints[0], 6, { duration: 0.8 });
    } catch {
      map.setView(validPoints[0], 6);
    }
    return;
  }

  try {
    const bounds = L.latLngBounds(validPoints);
    if (!bounds.isValid()) {
      map.flyTo(safeFallback, 5, { duration: 0.8 });
      return;
    }

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    if (
      !sw ||
      !ne ||
      isNaN(sw.lat) ||
      isNaN(sw.lng) ||
      isNaN(ne.lat) ||
      isNaN(ne.lng)
    ) {
      map.flyTo(safeFallback, 5, { duration: 0.8 });
      return;
    }

    // Identical bounds (single point cluster)
    if (Math.abs(sw.lat - ne.lat) < 0.0001 && Math.abs(sw.lng - ne.lng) < 0.0001) {
      map.flyTo([sw.lat, sw.lng], 6, { duration: 0.8 });
      return;
    }

    map.invalidateSize();
    const size = map.getSize();

    // If container size is 0 or too small for padding, getBoundsZoom produces negative size -> Math.log(neg) -> NaN!
    if (!size || size.x <= 100 || size.y <= 100) {
      const c = bounds.getCenter();
      if (c && !isNaN(c.lat) && !isNaN(c.lng) && isFinite(c.lat) && isFinite(c.lng)) {
        map.setView([c.lat, c.lng], 5);
      } else {
        map.setView(safeFallback, 5);
      }
      return;
    }

    // Dynamic padding so it never exceeds 10% of container dimensions
    const padX = Math.max(8, Math.min(35, Math.floor(size.x * 0.08)));
    const padY = Math.max(8, Math.min(35, Math.floor(size.y * 0.08)));

    map.flyToBounds(bounds, {
      padding: [padY, padX],
      duration: 0.9,
      maxZoom: 7
    });
  } catch (err) {
    console.warn('safeFlyToBounds fallback triggered:', err);
    try {
      map.setView(safeFallback, 5);
    } catch {
      // safe fallback
    }
  }
}

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

  // Transition refs for smooth CSS fade-in/out layer updates
  const isInitialRenderRef = useRef<boolean>(true);
  const eraTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eraFadeInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Dedicated panes for historical era layers with CSS transition support
    const historicalOverlayPane = map.createPane('historicalOverlayPane');
    historicalOverlayPane.style.zIndex = '450';
    historicalOverlayPane.classList.add('historical-layer-fade', 'era-fade-in');

    const historicalMarkerPane = map.createPane('historicalMarkerPane');
    historicalMarkerPane.style.zIndex = '620';
    historicalMarkerPane.classList.add('historical-layer-fade', 'era-fade-in');

    const modernBorderPane = map.createPane('modernBorderPane');
    modernBorderPane.style.zIndex = '480';

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

  // Update map features whenever currentSlide changes with smooth CSS transition fade-in/out
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const overlayPane = map.getPane('historicalOverlayPane') || map.getPane('overlayPane');
    const markerPane = map.getPane('historicalMarkerPane') || map.getPane('markerPane');

    // Function to clear old layers and mount the new era features
    const renderEraFeatures = () => {
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
      const boundsPoints: [number, number][] = [];

      // Custom Capital Icon with multi-ring Pulse ripple effect & entrance highlight
      const capitalIcon = L.divIcon({
        className: 'capital-pin-marker',
        html: `
          <div class="capital-pin-wrapper relative flex flex-col items-center justify-center cursor-pointer select-none" style="width: 30px; height: 30px;">
            <!-- Outer Concentric Pulse Waves -->
            <div class="capital-pulse-ring capital-pulse-ring-1"></div>
            <div class="capital-pulse-ring capital-pulse-ring-2"></div>
            <div class="capital-pulse-ring capital-pulse-ring-3"></div>

            <!-- Core Pulsing Capital Pin -->
            <div class="capital-core-pin relative z-20 w-7 h-7 rounded-full bg-gradient-to-br from-[#ba4f33] via-[#8a3b24] to-[#5c2415] border-2 border-[#fcedc7] shadow-xl flex items-center justify-center text-[#fcedc7] text-xs font-bold">
              ★
            </div>

            <!-- Capital City Tag -->
            <div class="absolute top-8 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-[#1c261f]/95 text-[#fcedc7] border border-[#a9863f]/70 text-[10px] font-serif font-bold shadow-lg whitespace-nowrap leading-none tracking-wide pointer-events-none">
              👑 ${capital ? capital.name : ''}
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // 2. Draw Core Polygon (Red-ochre #8a3b24) with historical overlay pane
      if (extent?.core && Array.isArray(extent.core) && extent.core.length > 0) {
        const validCore = extent.core.filter(
          pt => Array.isArray(pt) && pt.length >= 2 && !isNaN(pt[0]) && isFinite(pt[0]) && !isNaN(pt[1]) && isFinite(pt[1])
        ) as [number, number][];

        if (validCore.length > 0) {
          const corePoly = L.polygon(validCore, {
            pane: 'historicalOverlayPane',
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
          validCore.forEach(pt => boundsPoints.push(pt));
        }
      }

      // 3. Draw Secondary Polygon (Verdigris #3f6259 dashed) with historical overlay pane
      if (extent?.secondary && Array.isArray(extent.secondary) && extent.secondary.length > 0) {
        const validSec = extent.secondary.filter(
          pt => Array.isArray(pt) && pt.length >= 2 && !isNaN(pt[0]) && isFinite(pt[0]) && !isNaN(pt[1]) && isFinite(pt[1])
        ) as [number, number][];

        if (validSec.length > 0) {
          const secPoly = L.polygon(validSec, {
            pane: 'historicalOverlayPane',
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
          validSec.forEach(pt => boundsPoints.push(pt));
        }
      }

      // 4. Draw Outposts (Golden dots #a9863f)
      if (extent?.outposts && extent.outposts.length > 0 && outpostsLayerRef.current) {
        extent.outposts.forEach((outpost: OutpostPoint) => {
          if (
            typeof outpost.lat !== 'number' ||
            isNaN(outpost.lat) ||
            !isFinite(outpost.lat) ||
            typeof outpost.lon !== 'number' ||
            isNaN(outpost.lon) ||
            !isFinite(outpost.lon)
          ) {
            return;
          }

          const marker = L.circleMarker([outpost.lat, outpost.lon], {
            pane: 'historicalMarkerPane',
            radius: 6,
            color: '#a9863f',
            weight: 2,
            fillColor: '#f7f4ea',
            fillOpacity: 1
          });

          marker.bindPopup(`
            <div dir="rtl" class="text-right font-sans" style="white-space: normal; min-width: 170px; max-width: 230px;">
              <div class="text-[11px] font-bold text-[#8a3b24] tracking-wide border-b border-[#c9bd97]/50 pb-1 mb-1">📍 ثغر / محطة متقدمة</div>
              <div class="font-serif font-bold text-sm text-[#141c17]">${outpost.name}</div>
              ${outpost.desc ? `<div class="text-xs text-[#4a4130] mt-1 leading-relaxed">${outpost.desc}</div>` : ''}
            </div>
          `, {
            className: 'historical-popup',
            offset: [0, -8],
            autoPan: true
          });

          outpostsLayerRef.current?.addLayer(marker);
          boundsPoints.push([outpost.lat, outpost.lon]);
        });
      }

      // 5. Draw Frontier Landmarks (if enabled)
      if (showFrontierLandmarks && extent?.frontierLandmarks && landmarksLayerRef.current) {
        extent.frontierLandmarks.forEach((lm: FrontierLandmark) => {
          if (
            typeof lm.lat !== 'number' ||
            isNaN(lm.lat) ||
            !isFinite(lm.lat) ||
            typeof lm.lon !== 'number' ||
            isNaN(lm.lon) ||
            !isFinite(lm.lon)
          ) {
            return;
          }

          const marker = L.circleMarker([lm.lat, lm.lon], {
            pane: 'historicalMarkerPane',
            radius: 5,
            color: '#2a443e',
            weight: 2,
            fillColor: '#7d9992',
            fillOpacity: 0.85
          });

          marker.bindPopup(`
            <div dir="rtl" class="text-right font-sans" style="white-space: normal; min-width: 170px; max-width: 230px;">
              <div class="text-[11px] font-bold text-[#3f6259] tracking-wide border-b border-[#c9bd97]/50 pb-1 mb-1">🛡️ معلم / قلعة حدودية</div>
              <div class="font-serif font-bold text-sm text-[#141c17]">${lm.name}</div>
              ${lm.desc ? `<div class="text-xs text-[#4a4130] mt-1 leading-relaxed">${lm.desc}</div>` : ''}
            </div>
          `, {
            className: 'historical-popup',
            offset: [0, -6],
            autoPan: true
          });

          landmarksLayerRef.current?.addLayer(marker);
          boundsPoints.push([lm.lat, lm.lon]);
        });
      }

      // 6. Draw Capital Marker
      if (
        capital &&
        typeof capital.lat === 'number' &&
        !isNaN(capital.lat) &&
        isFinite(capital.lat) &&
        typeof capital.lon === 'number' &&
        !isNaN(capital.lon) &&
        isFinite(capital.lon)
      ) {
        const capMarker = L.marker([capital.lat, capital.lon], {
          pane: 'historicalMarkerPane',
          icon: capitalIcon
        }).addTo(map);

        capMarker.bindPopup(`
          <div dir="rtl" class="font-sans text-right p-0.5" style="white-space: normal; min-width: 180px; max-width: 230px;">
            <div class="text-[11px] text-[#8a3b24] font-bold tracking-wide border-b border-[#c9bd97]/50 pb-1 mb-1">👑 العاصمة المركزية</div>
            <div class="font-serif font-bold text-base text-[#141c17]">${capital.name}</div>
            ${capital.description ? `<div class="text-xs text-[#4a4130] mt-1.5 leading-relaxed">${capital.description}</div>` : ''}
          </div>
        `, {
          className: 'historical-popup',
          offset: [0, -18],
          autoPan: true
        });

        capitalMarkerRef.current = capMarker;
        boundsPoints.push([capital.lat, capital.lon]);
      }

      // 7. Smoothly fly map camera to bound all territorial extents safely
      const fallbackCenter: [number, number] = (capital && !isNaN(capital.lat) && !isNaN(capital.lon))
        ? [capital.lat, capital.lon]
        : [26.8, 30.8];

      const currentMapSize = map.getSize();
      if (!currentMapSize || currentMapSize.x <= 100 || currentMapSize.y <= 100) {
        frameTimerRef.current = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            safeFlyToBounds(mapInstanceRef.current, boundsPoints, fallbackCenter);
          }
        }, 120);
      } else {
        safeFlyToBounds(map, boundsPoints, fallbackCenter);
      }

      // Step 3: Trigger CSS transition fade-in for the new era layers
      eraFadeInTimerRef.current = setTimeout(() => {
        if (overlayPane) {
          overlayPane.classList.remove('era-fade-out');
          overlayPane.classList.add('era-fade-in');
          overlayPane.style.opacity = '1';
        }
        if (markerPane) {
          markerPane.classList.remove('era-fade-out');
          markerPane.classList.add('era-fade-in');
          markerPane.style.opacity = '1';
        }
      }, 50);
    };

    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      renderEraFeatures();
    } else {
      // Step 1: Smoothly fade out previous era layers using CSS transition
      if (overlayPane) {
        overlayPane.classList.remove('era-fade-in');
        overlayPane.classList.add('era-fade-out');
        overlayPane.style.opacity = '0';
      }
      if (markerPane) {
        markerPane.classList.remove('era-fade-in');
        markerPane.classList.add('era-fade-out');
        markerPane.style.opacity = '0';
      }

      // Step 2: After CSS transition fade-out duration (220ms), switch layers and initiate CSS fade-in
      eraTransitionTimerRef.current = setTimeout(() => {
        renderEraFeatures();
      }, 220);
    }

    return () => {
      if (eraTransitionTimerRef.current) clearTimeout(eraTransitionTimerRef.current);
      if (eraFadeInTimerRef.current) clearTimeout(eraFadeInTimerRef.current);
      if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    };

  }, [currentSlide, showFrontierLandmarks]);

  // Handle Modern Border Overlay toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showModernBorder) {
      if (!modernBorderLayerRef.current) {
        const poly = L.polygon(MODERN_EGYPT_BORDER, {
          pane: 'modernBorderPane',
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

    const boundsPoints: [number, number][] = [];
    if (currentSlide.extent?.core) {
      currentSlide.extent.core.forEach(p => {
        if (Array.isArray(p) && p.length >= 2 && !isNaN(p[0]) && isFinite(p[0]) && !isNaN(p[1]) && isFinite(p[1])) {
          boundsPoints.push([p[0], p[1]]);
        }
      });
    }
    if (currentSlide.extent?.secondary) {
      currentSlide.extent.secondary.forEach(p => {
        if (Array.isArray(p) && p.length >= 2 && !isNaN(p[0]) && isFinite(p[0]) && !isNaN(p[1]) && isFinite(p[1])) {
          boundsPoints.push([p[0], p[1]]);
        }
      });
    }
    if (
      currentSlide.capital &&
      typeof currentSlide.capital.lat === 'number' &&
      !isNaN(currentSlide.capital.lat) &&
      isFinite(currentSlide.capital.lat) &&
      typeof currentSlide.capital.lon === 'number' &&
      !isNaN(currentSlide.capital.lon) &&
      isFinite(currentSlide.capital.lon)
    ) {
      boundsPoints.push([currentSlide.capital.lat, currentSlide.capital.lon]);
    }

    const fallback: [number, number] = (currentSlide.capital && !isNaN(currentSlide.capital.lat) && !isNaN(currentSlide.capital.lon))
      ? [currentSlide.capital.lat, currentSlide.capital.lon]
      : [26.8, 30.8];

    safeFlyToBounds(map, boundsPoints, fallback);
  };

  return (
    <div className="relative w-full h-full min-h-[350px] overflow-hidden">
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        id="historical-leaflet-map"
        dir="ltr"
        className="w-full h-full z-0"
      />

      {/* Atmospheric Era Transition Veil (Fade-in/Fade-out between historical eras) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`era-fade-${currentSlide.id}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 bg-[#141c17]/35 z-[25] backdrop-blur-[1px]"
        />
      </AnimatePresence>

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
