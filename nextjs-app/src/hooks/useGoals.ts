import { useState, useCallback, useEffect } from 'react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  type: 'Portfolio Value' | 'Monthly Cash Flow' | 'Property Count' | 'ROI Percentage';
  status: 'active' | 'completed' | 'behind';
  progress: number;
}

interface GoalsSummary {
  totalGoals: number;
  activeGoals: number;
  avgProgress: number;
  monthlyInvestment: number;
}

interface UseGoalsReturn {
  goals: Goal[];
  summary: GoalsSummary | null;
  isLoading: boolean;
  error: string | null;
  createGoal: (goalData: Omit<Goal, 'id' | 'progress' | 'status'>) => Promise<void>;
  updateGoal: (goalId: string, goalData: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateGoalProgress: (goalId: string, currentAmount: number) => Promise<void>;
  clearError: () => void;
}

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';

// Mock data for development
const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Build Portfolio to $1M',
    targetAmount: 1000000,
    currentAmount: 240000,
    targetDate: '2028-12-31',
    monthlyContribution: 5000,
    type: 'Portfolio Value',
    status: 'active',
    progress: 24
  },
  {
    id: '2',
    name: 'Achieve $10K Monthly Cash Flow',
    targetAmount: 10000,
    currentAmount: 1850,
    targetDate: '2026-06-30',
    monthlyContribution: 2000,
    type: 'Monthly Cash Flow',
    status: 'active',
    progress: 18.5
  },
  {
    id: '3',
    name: 'Purchase 5 Properties',
    targetAmount: 5,
    currentAmount: 2,
    targetDate: '2025-12-31',
    monthlyContribution: 0,
    type: 'Property Count',
    status: 'active',
    progress: 40
  },
  {
    id: '4',
    name: 'Reach 15% Average ROI',
    targetAmount: 15,
    currentAmount: 8.9,
    targetDate: '2027-03-31',
    monthlyContribution: 0,
    type: 'ROI Percentage',
    status: 'active',
    progress: 59.3
  }
];

const mockSummary: GoalsSummary = {
  totalGoals: 4,
  activeGoals: 4,
  avgProgress: 35.6,
  monthlyInvestment: 7000
};

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<GoalsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load goals
  useEffect(() => {
    const loadGoals = async () => {
      if (USE_BACKEND) {
        try {
          const response = await fetch('/api/v1/goals');
          if (!response.ok) throw new Error('Failed to load goals');
          const data = await response.json();
          setGoals(data.data.goals);
          setSummary(data.data.summary);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to load goals');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use mock data
        setGoals(mockGoals);
        setSummary(mockSummary);
        setIsLoading(false);
      }
    };

    loadGoals();
  }, []);

  const createGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'progress' | 'status'>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch('/api/v1/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalData)
        });
        if (!response.ok) throw new Error('Failed to create goal');
        const data = await response.json();
        setGoals(prev => [...prev, data.data.goal]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create goal');
      }
    } else {
      // Mock implementation
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        progress: goalData.currentAmount > 0 && goalData.targetAmount > 0 
          ? Math.min((goalData.currentAmount / goalData.targetAmount) * 100, 100)
          : 0,
        status: 'active'
      };
      setGoals(prev => [...prev, newGoal]);
    }
  }, []);

  const updateGoal = useCallback(async (goalId: string, goalData: Partial<Goal>) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/goals/${goalId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalData)
        });
        if (!response.ok) throw new Error('Failed to update goal');
        const data = await response.json();
        setGoals(prev => prev.map(g => g.id === goalId ? data.data.goal : g));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update goal');
      }
    } else {
      // Mock implementation
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...goalData } : g));
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/goals/${goalId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete goal');
        setGoals(prev => prev.filter(g => g.id !== goalId));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete goal');
      }
    } else {
      // Mock implementation
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  }, []);

  const updateGoalProgress = useCallback(async (goalId: string, currentAmount: number) => {
    if (USE_BACKEND) {
      try {
        const response = await fetch(`/api/v1/goals/${goalId}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentAmount })
        });
        if (!response.ok) throw new Error('Failed to update goal progress');
        const data = await response.json();
        setGoals(prev => prev.map(g => g.id === goalId ? data.data.goal : g));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update goal progress');
      }
    } else {
      // Mock implementation
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          const progress = g.targetAmount > 0 
            ? Math.min((currentAmount / g.targetAmount) * 100, 100)
            : 0;
          return { ...g, currentAmount, progress };
        }
        return g;
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    goals,
    summary,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    clearError
  };
} 