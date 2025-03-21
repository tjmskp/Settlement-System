import toast from 'react-hot-toast';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'virtual' | 'in-person';
  status: 'scheduled' | 'pending' | 'cancelled';
  with: string;
}

export interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
}

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

export interface UserSettings {
  notifications: {
    email: {
      appointments: boolean;
      messages: boolean;
      documents: boolean;
      billing: boolean;
    };
    push: {
      appointments: boolean;
      messages: boolean;
      documents: boolean;
      billing: boolean;
    };
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    activityStatus: boolean;
    readReceipts: boolean;
  };
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'client' | 'lawyer' | 'admin';
  specialization?: string[];
  yearsOfExperience?: number;
  languages: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  availability?: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    wednesday: { start: string; end: string }[];
    thursday: { start: string; end: string }[];
    friday: { start: string; end: string }[];
    saturday: { start: string; end: string }[];
    sunday: { start: string; end: string }[];
  };
  stats?: {
    totalCases: number;
    resolvedCases: number;
    clientRating: number;
    responseRate: number;
    avgResponseTime: number;
  };
}

export interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'document' | 'billing' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    appointmentId?: string;
    conversationId?: string;
    documentId?: string;
    invoiceId?: string;
  };
}

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

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = `Error: ${response.status} - ${response.statusText}`;
    toast.error(error);
    return { data: null, error };
  }

  const data = await response.json();
  return { data, error: null };
}

export async function getDocuments(): Promise<ApiResponse<Document[]>> {
  try {
    const response = await fetch('/api/documents');
    return handleResponse<Document[]>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function uploadDocument(file: File): Promise<ApiResponse<Document>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/documents', {
      method: 'POST',
      body: formData
    });

    return handleResponse<Document>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function deleteDocument(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'DELETE'
    });

    return handleResponse<void>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getAppointments(): Promise<ApiResponse<Appointment[]>> {
  try {
    const response = await fetch('/api/appointments');
    return handleResponse<Appointment[]>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'status'>): Promise<ApiResponse<Appointment>> {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<Appointment>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function updateAppointment(
  id: string,
  data: Partial<Omit<Appointment, 'id'>>
): Promise<ApiResponse<Appointment>> {
  try {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<Appointment>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function deleteAppointment(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE'
    });

    return handleResponse<void>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getMessages(): Promise<ApiResponse<Message[]>> {
  try {
    const response = await fetch('/api/messages');
    return handleResponse<Message[]>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function sendMessage(data: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<ApiResponse<Message>> {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<Message>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export interface BillingData {
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
}

export async function getBillingData(): Promise<ApiResponse<BillingData>> {
  try {
    const response = await fetch('/api/billing');
    return handleResponse<BillingData>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ApiResponse<PaymentMethod>> {
  try {
    const response = await fetch('/api/billing/payment-methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<PaymentMethod>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function updatePaymentMethod(
  id: string,
  data: Partial<Omit<PaymentMethod, 'id' | 'last4'>>
): Promise<ApiResponse<PaymentMethod>> {
  try {
    const response = await fetch(`/api/billing/payment-methods/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<PaymentMethod>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function deletePaymentMethod(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/billing/payment-methods/${id}`, {
      method: 'DELETE'
    });

    return handleResponse<void>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
  try {
    const response = await fetch('/api/analytics');
    return handleResponse<AnalyticsData>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getCustomAnalytics(dateRange: {
  startDate: string;
  endDate: string;
}): Promise<ApiResponse<AnalyticsData>> {
  try {
    const response = await fetch('/api/analytics/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dateRange)
    });

    return handleResponse<AnalyticsData>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getSettings(): Promise<ApiResponse<UserSettings>> {
  try {
    const response = await fetch('/api/settings');
    return handleResponse<UserSettings>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });

    return handleResponse<UserSettings>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getProfile(): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch('/api/profile');
    return handleResponse<UserProfile>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function updateProfile(data: Partial<Omit<UserProfile, 'id' | 'role'>>): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<UserProfile>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
  try {
    const response = await fetch('/api/notifications');
    return handleResponse<Notification[]>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ read: true })
    });

    return handleResponse<void>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

export async function getCases(): Promise<ApiResponse<Case[]>> {
  try {
    const response = await fetch('/api/cases', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await handleResponse<Case[]>(response);
    return data;
  } catch (error: unknown) {
    console.error('Failed to fetch cases:', error);
    toast.error('Failed to fetch cases');
    return { data: null, error: 'Failed to fetch cases' };
  }
}

export async function createCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'appointments' | 'notes' | 'timeline' | 'billing'>): Promise<ApiResponse<Case>> {
  try {
    const response = await fetch('/api/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(caseData)
    });

    const data = await handleResponse<Case>(response);
    if (data.data) {
      toast.success('Case created successfully');
    }
    return data;
  } catch (error: unknown) {
    console.error('Failed to create case:', error);
    toast.error('Failed to create case');
    return { data: null, error: 'Failed to create case' };
  }
}

export async function updateCase(id: string, caseData: Partial<Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'appointments' | 'notes' | 'timeline' | 'billing'>>): Promise<ApiResponse<Case>> {
  try {
    const response = await fetch(`/api/cases/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(caseData)
    });

    const data = await handleResponse<Case>(response);
    if (data.data) {
      toast.success('Case updated successfully');
    }
    return data;
  } catch (error: unknown) {
    console.error('Failed to update case:', error);
    toast.error('Failed to update case');
    return { data: null, error: 'Failed to update case' };
  }
}

export async function deleteCase(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`/api/cases/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await handleResponse<null>(response);
    if (data.error === null) {
      toast.success('Case deleted successfully');
    }
    return data;
  } catch (error: unknown) {
    console.error('Failed to delete case:', error);
    toast.error('Failed to delete case');
    return { data: null, error: 'Failed to delete case' };
  }
} 