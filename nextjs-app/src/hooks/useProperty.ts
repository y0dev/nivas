import { useState, useCallback, useEffect } from 'react';
import { Property } from '@/lib/api';

interface SavedProperty extends Property {
  savedDate: string;
  notes?: string;
  isSaved: boolean;
  isInPortfolio: boolean;
}

interface PortfolioProperty extends SavedProperty {
  purchasePrice?: number;
  currentValue?: number;
  monthlyExpenses?: number;
  equity?: number;
  mortgage?: number;
  occupancy?: number;
  appreciation?: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalEquity: number;
  monthlyCashFlow: number;
  averageROI: number;
}

interface UsePropertyReturn {
  // Saved Properties
  savedProperties: SavedProperty[];
  savedPropertiesLoading: boolean;
  savedPropertiesError: string | null;
  saveProperty: (property: Property, notes?: string) => Promise<void>;
  removeSavedProperty: (propertyId: string) => Promise<void>;
  updatePropertyNotes: (propertyId: string, notes: string) => Promise<void>;
  
  // Portfolio Properties
  portfolioProperties: PortfolioProperty[];
  portfolioSummary: PortfolioSummary | null;
  portfolioLoading: boolean;
  portfolioError: string | null;
  addToPortfolio: (propertyId: string, portfolioData: Partial<PortfolioProperty>) => Promise<void>;
  removeFromPortfolio: (propertyId: string) => Promise<void>;
  
  // General
  clearErrors: () => void;
}

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';

// Mock data for development
const mockSavedProperties: SavedProperty[] = [
  {
    id: '1',
    zpid: '123456789',
    address: '123 Oak Street, Austin, TX',
    price: 450000,
    priceStr: '$450,000',
    monthlyRent: 2800,
    roi: 0.085,
    cashFlow: 1200,
    score: 8.5,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    yearBuilt: 2010,
    propertyType: 'Single Family',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    savedDate: '2024-01-10',
    notes: 'Great location, good schools nearby',
    isSaved: true,
    isInPortfolio: false
  },
  {
    id: '2',
    zpid: '987654321',
    address: '456 Pine Avenue, Dallas, TX',
    price: 380000,
    priceStr: '$380,000',
    monthlyRent: 2400,
    roi: 0.092,
    cashFlow: 1100,
    score: 8.8,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    yearBuilt: 2015,
    propertyType: 'Townhouse',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    savedDate: '2024-01-08',
    notes: 'High ROI potential, needs some updates',
    isSaved: true,
    isInPortfolio: false
  }
];

const mockPortfolioProperties: PortfolioProperty[] = [
  {
    id: '3',
    zpid: '555666777',
    address: '789 Maple Drive, Houston, TX',
    price: 520000,
    priceStr: '$520,000',
    monthlyRent: 3200,
    roi: 0.078,
    cashFlow: 1400,
    score: 8.2,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    yearBuilt: 2012,
    propertyType: 'Single Family',
    status: 'Rented',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    savedDate: '2024-01-05',
    notes: 'Large property, good for family rentals',
    isSaved: true,
    isInPortfolio: true,
    purchasePrice: 520000,
    currentValue: 580000,
    monthlyExpenses: 1800,
    equity: 250000,
    mortgage: 330000,
    occupancy: 100,
    appreciation: 11.5
  }
];

export function useProperty(): UsePropertyReturn {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [savedPropertiesLoading, setSavedPropertiesLoading] = useState(true);
  const [savedPropertiesError, setSavedPropertiesError] = useState<string | null>(null);
  
  const [portfolioProperties, setPortfolioProperties] = useState<PortfolioProperty[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  // Load saved properties
  useEffect(() => {
    const loadSavedProperties = async () => {
      if (USE_BACKEND) {
        try {
          const response = await fetch('/api/v1/property/saved');
          if (!response.ok) throw new Error('Failed to load saved properties');
          const data = await response.json();
          setSavedProperties(data.data.properties);
        } catch (error) {
          setSavedPropertiesError(error instanceof Error ? error.message : 'Failed to load saved properties');
        } finally {
          setSavedPropertiesLoading(false);
        }
      } else {
        // Use mock data
        setSavedProperties(mockSavedProperties);
        setSavedPropertiesLoading(false);
      }
    };

    loadSavedProperties();
  }, []);

  // Load portfolio properties
  useEffect(() => {
    const loadPortfolioProperties = async () => {
      if (USE_BACKEND) {
        try {
          const response = await fetch('/api/v1/property/portfolio');
          if (!response.ok) throw new Error('Failed to load portfolio properties');
          const data = await response.json();
          setPortfolioProperties(data.data.properties);
          setPortfolioSummary(data.data.summary);
        } catch (error) {
          setPortfolioError(error instanceof Error ? error.message : 'Failed to load portfolio properties');
        } finally {
          setPortfolioLoading(false);
        }
      } else {
        // Use mock data
        setPortfolioProperties(mockPortfolioProperties);
        setPortfolioSummary({
          totalValue: 580000,
          totalEquity: 250000,
          monthlyCashFlow: 1400,
          averageROI: 0.078
        });
        setPortfolioLoading(false);
      }
    };

    loadPortfolioProperties();
  }, []);

  const saveProperty = useCallback(async (property: Property, notes?: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/property', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...property, notes, isSaved: true })
        });
        if (!response.ok) throw new Error('Failed to save property');
        const data = await response.json();
        setSavedProperties(prev => [...prev, data.data.property]);
      } catch (error) {
        setSavedPropertiesError(error instanceof Error ? error.message : 'Failed to save property');
      }
    } else {
      // Mock implementation
      const savedProperty: SavedProperty = {
        ...property,
        id: Date.now().toString(),
        savedDate: new Date().toISOString(),
        notes,
        isSaved: true,
        isInPortfolio: false
      };
      setSavedProperties(prev => [...prev, savedProperty]);
    }
  }, []);

  const removeSavedProperty = useCallback(async (propertyId: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/property/saved/${propertyId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to remove property');
        setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
      } catch (error) {
        setSavedPropertiesError(error instanceof Error ? error.message : 'Failed to remove property');
      }
    } else {
      // Mock implementation
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  }, []);

  const updatePropertyNotes = useCallback(async (propertyId: string, notes: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/property/${propertyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes })
        });
        if (!response.ok) throw new Error('Failed to update property notes');
        setSavedProperties(prev => 
          prev.map(p => p.id === propertyId ? { ...p, notes } : p)
        );
      } catch (error) {
        setSavedPropertiesError(error instanceof Error ? error.message : 'Failed to update property notes');
      }
    } else {
      // Mock implementation
      setSavedProperties(prev => 
        prev.map(p => p.id === propertyId ? { ...p, notes } : p)
      );
    }
  }, []);

  const addToPortfolio = useCallback(async (propertyId: string, portfolioData: Partial<PortfolioProperty>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/property/portfolio/${propertyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(portfolioData)
        });
        if (!response.ok) throw new Error('Failed to add property to portfolio');
        const data = await response.json();
        setPortfolioProperties(prev => [...prev, data.data.property]);
      } catch (error) {
        setPortfolioError(error instanceof Error ? error.message : 'Failed to add property to portfolio');
      }
    } else {
      // Mock implementation
      const property = savedProperties.find(p => p.id === propertyId);
      if (property) {
        const portfolioProperty: PortfolioProperty = {
          ...property,
          ...portfolioData,
          isInPortfolio: true
        };
        setPortfolioProperties(prev => [...prev, portfolioProperty]);
      }
    }
  }, [savedProperties]);

  const removeFromPortfolio = useCallback(async (propertyId: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/property/portfolio/${propertyId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to remove property from portfolio');
        setPortfolioProperties(prev => prev.filter(p => p.id !== propertyId));
      } catch (error) {
        setPortfolioError(error instanceof Error ? error.message : 'Failed to remove property from portfolio');
      }
    } else {
      // Mock implementation
      setPortfolioProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  }, []);

  const clearErrors = useCallback(() => {
    setSavedPropertiesError(null);
    setPortfolioError(null);
  }, []);

  return {
    savedProperties,
    savedPropertiesLoading,
    savedPropertiesError,
    saveProperty,
    removeSavedProperty,
    updatePropertyNotes,
    portfolioProperties,
    portfolioSummary,
    portfolioLoading,
    portfolioError,
    addToPortfolio,
    removeFromPortfolio,
    clearErrors
  };
} 