"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Activity, MapPin, TrendingUp, Leaf } from "lucide-react"
import TrafficDashboard from "./dashboard/page"

export default function LandingPage() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [trafficLights, setTrafficLights] = useState({
    intersection1: { status: "green", timer: 30 },
    intersection2: { status: "red", timer: 45 },
    intersection3: { status: "green", timer: 20 },
    intersection4: { status: "red", timer: 35 },
  })

  const [stats] = useState({
    intersections: 24,
    avgReduction: 35,
    mlAccuracy: 94,
    citiesUsing: 12,
    co2Reduced: 2847, // kg per day
    fuelSaved: 1234, // liters per day
  })

  // Traffic light cycle management
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLights((prev) => {
        const newLights = { ...prev }

        Object.keys(newLights).forEach((key) => {
          const light = newLights[key as keyof typeof newLights]
          light.timer -= 1

          if (light.timer <= 0) {
            if (light.status === "green") {
              light.status = "yellow"
              light.timer = 3
            } else if (light.status === "yellow") {
              light.status = "red"
              light.timer = 30
            } else if (light.status === "red") {
              light.status = "green"
              light.timer = 25
            }
          }
        })

        return newLights
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (showDashboard) {
    return <TrafficDashboard />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Roads */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          {/* Horizontal Roads */}
          <rect x="0" y="200" width="1200" height="60" fill="#374151" />
          <rect x="0" y="540" width="1200" height="60" fill="#374151" />

          {/* Vertical Roads */}
          <rect x="300" y="0" width="60" height="800" fill="#374151" />
          <rect x="840" y="0" width="60" height="800" fill="#374151" />

          {/* Road Markings */}
          <defs>
            <pattern id="roadMarkings" patternUnits="userSpaceOnUse" width="40" height="4">
              <rect width="20" height="4" fill="white" />
            </pattern>
          </defs>

          {/* Horizontal road markings */}
          <rect x="0" y="228" width="1200" height="4" fill="url(#roadMarkings)" />
          <rect x="0" y="568" width="1200" height="4" fill="url(#roadMarkings)" />

          {/* Vertical road markings */}
          <rect x="328" y="0" width="4" height="800" fill="url(#roadMarkings)" transform="rotate(90 330 400)" />
          <rect x="868" y="0" width="4" height="800" fill="url(#roadMarkings)" transform="rotate(90 870 400)" />
        </svg>
      </div>

      {/* Smart Traffic Lights at Intersections */}
      <div className="absolute inset-0">
        <div className="traffic-light" style={{ left: "285px", top: "185px" }}>
          <div
            className={`w-6 h-6 rounded-full animate-pulse shadow-lg ${getLightColor(trafficLights.intersection1.status)}`}
          ></div>
        </div>
        <div className="traffic-light" style={{ left: "825px", top: "185px" }}>
          <div
            className={`w-6 h-6 rounded-full animate-pulse shadow-lg ${getLightColor(trafficLights.intersection2.status)}`}
          ></div>
        </div>
        <div className="traffic-light" style={{ left: "285px", top: "525px" }}>
          <div
            className={`w-6 h-6 rounded-full animate-pulse shadow-lg ${getLightColor(trafficLights.intersection3.status)}`}
          ></div>
        </div>
        <div className="traffic-light" style={{ left: "825px", top: "525px" }}>
          <div
            className={`w-6 h-6 rounded-full animate-pulse shadow-lg ${getLightColor(trafficLights.intersection4.status)}`}
          ></div>
        </div>
      </div>

      {/* Animated Cars with Traffic Light Logic */}
      <div className="absolute inset-0">
        {/* Horizontal Cars - Top Road */}
        <div className={`car-horizontal-top ${trafficLights.intersection1.status === "red" ? "car-stopped-left" : ""}`}>
          <div className="w-8 h-4 bg-red-500 rounded-sm shadow-lg"></div>
        </div>
        <div
          className={`car-horizontal-top-reverse ${trafficLights.intersection2.status === "red" ? "car-stopped-right" : ""}`}
        >
          <div className="w-8 h-4 bg-blue-500 rounded-sm shadow-lg"></div>
        </div>

        {/* Horizontal Cars - Bottom Road */}
        <div
          className={`car-horizontal-bottom ${trafficLights.intersection3.status === "red" ? "car-stopped-left" : ""}`}
        >
          <div className="w-8 h-4 bg-green-500 rounded-sm shadow-lg"></div>
        </div>
        <div
          className={`car-horizontal-bottom-reverse ${trafficLights.intersection4.status === "red" ? "car-stopped-right" : ""}`}
        >
          <div className="w-8 h-4 bg-yellow-500 rounded-sm shadow-lg"></div>
        </div>

        {/* Vertical Cars - Left Road */}
        <div className={`car-vertical-left ${trafficLights.intersection1.status === "red" ? "car-stopped-top" : ""}`}>
          <div className="w-4 h-8 bg-purple-500 rounded-sm shadow-lg"></div>
        </div>
        <div
          className={`car-vertical-left-reverse ${trafficLights.intersection3.status === "red" ? "car-stopped-bottom" : ""}`}
        >
          <div className="w-4 h-8 bg-orange-500 rounded-sm shadow-lg"></div>
        </div>

        {/* Vertical Cars - Right Road */}
        <div className={`car-vertical-right ${trafficLights.intersection2.status === "red" ? "car-stopped-top" : ""}`}>
          <div className="w-4 h-8 bg-pink-500 rounded-sm shadow-lg"></div>
        </div>
        <div
          className={`car-vertical-right-reverse ${trafficLights.intersection4.status === "red" ? "car-stopped-bottom" : ""}`}
        >
          <div className="w-4 h-8 bg-indigo-500 rounded-sm shadow-lg"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
              <Leaf className="w-4 h-4 mr-2" />
              Eco-Friendly AI Traffic Management
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Smart Traffic Control
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionary traffic management system reducing pollution through AI optimization, cutting emissions and
              fuel consumption
            </p>
          </div>

          {/* Environmental Impact Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Environmental Impact Today</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.co2Reduced.toLocaleString()} kg</div>
                <div className="text-sm opacity-90">CO₂ Emissions Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.fuelSaved.toLocaleString()} L</div>
                <div className="text-sm opacity-90">Fuel Saved</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.intersections}</div>
                <div className="text-sm text-gray-600">Intersections</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.avgReduction}%</div>
                <div className="text-sm text-gray-600">Wait Time Reduction</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.mlAccuracy}%</div>
                <div className="text-sm text-gray-600">ML Accuracy</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">42%</div>
                <div className="text-sm text-gray-600">Emission Reduction</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              onClick={() => setShowDashboard(true)}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Eco Traffic Control Center
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500">
              Experience real-time traffic management with environmental impact tracking
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center space-y-3 p-6 rounded-xl bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Monitoring</h3>
              <p className="text-gray-600">Live traffic data from cameras and sensors across all intersections</p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pollution Reduction</h3>
              <p className="text-gray-600">
                Track CO₂ emissions and fuel savings in real-time with environmental impact metrics
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Optimization</h3>
              <p className="text-gray-600">
                Machine learning algorithms optimize for both traffic flow and environmental impact
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes moveHorizontalTop {
          0% { transform: translateX(-100px); }
          25% { transform: translateX(250px); }
          25.1% { transform: translateX(250px); }
          50% { transform: translateX(250px); }
          75% { transform: translateX(400px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        
        @keyframes moveHorizontalTopReverse {
          0% { transform: translateX(calc(100vw + 100px)); }
          25% { transform: translateX(900px); }
          25.1% { transform: translateX(900px); }
          50% { transform: translateX(900px); }
          75% { transform: translateX(400px); }
          100% { transform: translateX(-100px); }
        }
        
        @keyframes moveHorizontalBottom {
          0% { transform: translateX(-100px); }
          25% { transform: translateX(250px); }
          25.1% { transform: translateX(250px); }
          50% { transform: translateX(250px); }
          75% { transform: translateX(400px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        
        @keyframes moveHorizontalBottomReverse {
          0% { transform: translateX(calc(100vw + 100px)); }
          25% { transform: translateX(900px); }
          25.1% { transform: translateX(900px); }
          50% { transform: translateX(900px); }
          75% { transform: translateX(400px); }
          100% { transform: translateX(-100px); }
        }
        
        @keyframes moveVerticalLeft {
          0% { transform: translateY(-100px); }
          25% { transform: translateY(150px); }
          25.1% { transform: translateY(150px); }
          50% { transform: translateY(150px); }
          75% { transform: translateY(300px); }
          100% { transform: translateY(calc(100vh + 100px)); }
        }
        
        @keyframes moveVerticalLeftReverse {
          0% { transform: translateY(calc(100vh + 100px)); }
          25% { transform: translateY(600px); }
          25.1% { transform: translateY(600px); }
          50% { transform: translateY(600px); }
          75% { transform: translateY(300px); }
          100% { transform: translateY(-100px); }
        }
        
        @keyframes moveVerticalRight {
          0% { transform: translateY(-100px); }
          25% { transform: translateY(150px); }
          25.1% { transform: translateY(150px); }
          50% { transform: translateY(150px); }
          75% { transform: translateY(300px); }
          100% { transform: translateY(calc(100vh + 100px)); }
        }
        
        @keyframes moveVerticalRightReverse {
          0% { transform: translateY(calc(100vh + 100px)); }
          25% { transform: translateY(600px); }
          25.1% { transform: translateY(600px); }
          50% { transform: translateY(600px); }
          75% { transform: translateY(300px); }
          100% { transform: translateY(-100px); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .car-horizontal-top {
          position: absolute;
          top: 210px;
          animation: moveHorizontalTop 12s linear infinite;
        }
        
        .car-horizontal-top-reverse {
          position: absolute;
          top: 240px;
          animation: moveHorizontalTopReverse 12s linear infinite;
          animation-delay: 6s;
        }
        
        .car-horizontal-bottom {
          position: absolute;
          top: 550px;
          animation: moveHorizontalBottom 12s linear infinite;
          animation-delay: 3s;
        }
        
        .car-horizontal-bottom-reverse {
          position: absolute;
          top: 580px;
          animation: moveHorizontalBottomReverse 12s linear infinite;
          animation-delay: 9s;
        }
        
        .car-vertical-left {
          position: absolute;
          left: 310px;
          animation: moveVerticalLeft 12s linear infinite;
          animation-delay: 1s;
        }
        
        .car-vertical-left-reverse {
          position: absolute;
          left: 340px;
          animation: moveVerticalLeftReverse 12s linear infinite;
          animation-delay: 7s;
        }
        
        .car-vertical-right {
          position: absolute;
          left: 850px;
          animation: moveVerticalRight 12s linear infinite;
          animation-delay: 2s;
        }
        
        .car-vertical-right-reverse {
          position: absolute;
          left: 880px;
          animation: moveVerticalRightReverse 12s linear infinite;
          animation-delay: 8s;
        }
        
        /* Stopped car states */
        .car-stopped-left {
          animation-play-state: paused !important;
          transform: translateX(250px) !important;
        }
        
        .car-stopped-right {
          animation-play-state: paused !important;
          transform: translateX(900px) !important;
        }
        
        .car-stopped-top {
          animation-play-state: paused !important;
          transform: translateY(150px) !important;
        }
        
        .car-stopped-bottom {
          animation-play-state: paused !important;
          transform: translateY(600px) !important;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .traffic-light {
          position: absolute;
          z-index: 5;
        }
      `}</style>
    </div>
  )
}
