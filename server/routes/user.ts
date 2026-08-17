import { Router, Response } from 'express';
import { db } from '../db.js';
import { authMiddleware, AuthRequest } from './auth.js';

export const userRouter = Router();

// Get User Stats & Calculated Badges
userRouter.get('/stats', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(req.userId) as any;
    const logs = db.prepare('SELECT * FROM user_logs WHERE user_id = ? ORDER BY check_in_date DESC').all(req.userId) as any[];

    const totalNights = stats?.total_nights || 0;
    const totalSteps = stats?.total_steps || 0;
    const totalKm = stats?.total_km || 0;
    const totalElevation = stats?.total_elevation || 0;
    const spotsExplored = stats?.spots_explored || 0;

    // Badges calculation
    const badges = [
      {
        id: 'first_bivouac',
        name: 'Premier Bivouac',
        description: 'Avoir passé au moins 1 nuit sous tente en Tunisie',
        icon: '⛺',
        unlocked: totalNights >= 1,
        progress: `${Math.min(totalNights, 1)}/1`
      },
      {
        id: 'nomade_5_nights',
        name: 'Nomade des Mogods',
        description: 'Avoir passé 5 nuits en camping sauvage',
        icon: '🐺',
        unlocked: totalNights >= 5,
        progress: `${Math.min(totalNights, 5)}/5`
      },
      {
        id: 'hiker_50k_steps',
        name: 'Randonneur Infatigable',
        description: 'Avoir marché 50 000 pas en pleine nature',
        icon: '🥾',
        unlocked: totalSteps >= 50000,
        progress: `${Math.min(totalSteps, 50000)}/50000`
      },
      {
        id: 'desert_explorer',
        name: 'Maître du Sahara',
        description: 'Avoir exploré le Grand Erg ou Ksar Ghilane / Tembaine',
        icon: '🏜️',
        unlocked: logs.some(l => l.spot_region === 'Tataouine' || l.spot_region === 'Kebili' || l.spot_region === 'Tozeur'),
        progress: logs.some(l => l.spot_region === 'Tataouine' || l.spot_region === 'Kebili' || l.spot_region === 'Tozeur') ? '1/1' : '0/1'
      },
      {
        id: 'century_km',
        name: 'Centenaire des Pistes',
        description: 'Avoir parcouru plus de 100 km d’itinéraires outdoor',
        icon: '🧭',
        unlocked: totalKm >= 100,
        progress: `${Math.min(Math.round(totalKm), 100)}/100 km`
      },
      {
        id: 'coastal_king',
        name: 'Gardien des Côtes Sauvages',
        description: 'Avoir campé sur au moins 3 spots marins (Cap Serrat, Aïn Damous, Haouaria, Zouaraa...)',
        icon: '🌊',
        unlocked: spotsExplored >= 3,
        progress: `${Math.min(spotsExplored, 3)}/3 spots`
      }
    ];

    return res.json({
      stats: {
        totalNights,
        totalSteps,
        totalKm,
        totalElevation,
        spotsExplored
      },
      badges
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
  }
});

// Get User Logbook Entries
userRouter.get('/logs', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const logs = db.prepare('SELECT * FROM user_logs WHERE user_id = ? ORDER BY check_in_date DESC').all(req.userId);
    return res.json(logs);
  } catch (error) {
    console.error('Logs fetch error:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du carnet de bord.' });
  }
});

// Add a New Logbook Entry (Auto increments stats)
userRouter.post('/logs', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {
      spotId,
      spotName,
      spotRegion,
      checkInDate,
      nightsCount,
      kmHiked,
      stepsCount,
      notes,
      weatherCondition,
      rating
    } = req.body;

    if (!spotName || !checkInDate) {
      return res.status(400).json({ error: 'Veuillez renseigner le nom du spot et la date.' });
    }

    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const nights = parseInt(nightsCount) || 1;
    const km = parseFloat(kmHiked) || 0;
    const steps = parseInt(stepsCount) || 0;

    const insertLog = db.prepare(`
      INSERT INTO user_logs (
        id, user_id, spot_id, spot_name, spot_region, check_in_date,
        nights_count, km_hiked, steps_count, notes, weather_condition, rating, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLog.run(
      logId,
      req.userId,
      spotId || 'custom_spot',
      spotName,
      spotRegion || 'Tunisie',
      checkInDate,
      nights,
      km,
      steps,
      notes || '',
      weatherCondition || '☀️ Beau temps',
      rating || 5,
      now
    );

    // Update User Stats
    const updateStats = db.prepare(`
      UPDATE user_stats
      SET 
        total_nights = total_nights + ?,
        total_steps = total_steps + ?,
        total_km = total_km + ?,
        spots_explored = spots_explored + 1,
        updated_at = ?
      WHERE user_id = ?
    `);

    updateStats.run(nights, steps, km, now, req.userId);

    const updatedStats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(req.userId) as any;

    return res.status(201).json({
      success: true,
      log: {
        id: logId,
        spotId,
        spotName,
        spotRegion,
        checkInDate,
        nightsCount: nights,
        kmHiked: km,
        stepsCount: steps,
        notes,
        weatherCondition,
        rating
      },
      stats: {
        totalNights: updatedStats?.total_nights || 0,
        totalSteps: updatedStats?.total_steps || 0,
        totalKm: updatedStats?.total_km || 0,
        spotsExplored: updatedStats?.spots_explored || 0
      }
    });
  } catch (error) {
    console.error('Log creation error:', error);
    return res.status(500).json({ error: 'Erreur lors de l’enregistrement de votre bivouac.' });
  }
});

// Get User Favorites
userRouter.get('/favorites', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const rows = db.prepare('SELECT spot_id FROM user_favorites WHERE user_id = ?').all(req.userId) as { spot_id: string }[];
    return res.json(rows.map(r => r.spot_id));
  } catch (error) {
    console.error('Favorites fetch error:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des favoris.' });
  }
});

// Toggle / Add Favorite
userRouter.post('/favorites/:spotId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { spotId } = req.params;
    const existing = db.prepare('SELECT * FROM user_favorites WHERE user_id = ? AND spot_id = ?').get(req.userId, spotId);

    if (existing) {
      db.prepare('DELETE FROM user_favorites WHERE user_id = ? AND spot_id = ?').run(req.userId, spotId);
      return res.json({ favorited: false, spotId });
    } else {
      db.prepare('INSERT INTO user_favorites (user_id, spot_id, created_at) VALUES (?, ?, ?)').run(req.userId, spotId, new Date().toISOString());
      return res.json({ favorited: true, spotId });
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour des favoris.' });
  }
});
