const fs = require('fs');
let c = fs.readFileSync('src/components/erp/data-table.tsx', 'utf8');
c = c.replace(
  `<div className="rounded-md border">\r\n        <Table>\r\n          <TableHeader>`,
  `<div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm relative w-full overflow-auto">\r\n        <Table>\r\n          <TableHeader className="bg-background/80 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_rgba(255,255,255,0.05)]">`
);
c = c.replace(
  `<div className="rounded-md border">\n        <Table>\n          <TableHeader>`,
  `<div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm relative w-full overflow-auto">\n        <Table>\n          <TableHeader className="bg-background/80 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_rgba(255,255,255,0.05)]">`
);
c = c.replace(
  `<TableRow>`,
  `<TableRow className="hover:bg-transparent border-b-0">`
);
fs.writeFileSync('src/components/erp/data-table.tsx', c);
