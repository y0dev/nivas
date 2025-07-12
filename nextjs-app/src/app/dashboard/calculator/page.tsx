'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  Home,
  Save,
  Share2
} from 'lucide-react'
import { formatCurrency, formatPercentage, calculateROI, calculateCashOnCashReturn } from '@/lib/utils'
import PageHeader from '@/components/dashboard/page-header'

export default function ROICalculatorPage() {
  const [propertyData, setPropertyData] = useState({
    purchasePrice: 450000,
    downPayment: 90000,
    monthlyRent: 2800,
    monthlyExpenses: 1600,
    propertyTax: 4500,
    insurance: 1200,
    maintenance: 2400,
    propertyManagement: 280,
    vacancyRate: 0.05,
    appreciationRate: 0.03,
    holdingPeriod: 5
  })

  const [results, setResults] = useState({
    roi: calculateROI(propertyData.purchasePrice, propertyData.monthlyRent, propertyData.monthlyExpenses),
    cashOnCashReturn: calculateCashOnCashReturn(propertyData.purchasePrice, propertyData.downPayment, propertyData.monthlyRent, propertyData.monthlyExpenses),
    monthlyCashFlow: propertyData.monthlyRent - propertyData.monthlyExpenses,
    annualCashFlow: (propertyData.monthlyRent - propertyData.monthlyExpenses) * 12,
    capRate: ((propertyData.monthlyRent * 12) - (propertyData.monthlyExpenses * 12)) / propertyData.purchasePrice,
    totalReturn: 0
  })

  const handleInputChange = (field: string, value: number) => {
    const newData = { ...propertyData, [field]: value }
    setPropertyData(newData)
    
    // Recalculate results
    const newResults = {
      roi: calculateROI(newData.purchasePrice, newData.monthlyRent, newData.monthlyExpenses),
      cashOnCashReturn: calculateCashOnCashReturn(newData.purchasePrice, newData.downPayment, newData.monthlyRent, newData.monthlyExpenses),
      monthlyCashFlow: newData.monthlyRent - newData.monthlyExpenses,
      annualCashFlow: (newData.monthlyRent - newData.monthlyExpenses) * 12,
      capRate: ((newData.monthlyRent * 12) - (newData.monthlyExpenses * 12)) / newData.purchasePrice,
      totalReturn: 0
    }
    setResults(newResults)
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="ROI Calculator"
        description="Calculate potential returns and analyze investment properties"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Calculation
            </Button>
            <Button size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="text-gray-900 dark:text-gray-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                Property Details
              </CardTitle>
              <CardDescription>
                Enter property information to calculate investment metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purchase Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Purchase Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                    <Input
                      type="number"
                      value={propertyData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                    <Input
                      type="number"
                      value={propertyData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Income */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Income</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
                  <Input
                    type="number"
                    value={propertyData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                    className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              {/* Expenses */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Payment</label>
                    <Input
                      type="number"
                      value={propertyData.monthlyExpenses}
                      onChange={(e) => handleInputChange('monthlyExpenses', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Tax (Annual)</label>
                    <Input
                      type="number"
                      value={propertyData.propertyTax}
                      onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance (Annual)</label>
                    <Input
                      type="number"
                      value={propertyData.insurance}
                      onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance (Annual)</label>
                    <Input
                      type="number"
                      value={propertyData.maintenance}
                      onChange={(e) => handleInputChange('maintenance', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Management (%)</label>
                    <Input
                      type="number"
                      value={propertyData.propertyManagement}
                      onChange={(e) => handleInputChange('propertyManagement', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy Rate (%)</label>
                    <Input
                      type="number"
                      value={propertyData.vacancyRate * 100}
                      onChange={(e) => handleInputChange('vacancyRate', Number(e.target.value) / 100)}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Assumptions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Assumptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Appreciation (%)</label>
                    <Input
                      type="number"
                      value={propertyData.appreciationRate * 100}
                      onChange={(e) => handleInputChange('appreciationRate', Number(e.target.value) / 100)}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Holding Period (Years)</label>
                    <Input
                      type="number"
                      value={propertyData.holdingPeriod}
                      onChange={(e) => handleInputChange('holdingPeriod', Number(e.target.value))}
                      className="w-full text-gray-900 dark:text-gray-500 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="text-gray-900 dark:text-gray-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatPercentage(results.roi)}</div>
                    <div className="text-sm text-gray-600">ROI</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatPercentage(results.cashOnCashReturn)}</div>
                    <div className="text-sm text-gray-600">Cash on Cash</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formatPercentage(results.capRate)}</div>
                    <div className="text-sm text-gray-600">Cap Rate</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(results.monthlyCashFlow)}</div>
                    <div className="text-sm text-gray-600">Monthly Cash Flow</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Analysis */}
            <Card className="text-gray-900 dark:text-gray-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cash Flow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-medium">{formatCurrency(propertyData.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Expenses</span>
                    <span className="font-medium text-red-600">-{formatCurrency(propertyData.monthlyExpenses)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monthly Cash Flow</span>
                      <span className={`font-bold ${results.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(results.monthlyCashFlow)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Cash Flow</span>
                    <span className={`font-medium ${results.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(results.annualCashFlow)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Summary */}
            <Card className="text-gray-900 dark:text-gray-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Investment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-medium">{formatCurrency(propertyData.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-medium">{formatCurrency(propertyData.downPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-medium">{formatCurrency(propertyData.purchasePrice - propertyData.downPayment)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Investment</span>
                      <span className="font-bold">{formatCurrency(propertyData.downPayment)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investment Recommendations */}
        <Card className="text-gray-900 dark:text-gray-500">
          <CardHeader>
            <CardTitle>Investment Recommendations</CardTitle>
            <CardDescription>
              Based on your calculations, here are our recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">ROI Analysis</h4>
                <p className="text-sm text-gray-600">
                  {results.roi > 0.08 ? 'Excellent ROI potential' : 
                   results.roi > 0.06 ? 'Good ROI potential' : 
                   'Consider negotiating price or increasing rent'}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cash Flow</h4>
                <p className="text-sm text-gray-600">
                  {results.monthlyCashFlow > 0 ? 'Positive cash flow - good investment' : 
                   'Negative cash flow - consider other options'}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-600">
                  {results.capRate > 0.08 ? 'Low risk investment' : 
                   results.capRate > 0.06 ? 'Moderate risk' : 
                   'Higher risk - ensure strong market fundamentals'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 