"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Activity,
  Camera,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Zap,
  Leaf,
  TreePine,
  Droplets,
  Wind,
  Play,
} from "lucide-react"

// Environmental data interface
interface EnvironmentalData {
  co2Reduced: number // kg per hour
  fuelSaved: number // liters per hour
  airQualityIndex: number // 0-500 scale
  noiseReduction: number // decibels reduced
  particleReduction: number // PM2.5 reduction percentage
}

// Simulated traffic data with environmental impact
interface TrafficData {
  intersection: string
  vehicleCount: number
  avgWaitTime: number
  congestionLevel: "low" | "medium" | "high"
  lightStatus: "red" | "yellow" | "green"
  mlRecommendation: string
  coordinates: { x: number; y: number }
  efficiency: number
  queueLength: number
  idleTime: number // seconds cars spend idling
  co2Emissions: number // kg per hour at this intersection
  fuelConsumption: number // liters per hour
}

interface TrafficLight {
  id: string
  status: "red" | "yellow" | "green"
  timeRemaining: number
  autoMode: boolean
  intersection: string
  cycleOptimized: boolean
  ecoMode: boolean
}

export default function TrafficDashboard() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([
    {
      intersection: "Main St & 1st Ave",
      vehicleCount: 12,
      avgWaitTime: 25,
      congestionLevel: "low",
      lightStatus: "green",
      mlRecommendation: "Optimal timing - maintain current cycle",
      coordinates: { x: 200, y: 150 },
      efficiency: 89,
      queueLength: 3,
      idleTime: 45,
      co2Emissions: 12.5,
      fuelConsumption: 5.2,
    },
    {
      intersection: "Broadway & 2nd St",
      vehicleCount: 28,
      avgWaitTime: 45,
      congestionLevel: "medium",
      lightStatus: "red",
      mlRecommendation: "Reduce red phase by 8s to minimize emissions",
      coordinates: { x: 350, y: 200 },
      efficiency: 67,
      queueLength: 8,
      idleTime: 180,
      co2Emissions: 28.7,
      fuelConsumption: 12.1,
    },
    {
      intersection: "Oak Ave & 3rd St",
      vehicleCount: 8,
      avgWaitTime: 15,
      congestionLevel: "low",
      lightStatus: "green",
      mlRecommendation: "Low traffic - extend green for eco-efficiency",
      coordinates: { x: 150, y: 300 },
      efficiency: 95,
      queueLength: 2,
      idleTime: 20,
      co2Emissions: 6.8,
      fuelConsumption: 2.9,
    },
    {
      intersection: "Pine St & 4th Ave",
      vehicleCount: 35,
      avgWaitTime: 52,
      congestionLevel: "high",
      lightStatus: "yellow",
      mlRecommendation: "High emissions detected - priority eco-timing",
      coordinates: { x: 400, y: 120 },
      efficiency: 54,
      queueLength: 12,
      idleTime: 240,
      co2Emissions: 42.3,
      fuelConsumption: 17.8,
    },
  ])

  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([
    {
      id: "TL001",
      status: "green",
      timeRemaining: 35,
      autoMode: true,
      intersection: "Main St & 1st Ave",
      cycleOptimized: true,
      ecoMode: true,
    },
    {
      id: "TL002",
      status: "red",
      timeRemaining: 28,
      autoMode: true,
      intersection: "Broadway & 2nd St",
      cycleOptimized: true,
      ecoMode: true,
    },
    {
      id: "TL003",
      status: "green",
      timeRemaining: 42,
      autoMode: true,
      intersection: "Oak Ave & 3rd St",
      cycleOptimized: false,
      ecoMode: false,
    },
    {
      id: "TL004",
      status: "yellow",
      timeRemaining: 3,
      autoMode: true,
      intersection: "Pine St & 4th Ave",
      cycleOptimized: true,
      ecoMode: true,
    },
  ])

  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData>({
    co2Reduced: 118.7, // kg per hour
    fuelSaved: 49.8, // liters per hour
    airQualityIndex: 45, // Good air quality
    noiseReduction: 8.5, // decibels reduced
    particleReduction: 23, // PM2.5 reduction percentage
  })

  const [systemStats, setSystemStats] = useState({
    totalIntersections: 4,
    avgWaitTime: 34,
    trafficFlow: 76,
    mlAccuracy: 94,
    activeAlerts: 1,
    energySaved: 28,
    vehiclesProcessed: 1247,
    totalCO2Saved: 2847, // kg today
    totalFuelSaved: 1234, // liters today
  })

  const [animationKey, setAnimationKey] = useState(0)

  // Calculate environmental impact based on traffic conditions
  const calculateEnvironmentalImpact = (data: TrafficData[]) => {
    const totalIdleTime = data.reduce((sum, intersection) => sum + intersection.idleTime, 0)
    const totalCO2 = data.reduce((sum, intersection) => sum + intersection.co2Emissions, 0)
    const totalFuel = data.reduce((sum, intersection) => sum + intersection.fuelConsumption, 0)

    // Calculate reductions based on optimization
    const baselineCO2 = totalCO2 * 1.4 // 40% more without optimization
    const baselineFuel = totalFuel * 1.35 // 35% more without optimization

    return {
      co2Reduced: baselineCO2 - totalCO2,
      fuelSaved: baselineFuel - totalFuel,
      airQualityIndex: Math.max(25, 80 - totalIdleTime / 10),
      noiseReduction: Math.min(15, totalIdleTime / 30),
      particleReduction: Math.min(40, ((baselineCO2 - totalCO2) / baselineCO2) * 100),
    }
  }

  // Realistic traffic light cycling with environmental considerations
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLights((prev) =>
        prev.map((light) => {
          if (!light.autoMode) return light

          let newTimeRemaining = light.timeRemaining - 1
          let newStatus = light.status

          if (newTimeRemaining <= 0) {
            if (light.status === "green") {
              newStatus = "yellow"
              newTimeRemaining = 3
            } else if (light.status === "yellow") {
              newStatus = "red"
              // Eco mode reduces red time to minimize idling
              newTimeRemaining = light.ecoMode ? 20 : light.cycleOptimized ? 25 : 35
            } else if (light.status === "red") {
              newStatus = "green"
              // Eco mode extends green time for better flow
              newTimeRemaining = light.ecoMode ? 45 : light.cycleOptimized ? 40 : 30
            }
          }

          return {
            ...light,
            status: newStatus,
            timeRemaining: newTimeRemaining,
          }
        }),
      )

      // Update traffic data based on light status with environmental calculations
      setTrafficData((prev) =>
        prev.map((data, index) => {
          const correspondingLight = trafficLights[index]
          let newVehicleCount = data.vehicleCount
          let newQueueLength = data.queueLength
          let newAvgWaitTime = data.avgWaitTime
          let newIdleTime = data.idleTime

          if (correspondingLight?.status === "red") {
            // Cars accumulate at red lights, increasing emissions
            newVehicleCount = Math.min(50, data.vehicleCount + Math.floor(Math.random() * 3))
            newQueueLength = Math.min(15, data.queueLength + Math.floor(Math.random() * 2))
            newAvgWaitTime = Math.min(90, data.avgWaitTime + Math.floor(Math.random() * 3))
            newIdleTime = data.idleTime + newQueueLength * 1 // More idle time = more emissions
          } else if (correspondingLight?.status === "green") {
            // Cars move through on green, reducing emissions
            newVehicleCount = Math.max(0, data.vehicleCount - Math.floor(Math.random() * 4 + 2))
            newQueueLength = Math.max(0, data.queueLength - Math.floor(Math.random() * 3 + 1))
            newAvgWaitTime = Math.max(10, data.avgWaitTime - Math.floor(Math.random() * 2 + 1))
            newIdleTime = Math.max(0, data.idleTime - 5) // Reduced idle time
          }

          // Determine congestion level based on queue length
          let congestionLevel: "low" | "medium" | "high" = "low"
          if (newQueueLength > 8) congestionLevel = "high"
          else if (newQueueLength > 4) congestionLevel = "medium"

          // Calculate efficiency based on wait time and queue length
          const efficiency = Math.max(20, Math.min(100, 100 - newAvgWaitTime * 0.8 - newQueueLength * 3))

          // Calculate emissions based on idle time and queue length
          const co2Emissions = newIdleTime * 0.12 + newQueueLength * 2.1 // kg per hour
          const fuelConsumption = co2Emissions * 0.42 // liters per hour

          return {
            ...data,
            vehicleCount: newVehicleCount,
            queueLength: newQueueLength,
            avgWaitTime: newAvgWaitTime,
            idleTime: newIdleTime,
            congestionLevel,
            efficiency: Math.round(efficiency),
            lightStatus: correspondingLight?.status || data.lightStatus,
            co2Emissions: Math.round(co2Emissions * 10) / 10,
            fuelConsumption: Math.round(fuelConsumption * 10) / 10,
          }
        }),
      )

      setAnimationKey((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [trafficLights])

  // Update environmental data based on traffic conditions
  useEffect(() => {
    const newEnvironmentalData = calculateEnvironmentalImpact(trafficData)
    setEnvironmentalData(newEnvironmentalData)

    // Update system stats
    setSystemStats((prev) => {
      const totalWaitTime = trafficData.reduce((sum, data) => sum + data.avgWaitTime, 0)
      const avgWaitTime = Math.round(totalWaitTime / trafficData.length)
      const totalEfficiency = trafficData.reduce((sum, data) => sum + data.efficiency, 0)
      const trafficFlow = Math.round(totalEfficiency / trafficData.length)

      return {
        ...prev,
        avgWaitTime,
        trafficFlow,
        vehiclesProcessed: prev.vehiclesProcessed + Math.floor(Math.random() * 5),
        totalCO2Saved: prev.totalCO2Saved + Math.round(newEnvironmentalData.co2Reduced / 60), // per minute
        totalFuelSaved: prev.totalFuelSaved + Math.round(newEnvironmentalData.fuelSaved / 60), // per minute
      }
    })
  }, [trafficData])

  const toggleLightMode = (lightId: string) => {
    setTrafficLights((prev) =>
      prev.map((light) => (light.id === lightId ? { ...light, autoMode: !light.autoMode } : light)),
    )
  }

  const toggleEcoMode = (lightId: string) => {
    setTrafficLights((prev) =>
      prev.map((light) => (light.id === lightId ? { ...light, ecoMode: !light.ecoMode } : light)),
    )
  }

  const manualLightControl = (lightId: string, newStatus: "red" | "yellow" | "green") => {
    setTrafficLights((prev) =>
      prev.map((light) => (light.id === lightId ? { ...light, status: newStatus, timeRemaining: 30 } : light)),
    )
  }

  const optimizeIntersection = (lightId: string) => {
    setTrafficLights((prev) =>
      prev.map((light) => (light.id === lightId ? { ...light, cycleOptimized: !light.cycleOptimized } : light)),
    )
  }

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getLightColor = (status: string) => {
    switch (status) {
      case "red":
        return "bg-red-500 shadow-red-300"
      case "yellow":
        return "bg-yellow-500 shadow-yellow-300"
      case "green":
        return "bg-green-500 shadow-green-300"
      default:
        return "bg-gray-400"
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return "text-green-600"
    if (efficiency >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getAirQualityColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600"
    if (aqi <= 100) return "text-yellow-600"
    if (aqi <= 150) return "text-orange-600"
    return "text-red-600"
  }

  const getAirQualityLabel = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive"
    return "Unhealthy"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Eco Traffic Control Center
              </h1>
              <p className="text-gray-600">Smart traffic management with real-time environmental impact tracking</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
              <CheckCircle className="w-3 h-3 mr-1" />
              System Online
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 animate-pulse">
              <Leaf className="w-3 h-3 mr-1" />
              Eco Mode Active
            </Badge>
          </div>
        </div>

        {/* Environmental Impact Overview */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Leaf className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Real-time Environmental Impact</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{environmentalData.co2Reduced.toFixed(1)} kg/h</div>
              <div className="text-sm opacity-90">CO₂ Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{environmentalData.fuelSaved.toFixed(1)} L/h</div>
              <div className="text-sm opacity-90">Fuel Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(environmentalData.airQualityIndex)}</div>
              <div className="text-sm opacity-90">Air Quality Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{environmentalData.noiseReduction.toFixed(1)} dB</div>
              <div className="text-sm opacity-90">Noise Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(environmentalData.particleReduction)}%</div>
              <div className="text-sm opacity-90">PM2.5 Reduced</div>
            </div>
          </div>
        </div>

        {/* Enhanced System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Intersections</p>
                  <p className="text-2xl font-bold">{systemStats.totalIntersections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Avg Wait</p>
                  <p className="text-2xl font-bold">{systemStats.avgWaitTime}s</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Traffic Flow</p>
                  <p className="text-2xl font-bold">{systemStats.trafficFlow}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">ML Accuracy</p>
                  <p className="text-2xl font-bold">{systemStats.mlAccuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Alerts</p>
                  <p className="text-2xl font-bold">{systemStats.activeAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">CO₂ Saved</p>
                  <p className="text-2xl font-bold">{Math.round(systemStats.totalCO2Saved / 1000)}t</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Fuel Saved</p>
                  <p className="text-2xl font-bold">{Math.round(systemStats.totalFuelSaved)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Air Quality</p>
                  <p className="text-2xl font-bold">{getAirQualityLabel(environmentalData.airQualityIndex)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="control">Eco Control</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Traffic Map */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Live Traffic Network</span>
                  </CardTitle>
                  <CardDescription>Real-time intersection status with emission monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    <svg className="w-full h-full">
                      {/* Enhanced Roads with gradients */}
                      <defs>
                        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4B5563" />
                          <stop offset="50%" stopColor="#374151" />
                          <stop offset="100%" stopColor="#4B5563" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="150" x2="500" y2="150" stroke="url(#roadGradient)" strokeWidth="6" />
                      <line x1="0" y1="200" x2="500" y2="200" stroke="url(#roadGradient)" strokeWidth="6" />
                      <line x1="150" y1="0" x2="150" y2="320" stroke="url(#roadGradient)" strokeWidth="6" />
                      <line x1="350" y1="0" x2="350" y2="320" stroke="url(#roadGradient)" strokeWidth="6" />

                      {/* Traffic lights and emission visualization */}
                      {trafficData.map((data, index) => (
                        <g key={`${index}-${animationKey}`}>
                          <circle
                            cx={data.coordinates.x}
                            cy={data.coordinates.y}
                            r="15"
                            className={`${getLightColor(data.lightStatus)} animate-pulse`}
                            style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))" }}
                          />
                          <text
                            x={data.coordinates.x}
                            y={data.coordinates.y - 25}
                            textAnchor="middle"
                            className="text-xs font-bold fill-gray-800"
                          >
                            {data.co2Emissions.toFixed(1)} kg/h
                          </text>
                          <text
                            x={data.coordinates.x}
                            y={data.coordinates.y + 35}
                            textAnchor="middle"
                            className={`text-xs font-medium ${getEfficiencyColor(data.efficiency)}`}
                          >
                            {data.efficiency}% efficient
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced ML Recommendations with Environmental Focus */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span>Eco-AI Recommendations</span>
                  </CardTitle>
                  <CardDescription>Environmental optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trafficData.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">{data.intersection}</p>
                          <div className={`w-2 h-2 rounded-full ${getLightColor(data.lightStatus)}`} />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{data.mlRecommendation}</p>
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-gray-500">CO₂: {data.co2Emissions.toFixed(1)} kg/h</span>
                          <span className="text-gray-500">Idle: {data.idleTime}s</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">Eco Score:</span>
                          <Progress value={data.efficiency} className="w-16 h-1" />
                          <span className={`text-xs font-medium ${getEfficiencyColor(data.efficiency)}`}>
                            {data.efficiency}%
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          data.congestionLevel === "high"
                            ? "destructive"
                            : data.congestionLevel === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="ml-4"
                      >
                        {data.congestionLevel}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Environmental Impact Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TreePine className="w-5 h-5 text-green-600" />
                    <span>Environmental Benefits</span>
                  </CardTitle>
                  <CardDescription>Real-time pollution reduction metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CO₂ Emissions Reduced</span>
                      <span className="font-bold text-green-600">{environmentalData.co2Reduced.toFixed(1)} kg/h</span>
                    </div>
                    <Progress value={(environmentalData.co2Reduced / 150) * 100} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fuel Consumption Saved</span>
                      <span className="font-bold text-blue-600">{environmentalData.fuelSaved.toFixed(1)} L/h</span>
                    </div>
                    <Progress value={(environmentalData.fuelSaved / 60) * 100} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Air Quality Index</span>
                      <span className={`font-bold ${getAirQualityColor(environmentalData.airQualityIndex)}`}>
                        {Math.round(environmentalData.airQualityIndex)} -{" "}
                        {getAirQualityLabel(environmentalData.airQualityIndex)}
                      </span>
                    </div>
                    <Progress value={100 - (environmentalData.airQualityIndex / 150) * 100} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Noise Reduction</span>
                      <span className="font-bold text-purple-600">
                        {environmentalData.noiseReduction.toFixed(1)} dB
                      </span>
                    </div>
                    <Progress value={(environmentalData.noiseReduction / 15) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Daily Environmental Impact */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <span>Daily Impact Summary</span>
                  </CardTitle>
                  <CardDescription>Cumulative environmental benefits today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {systemStats.totalCO2Saved.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">kg CO₂ Saved</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {systemStats.totalFuelSaved.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Liters Fuel Saved</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm font-medium">Trees Equivalent</span>
                      <span className="font-bold text-emerald-600">
                        {Math.round(systemStats.totalCO2Saved / 22)} trees
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                      <span className="text-sm font-medium">Cars Off Road</span>
                      <span className="font-bold text-cyan-600">
                        {Math.round(systemStats.totalCO2Saved / 4600)} cars/day
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Energy Saved</span>
                      <span className="font-bold text-purple-600">
                        {Math.round(systemStats.totalFuelSaved * 9.7)} kWh
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="control" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trafficLights.map((light, index) => (
                <Card
                  key={light.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getLightColor(light.status)}`} />
                        <span>Eco Light {light.id}</span>
                        {light.ecoMode && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            <Leaf className="w-3 h-3 mr-1" />
                            Eco Mode
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Auto Mode</span>
                        <Switch
                          checked={light.autoMode}
                          onCheckedChange={() => toggleLightMode(light.id)}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </div>
                    <CardDescription>{light.intersection}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className={`w-14 h-14 rounded-full transition-all duration-300 ${
                            light.status === "red" ? "bg-red-500 shadow-lg shadow-red-300 animate-pulse" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs font-medium">Stop</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className={`w-14 h-14 rounded-full transition-all duration-300 ${
                            light.status === "yellow"
                              ? "bg-yellow-500 shadow-lg shadow-yellow-300 animate-pulse"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs font-medium">Caution</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className={`w-14 h-14 rounded-full transition-all duration-300 ${
                            light.status === "green"
                              ? "bg-green-500 shadow-lg shadow-green-300 animate-pulse"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs font-medium">Go</span>
                      </div>
                    </div>

                    <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Time Remaining</p>
                      <p className="text-3xl font-bold text-gray-900">{light.timeRemaining}s</p>
                      <Progress value={(light.timeRemaining / 60) * 100} className="mt-2" />
                    </div>

                    {/* Environmental Stats for this intersection */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <div className="font-bold text-green-600">{trafficData[index]?.co2Emissions.toFixed(1)}</div>
                        <div className="text-gray-600">kg CO₂/h</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <div className="font-bold text-blue-600">{trafficData[index]?.idleTime}</div>
                        <div className="text-gray-600">idle seconds</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => optimizeIntersection(light.id)}
                        className={`${light.cycleOptimized ? "bg-green-50 border-green-200" : ""}`}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        {light.cycleOptimized ? "Optimized" : "Optimize"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleEcoMode(light.id)}
                        className={`${light.ecoMode ? "bg-emerald-50 border-emerald-200" : ""}`}
                      >
                        <Leaf className="w-4 h-4 mr-1" />
                        {light.ecoMode ? "Eco On" : "Eco Off"}
                      </Button>
                      <Badge variant="outline" className="justify-center py-2">
                        Queue: {trafficData[index]?.queueLength || 0}
                      </Badge>
                    </div>

                    {!light.autoMode && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={light.status === "red" ? "default" : "outline"}
                          onClick={() => manualLightControl(light.id, "red")}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                          Red
                        </Button>
                        <Button
                          size="sm"
                          variant={light.status === "yellow" ? "default" : "outline"}
                          onClick={() => manualLightControl(light.id, "yellow")}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Yellow
                        </Button>
                        <Button
                          size="sm"
                          variant={light.status === "green" ? "default" : "outline"}
                          onClick={() => manualLightControl(light.id, "green")}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                          Green
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Live Video Feeds */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <span>Live Video Monitoring</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      LIVE
                    </Badge>
                  </CardTitle>
                  <CardDescription>Real-time video feeds with AI-powered traffic analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {trafficData.map((data, index) => (
                      <div key={index} className="relative group">
                        {/* Video Feed Container */}
                        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden relative">
                          {/* Simulated Video Background */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600">
                            {/* Road Surface */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-800">
                              {/* Road markings */}
                              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 opacity-60"></div>
                              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-40 transform translate-y-4"></div>
                            </div>

                            {/* Traffic Light in Video */}
                            <div className="absolute top-4 right-4">
                              <div className="bg-black rounded-lg p-1 flex flex-col space-y-1">
                                <div
                                  className={`w-3 h-3 rounded-full ${data.lightStatus === "red" ? "bg-red-500 shadow-red-300 shadow-lg" : "bg-gray-600"}`}
                                ></div>
                                <div
                                  className={`w-3 h-3 rounded-full ${data.lightStatus === "yellow" ? "bg-yellow-500 shadow-yellow-300 shadow-lg" : "bg-gray-600"}`}
                                ></div>
                                <div
                                  className={`w-3 h-3 rounded-full ${data.lightStatus === "green" ? "bg-green-500 shadow-green-300 shadow-lg" : "bg-gray-600"}`}
                                ></div>
                              </div>
                            </div>

                            {/* Animated Cars in Video */}
                            <div className="absolute inset-0">
                              {/* Car 1 - Moving left to right */}
                              <div
                                className="absolute bottom-8 w-6 h-3 bg-blue-500 rounded-sm shadow-lg transition-all duration-1000"
                                style={{
                                  left: `${(animationKey * 2) % 120}%`,
                                  transform:
                                    data.lightStatus === "red" && (animationKey * 2) % 120 > 60
                                      ? "translateX(-50px)"
                                      : "none",
                                }}
                              ></div>

                              {/* Car 2 - Moving right to left */}
                              <div
                                className="absolute bottom-12 w-6 h-3 bg-red-500 rounded-sm shadow-lg transition-all duration-1000"
                                style={{
                                  right: `${(animationKey * 1.5) % 120}%`,
                                  transform:
                                    data.lightStatus === "red" && (animationKey * 1.5) % 120 > 60
                                      ? "translateX(50px)"
                                      : "none",
                                }}
                              ></div>

                              {/* Queue visualization when red light */}
                              {data.lightStatus === "red" && data.queueLength > 0 && (
                                <div className="absolute bottom-8 right-16 flex space-x-1">
                                  {Array.from({ length: Math.min(data.queueLength, 5) }).map((_, i) => (
                                    <div key={i} className="w-4 h-2 bg-yellow-400 rounded-sm opacity-80"></div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Video noise/grain effect */}
                            <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                          </div>

                          {/* Video Overlays */}
                          <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-xs backdrop-blur-sm font-mono">
                            CAM-{index + 1} • {data.intersection}
                          </div>

                          <div className="absolute top-2 right-2 flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-mono">REC</span>
                          </div>

                          {/* Bottom overlay with environmental data */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <div className="flex justify-between items-end text-white text-xs">
                              <div>
                                <div className="font-mono">Queue: {data.queueLength} cars</div>
                                <div className="font-mono">Wait: {data.avgWaitTime}s</div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono text-green-400">CO₂: {data.co2Emissions.toFixed(1)} kg/h</div>
                                <div className="font-mono text-blue-400">Eco: {data.efficiency}%</div>
                              </div>
                            </div>
                          </div>

                          {/* AI Detection Boxes */}
                          <div className="absolute inset-0">
                            {/* Vehicle detection boxes */}
                            {data.vehicleCount > 0 && (
                              <>
                                <div className="absolute bottom-8 left-4 w-8 h-4 border-2 border-green-400 rounded">
                                  <div className="absolute -top-5 left-0 text-green-400 text-xs font-mono bg-black/50 px-1">
                                    Vehicle
                                  </div>
                                </div>
                                {data.queueLength > 2 && (
                                  <div className="absolute bottom-12 right-8 w-8 h-4 border-2 border-yellow-400 rounded">
                                    <div className="absolute -top-5 left-0 text-yellow-400 text-xs font-mono bg-black/50 px-1">
                                      Queue
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Video Quality Indicator */}
                          <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-mono">1080p</span>
                            </div>
                          </div>
                        </div>

                        {/* Video Controls */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-6 w-6 p-0">
                                <Play className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-6 w-6 p-0">
                                <Camera className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-1 text-white text-xs">
                              <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Connection Status */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Connected
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Video Feed Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button size="sm" variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        All Cameras
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="w-4 h-4 mr-2" />
                        AI Analysis
                      </Button>
                      <Button size="sm" variant="outline">
                        <Leaf className="w-4 h-4 mr-2" />
                        Eco View
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>4 cameras online</span>
                      </div>
                      <span>•</span>
                      <span>AI detection active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Environmental Alerts */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span>Live Environmental Data</span>
                  </CardTitle>
                  <CardDescription>Real-time pollution monitoring from video analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Real-time environmental readings */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Air Quality Monitor</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        <Wind className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">AQI: </span>
                        <span className="font-bold text-green-600">
                          {Math.round(environmentalData.airQualityIndex)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">PM2.5: </span>
                        <span className="font-bold text-blue-600">
                          {Math.round(environmentalData.particleReduction)}% ↓
                        </span>
                      </div>
                    </div>
                  </div>

                  {trafficData
                    .filter((data) => data.co2Emissions > 25)
                    .map((data, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">High Emissions Detected</p>
                          <p className="text-xs text-red-600">{data.intersection}</p>
                          <p className="text-xs text-red-500 mt-1">
                            {data.co2Emissions.toFixed(1)} kg CO₂/h • {data.idleTime}s idle time
                          </p>
                        </div>
                      </div>
                    ))}

                  {trafficLights
                    .filter((light) => light.ecoMode)
                    .map((light, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
                      >
                        <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Eco Mode Active</p>
                          <p className="text-xs text-green-600">{light.intersection}</p>
                          <p className="text-xs text-green-500 mt-1">Optimizing for minimal emissions</p>
                        </div>
                      </div>
                    ))}

                  {environmentalData.airQualityIndex <= 50 && (
                    <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <Wind className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Excellent Air Quality</p>
                        <p className="text-xs text-blue-600">AQI: {Math.round(environmentalData.airQualityIndex)}</p>
                        <p className="text-xs text-blue-500 mt-1">Traffic optimization working effectively</p>
                      </div>
                    </div>
                  )}

                  {/* Live Video Analytics */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">AI Video Analysis</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Vehicles Detected: </span>
                        <span className="font-bold text-purple-600">
                          {trafficData.reduce((sum, data) => sum + data.vehicleCount, 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Queue Detection: </span>
                        <span className="font-bold text-orange-600">98.5% accuracy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Environmental Trends</span>
                  </CardTitle>
                  <CardDescription>Hourly pollution reduction patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"].map((time, index) => {
                      const co2Reduction = [65, 45, 72, 58, 38, 81][index]
                      return (
                        <div key={time} className="flex items-center space-x-4">
                          <span className="w-12 text-sm text-gray-600 font-medium">{time}</span>
                          <div className="flex-1">
                            <Progress value={co2Reduction} className="h-3" />
                          </div>
                          <span className="w-16 text-sm text-gray-600 font-medium">{co2Reduction}% CO₂↓</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <span>Eco Performance Metrics</span>
                  </CardTitle>
                  <CardDescription>Environmental optimization results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Emission Reduction Accuracy</span>
                      <span className="font-bold text-green-600">97.2%</span>
                    </div>
                    <Progress value={97.2} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fuel Efficiency Improvement</span>
                      <span className="font-bold text-blue-600">42% better</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Air Quality Improvement</span>
                      <span className="font-bold text-purple-600">35% cleaner</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Carbon Footprint Reduction</span>
                      <span className="font-bold text-emerald-600">48% less CO₂</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
