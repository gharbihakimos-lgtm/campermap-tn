const fs = require('fs');
const path = require('path');

const files = [
  'src/components/SpotDetail/SpotDetailDrawer.tsx',
  'src/components/AddSpot/AddSpotModal.tsx',
  'src/components/Filters/FilterPanel.tsx',
  'src/components/Auth/AuthModal.tsx',
  'src/components/Settings/SettingsModal.tsx',
  'src/components/RoutePlanner/RoutePlannerModal.tsx',
  'src/components/SafetyTips/SafetyTipsModal.tsx',
  'src/components/Profile/CamperProfileDrawer.tsx',
  'src/components/Profile/AddLogEntryModal.tsx',
  'src/components/Map/CampingMap.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  if (file.includes('SpotDetailDrawer.tsx')) {
    content = content.replace('<div className="grid grid-cols-4 gap-1.5">', '<div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">');
    content = content.replace('<div className="grid grid-cols-3 gap-2 bg-stone-900/80 p-3 rounded-xl border border-stone-700/60 items-center">', '<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-900/80 p-3 rounded-xl border border-stone-700/60 items-center">');
    content = content.replace('<div className="grid grid-cols-4 gap-1.5 pt-1">', '<div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 pt-1">');
    content = content.replace('<div className="grid grid-cols-3 gap-2">', '<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">');
    content = content.replace('<div className="grid grid-cols-2 gap-3">', '<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">'); // For text wrapping, just changed to 1 col sm 2 cols
    
    content = content.replace(/(<(input|textarea|select)[^>]*?className="[^"]*)text-xs([^"]*")/g, '$1text-[16px] sm:text-xs$3');
    content = content.replace(/(<button[^>]*?onClick={onClose}[^>]*?className="[^"]*)p-2([^"]*")/g, '$1p-2.5$2');
    
    // Header action buttons p-2 -> p-2.5
    content = content.replace(/className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition-all relative"/g, 'className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition-all relative"');
    content = content.replace(/className={`p-2 rounded-xl border transition-all \${/g, 'className={`p-2.5 rounded-xl border transition-all ${');
    content = content.replace(/className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition-all"/g, 'className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition-all"');
  }
  
  if (file.includes('AddSpotModal.tsx')) {
    content = content.replace(/(<(input|textarea|select)[^>]*?className="[^"]*)text-xs([^"]*")/g, '$1text-[16px] sm:text-sm$3');
    content = content.replace(/(<(input|textarea|select)[^>]*?className="[^"]*)text-sm([^"]*")/g, '$1text-[16px] sm:text-sm$3');
    content = content.replace('<div className="flex items-center justify-between">\\n              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">', '<div className="flex items-center justify-between flex-wrap gap-2">\\n              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">');
    // Also matching the one without newline just in case:
    content = content.replace('<div className="flex items-center justify-between">\r\n              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">', '<div className="flex items-center justify-between flex-wrap gap-2">\r\n              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">');
    content = content.replace('<div className="flex items-center justify-between">\n              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">', '<div className="flex items-center justify-between flex-wrap gap-2">\n              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">');
    
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"');
  }
  
  if (file.includes('FilterPanel.tsx')) {
    content = content.replace(/py-1 /g, 'py-2 ');
    content = content.replace(/py-1"/g, 'py-2"');
    content = content.replace(/(<(select)[^>]*?className="[^"]*)text-sm([^"]*")/g, '$1text-[16px] sm:text-sm$3');
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"');
  }
  
  if (file.includes('AuthModal.tsx')) {
    content = content.replace(/(<(input)[^>]*?className="[^"]*)text-xs([^"]*")/g, '$1text-[16px] sm:text-xs$3');
    content = content.replace('<div className="grid grid-cols-3 gap-1.5">', '<div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">');
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"');
  }
  
  if (file.includes('SettingsModal.tsx')) {
    content = content.replace('className="flex bg-stone-900 p-1 rounded-xl border border-stone-700"', 'className="flex flex-wrap bg-stone-900 p-1 rounded-xl border border-stone-700"');
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"');
  }
  
  if (file.includes('RoutePlannerModal.tsx')) {
    content = content.replace('<div className="grid grid-cols-3 gap-2">', '<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">');
    content = content.replace(/(<(select)[^>]*?className="[^"]*)text-xs([^"]*")/g, '$1text-[16px] sm:text-sm$3');
    content = content.replace(/(<(select)[^>]*?className="[^"]*)text-sm([^"]*")/g, '$1text-[16px] sm:text-sm$3');
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"');
  }
  
  if (file.includes('SafetyTipsModal.tsx')) {
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"');
  }
  
  if (file.includes('CamperProfileDrawer.tsx')) {
    content = content.replace('className="flex gap-2"', 'className="flex flex-wrap gap-2"');
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"');
  }
  
  if (file.includes('AddLogEntryModal.tsx')) {
    content = content.replace(/(<(input|select|textarea)[^>]*?className="[^"]*)text-xs([^"]*")/g, '$1text-[16px] sm:text-xs$3');
    content = content.replace(/(<(input|select|textarea)[^>]*?className="[^"]*)text-sm([^"]*")/g, '$1text-[16px] sm:text-xs$3');
    content = content.replace('className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"', 'className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"');
  }
  
  if (file.includes('CampingMap.tsx')) {
    content = content.replace(/className="py-1 /g, 'className="py-1.5 px-3 ');
    content = content.replace(/maxWidth: 280/g, 'maxWidth: 260');
    content = content.replace(/p-2.5 rounded-xl/g, 'p-3 rounded-xl');
    content = content.replace(/p-2.5 rounded-full/g, 'p-3 rounded-full');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
