export class Series {
  positive: number[] = [];
  positiveNormalized: number[] = [];
  deaths: number[] = [];
  active: number[] = [];
  dates: string[] = [];
}

export class SeriesEntry {
  date: Date;
  positive: number;
  death: number;
  totalTestResults: number;
}
