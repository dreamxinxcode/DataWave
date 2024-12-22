"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { IChartConfig } from "../types/IChartConfig";


interface IChartProps {
  chartConfig: IChartConfig;
};

const res = {
  "Meta Data": {
      "1. Information": "Intraday (60min) open, high, low, close prices and volume",
      "2. Symbol": "TSLA",
      "3. Last Refreshed": "2024-12-20 20:00:00",
      "4. Interval": "60min",
      "5. Output Size": "Compact",
      "6. Time Zone": "US/Eastern"
  },
  "Time Series (60min)": {
      "2024-12-20 20:00:00": {
          "1. open": "522.67",
          "2. high": "549.78",
          "3. low": "518.34",
          "4. close": "540.89",
          "5. volume": "1234567"
      },
      "2024-12-20 19:00:00": {
          "1. open": "501.32",
          "2. high": "524.67",
          "3. low": "497.23",
          "4. close": "522.67",
          "5. volume": "876543"
      },
      "2024-12-20 18:00:00": {
          "1. open": "480.45",
          "2. high": "510.78",
          "3. low": "475.34",
          "4. close": "501.32",
          "5. volume": "765432"
      },
      "2024-12-20 17:00:00": {
          "1. open": "493.12",
          "2. high": "502.34",
          "3. low": "470.45",
          "4. close": "480.45",
          "5. volume": "654321"
      },
      "2024-12-20 16:00:00": {
          "1. open": "465.78",
          "2. high": "490.12",
          "3. low": "452.67",
          "4. close": "493.12",
          "5. volume": "543210"
      },
      "2024-12-20 15:00:00": {
          "1. open": "450.34",
          "2. high": "465.78",
          "3. low": "430.12",
          "4. close": "465.78",
          "5. volume": "432109"
      },
      "2024-12-20 14:00:00": {
          "1. open": "530.12",
          "2. high": "540.45",
          "3. low": "490.34",
          "4. close": "450.34",
          "5. volume": "321098"
      },
      "2024-12-20 13:00:00": {
          "1. open": "510.67",
          "2. high": "530.12",
          "3. low": "500.12",
          "4. close": "530.12",
          "5. volume": "210987"
      },
      "2024-12-20 12:00:00": {
          "1. open": "540.34",
          "2. high": "550.45",
          "3. low": "505.78",
          "4. close": "510.67",
          "5. volume": "109876"
      },
      "2024-12-20 11:00:00": {
          "1. open": "522.45",
          "2. high": "540.78",
          "3. low": "510.23",
          "4. close": "540.34",
          "5. volume": "98765"
      },
      "2024-12-20 10:00:00": {
          "1. open": "490.12",
          "2. high": "525.45",
          "3. low": "480.67",
          "4. close": "522.45",
          "5. volume": "87654"
      }
  }
};


export default function Chart({ chartConfig }: IChartProps) {
  const chartRef = useRef();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
        // const response = await axios.get(
        //     `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${chartConfig.symbol}&interval=60min&apikey=${API_KEY}`
        //   );
        // const data = response.data["Time Series (60min)"];
        const data = res["Time Series (60min)"];

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
        const svgWidth = chartConfig.width;
        const svgHeight = chartConfig.height;
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
          .style("background-color", chartConfig.bgColor); // Set chart background color
      
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
          .style("fill", chartConfig.axisLabelColor); // Set x-axis label color
      
        g.append("g")
          .call(d3.axisLeft(yScale))
          .selectAll("text")
          .style("fill", chartConfig.axisLabelColor); // Set y-axis label color
      
        // Customize axis lines and ticks
        g.selectAll(".domain")
          .attr("stroke", chartConfig.axisLineColor); // Set axis line color
      
        g.selectAll(".tick line")
          .attr("stroke", chartConfig.axisTickColor); // Set tick line color
      
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
          .attr("stroke", chartConfig.lineColor)
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
          .duration(chartConfig.duration * 1000)
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
              const length = lengthInterpolator(elapsed / (chartConfig.duration * 1000));
          
              // Get point along the line
              const point = dataPath.node().getPointAtLength(length);
          
              // Calculate the closest data index
              const progress = length / totalLength;
              const closestIndex = Math.min(
                data.length - 1,
                Math.round(progress * (data.length - 1))
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
                .text(chartConfig.symbol)
                .append("tspan") // Add price below
                .attr("x", point.x) // Keep aligned
                .attr("dy", "1.5em") // Offset downwards
                .text(`$${price}`);
          
              if (elapsed >= chartConfig.duration * 1000) return true; // Stop the timer after animation duration
            });
          };          

          if (chartConfig.logoURL) {
            g.append("image")
              .attr("href", chartConfig.logoURL)
              .attr("x", chartWidth - 100) // Adjust for right positioning
              .attr("y", -margin.top) // Adjust for top positioning
              .attr("width", 100)
              .attr("height", 100)
              .attr("preserveAspectRatio", "xMidYMid meet"); // Ensure proper scaling
          }          

        animatePrice();
      };
      

    fetchMarketData();
  }, [chartConfig.width, chartConfig.height, chartConfig.lineColor]);

  return (
    <div style={{backgroundColor: chartConfig.bgColor}} className="flex justify-center items-center min-h-screen bg-gray-50">
        <div ref={chartRef} />
    </div>
  );
}
