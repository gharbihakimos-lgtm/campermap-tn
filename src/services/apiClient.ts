import type { CamperUser, UserStats, UserBadge, UserLogEntry } from '../types/user';
import type { CampingSpot } from '../types/spot';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = localStorage.getItem('campermap_auth_token');

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('campermap_auth_token', token);
    } else {
      localStorage.removeItem('campermap_auth_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Erreur requête ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.warn(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth
  public async register(payload: { email: string; password: string; name: string; avatar?: string; bio?: string; primary_vehicle?: string }) {
    const res = await this.request<{ token: string; user: CamperUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setToken(res.token);
    localStorage.setItem('campermap_user_data', JSON.stringify(res.user));
    return res;
  }

  public async login(payload: { email: string; password: string }) {
    const res = await this.request<{ token: string; user: CamperUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setToken(res.token);
    localStorage.setItem('campermap_user_data', JSON.stringify(res.user));
    return res;
  }

  public async loginWithGoogle(payload: { email: string; name?: string; avatar?: string; googleId?: string }) {
    try {
      const res = await this.request<{ token: string; user: CamperUser }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      this.setToken(res.token);
      localStorage.setItem('campermap_user_data', JSON.stringify(res.user));
      return res;
    } catch {
      // Offline fallback mock user
      const mockUser: CamperUser = {
        id: `user_google_${Date.now()}`,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bio: 'Campeur connecté avec Google',
        primaryVehicle: 'car',
        createdAt: new Date().toISOString(),
        stats: {
          totalNights: 0,
          totalSteps: 0,
          totalKm: 0,
          totalElevation: 0,
          spotsExplored: 0
        }
      };
      this.setToken('mock_google_token');
      localStorage.setItem('campermap_user_data', JSON.stringify(mockUser));
      return { token: 'mock_google_token', user: mockUser };
    }
  }


  public async getMe(): Promise<CamperUser | null> {
    if (!this.token) return null;
    try {
      const user = await this.request<CamperUser>('/auth/me');
      localStorage.setItem('campermap_user_data', JSON.stringify(user));
      return user;
    } catch {
      // Fallback local storage
      const saved = localStorage.getItem('campermap_user_data');
      return saved ? JSON.parse(saved) : null;
    }
  }

  public logout() {
    this.setToken(null);
    localStorage.removeItem('campermap_user_data');
  }

  // Stats & Badges
  public async getStats(): Promise<{ stats: UserStats; badges: UserBadge[] }> {
    try {
      return await this.request<{ stats: UserStats; badges: UserBadge[] }>('/user/stats');
    } catch {
      // Fallback default
      return {
        stats: { totalNights: 0, totalSteps: 0, totalKm: 0, spotsExplored: 0 },
        badges: []
      };
    }
  }

  // Logs
  public async getLogs(): Promise<UserLogEntry[]> {
    try {
      return await this.request<UserLogEntry[]>('/user/logs');
    } catch {
      const offline = localStorage.getItem('campermap_offline_logs');
      return offline ? JSON.parse(offline) : [];
    }
  }

  public async addLogEntry(payload: {
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
  }) {
    try {
      return await this.request<{ success: boolean; log: UserLogEntry; stats: UserStats }>('/user/logs', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch {
      // Save offline
      const offline = localStorage.getItem('campermap_offline_logs');
      const list: UserLogEntry[] = offline ? JSON.parse(offline) : [];
      const newEntry: UserLogEntry = {
        id: `offline_log_${Date.now()}`,
        ...payload
      };
      list.unshift(newEntry);
      localStorage.setItem('campermap_offline_logs', JSON.stringify(list));
      return { success: true, log: newEntry, stats: { totalNights: payload.nightsCount, totalSteps: payload.stepsCount, totalKm: payload.kmHiked, spotsExplored: 1 } };
    }
  }

  // Sync custom spots
  public async saveSpot(spot: CampingSpot) {
    try {
      return await this.request('/spots', {
        method: 'POST',
        body: JSON.stringify(spot)
      });
    } catch (e) {
      console.warn('Saved spot locally (offline mode)', e);
    }
  }
}

export const api = new ApiClient();
