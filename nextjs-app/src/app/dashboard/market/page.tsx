'use client'

import { useState } from 'react'
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

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Market Analysis"
        description="Track market trends and investment opportunities"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-500">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(357500)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Price Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+9.0%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rent Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+6.4%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Cap Rate</p>
                  <p className="text-2xl font-bold text-gray-900">5.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Comparison</CardTitle>
              <CardDescription>
                Compare key metrics across different markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketData.markets.map((market) => (
                  <div key={market.name} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{market.name}</h3>
                      <div className="flex items-center space-x-2">
                        {market.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <Button size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Median Price:</span>
                        <p className="font-medium">{formatCurrency(market.medianPrice)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Price Change:</span>
                        <p className={`font-medium ${market.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {market.priceChange > 0 ? '+' : ''}{market.priceChange}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cap Rate:</span>
                        <p className="font-medium">{market.capRate}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Days on Market:</span>
                        <p className="font-medium">{market.daysOnMarket}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Key insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Hot Market Alert</h4>
                  <p className="text-sm text-blue-800">
                    Austin shows strong growth potential with 12.5% price appreciation and high demand.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Investment Opportunity</h4>
                  <p className="text-sm text-green-800">
                    San Antonio offers the highest cap rates at 6.2% with stable market conditions.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Market Trend</h4>
                  <p className="text-sm text-yellow-800">
                    All markets show positive price growth, indicating strong regional demand.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
            <CardDescription>
              Historical price trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Price trend chart would be displayed here</p>
                <p className="text-sm text-gray-500">Showing median home prices over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketData.markets.map((market) => (
                  <div key={market.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{market.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{market.inventory} properties</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(market.inventory / 250) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rent Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketData.markets.map((market) => (
                  <div key={market.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{market.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${market.rentGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {market.rentGrowth > 0 ? '+' : ''}{market.rentGrowth}%
                      </span>
                      {market.rentGrowth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Market Forecast</CardTitle>
            <CardDescription>
              Predicted market performance for the next 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockMarketData.markets.map((market) => (
                <div key={market.name} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{market.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Growth:</span>
                      <span className="font-medium text-green-600">+{Math.round(market.priceChange * 0.8)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rent Growth:</span>
                      <span className="font-medium text-blue-600">+{Math.round(market.rentGrowth * 0.9)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cap Rate:</span>
                      <span className="font-medium">{market.capRate}%</span>
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