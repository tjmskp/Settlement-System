import { useState, useCallback } from 'react';
import { getSettings, updateSettings } from '@/lib/api';

export interface NotificationSettings {
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
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts';
  activityStatus: boolean;
  readReceipts: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  display: DisplaySettings;
  privacy: PrivacySettings;
}

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

export function useSettings() {
  const [state, setState] = useState<SettingsState>({
    settings: null,
    loading: true,
    error: null
  });

  const fetchSettings = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getSettings();

    if (response.data) {
      const settingsData = response.data as UserSettings;
      setState({
        settings: settingsData,
        loading: false,
        error: null
      });
    } else {
      setState({
        settings: null,
        loading: false,
        error: response.error
      });
    }
  }, []);

  const updateNotificationSettings = async (
    settings: Partial<NotificationSettings>
  ) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updateSettings({
      notifications: settings
    });

    if (response.data) {
      const updatedSettings = response.data as UserSettings;
      setState({
        settings: updatedSettings,
        loading: false,
        error: null
      });
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

  const updateDisplaySettings = async (
    settings: Partial<DisplaySettings>
  ) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updateSettings({
      display: settings
    });

    if (response.data) {
      const updatedSettings = response.data as UserSettings;
      setState({
        settings: updatedSettings,
        loading: false,
        error: null
      });
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

  const updatePrivacySettings = async (
    settings: Partial<PrivacySettings>
  ) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updateSettings({
      privacy: settings
    });

    if (response.data) {
      const updatedSettings = response.data as UserSettings;
      setState({
        settings: updatedSettings,
        loading: false,
        error: null
      });
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

  const isEmailNotificationEnabled = (type: keyof NotificationSettings['email']) => {
    return state.settings?.notifications.email[type] ?? false;
  };

  const isPushNotificationEnabled = (type: keyof NotificationSettings['push']) => {
    return state.settings?.notifications.push[type] ?? false;
  };

  const getCurrentTheme = () => {
    return state.settings?.display.theme ?? 'system';
  };

  const getCurrentLanguage = () => {
    return state.settings?.display.language ?? 'en';
  };

  const getDateTimeFormat = () => {
    return {
      dateFormat: state.settings?.display.dateFormat ?? 'MM/DD/YYYY',
      timeFormat: state.settings?.display.timeFormat ?? '12h'
    };
  };

  const getPrivacyPreferences = () => {
    return {
      profileVisibility: state.settings?.privacy.profileVisibility ?? 'private',
      activityStatus: state.settings?.privacy.activityStatus ?? false,
      readReceipts: state.settings?.privacy.readReceipts ?? false
    };
  };

  return {
    ...state,
    fetchSettings,
    updateNotificationSettings,
    updateDisplaySettings,
    updatePrivacySettings,
    isEmailNotificationEnabled,
    isPushNotificationEnabled,
    getCurrentTheme,
    getCurrentLanguage,
    getDateTimeFormat,
    getPrivacyPreferences
  };
} 