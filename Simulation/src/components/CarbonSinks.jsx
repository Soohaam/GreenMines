
import React, { useState, useEffect } from 'react';
import { COAL_MINES, getRandomLocationNearMine, generateUniqueId } from '../utils/mapUtils';
import { calculateCarbonSink } from '../utils/emissionCalculations';
import { toast } from 'sonner';
import { Slider } from './ui/slider'; 

const CarbonSinks = ({ selectedMine, onAddTree, onApplyCarbonSink, onActivatePlacement }) => {
  const [vegetationType, setVegetationType] = useState('Tropical forest');
  const [area, setArea] = useState(10);
  const [seedingTime, setSeedingTime] = useState(3); // years
  const [treesPlanted, setTreesPlanted] = useState(false);
  const [carbonReduction, setCarbonReduction] = useState(0);
  
  const vegetationTypes = [
    'Tropical forest',
    'Temperate forest',
    'Boreal forest',
    'Mangrove',
    'Grassland',
    'Bamboo'
  ];
  
  // Calculate carbon sink data whenever inputs change
  useEffect(() => {
    const sinkData = calculateCarbonSink(vegetationType, area);
    setCarbonReduction(sinkData.carbonSequestrationRate);
  }, [vegetationType, area]);
  
  const handlePlantTrees = () => {
    if (!selectedMine) return;
    
    const mine = COAL_MINES.find(m => m.id === selectedMine);
    if (!mine) return;
    
    const tree = {
      id: generateUniqueId(),
      type: vegetationType,
      area: area,
      position: getRandomLocationNearMine(mine.location),
      absorption: calculateCarbonSink(vegetationType, area).carbonSequestrationRate,
      maturityTime: seedingTime,
      mature: seedingTime === 0
    };
    
    onAddTree(tree);
    setTreesPlanted(true);
    
    // Apply carbon sink immediately regardless of maturity
    const sinkData = calculateCarbonSink(vegetationType, area);
    onApplyCarbonSink(sinkData);
    
    // Play planting sound
    const plantingSound = new Audio('/planting_sound.mp3');
    plantingSound.volume = 0.2;
    plantingSound.play().catch(e => console.log("Audio play failed:", e));
    
    if (seedingTime === 0) {
      toast.success(`${vegetationType} planted and actively capturing carbon!`);
    } else {
      toast.success(`${vegetationType} planted! It will mature in ${seedingTime} years.`);
      toast.info(`Carbon sequestration started at partial capacity.`);
    }
  };
  
  const handleAccelerateGrowth = () => {
    if (!treesPlanted) return;
    
    // Play growth acceleration sound
    const growthSound = new Audio('/planting_sound.mp3');
    growthSound.playbackRate = 1.5;
    growthSound.volume = 0.3;
    growthSound.play().catch(e => console.log("Audio play failed:", e));
    
    // Apply full sequestration rate when accelerating growth
    const sinkData = calculateCarbonSink(vegetationType, area);
    onApplyCarbonSink({
      ...sinkData,
      carbonSequestrationRate: sinkData.carbonSequestrationRate * 1.5 // Boost effect for acceleration
    });
    
    toast.success("Growth accelerated! Carbon sink effects at maximum capacity.");
  };
  
  const handleActivatePlacement = () => {
    const config = {
      treeType: vegetationType,
      area: area,
      absorption: carbonReduction
    };
    onActivatePlacement('tree', config);
  };
  
  if (!selectedMine) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          Please select a coal mine first to plant trees as carbon sinks.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto max-h-[350px]">
      <h4 className="text-md font-medium text-simulation-dark mb-3">Carbon Sink: Tree Plantation</h4>
      <p className="text-sm text-gray-600 mb-4">
        Plant trees to absorb CO₂ emissions from coal mining operations.
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vegetation Type
          </label>
          <select
            value={vegetationType}
            onChange={(e) => setVegetationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {vegetationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Area (hectares)</span>
            <span className="text-simulation-primary font-bold">{area} ha</span>
          </label>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[area]}
            onValueChange={(value) => setArea(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 ha</span>
            <span>100 ha</span>
          </div>
        </div>
        
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Seeding Time (years)</span>
            <span className="text-simulation-primary font-bold">{seedingTime} years</span>
          </label>
          <Slider
            min={0}
            max={10}
            step={1}
            value={[seedingTime]}
            onValueChange={(value) => setSeedingTime(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Instant</span>
            <span>10 years</span>
          </div>
        </div>
        
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={handlePlantTrees}
            disabled={treesPlanted}
            className={`px-4 py-2 rounded-lg text-white font-medium 
              ${treesPlanted ? 'bg-gray-400 cursor-not-allowed' : 'bg-simulation-primary hover:bg-simulation-secondary'} 
              transition-colors`}
          >
            {treesPlanted ? 'Trees Planted' : 'Plant Trees'}
          </button>
          
          <button
            onClick={handleActivatePlacement}
            className="px-4 py-2 rounded-lg text-white font-medium bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            Place on Map
          </button>
        </div>
        
        {treesPlanted && seedingTime > 0 && (
          <button
            onClick={handleAccelerateGrowth}
            className="w-full px-4 py-2 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 transition-colors"
          >
            Accelerate Growth to Maturity
          </button>
        )}
        
        {treesPlanted && (
          <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm">
            <p className="text-green-700">
              <span className="font-medium">{vegetationType}</span> planted on <span className="font-medium">{area} hectares</span>
            </p>
            {seedingTime > 0 ? (
              <p className="text-green-600 mt-1">
                Trees will mature in {seedingTime} years. Use the accelerate button to speed up growth.
              </p>
            ) : (
              <p className="text-green-600 mt-1">
                Trees are already mature and absorbing CO₂!
              </p>
            )}
            <p className="mt-1 font-medium text-green-800">
              Potential absorption: {carbonReduction} tons CO₂/year
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonSinks;
