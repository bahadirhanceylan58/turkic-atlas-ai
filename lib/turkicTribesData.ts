export interface TurkicTribePoint {
    id: string;
    name: string; // e.g., "Kayseri/Pınarbaşı Avşarları"
    tribe: string; // The specific boy/tribe name, e.g., "Avşar", "Kayı", "Kınık"
    branch: string; // e.g., "Bozok", "Üçok"
    country: string; // e.g., "Türkiye", "İran"
    region: string; // The state/province, e.g., "Kayseri"
    coordinates: [number, number]; // [longitude, latitude]
    color: string; // Hex color code for map rendering
    description: string; // Short bio/info about this specific settlement
}

export const TURKIC_TRIBES_DATA: TurkicTribePoint[] = [
    // --- AVŞAR (AFSHAR) TRIBE ---

    // TURKEY (ANATOLIA)
    {
        id: "avsar-kayseri-tomarza",
        name: "Tomarza Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kayseri",
        coordinates: [35.8000, 38.4419],
        color: "#b91c1c", // Deep red
        description: "Kayseri'nin güneyinde, Uzunyayla ve Toros eteklerinde köklü Avşar yerleşimlerinden biri."
    },
    {
        id: "avsar-kayseri-pinarbasi",
        name: "Pınarbaşı Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kayseri",
        coordinates: [36.0844, 38.7230],
        color: "#b91c1c",
        description: "Dadaloğlu'nun yurdu olan ve Türkiye'deki en yoğun, hafızası en diri Avşar nüfusunu barındıran ilçe."
    },
    {
        id: "avsar-kayseri-sariz",
        name: "Sarız Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kayseri",
        coordinates: [36.4950, 38.4800],
        color: "#b91c1c",
        description: "Pınarbaşı ile birlikte Kayseri'de Avşar oymaklarının (Kocanallı, Halilpaşalı vb.) en belirgin olduğu yer."
    },
    {
        id: "avsar-kayseri-yahyali",
        name: "Yahyalı Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kayseri",
        coordinates: [35.4619, 38.1067],
        color: "#b91c1c",
        description: "Toros geçitlerini tutan, kilim kültürü ve köklü Yörük/Avşar gelenekleriyle bilinen merkez."
    },
    {
        id: "avsar-adana-kozan",
        name: "Kozan (Sis) Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Adana",
        coordinates: [35.8153, 37.4552],
        color: "#b91c1c",
        description: "Osmanlı döneminde özerk yaşayan Kozanoğlu Beyliği idaresinde toplanmış, Çukurova'nın en savaşçı grubu."
    },
    {
        id: "avsar-adana-tufanbeyli",
        name: "Tufanbeyli Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Adana",
        coordinates: [36.2208, 38.2611],
        color: "#b91c1c",
        description: "Binboğa dağları silsilesinde yer alan, Kayseri ve Adana arasındaki göç yollarının kilit noktası."
    },
    {
        id: "avsar-adana-saimbeyli",
        name: "Saimbeyli (Haçin) Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Adana",
        coordinates: [36.0911, 37.9861],
        color: "#b91c1c",
        description: "Torosların sarp vadilerinde yaşayan ve bölge savunmasında tarihi rol oynayan oymaklar."
    },
    {
        id: "avsar-maras-afsin",
        name: "Afşin Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kahramanmaraş",
        coordinates: [36.9142, 38.2464],
        color: "#b91c1c",
        description: "Adını bölgeye hükmeden Selçuklu komutanı Afşin Bey'den alan ve yoğun Afşar iskanı gören kıymetli vadi."
    },
    {
        id: "avsar-maras-goksun",
        name: "Göksun Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kahramanmaraş",
        coordinates: [36.4967, 38.0211],
        color: "#b91c1c",
        description: "Orta Anadolu ile Çukurova arasına sıkışmış stratejik kışlak ve yaylak güzergahlarındaki obalar."
    },
    {
        id: "avsar-sivas-kangal",
        name: "Kangal Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Sivas",
        coordinates: [37.3872, 39.2317],
        color: "#b91c1c",
        description: "Sivas'ın güneyinde, Kayseri sınırına yakın bölgelerde yaşayan akraba oymaklar."
    },
    {
        id: "avsar-sivas-gurun",
        name: "Gürün Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Sivas",
        coordinates: [37.2714, 38.7214],
        color: "#b91c1c",
        description: "Gürün vadisi boyunca yayılmış, Dulkadiroğlu ve Bozoklu Avşarlarının kuzey uzantısı."
    },
    {
        id: "avsar-yozgat-sivritepe",
        name: "Yozgat / Sarıkaya Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Yozgat",
        coordinates: [35.3775, 39.4939], // Sarıkaya
        color: "#b91c1c",
        description: "Tarihi Bozok Sancağı'nın (Yozgat) asli unsurlarından olan konar-göçer Türkmen grupları."
    },
    {
        id: "avsar-kirikkale-cerikli",
        name: "Çerikli (Delice) Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kırıkkale",
        coordinates: [34.0250, 39.9547], // Delice
        color: "#b91c1c",
        description: "İç Anadolu'nun batısına doğru ilerleyen Bozoklu ve Afşar kollarının iskan alanı."
    },
    {
        id: "avsar-karaman",
        name: "Karaman Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Karaman",
        coordinates: [33.2185, 37.1811],
        color: "#b91c1c",
        description: "Karamanoğulları Devleti sınırlarındaki tarihi Afşar askerleri ve onların bugünkü köyleri."
    },
    {
        id: "avsar-ankara-bala",
        name: "Bala Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Ankara",
        coordinates: [33.1233, 39.5542], // Bala
        color: "#b91c1c",
        description: "Ankara'nın güneyinde yoğunlaşan ve Bozulus Türkmenlerinden koptuğu bilinen boylar."
    },
    {
        id: "avsar-kastamonu",
        name: "Kastamonu Afşar Köyleri",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kastamonu",
        coordinates: [33.7765, 41.3766], // Kastamonu center approx
        color: "#b91c1c",
        description: "Çobanoğulları ve Candaroğulları uç beyliklerine yerleşip zamanla köyleşen (Kastamonu/Taşköprü civarı) kuzey grupları."
    },
    {
        id: "avsar-malatya-dogansehir",
        name: "Doğanşehir Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Malatya",
        coordinates: [37.8803, 38.0933], // Doğanşehir
        color: "#b91c1c",
        description: "Torosların doğu ucunda, Adıyaman ve Malatya arasına konumlanmış Alevi-Sünni Avşar dağ oymakları."
    },

    // IRAN & SOUTH AZERBAIJAN
    {
        id: "avsar-urmia-1",
        name: "Urmiye Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Batı Azerbaycan",
        coordinates: [45.0760, 37.5527],
        color: "#b91c1c",
        description: "Safeviler devrinde Urmiye Valiliğine atanan ve bölgenin mutlak hakimi olan, Urmiye Hanlığı'nı kuran asil Afşar kolu."
    },
    {
        id: "avsar-khorasan-abivard",
        name: "Ebivard (Horasan) Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Horasan-ı Razavi",
        coordinates: [59.6062, 36.2972], // Near Mashhad/Dargaz
        color: "#b91c1c",
        description: "Nadir Şah Afşar'ın mensup olduğu 'Kırklu' obasının yerleştiği; İran'ı Özbek/Türkmen akınlarına karşı koruyan askeri hat."
    },
    {
        id: "avsar-zanjan",
        name: "Zencan Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Zencan Eyaleti",
        coordinates: [48.4787, 36.6736],
        color: "#b91c1c",
        description: "Güney Azerbaycan ile Tahran arasındaki stratejik dağlık geçitleri tutan tarihi Afşar tumanı (bölgesi)."
    },
    {
        id: "avsar-khuzestan",
        name: "Huzistan Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Huzistan (Şuşter/Dezful)",
        coordinates: [48.8567, 32.0456], // Shushtar
        color: "#b91c1c",
        description: "Gündüzlü (Kündüzlü) obası başta olmak üzere Güneybatı İran arazisinde egemen olan, bölge valilikleri yapmış kol."
    },
    {
        id: "avsar-kerman",
        name: "Kirman Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Kirman",
        coordinates: [56.9999, 30.2839],
        color: "#b91c1c",
        description: "Büyük Selçuklu ve Safevi dönemlerinden kalma, Güney İran çöllerinin kenarında yaylak-kışlak yapan Afşar bakiyeleri."
    },
    {
        id: "avsar-fars-qashqai",
        name: "Fars (Kaşkay) Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Fars Eyaleti (Şiraz)",
        coordinates: [52.5388, 29.5918],
        color: "#b91c1c",
        description: "Kaşkay Türkleri ve Hamse konfederasyonu içine entegre olmuş, Şiraz çevresindeki Yörük/Afşar grupları."
    },

    // CAUCASUS & AFGHANISTAN & SYRIA
    {
        id: "avsar-barda-karabakh",
        name: "Karabağ Afşarları (Cevanşir)",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Azerbaycan",
        region: "Karabağ / Berde",
        coordinates: [47.1264, 40.3744], // Barda
        color: "#b91c1c",
        description: "Karabağ Hanlığı'nı kuran ve Panah Ali Han'ın da mensubu olduğu Cevanşir boyunun Afşarlara dayanan kökleri."
    },
    {
        id: "avsar-kabul-bala",
        name: "Kabil Afşar Mahalleleri",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Afganistan",
        region: "Kabil",
        coordinates: [69.1322, 34.5244], // Kabul west
        color: "#b91c1c",
        description: "Nadir Şah'ın ordusuyla Afganistan'a girip Kabil ve çevresinde garnizon/sivil olarak bıraktığı 'Afshar-e Bala' sakinleri (Kızılbaş Afşarlar)."
    },
    {
        id: "avsar-syria-halep",
        name: "Halep Avşarları (Köpekli/Gündüzlü)",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Suriye",
        region: "Halep",
        coordinates: [37.1343, 36.2021],
        color: "#b91c1c",
        description: "Kuzey Suriye, Bayırbucak ve Halep ovasına hakim olmuş Bozulus Türkmenleri içindeki güçlü Avşar kolları."
    },

    // --- KAYI TRIBE ---
    {
        id: "kayi-anatolia-1",
        name: "Söğüt ve Domaniç Kayıları",
        tribe: "Kayı",
        branch: "Bozok",
        country: "Türkiye",
        region: "Bilecik / Kütahya",
        coordinates: [30.1833, 40.0167], // Söğüt approx
        color: "#fbbf24", // Amber
        description: "Osmanlı Devleti'ni kuran ve Batı Anadolu'ya yerleşen Kayı boyunun en bilinen merkezlerinden biri."
    },
    {
        id: "kayi-anatolia-2",
        name: "Ahlat Kayıları",
        tribe: "Kayı",
        branch: "Bozok",
        country: "Türkiye",
        region: "Bitlis",
        coordinates: [42.4939, 38.7525], // Ahlat approx
        color: "#fbbf24",
        description: "Anadolu'ya giriş sürecinde Kayıların Ertuğrul Gazi babası Süleyman Şah (ya da Gündüz Alp) idaresinde bir dönem konakladıkları önemli merkez."
    },
    {
        id: "kayi-centralasia-1",
        name: "Merv / Mahan Kayıları",
        tribe: "Kayı",
        branch: "Bozok",
        country: "Türkmenistan",
        region: "Merv / Mahan",
        coordinates: [61.8333, 37.6000], // Merv approx
        color: "#fbbf24",
        description: "Osmanlı rivayetlerine göre Kayı boyunun Anadolu'ya göçmeden önceki ata yurtlarından biri (Horasan - Mahan bölgesi)."
    },

    // --- KINIK TRIBE ---
    {
        id: "kinik-centralasia-1",
        name: "Cend Kınıkları",
        tribe: "Kınık",
        branch: "Üçok",
        country: "Kazakistan",
        region: "Sır Derya (Seyhun) Boyları",
        coordinates: [61.1833, 44.5000], // Cend / Syr Darya approx
        color: "#3b82f6", // Blue
        description: "Selçuk Bey'in Oğuz Yabguluğu'ndan ayrılıp İslamiyet'i kabul ettiği ve Büyük Selçuklu Devleti'nin temellerinin atıldığı merkez."
    },
    {
        id: "kinik-iran-1",
        name: "Nişabur ve Merv Kınıkları",
        tribe: "Kınık",
        branch: "Üçok",
        country: "İran / Türkmenistan",
        region: "Horasan",
        coordinates: [58.8000, 36.2167], // Nishapur approx
        color: "#3b82f6",
        description: "Dandanakan Savaşı sonrası Büyük Selçuklu'nun ilk başkentleri ve Kınık boyunun büyük kitleler halinde yerleştiği Horasan şehirleri."
    },
    {
        id: "kinik-anatolia-1",
        name: "Kınık Boyu (Anadolu)",
        tribe: "Kınık",
        branch: "Üçok",
        country: "Türkiye",
        region: "Anadolu Genel",
        coordinates: [32.5000, 37.8667], // Konya approx (Rum Seljuk capital)
        color: "#3b82f6",
        description: "Büyük Selçuklu ve Anadolu Selçuklu devletlerini kuran boy. Türkiye'de 'Kınık' adını taşıyan sayısız yerleşim yeri bulunmaktadır."
    },

    // --- ÇEPNİ TRIBE ---
    {
        id: "cepni-anatolia-1",
        name: "Doğu Karadeniz Çepnileri",
        tribe: "Çepni",
        branch: "Üçok",
        country: "Türkiye",
        region: "Giresun, Trabzon, Ordu",
        coordinates: [38.3833, 40.9167], // Giresun approx
        color: "#10b981", // Emerald
        description: "Doğu Karadeniz'in Türkleşmesinde en büyük role sahip olan, Giresun/Trabzon/Gümüşhane hattına yoğun iskan edilmiş boy."
    },
    {
        id: "cepni-anatolia-2",
        name: "Batı Anadolu Çepnileri",
        tribe: "Çepni",
        branch: "Üçok",
        country: "Türkiye",
        region: "Balıkesir / İzmir",
        coordinates: [27.8833, 39.6500], // Balıkesir approx
        color: "#10b981",
        description: "Balıkesir, İzmir (Bergama), Manisa dolaylarında yaşayan Alevi/Sünni Çepni toplulukları."
    },

    // --- SALUR TRIBE ---
    {
        id: "salur-centralasia-1",
        name: "Ahal / Merv Teke-Salurları",
        tribe: "Salur",
        branch: "Üçok",
        country: "Türkmenistan",
        region: "Karakum / Ahal",
        coordinates: [58.3833, 37.9500], // Ashgabat/Ahal approx
        color: "#8b5cf6", // Violet
        description: "Modern Türkmenlerin önemli bir kısmını (Teke, Yomut vb. alt kolları ile) oluşturan ve Kadı Burhaneddin gibi hanedanlar çıkaran boy."
    },
    {
        id: "salur-anatolia-1",
        name: "Anadolu Salurları",
        tribe: "Salur",
        branch: "Üçok",
        country: "Türkiye",
        region: "Sivas / Kayseri / Kars",
        coordinates: [37.0150, 39.7505], // Sivas approx
        color: "#8b5cf6",
        description: "Anadolu'ya göçen, Sivas merkezli Kadı Burhaneddin Devleti'ni kuran ve Anadolu'nun birçok yerine isimlerini veren boy."
    },

    // --- PEÇENEK TRIBE ---
    {
        id: "pecenek-europe-1",
        name: "Balkan/Karadeniz Kuzeyi Peçenekleri",
        tribe: "Peçenek",
        branch: "Bozok", // Göktürk / Oghuz lists
        country: "Ukrayna / Romanya",
        region: "Deşt-i Kıpçak / Balkanlar",
        coordinates: [32.0000, 47.0000], // North of Black Sea
        color: "#f97316", // Orange
        description: "10. ve 11. yüzyıllarda Karadeniz'in kuzeyi ve Balkanlarda büyük siyasi güç olan savaşçı boy. 1071 Malazgirt'te saf değiştirmeleri meşhurdur."
    },
    {
        id: "pecenek-anatolia-1",
        name: "Anadolu Peçenekleri",
        tribe: "Peçenek",
        branch: "Bozok",
        country: "Türkiye",
        region: "Ankara / Kızılcahamam",
        coordinates: [32.6500, 40.4667], // Kızılcahamam approx
        color: "#f97316",
        description: "Bizans tarafından esir edilerek Anadolu'ya yerleştirilen ya da Oğuz göçleriyle gelen Peçeneklerin yerleşim bıraktığı bölgeler (Örn: Ankara Peçenek köyü)."
    },

    // --- KIPÇAK / KUMAN ---
    {
        id: "kipcak-eurasia-1",
        name: "Deşt-i Kıpçak (Kumanlar)",
        tribe: "Kıpçak",
        branch: "Kıpçak Birliği",
        country: "Kazakistan / Ukrayna / Rusya",
        region: "Avrasya Bozkırları",
        coordinates: [45.0000, 50.0000], // Steppes between Volga and Don
        color: "#eab308", // Yellow
        description: "Orta Çağ'da Avrasya bozkırlarına (Deşt-i Kıpçak) adını veren, Kazak, Kırgız, Tatar, Başkurt dillerinin temelini oluşturan devasa boylar konfederasyonu."
    },
    {
        id: "kipcak-egypt-1",
        name: "Mısır (Memlûk) Kıpçakları",
        tribe: "Kıpçak",
        branch: "Kıpçak Birliği",
        country: "Mısır",
        region: "Kahire",
        coordinates: [31.2333, 30.0444], // Cairo
        color: "#eab308",
        description: "Mısır ve Suriye'ye köle/asker (Memlûk) olarak getirilen ve sonrasında devleti ele geçirip Mısır Memlûk Devleti'ni (Ed-Devletü't-Türkiyye) kuran Kıpçak Türkleri."
    },

    // --- KARLUK TRIBE ---
    {
        id: "karluk-centralasia-1",
        name: "Yedisu (Semireçye) Karlukları",
        tribe: "Karluk",
        branch: "Karluk Birliği",
        country: "Kırgızistan / Kazakistan",
        region: "Talas / Balasagun",
        coordinates: [75.3000, 42.7500], // Balasagun / Tokmok approx
        color: "#06b6d4", // Cyan
        description: "Talas Savaşı'nda Müslümanların yanında yer alarak Orta Asya'nın kaderini değiştiren, Karahanlı Devleti'ni kuran ve Özbek/Uygur dillerinin atası olan boy."
    },

    // --- REMAINING BOZOK TRIBES (24 OGHUZ) ---
    {
        id: "bayat-anatolia-1",
        name: "Maraş Bayatları (Dulkadiroğulları)",
        tribe: "Bayat",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kahramanmaraş",
        coordinates: [37.5833, 37.5833],
        color: "#f87171", // Light Red
        description: "Dede Korkut ve Fuzuli'nin mensup olduğu, Oğuzların en şerefli sayılan boylarından biri."
    },
    {
        id: "bayat-iran-1",
        name: "Horasan Bayatları",
        tribe: "Bayat",
        branch: "Bozok",
        country: "İran",
        region: "Nişabur Çevresi",
        coordinates: [58.7958, 36.2133],
        color: "#f87171",
        description: "Safeviler devrinde Urmiye ve Horasan'a iskan edilen, Türkmen/Şii inancının güçlü temsilcileri."
    },
    {
        id: "alkaevli-anatolia-1",
        name: "Sivas/Yozgat Alkaevlileri",
        tribe: "Alkaevli",
        branch: "Bozok",
        country: "Türkiye",
        region: "Yozgat / Sivas",
        coordinates: [34.8044, 39.8181],
        color: "#2dd4bf", // Teal
        description: "'Ak çadırlı' anlamına gelen, iç ve doğu Anadolu'da köylere ismini veren boy."
    },
    {
        id: "karaevli-anatolia-1",
        name: "Kastamonu Karaevlileri",
        tribe: "Karaevli",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kastamonu",
        coordinates: [33.7765, 41.3766],
        color: "#1e293b", // Slate
        description: "'Kara çadırlı' anlamına gelen boy. Kastamonu ve Çankırı bölgesinde yerleşim bırakmışlardır."
    },
    {
        id: "yazir-turkmenistan-1",
        name: "Yazır Kalesi Türkmenleri",
        tribe: "Yazır",
        branch: "Bozok",
        country: "Türkmenistan",
        region: "Ahal Vilayeti",
        coordinates: [59.6105, 38.0772],
        color: "#d946ef", // Fuchsia
        description: "Orta Asya'da 'Yazır' adında kaleleri/şehirleri bulunan köklü Türkmen boyu."
    },
    {
        id: "doger-syria-1",
        name: "Rakka / Urfa Döğerleri",
        tribe: "Döğer",
        branch: "Bozok",
        country: "Türkiye / Suriye",
        region: "Urfa / Rakka",
        coordinates: [38.7969, 37.1611], // Urfa
        color: "#65a30d", // Lime
        description: "Artuklular'ı kurdukları düşünülen, Halep-Urfa-Diyarbakır üçgeninde hüküm sürmüş güçlü aşiret."
    },
    {
        id: "dodurga-anatolia-1",
        name: "Çorum Dodurgası",
        tribe: "Dodurga",
        branch: "Bozok",
        country: "Türkiye",
        region: "Çorum",
        coordinates: [34.7386, 40.8036],
        color: "#a855f7", // Purple
        description: "'Ülke alan, yöneten' anlamına gelen ve Çorum/Tokat hattında yerleşimleri bulunan boy."
    },
    {
        id: "yaparli-anatolia-1",
        name: "Diyarbakır Yaparlıları",
        tribe: "Yaparlı",
        branch: "Bozok",
        country: "Türkiye",
        region: "Diyarbakır",
        coordinates: [40.2306, 37.9144],
        color: "#ec4899", // Pink
        description: "Makrizi ve Kaşgarlı Mahmud'un listelerinde farklı isimlerle (Çarukluğ vb.) geçse de Reşideddin'e göre Bozoklar'dandır."
    },
    {
        id: "kizik-anatolia-1",
        name: "Gaziantep / Halep Kızıkları",
        tribe: "Kızık",
        branch: "Bozok",
        country: "Türkiye",
        region: "Gaziantep",
        coordinates: [37.3833, 37.0662],
        color: "#ef4444", // Red
        description: "Gaziantep, Halep ve Bursa (Cumalıkızık vb.) dolaylarına yerleşip Osmanlı sivil mimarisini etkileyen boy."
    },
    {
        id: "begdili-syria-1",
        name: "Halep Beğdili Boyu",
        tribe: "Beğdili",
        branch: "Bozok",
        country: "Suriye",
        region: "Halep / Rakka",
        coordinates: [37.3820, 36.1965], // Halep
        color: "#84cc16", // Lime
        description: "Safevi devletinin kuruluşunda yer alan Ustacalı, Şamlı gibi obaların bağlı olduğu devasa konfederasyon."
    },
    {
        id: "karkin-anatolia-1",
        name: "Halep Karkınları",
        tribe: "Karkın",
        branch: "Bozok",
        country: "Suriye / Türkiye",
        region: "Halep / Dulkadir",
        coordinates: [37.2000, 36.5000], // Approx border
        color: "#f59e0b", // Amber
        description: "'Aş doyuran' olarak bilinen Dulkadirli ve Halep Türkmenleri içinde geniş yer tutan boy."
    },

    // --- REMAINING ÜÇOK TRIBES (24 OGHUZ) ---
    {
        id: "bayindir-anatolia-1",
        name: "Tebriz / Diyarbakır Bayındırları (Akkoyunlu)",
        tribe: "Bayındır",
        branch: "Üçok",
        country: "İran / Türkiye",
        region: "Tebriz / Diyarbakır",
        coordinates: [40.2305, 38.0777], // Diyarbakır
        color: "#6366f1", // Indigo
        description: "Akkoyunlu Devleti'ni (Uzun Hasan) kuran ve Doğu Anadolu/Azerbaycan bölgesine hükmeden 'Her zaman nimetle dolu' boy."
    },
    {
        id: "cavuldur-anatolia-1",
        name: "Burdur Çavdırları",
        tribe: "Çavuldur",
        branch: "Üçok",
        country: "Türkiye",
        region: "Burdur",
        coordinates: [29.5985, 37.1585], // Çavdır, Burdur
        color: "#14b8a6", // Teal
        description: "Selçuklu sultanı Tuğrul Bey döneminde komutanlıklarda bulunan (Çavlı Bey vb.), Anadolu'ya yerleşen şöhretli boy."
    },
    {
        id: "eymur-anatolia-1",
        name: "Halep Eymürleri",
        tribe: "Eymür",
        branch: "Üçok",
        country: "Suriye / Türkiye",
        region: "Halep / Maraş",
        coordinates: [37.1000, 36.4000],
        color: "#c026d3", // Fuchsia
        description: "Dede Korkut efsanelerinde adı sıkça geçen, İçel ve Halep civarında göçer/yerleşik olan boy."
    },
    {
        id: "alayuntlu-anatolia-1",
        name: "Kütahya Alayuntluları",
        tribe: "Alayuntlu",
        branch: "Üçok",
        country: "Türkiye",
        region: "Kütahya",
        coordinates: [29.9833, 39.4167],
        color: "#9333ea", // Purple
        description: "'Alaca atlı' anlamına gelen, Kütahya-Eskişehir havzasında köyler kuran Oghuz boyu."
    },
    {
        id: "yuregir-anatolia-1",
        name: "Çukurova Yüreğirleri (Ramazanoğlu)",
        tribe: "Yüreğir",
        branch: "Üçok",
        country: "Türkiye",
        region: "Adana",
        coordinates: [35.3213, 36.9914], // Adana/Yüreğir
        color: "#0ea5e9", // Sky Blue
        description: "Ramazanoğulları Beyliği'ni kurup Çukurova'nın Türkleşmesini sağlayan, günümüzde Adana'ya Yüreğir ismini veren boy."
    },
    {
        id: "igdir-anatolia-1",
        name: "Iğdır / İçel İğdirleri",
        tribe: "İğdir",
        branch: "Üçok",
        country: "Türkiye",
        region: "Iğdır / Mersin",
        coordinates: [44.0450, 39.9272], // Iğdır
        color: "#10b981", // Emerald
        description: "'Yiğit, yüce' anlamına gelen ve Doğu Anadolu (Iğdır ili) ile Toroslarda (İçel) varlık gösteren boy."
    },
    {
        id: "bugduz-anatolia-1",
        name: "Ankara Büğdüzleri",
        tribe: "Büğdüz",
        branch: "Üçok",
        country: "Türkiye",
        region: "Ankara / Çorum",
        coordinates: [33.0232, 40.0903], // Ankara, Akyurt Büğdüz
        color: "#6b7280", // Gray
        description: "Osmanlı tahrir defterlerinde Anadolu'da pek çok köy adı bıraktığı görülen 'hizmetkâr' boy."
    },
    {
        id: "yiva-anatolia-1",
        name: "Erbil / Halep Yıvaları",
        tribe: "Yıva",
        branch: "Üçok",
        country: "Irak / Suriye",
        region: "Erbil / Halep",
        coordinates: [44.0114, 36.1911], // Erbil
        color: "#059669", // Emerald Dark
        description: "Selçuklu döneminde Erbil'de beylik kuran, Harezmşahlar döneminde İran ve Mısır'a kadar uzanan etkin boy."
    }
];

// Helper to extract unique tribes for filtering in the UI
export const getUniqueTribes = (): string[] => {
    const tribes = TURKIC_TRIBES_DATA.map(t => t.tribe);
    return Array.from(new Set(tribes));
};

// Helper to convert to GeoJSON for Mapbox
export const getTurkicTribesGeoJSON = (filterTribe?: string): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    const filteredData = filterTribe
        ? TURKIC_TRIBES_DATA.filter(t => t.tribe === filterTribe)
        : TURKIC_TRIBES_DATA;

    return {
        type: "FeatureCollection" as const,
        features: filteredData.map(point => ({
            type: "Feature" as const,
            geometry: {
                type: "Point" as const,
                coordinates: point.coordinates
            },
            properties: {
                id: point.id,
                name: point.name,
                tribe: point.tribe,
                branch: point.branch,
                country: point.country,
                region: point.region,
                color: point.color,
                description: point.description,
                type: 'turkic_tribe' // Helper for the Map Component click handler
            }
        }))
    };
};
