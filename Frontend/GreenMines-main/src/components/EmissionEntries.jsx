"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { format } from "date-fns"
import { CalendarIcon, Trash2, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

// Import shadcn components
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const EmissionEntries = () => {
  // State declarations
  const [data, setData] = useState({
    electricity: [],
    explosion: [],
    fuelCombustion: [],
    shipping: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState([])
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [filters, setFilters] = useState({ type: "all", impact: "all" })
  const entriesPerPage = 4

  // Fetch data based on date range
  const fetchDataForDateRange = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/data/${dateRange.startDate}/${dateRange.endDate}`)
      setData(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  // Use effect to fetch data when date range changes
  useEffect(() => {
    fetchDataForDateRange()
  }, [dateRange])

  // Function to format and combine all emission data
  const formatEmissionData = (data) => {
    const formattedData = []

    // Format Electricity data
    data.electricity?.forEach((item) => {
      formattedData.push({
        type: "Electricity",
        amount: (item.result.CO2.value / 1000).toFixed(2),
        impact: calculateImpact(item.result.CO2.value / 1000),
        time: item.createdAt,
        id: item._id,
        model: "Electricity",
      })
    })

    // Format Explosion data
    data.explosion?.forEach((item) => {
      formattedData.push({
        type: "Explosion",
        amount: (Number.parseFloat(item.emissions.CO2) / 1000).toFixed(2),
        impact: calculateImpact(Number.parseFloat(item.emissions.CO2) / 1000),
        time: item.createdAt,
        id: item._id,
        model: "Explosion",
      })
    })

    // Format Fuel Combustion data
    data.fuelCombustion?.forEach((item) => {
      formattedData.push({
        type: "Fuel",
        amount: (item.result.CO2.value / 1000).toFixed(2),
        impact: calculateImpact(item.result.CO2.value / 1000),
        time: item.createdAt,
        id: item._id,
        model: "FuelCombustion",
      })
    })

    // Format Shipping data
    data.shipping?.forEach((item) => {
      formattedData.push({
        type: "Shipping",
        amount: (Number.parseFloat(item.result.carbonEmissions.kilograms) / 1000).toFixed(2),
        impact: calculateImpact(Number.parseFloat(item.result.carbonEmissions.kilograms) / 1000),
        time: item.createdAt,
        id: item._id,
        model: "Shipping",
      })
    })

    return formattedData
  }

  // Calculate impact based on CO2 value (in tons)
  const calculateImpact = (co2Value) => {
    if (co2Value >= 100) return "Critical"
    if (co2Value >= 50) return "High"
    if (co2Value >= 25) return "Medium"
    return "Low"
  }

  // Check if date is today
  const isToday = (dateString) => {
    const today = new Date()
    const entryDate = new Date(dateString)
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    )
  }

  // Handle delete
  const handleDelete = async (id, model) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`)
      // Refresh data after deletion
      fetchDataForDateRange()
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = formatEmissionData(data)

    if (filters.type !== "all") {
      filtered = filtered.filter((item) => item.type === filters.type)
    }

    if (filters.impact !== "all") {
      filtered = filtered.filter((item) => item.impact === filters.impact)
    }

    setFilteredData(filtered)
  }

  // Use effect to apply filters when data or filters change
  useEffect(() => {
    applyFilters()
  }, [data, filters])

  // Pagination logic
  const totalPages = Math.max(Math.ceil(filteredData.length / entriesPerPage), 1)
  const currentEntries = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  // Get impact badge styles
  const getImpactBadgeVariant = (impact) => {
    switch (impact) {
      case "Critical":
        return "bg-red-600 hover:bg-red-700 text-white"
      case "High":
        return "bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
      case "Medium":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Low":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Card className="bg-gray-900 shadow-xl mt-6 w-full xl:flex-1 overflow-hidden border border-gray-700">
      <CardHeader className="pb-0 border-b border-gray-700 bg-gray-800">
        <CardTitle className="text-xl font-bold text-white">Emission Data Entries</CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 mt-2">
          <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap gap-3">
            {/* Date Range Selector - Start Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white font-medium"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.startDate ? format(new Date(dateRange.startDate), "PPP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                <Calendar
                  mode="single"
                  selected={new Date(dateRange.startDate)}
                  onSelect={(date) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: date ? format(date, "yyyy-MM-dd") : prev.startDate,
                    }))
                  }
                  initialFocus
                  className="p-3 pointer-events-auto bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>

            {/* Date Range Selector - End Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white font-medium"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.endDate ? format(new Date(dateRange.endDate), "PPP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                <Calendar
                  mode="single"
                  selected={new Date(dateRange.endDate)}
                  onSelect={(date) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: date ? format(date, "yyyy-MM-dd") : prev.endDate,
                    }))
                  }
                  initialFocus
                  className="p-3 pointer-events-auto bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Type Filter */}
          <Select value={filters.type} onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-gray-600 text-white font-medium">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Type" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="all" className="focus:bg-gray-700 focus:text-white">
                All Types
              </SelectItem>
              <SelectItem value="Electricity" className="focus:bg-gray-700 focus:text-white">
                Electricity
              </SelectItem>
              <SelectItem value="Explosion" className="focus:bg-gray-700 focus:text-white">
                Explosion
              </SelectItem>
              <SelectItem value="Fuel" className="focus:bg-gray-700 focus:text-white">
                Fuel
              </SelectItem>
              <SelectItem value="Shipping" className="focus:bg-gray-700 focus:text-white">
                Shipping
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Impact Filter */}
          <Select value={filters.impact} onValueChange={(value) => setFilters((prev) => ({ ...prev, impact: value }))}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-gray-600 text-white font-medium">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Impact" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="all" className="focus:bg-gray-700 focus:text-white">
                All Impacts
              </SelectItem>
              <SelectItem value="Critical" className="focus:bg-gray-700 focus:text-white">
                Critical
              </SelectItem>
              <SelectItem value="High" className="focus:bg-gray-700 focus:text-white">
                High
              </SelectItem>
              <SelectItem value="Medium" className="focus:bg-gray-700 focus:text-white">
                Medium
              </SelectItem>
              <SelectItem value="Low" className="focus:bg-gray-700 focus:text-white">
                Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border border-gray-700 overflow-hidden bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 bg-gray-800 hover:bg-gray-800">
                <TableHead className="text-white font-bold">Type</TableHead>
                <TableHead className="text-white font-bold">Amount (tons CO₂)</TableHead>
                <TableHead className="text-white font-bold">Impact</TableHead>
                <TableHead className="text-white font-bold">Time</TableHead>
                <TableHead className="text-white font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEntries.length > 0 ? (
                currentEntries.map((entry, index) => (
                  <TableRow key={index} className="border-gray-700 hover:bg-gray-700">
                    <TableCell className="text-white font-medium">{entry.type}</TableCell>
                    <TableCell className="text-white font-medium">{entry.amount}</TableCell>
                    <TableCell>
                      <Badge className={cn(getImpactBadgeVariant(entry.impact), "px-3 py-1")}>{entry.impact}</Badge>
                    </TableCell>
                    <TableCell className="text-white">{format(new Date(entry.time), "yyyy-MM-dd HH:mm")}</TableCell>
                    <TableCell>
                      {isToday(entry.time) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(entry.id, entry.model)}
                          className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-white font-medium">
                    No emission entries found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 border-none font-medium"
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-white bg-gray-800 px-4 py-2 rounded-md">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 border-none font-medium"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmissionEntries

