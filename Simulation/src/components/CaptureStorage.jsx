
import React, { useState, useEffect } from 'react';
import { COAL_MINES, getRandomLocationNearMine, generateUniqueId } from '../utils/mapUtils';
import { calculateCaptureImpact } from '../utils/emissionCalculations';
import { toast } from 'sonner';

const CaptureStorage = ({ selectedMine, onAddCcs, onApplyCcs, onActivatePlacement }) => {
  const [facilityType, setFacilityType] = useState('Carbon Capture & Storage (CCS)');
  const [technology, setTechnology] = useState('Post-combustion');
  const [captureRate, setCaptureRate] = useState(70);
  const [facilityAdded, setFacilityAdded] = useState(false);
  const [captureAmount, setCaptureAmount] = useState(0);
  
  const facilityTypes = [
    'Carbon Capture & Storage (CCS)',
    'Methane Capture System (MCS)'
  ];
  
  const technologies = {
    'Carbon Capture & Storage (CCS)': [
      'Post-combustion',
      'Pre-combustion',
      'Oxyfuel combustion'
    ],
    'Methane Capture System (MCS)': [
      'Ventilation Air Methane (VAM)',
      'Degasification',
      'Flaring'
    ]
  };
  
  // Calculate the capture impact when inputs change
  useEffect(() => {
    const isCCS = facilityType === 'Carbon Capture & Storage (CCS)';
    const estimatedEmissions = isCCS ? 1000 : 300; // tons CO2 or methane
    
    const captureData = calculateCaptureImpact(
      estimatedEmissions,
      isCCS ? 'CO2' : 'CH4',
      captureRate,
      technology
    );
    
    setCaptureAmount(isCCS ? captureData.capturedCO2 : captureData.capturedMethane);
  }, [facilityType, technology, captureRate]);
  
  const handleAddFacility = () => {
    if (!selectedMine) {
      toast.error("Please select a coal mine first");
      return;
    }
    
    const mine = COAL_MINES.find(m => m.id === selectedMine);
    if (!mine) return;
    
    const isCCS = facilityType === 'Carbon Capture & Storage (CCS)';
    const estimatedEmissions = isCCS ? 1000 : 300; // tons CO2 or methane
    
    const captureData = calculateCaptureImpact(
      estimatedEmissions,
      isCCS ? 'CO2' : 'CH4',
      captureRate,
      technology
    );
    
    const facility = {
      id: generateUniqueId(),
      type: facilityType,
      technology: technology,
      position: getRandomLocationNearMine(mine.location),
      captureRate: captureRate,
      capture: isCCS ? captureData.capturedCO2 : captureData.capturedMethane,
      isActive: true
    };
    
    onAddCcs(facility);
    
    // Apply the capture impact to emissions immediately
    const reductionData = isCCS ? { 
      ccs: { capture: captureData.capturedCO2.toString() } 
    } : { 
      mcs: { capturedMethane: captureData.capturedMethane.toString() } 
    };
    
    onApplyCcs(reductionData);
    setFacilityAdded(true);
    toast.success(`${facilityType} facility installed successfully!`);
  };
  
  const handleActivatePlacement = () => {
    if (!selectedMine) {
      toast.error("Please select a coal mine first");
      return;
    }
    
    const isCCS = facilityType === 'Carbon Capture & Storage (CCS)';
    const estimatedEmissions = isCCS ? 1000 : 300; // tons CO2 or methane
    
    const captureData = calculateCaptureImpact(
      estimatedEmissions,
      isCCS ? 'CO2' : 'CH4',
      captureRate,
      technology
    );
    
    const config = {
      facilityType: facilityType,
      technology: technology,
      capture: isCCS ? captureData.capturedCO2 : captureData.capturedMethane
    };
    
    onActivatePlacement('ccs', config);
  };
  
  if (!selectedMine) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          Please select a coal mine first to add carbon capture facilities.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto max-h-[350px]">
      <h4 className="text-md font-medium text-simulation-dark mb-3">Carbon & Methane Capture</h4>
      <p className="text-sm text-gray-600 mb-4">
        Install carbon capture facilities or methane capture systems to reduce emissions.
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facility Type
          </label>
          <select
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {facilityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technology
          </label>
          <select
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {(technologies[facilityType] || []).map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capture Rate (%)
          </label>
          <input
            type="range"
            min="30"
            max="95"
            step="5"
            value={captureRate}
            onChange={(e) => setCaptureRate(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>30%</span>
            <span>{captureRate}%</span>
            <span>95%</span>
          </div>
        </div>
        
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddFacility}
            disabled={facilityAdded}
            className={`px-4 py-2 rounded-lg text-white font-medium 
              ${facilityAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-simulation-primary hover:bg-simulation-secondary'} 
              transition-colors`}
          >
            {facilityAdded ? 'Facility Added' : 'Add Facility'}
          </button>
          
          <button
            onClick={handleActivatePlacement}
            className="px-4 py-2 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Place on Map
          </button>
        </div>
        
        {facilityAdded && (
          <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm">
            <p className="text-purple-700">
              <span className="font-medium">{facilityType}</span> with <span className="font-medium">{technology}</span> technology
            </p>
            <p className="text-purple-600 mt-1">
              Facility is operational with {captureRate}% capture efficiency.
            </p>
            <p className="mt-1 font-medium text-purple-800">
              Capturing: {captureAmount} tons {facilityType === 'Carbon Capture & Storage (CCS)' ? 'CO₂' : 'CH₄'}/year
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureStorage;
