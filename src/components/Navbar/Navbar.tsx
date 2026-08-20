import React, { useState, useEffect } from 'react';
import { 
  Menu,
  Compass, 
  PlusCircle, 
  ShieldAlert, 
  Route, 
  Map as MapIcon, 
  List, 
  Search, 
  X,
  SlidersHorizontal,
  Bookmark,
  WifiOff,
  DownloadCloud,
  CheckCircle2,
  UserCheck,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import type { FilterState } from '../../types/spot';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';


interface NavbarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenAddModal: () => void;
  onOpenSafetyModal: () => void;
  onOpenRoutePlanner: () => void;
  onOpenSideMenu: () => void;
  onOpenSOSModal: () => void;
  onOpenChecklistModal: () => void;
  viewMode: 'map' | 'list' | 'favorites';
  setViewMode: (mode: 'map' | 'list' | 'favorites') => void;
  totalSpotsCount: number;
  filteredSpotsCount: number;
  favoritesCount: number;
  onToggleFilterPanel: () => void;
  isFilterPanelOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  filters,
  onFilterChange,
  onOpenAddModal,
  onOpenSafetyModal,
  onOpenRoutePlanner,
  onOpenSideMenu,
  onOpenSOSModal,
  onOpenChecklistModal,
  viewMode,
  setViewMode,
  totalSpotsCount,
  filteredSpotsCount,
  favoritesCount,
  onToggleFilterPanel,
  isFilterPanelOpen,
}) => {
  const { user, stats, setIsProfileOpen, setIsAuthModalOpen } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [isCached, setIsCached] = useState(false);


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePrecacheData = () => {
    setIsCached(true);
    setTimeout(() => setIsCached(false), 4000);
  };

  return (
    <header className="bg-stone-900/95 backdrop-blur-md border-b border-stone-800 sticky top-0 z-30 px-3 md:px-6 py-2.5 shadow-xl">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left Section with Hamburger Menu + Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Hamburger Menu Button (3 lines) */}
          <button
            onClick={onOpenSideMenu}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700/80 transition-all shadow-sm active:scale-95"
            title="Menu principal (Profil, Paramètres, Documents Légaux)"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Logo & Brand */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-white shrink-0">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg md:text-xl font-black tracking-tight text-stone-100 flex items-center gap-1">
                CamperMap <span className="text-amber-500 font-extrabold">TN</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Bivouac & 4x4
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Carte des spots & pistes d'aventure en Tunisie
            </p>
          </div>
        </div>


        {/* Search Bar in center */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par lieu, région (ex: Cap Serrat, Zaghouan, Feidja...)"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full bg-stone-950/80 border border-stone-700/80 rounded-xl pl-10 pr-9 py-2 text-xs md:text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          
          {/* Filter Toggle Button */}
          <button
            onClick={onToggleFilterPanel}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all border ${
              isFilterPanelOpen
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
            title="Ouvrir les filtres avancés"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Filtres</span>
            <span className="px-1.5 py-0.2 rounded-full bg-stone-950 text-[11px] text-amber-400 border border-amber-500/30">
              {filteredSpotsCount}/{totalSpotsCount}
            </span>
          </button>

          {/* View Switcher (Map vs List vs Favorites) */}
          <div className="hidden lg:flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Carte
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Liste ({filteredSpotsCount})
            </button>
            <button
              onClick={() => setViewMode('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'favorites'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Favoris ({favoritesCount})
            </button>
          </div>

          {/* Offline / Online Status Indicator */}
          {!isOnline ? (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-bold animate-pulse">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hors-Ligne</span>
            </div>
          ) : (
            <button
              onClick={handlePrecacheData}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isCached
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                  : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title="Pré-charger tous les spots et cartes pour une utilisation hors-réseau en pleine nature"
            >
              {isCached ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Mode Hors-ligne Prêt !</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
                  <span>Activer Hors-ligne</span>
                </>
              )}
            </button>
          )}

          {/* Route Planner button — hidden on mobile, accessible via ☰ menu */}
          <button
            onClick={onOpenRoutePlanner}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-medium bg-stone-800/80 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-950/50 transition-all"
            title="Calculer un itinéraire"
          >
            <Route className="w-4 h-4" />
            <span className="hidden xl:inline">Itinéraire</span>
          </button>

          {/* Safety & Regulations button — hidden on mobile, accessible via ☰ menu */}
          <button
            onClick={onOpenSafetyModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs md:text-sm font-medium bg-stone-800/80 text-orange-400 border border-orange-800/50 hover:bg-orange-950/50 transition-all"
            title="Guide de sécurité & Numéros d'urgence en Tunisie"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden xl:inline">Sécurité</span>
          </button>

          {/* Checklist Sac à dos Button — hidden on mobile, accessible via ☰ menu */}
          <button
            onClick={onOpenChecklistModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs md:text-sm font-medium bg-stone-800/80 text-amber-300 border border-amber-800/50 hover:bg-amber-950/50 transition-all"
            title="Checklist Matériel de Bivouac"
          >
            <CheckSquare className="w-4 h-4" />
            <span className="hidden xl:inline">Checklist</span>
          </button>

          {/* SOS Urgence Button (Red Alert) — always visible, critical safety feature */}
          <button
            onClick={onOpenSOSModal}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs md:text-sm font-black bg-red-600/90 hover:bg-red-500 text-white border border-red-500 shadow-md shadow-red-700/30 transition-all animate-pulse min-h-[44px]"
            title="SOS Urgence & Coordonnées GPS"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>SOS</span>
          </button>

          {/* Language Switcher Pill — hidden on mobile, accessible via ☰ menu */}
          <div className="hidden md:flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1.5 rounded-lg transition-all ${language === 'fr' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              title="Français"
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1.5 rounded-lg transition-all ${language === 'ar' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              title="العربية (Tunisie)"
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1.5 rounded-lg transition-all ${language === 'en' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* User Account / Profile Button */}
          {user ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700/90 text-stone-100 border border-stone-700 transition-all group"
              title="Ouvrir mon tableau de bord & carnet de bivouac"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-amber-500 shrink-0">
                <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-stone-200 group-hover:text-amber-400">
                <span className="truncate max-w-[80px]">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                  ⛺ {stats.totalNights}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Compte</span>
            </button>
          )}

          {/* Add Spot Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-600/30 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Ajouter un spot</span>
          </button>
        </div>
      </div>


      {/* Mobile Search input */}
      <div className="mt-2 block md:hidden relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher spot ou région (Cap Serrat, Zaghouan...)"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className="w-full bg-stone-950/90 border border-stone-700/80 rounded-lg pl-9 pr-8 py-2 text-[16px] sm:text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
