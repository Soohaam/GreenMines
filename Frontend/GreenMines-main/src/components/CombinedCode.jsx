"use client"

import React, { useState } from "react"
import axios from "axios"
import CoalEmission from "./CoalEmission"
import MethaneMonitoring from "./MethaneLeaks"
import ChatAssistant from "./ChatAssistant"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const stateOptions = [
  "andhra pradesh",
  "chattisgarh",
  "jharkhand",
  "madhya pradesh",
  "maharashtra",
  "orissa",
  "west bengal",
]

/*[
 'andhra pradesh', 'arunachal pardesh', 'assam', 'bihar', 'chattisgarh',
  'delhi', 'goa', 'orissa', 'punjab', 'rajasthan',
  'tamil nadu', 'tripura', 'uttar pradesh', 'uttaranchal', 'west bengal',
  'gujarat', 'haryana', 'himachal pradesh', 'jammu and kashmir', 'jharkhand',
  'karnataka', 'kereala', 'madhya pradesh', 'maharashtra', 'manipur',
  'meghalaya', 'mizoram', 'nagaland'
];*/

function CombinedCode() {
  const [electricityData, setElectricityData] = useState({
    stateName: "",
    energyPerTime: "",
    responsibleArea: "",
    totalArea: "",
  })

  const [explosionData, setExplosionData] = useState({
    explosiveType: "",
    amount: "",
  })

  const [fuelData, setFuelData] = useState({
    fuel: "",
    volume: "",
  })

  const [shippingData, setShippingData] = useState({
    weight_Unit: "",
    weight_Value: "",
    distance_Unit: "",
    distance_Value: "",
    transport_Method: "",
  })

  const [electricityResult, setElectricityResult] = useState(null)
  const [explosionResult, setExplosionResult] = useState(null)
  const [fuelResult, setFuelResult] = useState(null)
  const [shippingResult, setShippingResult] = useState(null)
  const [error, setError] = useState(null)

  const handleElectricityChange = (e) => {
    setElectricityData({ ...electricityData, [e.target.name]: e.target.value })
  }

  const handleExplosionChange = (e) => {
    setExplosionData({ ...explosionData, [e.target.name]: e.target.value })
  }

  const handleFuelChange = (e) => {
    setFuelData({ ...fuelData, [e.target.name]: e.target.value })
  }

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value })
  }

  const fetchElectricityData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/electricity-consumption", {
        params: {
          stateName: electricityData.stateName,
          "values.EnergyperTime": electricityData.energyPerTime,
          "values.Responsiblearea": electricityData.responsibleArea,
          "values.Totalarea": electricityData.totalArea,
        },
      })
      setElectricityResult(response.data.result)
      setError(null)
    } catch (error) {
      console.error("Error fetching electricity data:", error)
      setError("Failed to fetch electricity data. Please check your input and try again.")
      setElectricityResult(null)
    }
  }

  const fetchExplosionData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/explosion-emissions", {
        explosiveType: explosionData.explosiveType,
        amount: explosionData.amount * 1000,
      })
      setExplosionResult(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching explosion data:", error)
      setError("Failed to fetch explosion data. Please check your input and try again.")
      setExplosionResult(null)
    }
  }

  const fetchFuelData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fuel-combustion", {
        params: {
          fuel: fuelData.fuel,
          "values.Volume": fuelData.volume,
        },
      })
      setFuelResult(response.data.result)
      setError(null)
    } catch (error) {
      console.error("Error fetching fuel data:", error)
      setError("Failed to fetch fuel data. Please check your input and try again.")
      setFuelResult(null)
    }
  }

  const fetchShippingData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/shipping-emissions", {
        weight_unit: shippingData.weight_unit,
        weight_value: Number.parseFloat(shippingData.weight_value),
        distance_unit: shippingData.distance_unit,
        distance_value: Number.parseFloat(shippingData.distance_value),
        transport_method: shippingData.transport_method,
      })

      setShippingResult(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data. Please check your input and try again.")
      setShippingResult(null)
    }
  }

  return (
    <div className="min-h-screen mt-24 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-4 sm:p-6 md:p-8 w-full overflow-x-hidden">
      {/* Fixed chatbot */}
      <ChatAssistant />

      

      <div className="relative container mx-auto p-4 sm:p-6 md:p-8 pt-10 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-cyan-800/50 sm:w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Electricity Consumption Card */}
        <Card className="bg-slate-900/90 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-cyan-50 text-center">
              Electricity Consumption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stateName" className="text-lg font-medium text-cyan-100">
                State Name:
              </Label>
              <Select
                value={electricityData.stateName}
                onValueChange={(value) => setElectricityData({ ...electricityData, stateName: value })}
              >
                <SelectTrigger className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-700/50">
                  {stateOptions.map((state, index) => (
                    <SelectItem key={index} value={state} className="text-cyan-50">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="energyPerTime" className="text-lg font-medium text-cyan-100">
                Energy per Time (kW·h/day):
              </Label>
              <Input
                id="energyPerTime"
                type="number"
                name="energyPerTime"
                value={electricityData.energyPerTime}
                onChange={handleElectricityChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Energy per Time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibleArea" className="text-lg font-medium text-cyan-100">
                Responsible Area (m²):
              </Label>
              <Input
                id="responsibleArea"
                type="number"
                name="responsibleArea"
                value={electricityData.responsibleArea}
                onChange={handleElectricityChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Responsible Area"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalArea" className="text-lg font-medium text-cyan-100">
                Total Area (m²):
              </Label>
              <Input
                id="totalArea"
                type="number"
                name="totalArea"
                value={electricityData.totalArea}
                onChange={handleElectricityChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Total Area"
              />
            </div>

            <div className="text-center pt-2">
              <Button
                onClick={fetchElectricityData}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-700/20 transition-all duration-200"
              >
                Calculate
              </Button>
            </div>
          </CardContent>

          {electricityResult && (
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 sm:p-6 bg-slate-800/90 rounded-lg border border-cyan-700/30 shadow-inner">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4">
                  Electricity Consumption Results
                </h2>
                <ul className="text-lg text-cyan-50 space-y-2">
                  {Object.entries(electricityResult).map(([type, { value, unit }]) => (
                    <React.Fragment key={type}>
                      <li>
                        {type}: {value} {unit}
                      </li>
                      <li>
                        {type}: {value / 1000} tonnes/day
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Explosion Emissions Card */}
        <Card className="bg-slate-900/90 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-cyan-50 text-center">
              Explosion Emissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="explosiveType" className="text-lg font-medium text-cyan-100">
                Explosive Type:
              </Label>
              <Select
                value={explosionData.explosiveType}
                onValueChange={(value) => setExplosionData({ ...explosionData, explosiveType: value })}
              >
                <SelectTrigger className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
                  <SelectValue placeholder="Select Explosive Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-700/50">
                  <SelectItem value="Black powder" className="text-cyan-50">
                    Black powder
                  </SelectItem>
                  <SelectItem value="Smokeless powder" className="text-cyan-50">
                    Smokeless powder
                  </SelectItem>
                  <SelectItem value="Dynamite, straight" className="text-cyan-50">
                    Dynamite, straight
                  </SelectItem>
                  <SelectItem value="Dynamite, ammonia" className="text-cyan-50">
                    Dynamite, ammonia
                  </SelectItem>
                  <SelectItem value="Dynamite, gelatin" className="text-cyan-50">
                    Dynamite, gelatin
                  </SelectItem>
                  <SelectItem value="ANFO" className="text-cyan-50">
                    ANFO
                  </SelectItem>
                  <SelectItem value="TNT" className="text-cyan-50">
                    TNT
                  </SelectItem>
                  <SelectItem value="RDX" className="text-cyan-50">
                    RDX
                  </SelectItem>
                  <SelectItem value="PETN" className="text-cyan-50">
                    PETN
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-lg font-medium text-cyan-100">
                Amount of Explosive Used (tons):
              </Label>
              <Input
                id="amount"
                type="number"
                name="amount"
                value={explosionData.amount}
                onChange={handleExplosionChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Amount in tons"
              />
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={fetchExplosionData}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-700/20 transition-all duration-200"
              >
                Calculate
              </Button>
            </div>
          </CardContent>

          {explosionResult && (
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 sm:p-6 bg-slate-800/90 rounded-lg border border-cyan-700/30 shadow-inner">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4">Explosion Emissions Results</h2>
                <div className="text-lg text-cyan-50 space-y-2">
                  <p>CO2: {explosionResult.emissions.CO2}</p>
                  <p>CO: {explosionResult.emissions.CO}</p>
                  <p>NOx: {explosionResult.emissions.NOx}</p>
                  <p>NH3: {explosionResult.emissions.NH3}</p>
                  <p>HCN: {explosionResult.emissions.HCN}</p>
                  <p>H2S: {explosionResult.emissions.H2S}</p>
                  <p>SO2: {explosionResult.emissions.SO2}</p>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Fuel Combustion Emissions Card */}
        <Card className="bg-slate-900/90 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-cyan-50 text-center">
              Fuel Combustion Emissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fuel" className="text-lg font-medium text-cyan-100">
                Fuel Type:
              </Label>
              <Select value={fuelData.fuel} onValueChange={(value) => setFuelData({ ...fuelData, fuel: value })}>
                <SelectTrigger className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
                  <SelectValue placeholder="Select Fuel Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-700/50">
                  <SelectItem value="cng" className="text-cyan-50">
                    CNG
                  </SelectItem>
                  <SelectItem value="diesel" className="text-cyan-50">
                    Diesel
                  </SelectItem>
                  <SelectItem value="Diesel (retail station biofuel blend)" className="text-cyan-50">
                    Diesel (Retail Station Biofuel Blend)
                  </SelectItem>
                  <SelectItem value="lpg" className="text-cyan-50">
                    LPG
                  </SelectItem>
                  <SelectItem value="petrol" className="text-cyan-50">
                    Petrol
                  </SelectItem>
                  <SelectItem value="Petrol (retail station biofuel blend)" className="text-cyan-50">
                    Petrol (Retail Station Biofuel Blend)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume" className="text-lg font-medium text-cyan-100">
                Volume of Fuel Consumed (liters):
              </Label>
              <Input
                id="volume"
                type="number"
                name="volume"
                value={fuelData.volume}
                onChange={handleFuelChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Volume in liters"
              />
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={fetchFuelData}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-700/20 transition-all duration-200"
              >
                Calculate
              </Button>
            </div>
          </CardContent>

          {fuelResult && (
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 sm:p-6 bg-slate-800/90 rounded-lg border border-cyan-700/30 shadow-inner">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4">
                  Fuel Combustion Emissions Results
                </h2>
                <ul className="text-lg text-cyan-50 space-y-2">
                  {Object.entries(fuelResult).map(([type, { value, unit }]) => (
                    <li key={type}>
                      {type}: {value / 1000} tons
                    </li>
                  ))}
                </ul>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Shipping Emissions Card */}
        <Card className="bg-slate-900/90 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-cyan-50 text-center">
              Shipping Emissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight_unit" className="text-lg font-medium text-cyan-100">
                Weight Unit:
              </Label>
              <Select
                value={shippingData.weight_unit}
                onValueChange={(value) => setShippingData({ ...shippingData, weight_unit: value })}
              >
                <SelectTrigger className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
                  <SelectValue placeholder="Select Weight Unit" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-700/50">
                  <SelectItem value="g" className="text-cyan-50">
                    grams (g)
                  </SelectItem>
                  <SelectItem value="kg" className="text-cyan-50">
                    kilograms (kg)
                  </SelectItem>
                  <SelectItem value="lb" className="text-cyan-50">
                    pounds (lb)
                  </SelectItem>
                  <SelectItem value="mt" className="text-cyan-50">
                    tonnes (mt)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_value" className="text-lg font-medium text-cyan-100">
                Weight Value:
              </Label>
              <Input
                id="weight_value"
                type="number"
                name="weight_value"
                value={shippingData.weight_value}
                onChange={handleShippingChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Weight Value"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance_unit" className="text-lg font-medium text-cyan-100">
                Distance Unit:
              </Label>
              <Select
                value={shippingData.distance_unit}
                onValueChange={(value) => setShippingData({ ...shippingData, distance_unit: value })}
              >
                <SelectTrigger className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
                  <SelectValue placeholder="Select Distance Unit" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-700/50">
                  <SelectItem value="km" className="text-cyan-50">
                    kilometers (km)
                  </SelectItem>
                  <SelectItem value="mi" className="text-cyan-50">
                    miles (mi)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance_value" className="text-lg font-medium text-cyan-100">
                Distance Value:
              </Label>
              <Input
                id="distance_value"
                type="number"
                name="distance_value"
                value={shippingData.distance_value}
                onChange={handleShippingChange}
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Distance Value"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transport_method" className="text-lg font-medium text-cyan-100">
                Transport Method:
              </Label>
              <Select
                value={shippingData.transport_method}
                onValueChange={(value) => setShippingData({ ...shippingData, transport_method: value })}
              >
                <SelectTrigger className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
                  <SelectValue placeholder="Select Transport Method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-700/50">
                  <SelectItem value="truck" className="text-cyan-50">
                    Truck
                  </SelectItem>
                  <SelectItem value="ship" className="text-cyan-50">
                    Ship
                  </SelectItem>
                  <SelectItem value="train" className="text-cyan-50">
                    Train
                  </SelectItem>
                  <SelectItem value="plane" className="text-cyan-50">
                    Plane
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-center pt-2">
              <Button
                onClick={fetchShippingData}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-700/20 transition-all duration-200"
              >
                Calculate
              </Button>
            </div>
          </CardContent>

          {shippingResult && (
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 sm:p-6 bg-slate-800/90 rounded-lg border border-cyan-700/30 shadow-inner">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4">Shipping Emissions Results</h2>
                <ul className="text-lg text-cyan-50 space-y-2">
                  <li>Distance: {shippingResult.distance}</li>
                  <li>Weight: {shippingResult.weight}</li>
                  <li>Carbon Emissions (grams): {shippingResult.carbonEmissions.grams}</li>
                  <li>Carbon Emissions (kilograms): {shippingResult.carbonEmissions.kilograms}</li>
                  <li>Carbon Emissions (metric tonnes): {shippingResult.carbonEmissions.metricTonnes}</li>
                </ul>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Coal Burning Emissions Card */}
        <Card className="bg-slate-900/90 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-cyan-50 text-center">
              Coal Burning Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <CoalEmission />
            </div>
          </CardContent>
        </Card>

        {/* Methane Emissions Card */}
        <Card className="bg-slate-900/90 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-cyan-50 text-center">Methane Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MethaneMonitoring />
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="col-span-1 md:col-span-2">
            <Card className="bg-red-900/80 border border-red-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-red-50">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-100">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default CombinedCode

