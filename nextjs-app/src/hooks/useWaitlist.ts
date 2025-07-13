import { useState } from 'react';

interface WaitlistData {
  email: string;
  featurePreference: string;
}

interface WaitlistStats {
  totalSubscribers: number;
  recentSubscribers: number;
  featureStats: Array<{
    _id: string;
    count: number;
  }>;
}

interface UseWaitlistReturn {
  addToWaitlist: (data: WaitlistData) => Promise<{ success: boolean; message: string }>;
  getStats: () => Promise<WaitlistStats | null>;
  isLoading: boolean;
  error: string | null;
}

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';

// Mock data for development
const mockStats: WaitlistStats = {
  totalSubscribers: 1247,
  recentSubscribers: 23,
  featureStats: [
    { _id: 'ROI Calculator', count: 456 },
    { _id: 'Property Search & Discovery', count: 234 },
    { _id: 'Market Analysis', count: 198 },
    { _id: 'Portfolio Tracking', count: 156 },
    { _id: 'Investment Alerts', count: 89 },
    { _id: 'Property Management', count: 67 },
    { _id: 'Financial Planning Tools', count: 45 },
    { _id: 'Community & Networking', count: 2 }
  ]
};

export const useWaitlist = (): UseWaitlistReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToWaitlist = async (data: WaitlistData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_BACKEND) {
        const response = await fetch('/api/waitlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to join waitlist');
        }

        return {
          success: true,
          message: result.message || 'Successfully added to waitlist'
        };
      } else {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate duplicate email check
        if (data.email === 'test@example.com') {
          return {
            success: true,
            message: 'You are already on our waitlist!'
          };
        }

        return {
          success: true,
          message: 'Successfully added to waitlist'
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join waitlist';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = async (): Promise<WaitlistStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_BACKEND) {
        const response = await fetch('/api/waitlist/stats');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch waitlist stats');
        }

        return result.data;
      } else {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStats;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch waitlist stats';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToWaitlist,
    getStats,
    isLoading,
    error
  };
}; 