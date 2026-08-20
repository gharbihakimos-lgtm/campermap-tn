import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Moon, 
  Footprints, 
  Compass, 
  MapPin, 
  Award, 
  Plus, 
  LogOut, 
  Calendar, 
  BookOpen,
  CheckCircle2,
  Lock
} from 'lucide-react';


export const CamperProfileDrawer: React.FC = () => {
  const { 
    user, 
    isProfileOpen, 
    setIsProfileOpen, 
    stats, 
    badges, 
    logs, 
    logout, 
    setIsAddLogModalOpen 
  } = useAuth();

  if (!isProfileOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsProfileOpen(false)}
      />

      {/* Drawer Box */}
      <div className="relative w-full max-w-lg bg-stone-900 border-l border-stone-800 h-full overflow-y-auto z-50 flex flex-col shadow-2xl text-stone-100 p-5 md:p-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Profil Campeur Actif
            </span>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md shrink-0">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} 
                alt={user.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-100">{user.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  {user.primaryVehicle === '4x4' ? '🚜 4x4 Rando' : user.primaryVehicle === 'foot' ? '🥾 Sac à dos' : '🚗 Campeur'}
                </span>
              </div>
              <p className="text-xs text-stone-400">{user.email}</p>
              <p className="text-[11px] text-stone-400 mt-1 italic line-clamp-1">{user.bio}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 hover:border-red-900 transition-all shrink-0"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Live Activity Counters Grid */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Tableau de Bord & Statistiques d'Aventure
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">Tunisie 🇹🇳</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Nights */}
            <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1">
                <Moon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-indigo-400">{stats.totalNights}</div>
              <div className="text-[10px] uppercase font-bold text-stone-400 mt-0.5">Nuits Camping</div>
            </div>

            {/* Steps */}
            <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
                <Footprints className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {stats.totalSteps >= 1000 ? `${(stats.totalSteps / 1000).toFixed(1)}k` : stats.totalSteps}
              </div>
              <div className="text-[10px] uppercase font-bold text-stone-400 mt-0.5">Pas Marchés</div>
            </div>

            {/* Kilometers */}
            <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-amber-400">{Math.round(stats.totalKm)}</div>
              <div className="text-[10px] uppercase font-bold text-stone-400 mt-0.5">Km Parcourus</div>
            </div>

            {/* Spots Explored */}
            <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-cyan-400">{stats.spotsExplored}</div>
              <div className="text-[10px] uppercase font-bold text-stone-400 mt-0.5">Spots Visités</div>
            </div>
          </div>
        </div>

        {/* Action Button to Add Log */}
        <button
          onClick={() => setIsAddLogModalOpen(true)}
          className="w-full py-3 mb-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Enregistrer un Bivouac / Nuit passée</span>
        </button>

        {/* Badges & Achievements Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Trophées & Badges Débloqués</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  badge.unlocked
                    ? 'bg-amber-950/40 border-amber-800/80 text-stone-100'
                    : 'bg-stone-950/40 border-stone-800/60 opacity-60 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{badge.icon}</span>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
                <div className="font-bold text-xs text-stone-100 line-clamp-1">{badge.name}</div>
                <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">{badge.description}</p>
                {badge.progress && (
                  <div className="mt-1.5 text-[9px] font-mono text-amber-400/90 font-semibold">
                    Progression : {badge.progress}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Personal Logbook Section */}
        <div className="space-y-3 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Carnet de Bivouac Personnel ({logs.length})</span>
          </h3>

          {logs.length === 0 ? (
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center">
              <p className="text-xs text-stone-400 mb-2">Aucun bivouac enregistré pour l'instant.</p>
              <button
                onClick={() => setIsAddLogModalOpen(true)}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                Cliquez ici pour enregistrer votre première sortie !
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div key={log.id} className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="font-bold text-stone-100 text-sm">{log.spotName}</div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {log.checkInDate}
                        </span>
                        <span>• 📍 {log.spotRegion}</span>
                      </div>
                    </div>
                    <div className="text-amber-400 font-bold text-xs">
                      {'★'.repeat(log.rating || 5)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 my-1.5 border-y border-stone-900 text-[11px]">
                    <span className="text-indigo-300 font-semibold">⛺ {log.nightsCount} nuit(s)</span>
                    <span className="text-emerald-300 font-semibold">🥾 {log.stepsCount.toLocaleString()} pas</span>
                    <span className="text-amber-300 font-semibold">🧭 {log.kmHiked} km</span>
                  </div>

                  {log.notes && (
                    <p className="text-stone-300 text-[11px] italic mt-1 bg-stone-900/60 p-2 rounded-lg">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
