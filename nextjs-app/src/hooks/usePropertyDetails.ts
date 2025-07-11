import { useState, useCallback } from 'react';
import { apiService, PropertyDetails } from '@/lib/api';

interface UsePropertyDetailsReturn {
  propertyDetails: PropertyDetails | null;
  isLoading: boolean;
  error: string | null;
  getPropertyDetails: (zpid: number) => Promise<void>;
  clearDetails: () => void;
  clearError: () => void;
}

export function usePropertyDetails(): UsePropertyDetailsReturn {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPropertyDetails = useCallback(async (zpid: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const details = await apiService.getPropertyDetails(zpid);
      setPropertyDetails(details);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get property details';
      setError(errorMessage);
      console.error('Property details error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDetails = useCallback(() => {
    setPropertyDetails(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    propertyDetails,
    isLoading,
    error,
    getPropertyDetails,
    clearDetails,
    clearError,
  };
} 