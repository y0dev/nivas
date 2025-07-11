import { useState, useCallback, useEffect } from 'react';
import { apiService, InvestmentMetrics } from '@/lib/api';

interface PropertyData {
  purchasePrice: number;
  downPayment: number;
  monthlyRent: number;
  monthlyExpenses: number;
  propertyTax?: number;
  insurance?: number;
  maintenance?: number;
  propertyManagement?: number;
  vacancyRate?: number;
  appreciationRate?: number;
  holdingPeriod?: number;
}

interface UseROICalculatorReturn {
  propertyData: PropertyData;
  investmentMetrics: InvestmentMetrics | null;
  isLoading: boolean;
  error: string | null;
  updatePropertyData: (field: keyof PropertyData, value: number) => void;
  calculateROI: () => Promise<void>;
  resetCalculator: () => void;
  clearError: () => void;
}

const defaultPropertyData: PropertyData = {
  purchasePrice: 0,
  downPayment: 0,
  monthlyRent: 0,
  monthlyExpenses: 0,
  propertyTax: 0,
  insurance: 0,
  maintenance: 0,
  propertyManagement: 0,
  vacancyRate: 0.05,
  appreciationRate: 0.03,
  holdingPeriod: 5,
};

export function useROICalculator(): UseROICalculatorReturn {
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [investmentMetrics, setInvestmentMetrics] = useState<InvestmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePropertyData = useCallback((field: keyof PropertyData, value: number) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const calculateROI = useCallback(async () => {
    // Validate required fields
    if (propertyData.purchasePrice <= 0) {
      setError('Purchase price must be greater than 0');
      return;
    }

    if (propertyData.downPayment < 0 || propertyData.downPayment > propertyData.purchasePrice) {
      setError('Down payment must be between 0 and purchase price');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const metrics = await apiService.calculateROI(propertyData);
      setInvestmentMetrics(metrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate ROI';
      setError(errorMessage);
      console.error('ROI calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [propertyData]);

  const resetCalculator = useCallback(() => {
    setPropertyData(defaultPropertyData);
    setInvestmentMetrics(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-calculate ROI when all required fields are filled
  useEffect(() => {
    const hasRequiredFields = propertyData.purchasePrice > 0 && 
                             propertyData.monthlyRent > 0 && 
                             propertyData.monthlyExpenses >= 0;

    if (hasRequiredFields && !isLoading) {
      // Debounce the calculation to avoid too many API calls
      const timeoutId = setTimeout(() => {
        calculateROI();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [propertyData, calculateROI, isLoading]);

  return {
    propertyData,
    investmentMetrics,
    isLoading,
    error,
    updatePropertyData,
    calculateROI,
    resetCalculator,
    clearError,
  };
} 