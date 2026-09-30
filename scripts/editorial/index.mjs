import es from './es.mjs';
import en from './en.mjs';
import fr from './fr.mjs';
import de from './de.mjs';
import pt from './pt.mjs';
import it from './it.mjs';
import ru from './ru.mjs';
import zh from './zh.mjs';
import ko from './ko.mjs';
import ja from './ja.mjs';
import decisions from './expansion-decisions.mjs';
import learning from './expansion-learning.mjs';
import gear from './expansion-gear.mjs';
import travel from './expansion-travel.mjs';
import disciplines from './expansion-disciplines.mjs';
import decisionsEn from './expansion-decisions-en.mjs';
import learningEn from './expansion-learning-en.mjs';
import gearEn from './expansion-gear-en.mjs';
import travelEn from './expansion-travel-en.mjs';
import disciplinesEn from './expansion-disciplines-en.mjs';
import searchDemand from './expansion-search-demand.mjs';
import searchDemandEn from './expansion-search-demand-en.mjs';
import expansionFr from './expansion-all-fr.mjs';
export const expandedArticles=[...decisions,...learning,...gear,...travel,...disciplines,...searchDemand];
export const articleDetails=Object.fromEntries(expandedArticles.map(([slug,title,desc,tag,parent,service,sections])=>[slug,{parent,service,tag}]));

export const guideCopy = {es};
for(const [slug,title,desc,tag,parent,service,sections] of expandedArticles) {
 if(es[slug])throw new Error('Duplicate article '+slug);
 es[slug]={title,desc,sections};
}
for (const [lang, entries] of Object.entries({en,fr,de,pt,it,ru,zh,ko,ja})) {
 guideCopy[lang] = Object.fromEntries(Object.entries(entries).map(([slug,[title,desc,...sections]])=>[slug,{title,desc,sections}]));
}
for(const [slug,title,desc,sections] of [...decisionsEn,...learningEn,...gearEn,...travelEn,...disciplinesEn,...searchDemandEn]){
 if(!articleDetails[slug]||guideCopy.en[slug])throw new Error('Invalid English expansion '+slug);
 guideCopy.en[slug]={title,desc,sections};
}
for(const [slug,title,desc,sections] of expansionFr){
 if(!articleDetails[slug]||guideCopy.fr[slug])throw new Error('Invalid French expansion '+slug);
 guideCopy.fr[slug]={title,desc,sections};
}

// One owner per search intent. Retired URLs redirect directly to that owner.
export const clusters = {
 'complete-guide':['airport-la-boquilla','usa-trip','europe-trip','couples','three-day-itinerary','five-day-itinerary','seven-day-itinerary','where-to-stay','travel-insurance'],
 'best-time':['december-kitesurf','january-kitesurf','february-kitesurf','march-kitesurf','april-kitesurf','may-november-kitesurf','rainy-season'],
 'first-lesson':['beginners-fear','swimming-required','fitness-required','minimum-age','what-to-wear'],
 'how-long':['water-start','ride-upwind'],
 'safety-checklist':['beach-etiquette','self-rescue','sun-hydration'],
 'la-boquilla-guide':['la-boquilla-beginners','manzanillo-kitesurf','las-velas-kitesurf','cartagena-vs-salinas'],
 'packing-list':['airline-baggage','travel-repair-kit'],
 'kite-size':[],
 'book-whatsapp':['booking-details-cartagena','payments-cancellations-kitesurf','book-kitesurf-advance'],
 'choose-course':['private-vs-group','course-vs-rental'],
 'rental-requirements':['rent-or-bring-gear'],
 'wind-sources':['wind-speed-beginners','trade-winds-cartagena','morning-vs-afternoon','no-wind-plan'],
 'kite-vs-wing':[],
 'kite-repair':['bladder-valve-repair','canopy-tear-repair','lines-bar-repair'],
 'saltwater-gear-care':['kite-line-wear']
};
export const articleRedirects=Object.fromEntries(Object.entries(clusters).flatMap(([target,slugs])=>slugs.map(slug=>[slug,target])));
export const resolveArticle=slug=>articleRedirects[slug]||slug;
export const guideRelations={
 'complete-guide':['best-time','packing-list','book-whatsapp'],
 'best-time':['wind-sources','complete-guide','kite-size'],
 'first-lesson':['how-long','choose-course','safety-checklist'],
 'how-long':['choose-course','rental-requirements','safety-checklist'],
 'safety-checklist':['wind-sources','saltwater-gear-care','first-lesson'],
 'la-boquilla-guide':['wind-sources','complete-guide','safety-checklist'],
 'packing-list':['rental-requirements','saltwater-gear-care','complete-guide'],
 'kite-size':['wind-sources','rental-requirements','kite-repair'],
 'book-whatsapp':['choose-course','best-time','complete-guide'],
 'choose-course':['first-lesson','how-long','rental-requirements'],
 'rental-requirements':['kite-size','safety-checklist','packing-list'],
 'wind-sources':['best-time','kite-size','book-whatsapp'],
 'kite-vs-wing':['choose-course','first-lesson','la-boquilla-guide'],
 'kite-repair':['saltwater-gear-care','packing-list','kite-size'],
 'saltwater-gear-care':['kite-repair','packing-list','rental-requirements']
};
export const editorialUi={
 es:['En esta guía','Guías relacionadas','Leer la guía','Equipo editorial Kite Cartagena · Revisión: 27/09/2026','Referencia oficial','Consulta el servicio','Preguntas generales'],
 en:['In this guide','Related guides','Read the guide','Kite Cartagena editorial team · Reviewed: 2026-09-27','Official reference','Explore the service','General questions'],
 fr:['Dans ce guide','Guides associés','Lire le guide','Équipe éditoriale Kite Cartagena · Révision : 27/09/2026','Référence officielle','Consulter le service','Questions générales'],
 de:['In diesem Guide','Weitere Guides','Guide lesen','Redaktion Kite Cartagena · Stand: 27.09.2026','Offizielle Referenz','Angebot ansehen','Allgemeine Fragen'],
 pt:['Neste guia','Guias relacionados','Ler o guia','Equipe editorial Kite Cartagena · Revisão: 27/09/2026','Referência oficial','Consultar o serviço','Perguntas gerais'],
 it:['In questa guida','Guide correlate','Leggi la guida','Redazione Kite Cartagena · Revisione: 27/09/2026','Riferimento ufficiale','Consulta il servizio','Domande generali'],
 ru:['В этом материале','Связанные материалы','Читать','Редакция Kite Cartagena · Проверено: 27.09.2026','Официальный источник','Посмотреть услугу','Общие вопросы'],
 zh:['本篇目录','相关指南','阅读指南','Kite Cartagena 编辑团队 · 修订：2026-09-27','官方参考','查看服务','常见问题'],
 ko:['이 가이드의 내용','관련 가이드','가이드 읽기','Kite Cartagena 편집팀 · 검토: 2026-09-27','공식 참고 자료','서비스 보기','일반 질문'],
 ja:['このガイドの内容','関連ガイド','ガイドを読む','Kite Cartagena 編集チーム · 確認: 2026-09-27','公式参考資料','サービスを見る','一般的な質問']
};
export const blogDescriptions={
 es:'Guías para elegir fechas, preparar tu primera clase, organizar el viaje y entender el equipo. Encuentra respuestas por tema y continúa con la guía que necesitas.',
 en:'Guides to choosing dates, preparing your first lesson, planning a trip and understanding equipment. Find the topic that answers your next question.',
 fr:'Des guides pour choisir les dates, préparer un premier cours, organiser le voyage et comprendre le matériel. Retrouvez les réponses par thème.',
 de:'Guides für Reisedaten, die erste Stunde, Reiseplanung und Ausrüstung. Finde nach Thema die Antwort auf deine nächste Frage.',
 pt:'Guias para escolher datas, preparar a primeira aula, organizar a viagem e entender o equipamento. Encontre respostas por tema.',
 it:'Guide per scegliere le date, preparare la prima lezione, organizzare il viaggio e conoscere il materiale. Trova le risposte per argomento.',
 ru:'Материалы о датах поездки, первом уроке, маршруте и снаряжении. Выберите тему и найдите ответ на следующий вопрос.',
 zh:'按主题查找旅行日期、第一堂课、行程和装备指南，找到当前问题的具体答案。',
 ko:'여행 날짜, 첫 강습, 일정과 장비 가이드를 주제별로 찾아 다음 질문의 답을 확인하세요.',
 ja:'旅行日程、初めての講習、旅の準備と用具をテーマ別に探し、次の疑問への答えを見つけます。'
};
export const sourceCatalog={
 climate:['CIOH-DIMAR · Climatología de Cartagena','https://cioh.dimar.mil.co/index.php/es/areas-del-conocimiento/sm-oceanografia-operacional/productos-y-servicios-arope/climatologia-puertos-caribe-colombiano'],
 forecast:['DIMAR · SIPSEM','https://meteorologia.dimar.mil.co/'],
 iko:['IKO · Courses and certifications','https://www.ikointl.com/courses'],
 learning:['IKO · Training videos','https://www.ikointl.com/elearning/videos'],
 care:['Duotone · Repair & care','https://www.duotonesports.com/en/us/kiteboarding/more/service/repair-and-care'],
 lines:['Duotone · Line length and kite handling','https://duotone-helpcenter.gorgias.help/en-US/i-have-noticed-that-i-have-different-line-lengths-can-minimal-differences-in-the-line-length-have-an-influence-on-the-flying-characteristics-of-my-kite-403463'],
 colombia:['IKO · Kitesurfing destinations in Colombia','https://www.ikointl.com/es/destinos/kitesurfing-colombia']
};
export const guideSources={
 'best-time':['climate','forecast'], 'wind-sources':['forecast','climate'],
 'first-lesson':['iko','learning'], 'how-long':['iko','learning'],
 'safety-checklist':['learning','forecast'], 'kite-size':['lines','forecast'],
 'choose-course':['iko'], 'kite-vs-wing':['iko','learning'],
 'kite-repair':['care','lines'], 'saltwater-gear-care':['care','lines']
};
guideSources['cartagena-es-buena-para-kitesurf']=['climate','forecast','colombia'];
guideSources['donde-hacer-kitesurf-colombia']=['colombia','forecast'];
guideSources['kitesurf-con-lluvia-cartagena']=['forecast'];
// Coverage is mandatory; no fallback to a repeated category paragraph or another language.
for(const [slug,{parent}] of Object.entries(articleDetails)) {
 if(articleRedirects[slug])throw new Error('New article conflicts with retired URL '+slug);
 guideRelations[slug]=[parent,...guideRelations[parent].filter(x=>x!==parent).slice(0,2)];
 if(['beginner','safety'].includes(articleDetails[slug].tag))guideSources[slug]=['learning'];
 if(['gear','repair'].includes(articleDetails[slug].tag))guideSources[slug]=['care'];
}
for(const [lang,entries] of Object.entries(guideCopy)) {
 for(const slug of Object.keys(entries)) {
  const entry=entries[slug];
  if(!entry?.title||!entry.desc||entry.sections.length<4)throw new Error(`Incomplete guide: ${lang}/${slug}`);
  if(entry.sections.some(([h,p])=>!h||!p))throw new Error(`Empty section: ${lang}/${slug}`);
 }
 if(Object.keys(entries).length!==(['es','en','fr'].includes(lang)?86:15))throw new Error(`Unexpected guides: ${lang}`);
}
