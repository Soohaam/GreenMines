import React, { useState, useEffect, useRef } from 'react';
import SimulationMap from '../components/SimulationMap';
import ControlPanel from '../components/ControlPanel';
import ResultsPanel from '../components/ResultsPanel';
import { 
  COAL_MINES, 
  TRANSPORT_DESTINATIONS,
  generateUniqueId, 
  getValidRadius 
} from '../utils/mapUtils';
import { toast } from 'sonner';
import { ArrowLeft, Info, MapPin, BarChart, ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { 
  calculateElectricityEmissions, 
  calculateFuelEmissions, 
  calculateShippingEmissions,
  calculateExplosionEmissions,
  calculateCoalEmissions,
  calculateTotalEmissions,
  calculateNetEmissions
} from '../utils/emissionCalculations';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';

const Simulation = () => {
  // Map state
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedMine, setSelectedMine] = useState(null);
  
  // Placement state
  const [activeItem, setActiveItem] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [placementConfig, setPlacementConfig] = useState({});
  
  // UI state
  const [controlCollapsed, setControlCollapsed] = useState(false);
  const [resultsCollapsed, setResultsCollapsed] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Elements on the map
  const [trees, setTrees] = useState([]);
  const [renewables, setRenewables] = useState([]);
  const [ccsFacilities, setCcsFacilities] = useState([]);
  const [explosives, setExplosives] = useState([]);
  const [shipments, setShipments] = useState([]);
  
  // Emission factors and calculations
  const [emissionFactors, setEmissionFactors] = useState({
    electricity: {
      energyPerTime: 1000,
      responsibleArea: 50,
      totalArea: 100
    },
    fuel: {
      fuelType: 'diesel',
      volume: 500
    },
    shipping: {
      weight: 1000,
      distance: 200,
      transportMethod: 'truck'
    },
    coal: {
      coalType: 'Bituminous',
      coalConsumption: 100
    }
  });
  
  // Calculated emissions
  const [emissions, setEmissions] = useState({
    electricity: null,
    fuel: null,
    shipping: null,
    explosion: null,
    coal: null,
  });
  
  // Reduction strategies
  const [reductions, setReductions] = useState({
    carbonSink: null,
    renewable: null,
    ccs: null,
    mcs: null,
  });
  
  // Net emissions calculation
  const [netEmissions, setNetEmissions] = useState(null);
  
  // Handle item placement from map
  const handleItemPlace = (item) => {
    if (!selectedMine && !['tree', 'explosive'].includes(item.type)) {
      toast.error("Please select a coal mine first");
      return;
    }
    
    const mine = COAL_MINES.find(m => m.id === selectedMine);
    
    switch (item.type) {
      case 'tree':
        const newTree = {
          id: generateUniqueId(),
          type: placementConfig.treeType || 'Oak',
          area: placementConfig.area || 2,
          absorption: placementConfig.absorption || 10,
          position: item.position
        };
        setTrees(prev => [...prev, newTree]);
        
        // Update carbon sink reductions
        setReductions(prev => {
          const currentAbsorption = prev.carbonSink?.absorption || 0;
          return {
            ...prev,
            carbonSink: {
              ...prev.carbonSink,
              absorption: currentAbsorption + newTree.absorption,
              trees: [...(prev.carbonSink?.trees || []), newTree],
              dailySequestrationRate: ((currentAbsorption + newTree.absorption) / 365).toFixed(2) + " tons/day"
            }
          };
        });
        toast.success(`${newTree.type} planted successfully! Reducing ${newTree.absorption} tons CO₂/year`);
        break;
        
      case 'renewable-solar':
      case 'renewable-wind':
        const renewableType = item.type === 'renewable-solar' ? 'Solar' : 'Wind';
        const newRenewable = {
          id: generateUniqueId(),
          type: renewableType,
          capacity: placementConfig.capacity || 5,
          reduction: placementConfig.reduction || 20,
          position: item.position
        };
        setRenewables(prev => [...prev, newRenewable]);
        
        // Update renewable reductions
        setReductions(prev => {
          const currentReduction = prev.renewable?.reduction || 0;
          return {
            ...prev,
            renewable: {
              ...prev.renewable,
              reduction: currentReduction + newRenewable.reduction,
              facilities: [...(prev.renewable?.facilities || []), newRenewable],
              totalCo2ReductionPerDay: ((currentReduction + newRenewable.reduction) / 365).toFixed(2) + " tons/day"
            }
          };
        });
        toast.success(`${renewableType} facility added! Reducing ${newRenewable.reduction} tons CO₂/year`);
        break;
        
      case 'ccs':
        const newFacility = {
          id: generateUniqueId(),
          type: placementConfig.facilityType || 'CCS',
          technology: placementConfig.technology || 'Post-combustion',
          capture: placementConfig.capture || 1000,
          position: item.position
        };
        setCcsFacilities(prev => [...prev, newFacility]);
        
        // Update CCS reductions
        setReductions(prev => {
          const currentCapture = prev.ccs?.capture ? parseFloat(prev.ccs.capture) : 0;
          const newCapture = currentCapture + newFacility.capture;
          return {
            ...prev,
            ccs: {
              ...prev.ccs,
              capture: newCapture.toString(),
              capturedCO2: newCapture.toString() + " tons/year",
              facilities: [...(prev.ccs?.facilities || []), newFacility]
            }
          };
        });
        toast.success(`${newFacility.type} facility added! Capturing ${newFacility.capture} tons CO₂/year`);
        break;
        
      case 'explosive':
        const newExplosive = {
          id: generateUniqueId(),
          type: placementConfig.type || 'ANFO',
          amount: placementConfig.amount || 500,
          position: item.position,
          detonated: false
        };
        setExplosives(prev => [...prev, newExplosive]);
        toast.success(`Explosive placed! Ready for detonation.`);
        break;
        
      default:
        break;
    }
  };
  
  // Handle tree addition
  const handleAddTree = (tree) => {
    setTrees(prev => [...prev, tree]);
  };
  
  // Handle renewable addition
  const handleAddRenewable = (renewable) => {
    setRenewables(prev => [...prev, renewable]);
  };
  
  // Handle CCS/MCS facility addition
  const handleAddCcs = (facility) => {
    setCcsFacilities(prev => [...prev, facility]);
  };
  
  // Handle explosive addition
  const handleAddExplosive = (explosive) => {
    setExplosives(prev => [...prev, explosive]);
    setPlacementConfig({});
  };
  
  // Handle shipment addition
  const handleAddShipment = (shipment) => {
    setShipments(prev => [...prev, shipment]);
    
    // Update emission factors for shipping
    const newDistance = shipment.route.distance || 200;
    const newWeight = 1000; // Balanced default weight
    
    setEmissionFactors(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        distance: newDistance,
        weight: newWeight
      }
    }));
    
    toast.success(`Shipment created! Distance: ${newDistance} km`);
  };
  
  // Handle explosive detonation
  const handleDetonateExplosive = (explosivesToDetonate) => {
    if (!Array.isArray(explosivesToDetonate)) {
      explosivesToDetonate = [explosivesToDetonate];
    }
    
    // Mark explosives as detonated
    setExplosives(prev => 
      prev.map(exp => 
        explosivesToDetonate.some(e => e.id === exp.id) 
          ? { ...exp, detonated: true } 
          : exp
      )
    );
    
    // Calculate emissions from all explosives
    let totalCO2 = 0;
    let totalNOx = 0;
    let totalCO = 0;
    
    explosivesToDetonate.forEach(explosive => {
      const explosionEmission = calculateExplosionEmissions(explosive.type, explosive.amount);
      
      const co2Value = parseFloat(explosionEmission.CO2);
      const noxValue = parseFloat(explosionEmission.NOx || 0);
      const coValue = parseFloat(explosionEmission.CO || 0);
      
      if (!isNaN(co2Value)) totalCO2 += co2Value;
      if (!isNaN(noxValue)) totalNOx += noxValue;
      if (!isNaN(coValue)) totalCO += coValue;
    });
    
    // Update emissions state
    setEmissions(prev => {
      const currentCO2 = parseFloat((prev.explosion?.CO2 || "0").replace(" tons", "")) || 0;
      const currentNOx = parseFloat((prev.explosion?.NOx || "0").replace(" tons", "")) || 0;
      const currentCO = parseFloat((prev.explosion?.CO || "0").replace(" tons", "")) || 0;
      
      return {
        ...prev,
        explosion: {
          CO2: (currentCO2 + totalCO2).toFixed(4) + " tons",
          NOx: (currentNOx + totalNOx).toFixed(4) + " tons",
          CO: (currentCO + totalCO).toFixed(4) + " tons"
        }
      };
    });
    
    toast.success(`Detonated ${explosivesToDetonate.length} explosive(s)! Released ${totalCO2.toFixed(2)} tons CO₂`);
  };
  
  // Handle emission factors update
  const handleUpdateEmissionFactors = (factors) => {
    setEmissionFactors(factors);
  };
  
  // Apply carbon sink to reductions
  const handleApplyCarbonSink = (sinkData) => {
    setReductions(prev => ({
      ...prev,
      carbonSink: {
        ...sinkData,
        trees: prev.carbonSink?.trees || []
      }
    }));
  };
  
  // Apply renewable energy to reductions
  const handleApplyRenewable = (renewableData) => {
    setReductions(prev => ({
      ...prev,
      renewable: {
        ...renewableData,
        facilities: prev.renewable?.facilities || []
      }
    }));
  };
  
  // Apply CCS/MCS to reductions
  const handleApplyCcs = (data) => {
    setReductions(prev => ({
      ...prev,
      ...data,
      ccs: {
        ...(data.ccs || {}),
        facilities: prev.ccs?.facilities || []
      }
    }));
  };
  
  // Placement mode activation handler
  const handleActivatePlacement = (itemType, config = {}) => {
    setActiveItem(itemType);
    setPlacementMode(true);
    setPlacementConfig(config);
    toast.info(`Placement mode: ${itemType}`);
  };
  
  // Cancel placement handler
  const handleCancelPlacement = () => {
    setActiveItem(null);
    setPlacementMode(false);
    setPlacementConfig({});
    toast.info("Placement cancelled");
  };
  
  // Reset simulation handler
  const handleResetSimulation = () => {
    if (window.confirm("Are you sure you want to reset the simulation? All your data will be lost.")) {
      // Reset map elements
      setTrees([]);
      setRenewables([]);
      setCcsFacilities([]);
      setExplosives([]);
      setShipments([]);
      
      // Reset emissions
      setEmissions({
        electricity: null,
        fuel: null,
        shipping: null,
        explosion: null,
        coal: null,
      });
      
      // Reset reductions
      setReductions({
        carbonSink: null,
        renewable: null,
        ccs: null,
        mcs: null,
      });
      
      // Reset emission factors to default
      setEmissionFactors({
        electricity: {
          energyPerTime: 1000,
          responsibleArea: 50,
          totalArea: 100
        },
        fuel: {
          fuelType: 'diesel',
          volume: 500
        },
        shipping: {
          weight: 1000,
          distance: 200,
          transportMethod: 'truck'
        },
        coal: {
          coalType: 'Bituminous',
          coalConsumption: 100
        }
      });
      
      // Reset placement mode
      setActiveItem(null);
      setPlacementMode(false);
      setPlacementConfig({});
      
      // Reset heatmap view
      setShowHeatmap(false);
      
      toast.success("Simulation reset successfully");
    }
  };

  // Toggle heatmap view
  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
    toast.info(`Heatmap ${showHeatmap ? 'hidden' : 'shown'}`);
  };

  // Calculate emissions based on factors
  useEffect(() => {
    if (!emissionFactors.electricity && !emissionFactors.fuel && 
        !emissionFactors.shipping && !emissionFactors.coal) {
      return;
    }
    
    const newEmissions = { ...emissions };
    
    // Calculate electricity emissions
    if (emissionFactors.electricity) {
      const { energyPerTime, responsibleArea, totalArea } = emissionFactors.electricity;
      newEmissions.electricity = calculateElectricityEmissions(
        energyPerTime, 
        responsibleArea, 
        totalArea
      );
    }
    
    // Calculate fuel emissions
    if (emissionFactors.fuel) {
      const { fuelType, volume } = emissionFactors.fuel;
      newEmissions.fuel = calculateFuelEmissions(fuelType, volume);
    }
    
    // Calculate shipping emissions
    if (emissionFactors.shipping) {
      const { weight, distance, transportMethod } = emissionFactors.shipping;
      newEmissions.shipping = calculateShippingEmissions(
        weight, 
        distance, 
        transportMethod
      );
    }
    
    // Calculate coal emissions
    if (emissionFactors.coal) {
      const { coalType, coalConsumption } = emissionFactors.coal;
      newEmissions.coal = calculateCoalEmissions(coalType, coalConsumption);
    }
    
    setEmissions(newEmissions);
  }, [emissionFactors]);
  
  // Calculate total and net emissions
  useEffect(() => {
    if (!emissions.electricity && !emissions.fuel && 
        !emissions.shipping && !emissions.coal) {
      return;
    }
    
    // Calculate total emissions
    const totalEmissions = calculateTotalEmissions(emissions);
    
    // Calculate net emissions after reductions
    const netEmissionsResult = calculateNetEmissions(totalEmissions, reductions);
    
    setNetEmissions(netEmissionsResult);
  }, [emissions, reductions]);
  
  // Auto-increase emission factors over time
  useEffect(() => {
    if (!selectedMine) return;
    
    const interval = setInterval(() => {
      setEmissionFactors(prev => {
        if (!prev.electricity) return prev;
        
        return {
          ...prev,
          electricity: {
            ...prev.electricity,
            energyPerTime: Math.min(prev.electricity.energyPerTime * 1.01, 5000)
          },
          fuel: {
            ...prev.fuel,
            volume: Math.min(prev.fuel.volume * 1.005, 2000)
          },
          coal: {
            ...prev.coal,
            coalConsumption: Math.min(prev.coal.coalConsumption * 1.008, 500)
          }
        };
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedMine]);
  
  // Update emission factors based on selected mine
  useEffect(() => {
    if (!selectedMine && COAL_MINES.length > 0) {
      setSelectedMine(COAL_MINES[0].id);
    }
    
    if (selectedMine) {
      const selectedMineData = COAL_MINES.find(m => m.id === selectedMine);
      if (selectedMineData) {
        const mineIndex = selectedMine;
        
        let baseElectricity, baseFuelVolume, baseCoalConsumption, baseDistance;
        
        switch(mineIndex) {
          case 1:
            baseElectricity = 1500;
            baseFuelVolume = 800;
            baseCoalConsumption = 200;
            baseDistance = 150;
            break;
          case 2:
            baseElectricity = 2800;
            baseFuelVolume = 600;
            baseCoalConsumption = 400;
            baseDistance = 180;
            break;
          case 3:
            baseElectricity = 950;
            baseFuelVolume = 1200;
            baseCoalConsumption = 300;
            baseDistance = 100;
            break;
          default:
            baseElectricity = 1800;
            baseFuelVolume = 750;
            baseCoalConsumption = 250;
            baseDistance = 120;
        }
        
        setEmissionFactors(prev => ({
          ...prev,
          electricity: {
            ...prev.electricity,
            energyPerTime: baseElectricity,
            responsibleArea: 40 + (mineIndex * 15),
            totalArea: 100
          },
          fuel: {
            fuelType: 'diesel',
            volume: baseFuelVolume
          },
          shipping: {
            weight: Math.min(600 + (mineIndex * 100), 900),
            distance: baseDistance,
            transportMethod: 'truck'
          },
          coal: {
            coalType: selectedMineData.type === 'underground' ? 'Bituminous' : 'Lignite',
            coalConsumption: baseCoalConsumption
          }
        }));
      }
    }
  }, [selectedMine]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-green-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Green Mine Metrics</h1>
              <p className="text-xs text-green-100">Coal Mining Carbon Emission Simulator</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              onClick={toggleHeatmap}
            >
              <BarChart className="w-4 h-4 mr-1" />
              {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
            </button>
            
            <button 
         className="flex items-center px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm"
         onClick={() => window.history.back()}
       >
         <ArrowLeft className="w-4 h-4 mr-1" />
         Go Back
       </button>
          </div>
        </div>
      </header>
      
      {/* Main Content with Flexible Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
        {/* Control Panel - Left sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="flex-shrink-0">
          <div className={`h-full transition-all duration-300`}>
            <ControlPanel 
              selectedMine={selectedMine}
              setSelectedMine={setSelectedMine}
              onAddTree={handleAddTree}
              onAddRenewable={handleAddRenewable}
              onAddCcs={handleAddCcs}
              onAddExplosive={handleAddExplosive}
              onDetonateExplosive={handleDetonateExplosive}
              onUpdateEmissionFactors={handleUpdateEmissionFactors}
              onApplyCarbonSink={handleApplyCarbonSink}
              onApplyRenewable={handleApplyRenewable}
              onApplyCcs={handleApplyCcs}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              placementMode={placementMode}
              setPlacementMode={setPlacementMode}
              cancelPlacement={handleCancelPlacement}
              onActivatePlacement={handleActivatePlacement}
              onResetSimulation={handleResetSimulation}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-gray-200 hover:bg-gray-300">
          <div className="flex flex-col h-full justify-center items-center">
            <div className="w-1 h-8 rounded-full bg-gray-400"></div>
          </div>
        </ResizableHandle>
          
        {/* Map and Results Section */}
        <ResizablePanel defaultSize={80} className="flex flex-col">
          <div className="flex flex-1 flex-col relative">
            {/* Vertical resizable layout */}
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Map area - takes up most of the space */}
              <ResizablePanel defaultSize={75} minSize={30}>
                <div className="h-full relative">
                  <SimulationMap 
                    selectedMine={selectedMine}
                    setSelectedMine={setSelectedMine}
                    trees={trees}
                    renewables={renewables}
                    ccs={ccsFacilities}
                    explosives={explosives}
                    shipments={shipments}
                    emissions={netEmissions}
                    setMapInstance={setMapInstance}
                    activeItem={activeItem}
                    onItemPlace={handleItemPlace}
                    placementMode={placementMode}
                    setPlacementMode={setPlacementMode}
                    setActiveItem={setActiveItem}
                    onDetonateExplosive={handleDetonateExplosive}
                    placementConfig={placementConfig}
                    onAddShipment={handleAddShipment}
                    onResetSimulation={handleResetSimulation}
                    showHeatmap={showHeatmap}
                  />
                </div>
              </ResizablePanel>
              
              {/* Resizable handle with toggle button */}
              <ResizableHandle withHandle className="bg-gray-200 hover:bg-gray-300">
                <div className="flex justify-center py-1">
                  <button 
                    onClick={() => setResultsCollapsed(!resultsCollapsed)}
                    className="focus:outline-none"
                    aria-label={resultsCollapsed ? "Expand results" : "Collapse results"}
                  >
                    {resultsCollapsed ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
                  </button>
                </div>
              </ResizableHandle>
              
              {/* Results panel area - can be resized by user */}
              <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
                <div className="h-full border-t border-gray-200 shadow-lg overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200 sticky top-0 z-20">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <BarChart className="mr-2 h-5 w-5 text-green-600" />
                      Emission Results
                    </h3>
                    <button
                      className="p-1 hover:bg-gray-200 rounded-full"
                      onClick={() => setResultsCollapsed(!resultsCollapsed)}
                      aria-label={resultsCollapsed ? "Expand results" : "Collapse results"}
                    >
                      {resultsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {!resultsCollapsed && (
                    <ResultsPanel 
                      emissions={emissions}
                      reductions={reductions}
                      netEmissions={netEmissions}
                      shipments={shipments}
                      selectedMine={selectedMine}
                    />
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Simulation;
