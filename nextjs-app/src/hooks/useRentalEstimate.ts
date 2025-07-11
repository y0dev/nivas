import { useState, useCallback } from 'react';
import { apiService, RentalEstimate, InvestmentMetrics } from '@/lib/api';

interface PropertyInfo {
  address: string;
  city: string;
  state: string;
  zipCode: number;
  beds: number;
  baths: number;
  sqft: number;
}

interface UseRentalEstimateReturn {
  rentalEstimate: RentalEstimate | null;
  investmentMetrics: InvestmentMetrics | null;
  isLoading: boolean;
  error: string | null;
  getRentalEstimate: (property: PropertyInfo) => Promise<void>;
  clearEstimate: () => void;
  clearError: () => void;
}

export function useRentalEstimate(): UseRentalEstimateReturn {
  const [rentalEstimate, setRentalEstimate] = useState<RentalEstimate | null>(null);
  const [investmentMetrics, setInvestmentMetrics] = useState<InvestmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRentalEstimate = useCallback(async (property: PropertyInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.getRentalEstimate(property);
      setRentalEstimate(result.rentalEstimate);
      setInvestmentMetrics(result.investmentMetrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get rental estimate';
      setError(errorMessage);
      console.error('Rental estimate error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearEstimate = useCallback(() => {
    setRentalEstimate(null);
    setInvestmentMetrics(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    rentalEstimate,
    investmentMetrics,
    isLoading,
    error,
    getRentalEstimate,
    clearEstimate,
    clearError,
  };
} 