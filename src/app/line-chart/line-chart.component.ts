import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, SingleLineLabel } from 'ng2-charts';
import { Series, SeriesEntry } from '../common/series';
import { DataService } from '../data.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  constructor(private dataService: DataService) {}

  @Input() series: Series;
  @Input() type: string;

  ngOnChanges() {
    switch (this.type) {
      case 'positive': {
        this.chartData = [
          {
            label: 'Positive / Day',
            data: this.series.positive,
          },
          {
            label: 'Normalized',
            data: this.series.positiveNormalized,
          },
        ];
        break;
      }
      case 'deaths': {
        this.chartData = [{ data: this.series.deaths, label: 'Deaths / Day' }];
        break;
      }
      case 'active': {
        this.chartData = [{ data: this.series.active, label: 'Active cases' }];
      }
    }

    this.chartLabels = this.series.dates.map(
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
  public chartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
  ];

  ngOnInit() {}
}
