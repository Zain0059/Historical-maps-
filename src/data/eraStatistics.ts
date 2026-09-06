export interface EraStat {
  id: number;
  slideIndex: number;
  shortName: string;
  fullName: string;
  date: string;
  periodCategory: 'ancient' | 'greco_roman' | 'islamic_medieval' | 'modern' | 'overview';
  estimatedAreaKm2: number;
  provincesCount: number;
  expansionType: string;
  ratioToModern: number; // e.g. 3.19x or 0.32x
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
    provincesCount: 27,
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
    provincesCount: 1,
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
    provincesCount: 2,
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
    provincesCount: 3,
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
    provincesCount: 1,
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
    provincesCount: 6,
    expansionType: 'ذروة التوسع الإمبراطوري',
    ratioToModern: 3.19,
    highlightNote: 'من الفرات شمالاً إلى الشلال الرابع جنوباً (تحتمس الثالث ورعمسيس الثاني)'
  },
  {
    id: 6,
    slideIndex: 6,
    shortName: 'النهضة الصاوية',
    fullName: 'العصر المتأخر (الأسرة 25 والنهضة الصاوية)',
    date: '664 – 525 ق.م',
    periodCategory: 'ancient',
    estimatedAreaKm2: 950000,
    provincesCount: 2,
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
    provincesCount: 5,
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
    provincesCount: 2,
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
    provincesCount: 2,
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
    provincesCount: 4,
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
    provincesCount: 7,
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
    provincesCount: 5,
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
    provincesCount: 5,
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
    provincesCount: 3,
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
    provincesCount: 6,
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
    provincesCount: 8,
    expansionType: 'أقصى اتساع قاري بإفريقيا',
    ratioToModern: 4.79,
    highlightNote: 'الوصول إلى بحيرات منابع النيل (أوغندا) وساحل الصومال وزيلع وبربرة'
  },
  {
    id: 17,
    slideIndex: 17,
    shortName: 'ترسيم الحدود الدولية',
    fullName: 'الاحتلال ومعاهدات ترسيم الحدود الحديثة',
    date: '1882 – 1922 م',
    periodCategory: 'modern',
    estimatedAreaKm2: 1002450,
    provincesCount: 1,
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
    provincesCount: 27,
    expansionType: 'سيادة وطنية كاملة وتثبيت طابا',
    ratioToModern: 1.0,
    highlightNote: 'استرداد كامل سيناء بالتحكيم الدولي بطابا 1989 وتثبيت الحدود المعترف بها'
  }
];

export function getStatBySlideId(id: number): EraStat {
  return ERA_STATISTICS.find(s => s.id === id) || ERA_STATISTICS[0];
}
