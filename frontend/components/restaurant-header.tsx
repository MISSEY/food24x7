"use client"

import { Star, Clock, MapPin, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RestaurantHeaderProps {
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  location: string
  phone?: string
  isOpen: boolean
}

export function RestaurantHeader({
  name,
  cuisine,
  rating,
  deliveryTime,
  location,
  phone,
  isOpen,
}: RestaurantHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>
              {isOpen ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Open</Badge>
              ) : (
                <Badge variant="destructive">Closed</Badge>
              )}
            </div>

            <p className="text-gray-600 mb-3">{cuisine}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{deliveryTime}</span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>

              {phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
