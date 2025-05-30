"use client"

import { MenuItemCard } from "./menu-item-card"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  isVeg: boolean
  isPopular?: boolean
  isBestseller?: boolean
}

interface MenuCategoryProps {
  title: string
  items: MenuItem[]
  onAddToCart: (itemId: string) => void
}

export function MenuCategory({ title, items, onAddToCart }: MenuCategoryProps) {
  return (
    <div className="mb-8">
      <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{items.length} items</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} {...item} onAdd={onAddToCart} />
        ))}
      </div>
    </div>
  )
}
