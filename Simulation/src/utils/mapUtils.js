// Utility functions for the map

// Default center of India (approximate)
export const INDIA_CENTER = [20.5937, 78.9629];

// Coal mine locations in India (simulated) with unique emission data
export const COAL_MINES = [
  { 
    id: 1, 
    name: "Jharia Coal Field", 
    location: [23.7957, 86.4304], 
    type: "underground", 
    size: "large",
    emissions: {
      CO2: 580,
      methane: 125,
      particulates: 45,
      NOx: 38
    }
  },
  { 
    id: 2, 
    name: "Raniganj Coalfield", 
    location: [23.6260, 87.1150], 
    type: "underground", 
    size: "large",
    emissions: {
      CO2: 520,
      methane: 110,
      particulates: 40,
      NOx: 35
    }
  },
  { 
    id: 3, 
    name: "Singrauli Coalfield", 
    location: [24.1990, 82.6534], 
    type: "surface", 
    size: "large",
    emissions: {
      CO2: 750,
      methane: 60,
      particulates: 90,
      NOx: 65
    }
  },
  { 
    id: 4, 
    name: "Talcher Coalfield", 
    location: [20.9450, 85.0940], 
    type: "surface", 
    size: "medium",
    emissions: {
      CO2: 480,
      methane: 45,
      particulates: 65,
      NOx: 42
    }
  },
  { 
    id: 5, 
    name: "Korba Coalfield", 
    location: [22.3595, 82.7501], 
    type: "surface", 
    size: "medium",
    emissions: {
      CO2: 520,
      methane: 50,
      particulates: 70,
      NOx: 45
    }
  },
  { 
    id: 6, 
    name: "North Karanpura", 
    location: [23.8156, 85.2746], 
    type: "underground", 
    size: "medium",
    emissions: {
      CO2: 380,
      methane: 85,
      particulates: 30,
      NOx: 28
    }
  },
  { 
    id: 7, 
    name: "Sohagpur Coalfield", 
    location: [23.1309, 81.3755], 
    type: "surface", 
    size: "small",
    emissions: {
      CO2: 280,
      methane: 30,
      particulates: 45,
      NOx: 25
    }
  },
  { 
    id: 8, 
    name: "Makum Coalfield", 
    location: [27.2957, 95.7457], 
    type: "underground", 
    size: "small",
    emissions: {
      CO2: 180,
      methane: 65,
      particulates: 20,
      NOx: 18
    }
  },
];

// Coal transportation destinations (major cities)
export const TRANSPORT_DESTINATIONS = [
  { id: 1, name: "Mumbai", location: [19.0760, 72.8777], type: "port" },
  { id: 2, name: "Delhi", location: [28.7041, 77.1025], type: "industrial" },
  { id: 3, name: "Chennai", location: [13.0827, 80.2707], type: "port" },
  { id: 4, name: "Kolkata", location: [22.5726, 88.3639], type: "port" },
  { id: 5, name: "Bangalore", location: [12.9716, 77.5946], type: "industrial" },
  { id: 6, name: "Hyderabad", location: [17.3850, 78.4867], type: "industrial" },
  { id: 7, name: "Ahmedabad", location: [23.0225, 72.5714], type: "industrial" },
  { id: 8, name: "Vishakhapatnam", location: [17.6868, 83.2185], type: "port" },
  { id: 9, name: "Kanpur", location: [26.4499, 80.3319], type: "industrial" },
  { id: 10, name: "Pune", location: [18.5204, 73.8567], type: "industrial" },
  { id: 11, name: "Surat", location: [21.1702, 72.8311], type: "industrial" },
  { id: 12, name: "Jaipur", location: [26.9124, 75.7873], type: "industrial" },
  { id: 13, name: "Kochi", location: [9.9312, 76.2673], type: "port" },
  { id: 14, name: "Paradip", location: [20.3165, 86.6114], type: "port" },
  { id: 15, name: "Mundra", location: [22.8388, 69.7218], type: "port" },
];

// Get mine color based on type
export const getMineColor = (type) => {
  return type === "underground" ? "#3F51B5" : "#FF9800";
};

// Get mine radius based on size (for icon display)
export const getMineRadius = (size) => {
  switch (size) {
    case "large": return 20;
    case "medium": return 15;
    case "small": return 10;
    default: return 15;
  }
};

// Get mine area radius in meters
export const getMineAreaRadius = (size) => {
  switch (size) {
    case "large": return 2000;  // 2km
    case "medium": return 1200; // 1.2km
    case "small": return 800;   // 800m
    default: return 1000;
  }
};

// Validate radius to prevent NaN errors
export const getValidRadius = (value, defaultValue = 100) => {
  if (value === undefined || value === null) return defaultValue;
  const radius = Number(value);
  return !isNaN(radius) && radius > 0 ? radius : defaultValue;
};

// Get explosion radius based on explosive amount
export const getExplosionRadius = (amount) => {
  // Scale with square root to make it less linear
  const radius = Math.min(Math.sqrt(amount) * 20, 500);
  return getValidRadius(radius, 100);
};

// Get a random location near a mine for placing resources
export const getRandomLocationNearMine = (mineLocation, maxDistance = 0.03) => {
  const [lat, lng] = mineLocation;
  const randomLat = lat + (Math.random() - 0.5) * maxDistance;
  const randomLng = lng + (Math.random() - 0.5) * maxDistance;
  return [randomLat, randomLng];
};

// Calculate the shortest route between two locations
export const calculateShortestRoute = (startLocation, endLocation) => {
  // In a real app, this would use a routing API
  // For now, we'll create a more realistic route with waypoints
  const [startLat, startLng] = startLocation;
  const [endLat, endLng] = endLocation;
  
  // Create intermediary points along a slightly curved path
  const waypoints = [];
  const steps = 8;
  
  // Calculate direct distance for better waypoint placement
  const directDistance = calculateDistance(startLocation, endLocation);
  
  // Create a curved path with slight randomness
  for (let i = 1; i < steps; i++) {
    const fraction = i / steps;
    
    // Add some curvature using sine function
    const curveFactor = Math.sin(fraction * Math.PI) * 0.05;
    
    // Direction perpendicular to straight line
    const dx = endLat - startLat;
    const dy = endLng - startLng;
    const perpX = -dy;
    const perpY = dx;
    
    // Normalize perpendicular vector
    const length = Math.sqrt(perpX * perpX + perpY * perpY);
    const perpXNorm = perpX / length;
    const perpYNorm = perpY / length;
    
    // Add randomness based on distance (more variance for longer distances)
    const randomFactor = Math.random() * 0.01 * (directDistance / 100);
    
    const lat = startLat + (endLat - startLat) * fraction + curveFactor * perpXNorm + (Math.random() - 0.5) * randomFactor;
    const lng = startLng + (endLng - startLng) * fraction + curveFactor * perpYNorm + (Math.random() - 0.5) * randomFactor;
    
    waypoints.push([lat, lng]);
  }
  
  // Calculate more accurate distance based on waypoints
  let totalDistance = calculateDistance(startLocation, waypoints[0]);
  for (let i = 1; i < waypoints.length; i++) {
    totalDistance += calculateDistance(waypoints[i-1], waypoints[i]);
  }
  totalDistance += calculateDistance(waypoints[waypoints.length-1], endLocation);
  
  // Estimate travel time based on distance
  // Assuming average speed of 40km/h for trucks, 60km/h for rail
  const transportMethod = Math.random() > 0.5 ? 'truck' : 'rail';
  const avgSpeed = transportMethod === 'rail' ? 60 : 40;
  const time = totalDistance / avgSpeed;  
  
  return {
    waypoints,
    distance: totalDistance,
    time: time,
    transportMethod: transportMethod
  };
};

// Calculate distance between two points (in km)
export const calculateDistance = (point1, point2) => {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  // Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Generate a unique ID for map elements
export const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Check if a point is inside a circle (for collision detection)
export const isPointInCircle = (point, circle, radius) => {
  const distance = Math.sqrt(
    Math.pow(point[0] - circle[0], 2) + 
    Math.pow(point[1] - circle[1], 2)
  );
  return distance <= radius;
};

// Calculate emission zone radius based on emission amount
export const getEmissionZoneRadius = (emissionAmount) => {
  // Larger emissions = larger radius
  const baseRadius = 800; // meters
  const radius = baseRadius * Math.sqrt(emissionAmount / 100);
  return getValidRadius(radius, 800);
};

// Format numbers with appropriate units
export const formatNumber = (num, unit = '') => {
  if (num === undefined || num === null) return 'N/A';
  
  if (typeof num === 'number') {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)} M${unit}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)} k${unit}`;
    } else {
      return `${num.toFixed(2)}${unit}`;
    }
  }
  
  return num;
};

// Calculate risk level based on emissions
export const getRiskLevel = (emission) => {
  if (!emission) return 'Unknown';
  
  if (emission < 100) return 'Low';
  if (emission < 500) return 'Moderate';
  if (emission < 1000) return 'High';
  return 'Critical';
};

// Get color based on risk level
export const getRiskColor = (risk) => {
  switch(risk) {
    case 'Low': return 'bg-green-500';
    case 'Moderate': return 'bg-yellow-500';
    case 'High': return 'bg-orange-500';
    case 'Critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Check if a location is within India's boundaries (approximate)
export const isWithinIndiaBounds = (location) => {
  const [lat, lng] = location;
  // Approximate bounds for India
  return lat >= 8.0 && lat <= 37.0 && lng >= 68.0 && lng <= 97.0;
};

// Generate enhanced heatmap data from mine emissions
export const generateHeatmapData = (emissions, mines) => {
  if (!mines || !mines.length) return [];
  
  const points = [];
  mines.forEach(mine => {
    // Use the mine's specific emissions data
    const mineEmission = mine.emissions ? 
      (mine.emissions.CO2 + mine.emissions.methane * 28 + mine.emissions.NOx * 265) / 10 : 
      100; // Default value if no emissions data
      
    if (mineEmission > 0) {
      // Add the main point for the mine with higher intensity
      points.push({
        lat: mine.location[0],
        lng: mine.location[1],
        value: mineEmission / 5, // Scale for visualization
      });
      
      // Create a cloud of points around each mine based on emission levels
      // More points for higher emissions
      const pointCount = Math.ceil(mineEmission / 50);
      const radiusScale = Math.sqrt(mineEmission) / 10;
      
      for (let i = 0; i < pointCount; i++) {
        // Create points in a gradually expanding circle
        const angle = (2 * Math.PI * i) / pointCount;
        const distance = radiusScale * (0.05 + Math.random() * 0.15); // Between 0.05 and 0.2 degrees
        
        const lat = mine.location[0] + Math.cos(angle) * distance;
        const lng = mine.location[1] + Math.sin(angle) * distance;
        
        // Value decreases with distance from center
        const distanceFactor = 0.7 + (0.3 * Math.random());
        const value = (mineEmission / 10) * distanceFactor * (1 - i / pointCount);
        
        points.push({
          lat,
          lng,
          value
        });
      }
    }
  });
  
  return points;
};

// Get heat color based on intensity
export const getHeatColor = (intensity) => {
  // Enhanced color gradient
  if (intensity < 0.2) return 'rgba(0, 0, 255, 0.7)';  // Blue
  if (intensity < 0.4) return 'rgba(0, 255, 255, 0.7)'; // Cyan
  if (intensity < 0.6) return 'rgba(0, 255, 0, 0.7)';   // Green
  if (intensity < 0.8) return 'rgba(255, 255, 0, 0.7)'; // Yellow
  if (intensity < 0.9) return 'rgba(255, 165, 0, 0.7)'; // Orange
  return 'rgba(255, 0, 0, 0.7)'; // Red
};
