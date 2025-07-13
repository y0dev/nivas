'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
  Settings,
  Trash2,
  Edit,
  Bell,
  Clock,
  Activity
} from 'lucide-react'
import PageHeader from '@/components/dashboard/page-header'

const mockAlertDetails = {
  id: 1,
  name: 'Austin Price Drop Alert',
  type: 'Price Alert',
  location: 'Austin, TX',
  condition: 'Price drops below $400,000',
  status: 'active',
  lastTriggered: '2024-01-15',
  frequency: 'Daily',
  description: 'Monitor properties in Austin, TX for price drops below $400,000 to identify investment opportunities.',
  criteria: {
    minPrice: 300000,
    maxPrice: 400000,
    propertyType: 'Single Family',
    beds: '3+',
    baths: '2+',
    sqft: '1500+'
  },
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  history: [
    {
      date: '2024-01-15',
      event: 'Property Match Found',
      details: '123 Main St, Austin, TX - $395,000',
      action: 'Viewed'
    },
    {
      date: '2024-01-12',
      event: 'Alert Triggered',
      details: '456 Oak Ave, Austin, TX - $398,000',
      action: 'Saved'
    },
    {
      date: '2024-01-08',
      event: 'Market Update',
      details: 'Austin market shows 2% price decrease',
      action: 'Viewed'
    }
  ]
}

export default function AlertDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const handleBack = () => {
    router.push('/dashboard/alerts')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this alert?')) {
      router.push('/dashboard/alerts')
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title={mockAlertDetails.name}
        description="Alert details and history"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Alert
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
        {/* Alert Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{mockAlertDetails.status}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Triggered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Date(mockAlertDetails.lastTriggered).toLocaleDateString()}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Frequency</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockAlertDetails.frequency}</p>
                </div>
                <Bell className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Alert Information</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Basic alert configuration and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Type</label>
                <p className="text-gray-900 dark:text-white font-medium">{mockAlertDetails.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <p className="text-gray-900 dark:text-white font-medium">{mockAlertDetails.location}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
                <p className="text-gray-900 dark:text-white font-medium">{mockAlertDetails.condition}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <p className="text-gray-600 dark:text-gray-400">{mockAlertDetails.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Search Criteria</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Property criteria for this alert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Price Range:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${mockAlertDetails.criteria.minPrice.toLocaleString()} - ${mockAlertDetails.criteria.maxPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Property Type:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{mockAlertDetails.criteria.propertyType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bedrooms:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{mockAlertDetails.criteria.beds}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bathrooms:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{mockAlertDetails.criteria.baths}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Square Feet:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{mockAlertDetails.criteria.sqft}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Notification Settings</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              How you want to be notified about this alert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts via email</p>
                  </div>
                </div>
                <Button variant={mockAlertDetails.notifications.email ? "default" : "outline"} size="sm">
                  {mockAlertDetails.notifications.email ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts on your device</p>
                  </div>
                </div>
                <Button variant={mockAlertDetails.notifications.push ? "default" : "outline"} size="sm">
                  {mockAlertDetails.notifications.push ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts via text message</p>
                  </div>
                </div>
                <Button variant={mockAlertDetails.notifications.sms ? "default" : "outline"} size="sm">
                  {mockAlertDetails.notifications.sms ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert History */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Alert History</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Recent activity and triggered events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlertDetails.history.map((event, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.event}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.details}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                      {event.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 