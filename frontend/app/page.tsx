import { Header } from "@/components/header"
import { RestaurantGrid } from "@/components/restaurant-grid"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Order food online from your favorite restaurants</h1>
          <p className="text-xl mb-8">Discover great food from restaurants near you</p>
          <SearchBar />
        </div>
      </div>

      {/* Filters and Restaurant Grid */}
      <div className="container mx-auto px-4 py-8">
        <FilterBar />
        <RestaurantGrid />
      </div>
    </div>
  )
}
