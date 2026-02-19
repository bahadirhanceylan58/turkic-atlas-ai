export interface CulturalHeritage {
    id: string;
    name: string;
    type: 'monument' | 'literature' | 'mythology' | 'architecture';
    year: number; // Approximate start year
    lat: number;
    lng: number;
    description: string;
    significance: string;
    image?: string;
}

export const CULTURAL_HERITAGE_DATA: CulturalHeritage[] = [
    {
        id: 'orhun-yazitlari',
        name: 'Orhun Yazıtları',
        type: 'monument',
        year: 732,
        lat: 47.3486,
        lng: 102.8361,
        description: 'Göktürk İmparatorluğu döneminde dikilen, Türk adının geçtiği ilk Türkçe metinler.',
        significance: 'Türk dili ve tarihi için bilinen en eski yazılı edebi eserler.'
    },
    {
        id: 'divanu-lugatit-turk',
        name: "Divanü Lügati't-Türk (Kaşgar)",
        type: 'literature',
        year: 1072,
        lat: 39.4674,
        lng: 75.9928,
        description: 'Kaşgarlı Mahmud tarafından yazılan, Türk dillerinin bilinen en eski sözlüğü.',
        significance: '11. yüzyıl Türk boyları, dilleri ve coğrafyası hakkında ilk kapsamlı kaynak.'
    },
    {
        id: 'ahmet-yesevi-turbesi',
        name: 'Hoca Ahmet Yesevi Türbesi',
        type: 'architecture',
        year: 1389,
        lat: 43.2974,
        lng: 68.2709,
        description: 'Emir Timur tarafından Türkistan\'da (Yesi) inşa ettirilen muazzam mimari eser.',
        significance: 'Türkistan piri Ahmet Yesevi\'nin yattığı, Türk mimarisinin başyapıtlarından.'
    },
    {
        id: 'semerkant-registan',
        name: 'Semerkant Registan Meydanı',
        type: 'architecture',
        year: 1417,
        lat: 39.6548,
        lng: 66.9758,
        description: 'Uluğ Bey Medresesi ile başlayan, Şir Dor ve Tilla Kari ile tamamlanan Asya\'nın incisi.',
        significance: 'Timurlu mimarisi ve eğitim sisteminin, İslam dünyasındaki bilimsel zirvesinin sembolü.'
    },
    {
        id: 'selimiye-camii',
        name: 'Selimiye Camii',
        type: 'architecture',
        year: 1575,
        lat: 41.6781,
        lng: 26.5594,
        description: 'Mimar Sinan\'ın "ustalık eserim" dediği, Osmanlı mimarisinin başyapıtı.',
        significance: 'Dünya mimarlık tarihinin en görkemli yapılarından biri (UNESCO Mirası).'
    },
    {
        id: 'ergenekon-vadisi',
        name: 'Ergenekon (Altay/Sayan Dağları)',
        type: 'mythology',
        year: -1000,
        lat: 49.3133,
        lng: 88.0867,
        description: 'Türklerin demir dağı eriterek yeniden doğdukları efsanevi vadi.',
        significance: 'Türk milletinin yeniden diriliş ve bağımsızlık destanı.'
    },
    {
        id: 'manas-destani',
        name: 'Manas Destanı (Talas)',
        type: 'literature',
        year: 840,
        lat: 42.5228,
        lng: 72.2427,
        description: 'Dünyanın en uzun destanı olma özelliğini taşıyan Kırgız epik destanı.',
        significance: 'Türk ve Kırgız kültürünün sözlü geleneğinin ana direği.'
    },
    {
        id: 'kutadgu-bilig',
        name: 'Kutadgu Bilig (Balasagun)',
        type: 'literature',
        year: 1069,
        lat: 42.7461,
        lng: 75.2411,
        description: 'Yusuf Has Hacib tarafından yazılan, "Mutluluk Veren Bilgi" anlamına gelen siyasetname.',
        significance: 'İslami dönem Türk edebiyatının ilk büyük edebi eseri.'
    },
    {
        id: 'mostar-koprusu',
        name: 'Mostar Köprüsü',
        type: 'architecture',
        year: 1566,
        lat: 43.3373,
        lng: 17.8148,
        description: 'Mimar Hayreddin tarafından Neretva Nehri üzerine inşa edilen köprü.',
        significance: 'Osmanlı mimarisinin Balkanlardaki zarafet sembolü ve birleştirici gücü.'
    }
];
