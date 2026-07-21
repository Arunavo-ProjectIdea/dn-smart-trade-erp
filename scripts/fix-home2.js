const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(/<stat\.icon className="([^"]*)" \/>/g, '<FontAwesomeIcon icon={stat.icon} className="$1" />');
c = c.replace(/<feature\.icon className="([^"]*)" \/>/g, '<FontAwesomeIcon icon={feature.icon} className="$1" />');

fs.writeFileSync('src/app/page.tsx', c);
