import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {expandedArticles,guideCopy} from './index.mjs';

const python=process.env.KITE_TRANSLATION_PYTHON;
const packages=process.env.KITE_TRANSLATION_PACKAGES;
const model=process.env.KITE_TRANSLATION_MODEL;
if(!python||!packages||!model)throw new Error('Set KITE_TRANSLATION_PYTHON, KITE_TRANSLATION_PACKAGES and KITE_TRANSLATION_MODEL');

const protectedTerms=new Map([
 ['Cartagena','ZXKCARTAGENAZX'],['La Boquilla','ZXKLABOQUILLAZX'],['Salinas del Rey','ZXKSALINASZX'],
 ['Manzanillo','ZXKMANZANILLOZX'],['Las Velas','ZXKLASVELASZX'],['Kitesurfing','ZXKKITESURFCAPZX'],
 ['Kitesurf','ZXKKITESURFCAPZX'],['kitesurfing','ZXKKITESURFZX'],['kitesurf','ZXKKITESURFZX'],
 ['kiteboarding','ZXKKITEBOARDINGZX'],['kite','ZXKKITEZX'],['Kite','ZXKKITECAPZX'],
 ['wing foil','ZXKWINGFOILZX'],['body drag','ZXKBODYDRAGZX'],['water start','ZXKWATERSTARTZX'],
 ['upwind','ZXKUPWINDZX'],['rider','ZXKRIDERZX'],['SUP','ZXKSUPZX'],['WhatsApp','ZXKWHATSAPPZX'],
 ['DIMAR','ZXKDIMARZX'],['IKO','ZXKIKOZX']
]);

function protect(text){let value=text;for(const [term,token] of protectedTerms)value=value.replaceAll(term,token);return value}
function restore(text){
 let value=text;for(const [term,token] of protectedTerms)value=value.replaceAll(token,term);
 return value.replaceAll('ZXKKITESURFCAPPZX','Kitesurfing').replaceAll('ZXKKITEZ','kite')
  .replaceAll('ZXKSAINASZX','Salinas del Rey')
  .replaceAll('kite surf','kitesurf').replaceAll('Kite surf','Kitesurf')
  .replaceAll('body arrasto','body drag').replaceAll('partida na água','water start')
  .replaceAll('início de água','water start').replaceAll('piloto','rider').replaceAll('cavaleiro','rider')
  .replaceAll('preço do gol','preço do resultado').replaceAll('barra kite','barra de kite')
  .replaceAll('posição kite','posição do kite').replaceAll('sessão kite','sessão de kitesurf')
  .replaceAll('retransmissão da água','relaunch na água').replace(/\bgol\b/gi,'objetivo')
  .replace(/\btabuleiro\b/gi,'prancha').replace(/\btábua\b/gi,'prancha').replace(/\bplaca\b/gi,'prancha')
  .replace(/\bconselho\b/gi,'prancha').replace(/\bpapel alumínio\b/gi,'foil')
  .replace(/\barnês\b/gi,'trapézio').replace(/\barreio\b/gi,'trapézio')
  .replace(/\bbar\b/g,'barra').replace(/\bBar\b/g,'Barra')
  .replaceAll('vento ascendente','barlavento').replaceAll('vento descendente','sotavento')
  .replaceAll('sucessivas tachas','sucessivos bordos').replaceAll('Arrastar o corpo','Body drag')
  .replaceAll('O corpo arrastando','O body drag').replaceAll('Relacionar significa','Fazer o relaunch significa')
  .replaceAll('Relacionar da água','O relaunch na água').replaceAll('Ponta dupla','Twin-tip')
  .replaceAll('Cotonete de casal','Twin-tip').replaceAll('para-saia','parasailing')
  .replaceAll('Solicito ','Solicite ').replaceAll('O quadro é um item separado','A prancha é um item separado')
  .replaceAll('Fotografe o quadro inteiro','Fotografe a prancha inteira')
  .replaceAll('reconheça o quadro que recebe','reconheça a prancha que recebe')
  .replaceAll('tempo no quadro','tempo na prancha').replaceAll('arreios','trapézios')
  .replaceAll('no prancha','na prancha').replaceAll('sobre o prancha','sobre a prancha')
  .replaceAll('sem o prancha','sem a prancha').replaceAll('com o prancha','com a prancha')
  .replaceAll('para o prancha','para a prancha').replaceAll('ao prancha','à prancha')
  .replaceAll('do prancha','da prancha').replaceAll('abaixo da prancha','abaixo da prancha')
  .replaceAll('Alugar um prancha','Alugar uma prancha').replaceAll('onde o prancha','onde a prancha')
  .replaceAll('um prancha direcional','uma prancha direcional').replaceAll('de um prancha','de uma prancha')
  .replaceAll('o barra','a barra').replaceAll('sobre o barra','sobre a barra').trim();
}

const source=[];
for(const [slug] of expandedArticles){
 const {title,desc,sections}=guideCopy.en[slug];
 source.push(title,desc,...sections.flat());
}
const sentenceSegmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const segmented=source.map(text=>[...sentenceSegmenter.segment(text)].map(part=>part.segment.trim()).filter(Boolean));
const translationSource=segmented.flat();
const pythonScript=fileURLToPath(new URL('./translate-argos.py',import.meta.url));
const result=spawnSync(python,[pythonScript,packages,model],{
 input:JSON.stringify(translationSource.map(protect)),encoding:'utf8',maxBuffer:32*1024*1024,
 env:{...process.env,PYTHONUTF8:'1',PYTHONIOENCODING:'utf-8'}
});
if(result.status!==0)throw new Error(result.stderr||`Translator exited ${result.status}`);
const translatedSentences=JSON.parse(result.stdout).map(restore);
let sentenceCursor=0;
const translated=segmented.map(parts=>{
 const value=translatedSentences.slice(sentenceCursor,sentenceCursor+parts.length).join(' ');
 sentenceCursor+=parts.length;
 return value;
});
if(sentenceCursor!==translatedSentences.length)throw new Error(`Unused translated sentences: ${translatedSentences.length-sentenceCursor}`);
let cursor=0;
const articles=expandedArticles.map(([slug])=>{
 const sectionCount=guideCopy.en[slug].sections.length;
 const title=translated[cursor++],desc=translated[cursor++],sections=[];
 for(let i=0;i<sectionCount;i++)sections.push([translated[cursor++],translated[cursor++]]);
 return [slug,title,desc,sections];
});
const bodyDrag=articles.find(([slug])=>slug==='body-drag-purpose');
bodyDrag[3][2][1]='Observe se você manteve uma direção, entendeu as instruções e reconheceu sua posição em relação ao ponto de partida. Registre também quando precisou de ajuda. “Eu fiz body drag” descreve uma atividade; essas observações explicam melhor quais partes da habilidade estão se consolidando.';
if(cursor!==translated.length)throw new Error(`Unused translations: ${translated.length-cursor}`);
const output=`// Brazilian Portuguese localization generated locally from the reviewed English editorial source and audited before release.\nexport default ${JSON.stringify(articles,null,2)};\n`;
fs.writeFileSync(new URL('./expansion-all-pt.mjs',import.meta.url),output);
console.log(`Portuguese expansion written: ${articles.length} guides.`);
