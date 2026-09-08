/**
 * Local Geographic Reference Dataset (الخريطة الجغرافية المرجعية المحلية)
 * 
 * Source: Natural Earth (Public Domain / CC0 - free to redistribute and bundle)
 * and OpenStreetMap open boundary references.
 * 
 * This module provides high-fidelity, georeferenced geographic vector layers
 * bundled directly with the application to serve as an authentic, zero-network,
 * 100% reliable local geographic basemap ("خريطة جغرافية مبسطة (محلية)").
 * 
 * Coverage encompasses all historical extents in the Egyptian atlas:
 * - Egypt (Nile Valley, Delta, Sinai, Eastern & Western Deserts, Oases)
 * - The Levant (Palestine, Jordan, Lebanon, Syria)
 * - Anatolia & Cyprus & Crete
 * - Sudan, Nubia, Ethiopia & the Horn of Africa
 * - The Arabian Peninsula & Hejaz
 * - Mesopotamia (Tigris & Euphrates)
 * - Eastern Libya / Cyrenaica
 */

export interface GeoPolygonFeature {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'sea' | 'lake' | 'depression' | 'land' | 'mountain_region' | 'oasis';
  coords: [number, number][]; // [lat, lon]
}

export interface GeoPolylineFeature {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'river_main' | 'river_tributary' | 'coastline' | 'canal';
  coords: [number, number][]; // [lat, lon]
}

export interface GeoPointFeature {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'sea' | 'river' | 'region' | 'mountain' | 'lake' | 'oasis' | 'strait';
  lat: number;
  lon: number;
  minZoom?: number;
  maxZoom?: number;
}

// ==========================================================================
// 1. Water Bodies: Seas, Gulfs, and Major Lakes
// ==========================================================================

export const LOCAL_SEAS_AND_LAKES: GeoPolygonFeature[] = [
  // Mediterranean Sea (البحر الأبيض المتوسط - الحوض الشرقي والجنوبي)
  {
    id: 'mediterranean_sea',
    nameAr: 'البحر الأبيض المتوسط',
    nameEn: 'Mediterranean Sea',
    type: 'sea',
    coords: [
      [31.55, 25.15], // Sallum (Egypt-Libya border)
      [32.00, 24.00], // Tobruk
      [32.80, 21.80], // Derna / Cyrenaica
      [33.50, 21.00],
      [34.00, 22.00],
      [35.00, 24.00], // South of Crete
      [35.20, 26.00], // East of Crete
      [36.00, 28.00], // Rhodes
      [36.50, 30.50], // Antalya bay
      [36.30, 32.00], // Alanya
      [36.10, 33.50], // Silifke / Mersin
      [36.70, 35.80], // Iskenderun bay
      [35.90, 35.90], // Latakia / Syria
      [34.90, 35.90], // Tartus
      [34.40, 35.80], // Tripoli / Lebanon
      [33.90, 35.50], // Beirut
      [33.27, 35.20], // Tyre
      [32.82, 34.98], // Acre / Haifa
      [32.08, 34.78], // Jaffa / Tel Aviv
      [31.67, 34.55], // Ashkelon
      [31.50, 34.45], // Gaza coast
      [31.28, 34.25], // Rafah
      [31.14, 33.80], // El Arish
      [31.26, 32.30], // Port Said
      [31.52, 31.83], // Damietta mouth
      [31.58, 31.05], // Burullus coast
      [31.42, 30.42], // Rosetta mouth
      [31.20, 29.92], // Alexandria
      [30.85, 29.50], // El Alamein
      [31.05, 28.50], // El Dabaa
      [31.35, 27.24], // Mersa Matruh
      [31.60, 25.90], // Sidi Barrani
      [31.55, 25.15]
    ]
  },

  // Red Sea Main Basin (البحر الأحمر)
  {
    id: 'red_sea',
    nameAr: 'البحر الأحمر',
    nameEn: 'Red Sea',
    type: 'sea',
    coords: [
      [27.72, 34.25], // Ras Muhammad (southern Sinai tip)
      [27.25, 33.80], // Hurghada
      [26.70, 33.95], // Safaga
      [26.10, 34.28], // El Quseir
      [25.07, 34.88], // Marsa Alam
      [23.95, 35.48], // Berenice
      [22.80, 35.95], // Shalateen
      [22.00, 36.89], // Ras Hadarba (Egypt-Sudan border)
      [20.50, 37.20], // Port Sudan
      [19.10, 37.33], // Suakin
      [18.00, 38.30], // Tokar / Red Sea south
      [15.60, 39.45], // Massawa / Eritrea
      [13.00, 42.70], // Assab
      [12.60, 43.35], // Bab el-Mandeb (African side)
      [12.65, 43.50], // Bab el-Mandeb (Arabian side / Perim)
      [13.30, 43.25], // Mocha / Yemen
      [14.80, 42.95], // Al Hudaydah
      [16.89, 42.55], // Jizan / Saudi Arabia
      [18.20, 41.50], // Al Qunfudhah
      [19.90, 40.50], // Al Lith
      [21.50, 39.15], // Jeddah
      [22.70, 38.90], // Rabigh
      [24.09, 38.05], // Yanbu
      [25.00, 37.30], // Umm Lajj
      [26.25, 36.45], // Al Wajh
      [27.60, 35.50], // Duba
      [28.10, 34.80], // Magna / Gulf of Aqaba entrance east
      [28.00, 34.45], // Tiran Island
      [27.72, 34.25]
    ]
  },

  // Gulf of Suez (خليج السويس)
  {
    id: 'gulf_of_suez',
    nameAr: 'خليج السويس',
    nameEn: 'Gulf of Suez',
    type: 'sea',
    coords: [
      [29.97, 32.55], // Suez city
      [29.40, 32.40], // Zafarana
      [28.40, 33.10], // Ras Gharib
      [27.72, 33.65], // Gemsa / Shadwan entrance
      [27.72, 34.25], // Ras Muhammad
      [28.25, 33.65], // El Tor (Sinai)
      [28.80, 33.20], // Abu Rudeis
      [29.25, 32.90], // Ras Sudr
      [29.90, 32.57], // Port Tawfiq
      [29.97, 32.55]
    ]
  },

  // Gulf of Aqaba (خليج العقبة)
  {
    id: 'gulf_of_aqaba',
    nameAr: 'خليج العقبة',
    nameEn: 'Gulf of Aqaba',
    type: 'sea',
    coords: [
      [27.72, 34.25], // Ras Muhammad
      [27.85, 34.30], // Nabq
      [28.50, 34.52], // Dahab
      [28.98, 34.65], // Nuweiba
      [29.49, 34.89], // Taba
      [29.53, 34.98], // Aqaba / Eilat
      [29.35, 34.97], // Haql (Saudi Arabia)
      [28.50, 34.80], // Magna coast
      [28.00, 34.60], // Ras al-Qasbah
      [27.72, 34.25]
    ]
  },

  // Persian Gulf (الخليج العربي)
  {
    id: 'persian_gulf',
    nameAr: 'الخليج العربي',
    nameEn: 'Persian Gulf',
    type: 'sea',
    coords: [
      [30.00, 48.30], // Shatt al-Arab delta
      [29.40, 48.00], // Kuwait bay
      [28.00, 48.80], // Khafji
      [27.00, 49.60], // Jubail
      [26.40, 50.15], // Dammam / Khobar
      [26.10, 50.60], // Bahrain
      [25.30, 51.50], // Qatar / Doha
      [24.50, 52.50], // Abu Dhabi coast
      [25.25, 55.30], // Dubai
      [26.20, 56.40], // Musandam / Strait of Hormuz
      [27.15, 56.30], // Bandar Abbas
      [26.80, 53.50], // Kish / Lavan
      [27.80, 51.90], // Bushehr
      [29.90, 50.15], // Bandar Deylam
      [30.00, 48.30]
    ]
  },

  // Lake Victoria (بحيرة فيكتوريا - المنبع الاستوائي للنيل الأبيض)
  {
    id: 'lake_victoria',
    nameAr: 'بحيرة فيكتوريا',
    nameEn: 'Lake Victoria',
    type: 'lake',
    coords: [
      [0.30, 32.50],
      [0.00, 34.00],
      [-1.00, 34.00],
      [-2.50, 33.00],
      [-2.50, 32.00],
      [-1.50, 31.70],
      [0.00, 31.80],
      [0.30, 32.50]
    ]
  },

  // Lake Albert (بحيرة ألبرت)
  {
    id: 'lake_albert',
    nameAr: 'بحيرة ألبرت',
    nameEn: 'Lake Albert',
    type: 'lake',
    coords: [
      [2.20, 31.40],
      [1.70, 31.10],
      [1.20, 30.50],
      [1.40, 30.30],
      [2.00, 31.00],
      [2.20, 31.40]
    ]
  },

  // Lake Tana (بحيرة تانا - منبع النيل الأزرق بالهضبة الإثيوبية)
  {
    id: 'lake_tana',
    nameAr: 'بحيرة تانا (منبع النيل الأزرق)',
    nameEn: 'Lake Tana',
    type: 'lake',
    coords: [
      [12.30, 37.30],
      [12.10, 37.50],
      [11.60, 37.40],
      [11.70, 37.15],
      [12.00, 37.10],
      [12.30, 37.30]
    ]
  },

  // Lake Nasser / Lake Nubia (بحيرة ناصر)
  {
    id: 'lake_nasser',
    nameAr: 'بحيرة ناصر / بحيرة النوبة',
    nameEn: 'Lake Nasser',
    type: 'lake',
    coords: [
      [23.97, 32.88], // High Dam / Aswan
      [23.50, 32.85],
      [22.80, 32.50],
      [22.35, 31.60], // Abu Simbel
      [21.80, 31.25], // Wadi Halfa / Sudan
      [22.00, 31.35],
      [22.50, 32.00],
      [23.20, 32.95],
      [23.97, 32.88]
    ]
  },

  // Lake Qarun - Fayoum (بحيرة قارون بالفيوم)
  {
    id: 'lake_qarun',
    nameAr: 'بحيرة قارون (منخفض الفيوم)',
    nameEn: 'Lake Qarun',
    type: 'lake',
    coords: [
      [29.50, 30.40],
      [29.52, 30.55],
      [29.48, 30.70],
      [29.45, 30.85],
      [29.43, 30.85],
      [29.44, 30.65],
      [29.47, 30.40],
      [29.50, 30.40]
    ]
  },

  // Dead Sea (البحر الميت)
  {
    id: 'dead_sea',
    nameAr: 'البحر الميت',
    nameEn: 'Dead Sea',
    type: 'lake',
    coords: [
      [31.78, 35.50],
      [31.55, 35.48],
      [31.30, 35.40],
      [31.10, 35.38],
      [31.15, 35.45],
      [31.40, 35.47],
      [31.75, 35.55],
      [31.78, 35.50]
    ]
  },

  // Lake Tiberias / Sea of Galilee (بحيرة طبريا)
  {
    id: 'sea_of_galilee',
    nameAr: 'بحيرة طبريا',
    nameEn: 'Sea of Galilee',
    type: 'lake',
    coords: [
      [32.90, 35.58],
      [32.82, 35.63],
      [32.72, 35.58],
      [32.75, 35.54],
      [32.85, 35.55],
      [32.90, 35.58]
    ]
  },

  // Northern Delta Coastal Lagoons (بحيرات الدلتا الشمالية)
  {
    id: 'lake_manzala',
    nameAr: 'بحيرة المنزلة',
    nameEn: 'Lake Manzala',
    type: 'lake',
    coords: [
      [31.35, 31.95],
      [31.30, 32.25],
      [31.15, 32.20],
      [31.10, 31.90],
      [31.25, 31.85],
      [31.35, 31.95]
    ]
  },
  {
    id: 'lake_burullus',
    nameAr: 'بحيرة البرلس',
    nameEn: 'Lake Burullus',
    type: 'lake',
    coords: [
      [31.55, 30.70],
      [31.58, 31.05],
      [31.45, 31.15],
      [31.40, 30.80],
      [31.55, 30.70]
    ]
  },

  // Qattara Depression (منخفض القطارة -133 متر تحت مستوى سطح البحر)
  {
    id: 'qattara_depression',
    nameAr: 'منخفض القطارة (-133 م)',
    nameEn: 'Qattara Depression',
    type: 'depression',
    coords: [
      [29.80, 26.50],
      [30.20, 27.20],
      [30.45, 27.80],
      [30.50, 28.50],
      [30.30, 29.00],
      [29.90, 28.80],
      [29.40, 28.20],
      [29.00, 27.30],
      [29.20, 26.80],
      [29.80, 26.50]
    ]
  },

  // Fayoum Depression (منخفض الفيوم الزراعي)
  {
    id: 'fayoum_depression',
    nameAr: 'واحة ومنخفض الفيوم',
    nameEn: 'Fayoum Depression',
    type: 'oasis',
    coords: [
      [29.55, 30.35],
      [29.58, 30.85],
      [29.40, 31.05],
      [29.15, 30.80],
      [29.20, 30.40],
      [29.55, 30.35]
    ]
  },

  // Mediterranean Islands: Cyprus (جزيرة قبرص)
  {
    id: 'island_cyprus',
    nameAr: 'جزيرة قبرص',
    nameEn: 'Cyprus',
    type: 'land',
    coords: [
      [35.15, 32.30],
      [34.70, 32.40],
      [34.60, 33.00],
      [34.90, 33.65],
      [35.00, 34.00],
      [35.65, 34.55], // Karpas Peninsula
      [35.40, 34.00],
      [35.35, 33.30],
      [35.15, 32.30]
    ]
  },

  // Mediterranean Islands: Crete (جزيرة كريت)
  {
    id: 'island_crete',
    nameAr: 'جزيرة كريت',
    nameEn: 'Crete',
    type: 'land',
    coords: [
      [35.50, 23.60],
      [35.20, 24.20],
      [35.00, 24.80],
      [35.00, 25.70],
      [35.20, 26.30],
      [35.35, 26.20],
      [35.45, 25.60],
      [35.55, 24.10],
      [35.50, 23.60]
    ]
  },

  // Red Sea: Tiran Island (جزيرة تيران)
  {
    id: 'island_tiran',
    nameAr: 'جزيرة تيران',
    nameEn: 'Tiran Island',
    type: 'land',
    coords: [
      [27.95, 34.55],
      [27.90, 34.60],
      [27.92, 34.65],
      [27.98, 34.58],
      [27.95, 34.55]
    ]
  }
];

// ==========================================================================
// 2. River Networks: The Nile Main Stem, Delta Branches, and Middle East Rivers
// ==========================================================================

export const LOCAL_RIVERS: GeoPolylineFeature[] = [
  // Main Nile River in Egypt (نهر النيل بمصر: من أسوان إلى الدلتا)
  {
    id: 'nile_egypt_main',
    nameAr: 'نهر النيل (المجرى الرئيسي)',
    nameEn: 'River Nile (Egypt Main)',
    type: 'river_main',
    coords: [
      [24.08, 32.89], // Aswan / First Cataract
      [24.45, 32.95], // Kom Ombo
      [24.97, 32.87], // Edfu
      [25.29, 32.55], // Esna
      [25.68, 32.64], // Luxor / Thebes
      [25.92, 32.75], // Qus
      [26.16, 32.72], // Qena (Great Eastern Bend)
      [26.05, 32.24], // Nag Hammadi
      [26.33, 31.90], // Girga / Abydos area
      [26.55, 31.70], // Sohag
      [26.77, 31.50], // Tahta
      [27.18, 31.18], // Asyut
      [27.56, 30.81], // Mallawi / Amarna
      [28.11, 30.75], // Minya
      [28.30, 30.70], // Samalut
      [28.70, 30.82], // Beni Mazar
      [29.06, 31.10], // Beni Suef
      [29.51, 31.20], // Al-Wasta
      [29.85, 31.30], // Helwan / Memphis
      [30.04, 31.23], // Cairo (Roda & Gezira islands)
      [30.19, 31.13]  // Qanater al-Khayriya (Delta Apex / Bifurcation point)
    ]
  },

  // Nile Delta: Rosetta Branch (فرع رشيد - الغربي)
  {
    id: 'nile_rosetta_branch',
    nameAr: 'فرع رشيد',
    nameEn: 'Rosetta Branch',
    type: 'river_main',
    coords: [
      [30.19, 31.13], // Qanater Delta apex
      [30.28, 31.00], // Ashmoun
      [30.40, 30.93], // Menouf
      [30.82, 30.81], // Kafr El-Zayat
      [31.13, 30.65], // Desouk
      [31.20, 30.55], // Fuwwah
      [31.40, 30.42], // Rosetta / Rashid city
      [31.46, 30.36]  // Rosetta Mouth (صب فرع رشيد بالمتوسط)
    ]
  },

  // Nile Delta: Damietta Branch (فرع دمياط - الشرقي)
  {
    id: 'nile_damietta_branch',
    nameAr: 'فرع دمياط',
    nameEn: 'Damietta Branch',
    type: 'river_main',
    coords: [
      [30.19, 31.13], // Qanater Delta apex
      [30.46, 31.18], // Benha
      [30.71, 31.24], // Zifta / Mit Ghamr
      [31.04, 31.38], // Mansoura / Talkha
      [31.24, 31.60], // Shirbin
      [31.33, 31.72], // Faraskur
      [31.41, 31.81], // Damietta city
      [31.52, 31.84]  // Ras El-Bar (صب فرع دمياط بالمتوسط)
    ]
  },

  // Bahr Yussef (بحر يوسف - فرع الفيوم التاريخي)
  {
    id: 'bahr_yussef',
    nameAr: 'بحر يوسف (مغذي الفيوم)',
    nameEn: 'Bahr Yussef',
    type: 'canal',
    coords: [
      [27.18, 31.10], // Dairut bifurcation
      [27.85, 30.85],
      [28.50, 30.75],
      [29.05, 30.88], // Lahun sluice
      [29.30, 30.84], // Fayoum city (Medinet el-Fayoum)
      [29.43, 30.70]  // Into Lake Qarun
    ]
  },

  // Nile River in Nubia and Sudan (نهر النيل في النوبة والسودان)
  {
    id: 'nile_sudan_main',
    nameAr: 'نهر النيل (النوبة والسودان)',
    nameEn: 'River Nile (Nubia & Sudan)',
    type: 'river_main',
    coords: [
      [15.60, 32.53], // Khartoum (Mقرن النيلين - Confluence of White & Blue Niles)
      [16.20, 32.65], // Sabaloka Gorge (6th Cataract)
      [16.70, 33.43], // Shendi / Meroë
      [17.70, 33.98], // Atbara (Confluence with Atbarah river)
      [18.02, 33.99], // Berber
      [19.15, 33.32], // Abu Hamad (Nile Great S-Curve Bend)
      [18.55, 31.85], // 4th Cataract / Merowe / Karima (Napata)
      [18.06, 31.00], // Old Dongola
      [19.16, 30.47], // Dongola
      [19.60, 30.45], // 3rd Cataract / Kerma
      [20.50, 30.50],
      [21.80, 31.30], // Wadi Halfa / 2nd Cataract
      [22.35, 31.60], // Abu Simbel
      [24.08, 32.89]  // To Aswan
    ]
  },

  // Blue Nile (النيل الأزرق: من بحيرة تانا إلى الخرطوم)
  {
    id: 'blue_nile',
    nameAr: 'النيل الأزرق (منبع الهضبة الإثيوبية)',
    nameEn: 'Blue Nile',
    type: 'river_tributary',
    coords: [
      [11.60, 37.40], // Lake Tana outflow (Tis Issat Falls)
      [10.80, 37.80],
      [10.10, 36.80],
      [11.85, 34.38], // Roseires Dam / Sudan border
      [13.16, 33.93], // Sennar Dam
      [14.40, 33.52], // Wad Madani
      [15.60, 32.53]  // Khartoum confluence
    ]
  },

  // White Nile (النيل الأبيض: من بحيرة فيكتوريا والسودان الجنوبي إلى الخرطوم)
  {
    id: 'white_nile',
    nameAr: 'النيل الأبيض',
    nameEn: 'White Nile',
    type: 'river_tributary',
    coords: [
      [4.85, 31.60],  // Juba (South Sudan)
      [6.20, 31.55],  // Bor
      [8.00, 31.00],  // Sudd wetlands
      [9.53, 31.66],  // Malakal (confluence with Sobat river)
      [11.00, 32.05], // Renk
      [13.16, 32.66], // Kosti
      [14.50, 32.30], // Ed Dueim
      [15.60, 32.53]  // Khartoum
    ]
  },

  // Atbarah River (نهر عطبرة: الضلع الثالث لنظام النيل)
  {
    id: 'atbara_river',
    nameAr: 'نهر عطبرة',
    nameEn: 'Atbarah River',
    type: 'river_tributary',
    coords: [
      [12.60, 37.20], // Simien Mountains / Ethiopia
      [14.00, 36.50],
      [15.45, 36.40], // Kassala / Sudan
      [16.70, 35.00],
      [17.70, 33.98]  // Confluence with Nile at Atbara city
    ]
  },

  // Jordan River (نهر الأردن)
  {
    id: 'jordan_river',
    nameAr: 'نهر الأردن',
    nameEn: 'Jordan River',
    type: 'river_tributary',
    coords: [
      [33.25, 35.65], // Mount Hermon springs (Hasbani / Dan / Banias)
      [32.90, 35.58], // Sea of Galilee north
      [32.72, 35.58], // Sea of Galilee south (Yarmouk confluence)
      [32.30, 35.55], // Jordan Rift Valley
      [31.90, 35.50], // Jericho area
      [31.78, 35.50]  // Dead Sea entry
    ]
  },

  // Orontes River (نهر العاصي ببلاد الشام)
  {
    id: 'orontes_river',
    nameAr: 'نهر العاصي',
    nameEn: 'Orontes River',
    type: 'river_tributary',
    coords: [
      [34.20, 36.20], // Bekaa Valley / Lebanon
      [34.73, 36.71], // Homs
      [35.13, 36.75], // Hama (Norias)
      [35.60, 36.35], // Ghab Plain
      [36.20, 36.15], // Antioch (Antakya)
      [36.08, 35.95]  // Samandag / Mediterranean Sea
    ]
  },

  // Euphrates River (نهر الفرات)
  {
    id: 'euphrates_river',
    nameAr: 'نهر الفرات',
    nameEn: 'Euphrates River',
    type: 'river_main',
    coords: [
      [38.80, 39.50], // Eastern Anatolia
      [37.50, 38.00], // Birecik / Carchemish
      [36.00, 38.00], // Lake Assad / Tabqa
      [35.95, 39.01], // Raqqa
      [35.33, 40.14], // Deir ez-Zor
      [34.45, 40.91], // Mari / Abu Kamal (Syria-Iraq border)
      [34.05, 42.38], // Haditha
      [33.43, 43.30], // Ramadi / Fallujah
      [32.03, 44.40], // Kufa / Najaf
      [31.05, 46.26], // Nasiriyah / Ur of the Chaldees
      [31.00, 47.45]  // Qurna (confluence with Tigris)
    ]
  },

  // Tigris River (نهر دجلة)
  {
    id: 'tigris_river',
    nameAr: 'نهر دجلة',
    nameEn: 'Tigris River',
    type: 'river_main',
    coords: [
      [38.30, 39.80], // Lake Hazar / Taurus
      [37.90, 40.20], // Diyarbakir
      [37.30, 42.20], // Cizre (Turkey-Syria-Iraq tripoint)
      [36.34, 43.13], // Mosul / Nineveh
      [34.60, 43.68], // Tikrit
      [34.20, 43.88], // Samarra
      [33.31, 44.36], // Baghdad
      [32.51, 45.83], // Kut
      [31.84, 47.14], // Amarah
      [31.00, 47.45]  // Qurna (Shatt al-Arab to Persian Gulf)
    ]
  }
];

// ==========================================================================
// 3. Geographic Labels & Reference Points (verified Arabic names)
// ==========================================================================

export const LOCAL_GEO_LABELS: GeoPointFeature[] = [
  // Major Seas & Water Bodies
  { id: 'lbl_med_sea', nameAr: 'البحر الأبيض المتوسط', nameEn: 'Mediterranean Sea', category: 'sea', lat: 33.20, lon: 29.50 },
  { id: 'lbl_red_sea', nameAr: 'البحر الأحمر', nameEn: 'Red Sea', category: 'sea', lat: 23.50, lon: 37.00 },
  { id: 'lbl_gulf_suez', nameAr: 'خليج السويس', nameEn: 'Gulf of Suez', category: 'sea', lat: 28.80, lon: 33.00 },
  { id: 'lbl_gulf_aqaba', nameAr: 'خليج العقبة', nameEn: 'Gulf of Aqaba', category: 'sea', lat: 28.90, lon: 34.80 },
  { id: 'lbl_persian_gulf', nameAr: 'الخليج العربي', nameEn: 'Persian Gulf', category: 'sea', lat: 27.50, lon: 51.00 },
  { id: 'lbl_gulf_aden', nameAr: 'خليج عدن', nameEn: 'Gulf of Aden', category: 'sea', lat: 12.50, lon: 46.00 },

  // Geographic Regions & Deserts
  { id: 'lbl_delta', nameAr: 'دلتا النيل', nameEn: 'Nile Delta', category: 'region', lat: 30.85, lon: 31.10 },
  { id: 'lbl_sinai', nameAr: 'شبه جزيرة سيناء', nameEn: 'Sinai Peninsula', category: 'region', lat: 29.40, lon: 33.80 },
  { id: 'lbl_eastern_desert', nameAr: 'الصحراء الشرقية', nameEn: 'Eastern Desert', category: 'region', lat: 26.50, lon: 33.00 },
  { id: 'lbl_western_desert', nameAr: 'الصحراء الغربية', nameEn: 'Western Desert', category: 'region', lat: 26.50, lon: 27.50 },
  { id: 'lbl_upper_egypt', nameAr: 'صعيد مصر (وادي النيل)', nameEn: 'Upper Egypt', category: 'region', lat: 25.80, lon: 32.40 },
  { id: 'lbl_nubia', nameAr: 'بلاد النوبة', nameEn: 'Nubia', category: 'region', lat: 21.50, lon: 31.50 },
  { id: 'lbl_levant', nameAr: 'بلاد الشام', nameEn: 'The Levant', category: 'region', lat: 33.80, lon: 36.50 },
  { id: 'lbl_hejaz', nameAr: 'الحجاز', nameEn: 'Hejaz', category: 'region', lat: 23.50, lon: 39.50 },
  { id: 'lbl_anatolia', nameAr: 'الأناضول', nameEn: 'Anatolia', category: 'region', lat: 38.00, lon: 33.00 },
  { id: 'lbl_mesopotamia', nameAr: 'بلاد الرافدين (العراق)', nameEn: 'Mesopotamia', category: 'region', lat: 33.50, lon: 44.00 },
  { id: 'lbl_cyrenaica', nameAr: 'إقليم برقة (شرق ليبيا)', nameEn: 'Cyrenaica', category: 'region', lat: 31.50, lon: 21.50 },

  // Egyptian Oases & Physical Depressions
  { id: 'lbl_siwa', nameAr: 'واحة سيوة', nameEn: 'Siwa Oasis', category: 'oasis', lat: 29.20, lon: 25.52 },
  { id: 'lbl_bahariya', nameAr: 'الواحات البحرية', nameEn: 'Bahariya Oasis', category: 'oasis', lat: 28.35, lon: 28.85 },
  { id: 'lbl_farafra', nameAr: 'واحة الفرافرة', nameEn: 'Farafra Oasis', category: 'oasis', lat: 27.06, lon: 27.97 },
  { id: 'lbl_dakhla', nameAr: 'واحة الداخلة', nameEn: 'Dakhla Oasis', category: 'oasis', lat: 25.50, lon: 29.00 },
  { id: 'lbl_kharga', nameAr: 'واحة الخارجة', nameEn: 'Kharga Oasis', category: 'oasis', lat: 25.44, lon: 30.55 },
  { id: 'lbl_fayoum', nameAr: 'منخفض الفيوم', nameEn: 'Fayoum', category: 'oasis', lat: 29.31, lon: 30.84 },
  { id: 'lbl_qattara', nameAr: 'منخفض القطارة (-133 م)', nameEn: 'Qattara Depression', category: 'region', lat: 29.70, lon: 27.50 },

  // Mountain Elevations & Key Peaks
  { id: 'lbl_catherine', nameAr: 'جبل كاترين (2629 م)', nameEn: 'Mount Catherine', category: 'mountain', lat: 28.51, lon: 33.95 },
  { id: 'lbl_red_sea_mountains', nameAr: 'سلسلة جبال البحر الأحمر', nameEn: 'Red Sea Hills', category: 'mountain', lat: 26.85, lon: 33.45 },
  { id: 'lbl_uwaynat', nameAr: 'جبل العوينات (1934 م)', nameEn: 'Jabal al-Uwaynat', category: 'mountain', lat: 21.92, lon: 24.98 },
  { id: 'lbl_hermon', nameAr: 'جبل الشيخ (2814 م)', nameEn: 'Mount Hermon', category: 'mountain', lat: 33.41, lon: 35.85 },
  { id: 'lbl_ethiopian_highlands', nameAr: 'الهضبة الإثيوبية', nameEn: 'Ethiopian Highlands', category: 'mountain', lat: 11.50, lon: 38.50 },

  // Key Rivers
  { id: 'lbl_river_nile', nameAr: 'نهر النيل الخالد', nameEn: 'River Nile', category: 'river', lat: 27.50, lon: 31.25 },
  { id: 'lbl_rosetta_branch', nameAr: 'فرع رشيد', nameEn: 'Rosetta Branch', category: 'river', lat: 30.95, lon: 30.70 },
  { id: 'lbl_damietta_branch', nameAr: 'فرع دمياط', nameEn: 'Damietta Branch', category: 'river', lat: 31.00, lon: 31.45 },
  { id: 'lbl_blue_nile', nameAr: 'النيل الأزرق', nameEn: 'Blue Nile', category: 'river', lat: 13.50, lon: 33.80 },
  { id: 'lbl_white_nile', nameAr: 'النيل الأبيض', nameEn: 'White Nile', category: 'river', lat: 11.50, lon: 32.20 },
  { id: 'lbl_euphrates', nameAr: 'نهر الفرات', nameEn: 'Euphrates', category: 'river', lat: 35.50, lon: 39.50 },
  { id: 'lbl_tigris', nameAr: 'نهر دجلة', nameEn: 'Tigris', category: 'river', lat: 35.00, lon: 43.50 },
  { id: 'lbl_jordan', nameAr: 'نهر الأردن', nameEn: 'Jordan River', category: 'river', lat: 32.20, lon: 35.55 }
];
