'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Settings,
  Bell,
  Mail,
  Smartphone,
  Clock,
  Save,
  RefreshCw,
  Shield,
  Globe,
  User
} from 'lucide-react'
import PageHeader from '@/components/dashboard/page-header'

const defaultSettings = {
  notifications: {
    email: {
      enabled: true,
      frequency: 'immediate',
      digest: false
    },
    push: {
      enabled: true,
      frequency: 'immediate'
    },
    sms: {
      enabled: false,
      frequency: 'daily'
    }
  },
  preferences: {
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    timezone: 'America/Chicago',
    language: 'en'
  },
  privacy: {
    shareData: false,
    analytics: true,
    marketing: false
  }
}

export default function AlertSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      setSettings(defaultSettings)
    }
  }

  const updateNotificationSetting = (type: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type as keyof typeof prev.notifications],
          [field]: value
        }
      }
    }))
  }

  const updatePreference = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }))
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Alert Settings"
        description="Configure your notification preferences and alert behavior"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button variant="gradient" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
        {/* Notification Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Choose how and when you want to receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts via email</p>
                  </div>
                </div>
                <Button 
                  variant={settings.notifications.email.enabled ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updateNotificationSetting('email', 'enabled', !settings.notifications.email.enabled)}
                >
                  {settings.notifications.email.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              {settings.notifications.email.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={settings.notifications.email.frequency}
                      onChange={(e) => updateNotificationSetting('email', 'frequency', e.target.value)}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email-digest"
                      checked={settings.notifications.email.digest}
                      onChange={(e) => updateNotificationSetting('email', 'digest', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="email-digest" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Include property details in digest
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Push Notifications */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts on your device</p>
                  </div>
                </div>
                <Button 
                  variant={settings.notifications.push.enabled ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updateNotificationSetting('push', 'enabled', !settings.notifications.push.enabled)}
                >
                  {settings.notifications.push.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              {settings.notifications.push.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={settings.notifications.push.frequency}
                    onChange={(e) => updateNotificationSetting('push', 'frequency', e.target.value)}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="batched">Batched (every 15 minutes)</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts via text message</p>
                  </div>
                </div>
                <Button 
                  variant={settings.notifications.sms.enabled ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updateNotificationSetting('sms', 'enabled', !settings.notifications.sms.enabled)}
                >
                  {settings.notifications.sms.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              {settings.notifications.sms.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={settings.notifications.sms.frequency}
                    onChange={(e) => updateNotificationSetting('sms', 'frequency', e.target.value)}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* General Preferences */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              General Preferences
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configure your general alert preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quiet Hours */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Quiet Hours</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pause notifications during specific hours</p>
                  </div>
                </div>
                <Button 
                  variant={settings.preferences.quietHours.enabled ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updatePreference('preferences', 'quietHours', { ...settings.preferences.quietHours, enabled: !settings.preferences.quietHours.enabled })}
                >
                  {settings.preferences.quietHours.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              {settings.preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={settings.preferences.quietHours.start}
                      onChange={(e) => updatePreference('preferences', 'quietHours', { ...settings.preferences.quietHours, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={settings.preferences.quietHours.end}
                      onChange={(e) => updatePreference('preferences', 'quietHours', { ...settings.preferences.quietHours, end: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={settings.preferences.timezone}
                onChange={(e) => updatePreference('preferences', 'timezone', e.target.value)}
              >
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={settings.preferences.language}
                onChange={(e) => updatePreference('preferences', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Data
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Control how your data is used and shared
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Share Usage Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Help improve our service by sharing anonymous usage data</p>
              </div>
              <Button 
                variant={settings.privacy.shareData ? "default" : "outline"} 
                size="sm"
                onClick={() => updatePreference('privacy', 'shareData', !settings.privacy.shareData)}
              >
                {settings.privacy.shareData ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow analytics to improve your experience</p>
              </div>
              <Button 
                variant={settings.privacy.analytics ? "default" : "outline"} 
                size="sm"
                onClick={() => updatePreference('privacy', 'analytics', !settings.privacy.analytics)}
              >
                {settings.privacy.analytics ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Marketing Communications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive promotional emails and offers</p>
              </div>
              <Button 
                variant={settings.privacy.marketing ? "default" : "outline"} 
                size="sm"
                onClick={() => updatePreference('privacy', 'marketing', !settings.privacy.marketing)}
              >
                {settings.privacy.marketing ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 