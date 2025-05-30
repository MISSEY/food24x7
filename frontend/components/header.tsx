"use client"

import { ShoppingCart, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function Header() {
  const pathname = usePathname()
  const isRestaurantPage = pathname.startsWith("/restaurant/")
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleLoginSuccess = () => {
    setShowLoginDialog(false)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Delivery Info */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xl">Food24x7</div>
            </Link>

            {isRestaurantPage && (
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                ← Back to restaurants
              </Link>
            )}
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">Cart</span>
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            ) : (
              <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <LoginForm onSuccess={handleLoginSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
