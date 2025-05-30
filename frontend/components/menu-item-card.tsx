"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface MenuItemProps {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  specialPrice?: number
  image: string
  isVeg?: boolean
  isBestseller?: boolean
  isPopular?: boolean
  onAdd: (id: string) => void
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  originalPrice,
  specialPrice,
  image,
  isVeg = true,
  isBestseller = false,
  isPopular = false,
  onAdd,
}: MenuItemProps) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="w-32 h-32 relative mr-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 30vw, 20vw"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute top-1 left-1">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              isVeg ? "border-green-600 bg-green-600" : "border-red-600 bg-red-600"
            }`}
          ></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
          <div className="flex flex-col items-end">
            {isBestseller && (
              <Badge variant="outline" className="mb-1">
                Bestseller
              </Badge>
            )}
            {isPopular && (
              <Badge variant="default" className="mb-1">
                Popular
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">₹{price}</span>
              {originalPrice && <span className="text-sm text-gray-500 line-through ml-2">₹{originalPrice}</span>}
              {specialPrice && originalPrice && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  ₹{specialPrice}
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={() => onAdd(id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm">
            ADD
          </Button>
        </div>
      </div>
    </div>
  )
}
