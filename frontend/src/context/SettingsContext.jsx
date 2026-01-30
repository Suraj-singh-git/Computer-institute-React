import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const defaultSettings = {
  app_name: 'UMA Technical & Electrical Institute',
  app_icon: '',
  contact_no: '',
  email: '',
  address: '',
};

const SettingsContext = createContext(defaultSettings);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/settings/public')
      .then(({ data }) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    client.get('/settings/public')
      .then(({ data }) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings));
  };

  const appName = settings?.app_name || defaultSettings.app_name;
  const contactNo = settings?.contact_no || '';
  const email = settings?.email || '';
  const address = settings?.address || '';

  return (
    <SettingsContext.Provider value={{
      settings,
      appName,
      contactNo,
      email,
      address,
      loading,
      refresh,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  return ctx || defaultSettings;
}
