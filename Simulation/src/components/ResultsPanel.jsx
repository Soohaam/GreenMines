
import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  BarChart2, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  CloudCog,
  Wind, 
  Leaf, 
  Truck,
  AlertTriangle,
  Gauge,
  ThermometerSun
} from 'lucide-react';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRiskColor, formatNumber } from '../utils/mapUtils';
import { ScrollArea } from './ui/scroll-area';

const ResultsPanel = ({ emissions, reductions, netEmissions, shipments, selectedMine }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState([]);
  
  // Format emissions for charts
  useEffect(() => {
    if (emissions && (emissions.electricity || emissions.fuel || emissions.coal || emissions.shipping || emissions.explosion)) {
      // Get values with safeguards
      const getEmissionValue = (source, path, defaultValue = 0) => {
        const paths = path.split('.');
        let value = source;
        for (const key of paths) {
          if (value && typeof value === 'object') {
            value = value[key];
          } else {
            return defaultValue;
          }
        }
        
        // Handle string values like "10.5 tons" -> 10.5
        if (typeof value === 'string') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) return numValue;
        }
        
        return value || defaultValue;
      };
      
      // Create data array with appropriate emission values
      const data = [
        { 
          name: 'Electricity', 
          value: getEmissionValue(emissions.electricity, 'CO2.value', 0), 
          color: '#3F51B5',
          fullName: 'Electricity Usage'
        },
        { 
          name: 'Fuel', 
          value: getEmissionValue(emissions.fuel, 'totalDirectCO2e.value', 0), 
          color: '#FF9800',
          fullName: 'Fuel Consumption'
        },
        { 
          name: 'Shipping', 
          value: getEmissionValue(emissions.shipping, 'carbonEmissions.kilograms', 0), 
          color: '#4CAF50',
          fullName: 'Coal Transport'
        },
        { 
          name: 'Explosion', 
          value: parseFloat((emissions.explosion?.CO2 || "0").replace(" tons", "")) * 1000 || 0, 
          color: '#F44336',
          fullName: 'Mining Explosions'
        },
        { 
          name: 'Coal', 
          value: getEmissionValue(emissions.coal, 'co2Emissions', 0), 
          color: '#9C27B0',
          fullName: 'Coal Processing'
        },
      ];
      
      setChartData(data);
    }
  }, [emissions]);
  
  // Calculate the reduction percentages
  const getReductionPercentage = () => {
    if (!netEmissions || !netEmissions.totalEmissions) return 0;
    return Math.min((netEmissions.totalReduction / netEmissions.totalEmissions) * 100, 100);
  };
  
  // Prepare data for line chart
  const prepareLineData = () => {
    return [
      { name: 'Jan', emissions: 4000 },
      { name: 'Feb', emissions: 3500 },
      { name: 'Mar', emissions: 3800 },
      { name: 'Apr', emissions: 3200 },
      { name: 'May', emissions: 3000 },
      { name: 'Jun', emissions: netEmissions?.netEmissions || 2800 },
    ];
  };
  
  const lineChartData = prepareLineData();
  
  // Get reduction methods data with safe access
  const getReductionMethodsData = () => {
    // Helper function to extract numeric values from string values with units
    const extractNumericValue = (value, defaultValue = 0) => {
      if (typeof value === 'number') return value;
      if (!value) return defaultValue;
      
      const match = String(value).match(/^([\d.]+)/);
      return match ? parseFloat(match[1]) : defaultValue;
    };
    
    // Calculate carbon sink absorption (convert from daily to annual)
    const carbonSinkValue = reductions?.carbonSink?.dailySequestrationRate ? 
      extractNumericValue(reductions.carbonSink.dailySequestrationRate) * 365 : 0;
    
    // Calculate renewable reduction (convert from daily to annual)
    const renewableValue = reductions?.renewable?.totalCo2ReductionPerDay ?
      extractNumericValue(reductions.renewable.totalCo2ReductionPerDay) * 365 : 0;
    
    // Get CCS value directly
    const ccsValue = reductions?.ccs?.capture ? parseFloat(reductions.ccs.capture) : 0;
    
    // Calculate MCS value
    const mcsValue = reductions?.mcs?.capturedMethane ? parseFloat(reductions.mcs.capturedMethane) * 28 : 0;

    return [
      { 
        name: 'Carbon Sinks', 
        value: carbonSinkValue,
        fill: '#4CAF50'
      },
      { 
        name: 'Renewable', 
        value: renewableValue,
        fill: '#FFB300'
      },
      { 
        name: 'CCS', 
        value: ccsValue,
        fill: '#9C27B0'
      },
      { 
        name: 'MCS', 
        value: mcsValue,
        fill: '#2196F3'
      },
    ];
  };
  
  // Helper function to get risk level color class
  const getRiskLevelColorClass = (value, thresholds = { low: 200, medium: 500, high: 800, critical: 1000 }) => {
    if (!value) return 'bg-gray-400';
    if (value < thresholds.low) return 'bg-green-500';
    if (value < thresholds.medium) return 'bg-yellow-500';
    if (value < thresholds.high) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 pt-2 bg-white sticky top-0 z-10">
        <button 
          className={`px-4 py-2 border-b-2 text-sm font-medium ${activeTab === 'overview' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 border-b-2 text-sm font-medium ${activeTab === 'charts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('charts')}
        >
          Charts
        </button>
        <button 
          className={`px-4 py-2 border-b-2 text-sm font-medium ${activeTab === 'shipments' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('shipments')}
        >
          Shipments
        </button>
        <button 
          className={`px-4 py-2 border-b-2 text-sm font-medium ${activeTab === 'insights' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
      </div>
      
      {/* Content area */}
      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Emissions */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Emissions</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {netEmissions?.totalEmissions ? formatNumber(netEmissions.totalEmissions, ' kg') : 'N/A'}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-full ${getRiskLevelColorClass(netEmissions?.totalEmissions)}`}>
                      <AlertTriangle className="text-white h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getRiskLevelColorClass(netEmissions?.totalEmissions)}`} 
                        style={{ width: `${Math.min((netEmissions?.totalEmissions || 0) / 1000 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Net Emissions */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Net Emissions</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {netEmissions?.netEmissions ? formatNumber(netEmissions.netEmissions, ' kg') : 'N/A'}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-full ${getRiskLevelColorClass(netEmissions?.netEmissions)}`}>
                      <Gauge className="text-white h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getRiskLevelColorClass(netEmissions?.netEmissions)}`} 
                        style={{ width: `${Math.min((netEmissions?.netEmissions || 0) / 1000 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Reductions */}
                <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Reductions</p>
                      <h3 className="text-2xl font-bold mt-1 text-green-600">
                        {netEmissions?.totalReduction ? formatNumber(netEmissions.totalReduction, ' kg') : 'N/A'}
                      </h3>
                    </div>
                    <div className="p-2 rounded-full bg-green-500">
                      <TrendingDown className="text-white h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${getReductionPercentage()}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getReductionPercentage().toFixed(1)}% reduction
                    </div>
                  </div>
                </div>
                
                {/* Risk Level */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Risk Level</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {netEmissions?.netEmissions > 800 ? 'Critical' : 
                        netEmissions?.netEmissions > 500 ? 'High' :
                        netEmissions?.netEmissions > 200 ? 'Moderate' : 'Low'}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-full ${getRiskLevelColorClass(netEmissions?.netEmissions)}`}>
                      <ThermometerSun className="text-white h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="grid grid-cols-4 gap-1">
                      <div className="h-1.5 bg-green-500 rounded"></div>
                      <div className="h-1.5 bg-yellow-500 rounded"></div>
                      <div className="h-1.5 bg-orange-500 rounded"></div>
                      <div className="h-1.5 bg-red-500 rounded"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                      <span>Critical</span>
                    </div>
                  </div>
                </div>
                
                {/* Emission sources breakdown */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-md border border-gray-100 col-span-1 md:col-span-2 transition-all hover:shadow-lg">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Emission Sources</h3>
                  <div className="space-y-3">
                    {Object.entries({
                      'Electricity': emissions?.electricity?.CO2?.value || 0,
                      'Fuel': emissions?.fuel?.totalDirectCO2e?.value || 0,
                      'Shipping': emissions?.shipping?.carbonEmissions?.kilograms || 0,
                      'Explosion': parseFloat((emissions?.explosion?.CO2 || "0").replace(" tons", "")) * 1000 || 0,
                      'Coal': emissions?.coal?.co2Emissions || 0
                    }).map(([source, value]) => (
                      <div key={source}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{source}</span>
                          <span className="text-sm">{formatNumber(value, ' kg')}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              source === 'Electricity' ? 'bg-blue-500' :
                              source === 'Fuel' ? 'bg-orange-500' :
                              source === 'Shipping' ? 'bg-green-500' :
                              source === 'Explosion' ? 'bg-red-500' : 'bg-purple-500'
                            }`} 
                            style={{ width: `${Math.min(value / 2000 * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reduction methods breakdown */}
                <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-lg shadow-md border border-gray-100 col-span-1 md:col-span-2 transition-all hover:shadow-lg">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Reduction Methods</h3>
                  <div className="space-y-3">
                    {getReductionMethodsData().map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm">{formatNumber(item.value, ' tons/year')}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full`}
                            style={{ width: `${Math.min(item.value / 1000 * 100, 100)}%`, backgroundColor: item.fill }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Charts Tab */}
          {activeTab === 'charts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emissions pie chart */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Emissions by Source</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${formatNumber(value, ' kg')}`, 'Emissions']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Emissions trend line chart */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Emissions Trend</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={lineChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatNumber(value, ' kg')}`, 'Emissions']} />
                        <Line type="monotone" dataKey="emissions" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Reductions bar chart */}
                <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Reduction Methods</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getReductionMethodsData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatNumber(value, ' tons')}`, 'Reduction']} />
                        <Bar dataKey="value">
                          {getReductionMethodsData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Net emissions comparison */}
                <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Emissions Balance</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Total', value: netEmissions?.totalEmissions || 0, fill: '#F44336' },
                          { name: 'Reductions', value: netEmissions?.totalReduction || 0, fill: '#4CAF50' },
                          { name: 'Net', value: netEmissions?.netEmissions || 0, fill: '#FF9800' },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatNumber(value, ' kg')}`, 'Emissions']} />
                        <Bar dataKey="value">
                          {[
                            { name: 'Total', fill: '#F44336' },
                            { name: 'Reductions', fill: '#4CAF50' },
                            { name: 'Net', fill: '#FF9800' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Shipments Tab */}
          {activeTab === 'shipments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Coal Transport Shipments</h3>
              
              {shipments.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 text-center rounded-lg border border-gray-200">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No shipments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a shipment by selecting a mine and clicking on a destination on the map.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {shipments.map(shipment => (
                    <div key={shipment.id} className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                      <div className="flex justify-between">
                        <h4 className="font-bold">Shipment #{shipment.id}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          shipment.transportMethod === 'rail' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {shipment.transportMethod === 'rail' ? 'Rail' : 'Truck'}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Origin</p>
                            <p className="text-xs text-gray-500">{shipment.fromMine.name}</p>
                          </div>
                        </div>
                        
                        <div className="w-0.5 h-4 bg-gray-300 ml-3"></div>
                        
                        <div className="flex items-start">
                          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Destination</p>
                            <p className="text-xs text-gray-500">{shipment.toDestination.name} ({shipment.toDestination.type})</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Distance</p>
                          <p className="text-sm font-medium">{shipment.route.distance.toFixed(1)} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Travel Time</p>
                          <p className="text-sm font-medium">{shipment.route.time.toFixed(1)} hrs</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">CO₂ Emissions</p>
                          <p className="text-sm font-medium">
                            {formatNumber(shipment.route.distance * 0.092 * 1000, ' g')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Emission Insights & Recommendations</h3>
              
              <div className="bg-gradient-to-br from-white to-yellow-50 p-4 rounded-lg shadow-md border border-gray-100">
                <h4 className="font-bold flex items-center text-amber-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Risk Assessment
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Current emission levels indicate a {
                    netEmissions?.netEmissions > 800 ? 'critical' : 
                    netEmissions?.netEmissions > 500 ? 'high' :
                    netEmissions?.netEmissions > 200 ? 'moderate' : 'low'
                  } risk level. This requires {
                    netEmissions?.netEmissions > 500 ? 'immediate attention and mitigation strategies' : 
                    'ongoing monitoring and gradual improvement'
                  }.
                </p>
                
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getRiskLevelColorClass(netEmissions?.netEmissions)}`} 
                    style={{ width: `${Math.min((netEmissions?.netEmissions || 0) / 1000 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h4 className="font-bold flex items-center text-blue-600">
                    <CloudCog className="h-5 w-5 mr-2" />
                    Carbon Capture Potential
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Adding additional carbon capture facilities could reduce emissions by approximately {formatNumber((netEmissions?.totalEmissions || 0) * 0.3, ' kg')} annually.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Current capture: {formatNumber(getReductionMethodsData()[2].value * 1000, ' kg')}</span>
                    <span className="text-xs font-medium text-blue-600">Potential: +30%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h4 className="font-bold flex items-center text-green-600">
                    <Leaf className="h-5 w-5 mr-2" />
                    Carbon Sink Coverage
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Expanding carbon sink area by 5 hectares could offset an additional {formatNumber((getReductionMethodsData()[0].value || 10) * 5 / (reductions?.carbonSink?.area || 1) * 1000, ' kg')} of CO₂ annually.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Current sinks: {reductions?.carbonSink?.area || 0} hectares</span>
                    <span className="text-xs font-medium text-green-600">Recommend: +5 hectares</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-amber-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h4 className="font-bold flex items-center text-amber-600">
                    <Wind className="h-5 w-5 mr-2" />
                    Renewable Energy Transition
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Increasing renewable energy capacity could reduce electricity-related emissions by up to 60%.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Current reduction: {formatNumber(getReductionMethodsData()[1].value * 1000, ' kg')}</span>
                    <span className="text-xs font-medium text-amber-600">Potential: +60%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-purple-50 p-4 rounded-lg shadow-md border border-gray-100">
                  <h4 className="font-bold flex items-center text-purple-600">
                    <Truck className="h-5 w-5 mr-2" />
                    Transport Optimization
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Shifting more shipments to rail transport could reduce shipping emissions by approximately 35%.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Current rail usage: {(shipments.filter(s => s.transportMethod === 'rail').length / Math.max(shipments.length, 1) * 100).toFixed(0)}%</span>
                    <span className="text-xs font-medium text-purple-600">Recommend: Increase to 70%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold flex items-center text-blue-700">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Recommendations
                </h4>
                <p className="mt-2 text-sm text-blue-700">
                  Based on your current emissions profile, our AI system recommends focusing on {
                    netEmissions?.netEmissions > 800 ? 'carbon capture technology and immediate renewable energy deployment' : 
                    netEmissions?.netEmissions > 500 ? 'expanding carbon sinks and optimizing transportation' :
                    'maintaining current reduction strategies and gradual improvements'
                  }.
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-green-600">Potential reduction: {formatNumber((netEmissions?.totalEmissions || 0) * 0.4, ' kg')} (40%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ResultsPanel;
