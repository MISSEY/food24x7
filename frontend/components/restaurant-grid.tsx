"use client"

import { useEffect, useState } from "react"
import { RestaurantCard } from "./restaurant-card"
import { restaurantApi, Restaurant } from "@/lib/api"

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

export function RestaurantGrid() {
  const [restaurants, setRestaurants] = useState<RestaurantCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const response = await restaurantApi.getAll({ limit: 20 })
        
        // Transform API data to match component props
        const transformedRestaurants: RestaurantCardProps[] = response.data.map((restaurant: Restaurant) => ({
          id: restaurant._id,
          name: restaurant.name,
          cuisine: restaurant.cuisine.join(", "),
          rating: restaurant.rating.average,
          deliveryTime: `${restaurant.estimatedDeliveryTime}-${restaurant.estimatedDeliveryTime + 10} mins`,
          location: `${restaurant.address.city}, ${restaurant.address.state}`,
          image: "/placeholder.svg?height=200&width=300",
          priceForTwo: restaurant.priceRange === "budget" ? 300 : restaurant.priceRange === "mid-range" ? 500 : 800,
          isPromoted: restaurant.isVerified,
        }))
        
        setRestaurants(transformedRestaurants)
      } catch (err) {
        console.error('Failed to fetch restaurants:', err)
        setError('Failed to load restaurants. Please try again.')
        
        // Fallback to sample data if API fails
        setRestaurants([
          {
            id: "sample-1",
            name: "Sample Restaurant",
            cuisine: "Multi-cuisine",
            rating: 4.2,
            deliveryTime: "30-40 mins",
            location: "Your City",
            image: "/placeholder.svg?height=200&width=300",
            priceForTwo: 400,
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Restaurants near you</h2>
          <span className="text-gray-600">Loading...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Restaurants near you</h2>
        <span className="text-gray-600">{restaurants.length} restaurants</span>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </div>
  )
}
