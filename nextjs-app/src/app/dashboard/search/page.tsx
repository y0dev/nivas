'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PageHeader from '@/components/dashboard/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter,
  Star,
  Eye,
  Bookmark,
  Share2,
  Sliders
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

const mockSearchResults = [
  {
    id: 1,
    address: '123 Oak Street, Austin, TX',
    price: 450000,
    monthlyRent: 2800,
    roi: 0.085,
    cashFlow: 1200,
    score: 8.5,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    yearBuilt: 2010,
    propertyType: 'Single Family',
    status: 'For Sale',
    capRate: 0.074,
    pricePerSqft: 250
  },
  {
    id: 2,
    address: '456 Pine Avenue, Dallas, TX',
    price: 380000,
    monthlyRent: 2400,
    roi: 0.092,
    cashFlow: 1100,
    score: 8.8,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    yearBuilt: 2015,
    propertyType: 'Townhouse',
    status: 'For Sale',
    capRate: 0.076,
    pricePerSqft: 253
  },
  {
    id: 3,
    address: '789 Maple Drive, Houston, TX',
    price: 520000,
    monthlyRent: 3200,
    roi: 0.078,
    cashFlow: 1400,
    score: 8.2,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    yearBuilt: 2012,
    propertyType: 'Single Family',
    status: 'For Sale',
    capRate: 0.074,
    pricePerSqft: 236
  },
  {
    id: 4,
    address: '321 Elm Court, San Antonio, TX',
    price: 295000,
    monthlyRent: 1900,
    roi: 0.077,
    cashFlow: 800,
    score: 7.9,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2018,
    propertyType: 'Condo',
    status: 'For Sale',
    capRate: 0.077,
    pricePerSqft: 246
  }
]

export default function PropertySearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    bedrooms: '',
    roi: '',
    capRate: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleViewDetails = (propertyId: number) => {
    router.push(`/dashboard/property/${propertyId}`)
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Property Search"
        description="Find investment properties that match your criteria."
        actions={
          <>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-500">
        {/* Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Search Properties</CardTitle>
            <CardDescription>
              Enter location, price range, or other criteria to find investment properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter zip code, city, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              <Button
                size="sm"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sliders className="w-4 h-4 mr-2" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    />
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select 
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select 
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min ROI</label>
                  <Input
                    className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    placeholder="e.g., 8.5"
                    value={filters.roi}
                    onChange={(e) => setFilters({...filters, roi: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Cap Rate</label>
                  <Input
                    className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    placeholder="e.g., 7.0"
                    value={filters.capRate}
                    onChange={(e) => setFilters({...filters, capRate: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Search Results ({mockSearchResults.length})</h2>
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-900">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>ROI (High to Low)</option>
              <option>Price (Low to High)</option>
              <option>Cash Flow (High to Low)</option>
              <option>Investment Score</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSearchResults.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={property.image}
                  alt={property.address}
                  fill={true}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <Bookmark className="w-4 h-4" />
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
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{property.score}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 truncate">{property.address}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Price:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(property.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Monthly Rent:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(property.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">ROI:</span>
                    <span className="font-medium text-green-600">{formatPercentage(property.roi)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                      <span className="font-semibold">Cash Flow:</span>
                    <span className="font-medium text-green-600">{formatCurrency(property.cashFlow)}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cap Rate:</span>
                    <span className="font-medium text-blue-600">{formatPercentage(property.capRate)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex space-x-4 text-xs">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  <Button size="sm" onClick={() => handleViewDetails(property.id)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 