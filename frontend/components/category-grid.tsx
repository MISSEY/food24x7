"use client"

import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "TOGETHER",
    subtitle: "COMBOS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/combos",
  },
  {
    id: 2,
    name: "COMFORT",
    subtitle: "MEALS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/comfort-meals",
  },
  {
    id: 3,
    name: "ALL-IN-ONE",
    subtitle: "MEALS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/all-in-one",
  },
  {
    id: 4,
    name: "MINI",
    subtitle: "MEALS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/mini-meals",
  },
  {
    id: 5,
    name: "DESI",
    subtitle: "BOX",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/desi-box",
  },
  {
    id: 6,
    name: "DUM",
    subtitle: "BIRYANI",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/biryani",
  },
  {
    id: 7,
    name: "MAIN",
    subtitle: "COURSE",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/main-course",
  },
  {
    id: 8,
    name: "PARATHA",
    subtitle: "ROLLS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/paratha-rolls",
  },
  {
    id: 9,
    name: "DESI",
    subtitle: "SANDWICHES",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/sandwiches",
  },
  {
    id: 10,
    name: "VEG",
    subtitle: "STARTER",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/veg-starters",
  },
  {
    id: 11,
    name: "CHICKEN",
    subtitle: "STARTERS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/chicken-starters",
  },
  {
    id: 12,
    name: "SIDES",
    subtitle: "& DRINKS",
    image: "/placeholder.svg?height=200&width=300",
    href: "/menu/sides-drinks",
  },
]

export function CategoryGrid() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Order Now</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.href}>
              <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[4/3] bg-gray-900 relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={`${category.name} ${category.subtitle}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ★ {category.subtitle} ★
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
