const fs = require('fs');
let c = fs.readFileSync('src/app/(app)/documents/page.tsx', 'utf8');

c = c.replace(/<FileIcon className="h-6 w-6" \/>/g, '<FontAwesomeIcon icon={faFileIcon} className="h-6 w-6" />');

fs.writeFileSync('src/app/(app)/documents/page.tsx', c);
