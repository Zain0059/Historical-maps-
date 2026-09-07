export interface EraStat {
  id: number;
  slideIndex: number;
  shortName: string;
  fullName: string;
  date: string;
  periodCategory: 'ancient' | 'greco_roman' | 'islamic_medieval' | 'modern' | 'overview';
  estimatedAreaKm2: number;
  areaCalculationMethod: string;
  areaSource: string;
  externalDependenciesCount: number;
  externalDependenciesList: string[];
  internalProvincesCount: number;
  internalProvincesLabel: string;
  expansionType: string;
  ratioToModern: number;
  highlightNote: string;
}

export const MODERN_EGYPT_AREA_KM2 = 1002450;

export const ERA_STATISTICS: EraStat[] = [
  {
    id: 0,
    slideIndex: 0,
    shortName: 'مصر المعاصرة',
    fullName: 'جمهورية مصر العربية (الحدود الدولية)',
    date: 'منذ 3100 ق.م وحتى اليوم',
    periodCategory: 'overview',
    estimatedAreaKm2: 1002450,
    areaCalculationMethod: 'المساحة الكلية الرسمية لليابسة والمياه الإقليمية المعترف بها دولياً وفق المسح العسكري وهيئة المساحة المصرية.',
    areaSource: 'الجهاز المركزي للتعبئة العامة والإحصاء والهيئة العامة للاستعلامات 1989',
    externalDependenciesCount: 0,
    externalDependenciesList: ['لا توجد تبعيات خارجية — دولة وطنية موحدة كاملة السيادة ضمن حدودها المعترف بها'],
    internalProvincesCount: 27,
    internalProvincesLabel: '27 محافظة مصرية',
    expansionType: 'حدود دولية معتمدة ومثبتة',
    ratioToModern: 1.0,
    highlightNote: 'الحدود المستقرة المعاصرة بعد تحكيم طابا 1989'
  },
  {
    id: 1,
    slideIndex: 1,
    shortName: 'توحيد القطرين',
    fullName: 'عصر بداية الأسرات (مينا نارمر)',
    date: 'نحو 3100 – 2686 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 450000,
    areaCalculationMethod: 'حساب مساحة وادي النيل من الشلال الأول (أسوان) حتى سواحل الدلتا على البحر المتوسط بما يشمل الحواف الصحراوية المتاخمة للسهل الفيضي.',
    areaSource: 'د. سليم حسن (موسوعة مصر القديمة - ج1) ود. جمال حمدان (شخصية مصر)',
    externalDependenciesCount: 0,
    externalDependenciesList: ['توحيد إقليمي داخلي للقطرين (الوجهين البحري والقبلي) دون تبعيات خارجية'],
    internalProvincesCount: 38,
    internalProvincesLabel: '38 إقليماً/مقاطعة أولية',
    expansionType: 'توحيد الوادي والدلتا',
    ratioToModern: 0.45,
    highlightNote: 'أول دولة مركزية موحدة من الشلال الأول شمالاً للبحر المتوسط'
  },
  {
    id: 2,
    slideIndex: 2,
    shortName: 'الدولة القديمة',
    fullName: 'الدولة القديمة (عصر بناة الأهرام)',
    date: '2686 – 2181 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 650000,
    areaCalculationMethod: 'وادي النيل والدلتا مع تأمين دروب المحاجر ومناجم الفيروز بسيناء (وادي المغارة وسرابيط الخادم) والواحات الغربية ومثلث الشلال الأول بأسوان.',
    areaSource: 'جون بينز ويارومير مالك (أطلس مصر القديمة) وجيمس هنري برستد (تاريخ مصر)',
    externalDependenciesCount: 1,
    externalDependenciesList: ['منطقة استخراج وتعدين النوبة السفلى (شمال الشلال الثاني)'],
    internalProvincesCount: 42,
    internalProvincesLabel: '42 مقاطعة كلاسيكية (نوم)',
    expansionType: 'تأمين المحاجر والشلال',
    ratioToModern: 0.65,
    highlightNote: 'تأمين مناجم الفيروز بسيناء وحصن إلفنتين عند الشلال الأول'
  },
  {
    id: 3,
    slideIndex: 3,
    shortName: 'الدولة الوسطى',
    fullName: 'الدولة الوسطى (عصر الرخاء والتحصين)',
    date: '2055 – 1650 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 850000,
    areaCalculationMethod: 'الحدود المحصنة من الدلتا وسيناء وحتى أقصى جنوب الشلال الثاني ببلاد النوبة، مدعومة بحزام القلاع الـ17 ومناجم وادي العلاقي.',
    areaSource: 'أطلس التاريخ المصري القديم (جامعة كامبريدج) ووثائق لوحات حدود سنوسرت الثالث بسمنة',
    externalDependenciesCount: 2,
    externalDependenciesList: ['إقليم واوات (النوبة السفلى)', 'حزام قلاع سمنة وقمنة وبوهين'],
    internalProvincesCount: 42,
    internalProvincesLabel: '42 مقاطعة بنظام إداري مركزي',
    expansionType: 'امتداد جنوب الشلال الثاني',
    ratioToModern: 0.85,
    highlightNote: 'سلسلة قلاع سمنة وقمنة وبوهين لضبط تجارة النوبة'
  },
  {
    id: 4,
    slideIndex: 4,
    shortName: 'الهكسوس والانتقال',
    fullName: 'عصر الانتقال الثاني والمقاومة الوطنية',
    date: '1650 – 1550 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 320000,
    areaCalculationMethod: 'انحسار السيادة الشرعية الوطنية لأسرة طيبة (الأسرة 17) بين القوصية شمالاً وإلفنتين جنوباً، بينما خضعت الدلتا للهكسوس والنوبة لكوش.',
    areaSource: 'كيم ريهولت (The Political Situation in Egypt during the Second Intermediate Period) وسليم حسن',
    externalDependenciesCount: 0,
    externalDependenciesList: ['انعدام التبعيات — انكماش وطني تحت وطأة الاحتلال والتمزق'],
    internalProvincesCount: 8,
    internalProvincesLabel: '8 مقاطعات طيبية فقط',
    expansionType: 'انكماش وتجزئة سياسية',
    ratioToModern: 0.32,
    highlightNote: 'انحسار السيادة الوطنية في إقليم طيبة بين الهكسوس وكوش'
  },
  {
    id: 5,
    slideIndex: 5,
    shortName: 'الدولة الحديثة',
    fullName: 'الدولة الحديثة (الإمبراطورية المصرية العظمى)',
    date: '1550 – 1069 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 3200000,
    areaCalculationMethod: 'ذروة التوسع الإمبراطوري: من منعطف نهر الفرات وقادش شمالاً، مروراً بفلسطين وسواحل فينيقيا وسورية، وإلى الشلال الرابع جنوباً والواحات الليبية غرباً.',
    areaSource: 'جيمس هنري برستد (Ancient Records of Egypt) وتريفر بريس (The Kingdom of the Hittites) وجمال حمدان',
    externalDependenciesCount: 6,
    externalDependenciesList: [
      'ولاية كنعان وفلسطين',
      'مدن وسواحل فينيقيا',
      'إمارة أمورو وسورية',
      'إقليم واوات (النوبة السفلى)',
      'مملكة كوش (النوبة العليا حتى الشلال الرابع)',
      'حاميات الفرات وحلب'
    ],
    internalProvincesCount: 42,
    internalProvincesLabel: '42 مقاطعة مقسمة لولايتين شمالية وجنوبية',
    expansionType: 'ذروة التوسع الإمبراطوري',
    ratioToModern: 3.19,
    highlightNote: 'من الفرات شمالاً إلى الشلال الرابع جنوباً (تحتمس الثالث ورعمسيس الثاني)'
  },
  {
    id: 6,
    slideIndex: 6,
    shortName: 'النهضة الصاوية',
    fullName: 'العصر المتأخر (الأسرة 26 والنهضة الصاوية)',
    date: '664 – 525 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 950000,
    areaCalculationMethod: 'استعادة السيادة الوطنية للقطرين من البحر المتوسط لأسوان وسيناء، مع تأسيس الثغور الحصينة (دفنة ونوقراطيس) وتأمين الواحات.',
    areaSource: 'ألان لويد (Egypt After the Pharoahs) وإريك هورنونغ',
    externalDependenciesCount: 1,
    externalDependenciesList: ['حاميات ثغور سيناء والواحات الغربية ومراكز التجارة الإيجية'],
    internalProvincesCount: 42,
    internalProvincesLabel: '42 مقاطعة تقليدية مستعادة',
    expansionType: 'استعادة السيادة وإعادة بناء الأسطول',
    ratioToModern: 0.95,
    highlightNote: 'طرد الغزاة وإعادة توحيد القطرين وإنشاء مركز نوقراطيس التجاري'
  },
  {
    id: 7,
    slideIndex: 7,
    shortName: 'المملكة البطلمية',
    fullName: 'المملكة البطلمية (السيادة البحرية)',
    date: '305 – 30 ق.م',
    periodCategory: 'greco_roman',
    estimatedAreaKm2: 1650000,
    areaCalculationMethod: 'الأراضي المصرية مضافاً إليها إقليم قورينائية (برقة)، جزيرة قبرص، سورية المجوفة، وجيوب جزر بحر إيجة وسواحل كيليكيا وليكيا جنوب الأناضول.',
    areaSource: 'إدوارد بيفان (The House of Ptolemy) وغونتر هولبل (A History of the Ptolemaic Empire)',
    externalDependenciesCount: 5,
    externalDependenciesList: [
      'إقليم قورينائية (برقة/شرق ليبيا)',
      'جزيرة قبرص',
      'سورية المجوفة (كويليه سيريا وبلاد الشام)',
      'سواحل كيليكيا وليكيا جنوب الأناضول',
      'محطات وجزر بحر إيجة البحرية'
    ],
    internalProvincesCount: 42,
    internalProvincesLabel: '42 مقاطعة (Nomoi) ضمن 3 أقاليم كبرى',
    expansionType: 'سيادة بحرية بشرق المتوسط',
    ratioToModern: 1.65,
    highlightNote: 'حكم الإسكندرية وبرقة وقبرص وسواحل الشام وجنوب بحر إيجة'
  },
  {
    id: 8,
    slideIndex: 8,
    shortName: 'الروماني والبيزنطي',
    fullName: 'مصر الرومانية والبيزنطية (نظام الليميس)',
    date: '30 ق.م – 641 م',
    periodCategory: 'greco_roman',
    estimatedAreaKm2: 1100000,
    areaCalculationMethod: 'حدود ولاية مصر الرومانية الخاصة الخاضعة لحاكم الفرسان، ممتدة من شواطئ الإسكندرية لجزيرة فيلة بالشلال الأول وسلسلة حصون الليميس بالصحاري والواحات.',
    areaSource: 'ألن بومان (Egypt After the Pharaohs) وموسوعة كامبريدج لتاريخ العالم القديم',
    externalDependenciesCount: 0,
    externalDependenciesList: ['مصر نفسها كانت إقليماً إمبراطورياً خاصاً يتبع الإمبراطور الروماني مباشرة'],
    internalProvincesCount: 6,
    internalProvincesLabel: '3 إلى 6 أبرشيات رومانية/بيزنطية كبرى',
    expansionType: 'ولاية إمبراطورية كبرى',
    ratioToModern: 1.10,
    highlightNote: 'سلة غلال الإمبراطورية وشبكة حصون الليميس على الثغور'
  },
  {
    id: 9,
    slideIndex: 9,
    shortName: 'صدر الإسلام',
    fullName: 'مصر في صدر الإسلام (الراشدي والأموي والعباسي)',
    date: '641 – 868 م',
    periodCategory: 'islamic_medieval',
    estimatedAreaKm2: 1050000,
    areaCalculationMethod: 'مساحة ولاية مصر المستقرة عاصمتها الفسطاط من رفح شمال شرق إلى السلوم غرباً وجنوباً حتى القصر وأسوان بموجب معاهدة البقط المستقرة مع النوبة 652م.',
    areaSource: 'ابن عبد الحكم (فتوح مصر والمغرب) والمقريزي (المواعظ والاعتبار)',
    externalDependenciesCount: 1,
    externalDependenciesList: ['إقليم برقة التابع لولاية مصر أحياناً / معاهدة البقط مع المقرة'],
    internalProvincesCount: 33,
    internalProvincesLabel: '30 إلى 33 كُورة إدارية إسلامية',
    expansionType: 'استقرار وثبات الحدود',
    ratioToModern: 1.05,
    highlightNote: 'معاهدة البقط لتأمين الحدود الجنوبية وتأسيس الفسطاط'
  },
  {
    id: 10,
    slideIndex: 10,
    shortName: 'الطولونية والإخشيدية',
    fullName: 'الدولتان الطولونية والإخشيدية',
    date: '868 – 969 م',
    periodCategory: 'islamic_medieval',
    estimatedAreaKm2: 2100000,
    areaCalculationMethod: 'أول استقلال سياسي وعسكري يحكم من مصر ويمتد شمالاً ليشمل بلاد الشام كاملة والثغور المصيصة وطرسوس والحجاز وأطراف برقة.',
    areaSource: 'ابن سعيد المغربي (المُغرب في حلى المغرب) وأطلس التاريخ الإسلامي للدكتور حسين مؤنس',
    externalDependenciesCount: 3,
    externalDependenciesList: [
      'ولايات بلاد الشام (دمشق وحمص وحلب وأنطاكية)',
      'إقليم الحجاز والحرمين الشريفين',
      'إقليم برقة وطرابلس'
    ],
    internalProvincesCount: 34,
    internalProvincesLabel: '34 كُورة مصرية مركزية',
    expansionType: 'استقلال وتوسع مشرقي',
    ratioToModern: 2.09,
    highlightNote: 'أول استقلال سياسي إسلامي وبسط السيادة على الشام وأطراف الحجاز'
  },
  {
    id: 11,
    slideIndex: 11,
    shortName: 'الدولة الفاطمية',
    fullName: 'الدولة الفاطمية والتوسع الإمبراطوري',
    date: '969 – 1171 م',
    periodCategory: 'islamic_medieval',
    estimatedAreaKm2: 4100000,
    areaCalculationMethod: 'ذروة الخلافة الإمبراطورية الفاطمية من عاصمتها القاهرة: مصر، كامل بلاد الشام، الحرمين والحجاز، اليمن، برقة وإفريقية، وصقلية.',
    areaSource: 'المقريزي (اتعاظ الحنفا بأخبار الأئمة الفاطميين الخلفا) والدكتور حسن إبراهيم حسن',
    externalDependenciesCount: 7,
    externalDependenciesList: [
      'بلاد الشام وفلسطين حتى حلب',
      'إقليم الحجاز ومكة والمدينة',
      'بلاد اليمن وحضرموت',
      'إقليم برقة',
      'إقليم إفريقية (تونس وشرق الجزائر)',
      'جزيرة صقلية',
      'سواحل وثغور البحر الأحمر الغربية'
    ],
    internalProvincesCount: 36,
    internalProvincesLabel: '36 عملاً وكورة بإدارة الدواوين بالقاهرة',
    expansionType: 'خلافة إمبراطورية كبرى',
    ratioToModern: 4.09,
    highlightNote: 'تأسيس القاهرة وبسط السيادة من برقة والشام إلى الحجاز واليمن'
  },
  {
    id: 12,
    slideIndex: 12,
    shortName: 'الدولة الأيوبية',
    fullName: 'الدولة الأيوبية وسلطنة صلاح الدين',
    date: '1171 – 1250 م',
    periodCategory: 'islamic_medieval',
    estimatedAreaKm2: 2700000,
    areaCalculationMethod: 'الجبهة الإسلامية المتحدة بقيادة صلاح الدين الأيوبي وخلفائه: مصر، بلاد الشام كاملة، الحجاز، اليمن وتهامة، وديار بكر وشمال الجزيرة الفراتية.',
    areaSource: 'بهاء الدين بن شداد (النوادر السلطانية) وابن الأثير (الكامل في التاريخ) وجمال حمدان',
    externalDependenciesCount: 5,
    externalDependenciesList: [
      'سلطنة دمشق وبلاد الشام الجنوبية',
      'إمارة حلب والشام الشمالية',
      'إقليم ديار بكر والجزيرة الفراتية',
      'إقليم الحجاز والحرمين الشريفين',
      'بلاد اليمن وتهامة'
    ],
    internalProvincesCount: 24,
    internalProvincesLabel: '24 عملاً وناحية وفق الروك الأيوبي',
    expansionType: 'توحيد الجبهة الإسلامية',
    ratioToModern: 2.69,
    highlightNote: 'توحيد مصر والشام والحجاز واليمن وديار بكر لمواجهة الصليبيين'
  },
  {
    id: 13,
    slideIndex: 13,
    shortName: 'دولة المماليك',
    fullName: 'دولة المماليك (البحرية والبرجية)',
    date: '1250 – 1517 م',
    periodCategory: 'islamic_medieval',
    estimatedAreaKm2: 2300000,
    areaCalculationMethod: 'امتداد سلطان المماليك من قلعة الجبل بالقاهرة: مصر، نيابات الشام حتى الفرات، الحجاز، إقليم برقة، وحاميات شمال النوبة وموانئ البحر الأحمر (عيذاب وسواكن).',
    areaSource: 'القلقشندي (صبح الأعشى في صناعة الإنشا) والمقريزي (السلوك لمعرفة دول الملوك)',
    externalDependenciesCount: 4,
    externalDependenciesList: [
      'نيابة دمشق الكبرى',
      'نيابات حلب وحماة وطرابلس وصفد وثغور الفرات',
      'ولاية الحجاز والإشراف على مكة والمدينة',
      'حاميات عيذاب وسواكن وثغور البحر الأحمر'
    ],
    internalProvincesCount: 14,
    internalProvincesLabel: '14 عملاً وولايـة إدارية وفق الروك الناصري',
    expansionType: 'حماية المشرق الإسلامي',
    ratioToModern: 2.29,
    highlightNote: 'سحق المغول في عين جالوت وصد الصليبيين وبسط السيادة حتى الفرات'
  },
  {
    id: 14,
    slideIndex: 14,
    shortName: 'إيالة مصر العثمانية',
    fullName: 'إيالة مصر في العصر العثماني',
    date: '1517 – 1798 م',
    periodCategory: 'modern',
    estimatedAreaKm2: 1200000,
    areaCalculationMethod: 'مساحة إيالة مصر الممتازة وفق قانون نامه مصر الصادر عن السلطان سليمان القانوني، شاملة سيناء وثغور البحر الأحمر وحاميات العقبة ودرب الحج.',
    areaSource: 'أحمد شلبي بن عبد الغني (أوضح الإشارات) ود. عبد الرحيم عبد الرحمن عبد الرحيم',
    externalDependenciesCount: 2,
    externalDependenciesList: [
      'حاميات سواكن ومصوع بالبحر الأحمر التابعة لإيالة مصر',
      'قلاع ومحطات حراسة درب الحاج الشريف بالعقبة والحجاز'
    ],
    internalProvincesCount: 16,
    internalProvincesLabel: '16 ولاية وكشافة محلية داخل مصر',
    expansionType: 'إيالة ممتازة بقانون نامه',
    ratioToModern: 1.20,
    highlightNote: 'حكم شبه مستقل وتأمين درب الحاج وثغور البحر الأحمر وسواكن'
  },
  {
    id: 15,
    slideIndex: 15,
    shortName: 'دولة محمد علي',
    fullName: 'عصر محمد علي باشا والإمبراطورية الحديثة',
    date: '1805 – 1848 م',
    periodCategory: 'modern',
    estimatedAreaKm2: 3800000,
    areaCalculationMethod: 'أقصى اتساع عسكري للإمبراطورية المصرية قبيل معاهدة لندن 1840: مصر، السودان (سنار وكردفان)، الشام وفلسطين حتى كوتاهية، الحجاز ونجد، وجزيرة كريت.',
    areaSource: 'عبد الرحمن الرافعي (عصر محمد علي) وأرشيف عابدين والمستندات الدبلوماسية لمعاهدة كوتاهية 1833',
    externalDependenciesCount: 5,
    externalDependenciesList: [
      'مديريات عموم السودان (سنار، كردفان، الخرطوم، دنقلة)',
      'ولايات بلاد الشام كاملة حتى جبال طوروس',
      'إقليم الحجاز ونجد والجزيرة العربية',
      'جزيرة كريت بالبحر المتوسط',
      'إقليم أضنة وكوتاهية بآسيا الصغرى'
    ],
    internalProvincesCount: 7,
    internalProvincesLabel: '7 مديريات كبرى أسسها محمد علي بمصر',
    expansionType: 'نهضة وتوسع إمبراطوري حديث',
    ratioToModern: 3.79,
    highlightNote: 'امتداد النفوذ إلى السودان والشام والحجاز وكريت حتى كوتاهية'
  },
  {
    id: 16,
    slideIndex: 16,
    shortName: 'التوسع الإفريقي',
    fullName: 'خديوية مصر والتوسع الإفريقي (إسماعيل)',
    date: '1863 – 1879 م',
    periodCategory: 'modern',
    estimatedAreaKm2: 4800000,
    areaCalculationMethod: 'أكبر امتداد سيادي قاري في تاريخ مصر الحديث: من الإسكندرية شمالاً وحتى منابع النيل الاستوائية (أوغندا) وجنوباً لساحل الصومال وإقليم هرر وزيلع وبربرة.',
    areaSource: 'د. محمد فؤاد شكري (مصر والسيادة على السودان) والجمعية الجغرافية المصرية وأرشيف الجمعية الجغرافية الملكية البريطانية',
    externalDependenciesCount: 8,
    externalDependenciesList: [
      'مديرية خط الاستواء (إكواتوريا حتى بحيرات منابع النيل وأوغندا)',
      'سلطنة دارفور',
      'إقليم بحر الغزال وفاشودة',
      'مديريات كردفان والتاكا وسنار بالسودان',
      'إقليم وسواحل زيلع وبربرة بالصومال',
      'إقليم هرر التاريخي',
      'إقليم إريتريا وموانئ مصوع وبوغوص',
      'ساحل البحر الأحمر الجنوبي وباب المندب'
    ],
    internalProvincesCount: 14,
    internalProvincesLabel: '14 مديرية ومحافظة رئيسية بمصر',
    expansionType: 'أقصى اتساع قاري بإفريقيا',
    ratioToModern: 4.79,
    highlightNote: 'الوصول إلى بحيرات منابع النيل (أوغندا) وساحل الصومال وزيلع وبربرة'
  },
  {
    id: 17,
    slideIndex: 17,
    shortName: 'ترسيم الحدود الدولية',
    fullName: 'الاحتلال ومعاهدات ترسيم الحدود الحديثة',
    date: '1882 – 1952 م',
    periodCategory: 'modern',
    estimatedAreaKm2: 1002450,
    areaCalculationMethod: 'المساحة المحصورة بين المعاهدات الدولية الهندسية المكتملة: خط 22° جنوباً (1899)، خط رفح-طابا شرقاً (1906)، خط 25° غرباً (1925)، وتثبيت نقطة العوينات (1934).',
    areaSource: 'يونان لبيب رزق (قضية طابا ومفاوضات التحكيم) والأرشيف الوطني البريطاني وسجلات الخارجية المصرية',
    externalDependenciesCount: 0,
    externalDependenciesList: ['انفصال إدارة السودان عبر الحكم الثنائي، واقتصار السيادة الصريحة على الحدود الثابتة للقطر المصري'],
    internalProvincesCount: 16,
    internalProvincesLabel: '16 مديرية ومحافظة إدارية بمصر',
    expansionType: 'تثبيت الخطوط الهندسية الدولية',
    ratioToModern: 1.0,
    highlightNote: 'اتفاقيات 1899 (جنوباً 22°) و1906 (شرقاً رفح-طابا) و1925 (غرباً 25°)'
  },
  {
    id: 18,
    slideIndex: 18,
    shortName: 'الجمهورية المعاصرة',
    fullName: 'جمهورية مصر العربية المعاصرة',
    date: '1952 م – حتى اليوم',
    periodCategory: 'modern',
    estimatedAreaKm2: 1002450,
    areaCalculationMethod: 'الحدود السيادية البرية والبحرية الكاملة للجمهورية وتثبيت سيناء كاملة بعد ملحمة التحكيم الدولي بطابا 1989 وتعيين المناطق الاقتصادية الخالصة.',
    areaSource: 'الهيئة العامة للاستعلامات والجهاز المركزي للتعبئة العامة والإحصاء وحكم هيئة تحكيم طابا (جنيف 1988)',
    externalDependenciesCount: 0,
    externalDependenciesList: ['لا توجد تبعيات خارجية — دولة وطنية موحدة كاملة السيادة ضمن حدودها الدولية'],
    internalProvincesCount: 27,
    internalProvincesLabel: '27 محافظة مصرية',
    expansionType: 'سيادة وطنية كاملة وتثبيت طابا',
    ratioToModern: 1.0,
    highlightNote: 'استرداد كامل سيناء بالتحكيم الدولي بطابا 1989 وتثبيت الحدود المعترف بها'
  }
];

export function getStatBySlideId(id: number): EraStat {
  return ERA_STATISTICS.find(s => s.id === id) || ERA_STATISTICS[0];
}

