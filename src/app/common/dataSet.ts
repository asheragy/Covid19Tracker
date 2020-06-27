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
