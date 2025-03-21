import { useState, useCallback } from 'react';
import {
  getBillingData,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from '@/lib/api';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account';
  last4: string;
  expMonth?: number;
  expYear?: number;
  name: string;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  description: string;
  paidAt?: string;
}

interface BillingState {
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

export interface AddPaymentMethodData {
  type: 'credit_card' | 'bank_account';
  last4: string;
  expiry: string;
  name: string;
  isDefault?: boolean;
}

export function useBilling() {
  const [state, setState] = useState<BillingState>({
    paymentMethods: [],
    invoices: [],
    loading: true,
    error: null
  });

  const fetchBillingData = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getBillingData();

    if (response.data) {
      const data = response.data as { paymentMethods: PaymentMethod[]; invoices: Invoice[] };
      setState({
        paymentMethods: data.paymentMethods,
        invoices: data.invoices,
        loading: false,
        error: null
      });
    } else {
      setState({
        paymentMethods: [],
        invoices: [],
        loading: false,
        error: response.error
      });
    }
  }, []);

  const handleAddPaymentMethod = async (data: AddPaymentMethodData) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await addPaymentMethod(data);

    if (response.data) {
      const newPaymentMethod = response.data as PaymentMethod;
      setState(prevState => ({
        paymentMethods: [...prevState.paymentMethods, newPaymentMethod],
        invoices: prevState.invoices,
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

  const handleUpdatePaymentMethod = async (
    id: string,
    data: Partial<AddPaymentMethodData>
  ) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updatePaymentMethod(id, data);

    if (response.data) {
      const updatedMethod = response.data as PaymentMethod;
      setState(prevState => ({
        paymentMethods: prevState.paymentMethods.map(method =>
          method.id === id ? { ...method, ...updatedMethod } : method
        ),
        invoices: prevState.invoices,
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

  const handleDeletePaymentMethod = async (id: string) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await deletePaymentMethod(id);

    if (response.error === null) {
      setState(prevState => ({
        paymentMethods: prevState.paymentMethods.filter(method => method.id !== id),
        invoices: prevState.invoices,
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

  const getDefaultPaymentMethod = () => {
    return state.paymentMethods.find(method => method.isDefault);
  };

  const getPendingInvoices = () => {
    return state.invoices.filter(invoice => invoice.status === 'pending');
  };

  const getOverdueInvoices = () => {
    return state.invoices.filter(invoice => invoice.status === 'overdue');
  };

  const getTotalOutstanding = () => {
    return state.invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((total, invoice) => total + invoice.amount, 0);
  };

  return {
    ...state,
    fetchBillingData,
    addPaymentMethod: handleAddPaymentMethod,
    updatePaymentMethod: handleUpdatePaymentMethod,
    deletePaymentMethod: handleDeletePaymentMethod,
    getDefaultPaymentMethod,
    getPendingInvoices,
    getOverdueInvoices,
    getTotalOutstanding
  };
} 