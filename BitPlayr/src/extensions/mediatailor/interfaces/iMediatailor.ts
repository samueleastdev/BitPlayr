export interface AdBreak {
  adBreakTrackingEvents: any[]; // Replace 'any' with more specific type if known
  adMarkerDuration: string | null;
  ads: Ad[];
  availId: string;
  availProgramDateTime: string | null;
  duration: string;
  durationInSeconds: number;
  meta: any | null; // Replace 'any' with more specific type if known
  nonLinearAdsList: any[]; // Replace 'any' with more specific type if known
  startTime: string;
  startTimeInSeconds: number;
}

export interface Ad {
  adId: string;
  adParameters: string;
  adProgramDateTime: string | null;
  adSystem: string;
  adTitle: string;
  adVerifications: any[]; // Replace 'any' with more specific type if known
  companionAds: any[]; // Replace 'any' with more specific type if known
  creativeId: string;
  creativeSequence: string;
  duration: string;
  durationInSeconds: number;
  extensions: any[]; // Replace 'any' with more specific type if known
  mediaFiles: MediaFiles;
  skipOffset: string | null;
  startTime: string;
  startTimeInSeconds: number;
  trackingEvents: TrackingEvent[];
  vastAdId: string;
}

interface TrackingEvent {
  beaconUrls: string[];
  duration: string;
  durationInSeconds: number;
  eventId: string;
  eventProgramDateTime: string | null;
  eventType: string;
  startTime: string;
  startTimeInSeconds: number;
}

interface MediaFiles {
  mediaFilesList: any[]; // Replace 'any' with more specific type if known
  mezzanine: string;
}
