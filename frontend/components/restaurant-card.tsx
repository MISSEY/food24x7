"use client"

import Link from "next/link"
import { Star, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RestaurantCardProps {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  location: string
  image: string
  offer?: string
  isPromoted?: boolean
  priceForTwo: number
}

export function RestaurantCard({
  id,
  name,
  cuisine,
  rating,
  deliveryTime,
  location,
  image,
  offer,
  isPromoted,
  priceForTwo,
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <img src={image || "/placeholder.svg?height=200&width=300"} alt={name} className="w-full h-48 object-cover" />
          {offer && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-blue-600 text-white">{offer}</Badge>
            </div>
          )}
          {isPromoted && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500 text-black">Promoted</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{name}</h3>
          <p className="text-gray-600 text-sm mb-2">{cuisine}</p>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-green-500 text-green-500" />
              <span className="font-medium">{rating}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>

            <span>₹{priceForTwo} for two</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
