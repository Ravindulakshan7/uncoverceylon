const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'src/app/globals.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(/--shadow-blue/g, '--shadow-navy');
cssContent = cssContent.replace(/rgba\(59, 130, 246/g, 'rgba(15, 23, 42'); // slate-900 rgb
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Fixed shadow variables in globals.css');
