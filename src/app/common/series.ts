export class Series {
  positive: number[] = [];
  positiveNormalized: number[] = [];
  deaths: number[] = [];
  active: number[] = [];
  dates: Date[] = [];
}

export class SeriesEntry {
  date: Date;
  positive: number;
  death: number;
  totalTestResults: number;
}
