export class Series {
  label: string = '';
  data: number[] = [];
  dates: string[] = [];
}

export class SeriesEntry {
  date: Date;
  positive: number;
  totalTestResults: number;
}
