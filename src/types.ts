export type PeriodCategory = 'ancient' | 'greco_roman' | 'islamic_medieval' | 'modern';

export type ControlType =
  | 'geographic_context'
  | 'archaeological_site'
  | 'direct_administration'
  | 'administrative_boundary'
  | 'joint_administration'
  | 'dependency'
  | 'temporary_occupation'
  | 'campaign'
  | 'trade_mining_garrison'
  | 'uncertain_frontier'
  | 'disputed_territory'
  | 'treaty_boundary'
  | 'holy_sanctuary'
  | 'maritime_zone';

export interface ControlFeature {
  polygons?: [number, number][][][];
  sourceIds?: string[];
  certainty?: 'schematic' | 'generalized';
  type: ControlType;
  name?: string;
  label?: string;
  period?: string;
  dateRange?: string;
  authority?: string;
  description?: string;
  color?: string;
  fillColor?: string;
  coords?: [number, number][];
  geometryType?: 'polygon' | 'line' | 'point';
}

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

export type SecondaryType =
  | 'vassal'
  | 'divided'
  | 'dependency'
  | 'holy_sanctuary'
  | 'african_extension'
  | 'disputed_territory'
  | 'campaign'
  | 'trade_mining_garrison';

export interface EraExtent {
  core: [number, number][];
  coreLabel?: string;
  secondary?: [number, number][];
  secondaryLabel?: string;
  secondaryType?: SecondaryType;
  controlFeatures?: ControlFeature[];
  outposts?: OutpostPoint[];
  frontierLandmarks?: FrontierLandmark[];
  expansionNotes?: string;
  reconstructionDate?: string;
}

export interface SlideData {
  boundaryReview?: import('./data/boundaryReview').BoundaryReview;
  boundaryPhase?: import('./data/boundaryReview').BoundaryPhase;
  id: number;
  type?: 'overview' | 'era';
  date: string;
  reconstructionDate?: string;
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
