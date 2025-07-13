'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell,
  Plus,
  Settings,
  AlertCircle,
  TrendingUp,
  MapPin,
  DollarSign,
  Trash2,
  Edit
} from 'lucide-react'
import PageHeader from '@/components/dashboard/page-header'

const mockAlerts = [
  {
    id: 1,
    name: 'Austin Price Drop Alert',
    type: 'Price Alert',
    location: 'Austin, TX',
    condition: 'Price drops below $400,000',
    status: 'active',
    lastTriggered: '2024-01-15',
    frequency: 'Daily'
  },
  {
    id: 2,
    name: 'High ROI Properties',
    type: 'ROI Alert',
    location: 'Dallas, TX',
    condition: 'ROI above 10%',
    status: 'active',
    lastTriggered: '2024-01-12',
    frequency: 'Weekly'
  },
  {
    id: 3,
    name: 'Market Trend Alert',
    type: 'Market Alert',
    location: 'Houston, TX',
    condition: 'Price increase above 5%',
    status: 'inactive',
    lastTriggered: '2024-01-08',
    frequency: 'Monthly'
  }
]

export default function AlertsPage() {
  const [showAddAlert, setShowAddAlert] = useState(false)
  const router = useRouter()

  const handleViewDetails = (alertId: number) => {
    router.push(`/dashboard/alerts/${alertId}`)
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Market Alerts"
        description="Set up alerts for market changes and investment opportunities"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/alerts/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Alert Settings
            </Button>
            <Button variant="gradient" size="sm" onClick={() => setShowAddAlert(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Alert
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockAlerts.length}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockAlerts.filter(a => a.status === 'active').length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3h</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Alerts</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage your market and property alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{alert.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Type:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{alert.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Location:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{alert.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{alert.condition}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{alert.frequency}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Last Triggered:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{new Date(alert.lastTriggered).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Alerts</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Recently triggered alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 dark:text-green-100">New Property Match</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">Property in Austin, TX matches your criteria</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">2 hours ago</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(1)}>
                  View Details
                </Button>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Market Update</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Dallas market shows 8% price increase</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">1 day ago</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(2)}>
                  View Details
                </Button>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">ROI Opportunity</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">High ROI property available in Houston</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">3 days ago</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(3)}>
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Alert Modal */}
        {showAddAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Add New Alert</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Set up a new market or property alert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., Austin Price Drop Alert"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="price">Price Alert</option>
                    <option value="roi">ROI Alert</option>
                    <option value="market">Market Alert</option>
                    <option value="property">Property Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., Austin, TX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., Price drops below $400,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddAlert(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="gradient" className="flex-1">
                    Add Alert
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