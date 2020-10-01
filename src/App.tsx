import React, { useState } from "react";
import "./App.css";
import Chart from "./components/Chart";
import StatePicker from "./components/StatePicker";
import DataService from "./api/DataService";
import { DataSet } from "./api/dataClasses";
import { act } from "react-dom/test-utils";

const styles = {
  chart: "chart",
  large: "large",
  small: "small",
};

function App() {
  const [dates, setDates] = useState<string[]>([]);
  const [cases, setCases] = useState<DataSet[]>([]);
  const [deaths, setDeaths] = useState<DataSet[]>([]);
  const [active, setActive] = useState<DataSet[]>([]);
  const [percentPositive, setPercentPositive] = useState<DataSet[]>([]);
  const [percentChange, setPercentChange] = useState<DataSet[]>([]);

  const onStateChange = async (x: string) => {
    //console.log(x);
    var service = new DataService();
    var series = await service.getSeries(x);

    setDates(
      series.dates.map(
        (date) => date.getUTCMonth() + 1 + "/" + date.getUTCDate()
      )
    );
    setCases([
      new DataSet("Positive / Day", Colors.LightBlue, series.positive),
      new DataSet("Normalized", Colors.Blue, series.positiveNormalized),
    ]);

    setDeaths([new DataSet("Deaths / Day", Colors.Red, series.deaths)]);
    setActive([new DataSet("Active cases", Colors.Green, series.active)]);
    setPercentPositive([
      new DataSet("% Positive", Colors.Yellow, series.percentPositive),
    ]);
    setPercentChange([
      new DataSet("% Change", Colors.Orange, series.percentChange),
    ]);
  };

  // Load first time with data
  // TODO move to an onload event for the StatePicker when list is first filled
  onStateChange("us");

  return (
    <div>
      <StatePicker onStateChange={onStateChange} />
      <div className="chart">
        <div className="chart-row">
          <div className={`${styles.chart} ${styles.large}`}>
            <Chart dates={dates} dataSets={cases}></Chart>
          </div>

          <div className={`${styles.chart} ${styles.small}`}>
            <Chart dates={dates} dataSets={deaths}></Chart>
          </div>
        </div>

        <div className="chart-row">
          <div className={`${styles.chart} ${styles.small}`}>
            <Chart dates={dates} dataSets={active}></Chart>
          </div>

          <div className={`${styles.chart} ${styles.small}`}>
            <Chart dates={dates} dataSets={percentPositive}></Chart>
          </div>

          <div className={`${styles.chart} ${styles.small}`}>
            <Chart dates={dates} dataSets={percentChange}></Chart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

class Colors {
  static Blue = "rgba(34,132,245,1.0)";
  static LightBlue = "rgba(54,162,235,1.0)";
  static Red = "rgb(255,99,132)";
  static Green = "rgb(75, 192,192)";
  static Yellow = "rgb(250, 244, 82)";
  static Orange = "rgb(255,159,64)";
}
