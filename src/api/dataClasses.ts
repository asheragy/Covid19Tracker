export class Series {
  positive: number[] = [];
  positiveNormalized: number[] = [];
  deaths: number[] = [];
  active: number[] = [];
  percentPositive: number[] = [];
  percentChange: number[] = [];
  dates: Date[] = [];
}

export class SeriesEntry {
  date: Date = new Date();
  positive: number = 0;
  death: number = 0;
  totalTestResults: number = 0;
  totalTestsViral: number = 0;
}

export class DataSet {
  constructor(label: string, color: string, data: number[]) {
    this.label = label;
    this.color = color;
    this.data = data;
  }
  color: string;
  data: number[];
  label: string;
}
