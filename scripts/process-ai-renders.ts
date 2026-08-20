import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BRAIN_DIR = path.resolve('C:/Users/hakim/.gemini/antigravity/brain/b1a5f17d-ff29-4ae6-addf-f5cf3ab327aa');
const OUTPUT_DIR = path.resolve('playstore-assets');
const RES_DIR = path.resolve('android/app/src/main/res');

async function processAiRenders() {
  console.log('🎨 Processing generated AI renders for Google Play Store...');

  // 1. Copy and format all 4 icon options into playstore-assets/options/
  const optionsDir = path.join(OUTPUT_DIR, 'icon-options');
  if (!fs.existsSync(optionsDir)) fs.mkdirSync(optionsDir, { recursive: true });

  const iconOptions = [
    { name: 'option-1-mountains-night.png', file: 'campermap_icon_mountains_1787216806947.jpg' },
    { name: 'option-2-sahara-4x4.png', file: 'campermap_icon_sahara_4x4_1787216821242.jpg' },
    { name: 'option-3-coastal-cove.png', file: 'campermap_icon_coastal_cove_1787216834555.jpg' },
    { name: 'option-4-vector-emblem.png', file: 'campermap_icon_vector_emblem_1787216846857.jpg' }
  ];

  for (const opt of iconOptions) {
    const src = path.join(BRAIN_DIR, opt.file);
    if (fs.existsSync(src)) {
      await sharp(src)
        .resize(512, 512)
        .png()
        .toFile(path.join(optionsDir, opt.name));
      console.log(`✅ Saved ${opt.name} (512x512)`);
    }
  }

  // 2. Set Option 1 (Night Mountains & Glowing Tent) as the primary official icon-512x512.png
  const primaryIconSrc = path.join(BRAIN_DIR, 'campermap_icon_mountains_1787216806947.jpg');
  if (fs.existsSync(primaryIconSrc)) {
    await sharp(primaryIconSrc)
      .resize(512, 512)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'icon-512x512.png'));
    console.log('✅ Updated playstore-assets/icon-512x512.png with primary render');

    // Update Android mipmap launcher icons
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
        await sharp(primaryIconSrc)
          .resize(m.size, m.size)
          .png()
          .toFile(path.join(targetDir, 'ic_launcher.png'));

        await sharp(primaryIconSrc)
          .resize(m.size, m.size)
          .png()
          .toFile(path.join(targetDir, 'ic_launcher_round.png'));

        await sharp(primaryIconSrc)
          .resize(m.size, m.size)
          .png()
          .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
      }
    }
    console.log('✅ Updated Android mipmap icons in all densities');
  }

  // 3. Process the panoramic feature graphic banner (1024x500)
  const bannerSrc = path.join(BRAIN_DIR, 'campermap_feature_graphic_banner_1787216859901.jpg');
  if (fs.existsSync(bannerSrc)) {
    await sharp(bannerSrc)
      .resize(1024, 500, { fit: 'cover' })
      .png()
      .toFile(path.join(OUTPUT_DIR, 'feature-graphic-1024x500.png'));
    console.log('✅ Updated playstore-assets/feature-graphic-1024x500.png with cinematic panorama');
  }

  console.log('🎉 All assets formatted and ready for Play Console upload!');
}

processAiRenders().catch(err => {
  console.error(err);
  process.exit(1);
});
