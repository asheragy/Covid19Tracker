import { Injectable } from '@angular/core';
import { Series, SeriesEntry } from './common/series';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  public async getSeries(state: string): Promise<Series> {
    var url =
      state == 'us'
        ? 'https://covidtracking.com/api/v1/us/daily.json'
        : `https://covidtracking.com/api/v1/states/${state}/daily.json`;

    console.log(url);
    var json = (
      await this.httpClient.get<Array<SeriesEntry>>(url).toPromise()
    ).reverse();

    var firstValidEntry = json.findIndex((x) => x.positive >= 10);
    json = json.slice(firstValidEntry);

    var values = json.map((item, index) => {
      if (index >= 7) {
        var cases = item.positive - json[index - 7].positive;
        var tests = item.totalTestResults - json[index - 7].totalTestResults;

        var percent = 1 + cases / tests;

        var result = Math.round((cases * percent) / 7); // Daily average
        return result;
      }

      return 0;
    });

    const series = new Series();

    series.label = 'Positive';
    series.dates = json.map((x) => x.date.toString()).slice(7);
    series.data = values.slice(7);

    return series;
  }
}
