import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, SingleLineLabel } from 'ng2-charts';
import { Series, SeriesEntry } from '../common/series';
import { DataSet } from '../common/dataSet';
import { DataService } from '../data.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  constructor(private dataService: DataService) {}

  @Input() dataSets: DataSet[];
  @Input() dates: Date[] = [];

  private getDataSet(
    label: string,
    data: number[],
    color: string
  ): ChartDataSets {
    return {
      fill: false,
      label: label,
      data: data,
      pointBackgroundColor: color,
      pointBorderColor: color,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      pointRadius: 2,
    };
  }

  ngOnChanges() {
    this.chartData = this.dataSets.map((x) =>
      this.getDataSet(x.label, x.data, x.color)
    );

    this.chartLabels = this.dates.map(
      (x) => x.getMonth() + 1 + '/' + (x.getDate() + 1)
    );
  }

  public chartData: ChartDataSets[] = [{}];
  public chartLabels: Label[] = [];

  // From https://valor-software.com/ng2-charts/#/LineChart
  public chartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
      ],
    },
    maintainAspectRatio: false,
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
          },
        },
      ],
    },
  };

  ngOnInit() {}
}

class Colors {
  static Blue = 'rgba(34,132,245,1.0)';
  static LightBlue = 'rgba(54,162,235,1.0)';
  static Red = 'rgb(255,99,132)';
  static Green = 'rgb(75, 192,192)';
  static Yellow = 'rgb(250, 244, 82)';
}
