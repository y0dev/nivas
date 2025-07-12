import { useState, useCallback, useEffect } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketAlerts: boolean;
  propertyAlerts: boolean;
  weeklyReports: boolean;
}

interface UserPreferences {
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  language: 'English' | 'Spanish' | 'French' | 'German';
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
}

interface Settings {
  profile: UserProfile;
  notifications: NotificationSettings;
  preferences: UserPreferences;
}

interface UseSettingsReturn {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateNotifications: (notifications: Partial<NotificationSettings>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetSettings: () => Promise<void>;
  clearError: () => void;
}

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';

// Mock data for development
const mockSettings: Settings = {
  profile: {
    firstName: 'John',
    lastName: 'Investor',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567'
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    marketAlerts: true,
    propertyAlerts: true,
    weeklyReports: true
  },
  preferences: {
    currency: 'USD',
    language: 'English',
    timezone: 'America/New_York',
    theme: 'light'
  }
};

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      if (USE_BACKEND) {
        try {
          const response = await fetch('/api/v1/settings');
          if (!response.ok) throw new Error('Failed to load settings');
          const data = await response.json();
          setSettings(data.data.settings);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to load settings');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use mock data
        setSettings(mockSettings);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });
        if (!response.ok) throw new Error('Failed to update settings');
        const data = await response.json();
        setSettings(data.data.settings);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update settings');
      }
    } else {
      // Mock implementation
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    }
  }, []);

  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/settings/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        if (!response.ok) throw new Error('Failed to update profile');
        const data = await response.json();
        setSettings(data.data.settings);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update profile');
      }
    } else {
      // Mock implementation
      setSettings(prev => prev ? {
        ...prev,
        profile: { ...prev.profile, ...profile }
      } : null);
    }
  }, []);

  const updateNotifications = useCallback(async (notifications: Partial<NotificationSettings>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/settings/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notifications)
        });
        if (!response.ok) throw new Error('Failed to update notifications');
        const data = await response.json();
        setSettings(data.data.settings);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update notifications');
      }
    } else {
      // Mock implementation
      setSettings(prev => prev ? {
        ...prev,
        notifications: { ...prev.notifications, ...notifications }
      } : null);
    }
  }, []);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/settings/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences)
        });
        if (!response.ok) throw new Error('Failed to update preferences');
        const data = await response.json();
        setSettings(data.data.settings);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update preferences');
      }
    } else {
      // Mock implementation
      setSettings(prev => prev ? {
        ...prev,
        preferences: { ...prev.preferences, ...preferences }
      } : null);
    }
  }, []);

  const resetSettings = useCallback(async () => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/settings/reset', {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to reset settings');
        const data = await response.json();
        setSettings(data.data.settings);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to reset settings');
      }
    } else {
      // Mock implementation
      setSettings(mockSettings);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateProfile,
    updateNotifications,
    updatePreferences,
    resetSettings,
    clearError
  };
} 