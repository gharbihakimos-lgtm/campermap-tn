import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const authRouter = Router();
export const JWT_SECRET = process.env.JWT_SECRET || 'campermap_tn_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé : Token manquant.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
  }
}

// Inscription (Register)
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, avatar, bio, primary_vehicle } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Veuillez renseigner un email, un mot de passe et un nom/pseudo.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'Un compte existe déjà avec cet email.' });
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, avatar, bio, primary_vehicle, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      name.trim(),
      avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio || 'Passionné d’aventure et de bivouac en Tunisie',
      primary_vehicle || 'car',
      now
    );

    const insertStats = db.prepare(`
      INSERT INTO user_stats (user_id, total_nights, total_steps, total_km, total_elevation, spots_explored, updated_at)
      VALUES (?, 0, 0, 0, 0, 0, ?)
    `);
    insertStats.run(userId, now);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bio: bio || 'Passionné d’aventure et de bivouac en Tunisie',
        primaryVehicle: primary_vehicle || 'car',
        createdAt: now,
        stats: {
          totalNights: 0,
          totalSteps: 0,
          totalKm: 0,
          totalElevation: 0,
          spotsExplored: 0
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
});

// Connexion (Login)
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez saisir votre email et votre mot de passe.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;
    if (!user) {
      return res.status(400).json({ error: 'Identifiants incorrects. Vérifiez votre email et mot de passe.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Identifiants incorrects. Vérifiez votre email et mot de passe.' });
    }

    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(user.id) as any;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        primaryVehicle: user.primary_vehicle,
        createdAt: user.created_at,
        stats: {
          totalNights: stats?.total_nights || 0,
          totalSteps: stats?.total_steps || 0,
          totalKm: stats?.total_km || 0,
          totalElevation: stats?.total_elevation || 0,
          spotsExplored: stats?.spots_explored || 0
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// Connexion / Inscription Google (OAuth)
authRouter.post('/google', async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email Google requis.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;
    const now = new Date().toISOString();

    if (!user) {
      const userId = `user_google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const randomPasswordHash = await bcrypt.hash(`google_${googleId || Date.now()}_secret`, 10);
      
      const insertUser = db.prepare(`
        INSERT INTO users (id, email, password_hash, name, avatar, bio, primary_vehicle, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertUser.run(
        userId,
        cleanEmail,
        randomPasswordHash,
        name ? name.trim() : cleanEmail.split('@')[0],
        avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        'Campeur et explorateur Google',
        'car',
        now
      );

      const insertStats = db.prepare(`
        INSERT INTO user_stats (user_id, total_nights, total_steps, total_km, total_elevation, spots_explored, updated_at)
        VALUES (?, 0, 0, 0, 0, 0, ?)
      `);
      insertStats.run(userId, now);

      user = {
        id: userId,
        email: cleanEmail,
        name: name ? name.trim() : cleanEmail.split('@')[0],
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bio: 'Campeur et explorateur Google',
        primary_vehicle: 'car',
        created_at: now
      };
    }

    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(user.id) as any;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        primaryVehicle: user.primary_vehicle,
        createdAt: user.created_at,
        stats: {
          totalNights: stats?.total_nights || 0,
          totalSteps: stats?.total_steps || 0,
          totalKm: stats?.total_km || 0,
          totalElevation: stats?.total_elevation || 0,
          spotsExplored: stats?.spots_explored || 0
        }
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ error: 'Erreur lors de la connexion Google.' });
  }
});

// Profil courant (Me)
authRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id, email, name, avatar, bio, primary_vehicle, created_at FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(user.id) as any;

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      primaryVehicle: user.primary_vehicle,
      createdAt: user.created_at,
      stats: {
        totalNights: stats?.total_nights || 0,
        totalSteps: stats?.total_steps || 0,
        totalKm: stats?.total_km || 0,
        totalElevation: stats?.total_elevation || 0,
        spotsExplored: stats?.spots_explored || 0
      }
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
  }
});
