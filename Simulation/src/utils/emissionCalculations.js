
// Utility functions for calculating carbon emissions and reductions

// Calculate electricity emissions
export const calculateElectricityEmissions = (energyPerTime, responsibleArea, totalArea) => {
  // Simulated calculation based on the API response pattern
  const co2EmissionPerUnit = 0.82; // kg CO2 per kWh
  const totalEmission = energyPerTime * co2EmissionPerUnit * (responsibleArea / totalArea);
  
  return {
    CO2: {
      value: totalEmission,
      unit: "kg/day"
    }
  };
};

// Calculate fuel combustion emissions
export const calculateFuelEmissions = (fuelType, volume) => {
  const emissionFactors = {
    'Petrol': { CO2: 2.31, methane: 0.00023, nitrousOxide: 0.00047 },
    'Diesel': { CO2: 2.68, methane: 0.00011, nitrousOxide: 0.00022 },
    'LPG': { CO2: 1.51, methane: 0.00005, nitrousOxide: 0.00001 },
  };
  
  const factor = emissionFactors[fuelType] || emissionFactors['Diesel'];
  
  return {
    CO2: {
      value: volume * factor.CO2,
      unit: "kg"
    },
    methaneCO2e: {
      value: volume * factor.methane * 28, // GWP of methane is 28
      unit: "kg"
    },
    nitrousOxideCO2e: {
      value: volume * factor.nitrousOxide * 265, // GWP of N2O is 265
      unit: "kg"
    },
    totalDirectCO2e: {
      value: volume * (factor.CO2 + factor.methane * 28 + factor.nitrousOxide * 265),
      unit: "kg"
    }
  };
};

// Calculate shipping emissions
export const calculateShippingEmissions = (weight, distance, transportMethod) => {
  const emissionFactors = {
    'ship': 0.015, // kg CO2 per ton-km
    'train': 0.028,
    'truck': 0.092,
    'plane': 0.6
  };
  
  const factor = emissionFactors[transportMethod] || emissionFactors['truck'];
  const emissions = weight * distance * factor;
  
  return {
    carbonEmissions: {
      grams: emissions * 1000,
      kilograms: emissions,
      metricTonnes: emissions / 1000
    }
  };
};

// Calculate explosion emissions
export const calculateExplosionEmissions = (explosiveType, amount) => {
  const emissionFactors = {
    'Black powder': { CO: 85, H2S: 12, CO2: 3100 },
    'Smokeless powder': { CO: 38, H2S: 10, CO2: 38 },
    'Dynamite, straight': { CO: 141, H2S: 3, CO2: 2320 },
    'Dynamite, ammonia': { CO: 32, H2S: 16, CO2: 32 },
    'Dynamite, gelatin': { CO: 52, NOx: 26, SO2: 1, CO2: 52 },
    'ANFO': { CO: 34, NOx: 8, SO2: 1, CO2: 34 },
    'TNT': { CO: 398, NH3: 14, HCN: 13, CO2: 1360 },
    'RDX': { CO: 98, NH3: 22, CO2: 1190 },
    'PETN': { CO: 149, NH3: 1.3, CO2: 696 }
  };
  
  const factors = emissionFactors[explosiveType] || emissionFactors['ANFO'];
  
  return {
    CO: (amount * (factors.CO || 0) / 1e6).toFixed(4) + " tons",
    NOx: (amount * (factors.NOx || 0) / 1e6).toFixed(4) + " tons",
    NH3: (amount * (factors.NH3 || 0) / 1e6).toFixed(4) + " tons",
    HCN: (amount * (factors.HCN || 0) / 1e6).toFixed(4) + " tons",
    H2S: (amount * (factors.H2S || 0) / 1e6).toFixed(4) + " tons",
    SO2: (amount * (factors.SO2 || 0) / 1e6).toFixed(4) + " tons",
    CO2: (amount * factors.CO2 / 1e6).toFixed(4) + " tons",
  };
};

// Calculate coal emissions
export const calculateCoalEmissions = (coalType, coalConsumption) => {
  const emissionFactors = {
    'Lignite': 0.95,
    'Sub-bituminous': 0.90,
    'Bituminous': 1.00,
    'Anthracite': 1.10
  };
  
  const emissionFactor = emissionFactors[coalType] || emissionFactors['Bituminous'];
  const carbonOxidationFactor = 0.99;
  
  const co2Emissions = coalConsumption * emissionFactor * carbonOxidationFactor;
  
  return {
    coalType,
    coalConsumption,
    emissionFactor,
    carbonOxidationFactor,
    co2Emissions
  };
};

// Calculate carbon sink from plantation
export const calculateCarbonSink = (vegetationType, areaCovered, timeframe = 1) => {
  const carbonSequestrationRates = {
    'Tropical forest': 25,
    'Temperate forest': 13,
    'Boreal forest': 8,
    'Mangrove': 28,
    'Grassland': 5,
    'Bamboo': 35
  };
  
  const carbonSequestrationRate = carbonSequestrationRates[vegetationType] || 13;
  const dailySequestrationRate = areaCovered * carbonSequestrationRate / 365;
  const totalSequestration = areaCovered * carbonSequestrationRate * timeframe;
  
  return {
    vegetationType,
    areaCovered,
    carbonSequestrationRate,
    dailySequestrationRate: `${dailySequestrationRate.toFixed(2)} tons of CO2/day`,
    totalSequestration: `${totalSequestration.toFixed(2)} tons of CO2 over ${timeframe} year(s)`
  };
};

// Calculate renewable energy impact
export const calculateRenewableImpact = (co2EmissionsPerDay, selectedRenewable, desiredReductionPercentage, availableLand) => {
  const renewableOptions = {
    'Solar': { co2ReductionPerUnit: 0.4, landRequirementPerUnit: 0.01, costPerUnit: 8000 },
    'Wind': { co2ReductionPerUnit: 1.5, landRequirementPerUnit: 0.05, costPerUnit: 300000 },
    'Hydropower': { co2ReductionPerUnit: 5, landRequirementPerUnit: 2, costPerUnit: 5000000 },
    'HydrogenElectric': { co2ReductionPerUnit: 3, landRequirementPerUnit: 1, costPerUnit: 2000000 },
  };
  
  const renewable = renewableOptions[selectedRenewable] || renewableOptions['Solar'];
  
  const targetCo2Reduction = (co2EmissionsPerDay * desiredReductionPercentage) / 100;
  const requiredUnits = Math.ceil(targetCo2Reduction / renewable.co2ReductionPerUnit);
  const landRequired = requiredUnits * renewable.landRequirementPerUnit;
  
  const deployableUnits = availableLand >= landRequired ? requiredUnits : Math.floor(availableLand / renewable.landRequirementPerUnit);
  const totalReductionPerDay = deployableUnits * renewable.co2ReductionPerUnit;
  const timeToAchieveNeutrality = targetCo2Reduction > 0 ? Math.ceil(targetCo2Reduction / totalReductionPerDay) : 0;
  const implementationCost = deployableUnits * renewable.costPerUnit;
  
  const carbonCreditPerTon = 300;
  const carbonCreditsSavedPerDay = totalReductionPerDay;
  const costOfCarbonCreditsSavedPerYear = carbonCreditsSavedPerDay * 365 * carbonCreditPerTon;
  
  return {
    selectedRenewable,
    implementationCost: `₹${implementationCost.toLocaleString()}`,
    targetCo2Reduction: targetCo2Reduction.toFixed(2),
    totalCo2ReductionPerDay: totalReductionPerDay.toFixed(2),
    landRequired,
    timeToAchieveNeutrality,
    carbonCreditsSavedPerDay,
    costOfCarbonCreditsSavedPerYear: `₹${costOfCarbonCreditsSavedPerYear.toLocaleString()}`
  };
};

// Calculate carbon capture and storage impact
export const calculateCaptureImpact = (estimatedEmissions, emissionType, captureRate, technology) => {
  const efficiencyFactors = {
    'CO2': {
      'Post-combustion': 0.85,
      'Pre-combustion': 0.90,
      'Oxyfuel combustion': 0.95,
    },
    'CH4': {
      'Ventilation Air Methane (VAM)': 0.75,
      'Degasification': 0.80,
      'Flaring': 0.95,
    }
  };
  
  const technologyFactor = efficiencyFactors[emissionType]?.[technology] || 0.80;
  
  const captureEfficiency = (captureRate / 100) * technologyFactor;
  
  const capturedAmount = estimatedEmissions * captureEfficiency;
  
  const co2Equivalent = emissionType === 'CH4' ? capturedAmount * 28 : capturedAmount;
  
  return {
    capturedCO2: emissionType === 'CO2' ? capturedAmount : 0,
    capturedMethane: emissionType === 'CH4' ? capturedAmount : 0,
    co2Equivalent: co2Equivalent,
    captureEfficiency: captureEfficiency * 100,
    technologyUsed: technology,
    emissionType: emissionType
  };
};

// Calculate carbon capture and storage
export const calculateCCS = (annualEmissions, ccsTechnology) => {
  const captureEfficiencyMap = {
    "Post-combustion": 0.85,
    "Pre-combustion": 0.90,
    "Oxy-fuel combustion": 0.95
  };
  
  const captureEfficiency = captureEfficiencyMap[ccsTechnology] || 0.85;
  const capturedCO2 = annualEmissions * captureEfficiency;
  const costPerTon = 2000;
  const maintenanceCost = 10000000;
  const carbonCreditPrice = 1500;
  
  const installationCost = capturedCO2 * costPerTon;
  const carbonCreditRevenue = capturedCO2 * carbonCreditPrice;
  const totalCostForFirstYear = installationCost + maintenanceCost;
  const totalRevenueForFirstYear = carbonCreditRevenue;
  const netProfitForFirstYear = totalRevenueForFirstYear - totalCostForFirstYear;
  const annualNetProfit = carbonCreditRevenue - maintenanceCost;
  const totalProfitForTenYears = netProfitForFirstYear + (annualNetProfit * 9);
  
  return {
    ccsTechnology,
    captureEfficiency: `${(captureEfficiency * 100).toFixed(2)}%`,
    capturedCO2: `${capturedCO2.toFixed(2)} tons`,
    installationCost: `₹${installationCost.toFixed(2)}`,
    maintenanceCost: `₹${maintenanceCost.toFixed(2)}`,
    carbonCreditRevenue: `₹${carbonCreditRevenue.toFixed(2)}`,
    totalCostForFirstYear: `₹${totalCostForFirstYear.toFixed(2)}`,
    netProfitForFirstYear: `₹${netProfitForFirstYear.toFixed(2)}`,
    annualNetProfit: `₹${annualNetProfit.toFixed(2)}`,
    totalProfitForTenYears: `₹${totalProfitForTenYears.toFixed(2)}`
  };
};

// Calculate methane capture and storage
export const calculateMCS = (annualMethaneEmissions, mcsTechnology, utilization = 'energy') => {
  const utilizationStrategies = {
    energy: { efficiencyRate: 0.85, pricePerMWh: 3500, conversionFactor: 0.055 },
    fuel: { efficiencyRate: 0.75, pricePerMWh: 5000, conversionFactor: 0.065 }
  };
  
  const strategy = utilizationStrategies[utilization] || utilizationStrategies.energy;
  const capturedMethane = annualMethaneEmissions * strategy.efficiencyRate;
  const mWhGenerated = capturedMethane * strategy.conversionFactor;
  const revenue = mWhGenerated * strategy.pricePerMWh;
  
  return {
    mcsTechnology,
    capturedMethane: `${capturedMethane.toFixed(2)} tons`,
    mWhGenerated: `${mWhGenerated.toFixed(2)} MWh`,
    revenue: `₹${revenue.toFixed(2)}`
  };
};

// Convert emission values to numeric for calculations
export const extractNumericValue = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }
  if (typeof value === 'object' && value !== null) {
    return value.value || 0;
  }
  return 0;
};

// Calculate total emissions from all sources
export const calculateTotalEmissions = (emissions) => {
  const { electricity, fuel, shipping, explosion, coal } = emissions;
  
  const electricityCO2 = electricity?.CO2 ? extractNumericValue(electricity.CO2) : 0;
  const fuelCO2 = fuel?.totalDirectCO2e ? extractNumericValue(fuel.totalDirectCO2e) : 0;
  const shippingCO2 = shipping?.carbonEmissions?.kilograms || 0;
  const explosionCO2 = explosion?.CO2 ? extractNumericValue(explosion.CO2) * 1000 : 0; // Convert tons to kg
  const coalCO2 = coal?.co2Emissions || 0;
  
  const totalCO2 = electricityCO2 + fuelCO2 + shippingCO2 + explosionCO2 + coalCO2;
  
  const totalMethane = fuel?.methaneCO2e ? extractNumericValue(fuel.methaneCO2e) : 0;
  const totalNOx = explosion?.NOx ? extractNumericValue(explosion.NOx) * 1000 : 0; // Convert tons to kg
  
  return {
    CO2: totalCO2,
    Methane: totalMethane,
    NOx: totalNOx,
    totalGHG: totalCO2 + totalMethane + totalNOx
  };
};

// Calculate net emissions after reductions
export const calculateNetEmissions = (totalEmissions, reductions) => {
  if (!totalEmissions || !reductions) {
    return {
      totalEmissions: 0,
      totalReduction: 0,
      netEmissions: 0,
      reductionPercentage: 0
    };
  }

  // Extract and convert carbon sink reductions (from daily to kg)
  const carbonSinkReduction = reductions.carbonSink?.dailySequestrationRate ? 
    extractNumericValue(reductions.carbonSink.dailySequestrationRate) * 1000 : 0; // Convert tons to kg
  
  // Extract and convert renewable reductions (from daily to kg)
  const renewableReduction = reductions.renewable?.totalCo2ReductionPerDay ? 
    extractNumericValue(reductions.renewable.totalCo2ReductionPerDay) * 1000 : 0; // Convert tons to kg
  
  // Extract and convert CCS reductions (from annual to daily to kg)
  const ccsReduction = reductions.ccs?.capturedCO2 ? 
    extractNumericValue(reductions.ccs.capturedCO2) * 1000 / 365 : 0; // Convert annual tons to daily kg
  
  // Extract and convert MCS reductions (from annual to daily to kg)
  const mcsReduction = reductions.mcs?.capturedMethane ? 
    extractNumericValue(reductions.mcs.capturedMethane) * 28 * 1000 / 365 : 0; // Convert methane to CO2e, tons to kg, annual to daily
  
  const totalReduction = carbonSinkReduction + renewableReduction + ccsReduction + mcsReduction;
  const totalEmissionsValue = totalEmissions.totalGHG || 0;
  const netEmissionsValue = Math.max(0, totalEmissionsValue - totalReduction);
  const reductionPercentage = totalEmissionsValue > 0 ? (totalReduction / totalEmissionsValue) * 100 : 0;
  
  return {
    totalEmissions: totalEmissionsValue,
    totalReduction,
    netEmissions: netEmissionsValue,
    reductionPercentage
  };
};
