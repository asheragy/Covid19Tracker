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

function roundDecimal(value: number) {
  return Math.round((value * 10) / 7) / 10;
}

function parseDate(date: Date) {
  var d = date.toString();
  var dateStr = d.substr(0, 4) + "-" + d.substr(4, 2) + "-" + d.substr(6, 2);
  return new Date(dateStr);
}

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

    // Filter to weekly data
    var modValue = (arrayData.length - 1) % 7;
    arrayData = arrayData.filter((_, index) => index % 7 == modValue);

    // Start series when > 100 cases
    var firstValidEntry = arrayData.findIndex((x) => x.positive >= 100);

    // TODO rename json to something else
    const json = arrayData.slice(firstValidEntry);

    const series = new Series();

    const positiveWeek = json.slice(1).map((item, index) => item.positive - json[index].positive);
    series.positive = positiveWeek.map((item) => Math.round(item / 7));

    const testsWeek = json.slice(1).map((item, index) => {
      var t = item.totalTestResults - json[index].totalTestResults;
      if (t < 0) t = item.totalTestsViral - json[index].totalTestsViral;
      return t;
    });

    const maxPercentPos = 0.5; // Not useful when larger
    const percentPositive = positiveWeek.map((cases, index) => Math.min(cases / testsWeek[index], maxPercentPos));

    const normalized = positiveWeek
      .map((actualCases, index) => {
        var percentDiff = percentPositive[index];
        percentDiff *= percentDiff * 2;
        return actualCases * percentDiff + actualCases;
      })
      .map((item) => Math.round(item / 7));

    series.deaths = json.slice(1).map((item, index) => roundDecimal(item.death - json[index].death));

    series.active = json
      .map((item, index) => {
        if (index >= 2) {
          var diff = json[index].positive - json[index - 2].positive;
          return diff;
        }

        return item.positive;
      })
      .slice(1);

    series.dates = json.map((x) => parseDate(x.date)).slice(1);
    series.positiveNormalized = normalized;
    series.percentPositive = percentPositive.map((x) => Math.round(x * 10000) / 100);
    series.percentChange = normalized.map((x, index) => {
      const weeks = 3;
      if (index < weeks) return 0;

      var percent = (x - normalized[index - weeks]) / normalized[index - weeks];
      if (percent > 2) percent = 2;
      return Math.round(percent * 10000) / 100;
    });

    //console.log(series);
    return series;
  }
}

export default DataService;
