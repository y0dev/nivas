'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Eye
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import PageHeader from '@/components/dashboard/page-header'

const mockMarketData = {
  markets: [
    {
      name: 'Austin, TX',
      medianPrice: 450000,
      priceChange: 12.5,
      rentGrowth: 8.2,
      capRate: 4.8,
      inventory: 156,
      daysOnMarket: 23,
      trend: 'up'
    },
    {
      name: 'Dallas, TX',
      medianPrice: 380000,
      priceChange: 9.8,
      rentGrowth: 6.5,
      capRate: 5.2,
      inventory: 234,
      daysOnMarket: 28,
      trend: 'up'
    },
    {
      name: 'Houston, TX',
      medianPrice: 320000,
      priceChange: 7.2,
      rentGrowth: 5.8,
      capRate: 5.8,
      inventory: 189,
      daysOnMarket: 31,
      trend: 'up'
    },
    {
      name: 'San Antonio, TX',
      medianPrice: 280000,
      priceChange: 6.5,
      rentGrowth: 4.9,
      capRate: 6.2,
      inventory: 145,
      daysOnMarket: 35,
      trend: 'up'
    }
  ],
  trends: [
    { month: 'Jan', price: 420000, volume: 156 },
    { month: 'Feb', price: 425000, volume: 162 },
    { month: 'Mar', price: 430000, volume: 168 },
    { month: 'Apr', price: 435000, volume: 175 },
    { month: 'May', price: 440000, volume: 182 },
    { month: 'Jun', price: 445000, volume: 189 }
  ]
}

export default function MarketAnalysisPage() {
  const [selectedMarket, setSelectedMarket] = useState('Austin, TX')
  const [timeRange, setTimeRange] = useState('6m')
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  const handleViewMarketDetails = (marketName: string) => {
    // Navigate to a detailed market analysis page
    router.push(`/dashboard/market/${encodeURIComponent(marketName)}`)
  }

  const handleFilterClick = () => {
    setShowFilters(!showFilters)
  }

  const handleExportData = () => {
    // Simulate data export
    const data = {
      markets: mockMarketData.markets,
      trends: mockMarketData.trends,
      exportDate: new Date().toISOString()
    }
    
    // Create and download CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Market,Median Price,Price Change,Rent Growth,Cap Rate,Inventory,Days on Market\n" +
      mockMarketData.markets.map(market => 
        `${market.name},${market.medianPrice},${market.priceChange}%,${market.rentGrowth}%,${market.capRate}%,${market.inventory},${market.daysOnMarket}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "market_analysis.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Market Analysis"
        description="Track market trends and investment opportunities"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleFilterClick}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="gradient" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
        {/* Filter Panel */}
        {showFilters && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Market Filters</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Filter markets by specific criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Prices</option>
                    <option value="0-300000">Under $300k</option>
                    <option value="300000-500000">$300k - $500k</option>
                    <option value="500000+">Over $500k</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Growth</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Growth Rates</option>
                    <option value="0-5">0-5%</option>
                    <option value="5-10">5-10%</option>
                    <option value="10+">10%+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cap Rate</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Cap Rates</option>
                    <option value="0-4">Under 4%</option>
                    <option value="4-6">4-6%</option>
                    <option value="6+">6%+</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" size="sm">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(357500)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Price Growth</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">+9.0%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rent Growth</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">+6.4%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Cap Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Market Comparison</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Compare key metrics across different markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketData.markets.map((market) => (
                  <div key={market.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{market.name}</h3>
                      <div className="flex items-center space-x-2">
                        {market.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewMarketDetails(market.name)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Median Price:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(market.medianPrice)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Price Change:</span>
                        <p className={`font-medium ${market.priceChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {market.priceChange > 0 ? '+' : ''}{market.priceChange}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Cap Rate:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{market.capRate}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Days on Market:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{market.daysOnMarket}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Market Insights</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Key insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Hot Market Alert</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Austin shows strong growth potential with 12.5% price appreciation and high demand.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Investment Opportunity</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    San Antonio offers the highest cap rates at 6.2% with stable market conditions.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Market Trend</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    All markets show positive price growth, indicating strong regional demand.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Trends */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Price Trends</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Historical price trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Price trend chart would be displayed here</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Showing median home prices over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Inventory Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketData.markets.map((market) => (
                  <div key={market.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{market.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{market.inventory} properties</span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                          style={{ width: `${(market.inventory / 250) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Rent Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketData.markets.map((market) => (
                  <div key={market.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{market.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${market.rentGrowth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {market.rentGrowth > 0 ? '+' : ''}{market.rentGrowth}%
                      </span>
                      {market.rentGrowth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Forecast */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Market Forecast</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Predicted market performance for the next 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockMarketData.markets.map((market) => (
                <div key={market.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{market.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Price Growth:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">+{Math.round(market.priceChange * 0.8)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rent Growth:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">+{Math.round(market.rentGrowth * 0.9)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cap Rate:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{market.capRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 