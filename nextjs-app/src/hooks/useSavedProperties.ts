import { useState, useCallback, useEffect } from 'react';
import { Property } from '@/lib/api';

interface SavedProperty extends Property {
  savedAt: string;
  notes?: string;
  tags?: string[];
}

interface UseSavedPropertiesReturn {
  savedProperties: SavedProperty[];
  isLoading: boolean;
  error: string | null;
  saveProperty: (property: Property, notes?: string, tags?: string[]) => void;
  removeProperty: (zpid: number) => void;
  updatePropertyNotes: (zpid: number, notes: string) => void;
  updatePropertyTags: (zpid: number, tags: string[]) => void;
  clearSavedProperties: () => void;
  clearError: () => void;
}

const STORAGE_KEY = 'urbaninsight_saved_properties';

export function useSavedProperties(): UseSavedPropertiesReturn {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved properties from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedProperties(parsed);
      }
    } catch (err) {
      console.error('Error loading saved properties:', err);
      setError('Failed to load saved properties');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever savedProperties changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProperties));
      } catch (err) {
        console.error('Error saving properties to localStorage:', err);
        setError('Failed to save properties');
      }
    }
  }, [savedProperties, isLoading]);

  const saveProperty = useCallback((property: Property, notes?: string, tags?: string[]) => {
    const savedProperty: SavedProperty = {
      ...property,
      savedAt: new Date().toISOString(),
      notes,
      tags: tags || [],
    };

    setSavedProperties(prev => {
      // Check if property already exists
      const existingIndex = prev.findIndex(p => p.zpid === property.zpid);
      
      if (existingIndex >= 0) {
        // Update existing property
        const updated = [...prev];
        updated[existingIndex] = savedProperty;
        return updated;
      } else {
        // Add new property
        return [...prev, savedProperty];
      }
    });

    setError(null);
  }, []);

  const removeProperty = useCallback((zpid: number) => {
    setSavedProperties(prev => prev.filter(p => p.zpid !== zpid));
    setError(null);
  }, []);

  const updatePropertyNotes = useCallback((zpid: number, notes: string) => {
    setSavedProperties(prev => 
      prev.map(p => p.zpid === zpid ? { ...p, notes } : p)
    );
    setError(null);
  }, []);

  const updatePropertyTags = useCallback((zpid: number, tags: string[]) => {
    setSavedProperties(prev => 
      prev.map(p => p.zpid === zpid ? { ...p, tags } : p)
    );
    setError(null);
  }, []);

  const clearSavedProperties = useCallback(() => {
    setSavedProperties([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    savedProperties,
    isLoading,
    error,
    saveProperty,
    removeProperty,
    updatePropertyNotes,
    updatePropertyTags,
    clearSavedProperties,
    clearError,
  };
} 