import React, { useState } from 'react';
import type { 
  CampingSpot, 
  AccessType, 
  DifficultyLevel, 
  TrackType, 
  Amenity, 
  ActivityType,
  SpotCategory, 
  SpotCoordinates 
} from '../../types/spot';

import { REGIONS_LIST } from '../../data/spotsData';
import { 
  X, 
  MapPin, 
  Footprints, 
  Car, 
  Truck, 
  Droplets, 
  Trees, 
  Waves, 
  Wifi, 
  Mountain, 
  Sun, 
  Flame, 
  ShieldCheck, 
  CheckCircle,
  Camera,
  Compass
} from 'lucide-react';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpot: (spot: CampingSpot) => void;
  onPickLocationOnMap: () => void;
  pickedCoordinates: SpotCoordinates | null;
  userLocation: SpotCoordinates | null;
}

export const AddSpotModal: React.FC<AddSpotModalProps> = ({
  isOpen,
  onClose,
  onAddSpot,
  onPickLocationOnMap,
  pickedCoordinates,
  userLocation
}) => {
  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [region, setRegion] = useState('Bizerte');
  const [category, setCategory] = useState<SpotCategory>('wild_bivouac');
  const [lat, setLat] = useState(pickedCoordinates?.lat?.toFixed(5) || '36.8000');
  const [lng, setLng] = useState(pickedCoordinates?.lng?.toFixed(5) || '9.8000');
  const [accessTypes, setAccessTypes] = useState<AccessType[]>(['car', 'suv']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('moderate');
  const [trackType, setTrackType] = useState<TrackType>('easy_dirt');
  const [trackDescription, setTrackDescription] = useState('');
  const [amenities, setAmenities] = useState<Amenity[]>(['potable_water', 'dense_forest', 'network_4g']);
  const [activities, setActivities] = useState<ActivityType[]>(['hiking', 'stargazing', 'photography']);
  const [networkCoverage] = useState<'good' | 'weak' | 'none'>('weak');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');
  const [safetyAdvice, setSafetyAdvice] = useState('');
  const [bestSeason] = useState('Printemps & Automne');
  const [author, setAuthor] = useState('');

  // Update lat/lng when pickedCoordinates changes
  React.useEffect(() => {
    if (pickedCoordinates) {
      setLat(pickedCoordinates.lat.toFixed(5));
      setLng(pickedCoordinates.lng.toFixed(5));
    }
  }, [pickedCoordinates]);

  if (!isOpen) return null;

  const toggleAccess = (type: AccessType) => {
    setAccessTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (item: Amenity) => {
    setAmenities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const toggleActivity = (item: ActivityType) => {
    setActivities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleUseMyLocation = () => {
    if (userLocation) {
      setLat(userLocation.lat.toFixed(5));
      setLng(userLocation.lng.toFixed(5));
    } else {
      alert("Veuillez d'abord autoriser la géolocalisation sur votre navigateur.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSpot: CampingSpot = {
      id: `spot-${Date.now()}`,
      name: name.trim(),
      arabicName: arabicName.trim() || undefined,
      region,
      category,
      coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      accessTypes: accessTypes.length > 0 ? accessTypes : ['foot'],
      primaryAccess: accessTypes[0] || 'foot',
      difficulty,
      trackType,
      trackDescription: trackDescription.trim() || 'Piste praticable selon les conditions météorologiques.',
      amenities,
      activities: activities.length > 0 ? activities : ['hiking', 'photography'],
      networkCoverage,
      photos: [photoUrl || 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80'],
      description: description.trim() || 'Superbe spot de bivouac sauvage découvert par la communauté.',
      safetyAdvice: safetyAdvice.trim() || 'Respecter le principe Sans Trace et avertir les autorités locales si nécessaire.',
      bestSeason,
      rating: 5.0,
      reviewsCount: 1,
      author: author.trim() || 'Explorateur Anonyme',
      sourceRef: 'Communauté CamperMap',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddSpot(newSpot);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-2xl max-h-[90vh] overflow-y-auto z-50 flex flex-col shadow-2xl text-stone-100 p-5 md:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">
                Proposer un nouveau Spot de Camping / Bivouac
              </h2>
              <p className="text-xs text-stone-400">
                Partagez un lieu magique avec la communauté des campeurs en Tunisie
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
          
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nom du Spot *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Crique secrète Cap Serrat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nom en Arabe (Optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex: كاب سيراط"
                value={arabicName}
                onChange={(e) => setArabicName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 text-right"
              />
            </div>
          </div>

          {/* Region & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Région / Gouvernorat
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {REGIONS_LIST.filter(r => r !== 'Toutes les régions').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Type de Bivouac
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SpotCategory)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="wild_bivouac">🏕️ Bivouac Sauvage</option>
                <option value="coastal_bivouac">🌊 Bivouac Côtier / Mer</option>
                <option value="hiking_camp">🥾 Randonnée & Forêt</option>
                <option value="4x4_expedition">🚙 Expédition 4x4 / Désert</option>
              </select>
            </div>
          </div>

          {/* Coordinates Picker Section */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Coordonnées GPS du Spot
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-semibold text-sky-300 border border-stone-700 transition-all"
                >
                  Ma position GPS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPickLocationOnMap();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-bold text-amber-300 border border-amber-500/40 transition-all"
                >
                  📍 Pointer sur la carte
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-stone-400">Latitude (ex: 37.2341)</span>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400">Longitude (ex: 9.2156)</span>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Access & Track nature */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-300">
              Moyens de transport possibles
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'foot', label: 'À pied / Rando', icon: Footprints },
                { id: 'car', label: 'Voiture classique', icon: Car },
                { id: 'suv', label: 'SUV', icon: Truck },
                { id: '4x4', label: '4x4 Franchissement', icon: Truck },
                { id: 'moto', label: 'Moto Trail', icon: Mountain }
              ].map(({ id, label, icon: Icon }) => {
                const active = accessTypes.includes(id as AccessType);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggleAccess(id as AccessType)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      active
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Road nature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Niveau de difficulté
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
              >
                <option value="easy">Facile (Route / piste plate)</option>
                <option value="moderate">Modéré (Piste terre / marche)</option>
                <option value="hard">Difficile (Rocaille / 4x4 / Dénivelé)</option>
                <option value="expert">Expert (Dunes / Désert profond)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nature principale du chemin
              </label>
              <select
                value={trackType}
                onChange={(e) => setTrackType(e.target.value as TrackType)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
              >
                <option value="asphalt">Route asphaltée</option>
                <option value="easy_dirt">Piste en terre damée</option>
                <option value="rocky_track">Piste caillouteuse / cassante</option>
                <option value="deep_sand">Sable mou / Dunes</option>
                <option value="hiking_trail">Sentier pédestre balisé</option>
                <option value="river_crossing">Passage d'oued / gué</option>
              </select>
            </div>
          </div>

          {/* Track Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Description de l'accès et de la piste *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Ex: Route goudronnée puis 3 km de piste pierreuse. Garde au sol surélevée conseillée, attention après la pluie..."
              value={trackDescription}
              onChange={(e) => setTrackDescription(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Amenities & Nearby Resources */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-300">
              Commodités & Points d'intérêt à proximité
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'potable_water', label: "Source d'eau", icon: Droplets },
                { id: 'dense_forest', label: 'Forêt / Ombre', icon: Trees },
                { id: 'river_lake', label: 'Lac / Rivière', icon: Waves },
                { id: 'wild_beach', label: 'Plage sauvage', icon: Waves },
                { id: 'panoramic_view', label: 'Vue panoramique', icon: Mountain },
                { id: 'desert_dunes', label: 'Dunes sable', icon: Sun },
                { id: 'network_4g', label: 'Réseau 4G', icon: Wifi },
                { id: 'firewood', label: 'Bois mort', icon: Flame },
                { id: 'ranger_station', label: 'Garde forestier', icon: ShieldCheck }
              ].map(({ id, label, icon: Icon }) => {
                const active = amenities.includes(id as Amenity);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggleAmenity(id as Amenity)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all text-left ${
                      active
                        ? 'bg-amber-600/20 border-amber-500 text-stone-100 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activities on site */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-300">
              🎯 Activités possibles sur ce spot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'hiking', label: 'Randonnée', icon: '🥾' },
                { id: 'swimming', label: 'Baignade', icon: '🏊' },
                { id: 'climbing', label: 'Escalade', icon: '🧗' },
                { id: 'cycling', label: 'VTT & Vélo', icon: '🚴' },
                { id: 'stargazing', label: 'Étoiles', icon: '🌌' },
                { id: 'kayak_fishing', label: 'Kayak / Pêche', icon: '🛶' },
                { id: 'wildlife_watching', label: 'Faune & Oiseaux', icon: '🦌' },
                { id: 'sandboarding', label: 'Dunes & Glisse', icon: '🏂' },
                { id: 'offroad_trail', label: 'Raid 4x4', icon: '🚜' }
              ].map(({ id, label, icon }) => {
                const active = activities.includes(id as ActivityType);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggleActivity(id as ActivityType)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all text-left ${
                      active
                        ? 'bg-amber-500/20 border-amber-500 text-stone-100 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span>{icon}</span>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                Lien Photo (URL)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Votre Pseudo / Club
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Randonneur du Nord"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
              />
            </div>
          </div>

          {/* General Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Description globale du lieu
            </label>
            <textarea
              rows={2}
              placeholder="Pourquoi ce spot est exceptionnel ? Ambiance, coucher de soleil, conseils de campement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Safety Advice */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Conseils de sécurité & Garde Nationale
            </label>
            <input
              type="text"
              placeholder="Ex: Signaler son passage au poste de la Garde Nationale, vent violent la nuit..."
              value={safetyAdvice}
              onChange={(e) => setSafetyAdvice(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-700 text-xs font-semibold text-stone-300 hover:bg-stone-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Ajouter et publier ce spot
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
