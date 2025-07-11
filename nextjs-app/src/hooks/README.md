# API Hooks Documentation

This directory contains React hooks for interacting with the UrbanInsight property investment API. These hooks provide a clean, type-safe interface for managing property searches, details, rental estimates, ROI calculations, and saved properties.

## Available Hooks

### `usePropertySearch`

Manages property search functionality with support for zip code and city/state searches.

```typescript
import { usePropertySearch } from '@/hooks'

function PropertySearch() {
  const {
    searchResults,
    isLoading,
    error,
    searchByZipCode,
    searchByCityState,
    clearResults,
    clearError
  } = usePropertySearch()

  const handleSearch = async () => {
    // Search by zip code
    await searchByZipCode('78701', {
      minPrice: 200000,
      maxPrice: 500000,
      propertyType: 'single-family'
    })

    // Or search by city and state
    await searchByCityState('Austin', 'TX', {
      beds: 3,
      baths: 2
    })
  }

  return (
    <div>
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      {searchResults && (
        <div>
          Found {searchResults.listings.length} properties in {searchResults.cityState}
        </div>
      )}
    </div>
  )
}
```

**Returns:**
- `searchResults`: Search results with listings and market statistics
- `isLoading`: Loading state
- `error`: Error message if any
- `searchByZipCode(zipCode, filters?)`: Search by zip code
- `searchByCityState(city, state, filters?)`: Search by city and state
- `clearResults()`: Clear search results
- `clearError()`: Clear error state

### `usePropertyDetails`

Fetches detailed information about a specific property by ZPID.

```typescript
import { usePropertyDetails } from '@/hooks'

function PropertyDetails({ zpid }: { zpid: number }) {
  const {
    propertyDetails,
    isLoading,
    error,
    getPropertyDetails,
    clearDetails,
    clearError
  } = usePropertyDetails()

  useEffect(() => {
    getPropertyDetails(zpid)
  }, [zpid])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!propertyDetails) return <div>No details available</div>

  return (
    <div>
      <h2>{propertyDetails.address}</h2>
      <p>Price: {formatCurrency(propertyDetails.price)}</p>
      {/* More details... */}
    </div>
  )
}
```

**Returns:**
- `propertyDetails`: Detailed property information
- `isLoading`: Loading state
- `error`: Error message if any
- `getPropertyDetails(zpid)`: Fetch property details
- `clearDetails()`: Clear property details
- `clearError()`: Clear error state

### `useRentalEstimate`

Gets rental estimates and investment metrics for a property.

```typescript
import { useRentalEstimate } from '@/hooks'

function RentalAnalysis({ property }: { property: Property }) {
  const {
    rentalEstimate,
    investmentMetrics,
    isLoading,
    error,
    getRentalEstimate,
    clearEstimate,
    clearError
  } = useRentalEstimate()

  useEffect(() => {
    getRentalEstimate({
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft
    })
  }, [property])

  return (
    <div>
      {rentalEstimate && (
        <div>
          <p>Estimated Rent: {formatCurrency(rentalEstimate.estimatedRent)}</p>
          <p>ROI: {formatPercentage(investmentMetrics?.roi || 0)}</p>
        </div>
      )}
    </div>
  )
}
```

**Returns:**
- `rentalEstimate`: Rental estimate data
- `investmentMetrics`: Investment metrics
- `isLoading`: Loading state
- `error`: Error message if any
- `getRentalEstimate(property)`: Get rental estimate
- `clearEstimate()`: Clear estimate data
- `clearError()`: Clear error state

### `useROICalculator`

Provides real-time ROI calculations with debounced updates.

```typescript
import { useROICalculator } from '@/hooks'

function ROICalculator() {
  const {
    propertyData,
    investmentMetrics,
    isLoading,
    error,
    updatePropertyData,
    calculateROI,
    resetCalculator,
    clearError
  } = useROICalculator()

  const handlePriceChange = (value: string) => {
    updatePropertyData('purchasePrice', parseFloat(value) || 0)
  }

  return (
    <div>
      <input
        type="number"
        value={propertyData.purchasePrice}
        onChange={(e) => handlePriceChange(e.target.value)}
        placeholder="Purchase Price"
      />
      
      {investmentMetrics && (
        <div>
          <p>ROI: {formatPercentage(investmentMetrics.roi)}</p>
          <p>Monthly Cash Flow: {formatCurrency(investmentMetrics.monthlyCashFlow)}</p>
        </div>
      )}
    </div>
  )
}
```

**Returns:**
- `propertyData`: Current property data for calculations
- `investmentMetrics`: Calculated investment metrics
- `isLoading`: Loading state
- `error`: Error message if any
- `updatePropertyData(field, value)`: Update property data
- `calculateROI()`: Manually trigger ROI calculation
- `resetCalculator()`: Reset calculator to defaults
- `clearError()`: Clear error state

### `useSavedProperties`

Manages saved properties with localStorage persistence.

```typescript
import { useSavedProperties } from '@/hooks'

function SavedProperties() {
  const {
    savedProperties,
    isLoading,
    error,
    saveProperty,
    removeProperty,
    updatePropertyNotes,
    updatePropertyTags,
    clearSavedProperties,
    clearError
  } = useSavedProperties()

  const handleSaveProperty = (property: Property) => {
    saveProperty(property, 'Great investment opportunity', ['high-roi', 'cash-flow-positive'])
  }

  return (
    <div>
      {savedProperties.map(property => (
        <div key={property.zpid}>
          <h3>{property.address}</h3>
          <p>Saved: {new Date(property.savedAt).toLocaleDateString()}</p>
          {property.notes && <p>Notes: {property.notes}</p>}
          <button onClick={() => removeProperty(property.zpid)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
```

**Returns:**
- `savedProperties`: Array of saved properties
- `isLoading`: Loading state
- `error`: Error message if any
- `saveProperty(property, notes?, tags?)`: Save a property
- `removeProperty(zpid)`: Remove a saved property
- `updatePropertyNotes(zpid, notes)`: Update property notes
- `updatePropertyTags(zpid, tags)`: Update property tags
- `clearSavedProperties()`: Clear all saved properties
- `clearError()`: Clear error state

## Data Types

### Property
```typescript
interface Property {
  zpid: number
  price: number
  priceStr: string
  address: string
  city: string
  state: string
  zipCode: number
  beds: number
  baths: number
  street: string
  sqft: number
  url: string
  status: string
  latitude: number
  longitude: number
  lotSize: number
  yearBuilt: number
  propertyType: string
  pricePerSqft: number
  daysOnZillow: number
  percentile25th: number
  percentile50th: number
  percentile75th: number
  rentalEstimate: number
  roi: number
  capRate: number
  cashFlow: number
  monthlyCashFlow: number
  annualCashFlow: number
  monthlyExpenses: number
  monthlyRent: number
}
```

### SearchFilters
```typescript
interface SearchFilters {
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  beds?: number
  baths?: number
  sqft?: number
}
```

### InvestmentMetrics
```typescript
interface InvestmentMetrics {
  roi: number
  monthlyCashFlow: number
  annualCashFlow: number
  capRate: number
  cashOnCashReturn: number
  monthlyExpenses: number
  annualExpenses: number
  monthlyRent: number
  annualRent: number
}
```

## Error Handling

All hooks provide error handling with:
- `error` state containing error messages
- `clearError()` function to clear errors
- Automatic error logging to console
- Graceful fallbacks for failed API calls

## Loading States

All hooks provide loading states:
- `isLoading` boolean for loading indicators
- Automatic loading state management
- Debounced calculations where appropriate

## Best Practices

1. **Always handle loading and error states** in your components
2. **Use the clear functions** when unmounting components or changing data
3. **Leverage TypeScript** for type safety with all hooks
4. **Handle localStorage errors** gracefully in `useSavedProperties`
5. **Use debounced calculations** for real-time ROI updates
6. **Provide user feedback** for all async operations

## Example Integration

```typescript
import { 
  usePropertySearch, 
  useSavedProperties, 
  useROICalculator 
} from '@/hooks'

function PropertyDashboard() {
  const { searchResults, searchByZipCode } = usePropertySearch()
  const { savedProperties, saveProperty } = useSavedProperties()
  const { investmentMetrics, updatePropertyData } = useROICalculator()

  const handlePropertySelect = (property: Property) => {
    // Pre-fill ROI calculator
    updatePropertyData('purchasePrice', property.price)
    updatePropertyData('monthlyRent', property.rentalEstimate || 0)
  }

  return (
    <div>
      {/* Search interface */}
      {/* Property listings */}
      {/* ROI calculator */}
      {/* Saved properties */}
    </div>
  )
}
```

This comprehensive hook system provides a robust foundation for building the UrbanInsight property investment application with clean separation of concerns and excellent developer experience. 