"use client"

interface MenuNavigationProps {
  categories: string[]
  activeCategory: string
  onCategoryClick: (category: string) => void
}

export function MenuNavigation({ categories, activeCategory, onCategoryClick }: MenuNavigationProps) {
  return (
    <div className="sticky top-0 bg-white z-20 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide py-4 gap-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                activeCategory === category
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
