const fs = require('fs');

// A comprehensive script to fix all JSX icon component usages across files
// Pattern: replace <varname.icon className="..." /> with <FontAwesomeIcon icon={varname.icon} className="..." />

const filesToFix = [
  'src/app/page.tsx',
  'src/app/(app)/dashboard/page.tsx',
  'src/app/(app)/documents/page.tsx',
  'src/components/layout/sidebar.tsx',
];

// Regex to match any <identifier.icon ... /> pattern
const jsxIconPattern = /<([a-z][a-zA-Z]*)\.(icon)\s+className="([^"]*)"(\s*\/?>)/g;

for (const file of filesToFix) {
  try {
    let c = fs.readFileSync(file, 'utf8');
    
    // Replace <x.icon className="..." /> with <FontAwesomeIcon icon={x.icon} className="..." />
    c = c.replace(/<([a-z][a-zA-Z]*)\.icon className="([^"]*)"\s*\/>/g, (match, varName, cls) => {
      return `<FontAwesomeIcon icon={${varName}.icon} className="${cls}" />`;
    });
    
    // Also handle JSX <Icon.icon ... /> (capital I)
    c = c.replace(/<([A-Z][a-zA-Z]*)\.icon className="([^"]*)"\s*\/>/g, (match, varName, cls) => {
      return `<FontAwesomeIcon icon={${varName}.icon} className="${cls}" />`;
    });
    
    fs.writeFileSync(file, c);
    console.log(`Fixed: ${file}`);
  } catch (e) {
    console.log(`Skipped (not found): ${file} - ${e.message}`);
  }
}

console.log('Done!');
