# IronPulse Açık Kaynak İçerik Kaynakları

## Seçilen Kaynak Stratejisi

IronPulse, native derlemelerde yüksek gerçeklikli anatomi için **BodyParts3D 4.0** yüzey kas verisinden türetilmiş seçilebilir GLB kullanır. Webde ve GLB açılamayan cihazlarda **Body Muscles** kaynaklı 70'ten fazla bölge içeren ayrıntılı ön/arka SVG atlası kullanır. Egzersiz ekranı yalnızca hareket adıyla birebir denetlenmiş **Wger** video kayıtlarını gösterir; genel arama sonuçları yanlış video riski nedeniyle kullanılmaz.

| Kaynak | Kullanım | Lisans / yükümlülük |
|---|---|---|
| BodyParts3D 4.0 | Seçilebilir anatomik bölgelerin akademik 3D verisi; uygulamadaki optimize GLB bunun türevidir | Resmî 4.0 arşiv açıklamasına göre CC BY 4.0; görünür atıf gerekir |
| Z-Anatomy | Anatomi veri kaynakları için araştırma referansı | CC BY-SA 4.0; uygulama varlığı olarak paketlenmedi |
| Body Muscles | Web ve GLB geri dönüşünde 70+ tıklanabilir anatomik SVG bölgesi | Apache 2.0; paket ve kaynak ekranında atıf görünür |
| Wger REST API | Video eklenen hareketler için birebir eşleşme ve kayıt-bazlı lisans/yazar denetimi | Uygulama kodu paketlenmez; yalnızca API'de CC BY-SA 4.0 olarak dönen, doğrulanmış doğrudan medya URL'leri uygulama içi tarayıcıda açılır. Kullanıcı isterse video kendi uygulama alanına kaydedilir; atıf ekranda korunur. |
| Wikimedia Commons | Önceki genel video araması | Kaldırıldı: kategori/arama sonuçları hareket adıyla birebir eşleşmeyi güvencelemiyordu |

## Uygulama Kararı

Tam BodyParts3D veri seti mobil yükleme için çok büyük olduğundan, IronPulse yalnızca 10 yüzeysel kas grubunu içeren, seçilebilir ve sıkıştırılmış bir GLB paketi kullanır. Ham OBJ arşivi yalnızca dönüşüm girdisidir ve sürüme dahil edilmez. Her model ekranında görünür atıf ve resmî kaynak bağlantısı bulunur. Web önizlemesi artık basit bir figür yerine, profesyonel kaynaklı ayrıntılı SVG atlası kullanır; yüksek detay GLB yalnızca native derlemede açılır.

Video bulunmayan bir hareket için uygulama video kartı göstermeyerek açıkça "Doğrulanmış video bekleniyor" durumuna geçer. Böylece benzer varyasyon, alakasız video veya belirsiz lisanslı içerik kullanıcıya doğru hareketmiş gibi sunulmaz. Doğrulanmış Wger bağlantıları `expo-web-browser` üzerinden iOS'ta uygulama içi Safari görünümü, Android'de uygulama içi Custom Tab ile açılır. Kullanıcı videoyu favorisine ekledikten sonra açık eylemiyle cihazının uygulama alanına kaydedebilir; dosya IronPulse sunucularına yüklenmez veya buradan dağıtılmaz.

## Kaynaklar

[1]: https://github.com/Z-Anatomy/Models-of-human-anatomy "Z-Anatomy — Models of human anatomy"

[2]: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html "BodyParts3D Database Description"

[3]: https://github.com/Kevin-Mattheus-Moerman/BodyParts3D "BodyParts3D model collection and license"

[4]: https://wger.de/en/software/api "Wger REST API"

[5]: https://commons.wikimedia.org/wiki/Category:Videos_of_physical_exercises "Wikimedia Commons physical exercise videos"

[6]: https://github.com/vulovix/body-muscles "Body Muscles — Apache 2.0 interactive muscle map"
