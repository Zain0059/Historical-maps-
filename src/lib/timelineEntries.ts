import type { SlideData } from '../types';
import { BOUNDARY_REVIEWS, getReviewedSlide } from '../data/boundaryReview';

export interface TimelineEntry {
  eraIndex: number;
  phaseId?: string;
  slide: SlideData;
}

// Expand the current two-era batch; retain the other eras' existing navigation.
export function buildTimelineEntries(slides: SlideData[]): TimelineEntry[] {
  return slides.flatMap((slide, eraIndex) => {
    const phases = (slide.id === 1 || slide.id === 2) ? BOUNDARY_REVIEWS[slide.id]?.phases : undefined;
    return phases?.length
      ? phases.map(phase => ({eraIndex, phaseId: phase.id, slide: getReviewedSlide(slide, phase.id)}))
      : [{eraIndex, slide}];
  });
}

export function findTimelineIndex(entries: TimelineEntry[], eraIndex: number, phaseId?: string): number {
  const exact = entries.findIndex(entry => entry.eraIndex === eraIndex && entry.phaseId === phaseId);
  return exact >= 0 ? exact : Math.max(0, entries.findIndex(entry => entry.eraIndex === eraIndex));
}
