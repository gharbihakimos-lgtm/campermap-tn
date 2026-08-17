import type { SpotCoordinates } from '../types/spot';

export interface WeatherData {
  current: {
    temp: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    conditionText: string;
    conditionEmoji: string;
    isDay: boolean;
    humidity?: number;
    windWarning?: string | null;
  };
  daily: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    conditionEmoji: string;
    rainProb: number;
    maxWind: number;
  }>;
  lastUpdated: string;
}

const WMO_CODES: Record<number, { text: string; emoji: string }> = {
  0: { text: 'Ciel dégagé', emoji: '☀️' },
  1: { text: 'Principalement dégagé', emoji: '🌤️' },
  2: { text: 'Partiellement nuageux', emoji: '⛅' },
  3: { text: 'Couvert', emoji: '☁️' },
  45: { text: 'Brouillard / Brume', emoji: '🌫️' },
  48: { text: 'Brouillard givrant', emoji: '🌫️' },
  51: { text: 'Bruine légère', emoji: '🌦️' },
  53: { text: 'Bruine modérée', emoji: '🌧️' },
  55: { text: 'Bruine dense', emoji: '🌧️' },
  61: { text: 'Pluie faible', emoji: '🌦️' },
  63: { text: 'Pluie modérée', emoji: '🌧️' },
  65: { text: 'Pluie forte', emoji: '🌧️' },
  71: { text: 'Chute de neige légère', emoji: '🌨️' },
  73: { text: 'Chute de neige', emoji: '❄️' },
  80: { text: 'Averses légères', emoji: '🌦️' },
  81: { text: 'Averses modérées', emoji: '🌧️' },
  82: { text: 'Violentes averses', emoji: '⛈️' },
  95: { text: 'Orage', emoji: '⚡' },
  96: { text: 'Orage avec grêle', emoji: '⛈️' }
};

export async function fetchSpotWeather(coords: SpotCoordinates): Promise<WeatherData | null> {
  const cacheKey = `weather_${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}`;
  
  // Try fetching live data from Open-Meteo
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API fetch failed');
    
    const data = await response.json();

    const currentCode = data.current.weather_code;
    const currentCondition = WMO_CODES[currentCode] || { text: 'Variable', emoji: '⛅' };
    const windSpeed = Math.round(data.current.wind_speed_10m);

    let windWarning: string | null = null;
    if (windSpeed > 45) {
      windWarning = '⚠️ Rafales violentes > 45 km/h : bivouac déconseillé sur les crêtes rocheuses et falaises.';
    } else if (windSpeed > 25) {
      windWarning = '💨 Vent modéré : bien ancrer les haubans de la tente avec des piquets renforcés.';
    }

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const dailyForecast = (data.daily.time as string[]).slice(0, 4).map((timeStr, index) => {
      const dateObj = new Date(timeStr);
      const code = data.daily.weather_code[index];
      const cond = WMO_CODES[code] || { text: 'Variable', emoji: '⛅' };

      return {
        date: timeStr,
        dayName: index === 0 ? "Aujourd'hui" : dayNames[dateObj.getDay()],
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        weatherCode: code,
        conditionEmoji: cond.emoji,
        rainProb: data.daily.precipitation_probability_max[index] || 0,
        maxWind: Math.round(data.daily.wind_speed_10m_max[index] || 0)
      };
    });

    const weatherResult: WeatherData = {
      current: {
        temp: Math.round(data.current.temperature_2m),
        windSpeed,
        windDirection: data.current.wind_direction_10m,
        weatherCode: currentCode,
        conditionText: currentCondition.text,
        conditionEmoji: currentCondition.emoji,
        isDay: data.current.is_day === 1,
        humidity: data.current.relative_humidity_2m,
        windWarning
      },
      daily: dailyForecast,
      lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    // Cache in localStorage for offline availability
    localStorage.setItem(cacheKey, JSON.stringify(weatherResult));
    return weatherResult;
  } catch (error) {
    console.warn('Could not fetch live weather, checking cache...', error);
    
    // Check cached offline data
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Error parsing cached weather', e);
      }
    }

    // Default fallback estimation based on Tunisian climate
    return {
      current: {
        temp: 22,
        windSpeed: 15,
        windDirection: 180,
        weatherCode: 0,
        conditionText: 'Ensoleillé / Climat doux',
        conditionEmoji: '☀️',
        isDay: true,
        humidity: 55,
        windWarning: null
      },
      daily: [
        { date: 'J+0', dayName: "Aujourd'hui", maxTemp: 24, minTemp: 14, weatherCode: 0, conditionEmoji: '☀️', rainProb: 5, maxWind: 18 },
        { date: 'J+1', dayName: 'Demain', maxTemp: 25, minTemp: 15, weatherCode: 1, conditionEmoji: '🌤️', rainProb: 10, maxWind: 20 },
        { date: 'J+2', dayName: 'Après-demain', maxTemp: 23, minTemp: 13, weatherCode: 2, conditionEmoji: '⛅', rainProb: 15, maxWind: 15 }
      ],
      lastUpdated: 'Mode Hors-ligne (estimé)'
    };
  }
}
