import { Component, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { Series } from './common/series';
import { DataSet } from './common/dataSet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.update();
  }

  dates: Date[] = [];
  dataSetsCases: DataSet[];
  dataSetsDeaths: DataSet[];
  dataSetsActive: DataSet[];
  dataSetsPercentPositive: DataSet[];
  dataSetsPercentChange: DataSet[];

  title = 'Covid19Tracker';

  listItems = [
    { key: 'us', value: 'United States' },
    { key: 'AL', value: 'Alabama' },
    { key: 'AK', value: 'Alaska' },
    { key: 'AZ', value: 'Arizona' },
    { key: 'AR', value: 'Arkansas' },
    { key: 'CA', value: 'California' },
    { key: 'CO', value: 'Colorado' },
    { key: 'CT', value: 'Connecticut' },
    { key: 'DE', value: 'Delaware' },
    { key: 'FL', value: 'Florida' },
    { key: 'GA', value: 'Georgia' },
    { key: 'HI', value: 'Hawaii' },
    { key: 'ID', value: 'Idaho' },
    { key: 'IL', value: 'Illinois' },
    { key: 'IN', value: 'Indiana' },
    { key: 'IA', value: 'Iowa' },
    { key: 'KS', value: 'Kansas' },
    { key: 'KY', value: 'Kentucky' },
    { key: 'LA', value: 'Louisiana' },
    { key: 'ME', value: 'Maine' },
    { key: 'MD', value: 'Maryland' },
    { key: 'MA', value: 'Massachusetts' },
    { key: 'MI', value: 'Michigan' },
    { key: 'MN', value: 'Minnesota' },
    { key: 'MS', value: 'Mississippi' },
    { key: 'MO', value: 'Missouri' },
    { key: 'MT', value: 'Montana' },
    { key: 'NE', value: 'Nebraska' },
    { key: 'NV', value: 'Nevada' },
    { key: 'NH', value: 'New Hampshire' },
    { key: 'NJ', value: 'New Jersey' },
    { key: 'NM', value: 'New Mexico' },
    { key: 'NY', value: 'New York' },
    { key: 'NC', value: 'North Carolina' },
    { key: 'ND', value: 'North Dakota' },
    { key: 'OH', value: 'Ohio' },
    { key: 'OK', value: 'Oklahoma' },
    { key: 'OR', value: 'Oregon' },
    { key: 'PA', value: 'Pennsylvania' },
    { key: 'RI', value: 'Rhode Island' },
    { key: 'SC', value: 'South Carolina' },
    { key: 'SD', value: 'South Dakota' },
    { key: 'TN', value: 'Tennessee' },
    { key: 'TX', value: 'Texas' },
    { key: 'UT', value: 'Utah' },
    { key: 'VT', value: 'Vermont' },
    { key: 'VA', value: 'Virginia' },
    { key: 'WA', value: 'Washington' },
    { key: 'WV', value: 'West Virginia' },
    { key: 'WI', value: 'Wisconsin' },
    { key: 'WY', value: 'Wyoming' },
  ];

  private _selectedItem = this.listItems[0];

  set selectedItem(val: { key: string; value: string }) {
    this._selectedItem = val;
    this.update();
  }

  get selectedItem(): { key: string; value: string } {
    return this._selectedItem;
  }

  async update() {
    var series = await this.dataService.getSeries(this.selectedItem.key);

    this.dates = series.dates;
    this.dataSetsCases = [
      new DataSet('Positive / Day', Colors.LightBlue, series.positive),
      new DataSet('Normalized', Colors.Blue, series.positiveNormalized),
    ];

    this.dataSetsDeaths = [
      new DataSet('Deaths / Day', Colors.Red, series.deaths),
    ];

    this.dataSetsActive = [
      new DataSet('Active cases', Colors.Green, series.active),
    ];

    this.dataSetsPercentPositive = [
      new DataSet('% Positive', Colors.Yellow, series.percentPositive),
    ];

    this.dataSetsPercentChange = [
      new DataSet('% Change', Colors.Orange, series.percentChange),
    ];
  }
}

class Colors {
  static Blue = 'rgba(34,132,245,1.0)';
  static LightBlue = 'rgba(54,162,235,1.0)';
  static Red = 'rgb(255,99,132)';
  static Green = 'rgb(75, 192,192)';
  static Yellow = 'rgb(250, 244, 82)';
  static Orange = 'rgb(255,159,64)';
}
