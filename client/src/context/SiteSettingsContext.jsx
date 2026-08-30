import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const DEFAULTS = {
  siteName: 'Lobito Farms',
  tagline: '',
  logo: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  social: {},
  footerText: '',
};

const SiteSettingsContext = createContext(DEFAULTS);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    api
      .get('/site-settings')
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
