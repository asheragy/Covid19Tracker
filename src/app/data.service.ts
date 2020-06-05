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

    const positiveWeek = json.slice(7).map((item, index) => {
      return item.positive - json[index].positive;
    });

    const positiveDay = positiveWeek.map((item) => Math.round(item / 7));

    const testsWeek = json
      .slice(7)
      .map(
        (item, index) => item.totalTestResults - json[index].totalTestResults
      );

    const normalizedWeek = positiveWeek.map((cases, index) => {
      var tests = testsWeek[index];
      var percent = 1 + cases / tests;
      return cases * percent;
    });

    const normalizedDay = normalizedWeek.map((item) => Math.round(item / 7));

    var deaths = json.map((item, index) => {
      if (index >= 7) {
        var diff = json[index].death - json[index - 7].death;

        // Daily average
        return Math.round(diff / 7);
      }

      return 0;
    });

    const active = json.map((item, index) => {
      if (index >= 14) {
        var diff = json[index].positive - json[index - 14].positive;

        return diff;
      }

      return 0;
    });

    const series = new Series();

    series.dates = json.map((x) => x.date.toString()).slice(7);
    series.positive = positiveDay;
    series.positiveNormalized = normalizedDay;
    series.deaths = deaths.slice(7);
    series.active = active;

    return series;
  }
}
