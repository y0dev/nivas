'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  DollarSign,
  TrendingUp,
  Calculator,
  Bookmark,
  Share2,
  ArrowLeft,
  Star,
  Home,
  Car,
  TreePine,
  Building2,
  School,
  ShoppingBag,
  Bus,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { usePropertyDetails, useRentalEstimate, useSavedProperties } from '@/hooks'
import { Property } from '@/lib/api'

interface PropertyDetailsProps {
  property: Property
  onBack?: () => void
}

export function PropertyDetails({ property, onBack }: PropertyDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  const { 
    propertyDetails, 
    isLoading: detailsLoading, 
    error: detailsError, 
    getPropertyDetails 
  } = usePropertyDetails()

  const { 
    rentalEstimate, 
    investmentMetrics, 
    isLoading: estimateLoading, 
    error: estimateError, 
    getRentalEstimate 
  } = useRentalEstimate()

  const { 
    savedProperties, 
    saveProperty, 
    removeProperty 
  } = useSavedProperties()

  const isPropertySaved = savedProperties.some(p => p.zpid === property.zpid)

  useEffect(() => {
    if (property.zpid) {
      getPropertyDetails(property.zpid)
      getRentalEstimate({
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        beds: property.beds,
        baths: property.baths,
        sqft: property.sqft,
      })
    }
  }, [property.zpid, property.address, property.city, property.state, property.zipCode, property.beds, property.baths, property.sqft])

  const handleSaveProperty = () => {
    if (isPropertySaved) {
      removeProperty(property.zpid)
    } else {
      saveProperty(property)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Property: ${property.address}`,
        text: `Check out this investment property: ${property.address}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (detailsLoading || estimateLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading property details...</span>
      </div>
    )
  }

  if (detailsError || estimateError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <p className="text-red-700">
            {detailsError || estimateError || 'Failed to load property details'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
            <p className="text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            variant={isPropertySaved ? "default" : "outline"}
            onClick={handleSaveProperty}
          >
            <Bookmark className={`w-4 h-4 mr-2 ${isPropertySaved ? 'fill-current' : ''}`} />
            {isPropertySaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Property Image Placeholder */}
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <MapPin className="w-16 h-16 text-gray-400" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-semibold">{formatCurrency(property.price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bed className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Beds</p>
                <p className="font-semibold">{property.beds}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bath className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Baths</p>
                <p className="font-semibold">{property.baths}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Square className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Sq Ft</p>
                <p className="font-semibold">{property.sqft?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year Built</p>
                    <p className="font-medium">{property.yearBuilt || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lot Size</p>
                    <p className="font-medium">{property.lotSize ? `${property.lotSize} sq ft` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days on Market</p>
                    <p className="font-medium">{property.daysOnZillow || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={property.status === 'For Sale' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Investment Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="font-medium text-green-600">
                      {property.roi ? formatPercentage(property.roi) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cap Rate</p>
                    <p className="font-medium text-green-600">
                      {property.capRate ? formatPercentage(property.capRate) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cash Flow</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(property.monthlyCashFlow || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Cash Flow</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(property.annualCashFlow || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rental Estimate */}
            <Card>
              <CardHeader>
                <CardTitle>Rental Estimate</CardTitle>
                <CardDescription>Estimated rental income and market analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rentalEstimate ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Rent</p>
                        <p className="font-medium text-lg">{formatCurrency(rentalEstimate.estimatedRent)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rent Range</p>
                        <p className="font-medium">
                          {formatCurrency(rentalEstimate.rentRange.min)} - {formatCurrency(rentalEstimate.rentRange.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rent per Sq Ft</p>
                        <p className="font-medium">{formatCurrency(rentalEstimate.rentPerSqft)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rent Yield</p>
                        <p className="font-medium text-green-600">
                          {formatPercentage(rentalEstimate.rentYield)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Rental estimate not available</p>
                )}
              </CardContent>
            </Card>

            {/* Investment Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Calculator</CardTitle>
                <CardDescription>Calculate your potential returns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Open ROI Calculator
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {propertyDetails ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Property Tax</p>
                      <p className="font-medium">{formatCurrency(propertyDetails.propertyTax)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Home Insurance</p>
                      <p className="font-medium">{formatCurrency(propertyDetails.homeInsurance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">HOA Fees</p>
                      <p className="font-medium">{formatCurrency(propertyDetails.hoaFees)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Utilities</p>
                      <p className="font-medium">{formatCurrency(propertyDetails.utilities)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Maintenance</p>
                      <p className="font-medium">{formatCurrency(propertyDetails.maintenance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Property Management</p>
                      <p className="font-medium">{formatCurrency(propertyDetails.propertyManagement)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Market trend data not available</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">Detailed property information not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">25th Percentile</p>
                    <p className="font-medium">{formatCurrency(property.percentile25th)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">50th Percentile</p>
                    <p className="font-medium">{formatCurrency(property.percentile50th)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">75th Percentile</p>
                    <p className="font-medium">{formatCurrency(property.percentile75th)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price per Sq Ft</p>
                    <p className="font-medium">{formatCurrency(property.pricePerSqft)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Neighborhood Info */}
            <Card>
              <CardHeader>
                <CardTitle>Neighborhood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <School className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Schools nearby</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Shopping centers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bus className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Public transportation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Parks and recreation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 