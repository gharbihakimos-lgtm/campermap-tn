import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Compass, Truck, Footprints, Mountain, AlertCircle, Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, loginWithGoogle } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [primaryVehicle, setPrimaryVehicle] = useState('4x4');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        await login({ email, password });
      } else {
        await register({
          email,
          password,
          name,
          primary_vehicle: primaryVehicle
        });
      }
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      // Prompt quick simulated Google Account login popup or instant auth
      const userGoogleEmail = email || 'campeur.tunisie@gmail.com';
      const userGoogleName = name || (isLoginMode ? 'Hakim Campeur' : 'Explorateur Sahara');
      await loginWithGoogle({
        email: userGoogleEmail,
        name: userGoogleName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        googleId: `goog_${Date.now()}`
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion avec Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 z-50 text-stone-100 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-stone-950 font-bold shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">
                {isLoginMode ? 'Connexion Campeur' : 'Créer un Compte Campeur'}
              </h2>
              <p className="text-xs text-stone-400">
                {isLoginMode ? 'Retrouvez votre carnet et vos statistiques' : 'Sauvegardez vos nuits, pas et km en Tunisie'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 bg-red-950/80 border border-red-800/80 p-3 rounded-xl text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-stone-500 rounded-xl text-xs font-bold text-stone-100 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-98 mb-4"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>
            {isLoginMode ? 'Continuer avec Google' : "S'inscrire avec Google"}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-stone-800" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            ou avec email
          </span>
          <div className="flex-1 h-px bg-stone-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {!isLoginMode && (
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Nom / Pseudo d'Aventurier *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Tarek Bivouac"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-300 mb-1">Adresse Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-300 mb-1">Mot de passe *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">Moyen d'exploration préféré</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: '4x4', label: '4x4 / Piste', icon: Truck },
                  { id: 'foot', label: 'Rando / À pied', icon: Footprints },
                  { id: 'moto', label: 'Moto Trail', icon: Mountain }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setPrimaryVehicle(id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      primaryVehicle === id
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-0.5" />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLoginMode ? (
              'Se connecter'
            ) : (
              'Créer mon compte de campeur'
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center text-xs text-stone-400">
          {isLoginMode ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(false);
                  setError(null);
                }}
                className="font-bold text-amber-400 hover:underline"
              >
                Inscrivez-vous ici
              </button>
            </p>
          ) : (
            <p>
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(true);
                  setError(null);
                }}
                className="font-bold text-amber-400 hover:underline"
              >
                Connectez-vous
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
