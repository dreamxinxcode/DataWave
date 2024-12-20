'use client';

import Chart from "./components/Chart";
import ChartForm from "./components/ChartForm";
import Nav from "./components/Nav";
import { useState } from "react";
import { IChartConfig } from "./types/IChartConfig";


export default function Home() {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showChartForm, setShowChartForm] = useState<boolean>(true);
  const [chartConfig, setChartConfig] = useState<IChartConfig>({
    symbol: '', 
    chartType: 'line', 
    duration: 50,
    height: 400,
    width: 800,
    lineColor: '',
    bgColor: '',
    axisLabelColor: '',
    axisLineColor: '',
    axisTickColor: '',
    logoURL: '',
  });

  const handleConfigChange = (newConfig: IChartConfig) => {
    setChartConfig((prev: IChartConfig) => ({ ...prev, ...newConfig }));
    setShowChartForm(false);
    setShowChart(true);
  };

  return (
    <>
      <Nav />
      {showChart && <Chart chartConfig={chartConfig} />}
      {showChartForm && <ChartForm onConfigChange={handleConfigChange} />}
    </>
  );
}
