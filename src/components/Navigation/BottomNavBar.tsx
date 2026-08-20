import React from 'react';
import { Map as MapIcon, List, Bookmark, MoreHorizontal } from 'lucide-react';

interface BottomNavBarProps {
  viewMode: 'map' | 'list' | 'favorites';
  setViewMode: (mode: 'map' | 'list' | 'favorites') => void;
  filteredSpotsCount: number;
  favoritesCount: number;
  onOpenSideMenu: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  viewMode,
  setViewMode,
  filteredSpotsCount,
  favoritesCount,
  onOpenSideMenu,
}) => {
  const tabs = [
    {
      id: 'map' as const,
      label: 'Carte',
      icon: MapIcon,
      badge: null,
      action: () => setViewMode('map'),
    },
    {
      id: 'list' as const,
      label: 'Liste',
      icon: List,
      badge: filteredSpotsCount,
      action: () => setViewMode('list'),
    },
    {
      id: 'favorites' as const,
      label: 'Favoris',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : null,
      action: () => setViewMode('favorites'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-stone-900/95 backdrop-blur-md border-t border-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-4 min-h-[56px] flex-1 transition-all active:scale-95 relative ${
                isActive
                  ? 'text-amber-400'
                  : 'text-stone-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {tab.badge !== null && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-amber-500 text-stone-950 text-[9px] font-black">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? 'font-black text-amber-400' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}

        {/* More / Menu button */}
        <button
          onClick={onOpenSideMenu}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 px-4 min-h-[56px] flex-1 text-stone-400 transition-all active:scale-95"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Plus</span>
        </button>
      </div>
    </nav>
  );
};
