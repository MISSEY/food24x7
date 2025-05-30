"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const menuCategories = [
  { name: "Together Combos [FREE items of ₹118]", count: 4, icon: "🍽️", href: "/menu/combos" },
  { name: "Comfort Meals", count: 6, icon: "🍛", href: "/menu/comfort-meals" },
  { name: "All-In-1-Meals", count: 26, icon: "🍽️", href: "/menu/all-in-one" },
  { name: "Mini Meals", count: 26, icon: "🥘", href: "/menu/mini-meals" },
  { name: "Desi Box", count: 28, icon: "📦", href: "/menu/desi-box" },
  { name: "Dum Biryani Thali", count: 8, icon: "🍚", href: "/menu/biryani" },
  { name: "Main Course", count: 35, icon: "🍛", href: "/menu/main-course" },
  { name: "Paratha Rolls", count: 16, icon: "🌯", href: "/menu/paratha-rolls" },
  { name: "Desi Sandwiches", count: 12, icon: "🥪", href: "/menu/sandwiches" },
  { name: "Veg Starters", count: 6, icon: "🥗", href: "/menu/veg-starters" },
]

export function MenuSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>

        <nav className="space-y-2">
          {menuCategories.map((category) => (
            <Link key={category.href} href={category.href}>
              <div
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  pathname === category.href ? "bg-red-50 border-l-4 border-red-600" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{category.icon}</span>
                  <span
                    className={`text-sm font-medium ${pathname === category.href ? "text-red-600" : "text-gray-700"}`}
                  >
                    {category.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category.count}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
