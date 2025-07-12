'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Star,
  Filter,
  Eye,
  Bookmark,
  Share2,
  Plus,
  Calculator,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import PageHeader from '@/components/dashboard/page-header'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { usePropertySearch, useSavedProperties } from '@/hooks'

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'zip' | 'city'>('zip')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    beds: '',
    baths: ''
  })

  const { 
    searchResults, 
    isLoading, 
    error, 
    searchByZipCode, 
    searchByCityState,
    clearResults 
  } = usePropertySearch()

  const { 
    savedProperties, 
    saveProperty, 
    removeProperty 
  } = useSavedProperties()

  const handleSearch = async () => {
    if (searchType === 'zip' && zipCode) {
      await searchByZipCode(zipCode, {
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        propertyType: filters.propertyType || undefined,
        beds: filters.beds ? parseInt(filters.beds) : undefined,
        baths: filters.baths ? parseInt(filters.baths) : undefined,
      })
    } else if (searchType === 'city' && city && state) {
      await searchByCityState(city, state, {
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        propertyType: filters.propertyType || undefined,
        beds: filters.beds ? parseInt(filters.beds) : undefined,
        baths: filters.baths ? parseInt(filters.baths) : undefined,
      })
    }
  }

  const handleSaveProperty = (property: any) => {
    saveProperty(property)
  }

  const handleRemoveProperty = (zpid: number) => {
    removeProperty(zpid)
  }

  const isPropertySaved = (zpid: number) => {
    return savedProperties.some(p => p.zpid === zpid)
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your investment overview."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Find Investment Properties</CardTitle>
            <CardDescription>
              Search for properties by location, price range, or investment criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Type Toggle */}
              <div className="flex space-x-4">
                <Button
                  variant={searchType === 'zip' ? 'default' : 'outline'}
                  onClick={() => setSearchType('zip')}
                >
                  Search by Zip Code
                </Button>
                <Button
                  variant={searchType === 'city' ? 'default' : 'outline'}
                  onClick={() => setSearchType('city')}
                >
                  Search by City & State
                </Button>
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchType === 'zip' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <Input
                      placeholder="Enter zip code..."
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full text-gray-900 bg-white"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <Input
                        placeholder="Enter city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <Input
                        placeholder="Enter state..."
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-gray-900 bg-white"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                                      <Input
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full text-gray-900 bg-white"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                                      <Input
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full text-gray-900 bg-white"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                      <select 
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.propertyType}
                      onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                    >
                    <option value="">All Types</option>
                    <option value="single-family">Single Family</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="condo">Condo</option>
                    <option value="multi-family">Multi-Family</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search Properties'}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        {searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{searchResults.listings.length}</div>
                <p className="text-xs text-muted-foreground">
                  Found in {searchResults.cityState}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {searchResults.listings.length > 0 
                    ? formatPercentage(searchResults.listings.reduce((sum, p) => sum + (p.roi || 0), 0) / searchResults.listings.length)
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Average return on investment
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {searchResults.listings.length > 0 
                    ? formatCurrency(searchResults.listings.reduce((sum, p) => sum + p.price, 0) / searchResults.listings.length)
                    : '$0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Average property price
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Cash Flow</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {searchResults.listings.length > 0 
                    ? formatCurrency(searchResults.listings.reduce((sum, p) => sum + (p.monthlyCashFlow || 0), 0) / searchResults.listings.length)
                    : '$0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Average monthly cash flow
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Results */}
        {searchResults && searchResults.listings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({searchResults.listings.length})</CardTitle>
              <CardDescription>
                Properties found in {searchResults.cityState}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.listings.map((property) => (
                  <Card key={property.zpid} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="w-8 h-8 p-0"
                          onClick={() => handleSaveProperty(property)}
                        >
                          <Bookmark className={`w-4 h-4 ${isPropertySaved(property.zpid) ? 'fill-current text-blue-600' : ''}`} />
                        </Button>
                        <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {property.status}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium ml-1">
                            {property.roi ? formatPercentage(property.roi) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 truncate">{property.address}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">{formatCurrency(property.price)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="font-medium">{formatCurrency(property.rentalEstimate || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-medium text-green-600">
                            {property.roi ? formatPercentage(property.roi) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cash Flow:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(property.monthlyCashFlow || 0)}/mo
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>{property.beds} beds</span>
                          <span>{property.baths} baths</span>
                          <span>{property.sqft} sqft</span>
                        </div>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Properties */}
        {savedProperties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Properties ({savedProperties.length})</CardTitle>
              <CardDescription>
                Your saved investment opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.slice(0, 6).map((property) => (
                  <Card key={property.zpid} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="w-8 h-8 p-0"
                          onClick={() => handleRemoveProperty(property.zpid)}
                        >
                          ×
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Saved
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 truncate">{property.address}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">{formatCurrency(property.price)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-medium text-green-600">
                            {property.roi ? formatPercentage(property.roi) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cash Flow:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(property.monthlyCashFlow || 0)}/mo
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>{property.beds} beds</span>
                          <span>{property.baths} baths</span>
                          <span>{property.sqft} sqft</span>
                        </div>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex-col">
                  <Calculator className="w-6 h-6 mb-2" />
                  <span className="text-sm">ROI Calculator</span>
                </Button>
                <Button className="h-20 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span className="text-sm">Market Analysis</span>
                </Button>
                <Button className="h-20 flex-col">
                  <Bookmark className="w-6 h-6 mb-2" />
                  <span className="text-sm">Saved Properties</span>
                </Button>
                <Button className="h-20 flex-col">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span className="text-sm">Portfolio</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>Current market trends and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Market Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Days on Market</span>
                  <span className="text-sm font-medium">45 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price Trend</span>
                  <span className="text-sm font-medium text-green-600">↗ +2.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inventory Level</span>
                  <span className="text-sm font-medium text-orange-600">Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 