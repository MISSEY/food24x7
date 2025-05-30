"use client"

import { Header } from "@/components/header"
import { MenuSidebar } from "@/components/menu-sidebar"
import { MenuItemCard } from "@/components/menu-item-card"
import { useState } from "react"

const menuItems = [
  {
    id: "1",
    name: "Dilli Rajma Meal",
    description: "Authentic Dilli style Rajma + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.",
    price: 259,
    specialPrice: 181,
    image: "/placeholder.svg?height=200&width=300",
    isVeg: true,
  },
  {
    id: "2",
    name: "Amritsari Chole Meal",
    description: "Amritsari chole + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.",
    price: 259,
    specialPrice: 181,
    image: "/placeholder.svg?height=200&width=300",
    isVeg: true,
  },
  {
    id: "3",
    name: "Dal Makhani Meal",
    description:
      "Creamy Dal Makhani cooked overnight + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.",
    price: 269,
    specialPrice: 188,
    image: "/placeholder.svg?height=200&width=300",
    isVeg: true,
  },
  {
    id: "4",
    name: "Aloo Matar Meal",
    description: "Flavourful Aloo Matar + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.",
    price: 259,
    specialPrice: 181,
    image: "/placeholder.svg?height=200&width=300",
    isVeg: true,
  },
  {
    id: "5",
    name: "Aloo Palak Meal",
    description: "Smoky aloo with palak curry + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.",
    price: 259,
    specialPrice: 181,
    image: "/placeholder.svg?height=200&width=300",
    isVeg: true,
  },
  {
    id: "6",
    name: "Banarasi Dum Aloo Meal",
    description:
      "Authentic Banarasi dum aloo cooked in a masala curry + Dal Makhani/Chole/Rajma + Paratha/Rice + Salad + Chutney + Dessert.",
    price: 269,
    specialPrice: 188,
    image: "/placeholder.svg?height=200&width=300",
    isVeg: true,
  },
]

export default function AllInOneMealsPage() {
  const [cart, setCart] = useState<string[]>([])

  const handleAddToCart = (itemId: string) => {
    setCart((prev) => [...prev, itemId])
    // Here you would typically call your backend API
    console.log(`Added item ${itemId} to cart`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <MenuSidebar />

        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ALL-IN-1-MEALS</h1>
            <p className="text-gray-600">Our Contemporary Take on the Authentic Royal Thali. Bon Appetit!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} {...item} onAdd={handleAddToCart} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
