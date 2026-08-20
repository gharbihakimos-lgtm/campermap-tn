# 📱 Fiche Complète de Déploiement — Google Play Console

Ce document contient toutes les informations prêtes à copier-coller pour publier **CamperMap TN** sur la **Google Play Console**.

---

## 1. 📦 Fichiers Binaires Signés (Prêts pour Déploiement)

| Fichier | Emplacement | Usage |
|---|---|---|
| **Android App Bundle (.aab)** | `release-builds/CamperMapTN-v1.0-release.aab` | **Fichier obligatoire pour Google Play Console** (Poids optimisé : ~3.8 MB) |
| **APK Signé Direct (.apk)** | `release-builds/CamperMapTN-v1.0-release.apk` | Installation manuelle directe sur smartphone Android (Sideload / Test) |
| **Keystore de Production** | `campermap-release.jks` *(sauvegardé également dans `android/app/`)* | Clé de signature cryptographique (garder précieusement une copie sécurisée) |

---

## 2. 🔐 Signatures Électroniques & Empreintes Cryptographiques (Keystore)

Ces empreintes sont requises dans la **Google Play Console** (section *Intégrité de l'application / Signature de l'application*) et dans la console **Google Cloud / Firebase OAuth** :

- **Nom du fichier Keystore** : `campermap-release.jks`
- **Alias de la clé** : `campermap-release-key`
- **Mot de passe du Keystore** : `CamperMap2026TN!`
- **Mot de passe de la clé** : `CamperMap2026TN!`
- **Algorithme** : RSA 2048-bit (SHA384withRSA)
- **Validité** : Jusqu'au **5 janvier 2054** (10 000 jours)

### Empreintes de Certificat :
- **SHA-1** :
  ```
  11:C9:F4:E4:98:FC:F1:05:AB:A9:E9:41:7A:1E:D0:65:EE:3B:BD:16
  ```
- **SHA-256** :
  ```
  58:74:E2:59:C0:44:C8:5B:6A:EE:89:05:1F:4B:99:4C:BC:A3:70:B1:11:BF:73:74:57:D8:EF:13:EA:85:97:86
  ```

---

## 3. 🎨 Visuels et Captures d'Écran (Google Play Console)

Tous les visuels ont été générés aux dimensions exactes imposées par Google Play :

| Type de Graphique | Fichier | Résolution |
|---|---|---|
| **Icône Haute Résolution** | `playstore-assets/icon-512x512.png` | **512 x 512 px** (PNG 32 bits sans transparence) |
| **Graphique de Fonctionnalité (Bannière)** | `playstore-assets/feature-graphic-1024x500.png` | **1024 x 500 px** (Bannière promotionnelle en tête de fiche) |
| **Capture 1 : Carte Interactive** | `playstore-assets/screenshots/screenshot-1-map.png` | **1080 x 2400 px** (9:16 Portrait) |
| **Capture 2 : Fiche Spot & Éphéméride** | `playstore-assets/screenshots/screenshot-2-spot-detail.png` | **1080 x 2400 px** (9:16 Portrait) |
| **Capture 3 : SOS Urgence 1-Clic** | `playstore-assets/screenshots/screenshot-3-sos-emergency.png` | **1080 x 2400 px** (9:16 Portrait) |
| **Capture 4 : Checklist Matériel & Offline** | `playstore-assets/screenshots/screenshot-4-checklist.png` | **1080 x 2400 px** (9:16 Portrait) |

---

## 4. 📝 Métadonnées de la Fiche Play Store (Textes prêts à copier-coller)

### 📌 Nom de l'application (Titre - Max 30 caractères) :
```
CamperMap TN: Bivouac & 4x4
```

### 📌 Description courte (Max 80 caractères) :
```
Carte interactive des spots sauvages, bivouac, randonnées et pistes 4x4 en Tunisie.
```

### 📌 Description complète (Max 4000 caractères) :
```
CamperMap TN est l'application compagnon ultime pour les passionnés de bivouac sauvage, de randonnée, de raid 4x4 et de vie en plein air en Tunisie 🇹🇳.

Que vous partiez explorer les forêts humides de Kroumirie (Aïn Draham, Beni M'Tir), les criques secrètes du littoral nord (Cap Serrat, Cap Hmam, Sidi Mechreg), les sommets vertigineux de la Dorsale (Djebel Zaghouan, Djebel Bargou) ou les dunes majestueuses du Grand Erg Saharien (Ksar Ghilane, Tembaine), CamperMap TN vous guide en toute sécurité !

🌟 FONCTIONNALITÉS PRINCIPALES :

🗺️ CARTE INTERACTIVE 100% OUTDOOR
• Plus de 100 spots répertoriés et vérifiés par la communauté outdoor tunisienne.
• 4 grands écosystèmes : Forêts & Montagnes du Nord, Criques & Plages Sauvages, Parcs & Sommets de la Dorsale, Oasis & Pistes Sahariennes.
• Filtres multicritères : Type d'accès (Accessible en citadine, 4x4 / Piste, Marche uniquement), Difficulté, Activités (Baignade, Escalade, Randonnée, Pêche, Observation des étoiles, Feux de camp autorisés), Points d'eau et réseau téléphonique.

🌅 ÉPHÉMÉRIDE SOLAIRE & HEURE DORÉE (GOLDEN HOUR)
• Calcul astronomique précis en temps réel selon le lieu choisi : Heure exacte du lever et du coucher de soleil.
• Anticipez le montage de votre tente avant la tombée de la nuit.
• "Golden Hour" pour réussir les plus belles photos de paysages tunisiens.

🌤️ MÉTÉO BIVOUAC EN DIRECT (PRÉVISIONS 3 JOURS)
• Températures, vitesse du vent, rafales et indice UV spécifiques à chaque coordonnée GPS.
• Alertes météo spéciales : détection des risques de tempête de sable et vents violents.

🆘 BOUTON D'URGENCE SOS 1-CLIC & LOCALISATION LIVE
• Affichage instantané en gros caractères de vos coordonnées GPS de haute précision (Latitude / Longitude).
• Appels directs d'urgence : Protection Civile (198), Garde Nationale des Pistes & Montagnes (193), Police Secours (197), Garde Maritime (194).
• Partage d'un message de détresse pré-rempli en 1 clic par WhatsApp ou SMS avec lien Google Maps direct.

🎒 CHECKLIST MATÉRIEL DE BIVOUAC INTERACTIVE
• Plus de 25 équipements indispensables classés en 6 catégories (Abri, Eau & Alimentation, Énergie & Outils, Pharmacie SOS, 4x4 & Sahara, Leave No Trace).
• Jauge de progression en temps réel et possibilité d'ajouter ses propres affaires personnelles.

📲 NAVIGATION MULTI-APPLICATIONS & EXPORT GPX
• Ouvrez votre destination en 1 clic dans Google Maps, Waze, OsmAnd ou Apple Maps.
• Exportez les tracés au format GPX pour vos GPS Garmin ou applications de trek (Gaia GPS, Wikiloc).

🌐 100% MULTILINGUE & MODE HORS-LIGNE
• Disponible en Français, Arabe Tunisien (عربي) et Anglais.
• Mise en cache automatique des cartes et des données pour une consultation fluide en pleine nature sans aucune couverture 4G.

🌿 RESPECT DE L'ENVIRONNEMENT (CHARTE SANS TRACE)
CamperMap TN promeut activement les principes de l'éthique "Leave No Trace" pour préserver les trésors naturels de la Tunisie : ramassage total des déchets, interdiction stricte des feux sauvages en été et respect de la faune locale.

Téléchargez CamperMap TN et partez à l'aventure tunisienne en toute sérénité ! 🏕️🇹🇳
```

---

## 5. ⚙️ Configuration Administrative (Console Google Play)

- **Catégorie de l'application** : Voyages et guides locaux (*Travel & Local*)
- **Tags recommandés** : Voyage, Randonnée, Camping, Cartes et navigation, Tunisie, 4x4, Météo
- **Public cible** : 13 ans et plus (Tout public)
- **Modèle économique** : Gratuit (sans publicité invasive)
- **URL de la politique de confidentialité** : `https://campermap-tn.onrender.com`
- **Coordonnées de l'éditeur** :
  - Nom : Gharbi Hakim
  - Email : `contact@campermap.tn`
  - Pays : Tunisie
