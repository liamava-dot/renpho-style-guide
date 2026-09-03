const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
const outDir = path.join(__dirname, '../../raw');
fs.mkdirSync(outDir, { recursive: true });

const styleMatch = src.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

const tabs = ['general', 'packaging', 'amazon', 'compliance', 'templates', 'products'];
const sectionRe = /<div class="section" data-categories="(\w+)">([\s\S]*?)(?=<div class="section" data-categories="|<\/div>\s*<script>)/g;

const sectionsByTab = {};
tabs.forEach(t => sectionsByTab[t] = []);

let m;
while ((m = sectionRe.exec(src)) !== null) {
  const cat = m[1];
  if (sectionsByTab[cat]) sectionsByTab[cat].push(m[0]);
}

const tabLabels = {
  general: 'General', packaging: 'Packaging', amazon: 'Amazon',
  compliance: 'Compliance', templates: 'Templates', products: 'Products'
};

tabs.forEach(tab => {
  const sections = sectionsByTab[tab];
  if (!sections.length) return;

  const cleaned = sections.map(s =>
    s.replace(/ onclick="toggleSection\(this\)"/g, '')
     .replace(/class="section-header"/g, 'class="section-header" style="cursor:default"')
     .replace(/class="collapsed /g, 'class="')
  ).join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RENPHO Style Guide — ${tabLabels[tab]}</title>
<style>${css}
.sticky-header { position: static; border-bottom: none; }
.tabs, .search-wrap { display: none; }
#content { padding: 20px; }
.section-header::before { display: none; }
.collapsed .section-body { display: block; }
</style>
</head>
<body>
<div style="padding: 16px 20px;">
  <h1 style="font-size:20px; font-weight:700; color:#111; margin-bottom:16px;">RENPHO Style Guide — ${tabLabels[tab]}</h1>
</div>
<div id="content">
${cleaned}
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, tab + '.html'), html);
  console.log('Generated raw/' + tab + '.html');
});
