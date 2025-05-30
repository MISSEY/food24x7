import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'Food24x7 - Order Food Online',
  description: 'Food24x7 - Your favorite restaurants, delivered to your door. Order food online from the best restaurants in your area.',
  keywords: 'food delivery, online ordering, restaurants, food, delivery',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
