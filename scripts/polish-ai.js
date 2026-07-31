const fs = require('fs');
let c = fs.readFileSync('src/app/(app)/ai-assistant/page.tsx', 'utf8');

// Update Sidebar styling
c = c.replace(
  `div className="hidden lg:flex flex-col w-72 bg-card rounded-2xl border border-border shadow-sm overflow-hidden"`,
  `div className="hidden lg:flex flex-col w-72 bg-card/60 backdrop-blur-md rounded-3xl border border-border/40 shadow-sm overflow-hidden"`
);

// Update Main Chat Interface background
c = c.replace(
  `div className="flex flex-col flex-1 rounded-2xl shadow-sm border border-border bg-card overflow-hidden relative"`,
  `div className="flex flex-col flex-1 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-border/50 bg-card/60 backdrop-blur-3xl overflow-hidden relative"`
);

// Add layout and spring transition to messages
c = c.replace(
  `                      initial={{ opacity: 0, y: 10 }}\n                      animate={{ opacity: 1, y: 0 }}`,
  `                      layout\n                      initial={{ opacity: 0, scale: 0.95, y: 15 }}\n                      animate={{ opacity: 1, scale: 1, y: 0 }}\n                      transition={{ type: "spring", stiffness: 400, damping: 30 }}`
);

// Add layout to thinking indicator
c = c.replace(
  `                      initial={{ opacity: 0, y: 10 }}\n                      animate={{ opacity: 1, y: 0 }}\n                      exit={{ opacity: 0, scale: 0.95 }}`,
  `                      layout\n                      initial={{ opacity: 0, scale: 0.95, y: 15 }}\n                      animate={{ opacity: 1, scale: 1, y: 0 }}\n                      exit={{ opacity: 0, scale: 0.95 }}\n                      transition={{ type: "spring", stiffness: 400, damping: 30 }}`
);

// Update suggested prompt cards
c = c.replace(
  /className="flex items-start gap-4 p-4 rounded-xl border border-border bg-background hover:bg-muted\/30 hover:border-border\/80 transition-all text-left group"/g,
  `className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 text-left group"`
);

// Update user message bubble
c = c.replace(
  `'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'`,
  `'bg-primary text-primary-foreground rounded-[22px] rounded-tr-[4px] shadow-sm'`
);

// Update assistant message bubble
c = c.replace(
  `'bg-muted/40 border border-border/50 text-foreground rounded-2xl rounded-tl-sm'`,
  `'bg-card/80 backdrop-blur-sm border border-border/50 text-foreground rounded-[22px] rounded-tl-[4px] shadow-sm'`
);

// Update input area container
c = c.replace(
  `div className="p-4 bg-background/50 backdrop-blur-xl border-t border-border"`,
  `div className="p-4 bg-background/40 backdrop-blur-2xl border-t border-border/30"`
);

// Update textarea form
c = c.replace(
  `form onSubmit={(e) => handleSend(e)} className="relative flex flex-col w-full rounded-2xl border border-border/80 bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all"`,
  `form onSubmit={(e) => handleSend(e)} className="relative flex flex-col w-full rounded-[24px] border border-border/50 bg-background/80 shadow-[0_2px_20px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all duration-300"`
);

fs.writeFileSync('src/app/(app)/ai-assistant/page.tsx', c);
