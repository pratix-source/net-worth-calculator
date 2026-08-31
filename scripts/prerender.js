const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'tools/net-worth-calculator.html'), 'utf8');
const dist = path.join(root, 'dist');
const origin = 'https://pratix.io';
const metadata = { title: 'Net Worth Calculator | Pratix.io', description: 'Calculate and track your net worth by comparing assets and liabilities privately in your browser.', route: '/en/tools/net-worth-calculator.html' };
function esc(v) { return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;'); }
function replaceTag(html, pattern, replacement) { return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', replacement + '\n</head>'); }
let html = source.replaceAll('https://yourdomain.com', origin);
html = replaceTag(html, /<html\s+lang="[^"]*"[^>]*>/, '<html lang="en">');
html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(metadata.title)}</title>`);
html = replaceTag(html, /<meta\s+name="description"[^>]*>/, `<meta name="description" content="${esc(metadata.description)}" />`);
html = replaceTag(html, /<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${origin}${metadata.route}" />`);
html = replaceTag(html, /<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(metadata.title)}" />`);
html = replaceTag(html, /<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(metadata.description)}" />`);
html = replaceTag(html, /<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${origin}${metadata.route}" />`);
html = html.replace('</head>', `  <meta name="twitter:card" content="summary" />\n  <meta name="twitter:title" content="${esc(metadata.title)}" />\n  <meta name="twitter:description" content="${esc(metadata.description)}" />\n  <link rel="alternate" hreflang="en" href="${origin}${metadata.route}" data-prerender-hreflang="true" />\n  <link rel="alternate" hreflang="x-default" href="${origin}${metadata.route}" data-prerender-hreflang="true" />\n</head>`);
html = html.replace('<body>', `<body>\n<section id="prerendered-seo-content"><h1>${esc(metadata.title)}</h1><p>${esc(metadata.description)}</p></section>`);
fs.rmSync(dist, {recursive:true, force:true});
const output = path.join(dist, metadata.route.replace(/^\//, ''));
fs.mkdirSync(path.dirname(output), {recursive:true});
fs.writeFileSync(output, html);
fs.writeFileSync(path.join(dist, 'index.html'), html);
console.log(`Prerendered ${output}`);
