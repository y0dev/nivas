'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Target,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import PageHeader from '@/components/dashboard/page-header'

const mockGoals = [
  {
    id: 1,
    name: 'Build Portfolio to $1M',
    targetAmount: 1000000,
    currentAmount: 240000,
    targetDate: '2028-12-31',
    monthlyContribution: 5000,
    type: 'Portfolio Value',
    status: 'active',
    progress: 24
  },
  {
    id: 2,
    name: 'Achieve $10K Monthly Cash Flow',
    targetAmount: 10000,
    currentAmount: 1850,
    targetDate: '2026-06-30',
    monthlyContribution: 2000,
    type: 'Monthly Cash Flow',
    status: 'active',
    progress: 18.5
  },
  {
    id: 3,
    name: 'Purchase 5 Properties',
    targetAmount: 5,
    currentAmount: 2,
    targetDate: '2025-12-31',
    monthlyContribution: 0,
    type: 'Property Count',
    status: 'active',
    progress: 40
  },
  {
    id: 4,
    name: 'Reach 15% Average ROI',
    targetAmount: 15,
    currentAmount: 8.9,
    targetDate: '2027-03-31',
    monthlyContribution: 0,
    type: 'ROI Percentage',
    status: 'active',
    progress: 59.3
  }
]

export default function InvestmentGoalsPage() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlyContribution: '',
    type: 'Portfolio Value'
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'active':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'behind':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Investment Goals"
        description="Set and track your investment objectives"
        actions={
          <>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-900">{mockGoals.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-900">{mockGoals.filter(g => g.status === 'active').length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(mockGoals.reduce((acc, goal) => acc + goal.progress, 0) / mockGoals.length)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(mockGoals.reduce((acc, goal) => acc + goal.monthlyContribution, 0))}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {mockGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(goal.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Target: {goal.type === 'Portfolio Value' || goal.type === 'Monthly Cash Flow' 
                        ? formatCurrency(goal.targetAmount) 
                        : goal.type === 'Property Count' 
                        ? `${goal.targetAmount} properties`
                        : `${goal.targetAmount}%`}
                      {' • '}
                      Current: {goal.type === 'Portfolio Value' || goal.type === 'Monthly Cash Flow' 
                        ? formatCurrency(goal.currentAmount) 
                        : goal.type === 'Property Count' 
                        ? `${goal.currentAmount} properties`
                        : `${goal.currentAmount}%`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{goal.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Target Date:</span>
                    <p className="font-medium">{new Date(goal.targetDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Monthly Contribution:</span>
                    <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <p className="font-medium">
                      {goal.type === 'Portfolio Value' || goal.type === 'Monthly Cash Flow' 
                        ? formatCurrency(goal.targetAmount - goal.currentAmount) 
                        : goal.type === 'Property Count' 
                        ? `${goal.targetAmount - goal.currentAmount} properties`
                        : `${goal.targetAmount - goal.currentAmount}%`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Goal</CardTitle>
                <CardDescription>
                  Set a new investment goal to track your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                  <Input
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Build Portfolio to $1M"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                  >
                    <option value="Portfolio Value">Portfolio Value</option>
                    <option value="Monthly Cash Flow">Monthly Cash Flow</option>
                    <option value="Property Count">Property Count</option>
                    <option value="ROI Percentage">ROI Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                  <Input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    placeholder="Enter target amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution</label>
                  <Input
                    type="number"
                    value={newGoal.monthlyContribution}
                    onChange={(e) => setNewGoal({...newGoal, monthlyContribution: e.target.value})}
                    placeholder="Monthly investment amount"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddGoal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1">
                    Add Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 