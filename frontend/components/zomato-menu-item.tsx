"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

interface ZomatoMenuItemProps {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  isVeg: boolean
  isPopular?: boolean
  isBestseller?: boolean
  onAdd: (id: string, quantity: number) => void
}

export function ZomatoMenuItemCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  isVeg,
  isPopular,
  isBestseller,
  onAdd,
}: ZomatoMenuItemProps) {
  const [quantity, setQuantity] = useState(0)

  const handleAdd = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onAdd(id, newQuantity)
  }

  const handleRemove = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onAdd(id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Item Info */}
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-2">
          {/* Veg/Non-veg indicator */}
          <div
            className={`w-4 h-4 border-2 flex items-center justify-center mt-1 ${
              isVeg ? "border-green-600" : "border-red-600"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`}></div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{name}</h3>
              {isBestseller && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                  Bestseller
                </Badge>
              )}
              {isPopular && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Popular
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">₹{price}</span>
              {originalPrice && <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>}
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        </div>
      </div>

      {/* Image and Add Button */}
      <div className="flex flex-col items-center gap-3">
        {image && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={image || "/placeholder.svg?height=96&width=96"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {quantity === 0 ? (
          <Button
            onClick={handleAdd}
            className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 font-semibold"
          >
            ADD
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-red-600 text-white rounded px-2 py-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-6 w-6 p-0 text-white hover:bg-red-700"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-semibold min-w-[20px] text-center">{quantity}</span>
            <Button variant="ghost" size="sm" onClick={handleAdd} className="h-6 w-6 p-0 text-white hover:bg-red-700">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
