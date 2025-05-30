"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Star, Clock, Percent } from "lucide-react"

const filters = [
  { id: "rating", label: "Rating 4.0+", icon: Star },
  { id: "delivery", label: "Fast Delivery", icon: Clock },
  { id: "offers", label: "Great Offers", icon: Percent },
  { id: "veg", label: "Pure Veg", icon: null },
  { id: "cuisine", label: "Cuisines", icon: null },
]

export function FilterBar() {
  return (
    <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
      <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="outline"
          className="flex items-center gap-1 px-3 py-2 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
        >
          {filter.icon && <filter.icon className="h-3 w-3" />}
          {filter.label}
        </Badge>
      ))}
    </div>
  )
}
