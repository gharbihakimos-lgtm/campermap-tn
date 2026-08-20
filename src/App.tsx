import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { FilterPanel } from './components/Filters/FilterPanel';
import { CampingMap } from './components/Map/CampingMap';
import { SpotDetailDrawer } from './components/SpotDetail/SpotDetailDrawer';
import { AddSpotModal } from './components/AddSpot/AddSpotModal';
import { RoutePlannerModal } from './components/RoutePlanner/RoutePlannerModal';
import { SafetyTipsModal } from './components/SafetyTips/SafetyTipsModal';
import { SpotListDrawer } from './components/SpotList/SpotListDrawer';
import { AuthModal } from './components/Auth/AuthModal';
import { CamperProfileDrawer } from './components/Profile/CamperProfileDrawer';
import { AddLogEntryModal } from './components/Profile/AddLogEntryModal';
import { SideMenuDrawer } from './components/SideMenu/SideMenuDrawer';
import { SettingsModal } from './components/Settings/SettingsModal';
import { LegalModal } from './components/Legal/LegalModal';
import { WelcomeTourModal } from './components/Onboarding/WelcomeTourModal';
import { SOSModal } from './components/Emergency/SOSModal';
import { ChecklistModal } from './components/Checklist/ChecklistModal';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { INITIAL_SPOTS } from './data/spotsData';
import { api } from './services/apiClient';
import type { CampingSpot, FilterState, SpotCoordinates, SpotReview } from './types/spot';

function CamperMapApp() {
  // Spots State (Loaded from initial + local storage + synced with backend API)
  const [spots, setSpots] = useState<CampingSpot[]>(() => {
    const saved = localStorage.getItem('campermap_custom_spots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_SPOTS, ...parsed];
      } catch (e) {
        console.error('Failed to parse custom spots', e);
      }
    }
    return INITIAL_SPOTS;
  });

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('campermap_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    return [];
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    accessTypes: [],
    difficulties: [],
    amenities: [],
    activities: [],
    categories: [],
    region: 'Toutes les régions',
    networkOnly: false,
    waterOnly: false
  });

  // UI State
  const [selectedSpot, setSelectedSpot] = useState<CampingSpot | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'favorites'>('map');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [legalDefaultTab, setLegalDefaultTab] = useState<'cgu' | 'charter' | 'privacy' | 'disclaimer'>('charter');

  // Geolocation & Route
  const [userLocation, setUserLocation] = useState<SpotCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [routePolyline, setRoutePolyline] = useState<SpotCoordinates[] | null>(null);

  // Map coordinate picking mode
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState<SpotCoordinates | null>(null);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('campermap_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (spotId: string) => {
    setFavorites(prev => 
      prev.includes(spotId) ? prev.filter(id => id !== spotId) : [...prev, spotId]
    );
  };

  // Add Spot handler
  const handleAddSpot = (newSpot: CampingSpot) => {
    setSpots(prev => {
      const updated = [newSpot, ...prev];
      const customSpots = updated.filter(s => !INITIAL_SPOTS.some(init => init.id === s.id));
      localStorage.setItem('campermap_custom_spots', JSON.stringify(customSpots));
      return updated;
    });
    api.saveSpot(newSpot);
    setSelectedSpot(newSpot);
    setIsPickingLocation(false);
    setPickedCoordinates(null);
  };

  // Add Review handler
  const handleAddReview = (spotId: string, review: SpotReview) => {
    setSpots(prev => 
      prev.map(s => {
        if (s.id === spotId) {
          const currentReviews = s.reviews || [];
          const updatedReviews = [review, ...currentReviews];
          const newAvgRating = parseFloat(
            ((s.rating * s.reviewsCount + review.rating) / (s.reviewsCount + 1)).toFixed(1)
          );
          return {
            ...s,
            reviews: updatedReviews,
            reviewsCount: s.reviewsCount + 1,
            rating: newAvgRating
          };
        }
        return s;
      })
    );
  };

  // Geolocation trigger
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setUserLocation({ lat: 36.8065, lng: 10.1815 });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Filtered Spots memoized
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(q);
        const matchesRegion = spot.region.toLowerCase().includes(q);
        const matchesDesc = spot.description.toLowerCase().includes(q);
        const matchesTrack = spot.trackDescription.toLowerCase().includes(q);
        const matchesArabic = spot.arabicName ? spot.arabicName.includes(q) : false;
        if (!matchesName && !matchesRegion && !matchesDesc && !matchesTrack && !matchesArabic) {
          return false;
        }
      }

      // Region filter
      if (filters.region !== 'Toutes les régions' && spot.region !== filters.region) {
        return false;
      }

      // Access types filter
      if (filters.accessTypes.length > 0) {
        const hasAccess = filters.accessTypes.some(type => spot.accessTypes.includes(type));
        if (!hasAccess) return false;
      }

      // Difficulty filter
      if (filters.difficulties.length > 0) {
        if (!filters.difficulties.includes(spot.difficulty)) return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => spot.amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      // Activities filter
      if (filters.activities.length > 0) {
        const hasAllActivities = filters.activities.every(activity => spot.activities?.includes(activity));
        if (!hasAllActivities) return false;
      }

      // Categories filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(spot.category)) return false;
      }

      // Water only filter
      if (filters.waterOnly && !spot.amenities.includes('potable_water')) {
        return false;
      }

      // Network only filter
      if (filters.networkOnly && spot.networkCoverage !== 'good') {
        return false;
      }

      return true;
    });
  }, [spots, filters]);

  const handleOpenLegalWithTab = (tab?: 'cgu' | 'charter' | 'privacy' | 'disclaimer') => {
    setLegalDefaultTab(tab || 'charter');
    setIsLegalOpen(true);
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-stone-950 text-stone-100 overflow-hidden select-none">
      
      {/* Top Navbar */}
      <Navbar
        filters={filters}
        onFilterChange={setFilters}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenRoutePlanner={() => setIsRoutePlannerOpen(true)}
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalSpotsCount={spots.length}
        filteredSpotsCount={filteredSpots.length}
        favoritesCount={favorites.length}
        onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        isFilterPanelOpen={isFilterPanelOpen}
      />

      {/* Quick Filters Pill Bar */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
      />

      {/* Main App Layout */}
      <main className="flex-1 relative flex overflow-hidden">
        
        {/* Left List Sidebar on Desktop or when in List/Favorites mode */}
        {(viewMode === 'list' || viewMode === 'favorites') && (
          <div className="w-full md:w-96 lg:w-[420px] h-full shrink-0 z-10 border-r border-stone-800">
            <SpotListDrawer
              spots={filteredSpots}
              selectedSpot={selectedSpot}
              onSelectSpot={(spot) => {
                setSelectedSpot(spot);
                if (window.innerWidth < 768) {
                  setViewMode('map');
                }
              }}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              userLocation={userLocation}
              mode={viewMode === 'favorites' ? 'favorites' : 'list'}
            />
          </div>
        )}

        {/* Map Container */}
        <div className={`flex-1 h-full relative ${viewMode !== 'map' ? 'hidden md:block' : 'block'}`}>
          <CampingMap
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            onSelectSpot={(spot) => setSelectedSpot(spot)}
            userLocation={userLocation}
            onLocateUser={handleLocateUser}
            isLocating={isLocating}
            routePolyline={routePolyline}
            isPickingLocation={isPickingLocation}
            onLocationPicked={(coords) => {
              setPickedCoordinates(coords);
              setIsPickingLocation(false);
              setIsAddModalOpen(true);
            }}
          />
        </div>

      </main>

      {/* Side Menu Drawer (☰ 3 Lines on Top Left) */}
      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLegal={handleOpenLegalWithTab}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onOpenRoutePlanner={() => setIsRoutePlannerOpen(true)}
        onOpenAddSpot={() => setIsAddModalOpen(true)}
        onOpenWelcomeTour={() => setIsWelcomeTourOpen(true)}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        onOpenChecklist={() => setIsChecklistModalOpen(true)}
      />

      {/* Spot Detail Slide-over Drawer */}
      <SpotDetailDrawer
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onPlanRoute={(spot) => {
          setSelectedSpot(spot);
          setIsRoutePlannerOpen(true);
        }}
        isFavorite={selectedSpot ? favorites.includes(selectedSpot.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddReview={handleAddReview}
      />

      {/* Add Spot Community Modal */}
      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSpot={handleAddSpot}
        onPickLocationOnMap={() => {
          setIsPickingLocation(true);
          setViewMode('map');
        }}
        pickedCoordinates={pickedCoordinates}
        userLocation={userLocation}
      />

      {/* Route & Trail Planner Modal */}
      <RoutePlannerModal
        isOpen={isRoutePlannerOpen}
        onClose={() => setIsRoutePlannerOpen(false)}
        spots={spots}
        selectedSpot={selectedSpot}
        userLocation={userLocation}
        onApplyRoute={(points) => {
          setRoutePolyline(points);
          setViewMode('map');
        }}
      />

      {/* Safety & Emergency Guide Modal */}
      <SafetyTipsModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* SOS Emergency Modal */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        userLocation={userLocation}
      />

      {/* Camping Gear Checklist Modal */}
      <ChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />

      {/* App Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Legal Documents & Charter Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalDefaultTab}
      />

      {/* Auth Modal (Login / Register / Google) */}
      <AuthModal />

      {/* Camper Profile & Stats Dashboard Drawer */}
      <CamperProfileDrawer />

      {/* Add Log Entry Modal (Bivouac / Rando Logger) */}
      <AddLogEntryModal spots={spots} />

      {/* Welcome Interactive Tour Guide */}
      <WelcomeTourModal
        isOpen={isWelcomeTourOpen}
        onClose={() => setIsWelcomeTourOpen(false)}
      />

    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CamperMapApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
