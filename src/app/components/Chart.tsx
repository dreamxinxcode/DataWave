"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

export default function Chart({
    symbol = 'PLTR',
    duration = 5,
    height = 400,
    width = 800,
    lineColor = '#8eeafd',
    xAxisLabelColor = '#8a93c2',
    yAxisLabelColor = '#8a93c2',
    axisLineColor = '#8a93c2',
    axisTickColor = '#8a93c2'
}) {
  const chartRef = useRef();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`
          );
        const data = response.data["Time Series (60min)"];

        const parsedData = Object.keys(data).map((date) => ({
            date: new Date(date),
            price: parseFloat(data[date]["4. close"]),
          }));
          
        const sortedData = parsedData.sort((a, b) => a.date - b.date);
          
        drawChart(sortedData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };
    const drawChart = (data) => {
        const svgWidth = width;
        const svgHeight = height;
        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;
      
        // Clear previous chart
        d3.select(chartRef.current).select("svg").remove();
      
        // Append SVG container with background color
        const svg = d3
          .select(chartRef.current)
          .append("svg")
          .attr("width", svgWidth)
          .attr("height", svgHeight)
          .style("background-color", "#212436"); // Set chart background color
      
        const g = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
      
        // Set scales
        const xScale = d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.date))
          .range([0, chartWidth]);
      
        const priceExtent = d3.extent(data, (d) => d.price);
      
        const yScale = d3
          .scaleLinear()
          .domain([priceExtent[0] - 5, priceExtent[1] + 5])
          .nice()
          .range([chartHeight, 0]);
      
        // Add axes with label colors
        g.append("g")
          .attr("transform", `translate(0,${chartHeight})`)
          .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")))
          .selectAll("text")
          .style("fill", xAxisLabelColor); // Set x-axis label color
      
        g.append("g")
          .call(d3.axisLeft(yScale))
          .selectAll("text")
          .style("fill", yAxisLabelColor); // Set y-axis label color
      
        // Customize axis lines and ticks
        g.selectAll(".domain")
          .attr("stroke", axisLineColor); // Set axis line color
      
        g.selectAll(".tick line")
          .attr("stroke", axisTickColor); // Set tick line color
      
        // Line generator
        const line = d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.price))
          .curve(d3.curveMonotoneX);
      
        // Append line path
        const dataPath = g
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", lineColor)
          .attr("stroke-width", 2)
          .attr("d", line);
      
        // Append moving price text
        const movingText = g
          .append("text")
          .attr("fill", "#8eeafd") // Set moving text color
          .attr("font-size", "12px")
          .style("opacity", 0);
      
        // Animation
        const totalLength = dataPath.node().getTotalLength();
      
        dataPath
          .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(duration * 1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .on("start", () => {
            movingText.style("opacity", 1);
          })
          .on("end", () => {
            movingText.style("opacity", 0);
          });
      
          const animatePrice = () => {
            const lengthInterpolator = d3.interpolate(0, totalLength);
          
            d3.timer((elapsed) => {
              const length = lengthInterpolator(elapsed / (duration * 1000));
          
              // Get point along the line
              const point = dataPath.node().getPointAtLength(length);
          
              // Update text position and value
              const closestIndex = Math.round(
                (length / totalLength) * (data.length - 1)
              );
          
              const price = data[closestIndex].price.toFixed(2);
          
              // Update text elements
              movingText
                .attr("x", point.x)
                .attr("y", point.y - 10)
                .text(null) // Clear previous content
                .append("tspan") // Add symbol on top
                .attr("x", point.x) // Keep aligned
                .attr("dy", "-0.5em") // Offset upwards
                .text(symbol)
                .append("tspan") // Add price below
                .attr("x", point.x) // Keep aligned
                .attr("dy", "1.5em") // Offset downwards
                .text(`$${price}`);
          
              if (elapsed >= (duration * 1000)) return true; // Stop the timer after
            });
          };          
      
        animatePrice();
      };
      

    fetchMarketData();
  }, [width, height, lineColor]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div ref={chartRef} />
    </div>
  );
}
