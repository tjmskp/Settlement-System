import { useState, useCallback, useEffect } from 'react';
import { getNotifications, markNotificationAsRead } from '@/lib/api';

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

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export function useNotifications() {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    loading: true,
    error: null
  });

  const fetchNotifications = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getNotifications();

    if (response.data) {
      const notificationsData = response.data as Notification[];
      setState({
        notifications: notificationsData,
        loading: false,
        error: null
      });
    } else {
      setState({
        notifications: [],
        loading: false,
        error: response.error
      });
    }
  }, []);

  const markAsRead = async (id: string) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await markNotificationAsRead(id);

    if (response.error === null) {
      setState(prevState => ({
        notifications: prevState.notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
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

  const getUnreadCount = () => {
    return state.notifications.filter(notification => !notification.read).length;
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return state.notifications.filter(notification => notification.type === type);
  };

  const getLatestNotifications = (count: number = 5) => {
    return [...state.notifications]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count);
  };

  const getUnreadNotifications = () => {
    return state.notifications.filter(notification => !notification.read);
  };

  // Set up real-time updates using Server-Sent Events
  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/events');

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data) as Notification;
      setState(prevState => ({
        ...prevState,
        notifications: [newNotification, ...prevState.notifications]
      }));
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    getUnreadCount,
    getNotificationsByType,
    getLatestNotifications,
    getUnreadNotifications
  };
} 