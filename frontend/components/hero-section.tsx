"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const banners = [
  {
    id: 1,
    title: "Winters, Rajai & Gajar Ka Halwa",
    image: "/placeholder.svg?height=400&width=600",
    bgColor: "bg-gradient-to-r from-orange-600 to-red-600",
  },
  {
    id: 2,
    title: "₹200 OFF On first 3 orders",
    subtitle: "Code: FIRST3",
    image: "/placeholder.svg?height=400&width=600",
    bgColor: "bg-gradient-to-r from-red-600 to-red-700",
  },
  {
    id: 3,
    title: "FREE Choco Lava Cake & Coke",
    subtitle: "Worth ₹118",
    image: "/placeholder.svg?height=400&width=600",
    bgColor: "bg-gradient-to-r from-purple-600 to-blue-600",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="bg-gray-800 relative">
      {/* Banner Carousel */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full h-full ${banner.bgColor} flex items-center justify-center relative`}
            >
              <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="text-white max-w-md">
                  <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                  {banner.subtitle && <p className="text-xl mb-6">{banner.subtitle}</p>}
                </div>
                <div className="hidden md:block">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-96 h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Food Types Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-4 text-2xl md:text-4xl font-bold">
            <span className="text-gray-400">Irresistible</span>
            <span className="text-gray-400">ರುಚಿಕರವಾದ</span>
            <span className="text-gray-400">Lababdar</span>
            <span className="text-red-600">Heavenly</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-2xl md:text-4xl font-bold mt-4">
            <span className="text-gray-400">Authentic</span>
            <span className="text-gray-400">Superfast</span>
            <span className="text-red-600 text-5xl md:text-6xl">देसी MEALS</span>
            <span className="text-red-600">All-in-1-Meal</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-2xl md:text-4xl font-bold mt-4">
            <span className="text-gray-400">Paneer</span>
            <span className="text-gray-400">मुविकरमान</span>
            <span className="text-red-600">Chicken Tikka</span>
            <span className="text-gray-400">Dal Makhni</span>
            <span className="text-gray-400">स्वादिष्ट</span>
            <span className="text-red-600">Delicious</span>
          </div>
        </div>
      </div>
    </div>
  )
}
