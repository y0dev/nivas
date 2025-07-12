'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp,
  DollarSign,
  MapPin,
  BarChart3,
  PieChart,
  Download,
  Eye,
  Edit,
  Plus
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import PageHeader from '@/components/dashboard/page-header'

const mockPortfolio = {
  totalValue: 2400000,
  totalEquity: 1800000,
  totalDebt: 600000,
  monthlyCashFlow: 18500,
  averageROI: 0.089,
  properties: [
    {
      id: 1,
      address: '123 Oak Street, Austin, TX',
      purchasePrice: 450000,
      currentValue: 520000,
      monthlyRent: 2800,
      monthlyExpenses: 1600,
      roi: 0.085,
      cashFlow: 1200,
      equity: 200000,
      mortgage: 250000,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      status: 'Rented',
      occupancy: 100,
      appreciation: 15.6
    },
    {
      id: 2,
      address: '456 Pine Avenue, Dallas, TX',
      purchasePrice: 380000,
      currentValue: 420000,
      monthlyRent: 2400,
      monthlyExpenses: 1300,
      roi: 0.092,
      cashFlow: 1100,
      equity: 150000,
      mortgage: 270000,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      status: 'Rented',
      occupancy: 100,
      appreciation: 10.5
    },
    {
      id: 3,
      address: '789 Maple Drive, Houston, TX',
      purchasePrice: 520000,
      currentValue: 580000,
      monthlyRent: 3200,
      monthlyExpenses: 1800,
      roi: 0.078,
      cashFlow: 1400,
      equity: 250000,
      mortgage: 330000,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      status: 'Rented',
      occupancy: 100,
      appreciation: 11.5
    }
  ]
}

export default function PortfolioPage() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Portfolio"
        description="Track your property investments and performance"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-500">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockPortfolio.totalValue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Equity</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockPortfolio.totalEquity)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Cash Flow</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockPortfolio.monthlyCashFlow)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average ROI</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(mockPortfolio.averageROI)}</p>
                </div>
                <PieChart className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Portfolio Properties</CardTitle>
              <CardDescription>
                Overview of your investment properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPortfolio.properties.map((property) => (
                  <div key={property.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={property.image}
                        alt={property.address}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{property.address}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Current Value:</span>
                            <p className="font-medium">{formatCurrency(property.currentValue)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Monthly Cash Flow:</span>
                            <p className="font-medium text-green-600">{formatCurrency(property.cashFlow)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">ROI:</span>
                            <p className="font-medium text-blue-600">{formatPercentage(property.roi)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Appreciation:</span>
                            <p className="font-medium text-green-600">+{property.appreciation}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Properties</span>
                  <span className="font-medium">{mockPortfolio.properties.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Debt</span>
                  <span className="font-medium">{formatCurrency(mockPortfolio.totalDebt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan-to-Value</span>
                  <span className="font-medium">{((mockPortfolio.totalDebt / mockPortfolio.totalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Occupancy</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appreciation</span>
                  <span className="font-medium text-green-600">+12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Monthly Rent</span>
                  <span className="font-medium">{formatCurrency(mockPortfolio.properties.reduce((acc, p) => acc + p.monthlyRent, 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Monthly Expenses</span>
                  <span className="font-medium text-red-600">-{formatCurrency(mockPortfolio.properties.reduce((acc, p) => acc + p.monthlyExpenses, 0))}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Net Monthly Cash Flow</span>
                    <span className="font-bold text-green-600">{formatCurrency(mockPortfolio.monthlyCashFlow)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Equity</span>
                  <span className="font-medium">{formatCurrency(mockPortfolio.totalEquity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Equity per Property</span>
                  <span className="font-medium">{formatCurrency(mockPortfolio.totalEquity / mockPortfolio.properties.length)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Equity Percentage</span>
                  <span className="font-medium">{((mockPortfolio.totalEquity / mockPortfolio.totalValue) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 