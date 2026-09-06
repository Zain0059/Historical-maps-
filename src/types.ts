export type PeriodCategory = 'ancient' | 'greco_roman' | 'islamic_medieval' | 'modern';

export interface OutpostPoint {
  name: string;
  lat: number;
  lon: number;
  type?: 'trade' | 'naval' | 'mining' | 'garrison' | 'port' | 'fortress' | 'treaty_line';
  desc?: string;
}

export interface FrontierLandmark {
  name: string;
  lat: number;
  lon: number;
  type: 'cataract' | 'fortress' | 'treaty_line' | 'port' | 'pass' | 'mining' | 'garrison' | 'tributary';
  desc?: string;
}

export interface EraExtent {
  core: [number, number][];
  coreLabel?: string;
  secondary?: [number, number][];
  secondaryLabel?: string;
  secondaryType?: 'vassal' | 'divided' | 'dependency' | 'holy_sanctuary' | 'african_extension';
  outposts?: OutpostPoint[];
  frontierLandmarks?: FrontierLandmark[];
  expansionNotes?: string;
}

export interface SlideData {
  id: number;
  type?: 'overview' | 'era';
  date: string;
  periodCategory?: PeriodCategory;
  categoryLabel?: string;
  headline: string;
  text: string;
  capital?: {
    name: string;
    lat: number;
    lon: number;
    description?: string;
  };
  extent?: EraExtent;
  media?: {
    url: string;
    caption: string;
    credit: string;
  };
  keyEvents?: string[];
  frontierCities?: { name: string; desc: string }[];
  borderDescription?: string;
  geographicalStats?: {
    maxReachNorth?: string;
    maxReachSouth?: string;
    maxReachEast?: string;
    maxReachWest?: string;
    strategicDepth?: string;
  };
  sources?: string[];
}
