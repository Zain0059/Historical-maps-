import type { ControlFeature } from '../types';
import type { BoundaryReview, BoundarySource } from './boundaryReview';

type Point = [number, number];
export const THIRD_FOURTH_SOURCES: Record<string, BoundarySource> = {
  thebesPositions: {
    title: 'UNESCO — Ancient Thebes, geographical data',
    url: 'https://whc.unesco.org/en/list/87/maps/',
    scope: 'مرجع الكرنك 087-001: 25°43′08″ شمالاً، 32°39′26.1″ شرقاً. يستخدم لتعريف منطقة طيبة، لا موضع قصر ملكي أو حدود المدينة القديمة.'
  },
  avarisExcavation: {
    title: 'Austrian Archaeological Institute — Tell el-Dabʿa: History',
    url: 'https://www.auaris.at/html/history_en.html',
    scope: 'موضع تل الضبعة 30°47′ شمالاً، 31°50′ شرقاً؛ الاستيطان في الأسرتين 12 و13، وعاصمة الهكسوس وسقوطها نحو 1530 ق.م وفق تسلسل البعثة.'
  },
  semnaStela: {
    title: 'Ägyptisches Museum Berlin — Boundary stela of Senwosret III, ÄM 1157',
    url: 'https://smb.museum-digital.de/object/502',
    scope: 'شاهد ملكي على سياسة الحد الجنوبي في الأسرة 12؛ لا يحدد مضلعاً مساحياً عبر الصحراء ولا يثبت استمرار الحامية في كل فترة لاحقة.'
  },
  kermaPositions: {
    title: 'Sudanese National Commission — Kerma and Dokki Geil (UNESCO, 2022)',
    url: 'https://whc.unesco.org/en/tentativelists/6594/',
    scope: 'مرجع الموقع 19°36′2.89″ شمالاً، 30°24′35.03″ شرقاً. كرمة مركز مملكة كوش؛ المرجع لا يحدد مساحة نفوذها في سنة بعينها.'
  },
  nubiaBronze: {
    title: 'The Met — Sudan, 2000–1000 B.C.',
    url: 'https://www.metmuseum.org/toah/ht/03/afs.html',
    scope: 'صعود كرمة وتغير السيطرة على حصون النوبة في الانتقال الثاني. لا يؤرخ انتقال كل حصن بمفرده ولا يرسم طريق الحملات.'
  }
};

// Source coordinates identify sites. Political attribution is phase-specific.
const thebesPoint: Point = [25 + 43 / 60 + 8 / 3600, 32 + 39 / 60 + 26.1 / 3600];
const avarisPoint: Point = [30 + 47 / 60, 31 + 50 / 60];
const kermaPoint: Point = [19 + 36 / 60 + 2.89 / 3600, 30 + 24 / 60 + 35.03 / 3600];
const site = (type: ControlFeature['type'], name: string, position: Point,
  description: string, sourceIds: string[]): ControlFeature => ({
  type, name, coords: [position], geometryType: 'point', certainty: 'generalized', description, sourceIds
});
const thebes = site('direct_administration', 'طيبة — مركز الحكم المصري (مرجع المنطقة)', thebesPoint,
  'النقطة مرجع منطقة طيبة عند الكرنك، وليست تحديداً لقصر الحاكم أو إثباتاً لتزامن جميع مباني المعبد.', ['bronze', 'thebesPositions']);
const thebesSite = {...thebes, type: 'archaeological_site' as const, name: 'طيبة — مركز ديني وشاهد إقليمي'};
const settlement = site('archaeological_site', 'تل الضبعة — استيطان الأسرة الثانية عشرة', avarisPoint,
  'مرجع الموقع العام؛ لا يمثل موضع كل حي. الوجود المبكر هنا لا يعني قيام دولة الهكسوس في هذه المرحلة.', ['avarisExcavation']);
const officials = {...settlement, name: 'تل الضبعة — مجتمع ومؤسسات الأسرة الثالثة عشرة',
  description: 'تُظهر حفائر الموقع حياً لموظفين في خدمة الحكم المصري. اختلاف أصول السكان لا يثبت خضوع الموقع للهكسوس في هذا التاريخ.'};
const semna = site('trade_mining_garrison', 'سمنة الغربية — حامية وحدّ في عهد سنوسرت الثالث',
  [21.494253, 30.960949], 'علامة الحصن من المعجم الجغرافي المستخدم في المراجعة السابقة. لوحة الحد توثق السياسة الملكية؛ لا نمد منها خطاً افتراضياً عبر الصحراء.', ['nubia', 'semnaStela']);
const avaris = site('independent_center', 'أفاريس — مركز حكم الهكسوس', avarisPoint,
  'مركز سلطة مستقل عن حكم طيبة. العلامة لا تحدد الحد الجنوبي لمملكة الهكسوس.', ['avarisExcavation']);
const kerma = site('independent_center', 'كرمة — مركز مملكة كوش المستقلة', kermaPoint,
  'مملكة مستقلة وليست أرضاً مصرية أو مقاطعة هكسوسية. لا يُحوّل الاتصال السياسي إلى وحدة سيادية.', ['kermaPositions', 'nubiaBronze']);
const semnaLater = {...semna, type: 'uncertain_frontier' as const,
  name: 'سمنة — تغير السيطرة على منظومة الحصون',
  sourceIds: ['nubia', 'nubiaBronze'],
  description: 'يوثق المصدر سيطرة كرمة على حصون الجندل الثاني خلال الانتقال الثاني، دون سنة انتقال كل حصن. هذه علامة على مسألة الإسناد، وليست حامية مصرية مستمرة أو جبهة مرسومة.'};
const conquest = {...avaris, type: 'campaign' as const,
  name: 'أفاريس — سقوط مركز الهكسوس أمام أحمس',
  description: 'تؤرخ بعثة الموقع الفتح بنحو 1530 ق.م. النقطة موقع الحدث؛ لا ترسم مسار الجيش ولا تعمم حدود الدولة الحديثة اللاحقة.'};
const common = 'السنوات تقريبية. الرمادي سياق الوادي والدلتا، وليس مضلع سيادة أو إعادة بناء للساحل القديم. النقاط لا تقيس نفوذ المراكز، وغياب موقع عن اللقطة لا يعني زواله. لم يُرسم خط فصل بين سلطتين دون مصدر مكاني.';

export function thirdFourthReviews(nile: Point[]): Record<number, BoundaryReview> {
  const context: ControlFeature = {type: 'geographic_context', name: 'الوادي والدلتا — سياق جغرافي تقريبي',
    coords: nile, certainty: 'schematic', sourceIds: ['bronze'], description: 'خلفية مشتركة لقراءة المواقع؛ لا تعني خضوع كامل المنطقة لحاكم واحد.'};
  return {
    3: {
      timelineStages: true, status: 'partial',
      finding: 'أربع مراحل تفصل إعادة التوحيد وبداية الأسرة 12 وشاهد سمنة ثم تغير مؤسسات الأسرة 13. موضع إثت تاوي لم يُثبت كنقطة على الخريطة.',
      sourceIds: ['middle', 'bronze', 'thebesPositions', 'avarisExcavation', 'nubia', 'semnaStela'],
      phases: [
        {id: 'middle-2000', year: -2000, label: '1 / 4 — نحو 2000 ق.م: ما بعد إعادة التوحيد',
          summary: 'طيبة محور اللقطة الأولى بعد توحيد منتوحتب الثاني؛ لا تُسقط عليها حصون سنوسرت الثالث اللاحقة.',
          features: [context, thebes], sourceIds: ['middle', 'bronze', 'thebesPositions'],
          changes: 'بداية السلسلة: مركز الحكم في طيبة، قبل انتقاله شمالاً في الأسرة التالية.',
          narrative: ['تبدأ هذه اللقطة بعد إعادة التوحيد، ولا تختصر عصر الانتقال الأول في معركة مرسومة.', 'موضع الكرنك يعرّف منطقة طيبة فقط؛ لا يُستعمل لتحديد مكان إقامة منتوحتب الثاني.'],
          limitations: common},
        {id: 'middle-1950', year: -1950, label: '2 / 4 — نحو 1950 ق.م: بدايات الأسرة الثانية عشرة',
          summary: 'انتقل مركز الحكم إلى إثت تاوي. وتُضاف شواهد الاستيطان المبكر في تل الضبعة شمال شرقي الدلتا.',
          features: [context, thebesSite, settlement], sourceIds: ['middle', 'bronze', 'thebesPositions', 'avarisExcavation'],
          changes: 'تظهر تل الضبعة، ويتغير وصف طيبة من مركز الحكم إلى شاهد إقليمي وديني.',
          narrative: ['إثت تاوي مذكورة في الشرح؛ لم توضع علامة قصر افتراضية عند اللشت.', 'المستوطنة الشمالية ليست عاصمة للهكسوس بعد. تتغير وظيفة الموقع وتصنيفه في المراحل التالية.'],
          limitations: common + ' لا تمثل الخريطة حصر كل مراكز الأسرة 12 أو بعثاتها.'},
        {id: 'middle-1850', year: -1850, label: '3 / 4 — نحو 1850 ق.م: سنوسرت الثالث وحصون النوبة',
          summary: 'تُضاف سمنة الغربية كشاهد موثق على سياسة الحدود ومنظومة الحصون جنوب مصر.',
          features: [context, thebesSite, settlement, semna], sourceIds: ['middle', 'bronze', 'thebesPositions', 'avarisExcavation', 'nubia', 'semnaStela'],
          changes: 'تتسع قراءة الخريطة جنوباً إلى موقع الحصن، دون ملء الصحراء بينه وبين الوادي.',
          narrative: ['اللوحة الملكية مصدر لسياسة الحدود، وليست خريطة مساحية مكتملة.', 'تجارة شرق المتوسط تُشرح كاتصال خارجي، ولا تُعرض كضم للشام.'],
          limitations: common + ' لا تُعمم لقطة سنوسرت الثالث على كامل الأسرة 12.'},
        {id: 'middle-1750', year: -1750, label: '4 / 4 — نحو 1750 ق.م: مؤسسات الأسرة الثالثة عشرة',
          summary: 'يتحول التركيز إلى مجتمع تل الضبعة ومؤسساته خلال الأسرة 13، مع كثرة تعاقب الملوك.',
          features: [context, thebesSite, officials], sourceIds: ['middle', 'bronze', 'thebesPositions', 'avarisExcavation'],
          changes: 'يتغير وصف تل الضبعة، وتُحجب علامة حامية سمنة المؤرخة باللقطة السابقة.',
          narrative: ['قِصر حكم عدد من ملوك الأسرة 13 لا يثبت وحده انهيار الإدارة فوراً.', 'حجب سمنة لا يعني تأريخ سقوطها بسنة 1750؛ وضع كل حامية يحتاج شاهداً مستقلاً.'],
          limitations: common + ' تداخل الأسرات المتأخرة وبداية الانتقال الثاني مختلف عليه؛ الحدود الزمنية هنا تنظيم للعرض.'}
      ]
    },
    4: {
      timelineStages: true, status: 'partial',
      finding: 'ثلاث مراحل: مراكز الحكم المتنافسة، وتغير ميزان القوى في النوبة، ثم سقوط أفاريس كختام انتقالي إلى الدولة الحديثة.',
      sourceIds: ['bronze', 'thebesPositions', 'avarisExcavation', 'kermaPositions', 'nubiaBronze', 'nubia'],
      phases: [
        {id: 'second-1640', year: -1640, label: '1 / 3 — نحو 1640 ق.م: مراكز الحكم المتنافسة',
          summary: 'تظهر أفاريس في الشمال وطيبة في الجنوب وكرمة في النوبة كمراكز سلطات منفصلة.',
          features: [context, thebes, avaris, kerma], sourceIds: ['bronze', 'thebesPositions', 'avarisExcavation', 'kermaPositions', 'nubiaBronze'],
          changes: 'أفاريس مركز حكم للهكسوس الآن؛ أضيف مركز كرمة المستقل، وأزيل أي إيحاء بسيادة واحدة على النقاط.',
          narrative: ['التنافس السياسي واضح، أما خط التماس الدقيق بين المراكز فلا يرسمه هذا المصدر.', 'تعرض كرمة ضمن الإطار الإقليمي؛ ظهورها في أطلس مصر لا يجعلها تابعة لمصر.'],
          limitations: common + ' ليست هذه قائمة شاملة لكل الأسر المحلية، ولا تفصل الجدل حول الأسرتين 14 و16.'},
        {id: 'second-1580', year: -1580, label: '2 / 3 — نحو 1580 ق.م: طيبة وكرمة وحصون النوبة',
          summary: 'تبرز طيبة ومنافسوها، مع علامة توضح تغير السيطرة على منظومة حصون النوبة خلال الحقبة.',
          features: [context, thebes, avaris, kerma, semnaLater], sourceIds: ['bronze', 'thebesPositions', 'avarisExcavation', 'kermaPositions', 'nubiaBronze', 'nubia'],
          changes: 'تعود سمنة بوصف مختلف: مسألة إسناد تاريخي، لا استمرار تلقائي للحامية المصرية.',
          narrative: ['تذكر المصادر علاقة سياسية بين كرمة والهكسوس؛ لا تُعرض كرمة كمقاطعة تابعة لأفاريس.', 'التاريخ عنوان للقطة داخل الحقبة، وليس سنة موثقة لانتقال سمنة منفردة.'],
          limitations: common + ' لا يُختلق مسار عسكري أو خط حدود عند القوصية من رواية الصراع وحدها.'},
        {id: 'second-1530', year: -1530, label: '3 / 3 — نحو 1530 ق.م: أحمس وسقوط أفاريس',
          summary: 'تتحول أفاريس من مركز حكم هكسوسي إلى موقع حدث الفتح في عهد أحمس، وفق تأريخ بعثة الموقع.',
          features: [context, thebes, conquest, kerma], sourceIds: ['bronze', 'thebesPositions', 'avarisExcavation', 'kermaPositions', 'nubiaBronze'],
          changes: 'تُستبدل علامة السلطة الهكسوسية بعلامة الحدث، دون توريث الإمبراطورية المصرية اللاحقة.',
          narrative: ['هذه مرحلة ختام تمتد إلى أوائل الأسرة 18. بداية الدولة الحديثة نحو 1550 لا تعني أن فتح أفاريس وقع في سنة البداية نفسها.', 'تبقى كرمة مستقلة في هذه اللقطة؛ توسعات الدولة الحديثة في النوبة موضوع الدفعة التالية.'],
          limitations: common + ' نحو 1530 وفق بعثة أفاريس، وليس تاريخاً مطلقاً متفقاً عليه. حذف علامة سمنة هنا لا يقرر مصيرها.'}
      ]
    }
  };
}
