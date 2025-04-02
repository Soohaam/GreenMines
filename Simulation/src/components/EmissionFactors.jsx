
import React, { useState, useEffect } from 'react';
import { COAL_MINES } from '../utils/mapUtils';

const EmissionFactors = ({ selectedMine, onUpdateEmissionFactors }) => {
  const [mineType, setMineType] = useState('');
  const [electricityInput, setElectricityInput] = useState({
    energyPerTime: 1000, // kWh
    responsibleArea: 50, // hectares
    totalArea: 100, // hectares
  });
  
  const [fuelInput, setFuelInput] = useState({
    fuelType: 'Diesel',
    volume: 500, // liters
  });
  
  const [shippingInput, setShippingInput] = useState({
    weight: 1000, // tons
    distance: 200, // km
    transportMethod: 'truck',
  });
  
  const [coalInput, setCoalInput] = useState({
    coalType: 'Bituminous',
    coalConsumption: 500, // tons
  });
  
  // Update mine type when selected mine changes
  useEffect(() => {
    if (selectedMine) {
      const mine = COAL_MINES.find(m => m.id === selectedMine);
      if (mine) {
        setMineType(mine.type);
      }
    }
  }, [selectedMine]);
  
  // Simulate changing values over time to mimic dynamic behavior
  useEffect(() => {
    if (!selectedMine) return;
    
    const interval = setInterval(() => {
      // Increase electricity usage
      setElectricityInput(prev => ({
        ...prev,
        energyPerTime: Math.min(10000, prev.energyPerTime + Math.floor(Math.random() * 200)),
      }));
      
      // Increase fuel usage
      setFuelInput(prev => ({
        ...prev,
        volume: Math.min(2000, prev.volume + Math.floor(Math.random() * 50)),
      }));
      
      // Increase shipping
      setShippingInput(prev => ({
        ...prev,
        weight: Math.min(5000, prev.weight + Math.floor(Math.random() * 100)),
        distance: Math.min(1000, prev.distance + Math.floor(Math.random() * 20)),
      }));
      
      // Increase coal consumption
      setCoalInput(prev => ({
        ...prev,
        coalConsumption: Math.min(2000, prev.coalConsumption + Math.floor(Math.random() * 50)),
      }));
      
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [selectedMine]);
  
  // Update emission factors whenever inputs change
  useEffect(() => {
    if (!selectedMine) return;
    
    onUpdateEmissionFactors({
      electricity: {
        energyPerTime: electricityInput.energyPerTime,
        responsibleArea: electricityInput.responsibleArea,
        totalArea: electricityInput.totalArea,
      },
      fuel: {
        fuelType: fuelInput.fuelType,
        volume: fuelInput.volume,
      },
      shipping: {
        weight: shippingInput.weight,
        distance: shippingInput.distance,
        transportMethod: shippingInput.transportMethod,
      },
      coal: {
        coalType: coalInput.coalType,
        coalConsumption: coalInput.coalConsumption,
      },
    });
  }, [
    selectedMine, 
    electricityInput, 
    fuelInput, 
    shippingInput, 
    coalInput, 
    onUpdateEmissionFactors
  ]);
  
  if (!selectedMine) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          Please select a coal mine first to view and adjust emission factors.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-simulation-dark">Emission Factors</h3>
      <p className="text-sm text-gray-600">
        Monitor and adjust the emission factors for the selected coal mine.
      </p>
      
      {/* Electricity Consumption */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-medium text-simulation-dark">Electricity Consumption</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Energy Usage:</span>
            <span className="font-medium">{electricityInput.energyPerTime} kWh/day</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Responsible Area:</span>
            <span className="font-medium">{electricityInput.responsibleArea} hectares</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Area:</span>
            <span className="font-medium">{electricityInput.totalArea} hectares</span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-simulation-primary">
                  Usage Level
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-simulation-primary">
                  {Math.round(electricityInput.energyPerTime / 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${Math.min(100, electricityInput.energyPerTime / 100)}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-simulation-primary">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fuel Consumption */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-medium text-simulation-dark">Fuel Consumption</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fuel Type:</span>
            <span className="font-medium">{fuelInput.fuelType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Volume:</span>
            <span className="font-medium">{fuelInput.volume} liters/day</span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-simulation-primary">
                  Usage Level
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-simulation-primary">
                  {Math.round(fuelInput.volume / 20)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${Math.min(100, fuelInput.volume / 20)}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-simulation-primary">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shipping Emissions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-medium text-simulation-dark">Shipping Emissions</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Coal Weight:</span>
            <span className="font-medium">{shippingInput.weight} tons</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Distance:</span>
            <span className="font-medium">{shippingInput.distance} km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Transport Method:</span>
            <span className="font-medium capitalize">{shippingInput.transportMethod}</span>
          </div>
        </div>
      </div>
      
      {/* Coal Emissions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-medium text-simulation-dark">Coal Production Emissions</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Coal Type:</span>
            <span className="font-medium">{coalInput.coalType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Daily Consumption:</span>
            <span className="font-medium">{coalInput.coalConsumption} tons</span>
          </div>
        </div>
      </div>
      
      {/* Methane Emissions (only for underground mines) */}
      {mineType === 'underground' && (
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-100">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="font-medium text-yellow-800">Methane Emissions</h4>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            This underground mine produces significant methane emissions. Consider implementing Methane Capture Storage (MCS) technology.
          </p>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-700">Estimated Methane:</span>
              <span className="font-medium text-yellow-800">
                {Math.round(coalInput.coalConsumption * 0.03)} tons/day
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionFactors;
