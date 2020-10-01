import React, { useEffect } from "react";
import { Chart as ChartJS } from "chart.js";
import { DataSet } from "../api/dataClasses";
import { Line } from "react-chartjs-2";

interface ChartProps {
  dates: string[];
  dataSets: DataSet[];
}

function Chart(props: ChartProps) {
  const chartRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  const chartData = {
    labels: props.dates,
    datasets: props.dataSets.map((dataSet) => ({
      fill: false,
      label: dataSet.label,
      data: dataSet.data,
      pointBackgroundColor: dataSet.color,
      pointBorderColor: dataSet.color,
      backgroundColor: dataSet.color,
      borderColor: dataSet.color,
      borderWidth: 2,
      pointRadius: 2,
    })),
  };

  const options: Chart.ChartOptions = {
    maintainAspectRatio: false,
  };

  return <Line data={chartData} options={options} height={400} />;
}

export default Chart;
