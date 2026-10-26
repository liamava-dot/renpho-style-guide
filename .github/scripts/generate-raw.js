const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
const outDir = path.join(__dirname, '../../raw');
fs.mkdirSync(outDir, { recursive: true });

const styleMatch = src.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

const tabs = ['general', 'packaging', 'amazon', 'compliance', 'templates', 'products'];
// Match section starts, then balance divs so navigation wrappers are never exported.
const sectionRe = /<div class="section" data-categories="(\w+)"[^>]*>/g;
const sectionsByTab = {};
tabs.forEach(t => sectionsByTab[t] = []);

let m;
while ((m = sectionRe.exec(src)) !== null) {
  const divRe = /<\/?div\b[^>]*>/g;
  divRe.lastIndex = sectionRe.lastIndex;
  let depth = 1, token;
  while (depth && (token = divRe.exec(src))) {
    depth += token[0].startsWith('</') ? -1 : 1;
  }
  if (depth) throw new Error('Unclosed section: ' + m[1]);
  if (sectionsByTab[m[1]]) sectionsByTab[m[1]].push(src.slice(m.index, divRe.lastIndex));
  sectionRe.lastIndex = divRe.lastIndex;
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
     .replace(/<button class="section-toggle"[^>]*>([\s\S]*?)<\/button>/g, '$1')
     .replace(/class="section-header"/g, 'class="section-header" style="cursor:default"')
     .replace(/class="collapsed /g, 'class="')
     .replace(/ onclick="openFsaHsaTemplate\(event\)"/g, '')
  ).join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RENPHO Style Guide — ${tabLabels[tab]}</title>
<style>${css}
html, body { height: auto; overflow: visible; }
body { padding-top: 0; }
.sticky-header { position: static; border-bottom: none; }
.tabs, .search-wrap { display: none; }
#content { padding: 20px; }
.section-header::before { display: none; }
.section-chevron { display: none; }
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

