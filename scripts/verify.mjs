import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const languages=["en","tr","de","fr","es","it","nl","sv","da","no","fi","zh"];
const htmlFiles=(await fs.readdir(path.join(root,'tools'))).filter((file)=>file.endsWith('.html'));
if(htmlFiles.length!==1) throw new Error('Expected exactly one static HTML tool page.');
const html=await fs.readFile(path.join(root,'tools',htmlFiles[0]),'utf8');
if(!html.includes('https://pratix.io')) throw new Error('Pratix.io base-site link is missing.');
if(!html.includes('pratix-theme') && !html.includes('themeBtn') && !html.includes('id=\"theme\"')) throw new Error('Theme control is missing.');
for(const language of languages){const languagePattern=new RegExp('(?:[\\\'\\\"]?'+language+'[\\\'\\\"]?\\s*:)');if(!languagePattern.test(html)) throw new Error('Language code not found: '+language);}
const localeDir=path.join(root,'locales');
try{const files=await fs.readdir(localeDir);const localeFiles=files.filter((file)=>file.endsWith('.json'));if(localeFiles.length){for(const language of languages){if(!files.includes(language+'.json')) throw new Error('Locale file is missing: '+language);const data=JSON.parse(await fs.readFile(path.join(localeDir,language+'.json'),'utf8'));if(!Object.keys(data).length) throw new Error('Locale file is empty: '+language);}}}catch(error){if(error.code!=='ENOENT') throw error;}
console.log('Static verification passed for '+path.basename(root)+'.');
