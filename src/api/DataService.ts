import { Series, SeriesEntry } from "./dataClasses";
//import allStateData from "../daily.json";

/*
const uppperStates = [
  "nj",
  "ny",
  "ma",
  "ct",
  "la",
  "ms",
  "ri",
  "nd",
  "il",
  "dc",
  "sd",
  "mi",
  "az",
  "ga",
  "fl",
];
const middleStates = [
  "sc",
  "in",
  "ar",
  "pa",
  "de",
  "md",
  "tx",
  "al",
  "ia",
  "nm",
  "nv",
  "tn",
  "mo",
  "mn",
  "mt",
  "wi",
  "oh",
];
const lowerStates = [
  "co",
  "ks",
  "nc",
  "id",
  "ca",
  "ne",
  "va",
  "ok",
  "ky",
  "nh",
  "wv",
  "wa",
  "wy",
  "ut",
  "or",
  "hi",

  "ak",
  "me",
  "vt",
];
*/

export class DataService {
  public async getSingleData(state: string): Promise<Array<SeriesEntry>> {
    var url =
      state == "us"
        ? "https://api.covidtracking.com/v1/us/daily.json"
        : `https://api.covidtracking.com/v1/states/${state.toLowerCase()}/daily.json`;

    console.log(url);

    var data = await fetch(url);
    var jsonData = await data.json();
    var arrayData = Array<Array<SeriesEntry>>(jsonData)[0].reverse();

    return arrayData;
  }

  /*
  public async getMergedData(states: string[]): Promise<Array<SeriesEntry>> {
    var filteredData = allStateData as Array<any>;
    filteredData = filteredData.filter((x) => String(x.date) > "20200316");

    var mergedData = filteredData.filter(
      (x) => x.state.toLowerCase() == states[0]
    );

    states.forEach((state, index) => {
      if (index != 0) {
        var stateData = filteredData.filter(
          (x) => x.state.toLowerCase() == state
        );

        //console.log(stateData);

        stateData.forEach((data, index) => {
          mergedData[index].positive += data.positive;
          mergedData[index].death += data.death;
          mergedData[index].totalTestResults += data.totalTestResults;
          mergedData[index].totalTestsViral += data.totalTestsViral;
        });
      }
    });

    return mergedData.reverse();
  }
  */

  public async getSeries(state: string): Promise<Series> {
    //if (state == "upper")
    //  var arrayData = await this.getMergedData(uppperStates);
    //else if (state == "middle")
    //  var arrayData = await this.getMergedData(middleStates);
    //else if (state == "lower")
    //  var arrayData = await this.getMergedData(lowerStates);
    //else
    var arrayData = await this.getSingleData(state);

    console.log(`Got ${arrayData.length} entries`);
    var firstValidEntry = arrayData.findIndex((x) => x.positive >= 10);

    // TODO rename json to something else
    const json = arrayData.slice(firstValidEntry);

    const positiveWeek = json.slice(7).map((item, index) => {
      return item.positive - json[index].positive;
    });

    var positiveDay = positiveWeek.map((item) => Math.round(item / 7));

    const testsWeek = json.slice(7).map((item, index) => {
      var t = item.totalTestResults - json[index].totalTestResults;
      if (t < 0) t = item.totalTestsViral - json[index].totalTestsViral;
      return t;
    });

    const percentPositive = positiveWeek.map((cases, index) => {
      var tests = testsWeek[index];
      var percent = cases / tests;
      return Math.min(percent, 0.5); // Not useful over 50%
    });

    const normalizedWeek = positiveWeek.map((actualCases, index) => {
      //var percentDiff = (percentPositive[index] - 0.03) / 0.03;
      //percentDiff *= 0.33;
      var percentDiff = percentPositive[index];
      percentDiff *= percentDiff * 2;

      return actualCases * percentDiff + actualCases;
    });

    const normalizedDay = normalizedWeek.map((item) => Math.round(item / 7));

    const deathsWeek = json
      .slice(7)
      .map((item, index) => item.death - json[index].death);
    const deathsDay = deathsWeek.map((x) => Math.round((10 * x) / 7) / 10);

    const active = json
      .map((item, index) => {
        if (index >= 14) {
          var diff = json[index].positive - json[index - 14].positive;

          return diff;
        }

        return item.positive;
      })
      .slice(7);

    const series = new Series();

    series.dates = json
      .map((x) => {
        var d = x.date.toString();
        var dateStr =
          d.substr(0, 4) + "-" + d.substr(4, 2) + "-" + d.substr(6, 2);
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

    //console.log(series);
    return series;
  }
}

export default DataService;
