/**
 * Basic data structure
 */
export interface BasicData {
  /** Unique ID */
  id: string;
  /** Data type code */
  code: number;
  /** Timestamp */
  time: string;
}

/**
 * Earthquake intensity scale
 */
export type EarthquakeScale = 10 | 20 | 30 | 40 | 45 | 50 | 55 | 60 | 70 | -1;

/**
 * Tsunami status
 */
export type TsunamiStatus =
  | 'None'
  | 'Unknown'
  | 'Checking'
  | 'NonEffective'
  | 'Watch'
  | 'Warning';

/**
 * Earthquake information
 */
export interface JMAQuake extends BasicData {
  code: 551;
  issue: {
    source?: string;
    time: string;
    type:
      | 'ScalePrompt'
      | 'Destination'
      | 'ScaleAndDestination'
      | 'DetailScale'
      | 'Foreign'
      | 'Other';
    correct?:
      | 'None'
      | 'Unknown'
      | 'ScaleOnly'
      | 'DestinationOnly'
      | 'ScaleAndDestination';
  };
  earthquake: {
    time: string;
    hypocenter?: {
      name?: string;
      latitude?: number;
      longitude?: number;
      depth?: number;
      magnitude?: number;
    };
    maxScale?: EarthquakeScale;
    domesticTsunami?: TsunamiStatus;
    foreignTsunami?: TsunamiStatus;
  };
}

/**
 * Tsunami information
 */
export interface JMATsunami extends BasicData {
  code: 552;
  issue: {
    source?: string;
    time: string;
    type: 'Focus' | 'Destination' | 'Other';
    correct?: 'None' | 'Unknown' | 'Destination';
  };
  tsunami: {
    time: string;
    info: {
      type: TsunamiStatus;
      areas: {
        name: string;
        immediate: boolean;
        height?: string;
      }[];
    };
  };
}
