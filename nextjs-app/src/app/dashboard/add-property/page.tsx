'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Home,
  DollarSign,
  Upload,
  Save,
  Calculator,
} from 'lucide-react'
import PageHeader from '@/components/dashboard/page-header'

export default function AddPropertyPage() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [propertyData, setPropertyData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Single Family',
    purchasePrice: '',
    downPayment: '',
    monthlyRent: '',
    monthlyExpenses: '',
    propertyTax: '',
    insurance: '',
    maintenance: '',
    propertyManagement: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    notes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Add Property"
        description="Add a new property to your investment portfolio"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate ROI
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Property
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Property Information
                </CardTitle>
                <CardDescription>
                  Basic property details and location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={propertyData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    >
                      <option value="Single Family">Single Family</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Condo">Condo</option>
                      <option value="Multi-Family">Multi-Family</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      type="number"
                      value={propertyData.yearBuilt}
                      onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                      placeholder="e.g., 2010"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <Input
                    className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    value={propertyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      value={propertyData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Austin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      value={propertyData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="TX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      value={propertyData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="78701"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      type="number"
                      value={propertyData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      type="number"
                      value={propertyData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
                    <Input
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      type="number"
                      value={propertyData.squareFootage}
                      onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                      placeholder="1800"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financial Information
                </CardTitle>
                <CardDescription>
                  Purchase price, financing, and income details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                    <Input
                      type="number"
                      value={propertyData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                      placeholder="450000"
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                    <Input
                      type="number"
                      value={propertyData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', e.target.value)}
                      placeholder="90000"
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
                    <Input
                      type="number"
                      value={propertyData.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      placeholder="2800"
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
                    <Input
                      type="number"
                      value={propertyData.monthlyExpenses}
                      onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                      placeholder="1600"
                      className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Advanced Options</span>
                  <Button
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced
                  </Button>
                </CardTitle>
              </CardHeader>
              {showAdvanced && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Property Tax</label>
                      <Input
                        type="number"
                        value={propertyData.propertyTax}
                        onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                        placeholder="4500"
                        className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Insurance</label>
                      <Input
                        type="number"
                        value={propertyData.insurance}
                        onChange={(e) => handleInputChange('insurance', e.target.value)}
                        placeholder="1200"
                        className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Maintenance</label>
                      <Input
                        type="number"
                        value={propertyData.maintenance}
                        onChange={(e) => handleInputChange('maintenance', e.target.value)}
                        placeholder="2400"
                        className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Management (%)</label>
                      <Input
                        type="number"
                        value={propertyData.propertyManagement}
                        onChange={(e) => handleInputChange('propertyManagement', e.target.value)}
                        placeholder="10"
                        className="text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Additional notes about this property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={propertyData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add any additional notes about this property..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick ROI Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Quick ROI Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purchase Price</span>
                    <span className="text-sm font-medium">
                      {propertyData.purchasePrice ? `$${Number(propertyData.purchasePrice).toLocaleString()}` : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Down Payment</span>
                    <span className="text-sm font-medium">
                      {propertyData.downPayment ? `$${Number(propertyData.downPayment).toLocaleString()}` : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Rent</span>
                    <span className="text-sm font-medium">
                      {propertyData.monthlyRent ? `$${Number(propertyData.monthlyRent).toLocaleString()}` : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Expenses</span>
                    <span className="text-sm font-medium">
                      {propertyData.monthlyExpenses ? `$${Number(propertyData.monthlyExpenses).toLocaleString()}` : '$0'}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Monthly Cash Flow</span>
                      <span className="text-sm font-bold text-green-600">
                        {propertyData.monthlyRent && propertyData.monthlyExpenses 
                          ? `$${(Number(propertyData.monthlyRent) - Number(propertyData.monthlyExpenses)).toLocaleString()}`
                          : '$0'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload property images</p>
                  <Button size="sm" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Property
                </Button>
                <Button className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Full ROI
                </Button>
                <Button className="w-full">
                  Preview Property
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 