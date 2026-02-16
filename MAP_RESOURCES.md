# Tarihsel Harita Kaynakları ve Kullanım Rehberi

"Gerçekçi" ve antika görünümlü haritalar eklemek için kullanabileceğiniz en iyi kaynaklar ve yöntemler aşağıdadır.

## 1. En İyi Harita Kaynakları

Bu sitelerden yüksek çözünürlüklü taramalar bulabilirsiniz:

### 🌍 Old Maps Online (Önerilen)
*   **Web:** [oldmapsonline.org](https://www.oldmapsonline.org)
*   **Özellik:** Harita üzerinde bölge seçerek o bölgeye ait tüm tarihi haritaları listeler.
*   **Kullanım:** "Turkey" veya "Central Asia" araması yapın, yılı seçin ve beğendiğiniz haritayı indirin.

### 🏛️ David Rumsey Map Collection
*   **Web:** [davidrumsey.com](https://www.davidrumsey.com)
*   **Özellik:** Dünyanın en geniş dijital harita arşivlerinden biridir. Çok yüksek çözünürlüklü Osmanlı ve Asya haritaları bulunur.
*   **İpucu:** Georeferencer aracı (haritayı dünya üzerine oturtma) kendi sitesinde mevcuttur.

### 🇹🇷 TÜBA Türk Devletleri Tarih Atlası
*   **Kaynak:** Türk Bilimler Akademisi'nin yayınları.
*   **Özellik:** Akademik olarak en doğru sınırları içerir. Bu haritaların dijital taramalarını bulabilirseniz en güvenilir kaynak budur.

### 📚 Diğer Kaynaklar
*   **Harvard Geospatial Library:** Akademik haritalar.
*   **WikiMedia Commons:** "Old maps of the Ottoman Empire" veya "Maps of Turkic history" kategorileri.

---

## 2. Haritayı Uygulamaya Ekleme Adımları

Bulduğunuz bir harita resmini (JPEG/PNG) uygulamaya eklemek için şu adımları izleyin:

### Adım 1: Resmi Hazırlayın
1.  Harita resmini indirin.
2.  Resmi `public/maps/` klasörüne (yoksa oluşturun) atın. Örn: `public/maps/ottoman_1683.jpg`.
    *   *Alternatif:* Resmi internete yükleyip (imgur, supabase vb.) doğrudan linkini de kullanabilirsiniz.

### Adım 2: Koordinatları Bulun (Georeferencing)
Resmin harita üzerinde tam nereye oturacağını bilmemiz gerekir. Bunun için resmin **4 köşesinin (Sol-Üst, Sağ-Üst, Sağ-Alt, Sol-Alt)** koordinatlarını (Enlem, Boylam) bulmalısınız.

*   Basit yöntem: Google Maps veya [geojson.io](https://geojson.io) açın. Resminizin kapladığı alanı göz kararı belirleyip 4 köşenin koordinatlarını not edin.

### Adım 3: `history.json` Dosyasını Güncelleyin
`public/data/history.json` dosyasında ilgili devletin özelliğine gidin ve `image_url` ile `coordinates` alanlarını ekleyin.

**Örnek (Osmanlı İmparatorluğu):**

```json
{
  "type": "Feature",
  "properties": {
    "name": "Ottoman Empire",
    "startYear": 1299,
    "endYear": 1922,
    "color": "#388E3C",
    "description": "...",
    
    // YENİ EKLENECEK KISIMLAR:
    "image_url": "/maps/ottoman_1683.jpg", // Veya "https://..."
    "coordinates": [
      [15.0, 50.0],  // Sol-Üst (Boylam, Enlem)
      [55.0, 50.0],  // Sağ-Üst
      [55.0, 10.0],  // Sağ-Alt
      [15.0, 10.0]   // Sol-Alt
    ]
  },
  "geometry": { ... } // Mevcut poligon sınırları kalabilir (yedek olarak)
}
```

### Önemli Not
Eğer `image_url` eklenirse, sistem otomatik olarak eski renkli çizimi gizleyip yerine bu harita resmini gösterecektir.

---

## 3. Vektör (Çizim) Veri Kaynakları

Sadece resim değil, devlet sınırlarını çizgi olarak (GeoJSON) arıyorsanız:

### 🌐 aourednik/historical-basemaps (GitHub)
*   **Link:** [github.com/aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
*   **Ne işe yarar?:** Dünya ülkelerinin farklı yıllardaki (MÖ 2000 - Günümüz) sınırlarını **GeoJSON** formatında sunar.
*   **Kullanım:** Bu verileri indirip `history.json` içindeki `geometry` (koordinatlar) kısmını güncellemek için kullanabilirsiniz. Bu kaynak "kağıt görünümü" vermez, sadece sınırların **daha doğru çizilmesini** sağlar.
