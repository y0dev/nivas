'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  RefreshCw,
  Save,
  Share2,
  ArrowRight,
  Info
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { useROICalculator } from '@/hooks'

export function ROICalculator() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const {
    propertyData,
    investmentMetrics,
    isLoading,
    error,
    updatePropertyData,
    calculateROI,
    resetCalculator,
    clearError
  } = useROICalculator()

  const handleInputChange = (field: keyof typeof propertyData, value: string) => {
    const numValue = parseFloat(value) || 0
    updatePropertyData(field, numValue)
  }

  const getROIColor = (roi: number) => {
    if (roi >= 0.08) return 'text-green-600'
    if (roi >= 0.05) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCashFlowColor = (cashFlow: number) => {
    if (cashFlow > 0) return 'text-green-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ROI Calculator</h1>
          <p className="text-gray-600">Calculate your potential investment returns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetCalculator}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>Enter your property details to calculate ROI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="0"
                    value={propertyData.purchasePrice || ''}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="downPayment">Down Payment</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    placeholder="0"
                    value={propertyData.downPayment || ''}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="0"
                    value={propertyData.monthlyRent || ''}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    placeholder="0"
                    value={propertyData.monthlyExpenses || ''}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Advanced Options</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyTax">Annual Property Tax</Label>
                    <Input
                      id="propertyTax"
                      type="number"
                      placeholder="0"
                      value={propertyData.propertyTax || ''}
                      onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurance">Annual Insurance</Label>
                    <Input
                      id="insurance"
                      type="number"
                      placeholder="0"
                      value={propertyData.insurance || ''}
                      onChange={(e) => handleInputChange('insurance', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maintenance">Annual Maintenance</Label>
                    <Input
                      id="maintenance"
                      type="number"
                      placeholder="0"
                      value={propertyData.maintenance || ''}
                      onChange={(e) => handleInputChange('maintenance', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyManagement">Property Management (%)</Label>
                    <Input
                      id="propertyManagement"
                      type="number"
                      placeholder="0"
                      value={propertyData.propertyManagement || ''}
                      onChange={(e) => handleInputChange('propertyManagement', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                    <Input
                      id="vacancyRate"
                      type="number"
                      placeholder="5"
                      value={propertyData.vacancyRate || ''}
                      onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appreciationRate">Appreciation Rate (%)</Label>
                    <Input
                      id="appreciationRate"
                      type="number"
                      placeholder="3"
                      value={propertyData.appreciationRate || ''}
                      onChange={(e) => handleInputChange('appreciationRate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Analysis</CardTitle>
            <CardDescription>Your calculated returns and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">Calculating...</span>
              </div>
            ) : investmentMetrics ? (
              <>
                {/* Key Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(investmentMetrics.roi)}
                      </div>
                      <div className="text-sm text-gray-600">ROI</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getCashFlowColor(investmentMetrics.monthlyCashFlow)}`}>
                        {formatCurrency(investmentMetrics.monthlyCashFlow)}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Cash Flow</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {formatPercentage(investmentMetrics.capRate)}
                      </div>
                      <div className="text-sm text-gray-600">Cap Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {formatPercentage(investmentMetrics.cashOnCashReturn)}
                      </div>
                      <div className="text-sm text-gray-600">Cash on Cash</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detailed Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Annual Rent</span>
                      <span className="font-medium">{formatCurrency(investmentMetrics.annualRent)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Annual Expenses</span>
                      <span className="font-medium text-red-600">{formatCurrency(investmentMetrics.annualExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm font-medium">Annual Cash Flow</span>
                      <span className={`font-bold ${getCashFlowColor(investmentMetrics.annualCashFlow)}`}>
                        {formatCurrency(investmentMetrics.annualCashFlow)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment Grade */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Investment Grade</h3>
                  
                  {investmentMetrics.roi >= 0.08 ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Target className="w-4 h-4 mr-1" />
                      Excellent Investment
                    </Badge>
                  ) : investmentMetrics.roi >= 0.05 ? (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Good Investment
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Poor Investment
                    </Badge>
                  )}
                  
                  <p className="text-sm text-gray-600">
                    Based on ROI of {formatPercentage(investmentMetrics.roi)} and monthly cash flow of {formatCurrency(investmentMetrics.monthlyCashFlow)}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Enter property details to see your investment analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips and Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Investment Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Good Investment Criteria</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ROI above 8%</li>
                <li>• Positive monthly cash flow</li>
                <li>• Cap rate above 6%</li>
                <li>• Cash on cash return above 10%</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Risk Factors</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• High vacancy rates</li>
                <li>• Declining market conditions</li>
                <li>• High maintenance costs</li>
                <li>• Poor location</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 