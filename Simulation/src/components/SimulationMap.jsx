import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { 
  INDIA_CENTER, 
  COAL_MINES, 
  TRANSPORT_DESTINATIONS,
  getMineColor, 
  getMineRadius, 
  getEmissionZoneRadius, 
  isWithinIndiaBounds, 
  calculateShortestRoute,
  getValidRadius,
  generateHeatmapData,
  getHeatColor
} from '../utils/mapUtils';
import CoalMine from './CoalMine';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import {Map, BarChart3, RefreshCw, Search, X} from 'lucide-react';
import { Button } from './ui/button';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (Component, color = "white", bgColor = "#3F51B5", size = [32, 32]) => {
  return L.divIcon({
    className: 'custom-icon-marker',
    html: `<div style="
      width: ${size[0]}px; 
      height: ${size[1]}px; 
      background-color: ${bgColor}; 
      border-radius: 50%; 
      display: flex;
      align-items: center;
      justify-center;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      color: ${color};
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${Component === 'Bomb' ? 
          '<circle cx="12" cy="8.25" r="6.25" stroke="white" /><path d="M6.5 8.25V19.25M17.5 8.25V19.25M3.5 19.25H20.5" stroke="white" />' : 
        Component === 'Tree' ? 
          '<path d="M12 22V12M12 8V7M9 9c0-3.5 6-3.5 6 0 0 1.5-2 2-3 2s-3-.5-3-2z" stroke="white" /><path d="M12 7c0-1 .5-2 2.5-2 1.5 0 2.5 1 2.5 2 0 1.5-2 2-2.5 2" stroke="white" /><path d="M12 7c0-1-.5-2-2.5-2-1.5 0-2.5 1-2.5 2 0 1.5 2 2 2.5 2" stroke="white" />' : 
        Component === 'Sun' ?
          '<circle cx="12" cy="12" r="4" stroke="white" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="white" />' :
        Component === 'Wind' ?
          '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2" stroke="white" />' :
        Component === 'Truck' ?
          '<path d="M10 17h4V5H2v12h3m15-5h-4V7h6l-2 5z M15 17H7 M17 17h1a1 1 0 000-2v-3" stroke="white" />' :
        '<path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9M16 20v-1M8 20v-1M12 20v-1M20 16c0 9 10 7 10 16" stroke="white" />'
        }
      </svg>
    </div>`,
    iconSize: size,
    iconAnchor: [size[0]/2, size[1]/2],
    popupAnchor: [0, -size[1]/2]
  });
};

const treeIcon = createCustomIcon('Tree', 'white', '#4CAF50');
const solarIcon = createCustomIcon('Sun', 'white', '#FF9800');
const windIcon = createCustomIcon('Wind', 'white', '#2196F3');
const ccsIcon = createCustomIcon('CloudCog', 'white', '#9C27B0');
const explosiveIcon = createCustomIcon('Bomb', 'white', '#F44336');
const truckIcon = createCustomIcon('Truck', 'white', '#607D8B');

// Explosion Animation Component
const ExplosionAnimation = ({ position, radius, onAnimationEnd }) => {
  const [currentRadius, setCurrentRadius] = useState(0);
  const [opacity, setOpacity] = useState(0.8);
  const map = useMap();
  
  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use getValidRadius to ensure no NaN values
      setCurrentRadius(getValidRadius(radius * progress, 100));
      setOpacity(0.8 * (1 - progress));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        if (onAnimationEnd) onAnimationEnd();
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [radius, onAnimationEnd]);
  
  return (
    <Circle
      center={position}
      radius={getValidRadius(currentRadius, 100)}
      pathOptions={{
        color: '#FF5722',
        fillColor: '#FF9800',
        fillOpacity: opacity,
        weight: 2,
      }}
    />
  );
};

// HeatMap Layer Component
const HeatMapLayer = ({ data, visible }) => {
  const map = useMap();
  const [heatLayer, setHeatLayer] = useState(null);
  
  useEffect(() => {
    if (!visible) {
      if (heatLayer) {
        map.removeLayer(heatLayer);
        setHeatLayer(null);
      }
      return;
    }
    
    // If no heatmap data, don't proceed
    if (!data || !data.length) return;
    
    // Remove existing heat layer if it exists
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }
    
    try {
      // Create heat data points - making sure values are properly formatted
      const points = data.map(point => [
        Number(point.lat) || 0, 
        Number(point.lng) || 0, 
        Number(point.value) || 0.5 // Default value if none provided
      ]);
      
      // Check if leaflet.heat is properly loaded and available
      if (typeof L.heatLayer === 'function') {
        // Add new heat layer with enhanced settings
        const newHeatLayer = L.heatLayer(points, {
          radius: 35, // Radius for better visibility
          blur: 25,   // Blur for smoother transitions
          maxZoom: 10,
          max: 1.0,
          minOpacity: 0.4, // Minimum opacity for better visibility
          gradient: {
            0.1: 'blue',
            0.3: 'cyan',
            0.5: 'lime',
            0.7: 'yellow',
            0.8: 'orange',
            1.0: 'red'
          }
        }).addTo(map);
        
        setHeatLayer(newHeatLayer);
      } else {
        console.error("L.heatLayer is not available. Check if leaflet.heat is properly loaded.");
        toast.error("Heatmap functionality is not available");
      }
    } catch (error) {
      console.error("Error creating heatmap layer:", error);
      toast.error("Error creating heatmap: " + error.message);
    }
    
    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, data, visible]);
  
  return null;
};

// MapUpdater component to handle map state changes
const MapUpdater = ({ selectedMine, mines, setMapInstance }) => {
  const map = useMap();
  
  useEffect(() => {
    setMapInstance(map);
    
    // Fly to selected mine if one is selected
    if (selectedMine) {
      const mine = mines.find(m => m.id === selectedMine);
      if (mine) {
        map.flyTo(mine.location, 10, {
          duration: 1.5,
        });
      }
    }
  }, [selectedMine, map, mines, setMapInstance]);
  
  return null;
};

// MapClickHandler component to handle map clicks
const MapClickHandler = ({ 
  activeItem, 
  onItemPlace, 
  selectedMine,
  setSelectedMine,
  setActiveItem,
  placementMode,
  setPlacementMode
}) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // Select mine if clicked on it
      if (!placementMode) {
        const clickedMine = COAL_MINES.find(mine => {
          const distance = map.distance([lat, lng], mine.location);
          const radius = getMineRadius(mine.size) * 100; // Convert to meters
          return distance <= radius;
        });
        
        if (clickedMine) {
          setSelectedMine(clickedMine.id);
          return;
        }
      }
      
      // Place item if in placement mode
      if (placementMode && activeItem) {
        const clickedLocation = [lat, lng];
        
        // Check if location is within India
        if (!isWithinIndiaBounds(clickedLocation)) {
          toast.error("Please place items within India's boundaries");
          return;
        }
        
        // Make sure there's a selected mine for related items
        if (!selectedMine && activeItem !== 'tree' && activeItem !== 'explosive') {
          toast.error("Please select a coal mine first");
          return;
        }
        
        onItemPlace({
          type: activeItem,
          position: clickedLocation
        });
        
        // Exit placement mode for items other than explosives
        if (activeItem !== 'explosive') {
          setPlacementMode(false);
          setActiveItem(null);
        }
      }
    }
  });
  
  return null;
};

const PlacementIndicator = ({ placementMode, activeItem, placementConfig }) => {
  const map = useMap();
  const [mousePosition, setMousePosition] = useState(null);
  
  useMapEvents({
    mousemove: (e) => {
      if (placementMode && activeItem) {
        setMousePosition([e.latlng.lat, e.latlng.lng]);
      } else {
        setMousePosition(null);
      }
    }
  });
  
  if (!placementMode || !activeItem || !mousePosition) return null;
  
  // Show indicator at mouse position
  let iconColor = '#4CAF50'; // default green
  let iconType = 'Tree';
  let indicatorRadius = 20;
  
  switch (activeItem) {
    case 'tree':
      iconColor = '#4CAF50';
      iconType = 'Tree';
      indicatorRadius = placementConfig?.area ? getValidRadius(placementConfig.area * 10, 20) : 20;
      break;
    case 'renewable-solar':
      iconColor = '#FF9800';
      iconType = 'Sun';
      indicatorRadius = placementConfig?.capacity ? getValidRadius(placementConfig.capacity * 10, 20) : 20;
      break;
    case 'renewable-wind':
      iconColor = '#2196F3';
      iconType = 'Wind';
      indicatorRadius = placementConfig?.capacity ? getValidRadius(placementConfig.capacity * 10, 20) : 20;
      break;
    case 'ccs':
      iconColor = '#9C27B0';
      iconType = 'CloudCog';
      indicatorRadius = placementConfig?.capture ? getValidRadius(placementConfig.capture / 10, 20) : 20;
      break;
    case 'explosive':
      iconColor = '#F44336';
      iconType = 'Bomb';
      // Explosion radius based on amount (in meters)
      indicatorRadius = placementConfig?.amount ? getValidRadius(Math.min(placementConfig.amount / 10, 100), 50) : 50;
      break;
    default:
      break;
  }
  
  return (
    <Circle
      center={mousePosition}
      radius={getValidRadius(indicatorRadius, 20)}
      pathOptions={{
        color: iconColor,
        fillColor: iconColor,
        fillOpacity: 0.3,
        weight: 2,
        dashArray: '5, 5'
      }}
    />
  );
};

// Enhanced route visualization to look like roads/railways
const RouteVisualization = ({ shipment }) => {
  if (!shipment || !shipment.route || !shipment.route.waypoints) {
    return null;
  }
  
  // Create a more realistic route with slight variations to mimic road/rail paths
  const enhanceRoute = (waypoints) => {
    if (waypoints.length < 2) return waypoints;
    
    // Add more detailed path variations based on transport method
    const enhancedPoints = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i];
      const end = waypoints[i + 1];
      
      enhancedPoints.push(start);
      
      // Add intermediate points with slight randomness
      // More segments for a more natural path
      const segments = 8; // Increased for more natural-looking paths
      for (let j = 1; j < segments; j++) {
        const t = j / segments;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        
        // Add some randomness for natural curves
        // More variation for roads, less for railways
        const isRail = shipment.transportMethod === 'rail';
        const offsetFactor = isRail ? 0.01 : 0.02;
        
        // Sinusoidal variation for more realistic paths
        const offset = offsetFactor * Math.sin(t * Math.PI * 2);
        
        // Alternating offsets for zig-zag effect
        enhancedPoints.push([
          lat + offset * (j % 2 === 0 ? 1 : -1), 
          lng + offset * (j % 2 === 0 ? -1 : 1)
        ]);
      }
    }
    
    enhancedPoints.push(waypoints[waypoints.length - 1]);
    return enhancedPoints;
  };
  
  // Style based on transport type
  const routeStyle = shipment.transportMethod === 'rail' ? 
    { color: '#3F51B5', weight: 4, opacity: 0.85, dashArray: '8, 8' } : // Railway style
    { color: '#795548', weight: 5, opacity: 0.8 }; // Road style
  
  const enhancedWaypoints = enhanceRoute([
    shipment.fromMine.location, 
    ...shipment.route.waypoints, 
    shipment.toDestination.location
  ]);
  
  return (
    <>
      <Polyline
        positions={enhancedWaypoints}
        pathOptions={routeStyle}
      >
        <Popup>
          <div className="font-medium">Coal Transport Route</div>
          <div className="text-sm">
            <div className="flex items-center gap-1 my-1">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>From: {shipment.fromMine.name}</span>
            </div>
            <div className="flex items-center gap-1 my-1">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>To: {shipment.toDestination.name}</span>
            </div>
            <div className="mt-1">Distance: {shipment.route.distance.toFixed(1)} km</div>
            <div>Transit time: {shipment.route.time.toFixed(1)} hours</div>
            <div className="mt-1">Method: {shipment.transportMethod || 'Truck'}</div>
          </div>
        </Popup>
      </Polyline>
      
      {/* Route markers for better visualization */}
      {enhancedWaypoints.filter((_, i) => i % 8 === 0).map((point, i) => (
        <Circle
          key={`route-marker-${shipment.id}-${i}`}
          center={point}
          radius={30}
          pathOptions={{
            color: routeStyle.color,
            fillColor: routeStyle.color,
            fillOpacity: 0.5,
            weight: 1
          }}
        />
      ))}
    </>
  );
};

// Location search component - Compact UI
const LocationSearch = ({ onSelectDestination }) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 1) {
      // Filter destinations based on search text
      const matches = TRANSPORT_DESTINATIONS.filter(dest => 
        dest.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (destination) => {
    setSearchText(destination.name);
    setShowSuggestions(false);
    setIsSearchActive(false); // Hide the search after selection
    if (onSelectDestination) {
      onSelectDestination(destination);
    }
  };

  return (
    <div className={`absolute bottom-4 left-4 z-[1000] transition-all duration-300 ${isSearchActive ? 'w-64' : 'w-10'}`}>
      {isSearchActive ? (
        <div className="bg-white rounded-lg shadow-lg p-3 relative animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Find Destination</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setIsSearchActive(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center">
            <input
              type="text"
              className="px-3 py-2 rounded-l-md bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
              placeholder="Search destinations..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              autoFocus
            />
            <Button
              className="px-3 py-2 rounded-r-md bg-primary text-white h-full"
              size="sm"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 bg-white shadow-md rounded-md mt-1 z-50 max-h-40 overflow-y-auto animate-fade-in">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion.id}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${suggestion.type === 'port' ? 'bg-blue-500' : 'bg-purple-500'} mr-2`}></div>
                    <span className="font-medium">{suggestion.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({suggestion.type})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Button 
          className="rounded-full h-10 w-10 bg-white shadow-md border border-gray-200 hover:bg-gray-100 p-0 flex items-center justify-center"
          onClick={() => setIsSearchActive(true)}
          title="Search for transport destinations"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </Button>
      )}
    </div>
  );
};

const SimulationMap = ({ 
  selectedMine, 
  setSelectedMine,
  trees = [], 
  renewables = [], 
  ccs = [], 
  explosives = [],
  shipments = [],
  emissions = {},
  setMapInstance,
  activeItem,
  onItemPlace,
  placementMode,
  setPlacementMode,
  setActiveItem,
  onDetonateExplosive,
  placementConfig,
  onAddShipment,
  onResetSimulation
}) => {
  const [activeExplosions, setActiveExplosions] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [shipmentRoute, setShipmentRoute] = useState(null);
  const mapRef = useRef(null);
  
  // Generate enhanced heatmap data based on each mine's emission data
  const generateEnhancedHeatmapData = () => {
    // Use the actual mines data for more accurate visualization
    return generateHeatmapData(emissions, COAL_MINES);
  };
  
  const heatmapData = generateEnhancedHeatmapData();
  
  const handleDetonation = (explosive) => {
    if (explosive && !explosive.detonated && typeof onDetonateExplosive === 'function') {
      // Add to active explosions for animation
      const explosionRadius = getValidRadius(Math.min(explosive.amount / 5, 500), 100); // Scale radius based on amount
      setActiveExplosions(prev => [...prev, { 
        id: explosive.id, 
        position: explosive.position, 
        radius: explosionRadius 
      }]);
      
      // Trigger detonation in parent component
      onDetonateExplosive(explosive);
    }
  };
  
  const handleExplosionComplete = (explosionId) => {
    setActiveExplosions(prev => prev.filter(e => e.id !== explosionId));
  };
  
  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    
    // If we have both a selected mine and destination, calculate route
    if (selectedMine) {
      const mine = COAL_MINES.find(m => m.id === selectedMine);
      if (mine) {
        const route = calculateShortestRoute(mine.location, destination.location);
        
        // Randomly choose between truck and rail
        const transportMethod = Math.random() > 0.5 ? 'truck' : 'rail';
        
        const newShipment = {
          id: Date.now(),
          fromMine: mine,
          toDestination: destination,
          route: route,
          transportMethod: transportMethod,
          status: 'pending'
        };
        
        setShipmentRoute(newShipment);
        
        // Add shipment if function provided
        if (onAddShipment) {
          onAddShipment(newShipment);
          toast.success(`Created new ${transportMethod} shipment to ${destination.name}`);
        }
      }
    } else {
      toast.error("Please select a coal mine first");
    }
  };
  
  // Handle map reset - Fixed implementation
  const handleResetMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(INDIA_CENTER, 5, {
        animate: true,
        duration: 1
      });
      
      // Hide heatmap when resetting view
      setShowHeatmap(false);
      
      toast.success("Map view reset");
    }
  }, []);
  
  // Store map instance in ref for reset functionality
  const setMap = useCallback((map) => {
    mapRef.current = map;
    if (setMapInstance) {
      setMapInstance(map);
    }
  }, [setMapInstance]);
  
  return (
<div className="h-full w-full overflow-hidden rounded-lg shadow-lg relative">
  <MapContainer 
    center={INDIA_CENTER} 
    zoom={5} 
    style={{ height: '100%', width: '100%' }}
    zoomControl={false}
    className={`${placementMode ? 'cursor-crosshair' : 'cursor-grab'}`}
    whenCreated={setMap}
  >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          selectedMine={selectedMine} 
          mines={COAL_MINES} 
          setMapInstance={setMap}
        />
        
        <MapClickHandler 
          activeItem={activeItem}
          onItemPlace={onItemPlace}
          selectedMine={selectedMine}
          setSelectedMine={setSelectedMine}
          setActiveItem={setActiveItem}
          placementMode={placementMode}
          setPlacementMode={setPlacementMode}
        />
        
        <PlacementIndicator 
          placementMode={placementMode}
          activeItem={activeItem}
          placementConfig={placementConfig}
        />
        
        {/* Heatmap layer */}
        <HeatMapLayer data={heatmapData} visible={showHeatmap} />
        
        {/* Render coal mines with area visualization */}
        {COAL_MINES.map(mine => (
          <React.Fragment key={`mine-${mine.id}`}>
            <CoalMine 
              key={mine.id} 
              mine={mine} 
              isSelected={selectedMine === mine.id}
              emissions={emissions}
              onClick={() => setSelectedMine(mine.id)}
            />
            
            {/* Add mine area visualization */}
            <Circle
              center={mine.location}
              radius={getValidRadius(getMineRadius(mine.size) * 150, 500)} // Convert to meters
              pathOptions={{
                color: getMineColor(mine.type),
                fillColor: getMineColor(mine.type),
                fillOpacity: 0.05,
                weight: 1,
                dashArray: '5, 5',
              }}
            >
              <Popup>
                <div className="font-medium">{mine.name} - Mining Area</div>
                <div className="text-sm">
                  Type: {mine.type.charAt(0).toUpperCase() + mine.type.slice(1)}
                  <br />
                  Size: {mine.size.charAt(0).toUpperCase() + mine.size.slice(1)}
                  <br />
                  <div className="mt-1 border-t pt-1 border-gray-200">
                    <div className="font-medium">Emissions:</div>
                    <div>CO₂: {mine.emissions?.CO2 || 0} tons</div>
                    <div>Methane: {mine.emissions?.methane || 0} tons</div>
                    <div>NOx: {mine.emissions?.NOx || 0} tons</div>
                  </div>
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        ))}
        
        {/* Render transport destinations */}
        {TRANSPORT_DESTINATIONS.map(dest => (
          <Marker 
            key={dest.id}
            position={dest.location}
            icon={L.divIcon({
              className: 'custom-destination-marker',
              html: `<div style="
                width: 32px; 
                height: 32px; 
                background-color: ${dest.type === 'port' ? '#2196F3' : '#9C27B0'}; 
                border-radius: 50%; 
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                color: white;
                font-weight: bold;
                font-size: 16px;
                cursor: pointer;
              ">
                ${dest.type === 'port' ? '⚓' : '🏭'}
              </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })}
          >
            <Popup>
              <div className="font-medium">{dest.name}</div>
              <div className="text-sm">
                Type: {dest.type.charAt(0).toUpperCase() + dest.type.slice(1)}
              </div>
              {selectedMine && (
                <button 
                  className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs w-full"
                  onClick={() => handleDestinationSelect(dest)}
                >
                  Ship Coal Here
                </button>
              )}
            </Popup>
          </Marker>
        ))}
        
        {/* Render enhanced shipment routes */}
        {shipments.map(shipment => (
          <React.Fragment key={shipment.id}>
            <RouteVisualization shipment={shipment} />
            
            {/* Show truck/train moving along the route */}
            <Marker
              position={shipment.route.waypoints[Math.floor(shipment.route.waypoints.length / 2)] || shipment.fromMine.location}
              icon={truckIcon}
            >
              <Popup>
                <div className="font-medium">Coal Transport</div>
                <div className="text-sm">
                  From: {shipment.fromMine.name}<br/>
                  To: {shipment.toDestination.name}<br/>
                  Method: {shipment.transportMethod || 'Truck'}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
        
        {/* Render trees with absorption radius */}
        {trees.map(tree => (
          <React.Fragment key={tree.id}>
            <Marker 
              position={tree.position} 
              icon={treeIcon}
            >
              <Popup>
                <div className="font-bold text-lg">{tree.type} Tree</div>
                <div className="text-sm">
                  Area: {tree.area} hectares<br/>
                  CO₂ Absorption: {tree.absorption} tons/year
                </div>
              </Popup>
            </Marker>
            <Circle
              center={tree.position}
              radius={getValidRadius(tree.area * 50, 50)} // Scale radius based on hectares
              pathOptions={{
                color: '#4CAF50',
                fillColor: '#4CAF50',
                fillOpacity: 0.1,
                weight: 1
              }}
            >
              <Popup>
                <div className="font-medium">Carbon Absorption Zone</div>
                <div className="text-sm">
                  Absorbing {tree.absorption} tons CO₂/year
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        ))}
        
        {/* Render renewables */}
        {renewables.map(renewable => (
          <React.Fragment key={renewable.id}>
            <Marker 
              position={renewable.position} 
              icon={renewable.type === 'Solar' ? solarIcon : windIcon}
            >
              <Popup>
                <div className="font-medium">{renewable.type}</div>
                <div className="text-sm">
                  Capacity: {renewable.capacity} MW<br/>
                  CO₂ Reduction: {renewable.reduction} tons/year
                </div>
              </Popup>
            </Marker>
            <Circle
              center={renewable.position}
              radius={getValidRadius(renewable.capacity * 30, 100)} // Scale radius based on capacity
              pathOptions={{
                color: renewable.type === 'Solar' ? '#FF9800' : '#2196F3',
                fillColor: renewable.type === 'Solar' ? '#FF9800' : '#2196F3',
                fillOpacity: 0.1,
                weight: 1
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Render CCS facilities */}
        {ccs.map(facility => (
          <React.Fragment key={facility.id}>
            <Marker 
              position={facility.position} 
              icon={ccsIcon}
            >
              <Popup>
                <div className="font-medium">{facility.type} Facility</div>
                <div className="text-sm">
                  Technology: {facility.technology}<br/>
                  Capture: {facility.capture} tons/year
                </div>
              </Popup>
            </Marker>
            <Circle
              center={facility.position}
              radius={getValidRadius(facility.capture / 5, 100)} // Scale radius based on capture amount
              pathOptions={{
                color: '#9C27B0',
                fillColor: '#9C27B0',
                fillOpacity: 0.1,
                weight: 1
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Render explosives */}
        {explosives.map(explosive => (
          <Marker 
            key={explosive.id} 
            position={explosive.position} 
            icon={explosiveIcon}
          >
            <Popup>
              <div className="font-medium">{explosive.type}</div>
              <div className="text-sm">
                Amount: {explosive.amount} kg<br/>
                Status: {explosive.detonated ? 'Detonated' : 'Ready'}
              </div>
              {!explosive.detonated && (
                <button 
                  className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetonation(explosive);
                  }}
                >
                  Detonate
                </button>
              )}
            </Popup>
          </Marker>
        ))}
        
        {/* Render active explosion animations */}
        {activeExplosions.map(explosion => (
          <ExplosionAnimation
            key={explosion.id}
            position={explosion.position}
            radius={explosion.radius}
            onAnimationEnd={() => handleExplosionComplete(explosion.id)}
          />
        ))}
        
        {/* Show detonated explosives blast radius */}
        {explosives.filter(e => e.detonated).map(explosive => (
          <Circle
            key={`blast-${explosive.id}`}
            center={explosive.position}
            radius={getValidRadius(Math.min(explosive.amount / 5, 500), 100)} // Scale radius based on amount
            pathOptions={{
              color: '#FF5722',
              fillColor: '#FF9800',
              fillOpacity: 0.1,
              weight: 1,
              dashArray: '3, 5'
            }}
          >
            <Popup>
              <div className="font-medium">Blast Zone</div>
              <div className="text-sm">
                {explosive.type} ({explosive.amount} kg)<br/>
                Radius: {(getValidRadius(Math.min(explosive.amount / 5, 500), 100)/1000).toFixed(2)} km
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
      
      {/* Improved Map controls with better visibility */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        {/* Heatmap toggle button */}
        <Button 
          className={`h-10 w-10 rounded-full shadow-lg flex items-center justify-center
            ${showHeatmap ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setShowHeatmap(!showHeatmap)}
          title={showHeatmap ? "Hide Emission Heatmap" : "Show Emission Heatmap"}
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
        
        {/* Reset view button */}
        <Button 
          className="h-10 w-10 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100 flex items-center justify-center"
          onClick={handleResetMap}
          title="Reset Map View"
        >
          <Map className="h-5 w-5" />
        </Button>
        
        {/* Reset simulation button */}
        <Button 
          className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center"
          onClick={() => {
            if (typeof onResetSimulation === 'function') {
              onResetSimulation();
            }
          }}
          title="Reset Simulation"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Enhanced Legend for better understanding */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs max-w-[200px] border border-gray-200">
        <h4 className="font-bold text-sm mb-2 flex items-center"><Map className="w-3 h-3 mr-1" /> Map Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
            <span>Underground Mine</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Surface Mine</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
            <span>Carbon Sink</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
            <span>CCS Facility</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span>Explosives</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
            <span>Port</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
            <span>Industrial Area</span>
          </div>
          {/* Heatmap legend */}
          {showHeatmap && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="font-medium mb-1">Emissions Intensity</div>
              <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
              <div className="flex justify-between mt-1 text-xs">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Compact Search UI for transport destinations */}
      <LocationSearch onSelectDestination={handleDestinationSelect} />
      
      {/* Show active placement mode indicator at the top */}
      {placementMode && activeItem && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center text-sm animate-pulse">
          <span>Placing: {activeItem.replace('-', ' ')}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="ml-2 h-6 w-6 p-0 hover:bg-white/20"
            onClick={() => {
              setPlacementMode(false);
              setActiveItem(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimulationMap;
