"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Andheri West, Mumbai")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location Input */}
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 focus-visible:ring-0 text-gray-700"
            />
          </div>

          <div className="hidden md:block w-px bg-gray-300"></div>

          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for restaurants, cuisines, or dishes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-gray-700"
            />
          </div>

          <Button className="bg-red-600 hover:bg-red-700 px-8">Search</Button>
        </div>
      </div>
    </div>
  )
}
