import fs from 'node:fs';
import {expandedArticles,guideCopy} from './index.mjs';

const separator='\n\nZXKCSEPARATORZX\n\n';
const protectedTerms=new Map([
  ['Cartagena','ZXKCARTAGENAZX'],
  ['La Boquilla','ZXKLABOQUILLAZX'],
  ['Salinas del Rey','ZXKSALINASZX'],
  ['Manzanillo','ZXKMANZANILLOZX'],
  ['Las Velas','ZXKLASVELASZX'],
  ['kitesurfing','ZXKKITESURFZX'],
  ['kitesurf','ZXKKITESURFZX'],
  ['Kitesurfing','ZXKKITESURFCAPZX'],
  ['Kitesurf','ZXKKITESURFCAPZX'],
  ['kiteboarding','ZXKKITEBOARDINGZX'],
  ['kite','ZXKKITEZX'],
  ['Kite','ZXKKITECAPZX'],
  ['wing foil','ZXKWINGFOILZX'],
  ['SUP','ZXKSUPZX'],
  ['WhatsApp','ZXKWHATSAPPZX'],
  ['DIMAR','ZXKDIMARZX'],
  ['IKO','ZXKIKOZX']
]);

function protect(text){
  let value=text;
  for(const [term,token] of protectedTerms)value=value.replaceAll(term,token);
  return value;
}

function restore(text){
  let value=text;
  for(const [term,token] of protectedTerms)value=value.replaceAll(token,term);
  return value
    .replaceAll('kitesurfing','kitesurf')
    .replaceAll('Kitesurfing','Kitesurf')
    .replaceAll('cours kitesurf','cours de kitesurf')
    .replaceAll('leçon kite','cours de kitesurf')
    .replaceAll('leçons kite','cours de kitesurf')
    .replaceAll('dans kitesurf','en kitesurf')
    .replaceAll('pour kite','pour le kitesurf')
    .replaceAll('Pour kite','Pour le kitesurf')
    .replaceAll('Quand kite','Quand le kitesurf')
    .replaceAll('cyclistes','pratiquants')
    .replaceAll('cavaliers','pratiquants')
    .replaceAll('cavalier','pratiquant')
    .replaceAll('coureurs','pratiquants')
    .replaceAll('coureur','pratiquant')
    .replaceAll('pilote expérimenté','pratiquant expérimenté')
    .replaceAll('tableaux','planches')
    .replaceAll('tableau','planche')
    .replaceAll('Un bar,','Une barre,')
    .replaceAll('un bar,','une barre,')
    .replaceAll('corps traîné','body drag')
    .replaceAll('glissement du corps','body drag')
    .replaceAll('rouler','naviguer')
    .replaceAll('roulez','naviguez')
    .replaceAll('roulé','navigué')
    .replaceAll('un système alimenté par kite','un système de traction par kite')
    .trim();
}

async function translate(text){
  const params=new URLSearchParams({client:'gtx',sl:'en',tl:'fr',dt:'t',q:protect(text)});
  const response=await fetch('https://translate.googleapis.com/translate_a/single?'+params);
  if(!response.ok)throw new Error(`Translation HTTP ${response.status}`);
  const data=await response.json();
  return restore(data[0].map(part=>part[0]).join(''));
}

async function translateArticle(article){
  const [slug]=article;
  const {title,desc,sections}=guideCopy.en[slug];
  const source=[title,desc,...sections.flat()].join(separator);
  let translated=await translate(source);
  let parts=translated.split('ZXKCSEPARATORZX').map(part=>part.trim());
  if(parts.length!==2+sections.length*2){
    parts=[];
    for(const value of [title,desc,...sections.flat()])parts.push(await translate(value));
  }
  const [frTitle,frDesc,...rest]=parts;
  const frSections=[];
  for(let i=0;i<rest.length;i+=2)frSections.push([rest[i],rest[i+1]]);
  return [slug,frTitle,frDesc,frSections];
}

const translated=[];
for(let i=0;i<expandedArticles.length;i+=4){
  const batch=expandedArticles.slice(i,i+4);
  translated.push(...await Promise.all(batch.map(translateArticle)));
  process.stdout.write(`\rTranslated ${translated.length}/${expandedArticles.length}`);
}

const output=`// French localization generated from the reviewed English editorial source and sampled before release.\nexport default ${JSON.stringify(translated,null,2)};\n`;
fs.writeFileSync(new URL('./expansion-all-fr.mjs',import.meta.url),output);
console.log('\nFrench expansion written.');
