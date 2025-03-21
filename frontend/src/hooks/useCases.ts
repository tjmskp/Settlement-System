import { useState, useCallback } from 'react';
import { getCases, createCase, updateCase, deleteCase } from '@/lib/api';

export interface Case {
  id: string;
  title: string;
  description: string;
  type: 'civil' | 'criminal' | 'corporate' | 'family' | 'other';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }[];
  appointments: {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'virtual' | 'in-person';
  }[];
  notes: {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }[];
  timeline: {
    id: string;
    event: string;
    date: string;
    addedBy: string;
  }[];
  billing: {
    totalBilled: number;
    totalPaid: number;
    nextInvoiceDate?: string;
  };
}

interface CasesState {
  cases: Case[];
  loading: boolean;
  error: string | null;
}

export function useCases() {
  const [state, setState] = useState<CasesState>({
    cases: [],
    loading: true,
    error: null
  });

  const fetchCases = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getCases();

    if (response.data) {
      const casesData = response.data as Case[];
      setState({
        cases: casesData,
        loading: false,
        error: null
      });
    } else {
      setState({
        cases: [],
        loading: false,
        error: response.error
      });
    }
  }, []);

  const handleCreateCase = async (data: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'appointments' | 'notes' | 'timeline' | 'billing'>) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await createCase(data);

    if (response.data) {
      const newCase = response.data as Case;
      setState(prevState => ({
        cases: [...prevState.cases, newCase],
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const handleUpdateCase = async (
    id: string,
    data: Partial<Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'appointments' | 'notes' | 'timeline' | 'billing'>>
  ) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updateCase(id, data);

    if (response.data) {
      const updatedCase = response.data as Case;
      setState(prevState => ({
        cases: prevState.cases.map(c =>
          c.id === id ? updatedCase : c
        ),
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const handleDeleteCase = async (id: string) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await deleteCase(id);

    if (response.error === null) {
      setState(prevState => ({
        cases: prevState.cases.filter(c => c.id !== id),
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const getCaseById = (id: string) => {
    return state.cases.find(c => c.id === id);
  };

  const getCasesByStatus = (status: Case['status']) => {
    return state.cases.filter(c => c.status === status);
  };

  const getCasesByType = (type: Case['type']) => {
    return state.cases.filter(c => c.type === type);
  };

  const getCasesByPriority = (priority: Case['priority']) => {
    return state.cases.filter(c => c.priority === priority);
  };

  const getCasesByAssignee = (assigneeId: string) => {
    return state.cases.filter(c => c.assignedTo === assigneeId);
  };

  const getCasesByClient = (clientId: string) => {
    return state.cases.filter(c => c.clientId === clientId);
  };

  const getUpcomingDeadlines = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return state.cases
      .filter(c => c.dueDate && new Date(c.dueDate) <= futureDate && new Date(c.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  };

  const getRecentlyUpdatedCases = (count: number = 5) => {
    return [...state.cases]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, count);
  };

  const getCaseStatistics = () => {
    const totalCases = state.cases.length;
    const openCases = state.cases.filter(c => c.status === 'open').length;
    const resolvedCases = state.cases.filter(c => c.status === 'resolved').length;
    const closedCases = state.cases.filter(c => c.status === 'closed').length;
    
    return {
      total: totalCases,
      open: openCases,
      resolved: resolvedCases,
      closed: closedCases,
      resolutionRate: totalCases > 0 ? (resolvedCases + closedCases) / totalCases * 100 : 0
    };
  };

  return {
    ...state,
    fetchCases,
    createCase: handleCreateCase,
    updateCase: handleUpdateCase,
    deleteCase: handleDeleteCase,
    getCaseById,
    getCasesByStatus,
    getCasesByType,
    getCasesByPriority,
    getCasesByAssignee,
    getCasesByClient,
    getUpcomingDeadlines,
    getRecentlyUpdatedCases,
    getCaseStatistics
  };
} 