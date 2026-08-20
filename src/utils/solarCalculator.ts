/**
 * Calculateur solaire haute précision pour le bivouac en Tunisie
 * Calcule l'aube, le lever de soleil, la Golden Hour et le coucher de soleil
 */

export interface SolarTimes {
  sunrise: string;
  sunset: string;
  goldenHour: string;
  dawn: string;
  dayLength: string;
}

export function calculateSolarTimes(lat: number, lng: number, date: Date = new Date()): SolarTimes {
  // Jour de l'année
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Déclinaison solaire
  const rad = Math.PI / 180;
  const declination = 23.45 * Math.sin(rad * ((360 / 365) * (dayOfYear - 81)));

  // Équation du temps (en minutes)
  const b = (360 / 365) * (dayOfYear - 81) * rad;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Midi solaire local (en heures UTC)
  const timeZoneOffset = -date.getTimezoneOffset() / 60; // Tunisie = UTC+1
  const solarNoonUTC = 12 - (lng / 15) - (eot / 60);
  const solarNoonLocal = solarNoonUTC + timeZoneOffset;

  // Angle horaire pour le lever/coucher (horizon standard -0.833°)
  const phi = lat * rad;
  const delta = declination * rad;
  const cosHourAngle = (Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));

  // Clamping pour éviter NaN aux pôles
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngleHours = (Math.acos(clampedCos) / rad) / 15;

  const sunriseHours = solarNoonLocal - hourAngleHours;
  const sunsetHours = solarNoonLocal + hourAngleHours;
  const dawnHours = sunriseHours - 0.5; // Aube civile ~30 min avant
  const goldenHourHours = sunsetHours - 0.75; // Golden hour ~45 min avant coucher

  const formatHours = (val: number): string => {
    let h = Math.floor(val);
    let m = Math.round((val - h) * 60);
    if (m === 60) {
      h += 1;
      m = 0;
    }
    if (h < 0) h += 24;
    if (h >= 24) h -= 24;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const dayLengthHours = (sunsetHours - sunriseHours);
  const dayLengthH = Math.floor(dayLengthHours);
  const dayLengthM = Math.round((dayLengthHours - dayLengthH) * 60);

  return {
    sunrise: formatHours(sunriseHours),
    sunset: formatHours(sunsetHours),
    goldenHour: formatHours(goldenHourHours),
    dawn: formatHours(dawnHours),
    dayLength: `${dayLengthH}h ${dayLengthM}m`
  };
}
