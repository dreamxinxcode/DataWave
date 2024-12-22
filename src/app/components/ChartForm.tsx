import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import { useEffect, useState } from "react";
import { IChartType } from "../types/IChartType";


export const chartTypes: IChartType[] = [
    { key: "line", label: "Line" },
    { key: "candle", label: "Candlestick" },
];

export default function ChartForm({ onConfigChange }) {
    const [symbol, setSymbol] = useState<string>("PLTR");
    const [chartType, setChartType] = useState<string>(chartTypes[0].key); // Default to the first chart type
    const [duration, setDuration] = useState<number>(50);
    const [height, setHeight] = useState<number>(400);
    const [width, setWidth] = useState<number>(800);
    const [lineColor, setLineColor] = useState<string>("#8eeafd");
    const [lineWeight, setLineWeight] = useState<number>(2);
    const [bgColor, setBgColor] = useState<string>("#212436");
    const [axisLabelColor, setAxisLabelColor] = useState<string>("#d4dff8");
    const [axisLineColor, setAxisLineColor] = useState<string>("#8a93c2");
    const [axisTickColor, setAxisTickColor] = useState<string>("#8a93c2");
    const [logoURL, setLogoURL] = useState<string>("");

    useEffect(() => {
        onConfigChange({
            symbol, 
            chartType, 
            duration,
            height,
            width,
            lineColor,
            lineWeight,
            bgColor,
            axisLabelColor,
            axisLineColor,
            axisTickColor,
            logoURL,
        });
    }, [         
        symbol, 
        chartType, 
        duration,
        height,
        width,
        lineColor,
        lineWeight,
        bgColor,
        axisLabelColor,
        axisLineColor,
        axisTickColor,
        logoURL,
    ]);

    const handleSubmit = () => {
        onConfigChange({
            symbol, 
            chartType, 
            duration,
            height,
            width,
            lineColor,
            lineWeight,
            bgColor,
            axisLabelColor,
            axisLineColor,
            axisTickColor,
            logoURL,
        });
    };

    return (
        <div className="flex p-6 justify-center items-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white shadow-md rounded-lg mx-24 w-full">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Chart Configuration
                </h2>
                <div className="space-y-6">
                    <Input
                        value={symbol}
                        isRequired
                        label="Symbol"
                        type="text"
                        placeholder="Enter a symbol"
                        onChange={(e) => setSymbol(e.target.value)}
                    />
                    <Input
                        value={lineColor}
                        isRequired
                        label="Line Color"
                        type="text"
                        placeholder="Enter a line color"
                        onChange={(e) => setLineColor(e.target.value)}
                    />
                    <Input
                        value={bgColor}
                        isRequired
                        label="Background Color"
                        type="text"
                        placeholder="Enter a background color"
                        onChange={(e) => setBgColor(e.target.value)}
                    />
                    <Input
                        value={axisLabelColor}
                        isRequired
                        label="Axis Label Color"
                        type="text"
                        placeholder="Enter an axis label color"
                        onChange={(e) => setAxisLabelColor(e.target.value)}
                    />
                    <Input
                        value={axisLineColor}
                        isRequired
                        label="Axis Line Color"
                        type="text"
                        placeholder="Enter an axis line color"
                        onChange={(e) => setAxisLineColor(e.target.value)}
                    />
                    <Input
                        value={axisTickColor}
                        isRequired
                        label="Axis Tick Color"
                        type="text"
                        placeholder="Enter an axis tick color"
                        onChange={(e) => setAxisTickColor(e.target.value)}
                    />
                    <Input
                        value={logoURL}
                        isRequired
                        label="Logo URL"
                        type="text"
                        placeholder="Enter an logo URL"
                        onChange={(e) => setLogoURL(e.target.value)}
                    />
                    <Select
                        value={chartType} // Bind to the current `chartType` key
                        className="w-full"
                        label="Select a chart type"
                        onChange={(e) => setChartType(e.target.value)} // Directly set the selected key
                    >
                        {chartTypes.map((chartType) => (
                            <SelectItem key={chartType.key} value={chartType.key}>
                                {chartType.label}
                            </SelectItem>
                        ))}
                    </Select>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Line Weight ({lineWeight})
                        </label>
                        <Slider
                            className="w-full"
                            defaultValue={2}
                            maxValue={120}
                            minValue={1}
                            step={1}
                            value={lineWeight}
                            onChange={(value: number) => setLineWeight(value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration ({duration} seconds)
                        </label>
                        <Slider
                            className="w-full"
                            defaultValue={50}
                            maxValue={120}
                            minValue={0}
                            step={1}
                            value={duration}
                            onChange={(value: number) => setDuration(value)}
                        />
                    </div>
                    <Button onPress={handleSubmit} color="primary" className="w-full">
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
