'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Search, 
  BarChart3, 
  Calculator, 
  Bookmark, 
  Settings, 
  User, 
  TrendingUp,
  MapPin,
  DollarSign,
  // Target,
  AlertCircle,
  Plus,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Property Search', href: '/dashboard/search', icon: Search },
  { name: 'Market Analysis', href: '/dashboard/market', icon: BarChart3 },
  { name: 'ROI Calculator', href: '/dashboard/calculator', icon: Calculator },
  { name: 'Saved Properties', href: '/dashboard/saved', icon: Bookmark },
  // { name: 'Investment Goals', href: '/dashboard/goals', icon: Target },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const quickActions = [
  { name: 'Add Property', href: '/dashboard/add-property', icon: Plus },
  { name: 'Market Alert', href: '/dashboard/alerts', icon: AlertCircle },
  { name: 'Investment Guide', href: '/dashboard/guide', icon: Bookmark },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">UrbanInsight</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">John Investor</p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Investment Stats */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
            Investment Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">Total Portfolio</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$2.4M</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Avg ROI</span>
              </div>
              <span className="text-sm font-medium text-green-600">12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm text-gray-600">Properties</span>
              </div>
              <span className="text-sm font-medium text-gray-900">8</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
} 