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
        ? 'https://api.covidtracking.com/v1/us/daily.json'
        : `https://api.covidtracking.com/v1/states/${state.toLowerCase()}/daily.json`;

    console.log(url);
    var json = (
      await this.httpClient.get<Array<SeriesEntry>>(url).toPromise()
    ).reverse();

    console.log(`Got ${json.length} entries`);
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

    const percentPositive = positiveWeek.map((cases, index) => {
      var tests = testsWeek[index];
      var percent = cases / tests;
      return Math.min(percent, 0.25); // Not useful over 25%
    });

    const normalizedWeek = positiveWeek.map((actualCases, index) => {
      var percentDiff = (percentPositive[index] - 0.03) / 0.03;
      percentDiff *= 0.33;

      return actualCases * percentDiff + actualCases;
    });

    const normalizedDay = normalizedWeek.map((item) => Math.round(item / 7));

    const deathsWeek = json.slice(7).map((item, index) => {
      var n = item.death;
      if (n >= 118031)
        // Correction for NJ on 6/25
        n -= 1854;
      return n - json[index].death;
    });

    const deathsDay = deathsWeek.map((x) => Math.round((10 * x) / 7) / 10);

    const active = json.map((item, index) => {
      if (index >= 14) {
        var diff = json[index].positive - json[index - 14].positive;

        return diff;
      }

      return 0;
    });

    const series = new Series();

    series.dates = json
      .map((x) => {
        var d = x.date.toString();
        var dateStr =
          d.substr(0, 4) + '-' + d.substr(4, 2) + '-' + d.substr(6, 2);
        return new Date(dateStr);
      })
      .slice(7);
    series.positive = positiveDay;
    series.positiveNormalized = normalizedDay;
    series.deaths = deathsDay;
    series.active = active;
    series.percentPositive = percentPositive.map(
      (x) => Math.round(x * 10000) / 100
    );

    series.percentChange = normalizedDay.map((x, index) => {
      if (index < 7) return 0;

      var percent = (x - normalizedDay[index - 7]) / normalizedDay[index - 7];
      if (percent > 1) return 100;

      return Math.round(percent * 10000) / 100;
    });

    return series;
  }
}
