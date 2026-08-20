import React, { createContext, useContext, useState } from 'react';


export type Language = 'fr' | 'ar' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
    en: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Header
  appTitle: { fr: 'CamperMap', ar: 'كامبر ماب', en: 'CamperMap' },
  appSubtitle: { fr: 'Bivouac & Pistes en Tunisie', ar: 'التخييم والمسالك في تونس', en: 'Bivouac & Trails in Tunisia' },
  searchPlaceholder: { fr: 'Rechercher un spot, une région, un sentier...', ar: 'ابحث عن مكان، منطقة، مسار...', en: 'Search a spot, region, trail...' },
  allSpots: { fr: 'Tous les spots', ar: 'كل الأماكن', en: 'All spots' },
  favorites: { fr: 'Favoris', ar: 'المفضلة', en: 'Favorites' },
  filters: { fr: 'Filtres', ar: 'فلاتر', en: 'Filters' },
  account: { fr: 'Compte', ar: 'حسابي', en: 'Account' },
  addSpot: { fr: 'Ajouter un Spot', ar: 'إضافة مكان', en: 'Add a Spot' },
  routePlanner: { fr: 'Itinéraire', ar: 'مسار', en: 'Route Planner' },
  safetyGuide: { fr: 'Guide Sécurité', ar: 'دليل السلامة', en: 'Safety Guide' },
  sosEmergency: { fr: 'SOS Urgence', ar: 'طوارئ SOS', en: 'SOS Emergency' },
  checklist: { fr: 'Checklist Sac', ar: 'قائمة المعدات', en: 'Gear Checklist' },
  
  // Access types
  foot: { fr: 'À pied', ar: 'مشياً', en: 'Hiking' },
  car: { fr: 'Voiture', ar: 'سيارة', en: 'Car' },
  suv: { fr: 'SUV / Piste', ar: 'سيارة دفع رباعي', en: 'SUV / Track' },
  fourByFour: { fr: '4x4 Franchissement', ar: '4x4 مسالك وعرة', en: '4x4 Trail' },
  van: { fr: 'Van / Camping-car', ar: 'فان وتخييم', en: 'Van / Camper' },

  // Solar
  sunrise: { fr: 'Lever de soleil', ar: 'شروق الشمس', en: 'Sunrise' },
  sunset: { fr: 'Coucher de soleil', ar: 'غروب الشمس', en: 'Sunset' },
  goldenHour: { fr: 'Golden Hour (Photos)', ar: 'الساعة الذهبية للتصوير', en: 'Golden Hour' },
  dawn: { fr: 'Aube', ar: 'الفجر', en: 'Dawn' },

  // Actions
  planRoute: { fr: 'Calculer Itinéraire', ar: 'تحديد المسار', en: 'Plan Route' },
  downloadGPX: { fr: 'Trace GPX (.gpx)', ar: 'تحميل مسار GPX', en: 'GPX Track (.gpx)' },
  shareWhatsApp: { fr: 'WhatsApp', ar: 'واتساب', en: 'WhatsApp' },
  copyGPS: { fr: 'Copier Coordonnées GPS', ar: 'نسخ إحداثيات GPS', en: 'Copy GPS Coords' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof DICTIONARY) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('campermap_language') as Language;
    return saved === 'fr' || saved === 'ar' || saved === 'en' ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('campermap_language', lang);
  };

  const isRtl = language === 'ar';

  const t = (key: keyof typeof DICTIONARY): string => {
    if (!DICTIONARY[key]) return String(key);
    return DICTIONARY[key][language] || DICTIONARY[key].fr;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
