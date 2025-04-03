import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RequiredLand from './RequiredLand';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { InfoIcon } from 'lucide-react';

function NeutralityForm() {
  const MOCK_LOCATIONS = [
    { 
      id: 1,
      region: 'Western Ghats, Maharashtra', 
      coordinates: [19.0760, 72.8777], 
      soilType: 'laterite', 
      vegetationType: 'tropical_rainforest', 
      treeSpecies: ['Teak', 'Sal', 'Banyan'], 
      seedingTime: { 
        startDate: '2025-01-15', 
        expectedMaturityPeriod: 25,
        carbonSequestrationRateAtMaturity: 8.5
      }
    },
    { 
      id: 2,
      region: 'Kerala Forests', 
      coordinates: [10.8505, 76.2711], 
      soilType: 'alluvial', 
      vegetationType: 'tropical_rainforest', 
      treeSpecies: ['Rosewood', 'Kerala Pine', 'Wild Mango'], 
      seedingTime: { 
        startDate: '2025-02-01', 
        expectedMaturityPeriod: 30,
        carbonSequestrationRateAtMaturity: 9.2
      }
    },
    { 
      id: 3,
      region: 'Himalayan Foothills, Uttarakhand', 
      coordinates: [30.0668, 79.0193], 
      soilType: 'mountain_podozolic', 
      vegetationType: 'temperate_forest', 
      treeSpecies: ['Himalayan Oak', 'Cedar', 'Rhododendron'], 
      seedingTime: { 
        startDate: '2025-05-02', 
        expectedMaturityPeriod: 40,
        carbonSequestrationRateAtMaturity: 5.5
      }
    },
    { 
      id: 4,
      region: 'Sundarbans, West Bengal', 
      coordinates: [21.9497, 88.9068], 
      soilType: 'deltaic', 
      vegetationType: 'mangrove', 
      treeSpecies: ['Sundari', 'Gewa', 'Keora'], 
      seedingTime: { 
        startDate: '2025-01-10', 
        expectedMaturityPeriod: 20,
        carbonSequestrationRateAtMaturity: 6.8
      }
    },
    { 
      id: 5,
      region: 'Deccan Plateau, Karnataka', 
      coordinates: [15.3173, 75.7139], 
      soilType: 'black_cotton', 
      vegetationType: 'savanna', 
      treeSpecies: ['Neem', 'Tamarind', 'Acacia'], 
      seedingTime: { 
        startDate: '2025-02-30', 
        expectedMaturityPeriod: 15,
        carbonSequestrationRateAtMaturity: 3.5
      }
    }
  ];

  const VEGETATION_RATES = {
    forest: 5.0,
    grassland: 1.5,
    wetland: 3.5,
    agricultural: 1.0,
    mangrove: 4.0,
    tropical_rainforest: 6.5,
    temperate_forest: 4.5,
    boreal_forest: 3.0,
    savanna: 0.8,
    desert_vegetation: 0.1,
    other: 0
  };

  const [formType, setFormType] = useState('existing');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sinkData, setSinkData] = useState({
    name: '',
    vegetationType: 'forest',
    otherVegetationType: '',
    areaCovered: '',
    carbonSequestrationRate: VEGETATION_RATES.forest,
    additionalDetails: '',
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  // Effect to ensure carbonSequestrationRate is always set
  useEffect(() => {
    if (!sinkData.carbonSequestrationRate && sinkData.vegetationType !== 'other') {
      setSinkData(prevData => ({
        ...prevData,
        carbonSequestrationRate: VEGETATION_RATES[sinkData.vegetationType] || VEGETATION_RATES.forest
      }));
    }
  }, [sinkData.vegetationType, sinkData.carbonSequestrationRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vegetationType') {
      const newRate = VEGETATION_RATES[value];
      
      setSinkData(prevData => ({
        ...prevData,
        vegetationType: value,
        carbonSequestrationRate: value === 'other' ? '' : newRate,
        otherVegetationType: value === 'other' ? '' : prevData.otherVegetationType
      }));
    } else {
      setSinkData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleVegetationTypeChange = (value) => {
    const newRate = VEGETATION_RATES[value];
    
    setSinkData(prevData => ({
      ...prevData,
      vegetationType: value,
      carbonSequestrationRate: value === 'other' ? '' : newRate,
      otherVegetationType: value === 'other' ? '' : prevData.otherVegetationType
    }));
  };

  const handleLocationChange = (value) => {
    const locationId = parseInt(value);
    const location = MOCK_LOCATIONS.find(loc => loc.id === locationId);
    setSelectedLocation(location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure carbonSequestrationRate is set before submission
    const payload = {
      ...sinkData,
      carbonSequestrationRate: sinkData.carbonSequestrationRate === '' 
        ? 0 
        : parseFloat(sinkData.carbonSequestrationRate),
      areaCovered: parseFloat(sinkData.areaCovered),
      timeframe: 1
    };

    try {
      const apiEndpoint = formType === 'sink' ? 'http://localhost:5000/api/sinks' : 'http://localhost:5000/api/existing-sinks';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        setResult({
          ...data.data,
          mockLocation: selectedLocation
        });
        
        // Reset form with default values
        setSinkData({
          name: '',
          vegetationType: 'forest',
          otherVegetationType: '',
          areaCovered: '',
          carbonSequestrationRate: VEGETATION_RATES.forest,
          additionalDetails: '',
        });
        setSelectedLocation(null);
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error('Failed to submit form', errorData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <style jsx>{`
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div className="p-6 md:p-10 mt-24 lg:p-20 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#342F49] to-[#2B263F] relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#66C5CC] to-[#55B2B6] opacity-30 animate-gradient overflow-hidden"></div>
        </div>
        
        <h1 className="text-4xl font-bold text-[#cad9ed] mb-10 text-center">Carbon Sink</h1>
      
        {/* Form Type Selector */}
        <div className="mb-8 w-full max-w-4xl">
          <RadioGroup 
            defaultValue={formType}
            className="flex space-x-6" 
            onValueChange={setFormType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="sink" 
                id="sink" 
                className="border-[#66C5CC] text-[#66C5CC]"
              />
              <Label 
                htmlFor="sink" 
                className="text-lg font-medium text-[#cad9ed] cursor-pointer"
              >
                Carbon Sink
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="existing" 
                id="existing" 
                className="border-[#66C5CC] text-[#66C5CC]"
              />
              <Label 
                htmlFor="existing" 
                className="text-lg font-medium text-[#cad9ed] cursor-pointer"
              >
                Existing Sink
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Location Selector */}
        <div className="mb-6 w-full max-w-4xl">
          <Label htmlFor="location" className="text-2xl text-[#cad9ed] font-semibold mb-2 block">
            Select Location
          </Label>
          <Select onValueChange={handleLocationChange} value={selectedLocation ? selectedLocation.id.toString() : ""}>
            <SelectTrigger 
              className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
            >
              <SelectValue placeholder="Select a Location" />
            </SelectTrigger>
            <SelectContent className="bg-[#342F49] text-[#cad9ed] border border-[#66C5CC]">
              <SelectGroup>
                <SelectLabel className="text-[#66C5CC]">Available Locations</SelectLabel>
                {MOCK_LOCATIONS.map((location) => (
                  <SelectItem 
                    key={location.id} 
                    value={location.id.toString()}
                    className="hover:bg-[#2B263F] focus:bg-[#2B263F]"
                  >
                    {location.region}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      
        {/* Main Form */}
        <Card className="w-full max-w-4xl bg-[#2B263F] border-[#66C5CC]">
          <CardContent className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-2xl text-[#cad9ed] font-semibold mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={sinkData.name}
                  onChange={handleChange}
                  placeholder="Name or identifier for the carbon sink"
                  className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
                />
              </div>
          
              {/* Vegetation Type */}
              <div>
                <div className="flex items-center mb-2">
                  <Label htmlFor="vegetationType" className="text-2xl text-[#cad9ed] font-semibold mr-2">
                    Vegetation Type
                  </Label>
                  <div 
                    className="group relative cursor-pointer"
                    title="Carbon sequestration rates are approximate and can vary based on specific conditions"
                  >
                    <InfoIcon className="h-5 w-5 text-[#66C5CC] opacity-50 hover:opacity-100" />
                  </div>
                </div>
                <Select 
                  name="vegetationType" 
                  value={sinkData.vegetationType} 
                  onValueChange={handleVegetationTypeChange}
                >
                  <SelectTrigger 
                    className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
                  >
                    <SelectValue placeholder="Select vegetation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#342F49] text-[#cad9ed] border border-[#66C5CC]">
                    <SelectGroup>
                      <SelectLabel className="text-[#66C5CC]">Forests</SelectLabel>
                      <SelectItem value="tropical_rainforest" className="hover:bg-[#2B263F]">
                        Tropical Rainforest (6.5 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="temperate_forest" className="hover:bg-[#2B263F]">
                        Temperate Forest (4.5 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="boreal_forest" className="hover:bg-[#2B263F]">
                        Boreal Forest (3.0 tons CO2/ha/year)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-[#66C5CC]">Other Vegetation</SelectLabel>
                      <SelectItem value="grassland" className="hover:bg-[#2B263F]">
                        Grassland (1.5 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="wetland" className="hover:bg-[#2B263F]">
                        Wetland (3.5 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="agricultural" className="hover:bg-[#2B263F]">
                        Agricultural Land (1.0 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="mangrove" className="hover:bg-[#2B263F]">
                        Mangrove (4.0 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="savanna" className="hover:bg-[#2B263F]">
                        Savanna (0.8 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="desert_vegetation" className="hover:bg-[#2B263F]">
                        Desert Vegetation (0.1 tons CO2/ha/year)
                      </SelectItem>
                      <SelectItem value="other" className="hover:bg-[#2B263F]">
                        Other (Manual Input)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Conditional rendering for Other Vegetation Type */}
                {sinkData.vegetationType === 'other' && (
                  <div className="mt-4 space-y-4">
                    <Input
                      name="otherVegetationType"
                      value={sinkData.otherVegetationType}
                      onChange={handleChange}
                      placeholder="Specify vegetation type"
                      className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
                    />
                    <Input
                      type="number"
                      name="carbonSequestrationRate"
                      value={sinkData.carbonSequestrationRate}
                      onChange={handleChange}
                      placeholder="Carbon Sequestration Rate (tons CO2/hectare/year)"
                      className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
                    />
                    <p className="text-sm text-[#66C5CC] italic">
                      Note: Please provide a scientifically backed rate or consult local environmental experts.
                    </p>
                  </div>
                )}
              </div>
          
              {/* Area Covered */}
              <div>
                <Label htmlFor="areaCovered" className="text-2xl text-[#cad9ed] font-semibold mb-2 block">
                  Area Covered (hectares)
                </Label>
                <Input
                  type="number"
                  id="areaCovered"
                  name="areaCovered"
                  value={sinkData.areaCovered}
                  onChange={handleChange}
                  placeholder="Total area covered by the sink"
                  className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
                />
              </div>
          
              {/* Additional Details */}
              <div>
                <Label htmlFor="additionalDetails" className="text-2xl text-[#cad9ed] font-semibold mb-2 block">
                  Additional Details
                </Label>
                <Textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  value={sinkData.additionalDetails}
                  onChange={handleChange}
                  placeholder="Any additional details"
                  className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
                />
              </div>
          
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  className="py-3 px-6 bg-[#66C5CC] hover:bg-[#55B2B6] text-[#2B263F] font-bold rounded-md transition duration-300"
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      
        {/* Display Result */}
        {result && (
          <Card className="mt-10 border border-[#66C5CC] w-full max-w-4xl bg-[#342F49] text-[#d5d7da]">
            <CardContent className="p-8">
              <h2 className="text-4xl font-semibold text-[#66C5CC] mb-6 text-center">Carbon Sink Analysis Result</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sequestration Details */}
                <Card className="bg-[#2B263F] border-[#66C5CC] border-opacity-50 text-[#cad9ed]">
                  <CardContent className="p-6">
                    <h3 className="text-2xl text-[#66C5CC] mb-4">Sequestration Metrics</h3>
                    <p className="mb-2"><strong>Daily Sequestration Rate:</strong> {result.dailySequestrationRate} tons CO2</p>
                    <p><strong>Total Sequestration:</strong> {result.totalSequestration} tons CO2</p>
                  </CardContent>
                </Card>

                {/* Location Details */}
                {result.mockLocation && (
                  <Card className="bg-[#2B263F] border-[#66C5CC] border-opacity-50 text-[#cad9ed]">
                    <CardContent className="p-6">
                      <h3 className="text-2xl text-[#66C5CC] mb-4">Location Information</h3>
                      <p><strong>Region:</strong> {result.mockLocation.region}</p>
                      <p><strong>Coordinates:</strong> {result.mockLocation.coordinates.join(', ')}</p>
                      <p><strong>Soil Type:</strong> {result.mockLocation.soilType}</p>
                      <p><strong>Vegetation Type:</strong> {result.mockLocation.vegetationType}</p>
                      <p><strong>Tree Species:</strong> {result.mockLocation.treeSpecies.join(', ')}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Seeding Time Details */}
              {result.mockLocation?.seedingTime && (
                <Card className="mt-6 bg-[#2B263F] border-[#66C5CC] border-opacity-50 text-[#cad9ed]">
                  <CardContent className="p-6">
                    <h3 className="text-2xl text-[#66C5CC] mb-4">Seeding and Growth Information</h3>
                    <p><strong>Seeding Start Date:</strong> {result.mockLocation.seedingTime.startDate}</p>
                    <p><strong>Expected Maturity Period:</strong> {result.mockLocation.seedingTime.expectedMaturityPeriod} years</p>
                    <p><strong>Carbon Sequestration Rate at Maturity:</strong> {result.mockLocation.seedingTime.carbonSequestrationRateAtMaturity} tons CO2/ha/year</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <div>
        <RequiredLand/>
      </div>
    </>
  );
}

export default NeutralityForm;
