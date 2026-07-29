const fs = require('fs');
let c = fs.readFileSync('src/app/(app)/dashboard/page.tsx', 'utf8');

c = c.replace('icon: Package', 'icon: faBox');
c = c.replace('icon: FileText', 'icon: faFileLines');
c = c.replace('icon: FileCheck', 'icon: faFileLines');
c = c.replace('icon: Users', 'icon: faUsers');
c = c.replace('icon: Briefcase', 'icon: faBriefcase');
c = c.replace('icon: DollarSign', 'icon: faBox');

fs.writeFileSync('src/app/(app)/dashboard/page.tsx', c);
