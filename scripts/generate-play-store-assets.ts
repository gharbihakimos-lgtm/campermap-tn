import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUTPUT_DIR = path.resolve('playstore-assets');
const RES_DIR = path.resolve('android/app/src/main/res');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
const screenshotsDir = path.join(OUTPUT_DIR, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 1. High-Resolution 512x512 App Icon SVG (Mountains, Tent, Campfire, Sunset Glow — No cross shapes)
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="60%" stop-color="#0c0a09" />
      <stop offset="100%" stop-color="#050505" />
    </linearGradient>

    <!-- Sunset Sun / Sky Glow Gradient -->
    <radialGradient id="sunGrad" cx="256" cy="210" r="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="45%" stop-color="#f59e0b" />
      <stop offset="75%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#d97706" stop-opacity="0" />
    </radialGradient>

    <!-- Mountain Peak Back Gradient -->
    <linearGradient id="mountBackGrad" x1="200" y1="120" x2="380" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#44403c" />
      <stop offset="100%" stop-color="#1c1917" />
    </linearGradient>

    <!-- Mountain Peak Front Gradient -->
    <linearGradient id="mountFrontGrad" x1="100" y1="150" x2="300" y2="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#292524" />
      <stop offset="100%" stop-color="#0c0a09" />
    </linearGradient>

    <!-- Tent Orange Glowing Gradient -->
    <linearGradient id="tentGrad" x1="256" y1="230" x2="256" y2="370" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <!-- Border Ring Gradient -->
    <linearGradient id="borderGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>

    <!-- Shadow -->
    <filter id="mainShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background rounded squircle (App Icon Container) -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />
  <rect x="6" y="6" width="500" height="500" rx="110" stroke="url(#borderGrad)" stroke-width="4" stroke-opacity="0.4" fill="none" />

  <!-- Big Glowing Sunset / Sun in Sky -->
  <circle cx="256" cy="195" r="130" fill="url(#sunGrad)" />

  <!-- Sun Rays / Ring Arc -->
  <circle cx="256" cy="195" r="145" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 8" stroke-opacity="0.5" fill="none" />

  <!-- Back Mountain (Zaghouan / Chaambi peak) -->
  <polygon points="340,135 450,330 230,330" fill="url(#mountBackGrad)" />
  <polygon points="340,135 450,330 340,330" fill="#1c1917" opacity="0.6" />
  <!-- Snow / Light on back mountain peak -->
  <polygon points="340,135 365,180 340,170 320,180" fill="#fef3c7" opacity="0.8" />

  <!-- Front Majestic Mountain (Main North & Dorsale Peak) -->
  <polygon points="190,120 330,340 50,340" fill="url(#mountFrontGrad)" filter="url(#mainShadow)" />
  <polygon points="190,120 330,340 190,340" fill="#141210" opacity="0.7" />
  <!-- Snow / Sunset highlight on front peak -->
  <polygon points="190,120 220,175 190,165 160,175" fill="#ffffff" opacity="0.9" />

  <!-- Pine Trees (Forêts d'Ain Draham) -->
  <g fill="#064e3b" opacity="0.9">
    <!-- Left Tree -->
    <polygon points="90,300 110,345 70,345" />
    <polygon points="90,280 105,315 75,315" />
    <!-- Right Tree -->
    <polygon points="410,300 430,345 390,345" />
    <polygon points="410,280 425,315 395,315" />
  </g>

  <!-- Ground / Camping Hill Horizon -->
  <path d="M40 375 Q 256 315 472 375 L472 400 L40 400 Z" fill="#1c1917" />
  <path d="M40 385 Q 256 325 472 385 L472 400 L40 400 Z" fill="#0c0a09" />

  <!-- Dome Camping Tent in Center -->
  <g transform="translate(256, 320)" filter="url(#mainShadow)">
    <!-- Tent Outer Shell (Golden Glow) -->
    <path d="M -75,40 Q 0,-65 75,40 Z" fill="url(#tentGrad)" stroke="#d97706" stroke-width="3" />
    
    <!-- Tent Front Flap Shadow -->
    <path d="M 0,-65 Q 40,-10 75,40 L 0,40 Z" fill="#b45309" opacity="0.4" />
    
    <!-- Tent Glowing Entrance Doorway -->
    <path d="M -30,40 Q 0,-25 30,40 Z" fill="#0c0a09" />
    <path d="M -22,40 Q 0,-15 22,40 Z" fill="#fef3c7" />
    <path d="M -15,40 Q 0,-5 15,40 Z" fill="#ffffff" />
  </g>

  <!-- Small Cozy Campfire on Right of Tent -->
  <g transform="translate(370, 355)">
    <!-- Fire logs -->
    <line x1="-12" y1="8" x2="12" y2="-4" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-12" y1="-4" x2="12" y2="8" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <!-- Flames -->
    <circle cx="0" cy="0" r="10" fill="#ef4444" opacity="0.9"/>
    <circle cx="0" cy="-4" r="7" fill="#f59e0b"/>
    <circle cx="0" cy="-7" r="4" fill="#fef08a"/>
  </g>

  <!-- Brand Typography at Bottom -->
  <text x="256" y="440" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#ffffff" letter-spacing="2">
    CAMPERMAP <tspan fill="#f59e0b">TN</tspan>
  </text>
  <text x="256" y="468" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#a8a29e" letter-spacing="4">
    BIVOUAC • OUTDOOR • 4X4
  </text>
</svg>
`;


// 2. Feature Graphic (1024x500) SVG
const featureGraphicSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="featBg" x1="0" y1="0" x2="1024" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0c0a09" />
      <stop offset="50%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </linearGradient>
    <linearGradient id="featAccent" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="glowFeat" x1="800" y1="200" x2="800" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </linearGradient>
    <filter id="fShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="500" fill="url(#featBg)" />

  <!-- Stars in sky -->
  <circle cx="100" cy="80" r="1.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="220" cy="50" r="2" fill="#ffffff" opacity="0.8"/>
  <circle cx="340" cy="120" r="1" fill="#ffffff" opacity="0.4"/>
  <circle cx="480" cy="60" r="2" fill="#ffffff" opacity="0.7"/>
  <circle cx="600" cy="100" r="1.5" fill="#ffffff" opacity="0.5"/>
  <circle cx="750" cy="70" r="2.5" fill="#f59e0b" opacity="0.9"/>
  <circle cx="890" cy="130" r="1.5" fill="#ffffff" opacity="0.7"/>
  <circle cx="950" cy="60" r="2" fill="#ffffff" opacity="0.8"/>

  <!-- Mountain Silhouettes -->
  <path d="M450 500 L620 280 L740 400 L860 220 L1024 450 L1024 500 Z" fill="#141210" opacity="0.9"/>
  <path d="M550 500 L720 310 L840 420 L940 270 L1024 380 L1024 500 Z" fill="#292524" opacity="0.7"/>

  <!-- Glowing Sun / Compass on right -->
  <circle cx="820" cy="250" r="140" fill="url(#glowFeat)" />
  <circle cx="820" cy="250" r="100" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 6" stroke-opacity="0.6" fill="none" />
  
  <!-- Right Visual: Tent + Campfire -->
  <path d="M740 460 L800 360 L860 460 Z" fill="#3b3734" filter="url(#fShadow)"/>
  <path d="M785 460 L800 400 L815 460 Z" fill="#f59e0b" />
  <!-- Small Fire -->
  <circle cx="890" cy="455" r="8" fill="#ef4444" />
  <circle cx="890" cy="450" r="5" fill="#f59e0b" />
  <circle cx="890" cy="445" r="3" fill="#ffffff" />

  <!-- Left Content Info -->
  <!-- Badge -->
  <rect x="70" y="80" width="220" height="34" rx="17" fill="#047857" fill-opacity="0.3" stroke="#10b981" stroke-width="1.5" />
  <text x="180" y="102" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="12" fill="#34d399" letter-spacing="2">
    🇹🇳 GUIDE BIVOUAC TUNISIE
  </text>

  <!-- Title -->
  <text x="70" y="180" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="56" fill="#ffffff" letter-spacing="-1">
    CamperMap <tspan fill="#f59e0b">TN</tspan>
  </text>

  <!-- Subtitle -->
  <text x="70" y="230" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="22" fill="#e7e5e4">
    Spots Sauvages, Pistes 4x4 &amp; Randonnée
  </text>

  <!-- Features bullets -->
  <g transform="translate(70, 275)" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#a8a29e">
    <text x="0" y="0">📍 100+ Spots vérifiés (Nord, Dorsale, Criques, Sahara)</text>
    <text x="0" y="28">📶 Fonctionne 100% Hors-Ligne sans réseau (GPS Live)</text>
    <text x="0" y="56">🆘 Bouton SOS 1-Clic • Numéros d'urgence 198/193</text>
    <text x="0" y="84">🎒 Checklist équipement • Météo &amp; Éphéméride solaire</text>
  </g>

  <!-- Store Call to Action Pill -->
  <rect x="70" y="400" width="280" height="46" rx="23" fill="url(#featAccent)" filter="url(#fShadow)" />
  <text x="210" y="429" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#0c0a09" letter-spacing="1">
    TÉLÉCHARGER L'APPLICATION 🏕️
  </text>
</svg>
`;

// 3. Four Play Store Screenshots Generator (1080x2400)
function generateScreenshotSvg(
  title: string, 
  subtitle: string, 
  badge: string, 
  badgeColor: string, 
  contentXml: string
): string {
  return `
<svg width="1080" height="2400" viewBox="0 0 1080 2400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgS" x1="0" y1="0" x2="1080" y2="2400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="50%" stop-color="#0c0a09" />
      <stop offset="100%" stop-color="#141210" />
    </linearGradient>
    <filter id="phoneShadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="30" stdDeviation="40" flood-color="#000000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1080" height="2400" fill="url(#bgS)" />

  <!-- Top Marketing Header -->
  <g transform="translate(540, 160)" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
    <!-- Tag / Badge -->
    <rect x="-160" y="0" width="320" height="44" rx="22" fill="${badgeColor}" fill-opacity="0.2" stroke="${badgeColor}" stroke-width="2"/>
    <text x="0" y="28" font-size="16" font-weight="900" fill="${badgeColor}" letter-spacing="2">
      ${badge}
    </text>

    <!-- Main Title -->
    <text x="0" y="110" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">
      ${title}
    </text>

    <!-- Subtitle -->
    <text x="0" y="165" font-size="24" font-weight="600" fill="#a8a29e">
      ${subtitle}
    </text>
  </g>

  <!-- Smartphone Frame Mockup (Centered) -->
  <g transform="translate(90, 430)" filter="url(#phoneShadow)">
    <!-- Outer Bezel -->
    <rect width="900" height="1860" rx="60" fill="#292524" stroke="#44403c" stroke-width="8" />
    <!-- Inner Screen -->
    <rect x="20" y="20" width="860" height="1820" rx="46" fill="#0c0a09" />

    <!-- Dynamic Island / Camera Punch Hole -->
    <rect x="360" y="35" width="180" height="30" rx="15" fill="#000000" />
    <circle cx="490" cy="50" r="6" fill="#1e1e1e" />

    <!-- Screen UI Content Mockup -->
    <g transform="translate(20, 80)">
      ${contentXml}
    </g>
  </g>
</svg>
`;
}

// Screenshot 1: Interactive Map & 4 Ecosystems
const screen1Xml = `
  <!-- App Navbar Mockup -->
  <rect x="20" y="10" width="820" height="90" rx="20" fill="#1c1917" stroke="#383330"/>
  <text x="50" y="62" font-family="sans-serif" font-weight="900" font-size="28" fill="#ffffff">CamperMap <tspan fill="#f59e0b">TN</tspan></text>
  <rect x="560" y="28" width="120" height="54" rx="14" fill="#dc2626"/>
  <text x="620" y="63" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff">SOS</text>
  <rect x="700" y="28" width="120" height="54" rx="14" fill="#f59e0b"/>
  <text x="760" y="63" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#0c0a09">+ Spot</text>

  <!-- Map Terrain Mockup -->
  <rect x="20" y="120" width="820" height="1420" rx="24" fill="#141916"/>
  <path d="M50 400 Q200 300 400 480 T800 350 L840 1500 L20 1500 Z" fill="#1e2922" opacity="0.6"/>
  
  <!-- Map Pins with badges -->
  <g transform="translate(220, 450)">
    <circle cx="0" cy="0" r="32" fill="#10b981" stroke="#ffffff" stroke-width="4"/>
    <text x="0" y="10" text-anchor="middle" font-size="24">🌲</text>
    <rect x="-100" y="45" width="200" height="46" rx="12" fill="#1c1917" stroke="#383330"/>
    <text x="0" y="74" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#ffffff">Ain Draham • 4.9★</text>
  </g>

  <g transform="translate(620, 350)">
    <circle cx="0" cy="0" r="32" fill="#0284c7" stroke="#ffffff" stroke-width="4"/>
    <text x="0" y="10" text-anchor="middle" font-size="24">🌊</text>
    <rect x="-110" y="45" width="220" height="46" rx="12" fill="#1c1917" stroke="#383330"/>
    <text x="0" y="74" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#ffffff">Cap Serrat • 5.0★</text>
  </g>

  <g transform="translate(380, 850)">
    <circle cx="0" cy="0" r="32" fill="#d97706" stroke="#ffffff" stroke-width="4"/>
    <text x="0" y="10" text-anchor="middle" font-size="24">⛰️</text>
    <rect x="-110" y="45" width="220" height="46" rx="12" fill="#1c1917" stroke="#383330"/>
    <text x="0" y="74" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#ffffff">Zaghouan • 4.8★</text>
  </g>

  <g transform="translate(520, 1250)">
    <circle cx="0" cy="0" r="32" fill="#f59e0b" stroke="#ffffff" stroke-width="4"/>
    <text x="0" y="10" text-anchor="middle" font-size="24">🏜️</text>
    <rect x="-120" y="45" width="240" height="46" rx="12" fill="#1c1917" stroke="#383330"/>
    <text x="0" y="74" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#ffffff">Ksar Ghilane • 4.9★</text>
  </g>

  <!-- Bottom Nav Mockup -->
  <rect x="20" y="1560" width="820" height="140" rx="30" fill="#1c1917" stroke="#383330"/>
  <text x="120" y="1640" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="22" fill="#f59e0b">🗺️ Carte</text>
  <text x="320" y="1640" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="22" fill="#a8a29e">📋 Liste</text>
  <text x="520" y="1640" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="22" fill="#a8a29e">⭐ Favoris</text>
  <text x="720" y="1640" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="22" fill="#a8a29e">☰ Plus</text>
`;

// Screenshot 2: Spot Detail Sheet with Ephemeris & Weather
const screen2Xml = `
  <!-- Top Background Image -->
  <rect x="20" y="10" width="820" height="400" rx="30" fill="#292524"/>
  <text x="430" y="220" text-anchor="middle" font-size="80">🏖️</text>
  
  <!-- Drawer Panel -->
  <rect x="20" y="340" width="820" height="1360" rx="36" fill="#1c1917" stroke="#44403c"/>
  
  <!-- Spot Title & Tag -->
  <text x="60" y="420" font-family="sans-serif" font-weight="900" font-size="36" fill="#ffffff">Crique Secrète Cap Serrat</text>
  <text x="60" y="460" font-family="sans-serif" font-weight="700" font-size="20" fill="#f59e0b">📍 Bizerte • Crique sauvage &amp; Plage vierge</text>

  <!-- Ephemeris Solar Card -->
  <rect x="60" y="500" width="740" height="180" rx="24" fill="#0c0a09" stroke="#383330"/>
  <text x="90" y="545" font-family="sans-serif" font-weight="800" font-size="20" fill="#f59e0b">🌅 Éphéméride Solaire &amp; Golden Hour</text>
  <text x="120" y="610" font-family="sans-serif" font-weight="700" font-size="18" fill="#ffffff">Lever: 05:42</text>
  <text x="360" y="610" font-family="sans-serif" font-weight="700" font-size="18" fill="#ffffff">Coucher: 19:28</text>
  <text x="600" y="610" font-family="sans-serif" font-weight="700" font-size="18" fill="#fbbf24">Golden: 18:45</text>
  <text x="90" y="655" font-family="sans-serif" font-size="14" fill="#a8a29e">Monter sa tente avant 19h00 pour la nuit.</text>

  <!-- Weather 3-Day Card -->
  <rect x="60" y="710" width="740" height="180" rx="24" fill="#0c0a09" stroke="#383330"/>
  <text x="90" y="755" font-family="sans-serif" font-weight="800" font-size="20" fill="#38bdf8">🌤️ Météo Bivouac en Direct (3 Jours)</text>
  <text x="140" y="820" font-family="sans-serif" font-weight="700" font-size="18" fill="#ffffff">Auj: 24°C ☀️</text>
  <text x="380" y="820" font-family="sans-serif" font-weight="700" font-size="18" fill="#ffffff">Dem: 23°C 🌤️</text>
  <text x="620" y="820" font-family="sans-serif" font-weight="700" font-size="18" fill="#ffffff">J+2: 22°C ⛅</text>
  <text x="90" y="865" font-family="sans-serif" font-size="14" fill="#34d399">Vent calme 12 km/h • Conditions idéales</text>

  <!-- WhatsApp Share & GPS Button -->
  <rect x="60" y="920" width="355" height="74" rx="20" fill="#047857"/>
  <text x="237" y="965" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="20" fill="#ffffff">📲 WhatsApp</text>
  
  <rect x="445" y="920" width="355" height="74" rx="20" fill="#d97706"/>
  <text x="622" y="965" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="20" fill="#ffffff">📋 Copier GPS</text>

  <!-- 4 Navigation Apps -->
  <rect x="60" y="1020" width="170" height="60" rx="16" fill="#292524"/>
  <text x="145" y="1057" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="#ffffff">Google Maps</text>

  <rect x="250" y="1020" width="170" height="60" rx="16" fill="#292524"/>
  <text x="335" y="1057" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="#ffffff">Waze</text>

  <rect x="440" y="1020" width="170" height="60" rx="16" fill="#292524"/>
  <text x="525" y="1057" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="#ffffff">OsmAnd</text>

  <rect x="630" y="1020" width="170" height="60" rx="16" fill="#292524"/>
  <text x="715" y="1057" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="#ffffff">Apple Maps</text>
`;

// Screenshot 3: SOS 1-Click Distress Modal
const screen3Xml = `
  <!-- SOS Modal Box -->
  <rect x="20" y="40" width="820" height="1620" rx="40" fill="#1c1917" stroke="#ef4444" stroke-width="4"/>

  <!-- SOS Header -->
  <rect x="60" y="90" width="80" height="80" rx="24" fill="#dc2626"/>
  <text x="100" y="145" text-anchor="middle" font-size="44" fill="#ffffff">🛡️</text>
  <text x="170" y="130" font-family="sans-serif" font-weight="900" font-size="32" fill="#ffffff">SOS URGENCE BIVOUAC</text>
  <text x="170" y="165" font-family="sans-serif" font-weight="700" font-size="18" fill="#f87171">Tunisie • Secours 24h/24 7j/7</text>

  <!-- GPS Display Box -->
  <rect x="60" y="210" width="740" height="200" rx="24" fill="#0c0a09" stroke="#383330"/>
  <text x="90" y="255" font-family="sans-serif" font-weight="700" font-size="18" fill="#a8a29e">📍 Vos coordonnées GPS exactes :</text>
  <text x="430" y="325" text-anchor="middle" font-family="monospace" font-weight="900" font-size="36" fill="#f59e0b" letter-spacing="2">36.806500, 10.181500</text>
  <text x="430" y="375" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="16" fill="#10b981">● Précision GPS satellite active</text>

  <!-- 4 Emergency Services Call Buttons -->
  <g transform="translate(60, 440)">
    <rect x="0" y="0" width="740" height="110" rx="24" fill="#b91c1c"/>
    <text x="40" y="55" font-family="sans-serif" font-weight="900" font-size="24" fill="#ffffff">🚒 Protection Civile (Malaise / Feu)</text>
    <text x="40" y="85" font-family="sans-serif" font-size="16" fill="#fca5a5">Urgences médicales &amp; blessures</text>
    <rect x="580" y="25" width="120" height="60" rx="16" fill="#000000" fill-opacity="0.3"/>
    <text x="640" y="65" text-anchor="middle" font-family="monospace" font-weight="900" font-size="28" fill="#ffffff">198</text>
  </g>

  <g transform="translate(60, 570)">
    <rect x="0" y="0" width="740" height="110" rx="24" fill="#047857"/>
    <text x="40" y="55" font-family="sans-serif" font-weight="900" font-size="24" fill="#ffffff">👮 Garde Nationale (Montagne / Pistes)</text>
    <text x="40" y="85" font-family="sans-serif" font-size="16" fill="#a7f3d0">Secours Kroumirie, Dorsale &amp; Sahara</text>
    <rect x="580" y="25" width="120" height="60" rx="16" fill="#000000" fill-opacity="0.3"/>
    <text x="640" y="65" text-anchor="middle" font-family="monospace" font-weight="900" font-size="28" fill="#ffffff">193</text>
  </g>

  <g transform="translate(60, 700)">
    <rect x="0" y="0" width="740" height="110" rx="24" fill="#1d4ed8"/>
    <text x="40" y="55" font-family="sans-serif" font-weight="900" font-size="24" fill="#ffffff">🚔 Police Secours (Zones Côtières)</text>
    <text x="40" y="85" font-family="sans-serif" font-size="16" fill="#bfdbfe">Sécurité publique urbaine</text>
    <rect x="580" y="25" width="120" height="60" rx="16" fill="#000000" fill-opacity="0.3"/>
    <text x="640" y="65" text-anchor="middle" font-family="monospace" font-weight="900" font-size="28" fill="#ffffff">197</text>
  </g>

  <g transform="translate(60, 830)">
    <rect x="0" y="0" width="740" height="110" rx="24" fill="#0e7490"/>
    <text x="40" y="55" font-family="sans-serif" font-weight="900" font-size="24" fill="#ffffff">⚓ Garde Maritime (Criques Sauvages)</text>
    <text x="40" y="85" font-family="sans-serif" font-size="16" fill="#a5f3fc">Détresse en mer &amp; criques isolées</text>
    <rect x="580" y="25" width="120" height="60" rx="16" fill="#000000" fill-opacity="0.3"/>
    <text x="640" y="65" text-anchor="middle" font-family="monospace" font-weight="900" font-size="28" fill="#ffffff">194</text>
  </g>

  <!-- WhatsApp SOS Dispatch Button -->
  <rect x="60" y="970" width="740" height="84" rx="24" fill="#059669"/>
  <text x="430" y="1022" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#ffffff">📲 Envoyer Message SOS WhatsApp</text>
`;

// Screenshot 4: Bivouac Gear Checklist & PWA Offline
const screen4Xml = `
  <rect x="20" y="40" width="820" height="1620" rx="40" fill="#1c1917" stroke="#383330"/>
  
  <!-- Header -->
  <rect x="60" y="80" width="80" height="80" rx="24" fill="#f59e0b"/>
  <text x="100" y="135" text-anchor="middle" font-size="44" fill="#0c0a09">🎒</text>
  <text x="170" y="125" font-family="sans-serif" font-weight="900" font-size="32" fill="#ffffff">Checklist Matériel de Bivouac</text>
  <text x="170" y="155" font-family="sans-serif" font-weight="600" font-size="18" fill="#a8a29e">Ne rien oublier avant le départ</text>

  <!-- Progress Bar Gauge -->
  <rect x="60" y="190" width="740" height="110" rx="24" fill="#0c0a09" stroke="#383330"/>
  <text x="90" y="235" font-family="sans-serif" font-weight="700" font-size="18" fill="#ffffff">Progression du sac :</text>
  <text x="760" y="235" text-anchor="end" font-family="sans-serif" font-weight="900" font-size="20" fill="#10b981">21 / 25 (84%)</text>
  <rect x="90" y="255" width="680" height="20" rx="10" fill="#292524"/>
  <rect x="90" y="255" width="570" height="20" rx="10" fill="#10b981"/>

  <!-- Checklist items -->
  <g transform="translate(60, 330)">
    <rect x="0" y="0" width="740" height="90" rx="20" fill="#064e3b" stroke="#047857"/>
    <text x="30" y="55" font-size="28">✅</text>
    <text x="80" y="45" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">Tente double-toit coupe-vent</text>
    <text x="80" y="72" font-family="sans-serif" font-size="14" fill="#a7f3d0">Arceaux alu et haubans solides</text>
  </g>

  <g transform="translate(60, 440)">
    <rect x="0" y="0" width="740" height="90" rx="20" fill="#064e3b" stroke="#047857"/>
    <text x="30" y="55" font-size="28">✅</text>
    <text x="80" y="45" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">Réserve d'eau 5L / personne / jour</text>
    <text x="80" y="72" font-family="sans-serif" font-size="14" fill="#a7f3d0">Règle vitale en Tunisie (mer &amp; désert)</text>
  </g>

  <g transform="translate(60, 550)">
    <rect x="0" y="0" width="740" height="90" rx="20" fill="#064e3b" stroke="#047857"/>
    <text x="30" y="55" font-size="28">✅</text>
    <text x="80" y="45" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">Lampe frontale + piles de rechange</text>
    <text x="80" y="72" font-family="sans-serif" font-size="14" fill="#a7f3d0">Indispensable pour le camp de nuit</text>
  </g>

  <g transform="translate(60, 660)">
    <rect x="0" y="0" width="740" height="90" rx="20" fill="#064e3b" stroke="#047857"/>
    <text x="30" y="55" font-size="28">✅</text>
    <text x="80" y="45" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">Trousse premiers secours complète</text>
    <text x="80" y="72" font-family="sans-serif" font-size="14" fill="#a7f3d0">Compresses, antiseptique, aspi-venin</text>
  </g>

  <g transform="translate(60, 770)">
    <rect x="0" y="0" width="740" height="90" rx="20" fill="#292524" stroke="#44403c"/>
    <text x="30" y="55" font-size="28">⬜</text>
    <text x="80" y="45" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">Plaques de désensablage 4x4</text>
    <text x="80" y="72" font-family="sans-serif" font-size="14" fill="#a8a29e">Pour le sable du Sud et les dunes</text>
  </g>
`;

async function buildAllAssets() {
  console.log('🚀 Generating Google Play Console assets...');

  // 1. App Icon 512x512 PNG
  const iconBuffer = Buffer.from(iconSvg);
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(OUTPUT_DIR, 'icon-512x512.png'));
  console.log('✅ Generated playstore-assets/icon-512x512.png');

  // 2. Feature Graphic 1024x500 PNG
  const featBuffer = Buffer.from(featureGraphicSvg);
  await sharp(featBuffer)
    .resize(1024, 500)
    .png()
    .toFile(path.join(OUTPUT_DIR, 'feature-graphic-1024x500.png'));
  console.log('✅ Generated playstore-assets/feature-graphic-1024x500.png');

  // 3. Four Mobile Screenshots (1080x2400)
  const screens = [
    {
      file: 'screenshot-1-map.png',
      svg: generateScreenshotSvg(
        'Carte Interactive Tunisie',
        'Plus de 100 spots de bivouac, criques &amp; pistes',
        'EXPÉDITION OUTDOOR',
        '#10b981',
        screen1Xml
      )
    },
    {
      file: 'screenshot-2-spot-detail.png',
      svg: generateScreenshotSvg(
        'Fiche Spot Complète',
        'Éphéméride solaire, météo 3j &amp; guidage GPS',
        'DÉTAILS &amp; ÉPHÉMÉRIDE',
        '#f59e0b',
        screen2Xml
      )
    },
    {
      file: 'screenshot-3-sos-emergency.png',
      svg: generateScreenshotSvg(
        'Bouton SOS d\'Urgence',
        'Coordonnées GPS live &amp; appels directs 198 / 193',
        'SÉCURITÉ MAXIMALE',
        '#ef4444',
        screen3Xml
      )
    },
    {
      file: 'screenshot-4-checklist.png',
      svg: generateScreenshotSvg(
        'Checklist &amp; Mode Hors-Ligne',
        'Préparez votre sac et naviguez sans réseau',
        'AUTONOMIE TOTALE',
        '#8b5cf6',
        screen4Xml
      )
    }
  ];


  for (const s of screens) {
    const sBuf = Buffer.from(s.svg);
    await sharp(sBuf)
      .resize(1080, 2400)
      .png()
      .toFile(path.join(screenshotsDir, s.file));
    console.log(`✅ Generated playstore-assets/screenshots/${s.file}`);
  }

  // 4. Android Adaptive Mipmap Launcher Icons
  const mipmaps = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 }
  ];

  for (const m of mipmaps) {
    const targetDir = path.join(RES_DIR, m.dir);
    if (fs.existsSync(targetDir)) {
      await sharp(iconBuffer)
        .resize(m.size, m.size)
        .png()
        .toFile(path.join(targetDir, 'ic_launcher.png'));

      await sharp(iconBuffer)
        .resize(m.size, m.size)
        .png()
        .toFile(path.join(targetDir, 'ic_launcher_round.png'));

      await sharp(iconBuffer)
        .resize(m.size, m.size)
        .png()
        .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

      console.log(`✅ Generated Android icons in ${m.dir} (${m.size}x${m.size})`);
    }
  }

  // 5. Android Splash Screen in drawable
  const drawableDir = path.join(RES_DIR, 'drawable');
  if (fs.existsSync(drawableDir)) {
    const splashSvg = `
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1080" height="1920" fill="#0c0a09"/>
      <circle cx="540" cy="850" r="180" fill="#f59e0b" fill-opacity="0.15"/>
      <!-- Mountain Peak -->
      <polygon points="540,700 680,950 400,950" fill="#292524" />
      <polygon points="540,700 680,950 540,950" fill="#1c1917" opacity="0.6" />
      <polygon points="540,700 565,745 540,735 515,745" fill="#ffffff" />
      <!-- Glowing Tent -->
      <path d="M 470,950 Q 540,840 610,950 Z" fill="#f59e0b" />
      <path d="M 515,950 Q 540,890 565,950 Z" fill="#ffffff" />
      <text x="540" y="1080" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="48" fill="#ffffff">
        CamperMap <tspan fill="#f59e0b">TN</tspan>
      </text>
      <text x="540" y="1130" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="20" fill="#a8a29e" letter-spacing="4">
        BIVOUAC • 4X4 • RANDONNÉE
      </text>
    </svg>
    `;

    await sharp(Buffer.from(splashSvg))
      .resize(1080, 1920)
      .png()
      .toFile(path.join(drawableDir, 'splash.png'));
    console.log('✅ Generated android/app/src/main/res/drawable/splash.png');
  }

  console.log('🎉 All Google Play Console & Android assets generated successfully!');
}

buildAllAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
