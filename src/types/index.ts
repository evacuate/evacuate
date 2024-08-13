export interface BasicData {
  id: string;
  code: number;
  time: string;
}

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
    maxScale?: 10 | 20 | 30 | 40 | 45 | 50 | 55 | 60 | 70 | -1;
    domesticTsunami?:
      | 'None'
      | 'Unknown'
      | 'Checking'
      | 'NonEffective'
      | 'Watch'
      | 'Warning';
    foreignTsunami?:
      | 'None'
      | 'Unknown'
      | 'Checking'
      | 'NonEffectiveNearby'
      | 'WarningNearby'
      | 'WarningPacific'
      | 'WarningPacificWide'
      | 'WarningIndian'
      | 'WarningIndianWide'
      | 'Potential';
  };
  points: Array<{
    pref: string;
    addr: string;
    isArea: boolean;
    scale: 10 | 20 | 30 | 40 | 45 | 46 | 50 | 55 | 60 | 70;
  }>;
  comments?: {
    freeFormComment: string;
  };
}

export type JMAQuakes = JMAQuake[];

export interface JMATsunami extends BasicData {
  code: 552;
  cancelled: boolean;
  issue: {
    source: string;
    time: string;
    type: 'Focus';
  };
  areas: Array<{
    grade?: 'MajorWarning' | 'Warning' | 'Watch' | 'Unknown';
    immediate?: boolean;
    name?: string;
    firstHeight?: {
      arrivalTime?: string;
      condition?:
        | 'ただちに津波来襲と予測'
        | '津波到達中と推測'
        | '第１波の到達を確認';
    };
    maxHeight?: {
      description?:
        | '巨大'
        | '高い'
        | '１０ｍ超'
        | '１０ｍ'
        | '５ｍ'
        | '３ｍ'
        | '１ｍ'
        | '０．２ｍ未満';
      value?: number;
    };
  }>;
}

export type JMATsunamis = JMATsunami[];
