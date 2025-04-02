
import React, { useState, useEffect } from 'react';
import { COAL_MINES, getRandomLocationNearMine, generateUniqueId } from '../utils/mapUtils';
import { calculateRenewableImpact } from '../utils/emissionCalculations';
import { toast } from 'sonner';

const RenewableEnergy = ({ selectedMine, onAddRenewable, onApplyRenewable, onActivatePlacement }) => {
  const [renewableType, setRenewableType] = useState('Solar');
  const [reductionPercentage, setReductionPercentage] = useState(30);
  const [availableLand, setAvailableLand] = useState(50);
  const [renewableAdded, setRenewableAdded] = useState(false);
  const [reductionAmount, setReductionAmount] = useState(0);
  
  const renewableTypes = [
    'Solar',
    'Wind',
    'Hydropower',
    'HydrogenElectric'
  ];
  
  // Update reduction amount calculation when inputs change
  useEffect(() => {
    // Estimate daily emissions for calculation
    const estimatedEmissions = 500; // tons CO2 per day (simplified)
    
    const renewableData = calculateRenewableImpact(
      estimatedEmissions,
      renewableType,
      reductionPercentage,
      availableLand
    );
    
    setReductionAmount(renewableData.totalCo2ReductionPerDay);
  }, [renewableType, reductionPercentage, availableLand]);
  
  const handleAddRenewable = () => {
    if (!selectedMine) {
      toast.error("Please select a coal mine first");
      return;
    }
    
    const mine = COAL_MINES.find(m => m.id === selectedMine);
    if (!mine) return;
    
    // Estimate daily emissions for calculation
    const estimatedEmissions = 500; // tons CO2 per day (simplified)
    
    const renewableData = calculateRenewableImpact(
      estimatedEmissions,
      renewableType,
      reductionPercentage,
      availableLand
    );
    
    const renewable = {
      id: generateUniqueId(),
      type: renewableType,
      position: getRandomLocationNearMine(mine.location),
      capacity: `${renewableData.targetCo2Reduction} tons/day`,
      reduction: renewableData.totalCo2ReductionPerDay,
    };
    
    onAddRenewable(renewable);
    // Apply the renewable impact immediately
    onApplyRenewable(renewableData);
    setRenewableAdded(true);
    toast.success(`${renewableType} energy system installed successfully!`);
  };
  
  const handleActivatePlacement = () => {
    if (!selectedMine) {
      toast.error("Please select a coal mine first");
      return;
    }
    
    const type = renewableType.toLowerCase() === 'solar' ? 'renewable-solar' : 'renewable-wind';
    
    // Calculate impact for configuration
    const estimatedEmissions = 500; // tons CO2 per day (simplified)
    const renewableData = calculateRenewableImpact(
      estimatedEmissions,
      renewableType,
      reductionPercentage,
      availableLand
    );
    
    const config = {
      capacity: renewableData.targetCo2Reduction,
      reduction: renewableData.totalCo2ReductionPerDay
    };
    
    onActivatePlacement(type, config);
  };
  
  if (!selectedMine) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          Please select a coal mine first to add renewable energy sources.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto max-h-[350px]">
      <h4 className="text-md font-medium text-simulation-dark mb-3">Renewable Energy</h4>
      <p className="text-sm text-gray-600 mb-4">
        Implement renewable energy sources to offset carbon emissions.
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Renewable Type
          </label>
          <select
            value={renewableType}
            onChange={(e) => setRenewableType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {renewableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emission Reduction Target (%)
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={reductionPercentage}
            onChange={(e) => setReductionPercentage(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10%</span>
            <span>{reductionPercentage}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Land (hectares)
          </label>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={availableLand}
            onChange={(e) => setAvailableLand(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10 ha</span>
            <span>{availableLand} ha</span>
            <span>200 ha</span>
          </div>
        </div>
        
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddRenewable}
            disabled={renewableAdded}
            className={`px-4 py-2 rounded-lg text-white font-medium 
              ${renewableAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-simulation-primary hover:bg-simulation-secondary'} 
              transition-colors`}
          >
            {renewableAdded ? `${renewableType} Added` : `Add ${renewableType}`}
          </button>
          
          <button
            onClick={handleActivatePlacement}
            className="px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Place on Map
          </button>
        </div>
        
        {renewableAdded && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-700">
              <span className="font-medium">{renewableType}</span> energy system added with <span className="font-medium">{availableLand} hectares</span> coverage
            </p>
            <p className="text-blue-600 mt-1">
              System is now operational and reducing emissions!
            </p>
            <p className="mt-1 font-medium text-blue-800">
              Reduction: {reductionAmount} tons CO₂/year
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewableEnergy;
