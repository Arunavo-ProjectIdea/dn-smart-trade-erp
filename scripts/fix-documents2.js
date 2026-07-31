const fs = require('fs');
let c = fs.readFileSync('src/app/(app)/documents/page.tsx', 'utf8');

// Replace all potentially undefined icons with faFileLines
c = c.replace(/faFileCheck/g, 'faFileLines');
c = c.replace(/faFileSpreadsheet/g, 'faFileExcel');
c = c.replace(/faImageIcon/g, 'faFileImage'); // just in case
c = c.replace(/faArchive/g, 'faFileZipper'); // just in case

// Fix JSX
c = c.replace(/<typeInfo\.icon /g, '<FontAwesomeIcon icon={typeInfo.icon} ');
c = c.replace(/<FileIcon className="h-4 w-4" \/>/g, '<FontAwesomeIcon icon={faFileIcon} className="h-4 w-4" />');
c = c.replace(/<Icon className="h-8 w-8 text-primary" \/>/g, '<FontAwesomeIcon icon={Icon} className="h-8 w-8 text-primary" />');
c = c.replace(/<typeInfo\.icon className="h-6 w-6" \/>/g, '<FontAwesomeIcon icon={typeInfo.icon} className="h-6 w-6" />');

fs.writeFileSync('src/app/(app)/documents/page.tsx', c);
