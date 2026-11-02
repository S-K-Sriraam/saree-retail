const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svg = `
<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b0712"/>
      <stop offset="50%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#1c0a00"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <pattern id="motif" width="80" height="80" patternUnits="userSpaceOnUse">
      <circle cx="40" cy="40" r="18" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.25"/>
      <polygon points="40,25 45,38 58,40 47,48 51,61 40,52 29,61 33,48 22,40 35,38" fill="#fbbf24" opacity="0.2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#motif)"/>
  
  <rect x="30" y="30" width="740" height="940" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.5"/>
  <rect x="45" y="45" width="710" height="910" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
  
  <rect x="30" y="750" width="740" height="160" fill="url(#gold)" opacity="0.15"/>
  <line x1="30" y1="750" x2="770" y2="750" stroke="url(#gold)" stroke-width="3" opacity="0.6"/>
  <line x1="30" y1="910" x2="770" y2="910" stroke="url(#gold)" stroke-width="3" opacity="0.6"/>

  <circle cx="400" cy="420" r="60" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.8"/>
  <polygon points="400,380 412,410 445,415 420,435 428,468 400,450 372,468 380,435 355,415 388,410" fill="url(#gold)" opacity="0.9"/>
  
  <text x="400" y="520" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="28" font-weight="bold" letter-spacing="4">GEETHAVARNAM</text>
  <text x="400" y="555" text-anchor="middle" fill="#fde68a" font-family="sans-serif" font-size="14" letter-spacing="6" opacity="0.8">HERITAGE SILK COUTURE</text>
  <text x="400" y="605" text-anchor="middle" fill="#f3f4f6" font-family="sans-serif" font-size="13" opacity="0.6">Pure Handloom Creation</text>
</svg>
`;

const dir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

sharp(Buffer.from(svg))
  .jpeg({ quality: 90 })
  .toFile(path.join(dir, 'placeholder.jpg'))
  .then(() => {
    console.log('Created placeholder.jpg successfully');
    // Also save SVG as fallback
    fs.writeFileSync(path.join(dir, 'placeholder.svg'), svg.trim());
  })
  .catch(console.error);
