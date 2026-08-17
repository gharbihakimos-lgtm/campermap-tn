export type AccessType = 'foot' | 'car' | 'suv' | '4x4' | 'moto';

export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'expert';

export type TrackType = 
  | 'asphalt'         // Route goudronnée
  | 'easy_dirt'       // Piste en terre damée
  | 'rocky_track'     // Piste caillouteuse / cassante
  | 'deep_sand'       // Sable mou / Dunes
  | 'hiking_trail'    // Sentier de randonnée pédestre
  | 'river_crossing'; // Franchissement d'oued / gué

export type Amenity = 
  | 'potable_water'     // Source d'eau potable
  | 'river_lake'        // Lac, rivière ou cascade
  | 'dense_forest'      // Forêt ombragée
  | 'wild_beach'        // Plage sauvage / mer
  | 'panoramic_view'    // Vue panoramique / montagne
  | 'desert_dunes'      // Dunes de sable / désert
  | 'firewood'          // Bois mort disponible pour feu
  | 'network_4g'        // Réseau 4G disponible
  | 'ranger_station'    // Poste garde forestier / Garde Nationale
  | 'trash_bins'        // Poubelles / propreté
  | 'shaded_area'       // Zone naturellement abritée du vent/soleil
  | 'hot_spring'        // Source thermale chaude
  | 'van_friendly';     // Accessible aux vans et camping-cars

export type ActivityType =
  | 'hiking'            // 🥾 Randonnée & Trekking
  | 'swimming'          // 🏊 Baignade & Criques / Snorkeling
  | 'climbing'          // 🧗 Escalade & Spéléologie
  | 'cycling'           // 🚴 VTT & Cyclotourisme
  | 'stargazing'        // 🌌 Ciel Étoilé & Astrophotographie
  | 'kayak_fishing'     // 🛶 Kayak, Paddle & Pêche
  | 'wildlife_watching' // 🦌 Observation Faune & Oiseaux migrateurs
  | 'photography'       // 📸 Photographie de Paysage
  | 'sandboarding'      // 🏂 Glisse sur Dunes
  | 'offroad_trail';    // 🚜 Raid 4x4 & Franchissement

export type SpotCategory = 
  | 'wild_bivouac'      // Bivouac sauvage pur
  | 'hiking_camp'       // Spot rando pédestre
  | '4x4_expedition'    // Spot expédition 4x4 / désert
  | 'organized_camp'    // Centre de camping aménagé / Éco-village
  | 'van_spot'          // Spot Vanlife & Camping-car
  | 'coastal_bivouac';  // Bivouac côtier

export interface SpotCoordinates {
  lat: number;
  lng: number;
}

export interface SpotReview {
  id: string;
  author: string;
  date: string;
  rating: number; // 1 to 5
  comment: string;
  vehicleUsed?: AccessType;
}

export interface ElevationPoint {
  distanceKm: number;
  altitudeMeters: number;
}

export interface CampingSpot {
  id: string;
  name: string;
  arabicName?: string;
  region: string;
  category: SpotCategory;
  coordinates: SpotCoordinates;
  accessTypes: AccessType[];
  primaryAccess: AccessType;
  difficulty: DifficultyLevel;
  trackType: TrackType;
  trackDescription: string;
  hikingDistanceKm?: number;
  hikingDurationMin?: number;
  elevationGainMeters?: number;
  elevationProfile?: ElevationPoint[];
  amenities: Amenity[];
  activities: ActivityType[]; // Activités à faire sur place
  networkCoverage: 'good' | 'weak' | 'none';
  photos: string[];
  description: string;
  safetyAdvice: string;
  bestSeason: string;
  rating: number;
  reviewsCount: number;
  reviews?: SpotReview[];
  gpxTrackAvailable?: boolean;
  author?: string;
  sourceRef?: string; // ex: "TunisiaCamp", "Wildly", "Wikiloc", "Park4Night", "AllTrails"
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  accessTypes: AccessType[];
  difficulties: DifficultyLevel[];
  amenities: Amenity[];
  activities: ActivityType[]; // Filtre par activités
  categories: SpotCategory[];
  region: string;
  networkOnly: boolean;
  waterOnly: boolean;
}
