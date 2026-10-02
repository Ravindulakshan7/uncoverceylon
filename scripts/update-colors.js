const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/Navbar.tsx',
  'src/components/HeroSection.tsx',
  'src/components/PlaceCard.tsx',
  'src/components/PlacesGrid.tsx',
  'src/components/Footer.tsx',
  'src/app/page.tsx',
  'src/app/map/page.tsx',
  'src/app/globals.css'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove excessive gradients
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'bg-slate-900');
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-z]+-\d+\s+via-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'bg-slate-900');
  
  // Text gradients -> solid color
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300/g, 'text-emerald-400');
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300/g, 'text-emerald-400');
  content = content.replace(/bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent/g, 'text-emerald-700');
  
  // Replace Blue with Deep Navy (Slate-900) and Emerald
  // Navbar Explore Now button
  content = content.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-emerald-700 hover:bg-emerald-800');
  content = content.replace(/text-blue-600/g, 'text-slate-900');
  content = content.replace(/bg-blue-50/g, 'bg-slate-100');
  content = content.replace(/border-blue-200/g, 'border-slate-300');
  content = content.replace(/bg-blue-500/g, 'bg-slate-900');
  content = content.replace(/text-blue-500/g, 'text-slate-800');
  
  content = content.replace(/hover:text-blue-600/g, 'hover:text-emerald-700');
  content = content.replace(/hover:bg-blue-50/g, 'hover:bg-slate-100');
  content = content.replace(/shadow-blue-500\/[0-9]+/g, 'shadow-slate-900/10');
  
  // Specific hero gradient
  content = content.replace(/from-sky-400 via-blue-400 to-indigo-300/g, 'text-emerald-400');
  
  // Replace Map teaser background
  content = content.replace(/bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600/g, 'bg-slate-900');

  // Fix specific occurrences
  content = content.replace(/text-blue-400/g, 'text-emerald-400');
  content = content.replace(/text-sky-400/g, 'text-emerald-400');
  content = content.replace(/hover:text-blue-400/g, 'hover:text-emerald-400');
  
  // Update footer styling
  content = content.replace(/bg-slate-950/g, 'bg-slate-900');
  
  // Drop excessive gradient circles in footer
  content = content.replace(/<div className="absolute top-0 left-1\/4 w-96 h-96 bg-blue-600\/10 rounded-full blur-3xl pointer-events-none" \/>/g, '');
  content = content.replace(/<div className="absolute bottom-0 right-1\/4 w-96 h-96 bg-sky-500\/10 rounded-full blur-3xl pointer-events-none" \/>/g, '');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${file}`);
});
