const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(/icon: Package/g, 'icon: faBox');
c = c.replace(/icon: Users/g, 'icon: faUsers');
c = c.replace(/icon: FileText/g, 'icon: faFileLines');
c = c.replace(/icon: Globe/g, 'icon: faGlobe');
c = c.replace(/icon: TrendingUp/g, 'icon: faArrowTrendUp');
c = c.replace(/icon: Zap/g, 'icon: faBolt');
c = c.replace(/<stat\.icon className="size-6 text-primary" \/>/g, '<FontAwesomeIcon icon={stat.icon} className="size-6 text-primary" />');
c = c.replace(/<feature\.icon className="size-6 text-primary" \/>/g, '<FontAwesomeIcon icon={feature.icon} className="size-6 text-primary" />');

fs.writeFileSync('src/app/page.tsx', c);
