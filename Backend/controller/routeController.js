const axios = require("axios");

exports.optimizeRoute = async (req, res) => {
  try {
    const { vehicle, services } = req.body;

    // Validate vehicle data
    if (!vehicle || !vehicle.coordinates || !vehicle.coordinates.lat || !vehicle.coordinates.lon) {
      return res.status(400).json({ error: "Invalid vehicle data. Ensure coordinates are provided." });
    }

    // Validate services data
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "At least one service location is required." });
    }

    for (let service of services) {
      if (!service.coordinates || !service.coordinates.lat || !service.coordinates.lon) {
        return res.status(400).json({ error: `Invalid coordinates for service ${service.name}.` });
      }
    }

    // Convert lat/lon to numbers (since they are currently strings)
    const parseCoordinates = (coord) => ({
      lat: parseFloat(coord.lat),
      lon: parseFloat(coord.lon),
    });

    const vehicleCoords = parseCoordinates(vehicle.coordinates);
    const serviceCoords = services.map((s) => parseCoordinates(s.coordinates));

    // Build coordinates string for OSRM
    let coordinates = [`${vehicleCoords.lon},${vehicleCoords.lat}`];

    serviceCoords.forEach(coord => {
      coordinates.push(`${coord.lon},${coord.lat}`);
    });

    const coordinatesString = coordinates.join(";");

    // OSRM Trip API - Optimizes the visit order
    const osrmUrl = `http://router.project-osrm.org/trip/v1/driving/${coordinatesString}?source=first&destination=last&overview=full&geometries=polyline`;

    console.log("OSRM Request URL:", osrmUrl);
    
    const response = await axios.get(osrmUrl);

    console.log("OSRM Response:", JSON.stringify(response.data, null, 2));

    if (!response.data.trips || response.data.trips.length === 0) {
      return res.status(500).json({ error: "No optimized route found." });
    }

    // Decode the polyline for the optimized route
    const optimizedRoute = decodePolyline(response.data.trips[0].geometry);
    console.log("Optimized Route:", optimizedRoute);
    return res.json({ optimizedRoute });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error occurred during route optimization." });
  }
};

// Polyline decoder function
function decodePolyline(polyline) {
  let index = 0, lat = 0, lon = 0;
  const path = [];
  while (index < polyline.length) {
    let byte, shift = 0, result = 0;
    do {
      byte = polyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      byte = polyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLon = (result & 1) ? ~(result >> 1) : (result >> 1);
    lon += deltaLon;

    path.push([lat / 1e5, lon / 1e5]);
  }
  return path;
}
