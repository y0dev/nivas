import { useState, useCallback } from 'react';
import { apiService, SearchResults, SearchFilters } from '@/lib/api';

interface UsePropertySearchReturn {
  searchResults: SearchResults | null;
  isLoading: boolean;
  error: string | null;
  searchByZipCode: (zipCode: string, filters?: SearchFilters) => Promise<void>;
  searchByCityState: (city: string, state: string, filters?: SearchFilters) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export function usePropertySearch(): UsePropertySearchReturn {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByZipCode = useCallback(async (zipCode: string, filters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await apiService.searchByZipCode(zipCode, filters);
      setSearchResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search properties';
      setError(errorMessage);
      console.error('Property search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByCityState = useCallback(async (city: string, state: string, filters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await apiService.searchByCityState(city, state, filters);
      setSearchResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search properties';
      setError(errorMessage);
      console.error('Property search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchByZipCode,
    searchByCityState,
    clearResults,
    clearError,
  };
} 