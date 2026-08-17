import type { AccessType } from './spot';

export interface UserStats {
  totalNights: number;
  totalSteps: number;
  totalKm: number;
  totalElevation?: number;
  spotsExplored: number;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: string;
}

export interface UserLogEntry {
  id: string;
  spotId: string;
  spotName: string;
  spotRegion: string;
  checkInDate: string;
  nightsCount: number;
  kmHiked: number;
  stepsCount: number;
  notes?: string;
  weatherCondition?: string;
  rating?: number;
}

export interface CamperUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  primaryVehicle?: AccessType;
  createdAt: string;
  stats: UserStats;
}
