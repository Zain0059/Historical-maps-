import type { SlideData, ControlFeature } from '../types';
import reference from './referenceGeography.json';
import romanBoundaries from './romanBoundaries.json';
import modernHistorical from './modernHistoricalBoundaries.json';

type Point = [number, number];
export interface BoundarySource { title: string; url: string; scope: string }
export interface BoundaryPhase {
  id: string;
  label: string;
  year: number;
  summary: string;
  features: ControlFeature[];
  sourceIds: string[];
  limitations: string;
  capital?: SlideData['capital'];
}
export interface BoundaryReview {
  defaultPhaseId?: string;
  status: 'schematic' | 'partial';
  finding: string;
  sourceIds: string[];
  phases?: BoundaryPhase[];
}
export const BOUNDARY_SOURCES: Record<string, BoundarySource> = {
  nubiaHistory: {title:'Kamrin & Oppenheim — The Land of Nubia (The Met, 2018)',url:'https://www.metmuseum.org/essays/nubia',scope:'إدارة النوبة بواسطة نواب الملك؛ لا يثبت النص عرض نطاق صحراوي أو حداً مساحياً'},
  barkalHistory: {title:'Learning Sites / Timothy Kendall — Jebel Barkal, Temple B500 (2019)',url:'https://www.learningsites.com/GebelBarkal-2/GB-B500.php',scope:'تفسير حفائر المعبد ومراحله المصرية، ومنها الأسرة 19؛ وجود المعبد ليس إحداثيات لحد سياسي'},
  barkalPosition: {title:'UNESCO — Gebel Barkal, geographical data',url:'https://whc.unesco.org/en/list/1073/maps/',scope:'موضع جبل البركل، المكوّن 1073-001؛ ليس حدود إقليم نبتة أو النوبة'},
  megiddoPosition: {title:'UNESCO — Tel Megiddo, geographical data',url:'https://whc.unesco.org/en/list/1108/maps/',scope:'موضع تل مجدّو، المكوّن 1108-001؛ العلامة تعرّف الموقع ولا تحدد مساحة المعركة'},
  megiddoCampaign: {title:'Pritchard, Megiddo inscription — reproduced by Joshua J. Mark (2017)',url:'https://www.worldhistory.org/article/1102/thutmose-iiis-battle-of-megiddo-inscription/',scope:'نص حملة تحتمس الثالث، بتأريخ تقريبي نحو 1457 ق.م؛ الرواية الملكية لا ترسم حدود الشام'},
  awmc200: {title:'Ancient World Mapping Center — Roman provinces, 200 CE',url:'https://github.com/AWMC/geodata/tree/master/Cultural-Data/political_shading/roman_empire_ce_200_provinces',scope:'خط الحد الشرقي من بيانات AWMC، السجل 195؛ ODbL 1.0. تعميم أطلسي لا مسح ميداني'},
  awmcLate: {title:'Ancient World Mapping Center — Provinces after Diocletian',url:'https://github.com/AWMC/geodata/tree/master/Cultural-Data/political_shading/roman_empire_provinces%20post_diocletian',scope:'ثلاثة خطوط تقسيم إداري داخل مصر؛ التاريخ تقريبي بعد دقلديانوس ولا يعمم على 550 م'},
  cshapes: {title:'Schvitz et al. — CShapes 2.0 (2022)',url:'https://icr.ethz.ch/data/cshapes/',scope:'مصدر تاريخي معمّم؛ لا يُعامل الاحتلال كنقل للسيادة. ترخيص CC BY-NC-SA 4.0'},
  cshapesDisplay: {title:'CShapes display derivative — fullpuri',url:'https://github.com/harahettarou/fullpuri/tree/HEAD/assets/historical-map/cshapes',scope:'نسخة مشتقة مبسطة هندسياً بمقدار 0.025 درجة؛ بصمات الملفات وطريقة الاستخراج محفوظة في تقرير المصدر'},
  peace1979: {title:'UN Treaty Series — Egypt–Israel Peace Treaty, 1979',url:'https://treaties.un.org/doc/Publication/UNTS/Volume%201138/volume-1138-I-17855-English.pdf',scope:'المادة الأولى والملحق الأول يميزان السيادة من الانسحاب المرحلي؛ ليس اكتمال الانسحاب في مايو 1979'},
  west1925: {title:'اتفاق مصر وإيطاليا بشأن الحدود الغربية، 6 ديسمبر 1925',url:'https://lawsociety.ly/en/convention/agreement-concerning-the-western-borders-of-egypt-for-the-year-1925-ad/',scope:'المادة الأولى والخريطة الملحقة والنفاذ المؤقت؛ لا يثبت أن المطالبات السابقة كانت إدارة فعلية'},
  middle: {title:'Adela Oppenheim — Egypt in the Middle Kingdom (The Met, 2019)',url:'https://www.metmuseum.org/essays/egypt-in-the-middle-kingdom-2030-1640-b-c',scope:'إعادة التوحيد وانتقال العاصمة؛ ليس مصدر حدود هندسية'},
  nubia: {title:'Salvoldi & Geus — A Historical Comparative Gazetteer for Nubia (Dotawo 4, 2017)',url:'https://www.academia.edu/35009091/A_historical_comparative_gazetteer_for_Nubia_Salvoldi_Geus_',scope:'موضع سمنة الغربية 21.494253 شمالاً، 30.960949 شرقاً؛ العلامة ليست ترسيماً لحد الدولة'},
  damascus: {title:'UNESCO — Ancient City of Damascus',url:'https://whc.unesco.org/en/list/20/',scope:'موضع مرجعي للمدينة 33°30′39″ شمالاً، 36°18′35″ شرقاً؛ لا يثبت حدود الشام'},
  sanaa: {title:'UNESCO — Old City of Sana’a',url:'https://whc.unesco.org/en/list/385/',scope:'موضع مرجعي لليمن عند صنعاء، وليس دليلاً على سيطرة متصلة على كل اليمن'},
  early: { title: 'The Met — Egypt, 8000–2000 B.C. (2000)', url: 'https://www.metmuseum.org/toah/ht/02/afe.html', scope: 'التسلسل الزمني وبنية الحكم؛ ليس مصدر إحداثيات حدود' },
  bronze: { title: 'The Met — Egypt, 2000–1000 B.C. (2000)', url: 'https://www.metmuseum.org/toah/ht/03/afe.html', scope: 'النوبة والانتقال الثاني والدولة الحديثة؛ ليس ترسيماً مساحياً' },
  late: { title: 'The Met — Egypt, 1000 B.C.–1 A.D. (2000)', url: 'https://www.metmuseum.org/toah/ht/04/afe.html', scope: 'تغير الحكم الكوشي والآشوري والفارسي والبطلمي' },
  ptolemy: { title: 'Ece Alper — The Ptolemaic Presence Outside Egypt: Material Evidence (Bilkent, 2022)', url: 'https://repository.bilkent.edu.tr/bitstreams/7c175580-6696-45ac-aba1-537e628fc818/download', scope: 'الوجود البطلمي خارج مصر؛ الإحداثيات التوضيحية هنا ليست منقولة من الرسالة' },
  roman: { title: 'The Met — Egypt, 1–500 A.D. (2000)', url: 'https://www.metmuseum.org/toah/ht/05/afe.html', scope: 'الإدارة الرومانية والبيزنطية؛ لا يثبت حدود ولاية واحدة طوال الفترة' },
  islam: { title: 'The Met — Egypt, 500–1000 A.D. (2001)', url: 'https://www.metmuseum.org/toah/ht/06/afe.html', scope: 'التسلسل السياسي من البيزنطيين إلى الفاطميين؛ الترسيم التفصيلي غير متاح' },
  fatimid: { title: 'The Met — The Art of the Fatimid Period (2001)', url: 'https://www.metmuseum.org/essays/the-art-of-the-fatimid-period-909-1171', scope: 'الامتداد الإقليمي العام؛ ليس لقطة جغرافية متزامنة لكل الأقاليم' },
  ayyubid: { title: 'The Met — The Art of the Ayyubid Period (2001)', url: 'https://www.metmuseum.org/essays/the-art-of-the-ayyubid-period-ca-1171-1260', scope: 'مصر ثم اليمن سنة 1174 والشام في ثمانينيات القرن الثاني عشر' },
  mamluk: { title: 'The Met — The Art of the Mamluk Period (2001)', url: 'https://www.metmuseum.org/essays/the-art-of-the-mamluk-period-1250-1517', scope: 'الحكم المملوكي والنفوذ على الحرمين؛ لا يبرر ضم كل الصحراء' },
  ottoman: { title: 'The Met — Egypt, 1600–1800 A.D.', url: 'https://www.metmuseum.org/toah/ht/09/afe.html', scope: 'مصر ولاية عثمانية؛ ليست كل الأراضي العثمانية تابعة لإدارتها' },
  london: { title: 'US Office of the Historian — FRUS 1879, document 485 (وثائق 1840–1841)', url: 'https://history.state.gov/historicaldocuments/frus1879/d518', scope: 'نصوص التسوية والانسحاب من الشام وكريت وأضنة والجزيرة العربية' },
  sudan: { title: 'Marissa Wood — Egypt–Sudan Land Boundary (Sovereign Limits, 2019)', url: 'https://sovereignlimits.com/blog/egypt-sudan-land-boundary', scope: 'حلايب وبئر طويل ونتوء وادي حلفا؛ مصدر متخصص مؤرخ وليس تحديثاً آنياً' },
  ne: { title: 'Natural Earth — Disputed boundaries policy / vector data', url: 'https://www.naturalearthdata.com/about/disputed-boundaries-policy/', scope: 'هندسة معاصرة معممة ووجهة نظر الإدارة الفعلية؛ لا تمثل حكماً قانونياً ولا حدوداً قديمة' },
};

// Audit coverage is deliberately separate from geometry verification. A chronology
// source never upgrades a hand-drawn polygon to a verified border.
export const BOUNDARY_REVIEWS: Record<number, BoundaryReview> = {
  0: { status: 'partial', finding: 'المقارنة المعاصرة تحتاج إظهار الخلافات الحدودية؛ لا يصح وصف كل الحدود بأنها محسومة.', sourceIds: ['sudan','ne'] },
  1: { status: 'schematic', finding: 'يجب فصل توحيد الوادي والدلتا عن البعثات خارج مصر. الحد الصحراوي المرسوم لم يوثق مكانياً.', sourceIds: ['early'] },
  2: { status: 'schematic', finding: 'لا يكفي وجود تعدين أو تجارة لإثبات سيادة متصلة على سيناء والنوبة. مضلع الصحراء تقديري غير محقق.', sourceIds: ['early'] },
  3: { status: 'schematic', finding: 'شبكة حصون النوبة في الأسرة 12 لا تثبت بقاء الحد نفسه طوال الأسرتين 11 و13؛ يلزم فصل المراحل.', sourceIds: ['bronze'] },
  4: { status: 'schematic', finding: 'مراكز حكم متنافسة للهكسوس وطيبة وكوش؛ الخط الفاصل الدقيق غير ثابت ولا موثق بالإحداثيات الحالية.', sourceIds: ['bronze'] },
  5: { status: 'schematic', finding: 'يجب فصل إدارة النوبة عن التبعية والحملات في الشام، وفصل الأسرة 18 عن الرعامسة. ليس أقصى تقدم عسكري حداً دائماً.', sourceIds: ['bronze'] },
  6: { status: 'schematic', finding: 'الحكم الكوشي والتدخل الآشوري تغيرا زمنياً. لا يجوز عرض كامل الفترة باعتبارها وحدة ذات حدود ثابتة.', sourceIds: ['late'] },
  7: { status: 'schematic', finding: 'لا تضاف حملات الشام إلى مصر الصاوية باعتبارها أراضي سيادة دائمة. نهايات المضلع تحتاج توثيقاً مستقلاً.', sourceIds: ['late'] },
  8: { status: 'partial', finding: 'أزيل المضلع الذي يصل مصر بالشام في كتلة واحدة. فُصلت مصر وقبرص وقورينائية وجبهة الشام؛ الرقع القديمة توضيحية وليست حدوداً مساحية.', sourceIds: ['ptolemy','late','ne'] },
  9: { status: 'schematic', finding: 'الروماني والبيزنطي والاحتلال الساساني ليسوا مرحلة واحدة. سيناء والنوبة لا يلزم أن يتبعا الولاية المصرية في كل تاريخ.', sourceIds: ['roman','islam'] },
  10: { status: 'schematic', finding: 'مصر ولاية ضمن خلافات متعاقبة؛ لا يثبت انتماء أرض للخلافة تبعيتها لإدارة مصر. تفاصيل البقط تحتاج نصاً وتحقيقاً مستقلاً.', sourceIds: ['islam'] },
  11: { status: 'schematic', finding: 'استقلال عملي مع علاقة بالخلافة. حد الثغور والجزيرة والحجاز في الرسم القديم غير مثبت بمصدر مكاني مؤرخ.', sourceIds: ['islam'] },
  12: { status: 'schematic', finding: 'عودة الحكم العباسي موثقة زمنياً؛ جبهات الحملات الفاطمية لا تمثل إقليماً ثابتاً مضمومًا.', sourceIds: ['islam'] },
  13: { status: 'schematic', finding: 'حدود الشام ونوع العلاقة بالحجاز تحتاج مصادر تفصيلية. المصدر الزمني لا يثبت المضلع الحالي.', sourceIds: ['islam'] },
  14: { status: 'schematic', finding: 'لا تجمع ممتلكات الفاطميين منذ شمال إفريقيا مع مراحل حكم مصر المتأخرة في لقطة واحدة. الترسيم الحالي قيد التحقيق.', sourceIds: ['fatimid'] },
  15: { status: 'schematic', finding: 'يجب فصل مراحل ضم اليمن والشام وتقاسم الأسرة الأيوبية؛ رسم مساحة موحدة طوال 1171–1250 مضلل.', sourceIds: ['ayyubid'] },
  16: { status: 'schematic', finding: 'الإدارة والتبعية والحملات أو حماية الحرمين أنواع مختلفة. الامتدادات الخارجية في الرسم لم تحقق مرحلةً مرحلةً.', sourceIds: ['mamluk'] },
  17: { status: 'schematic', finding: 'إيالة مصر ليست الإمبراطورية العثمانية. طريق الحج والحاميات لا يثبتان تبعية كل إقليم تمر به القوافل.', sourceIds: ['ottoman'] },
  18: { status: 'partial', finding: 'فُصلت لقطة ما قبل تسوية 1840 عن مرحلة ما بعدها. الإطار الجغرافي التفصيلي للسودان والجزيرة العربية ما زال يحتاج خرائط مؤرخة.', sourceIds: ['london'] },
  19: { status: 'schematic', finding: 'لا تساوي المديريات المعلنة أو الحملات السيطرة الفعلية المستمرة. حدود الاستواء ودارفور والقرن الإفريقي لم تثبت بإحداثيات موثقة في هذه المراجعة.', sourceIds: [] },
  20: { status: 'schematic', finding: 'اتفاقيات 1899 و1902 وما بعدها لا تمثل خطاً واحداً. يجب فصل الإدارة المشتركة للسودان عن السيادة الوطنية وإظهار اختلاف التفسيرات.', sourceIds: ['sudan'] },
  21: { status: 'partial', finding: 'استُبدل الرسم اليدوي ببيانات Natural Earth المعممة، وفُصلت حلايب وبئر طويل. هذه مراجعة معاصرة وليست توثيقاً لكل خطوط وقف النار منذ 1952.', sourceIds: ['ne','sudan'] },
};

function rings(name: string): Point[][][] {
  const f = reference.features.find(f => f.properties.name === name);
  if (!f) throw new Error(`Missing reference geography: ${name}`);
  const g = f.geometry;
  const polygons = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return (polygons as number[][][][]).map(p => p.map(r => r.map(([lon, lat]) => [lat, lon] as Point)));
}
export const MODERN_REFERENCE = rings('Egypt');
export const MODERN_DISPUTES: ControlFeature[] = [
  { type: 'disputed_territory', name: 'مثلث حلايب', polygons: rings('Halayib Triangle'), description: 'تديره مصر وتطالب به السودان. يستند الموقف المصري إلى خط 1899، والسوداني إلى ترتيبات 1902. عرض النزاع لا يحسم السيادة.', sourceIds: ['sudan','ne'], certainty: 'generalized' },
  { type: 'uncertain_frontier', name: 'بئر طويل — اختلاف إسناد إقليمي', polygons: rings('Bir Tawil'), description: 'كل طرف يسند المنطقة للطرف الآخر وفق تفسيره لخط الحدود؛ ليست حالة مطالبة مزدوجة مماثلة لحلايب، ولا توصف هنا بأنها أرض متاحة للتملك.', sourceIds: ['sudan','ne'], certainty: 'generalized' },
];
const poly = (type: ControlFeature['type'], name: string, coords: Point[], description: string, sourceIds: string[]): ControlFeature => ({type,name,coords,description,sourceIds,certainty:'schematic'});
// Schematic zones, NOT digitizations of sovereign boundaries. No fabricated precision.
const nile: Point[] = [[31.20,29.92],[31.42,30.42],[31.58,31.05],[31.52,31.83],[31.26,32.30],[30.75,32.12],[30.05,31.55],[29.2,31.42],[28.1,31.02],[27.15,31.4],[26.55,32.05],[26.18,32.9],[25.65,32.95],[24.9,33.05],[24.08,33.03],[24.08,32.68],[24.9,32.65],[25.65,32.55],[26.18,32.5],[26.55,31.65],[27.15,31.02],[28.1,30.6],[29.2,30.8],[29.7,30.65],[30.1,30.95],[30.8,30.25],[31.20,29.92]];
const egyptZone = poly('direct_administration','القلب المصري: الوادي والدلتا (نطاق توضيحي)',nile,'التظليل يحدد القلب الجغرافي فقط؛ عرضه ليس حدّاً سياسياً ولا يشمل كل الصحراء أو الواحات أو طرق الإدارة. الساحل القديم تغير.', ['late']);
const cyrene = poly('dependency','قورينائية: نطاق إقليمي تقريبي',[[32.6,20.55],[32.85,21.75],[32.85,22.7],[32.4,23.1],[31.95,24.1],[31.4,23.65],[31.35,21],[32.1,20.1],[32.6,20.55]],'رقعة تعريفية للمنطقة؛ لا تثبت حدها الصحراوي أو انتظام تبعيتها في كل عهد.', ['ptolemy']);
const cyprus: ControlFeature = {type:'dependency',name:'قبرص — إقليم منفصل بحرياً',polygons:rings('Cyprus'),certainty:'generalized',description:'شكل الجزيرة معاصر ومعمم؛ التصنيف التاريخي منفصل عن هندسة الساحل ولا يعني اتصالاً برياً بمصر.',sourceIds:['ptolemy','ne']};
const levant = poly('disputed_territory','جنوب الشام — جبهة الصراع البطلمي السلوقي',[[31.28,34.25],[32.08,34.85],[32.8,35.1],[33.3,35.3],[33.85,35.6],[34.35,35.8],[34.2,36.25],[33.5,36.2],[32.6,35.85],[31.5,35.5],[31.28,34.25]],'جبهة حروب متعاقبة؛ لا يعني التظليل اشتراكاً إدارياً أو أن كل هذه الرقعة كانت محل نزاع في اليوم نفسه.', ['ptolemy']);
const limits = 'المراحل لقطات مختارة وليست تسلسلاً سنوياً كاملاً. الأشكال القديمة نطاقات توضيحية؛ لم تُرقمن من أطلس حدود مؤرخ، ولا يجوز حساب مساحة سيادية منها.';
// Site coordinates locate evidence, never the perimeter of a political territory.
const megiddoCampaign: ControlFeature={type:'campaign',geometryType:'point',name:'مجدّو — حملة تحتمس الثالث',coords:[[32+35/60+6/3600,35+11/60+3/3600]],certainty:'generalized',sourceIds:['megiddoCampaign','megiddoPosition'],description:'نحو 1457 ق.م؛ العلامة عند التل لتعريف موضع الحملة، وليست مساحة المعركة أو دليلاً على ضم كل الأراضي بينه وبين مصر.'};
const barkal: ControlFeature={type:'direct_administration',geometryType:'point',name:'جبل البركل — شاهد على الوجود المصري في النوبة',coords:[[18+32/60+13.2/3600,31+49/60+40.9/3600]],certainty:'generalized',sourceIds:['nubiaHistory','barkalHistory','barkalPosition'],description:'شاهد مكاني ضمن سياق إدارة النوبة في الدولة الحديثة. مراحل المعبد تشمل الأسرة 19؛ لا تعني النقطة أن الحد كان يمر هنا بالضبط أو أن كل النوبة كانت ذات وضع واحد.'};
BOUNDARY_REVIEWS[5]={status:'partial',finding:'أزيل الامتداد الموحد غير الموثق من العرض. فُصلت حملة مجدّو عن شاهد الوجود المصري في النوبة في لقطتين، دون وصل المواقع بحدود مخترعة.',sourceIds:['bronze','nubiaHistory','barkalHistory','barkalPosition','megiddoCampaign','megiddoPosition'],phases:[
 {id:'new-kingdom-megiddo',year:-1457,label:'نحو 1457 ق.م — حملة مجدّو',summary:'تظهر الحملة بعلامة مستقلة عن القلب المصري. لا تُحوّل حركة الجيش إلى رقعة سيادة دائمة على الشام.',features:[{...egyptZone,sourceIds:['bronze']},megiddoCampaign],sourceIds:['bronze','megiddoCampaign','megiddoPosition'],limitations:'لقطة لموضع الحملة فقط؛ إدارة النوبة ومراكز التبعية في الشام غير مرقمنة هنا، وغيابها لا يعني استقلالها أو فقدها. '+limits},
 {id:'new-kingdom-ramesside',year:-1250,label:'نحو 1250 ق.م — شاهد من النوبة في العصر الرعمسي',summary:'يظهر جبل البركل كشاهد موضعي في سياق إدارة النوبة بواسطة نواب الملك. لا تمتد رقعة تظليل افتراضية إلى جنوب السودان.',features:[{...egyptZone,sourceIds:['bronze']},barkal],sourceIds:['bronze','nubiaHistory','barkalHistory','barkalPosition'],limitations:'التاريخ لقطة تقريبية داخل عهد رمسيس الثاني، وليس سنة إنشاء مؤكدة للمعبد. جبهة الشام والتبعية والمعاهدة الحثية تحتاج هندسة مستقلة؛ حذف علامة حملة 1457 لا يعني فقد الشام سنة 1250. '+limits},
]};
const saiteCore={...egyptZone,sourceIds:['late']};
BOUNDARY_REVIEWS[7]={status:'partial',defaultPhaseId:'saite-550',finding:'فُصلت حملة النوبة عن القلب المصري؛ لا يُعرض بلوغ نبتة بوصفه ضماً دائماً. حد الصحراء والشام لم يوثق مكانياً.',sourceIds:['late','barkalHistory','barkalPosition'],phases:[
 {id:'saite-593',year:-593,label:'نحو 593 ق.م — حملة بسماتيك الثاني',summary:'تظهر إشارة الحملة عند جبل البركل في منطقة نبتة، منفصلة عن القلب المصري. وجود حملة لا يكفي لإثبات إدارة دائمة للنوبة.',features:[saiteCore,{type:'campaign',geometryType:'point',name:'نبتة / جبل البركل — موضع مرتبط بحملة 593 ق.م',coords:barkal.coords,certainty:'generalized',sourceIds:['barkalHistory','barkalPosition'],description:'يربط تفسير حفائر B500 تلف المعبد بهذه الحملة على سبيل الترجيح. العلامة عند الموقع الأثري، لا عند حد جنوبي مثبت ولا تمثل مسار الجيش.'}],sourceIds:['late','barkalHistory','barkalPosition'],limitations:'تحديد الشاهد هنا ترجيحي؛ لم ترسم جبهة الحملة أو كل مواقعها. '+limits},
 {id:'saite-550',year:-550,label:'نحو 550 ق.م — القلب المصري في العصر الصاوي',summary:'لقطة جزئية للقلب المصري دون توريث حملة 593 ق.م. لا تُملأ النوبة أو الشام باعتبارهما ممتلكات ثابتة طوال الأسرة 26.',features:[saiteCore],sourceIds:['late'],limitations:'الوادي والدلتا نطاق تعريفي فقط. الواحات والثغور وقبرص والعلاقات الخارجية تحتاج تحقيقاً مكانياً مؤرخاً؛ عدم رسمها لا يحسم وضعها السياسي. '+limits},
]};
BOUNDARY_REVIEWS[8].phases = [
  {id:'ptolemy-240',year:-240,label:'نحو 240 ق.م — الاتساع البطلمي',summary:'تُعرض مصر وقورينائية وقبرص وجبهة الشام كرقع منفصلة. لا تُملأ مياه المتوسط باعتبارها أرضاً تابعة.',features:[egyptZone,cyrene,cyprus,levant],sourceIds:['ptolemy','late','ne'],limitations:limits},
  {id:'ptolemy-100',year:-100,label:'نحو 100 ق.م — انحسار الممتلكات الخارجية',summary:'لا تُعرض الشام ضمن المملكة. تبقى قبرص وقورينائية منفصلتين؛ لقطة ما قبل انتقال قورينائية إلى روما سنة 96 ق.م.',features:[egyptZone,cyrene,cyprus],sourceIds:['ptolemy'],limitations:limits + ' لم تُرسم تغيّرات استقلال فروع الأسرة والحرب الأهلية داخل مصر.'},
  {id:'ptolemy-55',year:-55,label:'نحو 55 ق.م — بعد ضم قبرص الروماني',summary:'لا تُعرض قبرص أو قورينائية كممتلكات بطلمية في هذه اللقطة. لا تمثل هذه الخريطة منح أنطونيوس المتأخرة أو إعادة قبرص.',features:[egyptZone],sourceIds:['ptolemy','late'],limitations:limits},
];
const syria = poly('temporary_occupation','الشام — حكم محمد علي قبل التسوية',[[31.28,34.25],[32.1,34.85],[33.3,35.3],[34.5,35.9],[35.7,35.95],[36.25,36.7],[36.3,37.2],[35.1,37.1],[33.5,36.6],[32,36.1],[31.28,34.25]],'نطاق تقريبي للإدارة خلال التوسع؛ لا يضم مسار الحملة إلى كوتاهية باعتباره حداً دائماً.', ['london']);
BOUNDARY_REVIEWS[18].phases = [
 {id:'ali-1839',year:1839,label:'1839 — قبل تسوية لندن',summary:'تُميز الشام عن القلب المصري. لا تمثل الرقع المعروضة جميع ممتلكات وحاميات محمد علي.',features:[{...egyptZone,sourceIds:['london']},syria],sourceIds:['london'],limitations:'تمثيل جزئي؛ السودان وكريت وأضنة والحجاز تحتاج هندسة مستقلة موثقة قبل إضافتها. '+limits},
 {id:'ali-1841',year:1841,label:'1841 — بعد التسوية',summary:'أزيلت الشام من نطاق حكم محمد علي وفق وثائق التسوية. لا يعني غياب السودان من الرسم انتهاء إدارته المصرية.',features:[{...egyptZone,sourceIds:['london']}],sourceIds:['london'],limitations:'المعروض هو الفرق المؤكد في الشام فقط؛ ليس خريطة كاملة لحكم محمد علي بعد 1841.'},
];

const point = (type: ControlFeature['type'],name:string,position:Point,description:string,sourceIds:string[]):ControlFeature => ({type,name,coords:[position],geometryType:'point',description,sourceIds,certainty:'generalized'});
const semna=point('trade_mining_garrison','سمنة الغربية — شاهد على منظومة حصون النوبة',[21.494253,30.960949],'الموضع موثق في المعجم الجغرافي. علامة الحصن لا تصلح لرسم خط عرض سيادي عبر الصحراء.', ['nubia','bronze']);
BOUNDARY_REVIEWS[3]={status:'partial',finding:'فُصلت إعادة التوحيد عن مرحلة حصون الأسرة 12. أُزيل حد الصحراء غير الموثق.',sourceIds:['middle','bronze','nubia'],phases:[
 {id:'middle-2000',year:-2000,label:'نحو 2000 ق.م — بعد إعادة التوحيد',summary:'القلب المصري في أواخر الأسرة 11. لا تُنقل شبكة حصون الأسرة 12 إلى هذه اللقطة السابقة عليها.',features:[{...egyptZone,sourceIds:['middle']}],sourceIds:['middle'],limitations:limits+' عدم عرض إقليم خارج الوادي لا يثبت عدم وجود نفوذ فيه.'},
 {id:'middle-1850',year:-1850,label:'نحو 1850 ق.م — الأسرة 12 وحصون النوبة',summary:'تضاف سمنة كعلامة موثقة على منظومة الحصون في النوبة؛ لا يُملأ كامل الإقليم الصحراوي بين الحصن ومصر.',features:[{...egyptZone,sourceIds:['middle']},semna],sourceIds:['middle','bronze','nubia'],limitations:limits+' هذه خريطة للقلب الجغرافي وشاهد حدودي، وليست حصرًا لكل الحصون أو أراضي الإدارة.'},
]};
BOUNDARY_REVIEWS[9]={status:'partial',finding:'فُصلت أنظمة الحكم المتعاقبة عن الرسم الجغرافي. لا يُعرض الاحتلال الساساني باعتباره حكماً بيزنطياً.',sourceIds:['roman','islam'],phases:[
 {id:'roman-200',year:200,label:'نحو 200 م — الحكم الروماني',summary:'القلب المصري تحت الإدارة الرومانية. لا تمثل الرقعة كل تقسيمات الولايات أو حدود النوبة وسيناء.',features:[{...egyptZone,sourceIds:['roman']}],sourceIds:['roman'],limitations:limits},
 {id:'byzantine-550',year:550,label:'نحو 550 م — الحكم البيزنطي',summary:'لقطة للحكم البيزنطي قبل الاحتلال الساساني؛ ثبات الرقعة التوضيحية لا يعني ثبات الحدود الإدارية.',features:[{...egyptZone,sourceIds:['islam']}],sourceIds:['islam'],limitations:limits},
 {id:'sasanian-625',year:625,label:'نحو 625 م — الاحتلال الساساني',summary:'تُميز مرحلة الاحتلال الساساني بلون الحكم المؤقت. لا تُدمج في الفترة البيزنطية.',features:[{...egyptZone,type:'temporary_occupation',name:'القلب المصري تحت الاحتلال الساساني',sourceIds:['islam']}],sourceIds:['islam'],limitations:limits},
 {id:'byzantine-635',year:635,label:'نحو 635 م — استعادة الحكم البيزنطي',summary:'مرحلة تالية للانسحاب الساساني وسابقة لبدء الفتح العربي؛ لا تشمل خطوط سير الجيوش اللاحقة.',features:[{...egyptZone,sourceIds:['islam']}],sourceIds:['islam'],limitations:limits},
]};
const yemen=point('dependency','اليمن — موضع تعريفي عند صنعاء',[15+21/60+20/3600,44+12/60+29/3600],'إشارة إقليمية إلى التوسع الأيوبي بعد 1174؛ ليست ترسيماً لليمن ولا إثباتاً للسيطرة على كل قبائله ومدنه.', ['ayyubid','sanaa']);
const damascus=point('dependency','دمشق — مركز أيوبي في الشام',[33+30/60+39/3600,36+18/60+35/3600],'يميز المركز الشامي عن القلب المصري؛ لا يعني أن جميع الشام أو الساحل الصليبي خضعا لحكم متجانس.', ['ayyubid','damascus']);
BOUNDARY_REVIEWS[15]={status:'partial',finding:'فُصلت بداية الحكم في مصر عن التوسع في اليمن والشام. لا تربط المواقع الخارجية بكتلة صحراوية مصمتة.',sourceIds:['ayyubid','sanaa','damascus'],phases:[
 {id:'ayyubid-1172',year:1172,label:'1172 — بداية الحكم الأيوبي في مصر',summary:'لقطة قبل التوسع اليمني سنة 1174. المعروض القلب المصري فقط.',features:[{...egyptZone,sourceIds:['ayyubid']}],sourceIds:['ayyubid'],limitations:limits},
 {id:'ayyubid-1190',year:1190,label:'نحو 1190 — مصر ومراكز التوسع الإقليمي',summary:'تظهر إشارتان منفصلتان لليمن والشام. لا تُرسم بينهما صحراء متصلة ولا حدود تفصيلية لجبهة الصليبيين.',features:[{...egyptZone,sourceIds:['ayyubid']},yemen,damascus],sourceIds:['ayyubid','sanaa','damascus'],limitations:limits+' المواقع تعرّف الأقاليم؛ ليست خريطة كاملة لحكم صلاح الدين.'},
]};

const romanLine=(coords:number[][],name:string,sourceId:string):ControlFeature=>({type:'administrative_boundary',geometryType:'line',name,coords:coords.map(([lon,lat])=>[lat,lon]),certainty:'generalized',sourceIds:[sourceId],description:'إحداثيات المصدر محفوظة دون إعادة رسم. يمثل الخط تفسيراً أطلسياً لحد إداري؛ لا يغلق مضلعاً ولا يثبت سيادة مستقلة على أي من جانبيه.'});
const romanEast=romanBoundaries['roman200-eastern-boundary'].map(f=>romanLine(f.geometry.coordinates,'الحد الشرقي لولاية مصر نحو 200 م','awmc200'));
BOUNDARY_REVIEWS[9].phases![0].features.push(...romanEast);
BOUNDARY_REVIEWS[9].phases![0].sourceIds.push('awmc200');
BOUNDARY_REVIEWS[9].phases!.splice(1,0,{
 id:'roman-post-diocletian',year:310,label:'أوائل القرن الرابع — تقسيمات ما بعد دقلديانوس',summary:'تُعرض ثلاثة خطوط إدارية من بيانات AWMC؛ ليست حدود دولة مصرية مستقلة ولا خريطة كاملة لكل الولايات.',features:romanBoundaries['roman-post-diocletian'].map((f,i)=>romanLine(f.geometry.coordinates,`تقسيم إداري داخل مصر — خط ${i+1}`,'awmcLate')),sourceIds:['awmcLate','roman'],limitations:'المصدر يحدد مرحلة ما بعد دقلديانوس دون سنة دقيقة. لا تنقل هذه الخطوط إلى القرنين السادس والسابع، ولا تستنتج منها أسماء الولايات أو مساحاتها دون دليل إضافي.'
});
function historicalGeometry(code:number|string,start:number):Point[][][] {
 const f=modernHistorical.features.find(f=>f.properties.code===code&&f.properties.start===start);
 if(!f)throw new Error(`Missing dated geometry: ${code}/${start}`);
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 return (polys as number[][][][]).map(p=>p.map(r=>r.map(([lon,lat])=>[lat,lon] as Point)));
}
const datedEgypt=(start:number):ControlFeature=>({type:'direct_administration',name:'مصر — مرجع تاريخي معمّم',polygons:historicalGeometry(651,start),certainty:'generalized',sourceIds:['cshapes','cshapesDisplay'],description:'تاريخ اللقطة محدد؛ الهندسة معممة ولا تمثل كل التحركات العسكرية أو تفاصيل المطالبات الحدودية.'});
const modernLimits='تبسيط جغرافي للعرض الإقليمي، لا يصلح لقياس الحدود ميدانياً. لا تُنقل إليه رقع حلايب وبئر طويل المعاصرة تلقائياً، ولا يمثل كل جبهات الحرب أو الوضع في غزة.';
BOUNDARY_REVIEWS[20]={status:'partial',defaultPhaseId:'egypt-sudan-1935',finding:'استُبدل المضلع اليدوي بلقطة سنة 1935 موثقة المصدر، وفُصل السودان ذو الإدارة المشتركة عن مصر.',sourceIds:['cshapes','cshapesDisplay','west1925','sudan'],phases:[
 {id:'egypt-sudan-1935',year:1935,label:'1935 — مصر والسودان ذو الإدارة المشتركة',summary:'تظهر مصر بعد تسوية الحدود الغربية، ويظهر السودان كإقليم منفصل ذي إدارة أنجلو-مصرية مشتركة؛ لا يدمجان في مساحة سيادية واحدة.',features:[datedEgypt(19251206),{type:'joint_administration',name:'السودان — إدارة أنجلو-مصرية مشتركة',polygons:historicalGeometry(625,19340720),certainty:'generalized',sourceIds:['cshapes','cshapesDisplay','sudan'],description:'فصل الإقليم لا يعني تماثل نفوذ الطرفين داخل الإدارة المشتركة.'}],sourceIds:['cshapes','cshapesDisplay','west1925','sudan'],limitations:modernLimits},
]};
BOUNDARY_REVIEWS[21]={status:'partial',defaultPhaseId:'modern-reference',finding:'فُصلت الحدود المرجعية عن السيطرة أثناء احتلال سيناء، مع إبقاء النزاعات المعاصرة في لقطة مستقلة.',sourceIds:['cshapes','cshapesDisplay','peace1979','ne','sudan'],phases:[
 {id:'egypt-1966',year:1966,label:'1966 — قبل حرب يونيو',summary:'مرجع مصر السابق لحرب يونيو 1967. لا يضم غزة إلى السيادة المصرية، ولا يعمم على كل سنوات الجمهورية.',features:[datedEgypt(19251206)],sourceIds:['cshapes','cshapesDisplay'],limitations:modernLimits},
 {id:'egypt-1968',year:1968,label:'1968 — سيناء تحت الاحتلال الإسرائيلي',summary:'تفصل الخريطة نطاق السيطرة المصرية عن سيناء المحتلة. التمييز البرتقالي لا يعني انتقال السيادة المصرية على سيناء.',features:[{...datedEgypt(19670610),name:'نطاق السيطرة المصرية — لقطة 1968'},{type:'temporary_occupation',name:'سيناء — تحت الاحتلال الإسرائيلي في 1968',polygons:historicalGeometry('sinai-1968',19680101),certainty:'generalized',sourceIds:['cshapes','cshapesDisplay','peace1979'],description:'رقعة مشتقة من اختلاف الحلقة الساحلية وحد القناة بين سجلي CShapes؛ لا تمثل خطوط 1973 أو مراحل الانسحاب.'}],sourceIds:['cshapes','cshapesDisplay','peace1979'],limitations:modernLimits+' استُبعدت فروق التبسيط الصغيرة قرب بحيرة المنزلة، ولم تُفسر كتغيرات سياسية.'},
 {id:'modern-reference',year:2026,label:'مرجع معاصر — الحدود واختلاف المطالبات',summary:'مرجع Natural Earth المعمم، مع فصل حلايب وبئر طويل عن الحدود غير المختلف عليها. لا يحسم العرض السيادة قانونياً.',features:[{type:'direct_administration',name:'مصر — مرجع معاصر معمّم',polygons:MODERN_REFERENCE,certainty:'generalized',sourceIds:['ne']},...MODERN_DISPUTES],sourceIds:['ne','sudan'],limitations:'مصدر شرح المطالبات مؤرخ في 2019، وليس تحديثاً آنياً. لم تُرقمن رقعة وادي حلفا ولا مراحل 1973–1982 أو طابا في هذه اللقطة.'},
]};

export function getReviewedSlide(slide: SlideData, phaseId?: string): SlideData {
 const review=BOUNDARY_REVIEWS[slide.id];
 if (!review) return slide;
 const phase=review.phases?.find(p=>p.id===phaseId) ?? review.phases?.find(p=>p.id===review.defaultPhaseId) ?? review.phases?.[0];
 if (slide.id===0) return {...slide, boundaryReview:review,reconstructionDate:'مرجع معاصر معمّم — Natural Earth', text:'<p>مرجع جغرافي معاصر معمّم، مع فصل الإدارة الفعلية عن اختلاف المطالبات. عرض خطوط الخريطة لا يفصل قانونياً في السيادة.</p>', keyEvents:undefined, frontierCities:undefined, borderDescription:review.finding, extent:{core:[],controlFeatures:[{type:'direct_administration',name:'مرجع مصر المعاصر — ليس حكماً بالسيادة',polygons:MODERN_REFERENCE,certainty:'generalized',sourceIds:['ne']},...MODERN_DISPUTES]}, sources:undefined,geographicalStats:undefined};
 if (phase) return {...slide,headline:slide.id===7?'العصر الصاوي — القلب المصري والحملات':slide.id===5?'الدولة الحديثة — الإدارة والحملات في لقطات مؤرخة':slide.id===21?'مصر: الحدود والسيطرة والمناطق المختلف عليها':slide.headline,capital:phase.capital,boundaryReview:review,boundaryPhase:phase,reconstructionDate:phase.label,text:`<p>${phase.summary}</p>`,borderDescription:phase.limitations,extent:{core:[],controlFeatures:phase.features},keyEvents:undefined,frontierCities:undefined,geographicalStats:undefined,sources:undefined};
 // Retain the original data for comparison, visibly classified as unverified;
 // never invent phase geometries from a chronology-only source.
 return {...slide,boundaryReview:review,geographicalStats:undefined,borderDescription:review.finding,extent:slide.extent?{...slide.extent,coreLabel:'رسم سابق غير محقق مكانياً',secondaryLabel:'امتداد سابق غير محقق مكانياً',controlFeatures:undefined}:undefined};
}
