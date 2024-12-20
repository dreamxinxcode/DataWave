"use client";

import { Input, Button } from "@nextui-org/react";
import { RangeCalendar } from "@nextui-org/calendar";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";

export const chartTypes = [
  { key: "line", label: "Line" },
  { key: "candle", label: "Candlestick" },
];

export default function ChartForm() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Chart Configuration
        </h2>
        <div className="space-y-6">
          <Input
            isRequired
            label="Symbol"
            type="text"
            placeholder="Enter a symbol"
          />
          <Select className="w-full" label="Select a chart type">
            {chartTypes.map((chartType) => (
              <SelectItem key={chartType.key}>{chartType.label}</SelectItem>
            ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Length (seconds)
            </label>
            <Slider
              className="w-full"
              defaultValue={50}
              maxValue={120}
              minValue={0}
              step={1}
            />
          </div>
          <Button color="primary" className="w-full">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
