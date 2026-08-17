import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/user.js';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Healthcheck endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CamperMapTN API', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Synchronize custom spots endpoint
app.get('/api/spots', (_req, res) => {
  try {
    const rows = db.prepare('SELECT data_json FROM custom_spots ORDER BY created_at DESC').all() as { data_json: string }[];
    const spots = rows.map(r => JSON.parse(r.data_json));
    res.json(spots);
  } catch (error) {
    console.error('Spots fetch error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des spots.' });
  }
});

app.post('/api/spots', (req, res) => {
  try {
    const spot = req.body;
    if (!spot || !spot.id || !spot.name) {
      return res.status(400).json({ error: 'Données de spot invalides.' });
    }
    const insert = db.prepare('INSERT OR REPLACE INTO custom_spots (id, user_id, data_json, created_at) VALUES (?, ?, ?, ?)');
    insert.run(spot.id, spot.authorId || null, JSON.stringify(spot), new Date().toISOString());
    res.status(201).json({ success: true, spot });
  } catch (error) {
    console.error('Spot save error:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du spot.' });
  }
});

// Serve frontend static build in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}



app.listen(PORT, () => {
  console.log(`🏕️ CamperMap TN Backend API listening on port ${PORT}`);
});
