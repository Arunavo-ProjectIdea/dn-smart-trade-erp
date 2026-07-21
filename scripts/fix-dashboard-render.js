const fs = require('fs');
let c = fs.readFileSync('src/app/(app)/dashboard/page.tsx', 'utf8');

c = c.replace(
  '<stat.icon className="size-5 text-primary" />',
  '<FontAwesomeIcon icon={stat.icon} className="size-5 text-primary" />'
);

fs.writeFileSync('src/app/(app)/dashboard/page.tsx', c);
