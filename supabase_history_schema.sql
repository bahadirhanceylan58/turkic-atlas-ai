-- ============================================
-- TARIH MODU — Supabase Şema
-- ============================================

-- 1) Tarihsel Olaylar (Savaşlar & Anlaşmalar)
CREATE TABLE IF NOT EXISTS historical_events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('battle', 'treaty')),
  year INTEGER NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  description TEXT,
  parties TEXT[], -- ['Selçuklu', 'Bizans']
  result TEXT,
  importance TEXT CHECK (importance IN ('critical', 'major', 'minor')),
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Yer Adı Geçmişi (Etimoloji)
CREATE TABLE IF NOT EXISTS place_name_history (
  id SERIAL PRIMARY KEY,
  modern_name TEXT NOT NULL,
  historical_name TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  language TEXT,
  meaning TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_events_year ON historical_events (year);
CREATE INDEX IF NOT EXISTS idx_events_type ON historical_events (type);
CREATE INDEX IF NOT EXISTS idx_place_names_modern ON place_name_history (modern_name);
CREATE INDEX IF NOT EXISTS idx_place_names_years ON place_name_history (start_year, end_year);

-- ============================================
-- SEED DATA — Savaşlar
-- ============================================
INSERT INTO historical_events (name, type, year, lat, lng, description, parties, result, importance, source) VALUES

-- Büyük Savaşlar
('Talas Muharebesi', 'battle', 751, 42.52, 72.23, 'Abbasi-Türk ittifakı ile Çin Tang Hanedanlığı arasındaki savaş. İslam''ın Orta Asya''ya yayılmasının dönüm noktası.', ARRAY['Abbasiler & Karluklar', 'Tang Hanedanlığı'], 'Abbasi-Türk Zaferi', 'critical', 'İbnü''l-Esir, el-Kamil fi''t-Tarih'),

('Dandanakan Muharebesi', 'battle', 1040, 37.05, 62.17, 'Selçukluların Gaznelilere karşı kazandığı zafer. Büyük Selçuklu Devleti''nin kuruluş savaşı.', ARRAY['Büyük Selçuklu', 'Gazneliler'], 'Selçuklu Zaferi', 'critical', 'Nizamülmülk, Siyasetname'),

('Malazgirt Muharebesi', 'battle', 1071, 39.14, 42.54, 'Anadolu''nun kapısını Türklere açan muharebe. Alparslan''ın Romanos Diogenes''i mağlup ettiği savaş.', ARRAY['Büyük Selçuklu', 'Bizans İmparatorluğu'], 'Selçuklu Zaferi', 'critical', 'İbnü''l-Esir; Urfalı Mateos'),

('Miryokefalon Muharebesi', 'battle', 1176, 38.19, 29.98, 'Anadolu Selçukluları''nın Bizans''ı kesin yenilgiye uğrattığı savaş. Anadolu''nun Türk yurdu olduğu tescillendi.', ARRAY['Anadolu Selçuklu', 'Bizans İmparatorluğu'], 'Selçuklu Zaferi', 'critical', 'Niketas Khoniates'),

('Kösedağ Muharebesi', 'battle', 1243, 39.92, 36.67, 'Moğol İlhanlıları karşısında Anadolu Selçuklularının yenilgisi. Selçuklu Devleti Moğol vassalı oldu.', ARRAY['Anadolu Selçuklu', 'Moğol İmparatorluğu'], 'Moğol Zaferi', 'critical', 'Alaeddin Ata Melik Cüveyni'),

('İstanbul''un Fethi', 'battle', 1453, 41.01, 28.98, 'Fatih Sultan Mehmed''in Konstantinopolis''i fethetmesi. Ortaçağ''ın sonu, yeni bir çağın başlangıcı.', ARRAY['Osmanlı İmparatorluğu', 'Bizans İmparatorluğu'], 'Osmanlı Zaferi', 'critical', 'Tursun Bey, Tarih-i Ebu''l Feth'),

('Çaldıran Muharebesi', 'battle', 1514, 39.27, 44.08, 'Yavuz Sultan Selim''in Safevi Şah İsmail''i yendiği savaş. Doğu Anadolu Osmanlı''ya katıldı.', ARRAY['Osmanlı İmparatorluğu', 'Safevi Devleti'], 'Osmanlı Zaferi', 'major', 'İdris-i Bitlisi'),

('Mohaç Muharebesi', 'battle', 1526, 45.94, 18.69, 'Kanuni Sultan Süleyman''ın Macaristan Kralı II. Lajos''u mağlup ettiği savaş.', ARRAY['Osmanlı İmparatorluğu', 'Macaristan Krallığı'], 'Osmanlı Zaferi', 'critical', 'Osmanlı Kronikler'),

('Sakarya Meydan Muharebesi', 'battle', 1921, 39.78, 30.40, 'Türk Kurtuluş Savaşı''nın dönüm noktası. 22 gün 22 gece süren meydan muharebesi.', ARRAY['TBMM Kuvvetleri', 'Yunan Ordusu'], 'Türk Zaferi', 'critical', 'Nutuk (Mustafa Kemal Atatürk)'),

('Büyük Taarruz', 'battle', 1922, 38.67, 30.29, 'Türk Kurtuluş Savaşı''nın son büyük taarruzu. Başkomutan Meydan Muharebesi.', ARRAY['TBMM Kuvvetleri', 'Yunan Ordusu'], 'Türk Zaferi', 'critical', 'Genelkurmay Harp Tarihi'),

('Ankara Muharebesi', 'battle', 1402, 39.93, 32.86, 'Timur''un Yıldırım Bayezid''i esir aldığı savaş. Osmanlı''da Fetret Devri başladı.', ARRAY['Timur İmparatorluğu', 'Osmanlı İmparatorluğu'], 'Timur Zaferi', 'critical', 'Şerefeddin Ali Yezdi'),

('Preveze Deniz Muharebesi', 'battle', 1538, 38.95, 20.75, 'Barbaros Hayreddin Paşa''nın Haçlı donanmasını yendiği deniz savaşı. Akdeniz Türk gölü oldu.', ARRAY['Osmanlı İmparatorluğu', 'Haçlı İttifakı'], 'Osmanlı Zaferi', 'major', 'Katip Çelebi, Tuhfetü''l-Kibar'),

('Niğbolu Muharebesi', 'battle', 1396, 43.70, 24.89, 'Yıldırım Bayezid''in Haçlı ordusunu bozguna uğrattığı savaş.', ARRAY['Osmanlı İmparatorluğu', 'Haçlı İttifakı'], 'Osmanlı Zaferi', 'major', 'Schiltberger Seyahatnamesi'),

('Ridaniye Muharebesi', 'battle', 1517, 30.05, 31.28, 'Yavuz Sultan Selim''in Memlük Sultanı''nı yenerek Mısır''ı fethettiği savaş. Halifelik Osmanlı''ya geçti.', ARRAY['Osmanlı İmparatorluğu', 'Memlük Sultanlığı'], 'Osmanlı Zaferi', 'critical', 'İbn İyas');

-- ============================================
-- SEED DATA — Anlaşmalar
-- ============================================
INSERT INTO historical_events (name, type, year, lat, lng, description, parties, result, importance, source) VALUES

('Amasya Antlaşması', 'treaty', 1555, 40.65, 35.83, 'Osmanlı ile Safevi arasındaki ilk resmi barış. Doğu sınırları belirlendi.', ARRAY['Osmanlı İmparatorluğu', 'Safevi Devleti'], 'Barış', 'major', 'BOA'),

('Karlofça Antlaşması', 'treaty', 1699, 45.03, 20.08, 'Osmanlı''nın toprak kaybettiği ilk büyük antlaşma. Macaristan, Mora ve Dalmaçya kaybedildi.', ARRAY['Osmanlı İmparatorluğu', 'Kutsal İttifak'], 'Osmanlı toprak kaybetti', 'critical', 'Silahdar Tarihi'),

('Küçük Kaynarca Antlaşması', 'treaty', 1774, 43.44, 27.13, 'Osmanlı-Rus savaşı sonrası imzalanan antlaşma. Kırım bağımsız ilan edildi, Rusya Karadeniz''e açıldı.', ARRAY['Osmanlı İmparatorluğu', 'Rusya İmparatorluğu'], 'Osmanlı toprak kaybetti', 'critical', 'Ahmed Vasıf Efendi Tarihi'),

('Mondros Mütarekesi', 'treaty', 1918, 39.10, 26.55, 'I. Dünya Savaşı sonrası Osmanlı''nın silah bırakması. İşgal dönemi başladı.', ARRAY['Osmanlı İmparatorluğu', 'İtilaf Devletleri'], 'Osmanlı teslim oldu', 'critical', 'Resmi Gazete'),

('Mudanya Mütarekesi', 'treaty', 1922, 40.37, 28.88, 'Kurtuluş Savaşı sonrası ateşkes. Doğu Trakya''nın savaşsız teslimi sağlandı.', ARRAY['TBMM', 'İtilaf Devletleri'], 'Türk diplomatik zaferi', 'major', 'Türk İnkılap Tarihi'),

('Lozan Antlaşması', 'treaty', 1923, 46.52, 6.63, 'Türkiye Cumhuriyeti''nin uluslararası alanda tanındığı antlaşma. Modern Türkiye''nin kuruluş belgesi.', ARRAY['TBMM', 'İtilaf Devletleri'], 'Türkiye tanındı', 'critical', 'İsmet İnönü Hatıralar'),

('Ankara Antlaşması', 'treaty', 1921, 39.93, 32.86, 'Fransa ile TBMM arasında imzalanan antlaşma. Güney cephesi kapandı.', ARRAY['TBMM', 'Fransa'], 'Barış', 'major', 'TBMM Zabıt Cerideleri'),

('Moskova Antlaşması', 'treaty', 1921, 55.75, 37.62, 'Sovyet Rusya ile TBMM arasında imzalanan dostluk antlaşması. Doğu sınırı belirlendi.', ARRAY['TBMM', 'Sovyet Rusya'], 'Barış ve sınır', 'major', 'Dışişleri Bakanlığı Arşivi');

-- ============================================
-- SEED DATA — Yer Adı Geçmişi
-- ============================================
INSERT INTO place_name_history (modern_name, historical_name, start_year, end_year, language, meaning, lat, lng, source) VALUES

-- İstanbul
('İstanbul', 'Byzantion', -660, 330, 'Yunanca', 'Kral Byzas''ın şehri', 41.01, 28.98, 'Herodotus'),
('İstanbul', 'Constantinople', 330, 1453, 'Latince', 'Konstantin''in şehri', 41.01, 28.98, 'Roma İmparatorluk Kayıtları'),
('İstanbul', 'Kostantiniyye', 1453, 1930, 'Osmanlıca', 'Konstantinopolis''in Türkçe formu', 41.01, 28.98, 'BOA'),
('İstanbul', 'İstanbul', 1930, 2099, 'Türkçe', '"eis tin polin" = şehre doğru', 41.01, 28.98, 'Resmi Gazete'),

-- Ankara
('Ankara', 'Ankyra', -278, 25, 'Keltçe/Galatça', 'Çapa (Gemi çapası)', 39.93, 32.86, 'Strabon, Geographika'),
('Ankara', 'Ancyra', 25, 1073, 'Latince', 'Çapa', 39.93, 32.86, 'Roma Eyalet Kayıtları'),
('Ankara', 'Engürü', 1073, 1923, 'Türkçe/Farsça', 'Üzüm', 39.93, 32.86, 'Evliya Çelebi Seyahatnamesi'),
('Ankara', 'Ankara', 1923, 2099, 'Türkçe', 'Başkent', 39.93, 32.86, 'Resmi Gazete'),

-- İzmir
('İzmir', 'Smyrna', -1000, 1424, 'Yunanca', 'Amazon Kraliçesi Smyrna', 38.42, 27.13, 'Homeros, İlyada'),
('İzmir', 'İzmir', 1424, 2099, 'Türkçe', 'Smyrna''nın Türkçe formu', 38.42, 27.13, 'Evliya Çelebi'),

-- Sivas
('Sivas', 'Sebasteia', -64, 1075, 'Yunanca/Latince', 'Saygıdeğer, kutsal', 39.75, 37.02, 'Roma Eyalet Kayıtları'),
('Sivas', 'Sivas', 1075, 2099, 'Türkçe', 'Sebasteia''nın Türkçe formu', 39.75, 37.02, 'Danişmendname'),

-- Trabzon
('Trabzon', 'Trapezous', -756, 1461, 'Yunanca', 'Masa/Trapez şeklinde', 41.00, 39.72, 'Ksenophon, Anabasis'),
('Trabzon', 'Trabzon', 1461, 2099, 'Türkçe', 'Trapezous''un Türkçe formu', 41.00, 39.72, 'Aşıkpaşazade'),

-- Konya
('Konya', 'Ikonion', -2000, 1076, 'Frigce/Yunanca', 'İkon/Resim', 37.87, 32.49, 'Ksenophon'),
('Konya', 'Konya', 1076, 2099, 'Türkçe', 'Ikonion''un Türkçe formu', 37.87, 32.49, 'Mevlana Celaleddin'),

-- Kayseri
('Kayseri', 'Mazaka', -2000, -17, 'Hititçe/Kapadokyaca', 'Bilinmiyor', 38.73, 35.48, 'Hitit Tabletleri'),
('Kayseri', 'Caesarea', -17, 1075, 'Latince', 'Sezar''ın şehri', 38.73, 35.48, 'Strabon'),
('Kayseri', 'Kayseri', 1075, 2099, 'Türkçe', 'Caesarea''nın Türkçe formu', 38.73, 35.48, 'Danişmendname'),

-- Edirne
('Edirne', 'Hadrianopolis', 125, 1362, 'Latince', 'İmparator Hadrianus''un şehri', 41.67, 26.55, 'Roma Kayıtları'),
('Edirne', 'Edirne', 1362, 2099, 'Türkçe', 'Hadrianopolis kısaltması', 41.67, 26.55, 'Osmanlı Kronikler'),

-- Bursa
('Bursa', 'Prusa', -185, 1326, 'Yunanca', 'Kral Prusias''ın şehri', 40.18, 29.06, 'Strabon'),
('Bursa', 'Bursa', 1326, 2099, 'Türkçe', 'Prusa''nın Türkçe formu', 40.18, 29.06, 'Aşıkpaşazade'),

-- Antalya
('Antalya', 'Attaleia', -150, 1207, 'Yunanca', 'Kral Attalos''un şehri', 36.89, 30.71, 'Strabon'),
('Antalya', 'Antalya', 1207, 2099, 'Türkçe', 'Attaleia''nın Türkçe formu', 36.89, 30.71, 'Selçuklu Kaynakları'),

-- Diyarbakır
('Diyarbakır', 'Amida', -1500, 1085, 'Süryanice/Aramice', 'Güçlü sütunlar', 37.91, 40.22, 'Ammianus Marcellinus'),
('Diyarbakır', 'Diyar-ı Bekr', 1085, 1937, 'Arapça/Türkçe', 'Bekr kabilesinin yurdu', 37.91, 40.22, 'İbnü''l-Esir'),
('Diyarbakır', 'Diyarbakır', 1937, 2099, 'Türkçe', 'Modern form + bakır madeni', 37.91, 40.22, 'Resmi Gazete');


-- RLS (Row Level Security) - Herkes okuyabilir
ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_name_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON historical_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON place_name_history FOR SELECT USING (true);
