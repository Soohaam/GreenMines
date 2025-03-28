"use client"

import { useState } from "react"
import axios from "axios"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const CoalEmission = () => {
  const [coalType, setCoalType] = useState("")
  const [coalConsumption, setCoalConsumption] = useState("")
  const [co2Emissions, setCo2Emissions] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCoalTypeChange = (value) => {
    setCoalType(value)
  }

  const handleCoalConsumptionChange = (event) => {
    setCoalConsumption(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!coalType || !coalConsumption) {
      setError("Please provide both coal type and consumption")
      return
    }

    setIsLoading(true)

    try {
      // Sending POST request using axios
      const response = await axios.post("http://localhost:5000/api/coal-emission", {
        coalType,
        coalConsumption: Number.parseFloat(coalConsumption),
      })

      setCo2Emissions(response.data.co2Emissions)
      setError("")
    } catch (error) {
      setError(error.response?.data?.message || "Error calculating emissions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coalType" className="text-lg font-medium text-cyan-100">
            Coal Type
          </Label>
          <Select value={coalType} onValueChange={handleCoalTypeChange}>
            <SelectTrigger id="coalType" className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
              <SelectValue placeholder="Select Coal Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-700/50">
              <SelectItem value="Lignite" className="text-cyan-50">
                Lignite
              </SelectItem>
              <SelectItem value="Sub-bituminous" className="text-cyan-50">
                Sub-bituminous
              </SelectItem>
              <SelectItem value="Bituminous" className="text-cyan-50">
                Bituminous
              </SelectItem>
              <SelectItem value="Anthracite" className="text-cyan-50">
                Anthracite
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coalConsumption" className="text-lg font-medium text-cyan-100">
            Coal Consumption (in tons)
          </Label>
          <Input
            type="number"
            id="coalConsumption"
            value={coalConsumption}
            onChange={handleCoalConsumptionChange}
            className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
            placeholder="Enter coal consumption in tons"
            min="0"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-700/20 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Emissions"}
          </Button>
        </div>
      </form>

      {co2Emissions !== null && (
        <div className="mt-4 p-4 bg-slate-800/90 rounded-lg border border-cyan-700/30 shadow-inner">
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">Calculated CO2 Emissions:</h3>
          <div className="flex items-center justify-between">
            <p className="text-lg text-cyan-50">CO2 Emissions:</p>
            <p className="text-lg font-semibold text-cyan-50">{co2Emissions.toFixed(2)} kg</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg text-cyan-50">CO2 Emissions:</p>
            <p className="text-lg font-semibold text-cyan-50">{(co2Emissions / 1000).toFixed(2)} tonnes</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoalEmission

