import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BarChart } from "lucide-react";

function EmissionsPerTon() {
  const [coalMined, setCoalMined] = useState("");
  const [emissionsData, setEmissionsData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("day");
  const [chartData, setChartData] = useState(null);

  const fetchData = async (range) => {
    try {
      const today = new Date();
      let startDate;
      if (range === "week") {
        startDate = new Date(today.setDate(today.getDate() - 7));
      } else if (range === "month") {
        startDate = new Date(today.setMonth(today.getMonth() - 1));
      } else if (range === "year") {
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      } else {
        startDate = new Date();
      }
      startDate.setHours(0, 0, 0, 0);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = new Date().toISOString().split("T")[0];

      const response = await axios.get(
        `http://localhost:5000/api/data/${formattedStartDate}/${formattedEndDate}`
      );

      const { electricity, fuelCombustion, shipping, explosion } = response.data;

      const totalCO2 = 
        electricity.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0) +
        fuelCombustion.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0) +
        shipping.reduce((sum, entry) => sum + (parseFloat(entry.result.carbonEmissions.kilograms) || 0), 0) +
        explosion.reduce((sum, entry) => sum + (parseFloat(entry.emissions.CO2) || 0), 0);

      setEmissionsData({
        totalCO2,
        electricity: electricity.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
        fuelCombustion: fuelCombustion.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
        shipping: shipping.reduce((sum, entry) => sum + (parseFloat(entry.result.carbonEmissions.kilograms) || 0), 0),
        explosion: explosion.reduce((sum, entry) => sum + (parseFloat(entry.emissions.CO2) || 0), 0),
        range,
      });

      setChartData({
        labels: ["Electricity", "Fuel Combustion", "Shipping", "Explosion"],
        datasets: [
          {
            label: `Emissions per Ton (Range: ${range})`,
            data: [
              electricity.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
              fuelCombustion.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
              shipping.reduce((sum, entry) => sum + (parseFloat(entry.result.carbonEmissions.kilograms) || 0), 0),
              explosion.reduce((sum, entry) => sum + (parseFloat(entry.emissions.CO2) || 0), 0),
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching emissions data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coalMined) return alert("Please enter the coal mined in tons.");
    fetchData(selectedRange);
  };

  const getSuggestions = () => {
    if (!emissionsData.totalCO2) return "No data available to provide suggestions.";
    if (emissionsData.totalCO2 / coalMined > 10) {
      return "Consider optimizing fuel combustion processes and reducing shipping emissions.";
    }
    return "Your emissions per ton are within acceptable limits. Keep up the sustainable practices!";
  };

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-xl w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart className="h-6 w-6 text-green-500" />
          <CardTitle className="text-2xl font-bold text-white">Emissions Per Ton of Coal Mined</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Calculate and visualize emissions based on coal production
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            type="number"
            placeholder="Enter coal mined (tons)"
            value={coalMined}
            onChange={(e) => setCoalMined(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white p-2"
          />
          
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-full sm:w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Calculate
          </Button>
        </form>

        {emissionsData.totalCO2 && coalMined && (
          <>
            <Separator className="bg-gray-700" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-700 border-gray-600 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">Total Emissions: <span className="font-bold">{emissionsData.totalCO2.toFixed(2)} tCO2</span></p>
                    <p className="font-medium">Emissions per Ton: <span className="font-bold">{(emissionsData.totalCO2 / parseFloat(coalMined)).toFixed(2)} tCO2/ton</span></p>
                  </div>
                  
                  <Separator className="bg-gray-600" />
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Breakdown by Source:</p>
                    <ul className="space-y-1 pl-1">
                      <li className="flex justify-between">
                        <span>Electricity:</span>
                        <span className="font-semibold">{emissionsData.electricity.toFixed(2)} tCO2</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Fuel Combustion:</span>
                        <span className="font-semibold">{emissionsData.fuelCombustion.toFixed(2)} tCO2</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-semibold">{emissionsData.shipping.toFixed(2)} tCO2</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Explosion:</span>
                        <span className="font-semibold">{emissionsData.explosion.toFixed(2)} tCO2</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{getSuggestions()}</p>
                </CardContent>
              </Card>
            </div>

            {chartData && (
              <Card className="bg-gray-700 border-gray-600 shadow-md p-4">
                <div className="h-[300px]">
                  <Line 
                    data={chartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        x: { ticks: { color: 'white' } },
                        y: { ticks: { color: 'white' } }
                      },
                      plugins: {
                        legend: { labels: { color: 'white' } }
                      }
                    }} 
                    height={300} 
                    datasetIdKey="id"
                    datasets={[
                      {
                        borderColor: 'rgba(75, 192, 192, 1)', // Vibrant turquoise
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                        borderWidth: 3,
                      },
                      {
                        borderColor: 'rgba(255, 99, 132, 1)', // Vibrant red
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                        borderWidth: 3,
                      }
                    ]}
                  />
                </div>
              </Card>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default EmissionsPerTon;
