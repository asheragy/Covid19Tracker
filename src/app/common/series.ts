export class Series {
  positive: number[] = [];
  deaths: number[] = [];
  dates: string[] = [];
}

export class SeriesEntry {
  date: Date;
  positive: number;
  death: number;
  totalTestResults: number;
}
