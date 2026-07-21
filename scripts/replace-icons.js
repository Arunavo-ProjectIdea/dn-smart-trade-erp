const fs = require('fs');
const path = require('path');

const iconMap = {
  Search: "faSearch",
  Bell: "faBell",
  User: "faUser",
  Menu: "faBars",
  Moon: "faMoon",
  Sun: "faSun",
  Monitor: "faDesktop",
  Info: "faInfoCircle",
  ArrowUpRight: "faArrowUpRightFromSquare",
  ArrowRight: "faArrowRight",
  ArrowLeft: "faArrowLeft",
  ArrowUp: "faArrowUp",
  ArrowDown: "faArrowDown",
  ChevronUp: "faChevronUp",
  ChevronDown: "faChevronDown",
  ChevronRight: "faChevronRight",
  ChevronLeft: "faChevronLeft",
  Check: "faCheck",
  X: "faXmark",
  File: "faFile",
  FileText: "faFileLines",
  Upload: "faUpload",
  Plus: "faPlus",
  Edit: "faPen",
  Trash: "faTrash",
  Trash2: "faTrash",
  Settings: "faGear",
  HelpCircle: "faCircleQuestion",
  PieChart: "faChartPie",
  TrendingUp: "faArrowTrendUp",
  Filter: "faFilter",
  Download: "faDownload",
  MoreHorizontal: "faEllipsis",
  Eye: "faEye",
  EyeOff: "faEyeSlash",
  LayoutDashboard: "faTableColumns",
  Package: "faBox",
  Users: "faUsers",
  FileBox: "faFileInvoice",
  Calculator: "faCalculator",
  FileDigit: "faFileCode",
  LogOut: "faArrowRightFromBracket",
  UserCircle: "faCircleUser",
  MessageSquare: "faMessage",
  Send: "faPaperPlane",
  Paperclip: "faPaperclip",
  Bot: "faRobot",
  Building2: "faBuilding",
  Mail: "faEnvelope",
  Phone: "faPhone",
  MapPin: "faLocationDot",
  Calendar: "faCalendar",
  Clock: "faClock",
  CreditCard: "faCreditCard",
  Briefcase: "faBriefcase",
  BadgeAlert: "faTriangleExclamation",
  CircleCheck: "faCircleCheck",
  CircleAlert: "faCircleExclamation",
  AlertCircle: "faCircleExclamation",
  Loader2: "faSpinner",
  Activity: "faChartLine",
  ArrowDownRight: "faArrowTrendDown",
  CheckCircle2: "faCircleCheck",
  AlertTriangle: "faTriangleExclamation",
  FileSpreadsheet: "faFileExcel",
  GripVertical: "faGripLinesVertical",
  Globe: "faGlobe",
  Link: "faLink",
  Mic: "faMicrophone",
  TerminalSquare: "faTerminal",
  Zap: "faBolt",
  ShieldAlert: "faShieldHalved",
  ChevronLast: "faForwardStep",
  ChevronFirst: "faBackwardStep",
  RefreshCcw: "faRotate",
  RefreshCw: "faRotateRight",
  Files: "faCopy",
  MoreVertical: "faEllipsisVertical",
  Wallet: "faWallet",
  CirclePlus: "faCirclePlus",
  FileUp: "faFileArrowUp",
  DownloadIcon: "faDownload",
  Box: "faBox",
  Map: "faMap",
  LogOutIcon: "faArrowRightFromBracket"
};

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(filePath, fileList);
      }
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = walk(path.join(__dirname, '../src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('lucide-react')) {
    // 1. Find the lucide-react import
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];?/g;
    let match;
    let iconsToImport = new Set();
    
    while ((match = importRegex.exec(content)) !== null) {
      const importedIcons = match[1].split(',').map(s => s.trim()).filter(s => s);
      for (let icon of importedIcons) {
        let alias = icon;
        let original = icon;
        if (icon.includes(' as ')) {
          [original, alias] = icon.split(' as ').map(s => s.trim());
        }
        
        let faIconName = iconMap[original] || "faCircle";
        iconsToImport.add(faIconName);
        
        const jsxRegex1 = new RegExp(`<${alias}(\\s+[^>]*)/>`, 'g');
        const jsxRegex2 = new RegExp(`<${alias}(\\s+[^>]*)>`, 'g');
        const jsxRegex3 = new RegExp(`</${alias}>`, 'g');
        
        content = content.replace(jsxRegex1, (m, props) => {
          if (original === 'Loader2') {
             if (props.includes('className=')) {
                props = props.replace(/className=["']([^"']*)["']/, 'className="$1 fa-spin"');
             } else {
                props += ' className="fa-spin"';
             }
          }
          return `<FontAwesomeIcon icon={${faIconName}}${props}/>`;
        });
        
        content = content.replace(jsxRegex2, `<FontAwesomeIcon icon={${faIconName}}$1>`);
        content = content.replace(jsxRegex3, `</FontAwesomeIcon>`);
      }
    }
    
    if (iconsToImport.size > 0) {
      const faImports = `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";\nimport { ${Array.from(iconsToImport).join(', ')} } from "@fortawesome/free-solid-svg-icons";`;
      content = content.replace(importRegex, faImports);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Replaced icons in ${file}`);
  }
}
