export type AboutJourneyTimelineItem = {
  year?: string;
  description?: string;
};

export type AboutJourneyStatItem = {
  value?: string;
  label?: string;
};

export type AboutValueItem = {
  title?: string;
  description?: string;
};

export type AboutPageContent = {
  heroTitle?: string;
  heroHighlight?: string;
  heroDescription?: string;
  heroImageUrl?: string | null;
  journeyTitle?: string;
  journeyTimeline?: AboutJourneyTimelineItem[];
  journeyStats?: AboutJourneyStatItem[];
  valuesTitle?: string;
  valuesList?: AboutValueItem[];
  studioHeading?: string;
  studioDescription?: string;
  studioImageUrls?: (string | null)[];
};
