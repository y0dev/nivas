// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// API response types
export interface Property {
  zpid: number;
  price: number;
  priceStr: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  beds: number;
  baths: number;
  street: string;
  sqft: number;
  url: string;
  status: string;
  latitude: number;
  longitude: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: string;
  pricePerSqft: number;
  daysOnZillow: number;
  percentile25th: number;
  percentile50th: number;
  percentile75th: number;
  rentalEstimate: number;
  roi: number;
  capRate: number;
  cashFlow: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  monthlyExpenses: number;
  monthlyRent: number;
}

export interface MarketStatistics {
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  percentile25th: number;
  percentile50th: number;
  percentile75th: number;
}

export interface SearchResults {
  zipCode: string;
  cityState: string;
  coord: {
    latitude: number;
    longitude: number;
  };
  listings: Property[];
  twoBedsQuartile: MarketStatistics;
  threeBedsQuartile: MarketStatistics;
  status: string;
}

export interface PropertyDetails {
  zpid: number;
  address: string;
  price: number;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  utilities: number;
  maintenance: number;
  propertyManagement: number;
  vacancyRate: number;
  appreciationRate: number;
  marketTrends: Record<string, any>;
  comparableSales: Array<any>;
  schoolInfo: Record<string, any>;
  neighborhoodInfo: Record<string, any>;
}

export interface RentalEstimate {
  estimatedRent: number;
  rentRange: {
    min: number;
    max: number;
  };
  rentPerSqft: number;
  marketRent: number;
  rentYield: number;
  comparableRentals: Array<any>;
  marketAnalysis: Record<string, any>;
}

export interface InvestmentMetrics {
  roi: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  monthlyExpenses: number;
  annualExpenses: number;
  monthlyRent: number;
  annualRent: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

// API service class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Search properties by zip code
  async searchByZipCode(zipCode: string, filters?: SearchFilters): Promise<SearchResults> {
    return this.request<SearchResults>('/mls/searchZip', {
      method: 'POST',
      body: JSON.stringify({
        zip_code: zipCode,
        ...filters,
      }),
    });
  }

  // Search properties by city and state
  async searchByCityState(city: string, state: string, filters?: SearchFilters): Promise<SearchResults> {
    return this.request<SearchResults>('/mls/searchCS', {
      method: 'POST',
      body: JSON.stringify({
        city,
        state,
        ...filters,
      }),
    });
  }

  // Get property details by ZPID
  async getPropertyDetails(zpid: number): Promise<PropertyDetails> {
    return this.request<PropertyDetails>(`/mls/property/${zpid}`, {
      method: 'GET',
    });
  }

  // Get rental estimate for a property
  async getRentalEstimate(property: {
    address: string;
    city: string;
    state: string;
    zipCode: number;
    beds: number;
    baths: number;
    sqft: number;
  }): Promise<{
    rentalEstimate: RentalEstimate;
    investmentMetrics: InvestmentMetrics;
  }> {
    return this.request<{
      rentalEstimate: RentalEstimate;
      investmentMetrics: InvestmentMetrics;
    }>('/mls/rental-estimate', {
      method: 'POST',
      body: JSON.stringify({ property }),
    });
  }

  // Calculate ROI for a property
  async calculateROI(propertyData: {
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
  }): Promise<InvestmentMetrics> {
    // This would typically call a backend endpoint, but for now we'll calculate client-side
    const {
      purchasePrice,
      downPayment,
      monthlyRent,
      monthlyExpenses,
      propertyTax = 0,
      insurance = 0,
      maintenance = 0,
      propertyManagement = 0,
      vacancyRate = 0.05,
      appreciationRate = 0.03,
      holdingPeriod = 5
    } = propertyData;

    const annualRent = monthlyRent * 12;
    const annualExpenses = (monthlyExpenses * 12) + propertyTax + insurance + maintenance + (monthlyRent * propertyManagement * 12);
    const annualProfit = annualRent - annualExpenses;
    const roi = purchasePrice > 0 ? annualProfit / purchasePrice : 0;
    const monthlyCashFlow = monthlyRent - monthlyExpenses;
    const capRate = purchasePrice > 0 ? annualProfit / purchasePrice : 0;
    const cashOnCashReturn = downPayment > 0 ? annualProfit / downPayment : 0;

    return {
      roi,
      monthlyCashFlow,
      annualCashFlow: monthlyCashFlow * 12,
      capRate,
      cashOnCashReturn,
      monthlyExpenses,
      annualExpenses,
      monthlyRent,
      annualRent,
    };
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 