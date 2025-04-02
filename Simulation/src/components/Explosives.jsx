
import React, { useState } from 'react';
import { Bomb, Triangle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { generateUniqueId } from '../utils/mapUtils';

const Explosives = ({ 
  selectedMine, 
  onAddExplosive, 
  onDetonateExplosive, 
  onActivatePlacement, 
  isPlacementMode,
  cancelPlacement 
}) => {
  const [explosiveType, setExplosiveType] = useState('ANFO');
  const [amount, setAmount] = useState(500);
  const [explosives, setExplosives] = useState([]);
  
  const explosiveTypes = [
    'ANFO',
    'Black powder',
    'Dynamite, straight',
    'Dynamite, ammonia',
    'Dynamite, gelatin',
    'TNT',
    'RDX',
    'PETN'
  ];
  
  const handleActivatePlacement = () => {
    if (!selectedMine) return;
    if (isPlacementMode) {
      // If already in placement mode, cancel it
      cancelPlacement();
    } else {
      // Activate placement mode with current config
      onActivatePlacement('explosive', { type: explosiveType, amount: amount });
    }
  };
  
  const handleDetonateAll = () => {
    // Find all undetonated explosives
    const undetonatedExplosives = explosives.filter(e => !e.detonated);
    
    if (undetonatedExplosives.length === 0) return;
    
    // Mark all as detonated
    const updatedExplosives = explosives.map(e => 
      !e.detonated ? { ...e, detonated: true } : e
    );
    
    setExplosives(updatedExplosives);
    
    // Trigger detonation for all at once
    onDetonateExplosive(undetonatedExplosives);
  };
  
  const handleDetonateExplosive = (id) => {
    // Find the explosive
    const explosive = explosives.find(e => e.id === id);
    if (!explosive || explosive.detonated) return;
    
    // Mark as detonated
    const updatedExplosives = explosives.map(e => 
      e.id === id ? { ...e, detonated: true } : e
    );
    
    setExplosives(updatedExplosives);
    
    // Trigger detonation in parent component
    onDetonateExplosive(explosive);
  };
  
  // Check if we have any undetonated explosives
  const hasUndetonated = explosives.some(e => !e.detonated);
  
  React.useEffect(() => {
    // Update our local state when explosives are added externally
    const handleExplosiveAdded = (explosive) => {
      if (!explosives.some(e => e.id === explosive.id)) {
        setExplosives(prev => [...prev, explosive]);
      }
    };
    
    // Subscribe to the event
    const handleExplosiveEvent = (e) => {
      if (e.detail && !explosives.some(ex => ex.id === e.detail.id)) {
        handleExplosiveAdded(e.detail);
      }
    };
    
    window.addEventListener('explosiveAdded', handleExplosiveEvent);
    
    return () => {
      window.removeEventListener('explosiveAdded', handleExplosiveEvent);
    };
  }, [explosives]);
  
  if (!selectedMine) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2 text-yellow-700">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Please select a coal mine first to add explosives.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Bomb className="mr-2 h-5 w-5 text-red-600" />
        Explosives Management
      </h3>
      <p className="text-sm text-gray-600">
        Add and detonate explosives for coal mining operations.
      </p>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">New Explosive</CardTitle>
          <CardDescription>Configure and place explosives on the map</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explosive Type
            </label>
            <select
              value={explosiveType}
              onChange={(e) => setExplosiveType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isPlacementMode}
            >
              {explosiveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (kg)
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full"
              disabled={isPlacementMode}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>100 kg</span>
              <span>{amount} kg</span>
              <span>2000 kg</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleActivatePlacement}
            className={`w-full flex items-center justify-center ${isPlacementMode ? 'bg-red-500 hover:bg-red-600' : 'bg-primary'}`}
          >
            <Triangle className="mr-2 h-4 w-4" />
            {isPlacementMode ? 'Cancel Placement' : 'Place on Map'}
          </Button>
        </CardFooter>
      </Card>
      
      {explosives.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Placed Explosives</CardTitle>
            <CardDescription>
              {hasUndetonated 
                ? 'Manage your placed explosives'
                : 'All explosives have been detonated'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {explosives.map(explosive => (
                <div 
                  key={explosive.id} 
                  className={`p-3 rounded-lg border ${explosive.detonated 
                    ? 'bg-gray-50 border-gray-300' 
                    : 'bg-white border-red-200 hover:border-red-300 transition-colors'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">{explosive.type}</div>
                      <div className="text-sm text-gray-600">
                        Amount: {explosive.amount} kg
                      </div>
                    </div>
                    
                    {explosive.detonated ? (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                        Detonated
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleDetonateExplosive(explosive.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Detonate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          {hasUndetonated && (
            <CardFooter>
              <Button 
                onClick={handleDetonateAll}
                className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
              >
                <Bomb className="mr-2 h-4 w-4" />
                Detonate All
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
      
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-amber-800">Safety Information</h4>
          </div>
          <p className="mt-2 text-sm text-amber-700">
            Explosives are essential for coal mining operations but contribute to overall emissions. 
            Different explosive types produce varying levels of CO₂, CO, NOx, and other emissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Explosives;
