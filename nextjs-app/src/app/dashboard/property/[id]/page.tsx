'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Bookmark,
  Share2,
  Download,
  Phone,
  Mail
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import PageHeader from '@/components/dashboard/page-header'

// Mock property data - in a real app, this would come from an API
const mockPropertyDetails = {
  1: {
    id: 1,
    address: '123 Oak Street, Austin, TX',
    price: 450000,
    monthlyRent: 2800,
    roi: 0.085,
    cashFlow: 1200,
    score: 8.5,
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    ],
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    yearBuilt: 2010,
    propertyType: 'Single Family',
    status: 'For Sale',
    capRate: 0.074,
    pricePerSqft: 250,
    lotSize: 0.25,
    parking: 2,
    heating: 'Central',
    cooling: 'Central',
    description: 'Beautiful single-family home in a desirable Austin neighborhood. This property offers excellent investment potential with strong rental demand and appreciation prospects.',
    features: ['Hardwood Floors', 'Updated Kitchen', 'Fenced Yard', 'Garage', 'Central AC'],
    neighborhood: {
      name: 'Oak Hill',
      crimeRate: 'Low',
      schoolRating: 8.5,
      walkScore: 75,
      transitScore: 65
    },
    financials: {
      purchasePrice: 450000,
      downPayment: 90000,
      loanAmount: 360000,
      monthlyPayment: 1600,
      propertyTax: 450,
      insurance: 150,
      maintenance: 200,
      vacancyRate: 0.05
    }
  },
  2: {
    id: 2,
    address: '456 Pine Avenue, Dallas, TX',
    price: 380000,
    monthlyRent: 2400,
    roi: 0.092,
    cashFlow: 1100,
    score: 8.8,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    ],
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    yearBuilt: 2015,
    propertyType: 'Townhouse',
    status: 'For Sale',
    capRate: 0.076,
    pricePerSqft: 253,
    lotSize: 0.15,
    parking: 1,
    heating: 'Central',
    cooling: 'Central',
    description: 'Modern townhouse with contemporary design and low-maintenance lifestyle. Perfect for investors looking for quality tenants.',
    features: ['Granite Countertops', 'Stainless Appliances', 'Balcony', 'Assigned Parking', 'Community Pool'],
    neighborhood: {
      name: 'Pine Valley',
      crimeRate: 'Very Low',
      schoolRating: 9.0,
      walkScore: 85,
      transitScore: 80
    },
    financials: {
      purchasePrice: 380000,
      downPayment: 76000,
      loanAmount: 304000,
      monthlyPayment: 1400,
      propertyTax: 380,
      insurance: 120,
      maintenance: 150,
      vacancyRate: 0.03
    }
  }
}

export default function PropertyDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = Number(params.id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const property = mockPropertyDetails[propertyId as keyof typeof mockPropertyDetails]

  if (!property) {
    return (
      <div className="flex-1 overflow-auto">
        <PageHeader
          title="Property Not Found"
          description="The requested property could not be found."
          actions={
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          }
        />
      </div>
    )
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    // In a real app, this would save to the user's saved properties
  }

  const handleShare = () => {
    // In a real app, this would share the property
    navigator.share?.({
      title: property.address,
      text: `Check out this investment property: ${property.address}`,
      url: window.location.href
    }).catch(() => {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
    })
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title={property.address}
        description={`${property.propertyType} • ${property.bedrooms} bed, ${property.bathrooms} bath • ${property.sqft} sqft`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Details
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-500">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Property Images */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-96">
              <Image
                src={property.images[selectedImage]}
                alt={property.address}
                fill={true}
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="bg-white/90 backdrop-blur-sm rounded px-3 py-1 flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium">{property.score}</span>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded">
                  <span className="text-sm font-medium">{property.status}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      width={80}
                      height={64}
                      className="object-cover rounded w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Square Feet</p>
                      <p className="font-semibold">{property.sqft.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Year Built</p>
                      <p className="font-semibold">{property.yearBuilt}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{property.description}</p>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Investment Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Price</span>
                        <span className="font-semibold">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-semibold text-green-600">{formatCurrency(property.monthlyRent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI</span>
                        <span className="font-semibold text-blue-600">{formatPercentage(property.roi)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cap Rate</span>
                        <span className="font-semibold text-purple-600">{formatPercentage(property.capRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cash Flow</span>
                        <span className="font-semibold text-green-600">{formatCurrency(property.cashFlow)}/mo</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Monthly Expenses</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mortgage Payment</span>
                        <span className="font-semibold">{formatCurrency(property.financials.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Tax</span>
                        <span className="font-semibold">{formatCurrency(property.financials.propertyTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance</span>
                        <span className="font-semibold">{formatCurrency(property.financials.insurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maintenance</span>
                        <span className="font-semibold">{formatCurrency(property.financials.maintenance)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Total Expenses</span>
                          <span className="font-bold text-red-600">
                            {formatCurrency(
                              property.financials.monthlyPayment +
                              property.financials.propertyTax +
                              property.financials.insurance +
                              property.financials.maintenance
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">JD</span>
                    </div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-gray-600">Real Estate Agent</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Agent
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
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
                  <div>
                    <h4 className="font-semibold">{property.neighborhood.name}</h4>
                    <p className="text-sm text-gray-600">Austin, TX</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crime Rate</span>
                      <span className="font-medium text-green-600">{property.neighborhood.crimeRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">School Rating</span>
                      <span className="font-medium">{property.neighborhood.schoolRating}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Walk Score</span>
                      <span className="font-medium">{property.neighborhood.walkScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transit Score</span>
                      <span className="font-medium">{property.neighborhood.transitScore}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Calculate ROI
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Market Trends
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 