import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutpostPoint, FrontierLandmark } from '../types';
import { MODERN_REFERENCE, MODERN_DISPUTES } from '../data/boundaryReview';
import { drawBoundaryFeatures, featurePoints } from '../lib/boundaryLayers';
import { Layers, Eye, Compass, Maximize2, X, History, Map as MapIcon, RotateCcw } from 'lucide-react';

// Fix standard Leaflet default marker icon paths if standard markers are ever referenced
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Standard geographic coordinates of Egypt (Center: ~26.8206° N, 30.8025° E)
export const EGYPT_CENTER: [number, number] = [26.8206, 30.8025];
export const EGYPT_DEFAULT_ZOOM = 5;

export type BaseMapStyle = 'voyager' | 'natgeo' | 'positron' | 'satellite';

export interface BaseMapConfig {
  id: BaseMapStyle;
  name: string;
  shortLabel: string;
  url: string;
  options: L.TileLayerOptions;
  icon: string;
}

export const BASE_MAP_CONFIGS: Record<BaseMapStyle, BaseMapConfig> = {
  voyager: {
    id: 'voyager',
    name: 'الخريطة الجغرافية الملونة (Esri World Map)',
    shortLabel: 'الجغرافية',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ'
    },
    icon: '🗺️'
  },
  natgeo: {
    id: 'natgeo',
    name: 'تضاريس وطبوغرافيا تفصيلية (World Topo Map)',
    shortLabel: 'تضاريس',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Topographic Relief'
    },
    icon: '🏔️'
  },
  positron: {
    id: 'positron',
    name: 'خريطة كلاسيكية هادئة (Light Gray Canvas)',
    shortLabel: 'كلاسيكية',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxNativeZoom: 16,
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, DeLorme'
    },
    icon: '📜'
  },
  satellite: {
    id: 'satellite',
    name: 'صور الأقمار الصناعية الفضائية (Esri Imagery)',
    shortLabel: 'أقمار صناعية',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
    },
    icon: '🛰️'
  }
};

/**
 * Creates an Esri tile layer with one alternate-host retry per failed tile.
 */
export function createSafeTileLayer(config: BaseMapConfig): L.TileLayer {
  const layer = L.tileLayer(config.url, {
    ...config.options
  });

  layer.on('tileerror', (e: any) => {
    const tile = e.tile;
    if (!tile || tile._fallbackHandled) return;
    tile._fallbackHandled = true;

    const z = e.coords?.z;
    const x = e.coords?.x;
    const y = e.coords?.y;

    if (z === undefined || x === undefined || y === undefined) return;

    // Retry once on the alternate Esri host.
    if (config.id === 'satellite') {
      tile.src = `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
    } else if (config.id === 'natgeo') {
      tile.src = `https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`;
    } else if (config.id === 'positron') {
      tile.src = `https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}`;
    } else {
      tile.src = `https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}`;
    }
  });

  return layer;
}

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
  activeTab?: 'narrative' | 'statistics';
}

export const AtlasMap: React.FC<AtlasMapProps> = ({
  currentSlide,
  showModernBorder,
  onToggleModernBorder,
  showFrontierLandmarks,
  onToggleFrontierLandmarks,
  showLegend,
  onToggleLegend,
  activeTab
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups refs to easily clear/re-add layers
  const coreLayerRef = useRef<L.Polygon | null>(null);
  const secondaryLayerRef = useRef<L.Polygon | null>(null);
  const outpostsLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarksLayerRef = useRef<L.LayerGroup | null>(null);
  const capitalMarkerRef = useRef<L.Marker | null>(null);
  const modernBorderLayerRef = useRef<L.FeatureGroup | null>(null);
  const controlLayersRef = useRef<L.FeatureGroup | null>(null);

  // Transition refs for smooth CSS fade-in/out layer updates
  const isInitialRenderRef = useRef<boolean>(true);
  const prevEraIdRef = useRef<number>(currentSlide.id);
  const eraTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eraFadeInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const temporalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEraToast, setShowEraToast] = useState<boolean>(false);
  const [isTemporalFading, setIsTemporalFading] = useState<boolean>(false);
  const [temporalDirection, setTemporalDirection] = useState<'forward' | 'backward'>('forward');
  const [baseMapStyle, setBaseMapStyle] = useState<BaseMapStyle>(() => {
    try {
      const saved = localStorage.getItem('atlas_basemap_style');
      if (saved && (saved === 'voyager' || saved === 'natgeo' || saved === 'positron' || saved === 'satellite')) {
        return saved as BaseMapStyle;
      }
    } catch {
      // ignore
    }
    return 'voyager';
  });

  const handleBaseMapChange = (newStyle: BaseMapStyle) => {
    setBaseMapStyle(newStyle);
    try {
      localStorage.setItem('atlas_basemap_style', newStyle);
    } catch {
      // ignore
    }
  };
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const currentBaseStyleRef = useRef<BaseMapStyle | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Trigger smooth era toast badge, Temporal Fade on era changes
  useEffect(() => {
    if (!isInitialRenderRef.current) {
      const prevId = prevEraIdRef.current;
      const direction = currentSlide.id >= prevId ? 'forward' : 'backward';
      prevEraIdRef.current = currentSlide.id;
      setTemporalDirection(direction);

      // Activate CSS Temporal Fade overlay filter
      setIsTemporalFading(true);
      if (temporalTimerRef.current) clearTimeout(temporalTimerRef.current);
      temporalTimerRef.current = setTimeout(() => {
        setIsTemporalFading(false);
      }, 850);

      setShowEraToast(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setShowEraToast(false);
      }, 1900);
    }
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (temporalTimerRef.current) clearTimeout(temporalTimerRef.current);
    };
  }, [currentSlide.id]);

  // Robust Map Mount Effect: Initializes Leaflet cleanly and handles React StrictMode mount/unmount/remount
  // Note: Loads ONLY in the first tab (narrative) and never in other tabs as requested
  useEffect(() => {
    if (activeTab && activeTab !== 'narrative') {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
      return;
    }

    const container = mapContainerRef.current;
    if (!container) return;

    // 1. Prevent "Map container is already initialized" error:
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (err) {
        console.warn('Leaflet: cleanup previous map instance error:', err);
      }
      mapInstanceRef.current = null;
    }

    // 2. Clear any lingering _leaflet_id stamped on the DOM container by Leaflet
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    // 3. Clear any leftover DOM child nodes inside container to avoid DOM collision
    container.innerHTML = '';

    let map: L.Map | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let handleWindowResize: (() => void) | null = null;
    let timer1: ReturnType<typeof setTimeout> | null = null;
    let timer2: ReturnType<typeof setTimeout> | null = null;

    try {
      map = L.map(container, {
        zoomControl: false,
        attributionControl: true,
        minZoom: 3,
        maxZoom: 18
      }).setView(EGYPT_CENTER, EGYPT_DEFAULT_ZOOM);

      // Zoom control on bottom left
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

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

      // Initial Base Tile Layer
      const initialConfig = BASE_MAP_CONFIGS[baseMapStyle] || BASE_MAP_CONFIGS['voyager'];
      const baseLayer = createSafeTileLayer(initialConfig);
      baseLayer.addTo(map);
      baseTileLayerRef.current = baseLayer;
      currentBaseStyleRef.current = baseMapStyle;

      mapInstanceRef.current = map;
      setIsMapLoaded(true);

      // ResizeObserver ensures Leaflet updates viewport when container layout changes
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        });
        resizeObserver.observe(container);
      } else {
        handleWindowResize = () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        };
        window.addEventListener('resize', handleWindowResize);
      }

      timer1 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

      timer2 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 400);

    } catch (error) {
      console.error('Error initializing Leaflet map on container:', error);
      if (map) {
        try {
          map.remove();
        } catch {
          // ignore
        }
      }
      mapInstanceRef.current = null;
      setIsMapLoaded(false);
    }

    // Effect cleanup: Guaranteed to be returned outside of try/catch to ensure proper disposal on unmount/re-render
    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
      if (resizeObserver) resizeObserver.disconnect();
      if (handleWindowResize) window.removeEventListener('resize', handleWindowResize);

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (err) {
          console.warn('Error during Leaflet map cleanup:', err);
        }
        mapInstanceRef.current = null;
      }

      if (container && (container as any)._leaflet_id) {
        delete (container as any)._leaflet_id;
      }

      baseTileLayerRef.current = null;
      currentBaseStyleRef.current = null;
      coreLayerRef.current = null;
      secondaryLayerRef.current = null;
      outpostsLayerRef.current = null;
      landmarksLayerRef.current = null;
      capitalMarkerRef.current = null;
      modernBorderLayerRef.current = null;

      setIsMapLoaded(false);
    };
  }, []);

  // Dynamically update base tile layer when user switches style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    if (currentBaseStyleRef.current === baseMapStyle && baseTileLayerRef.current) {
      return;
    }

    if (baseTileLayerRef.current) {
      try {
        map.removeLayer(baseTileLayerRef.current);
      } catch (err) {
        console.warn('Error removing old base tile layer:', err);
      }
      baseTileLayerRef.current = null;
    }

    const config = BASE_MAP_CONFIGS[baseMapStyle] || BASE_MAP_CONFIGS['voyager'];
    const newTileLayer = createSafeTileLayer(config);
    newTileLayer.addTo(map);
    baseTileLayerRef.current = newTileLayer;
    currentBaseStyleRef.current = baseMapStyle;
  }, [baseMapStyle, isMapLoaded]);

  // Adjust viewport size when active tab changes between narrative and statistics
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [activeTab, isMapLoaded]);

  // Update map features whenever currentSlide changes with smooth CSS transition fade-in/out
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const overlayPane = map.getPane('historicalOverlayPane') || map.getPane('overlayPane');
    const markerPane = map.getPane('historicalMarkerPane') || map.getPane('markerPane');

    // Function to clear old layers and mount the new era features
    const renderEraFeatures = () => {
      if (controlLayersRef.current) { map.removeLayer(controlLayersRef.current); controlLayersRef.current = null; }
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
            dashArray: currentSlide.boundaryReview ? '2 7' : undefined,
            fillColor: '#8a3b24',
            fillOpacity: currentSlide.boundaryReview ? 0.07 : 0.22,
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
            color: currentSlide.boundaryReview ? '#6d28d9' : '#3f6259',
            weight: 2,
            dashArray: currentSlide.boundaryReview ? '2 7' : '6, 6',
            fillColor: currentSlide.boundaryReview ? '#6d28d9' : '#3f6259',
            fillOpacity: currentSlide.boundaryReview ? 0.07 : 0.18,
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

      if (extent?.controlFeatures) {
        controlLayersRef.current = drawBoundaryFeatures(extent.controlFeatures).addTo(map);
        extent.controlFeatures.forEach(f => boundsPoints.push(...featurePoints(f)));
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

      // Note: Frontier Landmarks are updated in a dedicated effect so toggling them preserves user camera zoom/position

      // 5. Draw Capital Marker
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
      if (overlayPane) {
        overlayPane.style.opacity = '1';
        overlayPane.classList.remove('era-fade-out');
        overlayPane.classList.add('era-fade-in');
      }
      if (markerPane) {
        markerPane.style.opacity = '1';
        markerPane.classList.remove('era-fade-out');
        markerPane.classList.add('era-fade-in');
      }
    };

  }, [currentSlide, isMapLoaded]);

  // Dedicated effect for frontier landmarks: toggling updates landmarks layer directly without resetting camera view or re-rendering entire era
  useEffect(() => {
    const layer = landmarksLayerRef.current;
    if (!layer || !isMapLoaded) return;

    layer.clearLayers();

    if (showFrontierLandmarks && currentSlide.extent?.frontierLandmarks) {
      currentSlide.extent.frontierLandmarks.forEach((lm: FrontierLandmark) => {
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

        layer.addLayer(marker);
      });
    }
  }, [showFrontierLandmarks, currentSlide, isMapLoaded]);

  // Handle Modern Border Overlay toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    if (showModernBorder) {
      if (!modernBorderLayerRef.current) {
        modernBorderLayerRef.current = drawBoundaryFeatures([
          {type:'direct_administration',name:'مرجع معاصر للمقارنة فقط — Natural Earth',polygons:MODERN_REFERENCE,color:'#0d9488',certainty:'generalized',sourceIds:['ne']},
          ...MODERN_DISPUTES
        ], 'modernBorderPane').addTo(map);
      }
    } else {
      if (modernBorderLayerRef.current) {
        map.removeLayer(modernBorderLayerRef.current);
        modernBorderLayerRef.current = null;
      }
    }
  }, [showModernBorder, isMapLoaded]);

  // Re-center handler
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const boundsPoints: [number, number][] = [];
    currentSlide.extent?.controlFeatures?.forEach(f => boundsPoints.push(...featurePoints(f)));
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
      : EGYPT_CENTER;

    safeFlyToBounds(map, boundsPoints, fallback);
  };

  // Immediate reset to original geographic base map
  const handleResetOriginalMap = () => {
    handleBaseMapChange('voyager');
    handleRecenter();
  };

  return (
    <div className="relative w-full h-full min-h-[260px] flex-1 overflow-hidden">
      {/* Keep the Leaflet container and its React className stable across era changes */}
      <div
        ref={mapContainerRef}
        id="historical-leaflet-map"
        dir="ltr"
        className="absolute inset-0 w-full h-full z-0 historical-map-canvas"
      />

      {currentSlide.boundaryReview && <div className="absolute left-2 top-2 z-[490] max-w-[43%] bg-white/95 border border-stone-400 p-1.5 rounded text-[10px] text-stone-900 pointer-events-none" dir="rtl">
        {currentSlide.boundaryPhase?.label ?? (currentSlide.boundaryReview.status==='schematic'?'ترسيم سابق غير محقق':'مرجع معاصر معمّم')}
        <div>▧ نزاع · ⋯ عدم يقين</div>
      </div>}
      {currentSlide.boundaryPhase?.sourceIds.some(id=>id==='cshapes'||id.startsWith('awmc')) && <div className="absolute bottom-1 left-1 z-[490] max-w-[45%] bg-white/95 px-1 text-[9px] text-stone-900 leading-tight" dir="ltr">
        {currentSlide.boundaryPhase.sourceIds.includes('cshapes')?<><a href="https://icr.ethz.ch/data/cshapes/" target="_blank" rel="noopener noreferrer">CShapes / Schvitz et al.</a> · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a></>:<><a href="https://awmc.unc.edu/gis-data/" target="_blank" rel="noopener noreferrer">AWMC</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer">ODbL 1.0</a></>}
      </div>}
      {/* State-based loading check: Loading indicator while container and Leaflet map instance initialize */}
      {!isMapLoaded && (
        <div
          id="map-loading-indicator"
          className="absolute inset-0 z-[1050] flex flex-col items-center justify-center bg-[#f5f0e3] transition-opacity duration-300 pointer-events-none select-none"
        >
          <div className="w-8 h-8 border-3 border-[#8a3b24] border-t-transparent rounded-full animate-spin mb-2.5 shadow-sm" />
          <span className="text-xs font-serif font-bold text-[#752612] tracking-wide">
            جاري تهيئة الخريطة التاريخية...
          </span>
        </div>
      )}

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

      {/* Temporal Fade (CSS Overlay Filter): Simulates historical time passage during era shifts */}
      {isTemporalFading && (
        <div
          key={`temporal-fade-overlay-${currentSlide.id}`}
          className="temporal-fade-overlay"
          aria-hidden="true"
        >
          {/* Central Rotating Astrolabe / Chronograph Rings */}
          <div className="temporal-chronograph-ring" />

          {/* Centered Temporal Passage Pill */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 bg-[#101713]/90 text-[#fdfbf7] px-4 py-1.5 rounded-full border border-[#a9863f]/70 shadow-2xl backdrop-blur-md">
              <History className="w-3.5 h-3.5 text-[#f2b880] animate-spin" />
              <span className="text-xs font-serif font-bold text-[#f2b880]">
                {temporalDirection === 'forward' ? 'انتقال زمني للأمام' : 'رجوع عبر العصور'}
              </span>
              <span className="text-[11px] font-mono text-[#e9e0c7] border-r border-[#a9863f]/40 pr-2">
                {currentSlide.date}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Atmospheric temporal shift flash across map during era change */}
      {showEraToast && (
        <>
          <div key={`map-sheen-${currentSlide.id}`} className="map-temporal-sheen" />
          <div
            key={`map-toast-${currentSlide.id}`}
            className="era-map-toast absolute top-3 left-1/2 -translate-x-1/2 z-[480] bg-[#101713]/95 text-[#fdfbf7] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#a9863f]/60 shadow-2xl flex items-center gap-2 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#8a3b24] animate-ping shrink-0" />
            <span className="text-xs font-serif font-bold text-[#f2b880]">{currentSlide.headline}</span>
            {currentSlide.date && (
              <span className="text-[10.5px] text-[#e9e0c7]/90 font-sans border-r border-[#a9863f]/40 pr-2">
                {currentSlide.date}
              </span>
            )}
          </div>
        </>
      )}

      {/* زر وحيد موحد لخيارات ودليل الخريطة (بدلاً من زحمة الأزرار العلوية) */}
      {!showLegend ? (
        <button
          id="unified-map-menu-btn"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLegend();
          }}
          title="خيارات ودليل الخريطة"
          className="absolute top-3 right-3 z-[1050] bg-[#fbf8f0]/95 hover:bg-[#f2ece0] active:scale-95 text-[#752612] text-xs font-serif font-bold px-3 py-1.5 rounded-lg shadow-xl border border-[#cbbd95] flex items-center gap-1.5 transition-all cursor-pointer select-none backdrop-blur-md"
        >
          <Compass className="w-4 h-4 text-[#8a3b24]" />
          <span>خيارات ودليل الخريطة</span>
          <Layers className="w-3.5 h-3.5 text-[#8a3b24]" />
        </button>
      ) : (
        <div
          id="map-legend-panel"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-[1050] bg-[#fbf8f0]/95 backdrop-blur-md text-[#17120a] text-xs p-3 rounded-xl shadow-2xl border border-[#cbbd95] w-[calc(100%-24px)] max-w-[300px] max-h-[calc(100%-24px)] overflow-y-auto select-none transition-all"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#cbbd95] pb-2 mb-2.5 gap-2">
            <div className="font-serif font-bold text-sm text-[#752612] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#8a3b24]" />
              <span>خيارات ودليل الخريطة</span>
            </div>
            <div className="flex items-center gap-1">
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
                className="p-1 hover:bg-[#eae2ce] rounded text-[#2a2216] transition-colors flex items-center justify-center cursor-pointer"
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
                title="إغلاق خيارات الخريطة"
                className="p-1 hover:bg-[#8a3b24] hover:text-white rounded text-[#752612] transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* القسم 1: نوع الخريطة الأساسية */}
          <div className="mb-2.5 pb-2 border-b border-[#cbbd95]/70">
            <div className="text-[11px] font-bold text-[#752612] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapIcon className="w-3.5 h-3.5 text-[#8a3b24]" />
                <span>نوع الخريطة</span>
              </span>
              {baseMapStyle !== 'voyager' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetOriginalMap();
                  }}
                  className="text-[10px] text-[#8a3b24] hover:underline font-bold cursor-pointer flex items-center gap-0.5"
                  title="استعادة الخريطة الملونة الأصلية"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>الخريطة الأصلية</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(BASE_MAP_CONFIGS) as BaseMapStyle[]).map((styleKey) => {
                const cfg = BASE_MAP_CONFIGS[styleKey];
                const isActive = baseMapStyle === styleKey;
                return (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBaseMapChange(styleKey);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10.5px] font-medium border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#8a3b24] text-white border-[#8a3b24] shadow-sm font-bold'
                        : 'bg-[#f4efe1]/80 text-[#3d3224] border-[#d8ccb0] hover:bg-[#eae2ce]'
                    }`}
                  >
                    <span>{cfg.icon}</span>
                    <span className="truncate">{cfg.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* القسم 2: طبقات العرض */}
          <div className="mb-2.5 pb-2 border-b border-[#cbbd95]/70 space-y-1.5">
            <div className="text-[11px] font-bold text-[#752612] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#8a3b24]" />
              <span>طبقات العرض التفاعلية</span>
            </div>

            {/* Toggle Modern Egypt Border */}
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
                  : 'bg-transparent border-[#cbbd95] text-[#2a2216] hover:bg-[#eae2ce]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                <span>مقارنة بحدود مصر المعاصرة 1989</span>
              </span>
              <span className={`text-[10px] px-1 py-0.5 rounded font-bold ${showModernBorder ? 'bg-[#0d9488] text-white' : 'bg-[#d8ccb0] text-[#17120a]'}`}>
                {showModernBorder ? 'مفعّل' : 'معطّل'}
              </span>
            </button>

            {/* Toggle Frontier Landmarks */}
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

          {/* القسم 3: مفتاح ودليل الخريطة */}
          <div className="space-y-1.5 text-[11.5px] leading-tight text-[#17120a] mb-2.5">
            <div className="text-[11px] font-bold text-[#752612] mb-1">دليل الرموز:</div>
            <div>▧ أحمر مخطط: نزاع أو مطالبات متعارضة</div>
            <div>⋯ بنفسجي: عدم يقين أو اختلاف إسناد</div>
            <div>– – أخضر: تبعية / نفوذ</div>
            <div>– · برتقالي: حكم مؤقت / حملة</div>
            <div>⋯ حافة منقطة: ترسيم غير محقق</div>
            <div>– – رمادي: حد إداري داخل إمبراطورية</div>
            <div>– · بنفسجي: إقليم ذو إدارة مشتركة</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#8a3b24] opacity-80 shrink-0 border border-[#8a3b24]"></span>
              <span className="font-bold">نطاق إقليمي — راجع درجة الدقة</span>
            </div>

            {currentSlide.extent?.secondary && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#3f6259] opacity-75 shrink-0 border border-dashed border-[#3f6259]"></span>
                <span className="text-[#14382f] font-bold">{currentSlide.extent.secondaryLabel || 'إقليم تابع / سيادة ثانوية'}</span>
              </div>
            )}

            {currentSlide.extent?.outposts && currentSlide.extent.outposts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fbf8f0] border-2 border-[#a9863f] shrink-0"></span>
                <span className="font-medium">محطات وثغور خارجية منفصلة</span>
              </div>
            )}

            {currentSlide.capital && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8a3b24] border border-[#fbf8f0] flex items-center justify-center text-[8px] text-white font-bold shrink-0">★</span>
                <span className="font-medium">العاصمة والقلب الإداري</span>
              </div>
            )}
          </div>

          {/* Clarification & Close button */}
          <div className="border-t border-[#cbbd95]/70 pt-2 flex items-center justify-between text-[10px] text-[#6e5d42]">
            <span>ⓘ الحدود تقريبية مبنية على معالم تاريخية.</span>
            <button
              id="hide-legend-text-btn"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLegend();
              }}
              className="text-[#8a3b24] bg-[#8a3b24]/10 hover:bg-[#8a3b24] hover:text-white px-2 py-0.5 rounded cursor-pointer shrink-0 font-bold transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
