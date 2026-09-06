import { SlideData } from '../types';
import { ANCIENT_ERAS } from './erasAncient';
import { GRECO_ISLAMIC_ERAS } from './erasGrecoIslamic';
import { MODERN_ERAS } from './erasModern';

export const ALL_SLIDES: SlideData[] = [
  ...ANCIENT_ERAS,
  ...GRECO_ISLAMIC_ERAS,
  ...MODERN_ERAS
];

export const HISTORICAL_ERAS: SlideData[] = ALL_SLIDES.filter(s => s.id !== 0);

export function getSlideById(id: number): SlideData | undefined {
  return ALL_SLIDES.find(s => s.id === id);
}

export function getErasByCategory(category: string): SlideData[] {
  if (category === 'all') return ALL_SLIDES;
  return ALL_SLIDES.filter(s => s.periodCategory === category || s.id === 0);
}
