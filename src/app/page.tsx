'use client';

import Chart from "./components/Chart";
import ChartForm from "./components/ChartForm";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";
import { IChartConfig } from "./types/IChartConfig";
import ChartPreview from "./components/ChartPreview";


export default function Home() {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showChartPreview, setShowChartPreview] = useState<boolean>(true);
  const [showChartForm, setShowChartForm] = useState<boolean>(true);
  const [chartConfig, setChartConfig] = useState<IChartConfig>({
    symbol: '', 
    chartType: 'line', 
    duration: 50,
    height: 400,
    width: 800,
    lineColor: '',
    lineWeight: 2,
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
      {showChartPreview && <ChartPreview chartConfig={chartConfig} />}
      {showChart && <Chart chartConfig={chartConfig} />}
      {showChartForm && <ChartForm onConfigChange={handleConfigChange} />}
    </>
  );
}
