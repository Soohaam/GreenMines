
import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import { 
  getMineColor, 
  getMineRadius, 
  getEmissionZoneRadius, 
  getValidRadius 
} from '../utils/mapUtils';
import L from 'leaflet';

const CoalMine = ({ mine, isSelected, emissions, onClick }) => {
  const { id, name, location, type, size } = mine;
  const color = getMineColor(type);
  const radius = getMineRadius(size);
  
  // Create custom marker icon with pulsing effect for selected mines
  const mineIcon = L.divIcon({
    className: 'custom-mine-marker',
    html: `<div style="
      width: ${radius * 2}px; 
      height: ${radius * 2}px; 
      background-color: ${color}; 
      border-radius: 50%; 
      border: ${isSelected ? '3px solid #4CAF50' : '2px solid white'};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 ${isSelected ? '15px rgba(76, 175, 80, 0.7)' : '10px rgba(0,0,0,0.5)'};
      color: white;
      font-weight: bold;
      font-size: ${radius * 0.7}px;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: ${isSelected ? 'pulse 2s infinite' : 'none'};
    ">${id}</div>
    <style>
      @keyframes pulse {
        0% {
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
        }
        50% {
          box-shadow: 0 0 25px rgba(76, 175, 80, 0.9);
        }
        100% {
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
        }
      }
    </style>`,
    iconSize: [radius * 2, radius * 2],
    iconAnchor: [radius, radius],
  });
  
  // Calculate mine area radius based on size
  const mineAreaRadius = getValidRadius((() => {
    switch(size) {
      case 'large': return 2000; // 2km
      case 'medium': return 1200; // 1.2km
      case 'small': return 800; // 800m
      default: return 1000;
    }
  })(), 1000);
  
  // Generate unique emission profiles for each mine
  // This ensures each mine has distinctly different emissions
  const getUniqueEmissions = () => {
    const baseEmissions = {
      CO2: 400 + (id * 150) + (size === 'large' ? 300 : size === 'medium' ? 150 : 0),
      methane: type === 'underground' ? (8 + (id * 4)) : (2 + (id * 2)),
      NOx: 3 + (id * 1.5),
      particulates: 15 + (id * 8)
    };
    
    // Apply randomization factor to create more variation (±20%)
    const randomizeFactor = 0.8 + (Math.random() * 0.4); // between 0.8 and 1.2
    
    return {
      CO2: Math.round(baseEmissions.CO2 * randomizeFactor),
      methane: Math.round(baseEmissions.methane * 10 * randomizeFactor) / 10,
      NOx: Math.round(baseEmissions.NOx * 10 * randomizeFactor) / 10,
      particulates: Math.round(baseEmissions.particulates * randomizeFactor)
    };
  };
  
  // Use the mine's specific emissions data or generate new ones
  const mineEmissions = mine.emissions || getUniqueEmissions();
  
  // Calculate total GHG in CO2 equivalent (methane has 28x warming potential, NOx has 265x)
  const totalGHG = mineEmissions.CO2 + (mineEmissions.methane * 28) + (mineEmissions.NOx * 265);
  
  // Calculate emission radius based on total GHG (more visibly different sizes now)
  const emissionRadius = isSelected ? 
    getValidRadius(Math.sqrt(totalGHG) * 50, 800) : // Make radius scale with square root of emissions for better visual representation
    0;
  
  const handleMarkerClick = (e) => {
    if (onClick) {
      onClick(id);
      // Stop propagation to prevent map click event
      e.originalEvent.stopPropagation();
    }
  };
  
  // Calculate color for emission zone based on intensity
  const getEmissionColor = () => {
    if (totalGHG > 5000) return 'rgba(255, 0, 0, 0.7)'; // High emissions - red
    if (totalGHG > 2500) return 'rgba(255, 140, 0, 0.7)'; // Medium emissions - orange
    return 'rgba(255, 180, 0, 0.7)'; // Lower emissions - amber
  };
  
  // Calculate opacity for emission zone based on intensity
  const getEmissionOpacity = () => {
    return Math.min(0.2 + (totalGHG / 10000), 0.7); // Ranges from 0.2 to 0.7 based on emissions
  };
  
  return (
    <>
      {/* Mine area circle */}
      <Circle
        center={location}
        radius={mineAreaRadius}
        pathOptions={{
          color: type === 'underground' ? '#3F51B5' : '#FF9800',
          fillColor: type === 'underground' ? '#3F51B5' : '#FF9800',
          fillOpacity: 0.1,
          weight: isSelected ? 2 : 1,
          dashArray: isSelected ? '' : '5, 5'
        }}
        eventHandlers={{
          click: handleMarkerClick
        }}
      >
        <Popup>
          <div className="font-bold text-lg">{name}</div>
          <div className="text-sm">
            Type: {type.charAt(0).toUpperCase() + type.slice(1)} Mine<br/>
            Size: {size.charAt(0).toUpperCase() + size.slice(1)}<br/>
            Area: {(Math.PI * mineAreaRadius * mineAreaRadius / 1000000).toFixed(2)} km²
          </div>
          {mineEmissions && (
            <div className="mt-2 pt-1 border-t border-gray-200">
              <div className="font-medium text-sm">Emissions:</div>
              <div className="grid grid-cols-2 gap-x-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${mineEmissions.CO2 > 500 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span>CO₂: {mineEmissions.CO2} tons</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${mineEmissions.methane > 10 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span>Methane: {mineEmissions.methane} tons</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${mineEmissions.NOx > 5 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span>NOx: {mineEmissions.NOx} tons</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${mineEmissions.particulates > 20 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span>Particulates: {mineEmissions.particulates} tons</span>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </Circle>
      
      {/* Mine center marker */}
      <Marker 
        position={location} 
        icon={mineIcon}
        eventHandlers={{
          click: handleMarkerClick
        }}
      >
        <Popup>
          <div className="font-bold text-lg">{name}</div>
          <div className="text-sm">
            Type: {type.charAt(0).toUpperCase() + type.slice(1)} Mine<br/>
            Size: {size.charAt(0).toUpperCase() + size.slice(1)}
            {type === "underground" && (
              <div className="mt-1 text-xs text-yellow-600 font-medium">
                ⚠️ May produce significant methane emissions
              </div>
            )}
          </div>
          {mineEmissions && (
            <div className="mt-2 pt-1 border-t border-gray-200">
              <div className="font-medium text-sm">Emissions:</div>
              <div className="space-y-1 mt-1">
                {Object.entries(mineEmissions).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${getEmissionColorClass(key, value)}`}
                        style={{width: `${Math.min((value / getMaxEmissionValue(key)) * 100, 100)}%`}}
                      ></div>
                    </div>
                    <span className="text-xs whitespace-nowrap">{key}: {value} tons</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button 
            className="mt-2 px-2 py-1 bg-simulation-primary text-white rounded text-xs w-full"
            onClick={(e) => {
              e.stopPropagation();
              onClick(id);
            }}
          >
            {isSelected ? 'Selected' : 'Select This Mine'}
          </button>
        </Popup>
      </Marker>
      
      {/* Render emission zone if selected */}
      {isSelected && emissionRadius > 0 && (
        <Circle
          center={location}
          radius={emissionRadius}
          pathOptions={{
            color: getEmissionColor(),
            fillColor: getEmissionColor(),
            fillOpacity: getEmissionOpacity(),
            weight: 1,
          }}
        >
          <Popup>
            <div className="font-medium">Emission Zone</div>
            <div className="text-sm">
              Total GHG: {totalGHG.toFixed(2)} tons CO₂e<br/>
              Radius: {(emissionRadius/1000).toFixed(2)} km
            </div>
            <div className="text-xs text-gray-600 mt-1">
              CO₂: {mineEmissions.CO2} tons<br/>
              Methane: {mineEmissions.methane} tons (x28 warming potential)<br/>
              NOx: {mineEmissions.NOx} tons (x265 warming potential)
            </div>
          </Popup>
        </Circle>
      )}
    </>
  );
};

// Helper function to determine emission color class
function getEmissionColorClass(type, value) {
  const thresholds = {
    CO2: { low: 300, medium: 600, high: 900 },
    methane: { low: 5, medium: 15, high: 30 },
    NOx: { low: 3, medium: 8, high: 15 },
    particulates: { low: 10, medium: 30, high: 60 }
  };
  
  const threshold = thresholds[type] || thresholds.CO2;
  
  if (value < threshold.low) return 'bg-green-500';
  if (value < threshold.medium) return 'bg-yellow-500';
  if (value < threshold.high) return 'bg-orange-500';
  return 'bg-red-500';
}

// Helper function to get max emission value for scaling
function getMaxEmissionValue(type) {
  const maxValues = {
    CO2: 1200,
    methane: 50,
    NOx: 30,
    particulates: 100
  };
  
  return maxValues[type] || 1000;
}

export default CoalMine;
