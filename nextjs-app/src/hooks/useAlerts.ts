import { useState, useCallback, useEffect } from 'react';

interface Alert {
  id: string;
  name: string;
  type: 'Price Alert' | 'ROI Alert' | 'Market Alert' | 'Property Alert';
  location: string;
  condition: string;
  status: 'active' | 'inactive';
  lastTriggered: string | null;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  criteria: {
    minPrice?: number;
    maxPrice?: number;
    minROI?: number;
    maxROI?: number;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
  };
}

interface AlertsSummary {
  totalAlerts: number;
  activeAlerts: number;
  thisMonth: number;
  avgResponse: string;
}

interface UseAlertsReturn {
  alerts: Alert[];
  recentAlerts: Alert[];
  summary: AlertsSummary | null;
  isLoading: boolean;
  error: string | null;
  createAlert: (alertData: Omit<Alert, 'id'>) => Promise<void>;
  updateAlert: (alertId: string, alertData: Partial<Alert>) => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  toggleAlertStatus: (alertId: string) => Promise<void>;
  triggerAlert: (alertId: string) => Promise<void>;
  clearError: () => void;
}

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';

// Mock data for development
const mockAlerts: Alert[] = [
  {
    id: '1',
    name: 'Austin Price Drop Alert',
    type: 'Price Alert',
    location: 'Austin, TX',
    condition: 'Price drops below $400,000',
    status: 'active',
    lastTriggered: '2024-01-15',
    frequency: 'Daily',
    criteria: {
      maxPrice: 400000,
      location: 'Austin, TX'
    }
  },
  {
    id: '2',
    name: 'High ROI Properties',
    type: 'ROI Alert',
    location: 'Dallas, TX',
    condition: 'ROI above 10%',
    status: 'active',
    lastTriggered: '2024-01-12',
    frequency: 'Weekly',
    criteria: {
      minROI: 10,
      location: 'Dallas, TX'
    }
  },
  {
    id: '3',
    name: 'Market Trend Alert',
    type: 'Market Alert',
    location: 'Houston, TX',
    condition: 'Price increase above 5%',
    status: 'inactive',
    lastTriggered: '2024-01-08',
    frequency: 'Monthly',
    criteria: {
      location: 'Houston, TX'
    }
  }
];

const mockSummary: AlertsSummary = {
  totalAlerts: 3,
  activeAlerts: 2,
  thisMonth: 12,
  avgResponse: '2.3h'
};

export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load alerts
  useEffect(() => {
    const loadAlerts = async () => {
      if (USE_BACKEND) {
        try {
          const response = await fetch('/api/v1/alerts');
          if (!response.ok) throw new Error('Failed to load alerts');
          const data = await response.json();
          setAlerts(data.data.alerts);
          setSummary(data.data.summary);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to load alerts');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use mock data
        setAlerts(mockAlerts);
        setSummary(mockSummary);
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  // Load recent alerts
  useEffect(() => {
    const loadRecentAlerts = async () => {
      if (USE_BACKEND) {
        try {
          const response = await fetch('/api/v1/alerts/recent');
          if (!response.ok) throw new Error('Failed to load recent alerts');
          const data = await response.json();
          setRecentAlerts(data.data.alerts);
        } catch (error) {
          console.error('Failed to load recent alerts:', error);
        }
      } else {
        // Use mock data - only alerts that have been triggered
        setRecentAlerts(mockAlerts.filter(alert => alert.lastTriggered));
      }
    };

    loadRecentAlerts();
  }, []);

  const createAlert = useCallback(async (alertData: Omit<Alert, 'id'>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertData)
        });
        if (!response.ok) throw new Error('Failed to create alert');
        const data = await response.json();
        setAlerts(prev => [...prev, data.data.alert]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create alert');
      }
    } else {
      // Mock implementation
      const newAlert: Alert = {
        ...alertData,
        id: Date.now().toString()
      };
      setAlerts(prev => [...prev, newAlert]);
    }
  }, []);

  const updateAlert = useCallback(async (alertId: string, alertData: Partial<Alert>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/alerts/${alertId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertData)
        });
        if (!response.ok) throw new Error('Failed to update alert');
        const data = await response.json();
        setAlerts(prev => prev.map(a => a.id === alertId ? data.data.alert : a));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update alert');
      }
    } else {
      // Mock implementation
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, ...alertData } : a));
    }
  }, []);

  const deleteAlert = useCallback(async (alertId: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/alerts/${alertId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete alert');
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete alert');
      }
    } else {
      // Mock implementation
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  }, []);

  const toggleAlertStatus = useCallback(async (alertId: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/alerts/${alertId}/toggle`, {
          method: 'PATCH'
        });
        if (!response.ok) throw new Error('Failed to toggle alert status');
        const data = await response.json();
        setAlerts(prev => prev.map(a => a.id === alertId ? data.data.alert : a));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to toggle alert status');
      }
    } else {
      // Mock implementation
      setAlerts(prev => prev.map(a => 
        a.id === alertId 
          ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          : a
      ));
    }
  }, []);

  const triggerAlert = useCallback(async (alertId: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/alerts/${alertId}/trigger`, {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to trigger alert');
        const data = await response.json();
        setAlerts(prev => prev.map(a => a.id === alertId ? data.data.alert : a));
        setRecentAlerts(prev => [data.data.alert, ...prev]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to trigger alert');
      }
    } else {
      // Mock implementation
      const now = new Date().toISOString();
      setAlerts(prev => prev.map(a => 
        a.id === alertId 
          ? { ...a, lastTriggered: now }
          : a
      ));
      setRecentAlerts(prev => {
        const updatedAlert = alerts.find(a => a.id === alertId);
        if (updatedAlert) {
          return [{ ...updatedAlert, lastTriggered: now }, ...prev];
        }
        return prev;
      });
    }
  }, [alerts]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    alerts,
    recentAlerts,
    summary,
    isLoading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlertStatus,
    triggerAlert,
    clearError
  };
} 