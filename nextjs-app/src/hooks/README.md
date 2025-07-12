# React Hooks for UrbanInsight

This directory contains custom React hooks for managing application state and API interactions.

## Environment Configuration

To control whether the frontend uses the backend API or mock data, set the environment variable:

```bash
# In .env.local
NEXT_PUBLIC_USE_BACKEND=false  # Use mock data for development
NEXT_PUBLIC_USE_BACKEND=true   # Use backend API
```

## Available Hooks

### `useAuth`
Authentication context hook for user management.

### `usePropertySearch`
Search and filter properties with advanced criteria.

### `usePropertyDetails`
Get detailed property information and analytics.

### `useRentalEstimate`
Calculate rental estimates and market analysis.

### `useROICalculator`
Calculate ROI, cash flow, and investment metrics.

### `useSavedProperties`
Manage saved/bookmarked properties (legacy hook).

### `useProperty` ⭐ **NEW**
Comprehensive property management hook with backend integration:
- **Saved Properties**: Save, remove, and manage bookmarked properties
- **Portfolio Properties**: Add properties to portfolio with financial data
- **Property Notes**: Add and update property notes
- **Portfolio Summary**: Get portfolio statistics and performance metrics

**Features:**
- Automatic loading of saved and portfolio properties
- Real-time portfolio summary calculations
- Error handling and loading states
- Backend/mock data toggle support

### `useGoals` ⭐ **NEW**
Investment goals management with progress tracking:
- **Goal Creation**: Create investment goals (Portfolio Value, Cash Flow, Property Count, ROI)
- **Progress Tracking**: Automatic progress calculation and status updates
- **Goal Management**: Update, delete, and manage goals
- **Summary Statistics**: Get goals overview and metrics

**Features:**
- Multiple goal types with different tracking methods
- Automatic status updates (active/completed/behind)
- Progress calculation and visualization
- Monthly investment tracking

### `useAlerts` ⭐ **NEW**
Market alerts and notification management:
- **Alert Creation**: Create price, ROI, market, and property alerts
- **Alert Management**: Update, delete, and toggle alert status
- **Recent Alerts**: Track recently triggered alerts
- **Alert Criteria**: Set complex filtering criteria for alerts

**Features:**
- Multiple alert types with different conditions
- Frequency settings (Daily/Weekly/Monthly)
- Alert triggering and notification tracking
- Comprehensive alert criteria management

### `useSettings` ⭐ **NEW**
User preferences and account settings management:
- **Profile Management**: Update user profile information
- **Notification Preferences**: Configure email, SMS, and push notifications
- **App Preferences**: Manage currency, language, theme, and timezone
- **Settings Reset**: Reset to default settings

**Features:**
- Comprehensive user settings management
- Real-time settings updates
- Default settings creation
- Error handling and validation

## Usage Examples

### Property Management
```typescript
import { useProperty } from '@/hooks';

function PropertyComponent() {
  const {
    savedProperties,
    portfolioProperties,
    portfolioSummary,
    saveProperty,
    addToPortfolio,
    removeSavedProperty
  } = useProperty();

  const handleSaveProperty = async (property) => {
    await saveProperty(property, 'Great investment opportunity');
  };

  const handleAddToPortfolio = async (propertyId) => {
    await addToPortfolio(propertyId, {
      purchasePrice: 450000,
      currentValue: 520000,
      monthlyExpenses: 1600
    });
  };
}
```

### Investment Goals
```typescript
import { useGoals } from '@/hooks';

function GoalsComponent() {
  const {
    goals,
    summary,
    createGoal,
    updateGoalProgress
  } = useGoals();

  const handleCreateGoal = async () => {
    await createGoal({
      name: 'Build Portfolio to $1M',
      targetAmount: 1000000,
      currentAmount: 240000,
      targetDate: '2028-12-31',
      monthlyContribution: 5000,
      type: 'Portfolio Value'
    });
  };
}
```

### Market Alerts
```typescript
import { useAlerts } from '@/hooks';

function AlertsComponent() {
  const {
    alerts,
    createAlert,
    toggleAlertStatus
  } = useAlerts();

  const handleCreateAlert = async () => {
    await createAlert({
      name: 'Austin Price Drop Alert',
      type: 'Price Alert',
      location: 'Austin, TX',
      condition: 'Price drops below $400,000',
      frequency: 'Daily',
      criteria: {
        maxPrice: 400000,
        location: 'Austin, TX'
      }
    });
  };
}
```

### User Settings
```typescript
import { useSettings } from '@/hooks';

function SettingsComponent() {
  const {
    settings,
    updateProfile,
    updateNotifications
  } = useSettings();

  const handleUpdateProfile = async () => {
    await updateProfile({
      firstName: 'John',
      lastName: 'Investor',
      phone: '+1 (555) 123-4567'
    });
  };
}
```

## Backend Integration

All hooks support both backend API calls and mock data for development:

- **Development Mode**: Uses mock data when `NEXT_PUBLIC_USE_BACKEND=false`
- **Production Mode**: Uses backend API when `NEXT_PUBLIC_USE_BACKEND=true`

The hooks automatically handle:
- Loading states
- Error handling
- Data synchronization
- Optimistic updates

## API Endpoints

When using the backend, hooks connect to these endpoints:

- **Properties**: `/api/v1/property/*`
- **Goals**: `/api/v1/goals/*`
- **Alerts**: `/api/v1/alerts/*`
- **Settings**: `/api/v1/settings/*`

## Error Handling

All hooks provide error states and clear error functions:

```typescript
const { error, clearError } = useProperty();

if (error) {
  return <div>Error: {error}</div>;
}
```

## Loading States

All hooks provide loading states for better UX:

```typescript
const { isLoading } = useProperty();

if (isLoading) {
  return <div>Loading...</div>;
}
``` 