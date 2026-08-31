const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist', 'en/tools/net-worth-calculator.html'), 'utf8');
const required = ['<title>Net Worth Calculator | Pratix.io</title>', '<link rel="canonical" href="https://pratix.io/en/tools/net-worth-calculator.html" />', 'calculate', 'input', 'prerendered-seo-content'];
const missing = required.filter(x => !html.includes(x));
if (missing.length) throw new Error(`Missing markers: ${missing.join(', ')}`);
if ((html.match(/data-prerender-hreflang="true"/g) || []).length !== 2) throw new Error('Expected 2 hreflang links');
console.log('Static SEO and calculator markers: passed');
