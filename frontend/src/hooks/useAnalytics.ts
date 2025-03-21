import { useState, useCallback } from 'react';
import { getAnalytics, getCustomAnalytics } from '@/lib/api';

export interface AnalyticsData {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  totalDocuments: number;
  totalAppointments: number;
  upcomingAppointments: number;
  totalMessages: number;
  unreadMessages: number;
  totalBilled: number;
  outstandingAmount: number;
  monthlyStats: {
    month: string;
    cases: number;
    documents: number;
    appointments: number;
    messages: number;
    billing: number;
  }[];
}

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export function useAnalytics() {
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    loading: true,
    error: null
  });

  const fetchAnalytics = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getAnalytics();

    if (response.data) {
      const analyticsData = response.data as AnalyticsData;
      setState({
        data: analyticsData,
        loading: false,
        error: null
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: response.error
      });
    }
  }, []);

  const fetchCustomAnalytics = useCallback(async (dateRange: DateRange) => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getCustomAnalytics(dateRange);

    if (response.data) {
      const analyticsData = response.data as AnalyticsData;
      setState({
        data: analyticsData,
        loading: false,
        error: null
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: response.error
      });
    }
  }, []);

  const getCaseResolutionRate = () => {
    if (!state.data) return 0;
    return state.data.resolvedCases / (state.data.totalCases || 1) * 100;
  };

  const getAppointmentCompletionRate = () => {
    if (!state.data) return 0;
    return (state.data.totalAppointments - state.data.upcomingAppointments) / 
           (state.data.totalAppointments || 1) * 100;
  };

  const getMessageResponseRate = () => {
    if (!state.data) return 0;
    return (state.data.totalMessages - state.data.unreadMessages) / 
           (state.data.totalMessages || 1) * 100;
  };

  const getBillingCollectionRate = () => {
    if (!state.data) return 0;
    return (state.data.totalBilled - state.data.outstandingAmount) / 
           (state.data.totalBilled || 1) * 100;
  };

  const getMonthlyTrends = () => {
    if (!state.data?.monthlyStats) return [];
    return state.data.monthlyStats;
  };

  const getMonthlyGrowthRate = (metric: keyof AnalyticsData['monthlyStats'][0]) => {
    if (!state.data?.monthlyStats || state.data.monthlyStats.length < 2) return 0;
    
    const stats = state.data.monthlyStats;
    const currentMonth = stats[stats.length - 1][metric] as number;
    const previousMonth = stats[stats.length - 2][metric] as number;
    
    if (previousMonth === 0) return 0;
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  return {
    ...state,
    fetchAnalytics,
    fetchCustomAnalytics,
    getCaseResolutionRate,
    getAppointmentCompletionRate,
    getMessageResponseRate,
    getBillingCollectionRate,
    getMonthlyTrends,
    getMonthlyGrowthRate
  };
} 