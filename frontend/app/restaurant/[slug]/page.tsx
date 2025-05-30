"use client"

import { RestaurantHeader } from "@/components/restaurant-header"
import { MenuNavigation } from "@/components/menu-navigation"
import { ZomatoMenuItemCard } from "@/components/zomato-menu-item"
import { useState, useEffect } from "react"
import { restaurantApi, menuApi, Restaurant, MenuItem } from "@/lib/api"

// Restaurant data mapping
const getRestaurantData = (slug: string) => {
  const restaurantData: Record<string, any> = {
    "guftagu-cafe": {
      name: "Guftagu Cafe",
      cuisine: "North Indian, Chinese, Continental",
      rating: 4.2,
      deliveryTime: "30-40 mins",
      location: "Sikandarpur, Gurgaon",
      phone: "+91 98765 43210",
    },
    "spice-junction": {
      name: "Spice Junction",
      cuisine: "Indian, Mughlai, Biryani",
      rating: 4.5,
      deliveryTime: "25-35 mins",
      location: "Cyber City, Gurgaon",
      phone: "+91 98765 43211",
    },
    "pizza-palace": {
      name: "Pizza Palace",
      cuisine: "Italian, Pizza, Fast Food",
      rating: 4.1,
      deliveryTime: "20-30 mins",
      location: "DLF Phase 2, Gurgaon",
      phone: "+91 98765 43212",
    },
  }

  return restaurantData[slug] || restaurantData["guftagu-cafe"]
}

// Sample menu data
const menuData = {
  Starters: [
    {
      id: "1",
      name: "Paneer Tikka",
      description: "Marinated cottage cheese cubes grilled to perfection with bell peppers and onions",
      price: 280,
      originalPrice: 320,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
      isBestseller: true,
    },
    {
      id: "2",
      name: "Chicken Tikka",
      description: "Tender chicken pieces marinated in yogurt and spices, grilled in tandoor",
      price: 320,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: false,
      isPopular: true,
    },
    {
      id: "3",
      name: "Veg Spring Rolls",
      description: "Crispy rolls filled with fresh vegetables and served with sweet chili sauce",
      price: 180,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
    },
  ],
  "Main Course": [
    {
      id: "4",
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato-based creamy curry, a classic North Indian dish",
      price: 380,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: false,
      isBestseller: true,
    },
    {
      id: "5",
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in butter and cream, simmered overnight",
      price: 280,
      originalPrice: 320,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
      isPopular: true,
    },
    {
      id: "6",
      name: "Paneer Butter Masala",
      description: "Cottage cheese cubes in rich tomato and cashew gravy",
      price: 320,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
    },
  ],
  "Rice & Biryani": [
    {
      id: "7",
      name: "Chicken Biryani",
      description: "Fragrant basmati rice layered with spiced chicken and cooked in dum style",
      price: 420,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: false,
      isBestseller: true,
    },
    {
      id: "8",
      name: "Veg Biryani",
      description: "Aromatic basmati rice with mixed vegetables and traditional spices",
      price: 320,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
    },
  ],
  Desserts: [
    {
      id: "9",
      name: "Gulab Jamun",
      description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
      price: 120,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
      isPopular: true,
    },
    {
      id: "10",
      name: "Kulfi",
      description: "Traditional Indian ice cream with cardamom and pistachios",
      price: 100,
      image: "/placeholder.svg?height=96&width=96",
      isVeg: true,
    },
  ],
}

export default function RestaurantPage({ params }: { params: { slug: string } }) {
  const [activeCategory, setActiveCategory] = useState("Starters")
  const [cart, setCart] = useState<Record<string, number>>({})

  const restaurant = getRestaurantData(params.slug)
  const categories = Object.keys(menuData)

  const handleAddToCart = (itemId: string, quantity: number) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: quantity,
    }))
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    // Scroll to category section
    const element = document.getElementById(category)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader
        name={restaurant.name}
        cuisine={restaurant.cuisine}
        rating={restaurant.rating}
        deliveryTime={restaurant.deliveryTime}
        location={restaurant.location}
        phone={restaurant.phone}
        isOpen={true}
      />

      <MenuNavigation categories={categories} activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {categories.map((category) => (
            <div key={category} id={category} className="mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category}</h2>
                <p className="text-gray-600">{menuData[category as keyof typeof menuData].length} items</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {menuData[category as keyof typeof menuData].map((item, index) => (
                  <ZomatoMenuItemCard key={item.id} {...item} onAdd={handleAddToCart} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary - Fixed at bottom */}
      {Object.values(cart).some((qty) => qty > 0) && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <span className="font-semibold">
                {Object.values(cart).reduce((sum, qty) => sum + qty, 0)} items added
              </span>
            </div>
            <button className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-gray-100">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
