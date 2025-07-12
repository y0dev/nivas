'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bookmark,
  Star,
  Eye,
  Share2,
  Trash2,
  Filter,
  Search,
  Sliders
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import PageHeader from '@/components/dashboard/page-header'

const mockSavedProperties = [
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
    savedDate: '2024-01-10',
    notes: 'Great location, good schools nearby'
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
    savedDate: '2024-01-08',
    notes: 'High ROI potential, needs some updates'
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
    savedDate: '2024-01-05',
    notes: 'Large property, good for family rentals'
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
    savedDate: '2024-01-03',
    notes: 'Low maintenance, good for beginners'
  }
]

export default function SavedPropertiesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    bedrooms: '',
    roi: '',
    capRate: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSelectProperty = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleRemoveProperty = (id: number) => {
    // In a real app, this would remove from saved properties
    console.log('Remove property:', id)
  }

  const handleViewDetails = (property: any) => {
    router.push(`/dashboard/property/${property.id}`)
  }

  // Filter properties based on search query and filters
  const filteredProperties = mockSavedProperties.filter(property => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchQuery.toLowerCase())

    // Price range filter
    const matchesPrice = (!filters.priceMin || property.price >= Number(filters.priceMin)) &&
                        (!filters.priceMax || property.price <= Number(filters.priceMax))

    // Property type filter
    const matchesType = !filters.propertyType || 
      property.propertyType.toLowerCase().includes(filters.propertyType.toLowerCase())

    // Bedrooms filter
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms)

    // ROI filter
    const matchesROI = !filters.roi || property.roi >= Number(filters.roi) / 100

    // Cap rate filter (using ROI as proxy since cap rate isn't in mock data)
    const matchesCapRate = !filters.capRate || property.roi >= Number(filters.capRate) / 100

    return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesROI && matchesCapRate
  })

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Saved Properties"
        description="Manage your bookmarked investment properties"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Export
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Search and Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search saved properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <div className="w-4 h-4 space-y-0.5">
                      <div className="bg-current rounded-sm h-0.5"></div>
                      <div className="bg-current rounded-sm h-0.5"></div>
                      <div className="bg-current rounded-sm h-0.5"></div>
                    </div>
                  </button>
                </div>
              </div>
              {selectedProperties.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">{selectedProperties.length} selected</span>
                  <Button size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <Sliders className="w-4 h-4 mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    />
                    <input
                      className="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    />
                  </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select 
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <input
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 8.5"
                    value={filters.roi}
                    onChange={(e) => setFilters({...filters, roi: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Cap Rate</label>
                  <input
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 7.0"
                    value={filters.capRate}
                    onChange={(e) => setFilters({...filters, capRate: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    size="sm"
                    onClick={() => setFilters({
                      priceMin: '',
                      priceMax: '',
                      propertyType: '',
                      bedrooms: '',
                      roi: '',
                      capRate: ''
                    })}
                    className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Saved Properties ({filteredProperties.length})</h2>
            {filteredProperties.length === 0 && (
              <p className="text-gray-600">No properties match your search criteria</p>
            )}
          </div>
        </div>
        
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProperties.map((property) => (
            <Card key={property.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                <Image
                  src={property.image}
                  alt={property.address}
                  fill={true}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-8 h-8 p-0"
                    onClick={() => handleSelectProperty(property.id)}
                  >
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
                    <span className="text-sm font-medium text-gray-700 ml-1">{property.score}</span>
                  </div>
                </div>
              </div>
              <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate flex-1">{property.address}</h3>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleRemoveProperty(property.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {viewMode === 'list' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">Price:</span>
                        <span className="font-medium text-gray-700">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">ROI:</span>
                        <span className="font-medium text-green-600">{formatPercentage(property.roi)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">Cash Flow:</span>
                        <span className="font-medium text-green-600">{formatCurrency(property.cashFlow)}/mo</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">Rent:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(property.monthlyRent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">Beds/Baths:</span>
                        <span className="font-medium text-gray-900">{property.bedrooms}/{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">Saved:</span>
                        <span className="font-medium text-gray-900">{new Date(property.savedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">Price:</span>
                      <span className="font-medium text-gray-700">{formatCurrency(property.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">Monthly Rent:</span>
                      <span className="font-medium text-gray-700">{formatCurrency(property.monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">ROI:</span>
                      <span className="font-medium text-green-600">{formatPercentage(property.roi)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">Cash Flow:</span>
                      <span className="font-medium text-green-600">{formatCurrency(property.cashFlow)}/mo</span>
                    </div>
                  </div>
                )}
                
                {property.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-900 italic">&quot;{property.notes}&quot;</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex space-x-4 text-xs text-gray-900">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  <Button size="sm" onClick={() => handleViewDetails(property)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockSavedProperties.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Properties</h3>
              <p className="text-gray-900 dark:text-gray-500 mb-4">
                Start saving properties to track your favorite investment opportunities
              </p>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Browse Properties
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 