"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const MethaneMonitoring = () => {
  const [formData, setFormData] = useState({
    miningType: "Surface",
    surfaceCoalProduction: 0,
    undergroundCoalProduction: 0,
    surfaceEmissionFactor: 0,
    undergroundEmissionFactor: 0,
    ventilationEmissions: 0,
    degasificationEmissions: 0,
    atmosphericConditions: {
      temperature: 0,
      humidity: 0,
      pressure: 0,
    },
  })

  const [response, setResponse] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (name, value) => {
    if (name in formData.atmosphericConditions) {
      setFormData((prevData) => ({
        ...prevData,
        atmosphericConditions: {
          ...prevData.atmosphericConditions,
          [name]: Number.parseFloat(value) || 0,
        },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "miningType" ? value : Number.parseFloat(value) || 0,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/methane-emission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to calculate emissions")
      }

      const data = await res.json()
      setResponse(data)
      setError("")
    } catch (err) {
      console.error(err)
      setError(err.message || "Error calculating emissions")
    } finally {
      setIsLoading(false)
    }
  }

  const { miningType } = formData

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
          <Label htmlFor="miningType" className="text-lg font-medium text-cyan-100">
            Mining Type
          </Label>
          <Select value={miningType} onValueChange={(value) => handleChange("miningType", value)}>
            <SelectTrigger id="miningType" className="w-full border-cyan-700/50 bg-slate-800/90 text-cyan-50">
              <SelectValue placeholder="Select Mining Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-700/50">
              <SelectItem value="Surface" className="text-cyan-50">
                Surface
              </SelectItem>
              <SelectItem value="Underground" className="text-cyan-50">
                Underground
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {miningType === "Surface" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="surfaceCoalProduction" className="text-lg font-medium text-cyan-100">
                Surface Coal Production (tons)
              </Label>
              <Input
                id="surfaceCoalProduction"
                type="number"
                value={formData.surfaceCoalProduction || ""}
                onChange={(e) => handleChange("surfaceCoalProduction", e.target.value)}
                step="0.01"
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Enter surface coal production"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surfaceEmissionFactor" className="text-lg font-medium text-cyan-100">
                Surface Emission Factor (CH4/ton)
              </Label>
              <Input
                id="surfaceEmissionFactor"
                type="number"
                value={formData.surfaceEmissionFactor || ""}
                onChange={(e) => handleChange("surfaceEmissionFactor", e.target.value)}
                step="0.01"
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Enter surface emission factor"
                min="0"
              />
            </div>
          </>
        )}

        {miningType === "Underground" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="undergroundCoalProduction" className="text-lg font-medium text-cyan-100">
                Underground Coal Production (tons)
              </Label>
              <Input
                id="undergroundCoalProduction"
                type="number"
                value={formData.undergroundCoalProduction || ""}
                onChange={(e) => handleChange("undergroundCoalProduction", e.target.value)}
                step="0.01"
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Enter underground coal production"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="undergroundEmissionFactor" className="text-lg font-medium text-cyan-100">
                Underground Emission Factor (CH4/ton)
              </Label>
              <Input
                id="undergroundEmissionFactor"
                type="number"
                value={formData.undergroundEmissionFactor || ""}
                onChange={(e) => handleChange("undergroundEmissionFactor", e.target.value)}
                step="0.01"
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Enter underground emission factor"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="ventilationEmissions" className="text-lg font-medium text-cyan-100">
                  Ventilation Emissions (Mcf)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-cyan-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-cyan-50 border-cyan-700/50">
                      <p>
                        This refers to the methane emissions released during the ventilation process in underground
                        mines.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="ventilationEmissions"
                type="number"
                value={formData.ventilationEmissions || ""}
                onChange={(e) => handleChange("ventilationEmissions", e.target.value)}
                step="0.01"
                className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
                placeholder="Enter ventilation emissions"
                min="0"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="temperature" className="text-lg font-medium text-cyan-100">
            Atmospheric Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            value={formData.atmosphericConditions.temperature || ""}
            onChange={(e) => handleChange("temperature", e.target.value)}
            step="0.01"
            className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
            placeholder="Enter atmospheric temperature"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="humidity" className="text-lg font-medium text-cyan-100">
            Atmospheric Humidity (%)
          </Label>
          <Input
            id="humidity"
            type="number"
            value={formData.atmosphericConditions.humidity || ""}
            onChange={(e) => handleChange("humidity", e.target.value)}
            step="0.01"
            className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
            placeholder="Enter atmospheric humidity"
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pressure" className="text-lg font-medium text-cyan-100">
            Atmospheric Pressure (Pa)
          </Label>
          <Input
            id="pressure"
            type="number"
            value={formData.atmosphericConditions.pressure || ""}
            onChange={(e) => handleChange("pressure", e.target.value)}
            step="0.01"
            className="border-cyan-700/50 bg-slate-800/90 text-cyan-50"
            placeholder="Enter atmospheric pressure"
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

      {response && (
        <div className="mt-4 p-4 bg-slate-800/90 rounded-lg border border-cyan-700/30 shadow-inner">
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">Calculated Methane Emissions:</h3>
          <div className="flex items-center justify-between">
            <p className="text-lg text-cyan-50">Total Methane Emissions:</p>
            <p className="text-lg font-semibold text-cyan-50">{response.data.totalMethane} Mcf</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MethaneMonitoring

