"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { IChartConfig } from "../types/IChartConfig";
import tslaRes from '../data/TSLA.json';
import pltrRes from '../data/PLTR.json';

interface IChartProps {
  chartConfig: IChartConfig;
};
export default function ChartPreview({ chartConfig }: IChartProps) {
  const chartRef = useRef();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = res["Time Series (60min)"];
        const parsedData = Object.keys(data).map((date) => ({
          date: new Date(date),
          price: parseFloat(data[date]["4. close"]),
        }));

        // Filter data to start from halfway through
        const midpoint = Math.floor(parsedData.length / 2);
        const filteredData = parsedData.slice(midpoint);

        const sortedData = filteredData.sort((a, b) => a.date - b.date);

        drawChart(sortedData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    const drawChart = (data) => {
      const svgWidth = chartConfig.width || 800; // Default width set to 800
      const svgHeight = chartConfig.height || 500; // Default height set to 500
      const margin = { top: 20, right: 30, bottom: 30, left: 50 };
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight - margin.top - margin.bottom;

      // Clear previous chart
      d3.select(chartRef.current).select("svg").remove();

      // Append SVG container
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("background-color", chartConfig.bgColor);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Set scales
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, chartWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.price), d3.max(data, (d) => d.price)])
        .range([chartHeight, 0]);

      // Add axes
      g.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M")))
        .selectAll("text")
        .style("fill", chartConfig.axisLabelColor);

      g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("fill", chartConfig.axisLabelColor);

      // Customize axis lines and ticks
      g.selectAll(".domain")
        .attr("stroke", chartConfig.axisLineColor);

      g.selectAll(".tick line")
        .attr("stroke", chartConfig.axisTickColor);

      // Line generator
      const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.price))
        .curve(d3.curveMonotoneX);

      // Append line path
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartConfig.lineColor)
        .attr("stroke-width", chartConfig.lineWeight)
        .attr("d", line);
    };

    fetchMarketData();
  }, [chartConfig]);

  return (
    <div
      style={{ backgroundColor: chartConfig.bgColor }}
      className="flex justify-center items-center min-h-screen"
    >
      <div ref={chartRef} />
    </div>
  );
}
