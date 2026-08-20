const fs = require('fs');
const path = require('path');

const file = 'src/components/Map/CampingMap.tsx';
const filePath = path.join(__dirname, file);
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/py-1 /g, 'py-1.5 px-3 ');
content = content.replace(/maxWidth: 280/g, 'maxWidth: 260');
content = content.replace(/p-2.5 rounded-xl/g, 'p-3 rounded-xl');
content = content.replace(/p-2.5 rounded-full/g, 'p-3 rounded-full');

fs.writeFileSync(filePath, content, 'utf8');
