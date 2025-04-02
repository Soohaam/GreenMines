
import React, { useState } from 'react';
import { COAL_MINES } from '../utils/mapUtils';
import { AlertTriangle, MapPin, Settings, ChevronRight, ChevronDown, X, RefreshCw, Search, Truck } from 'lucide-react';
import EmissionFactors from './EmissionFactors';
import CarbonSinks from './CarbonSinks';
import RenewableEnergy from './RenewableEnergy';
import CaptureStorage from './CaptureStorage';
import Explosives from './Explosives';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const ControlPanel = ({ 
  selectedMine, 
  setSelectedMine, 
  onAddTree, 
  onAddRenewable, 
  onAddCcs, 
  onAddExplosive,
  onDetonateExplosive,
  onUpdateEmissionFactors,
  onApplyCarbonSink,
  onApplyRenewable,
  onApplyCcs,
  activeItem,
  setActiveItem,
  placementMode,
  setPlacementMode,
  onResetSimulation,
  cancelPlacement
}) => {
  const [activeTab, setActiveTab] = useState('mines');
  const [tabsExpanded, setTabsExpanded] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(500);
  const [simulationSpeed, setSimulationSpeed] = useState('normal');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = [
    { id: 'mines', label: 'Coal Mines', icon: MapPin },
    { id: 'emissions', label: 'Emissions', icon: AlertTriangle },
    { id: 'mitigation', label: 'Mitigation', icon: ChevronDown },
    { id: 'explosives', label: 'Explosives', icon: ChevronRight },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  // Handler for activating placement mode
  const handleActivatePlacement = (itemType, config = {}) => {
    if (!selectedMine && itemType !== 'tree' && itemType !== 'explosive') {
      console.log("Please select a coal mine first");
      return;
    }
    
    setActiveItem(itemType);
    setPlacementMode(true);
  };
  
  // Handler for canceling placement mode
  const handleCancelPlacement = () => {
    setActiveItem(null);
    setPlacementMode(false);
    if (cancelPlacement) {
      cancelPlacement();
    }
  };
  
  // Handler for activating transport search
  const handleActivateSearch = () => {
    setIsSearchActive(!isSearchActive);
  };
  
  // Handler for resetting the simulation
  const handleResetSimulation = () => {
    if (onResetSimulation) {
      onResetSimulation();
    }
  };
  
  return (
    <div className="simulation-panel h-full flex flex-col overflow-hidden bg-gradient-to-b from-green-50 to-blue-50 border-r border-gray-200">
      {/* Placement mode indicator */}
      {placementMode && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 flex justify-between items-center sticky top-0 z-20">
          <div className="text-sm font-medium">
            Placing: {activeItem}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 border-white text-white hover:bg-white/20 hover:text-white"
            onClick={handleCancelPlacement}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      )}
      
      {/* Tabs navigation - Fixed in place */}
      <div className="flex overflow-x-auto p-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 sticky top-0 z-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg mr-1 whitespace-nowrap flex items-center transition-all
              ${activeTab === tab.id ? 
                'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md' : 
                'bg-white/70 text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="mr-1 h-4 w-4" />
            {tabsExpanded && tab.label}
          </button>
        ))}
        
        <button 
          className="ml-auto px-2 py-2 text-gray-500 hover:text-gray-700 rounded-lg"
          onClick={() => setTabsExpanded(!tabsExpanded)}
        >
          {tabsExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Transport search button - Fixed position at bottom of panel */}
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg flex items-center justify-center"
          onClick={handleActivateSearch}
        >
          <Truck className="h-6 w-6" />
        </Button>
      </div>

      {/* Search panel */}
      {isSearchActive && (
        <div className="absolute bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg z-50 w-64 border border-gray-200">
          <h3 className="font-medium mb-2 flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Transport Search
          </h3>
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="text-sm text-gray-600">
            Search for ports, industrial sites, or other transport destinations
          </div>
        </div>
      )}
      
      {/* Main content - Entire panel scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Mine selector that's always visible in every tab except Mines tab */}
          {activeTab !== 'mines' && (
            <div className="mb-4 pb-3 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2">Selected Mine</div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {COAL_MINES.map(mine => (
                  <button
                    key={mine.id}
                    className={`p-2 rounded text-center transition-colors flex-shrink-0
                      ${selectedMine === mine.id ? 
                        'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-sm' : 
                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    onClick={() => setSelectedMine(mine.id)}
                  >
                    <div className="font-medium text-xs">{mine.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Tab content */}
          {activeTab === 'mines' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Coal Mines
              </h3>
              <p className="text-sm text-gray-600">
                Select a coal mine to focus on its operations and emissions.
              </p>
              
              <div className="grid grid-cols-1 gap-2 mt-2">
                {COAL_MINES.map(mine => (
                  <button
                    key={mine.id}
                    className={`p-3 rounded-lg text-left transition-colors flex items-center
                      ${selectedMine === mine.id ? 
                        'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md' : 
                        'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedMine(mine.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                      ${selectedMine === mine.id ? 
                        'bg-white text-blue-600' : 
                        `bg-${mine.type === 'underground' ? 'blue' : 'amber'}-100 text-${mine.type === 'underground' ? 'blue' : 'amber'}-700`
                      }`}
                    >
                      {mine.id}
                    </div>
                    <div>
                      <div className="font-medium">{mine.name}</div>
                      <div className="text-sm">
                        {mine.type.charAt(0).toUpperCase() + mine.type.slice(1)} Mine
                        {mine.type === 'underground' && (
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                            ${selectedMine === mine.id ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            Methane
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Emissions Tab */}
          {activeTab === 'emissions' && (
            <EmissionFactors 
              selectedMine={selectedMine}
              onUpdateEmissionFactors={onUpdateEmissionFactors}
            />
          )}
          
          {/* Mitigation Tab */}
          {activeTab === 'mitigation' && (
            <div className="space-y-6">
              <CarbonSinks 
                selectedMine={selectedMine}
                onAddTree={onAddTree} 
                onApplyCarbonSink={onApplyCarbonSink}
                onActivatePlacement={handleActivatePlacement}
                isPlacementMode={placementMode && activeItem === 'tree'}
              />
              
              <div className="border-t border-gray-200 pt-4">
                <RenewableEnergy 
                  selectedMine={selectedMine}
                  onAddRenewable={onAddRenewable}
                  onApplyRenewable={onApplyRenewable}
                  onActivatePlacement={handleActivatePlacement}
                  isPlacementMode={placementMode && (activeItem === 'renewable-solar' || activeItem === 'renewable-wind')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <CaptureStorage 
                  selectedMine={selectedMine}
                  onAddCcs={onAddCcs}
                  onApplyCcs={onApplyCcs}
                  onActivatePlacement={handleActivatePlacement}
                  isPlacementMode={placementMode && activeItem === 'ccs'}
                />
              </div>
            </div>
          )}
          
          {/* Explosives Tab */}
          {activeTab === 'explosives' && (
            <Explosives 
              selectedMine={selectedMine}
              onAddExplosive={onAddExplosive}
              onDetonateExplosive={onDetonateExplosive}
              onActivatePlacement={handleActivatePlacement}
              isPlacementMode={placementMode && activeItem === 'explosive'}
              cancelPlacement={handleCancelPlacement}
            />
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-gray-600" />
                Simulation Settings
              </h3>
              
              <p className="text-sm text-gray-600">
                Adjust settings for the carbon emission simulation.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700">Simulation Speed</label>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(e.target.value)}
                  >
                    <option value="normal">Normal (1x)</option>
                    <option value="fast">Fast (2x)</option>
                    <option value="very-fast">Very Fast (4x)</option>
                  </select>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700">Risk Threshold</label>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="100" 
                    value={riskThreshold}
                    onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="destructive" 
                    className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                    onClick={handleResetSimulation}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Simulation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ControlPanel;
