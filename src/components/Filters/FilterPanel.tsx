import React from 'react';
import { 
  Footprints, 
  Car, 
  Truck, 
  Droplets, 
  Trees, 
  Waves, 
  Wifi, 
  Mountain, 
  Flame, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Gauge,
  Tent
} from 'lucide-react';
import type { FilterState, AccessType, DifficultyLevel, Amenity, SpotCategory, ActivityType } from '../../types/spot';
import { REGIONS_LIST } from '../../data/spotsData';


interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  isOpen,
  onClose
}) => {
  const toggleAccess = (type: AccessType) => {
    const exists = filters.accessTypes.includes(type);
    const updated = exists
      ? filters.accessTypes.filter(t => t !== type)
      : [...filters.accessTypes, type];
    onFilterChange({ ...filters, accessTypes: updated });
  };

  const toggleDifficulty = (diff: DifficultyLevel) => {
    const exists = filters.difficulties.includes(diff);
    const updated = exists
      ? filters.difficulties.filter(d => d !== diff)
      : [...filters.difficulties, diff];
    onFilterChange({ ...filters, difficulties: updated });
  };

  const toggleAmenity = (amenity: Amenity) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: updated });
  };

  const toggleActivity = (activity: ActivityType) => {
    const exists = filters.activities.includes(activity);
    const updated = exists
      ? filters.activities.filter(a => a !== activity)
      : [...filters.activities, activity];
    onFilterChange({ ...filters, activities: updated });
  };

  const toggleCategory = (cat: SpotCategory) => {
    const exists = filters.categories.includes(cat);
    const updated = exists
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const resetFilters = () => {
    onFilterChange({
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
  };

  const activeFiltersCount = 
    filters.accessTypes.length + 
    filters.difficulties.length + 
    filters.amenities.length + 
    filters.activities.length +
    filters.categories.length + 
    (filters.region !== 'Toutes les régions' ? 1 : 0) +
    (filters.waterOnly ? 1 : 0) +
    (filters.networkOnly ? 1 : 0);

  return (
    <>
      {/* Quick Filter Bar (Always visible below Navbar) */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-3 md:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] uppercase tracking-wider text-stone-400 font-semibold pr-2 border-r border-stone-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Filtres rapides</span>
        </div>

        {/* Quick Access Pills */}
        <button
          onClick={() => toggleAccess('foot')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.accessTypes.includes('foot')
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <Footprints className="w-3.5 h-3.5 text-emerald-400" />
          À pied / Rando
        </button>

        <button
          onClick={() => toggleAccess('4x4')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.accessTypes.includes('4x4')
              ? 'bg-amber-600/30 text-amber-300 border-amber-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          4x4 & Piste
        </button>

        <button
          onClick={() => toggleActivity('swimming')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.activities.includes('swimming')
              ? 'bg-sky-600/30 text-sky-300 border-sky-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <span>🏊 Baignade</span>
        </button>

        <button
          onClick={() => toggleActivity('climbing')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.activities.includes('climbing')
              ? 'bg-orange-600/30 text-orange-300 border-orange-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <span>🧗 Escalade</span>
        </button>

        <button
          onClick={() => toggleActivity('stargazing')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.activities.includes('stargazing')
              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <span>🌌 Étoiles</span>
        </button>

        <button
          onClick={() => toggleAmenity('potable_water')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.amenities.includes('potable_water')
              ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          Source d'eau
        </button>

        <button
          onClick={() => toggleAmenity('dense_forest')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            filters.amenities.includes('dense_forest')
              ? 'bg-green-600/30 text-green-300 border-green-500 font-semibold'
              : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          <Trees className="w-3.5 h-3.5 text-green-400" />
          Forêt / Ombre
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900 transition-all shrink-0 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Full Filter Drawer / Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-md bg-stone-900 border-r border-stone-800 h-full overflow-y-auto p-5 z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-5">
              <div>
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-500" />
                  Filtres & Activités Outdoor
                </h2>
                <p className="text-xs text-stone-400">
                  Affinez selon votre véhicule, activités souhaitées et commodités
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 flex-1">
              
              {/* Region Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Gouvernorat / Région en Tunisie
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {REGIONS_LIST.map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              {/* Type d'hébergement / Catégorie */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                  Type d'hébergement & Campement
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'wild_bivouac', label: 'Bivouac Sauvage', icon: Tent },
                    { id: 'coastal_bivouac', label: 'Bivouac Côtier / Mer', icon: Waves },
                    { id: 'hiking_camp', label: 'Spot Rando Montagne', icon: Mountain },
                    { id: '4x4_expedition', label: 'Expédition 4x4 Désert', icon: Truck },
                    { id: 'organized_camp', label: 'Éco-Camping / Centre', icon: Trees }
                  ].map(({ id, label, icon: Icon }) => {
                    const active = filters.categories.includes(id as SpotCategory);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleCategory(id as SpotCategory)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          active
                            ? 'bg-amber-600/20 border-amber-500 text-stone-100 font-bold'
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activités sur place */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">
                  🎯 Activités & Expériences à faire sur place
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hiking', label: 'Randonnée & Trek', icon: '🥾' },
                    { id: 'swimming', label: 'Baignade & Snorkeling', icon: '🏊' },
                    { id: 'climbing', label: 'Escalade & Spéléo', icon: '🧗' },
                    { id: 'cycling', label: 'VTT & Cyclotourisme', icon: '🚴' },
                    { id: 'stargazing', label: 'Observation des Étoiles', icon: '🌌' },
                    { id: 'kayak_fishing', label: 'Kayak, Paddle & Pêche', icon: '🛶' },
                    { id: 'wildlife_watching', label: 'Observation Faune / Cerfs', icon: '🦌' },
                    { id: 'sandboarding', label: 'Glisse sur Dunes / Sable', icon: '🏂' },
                    { id: 'offroad_trail', label: 'Raid 4x4 / Franchissement', icon: '🚜' },
                    { id: 'photography', label: 'Photo & Paysages', icon: '📸' }
                  ].map(({ id, label, icon }) => {
                    const active = filters.activities.includes(id as ActivityType);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleActivity(id as ActivityType)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          active
                            ? 'bg-amber-500/20 border-amber-500 text-stone-100 font-bold'
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <span className="text-base shrink-0">{icon}</span>
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Access Types */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                  Type d'accès & Véhicule
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'foot', label: 'À pied / Rando', icon: Footprints, color: 'text-emerald-400' },
                    { id: 'car', label: 'Voiture classique', icon: Car, color: 'text-blue-400' },
                    { id: 'suv', label: 'SUV / Piste simple', icon: Truck, color: 'text-cyan-400' },
                    { id: '4x4', label: '4x4 Franchissement', icon: Truck, color: 'text-amber-400' },
                    { id: 'moto', label: 'Moto Trail / Quad', icon: Mountain, color: 'text-orange-400' }
                  ].map(({ id, label, icon: Icon, color }) => {
                    const active = filters.accessTypes.includes(id as AccessType);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleAccess(id as AccessType)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          active
                            ? 'bg-amber-600/20 border-amber-500 text-stone-100 font-bold'
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                  Niveau de difficulté du chemin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'easy', label: 'Facile (Tous véhicules)', color: 'border-emerald-500/50 text-emerald-400' },
                    { id: 'moderate', label: 'Modéré (Piste terre)', color: 'border-yellow-500/50 text-yellow-400' },
                    { id: 'hard', label: 'Difficile (Rocaille / 4x4)', color: 'border-orange-500/50 text-orange-400' },
                    { id: 'expert', label: 'Expert (Dunes / Désert)', color: 'border-red-500/50 text-red-400' }
                  ].map(({ id, label, color }) => {
                    const active = filters.difficulties.includes(id as DifficultyLevel);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleDifficulty(id as DifficultyLevel)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          active
                            ? `bg-stone-800 ${color} font-bold ring-1 ring-amber-400`
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities & Environment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                  Environnement & Commodités à proximité
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'potable_water', label: "Source d'eau potable", icon: Droplets, color: 'text-cyan-400' },
                    { id: 'dense_forest', label: 'Forêt & Ombrage', icon: Trees, color: 'text-emerald-400' },
                    { id: 'river_lake', label: 'Rivière / Lac / Cascade', icon: Waves, color: 'text-blue-400' },
                    { id: 'wild_beach', label: 'Plage sauvage / Mer', icon: Waves, color: 'text-sky-400' },
                    { id: 'hot_spring', label: 'Source thermale chaude', icon: Flame, color: 'text-amber-400' },
                    { id: 'van_friendly', label: 'Accès Van / Camping-car', icon: Car, color: 'text-emerald-400' },
                    { id: 'network_4g', label: 'Réseau 4G disponible', icon: Wifi, color: 'text-indigo-400' },
                    { id: 'ranger_station', label: 'Poste Garde Forestier', icon: ShieldCheck, color: 'text-green-400' }
                  ].map(({ id, label, icon: Icon, color }) => {
                    const active = filters.amenities.includes(id as Amenity);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleAmenity(id as Amenity)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          active
                            ? 'bg-amber-600/20 border-amber-500 text-stone-100 font-bold'
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="pt-4 mt-6 border-t border-stone-800 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-700 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-all text-center"
              >
                Réinitialiser
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-stone-950 shadow-lg shadow-amber-600/30 transition-all text-center"
              >
                Voir les résultats
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
