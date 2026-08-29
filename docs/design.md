# IronPulse — Mobil Arayüz Tasarım Planı

## Ürün İlkesi

IronPulse, spor salonunda tek elle ve kesintisiz kullanılmak üzere tasarlanan, **yerel öncelikli** bir güç antrenmanı günlüğüdür. Arayüz, iOS İnsan Arayüzü İlkeleriyle uyumlu geniş dokunma hedefleri, sakin hiyerarşi, belirgin geri bildirim ve doğal sayfa geçişleri kullanır. Her ana işlev, 9:16 portre ekranda başparmağın rahat erişebildiği bir alanda konumlanır.

## Ekran Listesi ve İşlevler

| Ekran | Ana içerik | İşlevler |
|---|---|---|
| Karşılama ve güvenli giriş | Uygulama değeri, biyometrik kilidi etkinleştirme seçeneği | Yerel Face ID/Touch ID/fingerprint kilidini açma; güvenli depolama tercihi |
| Bugün | Sonraki antrenman, son performans özeti, hacim trendi ve hızlı başlat düğmesi | Planı başlatma, kısayol ile yeni antrenman oluşturma, güncel ilerlemeyi görme |
| Antrenman kütüphanesi | Bölünmüş programlar, günler ve egzersiz kartları | Şablon oluşturma, düzenleme, kopyalama, egzersiz sırası değiştirme |
| Aktif antrenman | Egzersiz kartları, set satırları, dinlenme zamanlayıcısı ve anlık hacim | Ağırlık/tekrar/RPE kaydı, set tamamlama, önceki performansı görme, set ekleme/silme |
| Süperset oluşturucu | Birincil ve eşleşen egzersiz seçimi, tur düzeni | Egzersizleri süpersete bağlama, dinlenme süresini ayarlama, turu aktif antrenmanda yönetme |
| Egzersiz ayrıntısı | Kas grupları, teknik notlar, geçmiş setler ve rekorlar | Egzersizi programa ekleme, not yazma, geçmiş performansı karşılaştırma |
| İlerleme | Hacim, e1RM, yoğunluk, antrenman sıklığı ve kişisel rekorlar | Dönem seçme, metrik filtreleme, rekorları inceleme |
| Kas analizi | Kas grubu dağılımı, dengesizlik uyarıları ve toparlanma görünümü | Haftalık kas hacmini değerlendirme, hedef kas grubu seçme |
| Vücut ölçümleri | Ağırlık kaydı, hareketli ortalama ve değişim özeti | Yeni ölçüm ekleme, geçmiş grafiğini görme, hedef bandı belirleme |
| Kayıtlar | Tamamlanan antrenmanların zaman çizelgesi | Antrenman ayrıntısını açma, tekrar kullanma, not inceleme |
| Ayarlar | Uygulama kilidi, birimler, dinlenme varsayılanı, koyu görünüm | Biyometrik kilidi ayarlama, kg/lb tercihi, veri dışa aktarma için hazırlık |

## Temel Kullanıcı Akışları

### Antrenmanı kaydetme

Kullanıcı **Bugün** ekranında “Antrenmanı Başlat” eylemine dokunur, planından bir antrenman seçer ve **Aktif antrenman** ekranına geçer. Her satırda kilo ve tekrar girişini yapar, seti tek dokunuşla tamamlar; tamamlanan sete dokunsal geri bildirim verilir. Dinlenme zamanlayıcısı otomatik başlar. Son egzersizden sonra kullanıcı “Antrenmanı Bitir” ile hacim, süre, set sayısı ve yeni kişisel rekor özeti içeren tamamlanma görünümüne ulaşır.

### Süperset oluşturma ve uygulama

Kullanıcı plan düzenlerken iki egzersizi seçer, “Süperset Yap” eylemine dokunur ve dinlenme kuralını belirler. Aktif antrenmanda bu çift, ardışık iki kart ve ortak tur göstergesiyle görünür. İlk set tamamlandığında uygulama kullanıcıyı ikinci egzersize yönlendirir; tur bittiğinde dinlenme zamanlayıcısı başlar.

### İlerlemeyi izleme

Kullanıcı **İlerleme** sekmesinden egzersiz veya tarih aralığını seçer. Grafikler yalnızca kaydedilmiş gerçek verilerden üretilir. Kişisel rekor, hacim ve tahmini 1 tekrar maksimumundaki değişimler aynı ekranda anlaşılır bir hiyerarşiyle sunulur. Verinin yetersiz olduğu yerde uydurma metrik yerine açıklayıcı boş durum kullanılır.

### Güvenli erişim

Kullanıcı ayarlardan “Biyometrik Kilit” seçeneğini açar. Uygulama yeniden ön plana geldiğinde Face ID, Touch ID veya Android biyometrik doğrulaması ister. Cihazın biyometrik özelliği yoksa güvenli geri dönüş seçeneği görünür. Passkey ile hesap girişi, sunucu tarafı kimlik altyapısı etkinleştirildiğinde ayrı bir oturum akışı olarak eklenir; bu ilk sürümde yerel biyometrik uygulama kilidi uygulanır.

## Görsel Sistem

IronPulse, atletik ama ölçülü bir koyu görünüm kullanır. Geniş koyu yüzeyler, yüksek kontrastlı tipografi ve sınırlı vurgu rengi; egzersiz esnasında bilgiyi öne çıkarır. Kartlar yumuşak 20–24 px köşe yarıçapı, ince kenarlık ve ayrık katmanlarla iOS’a yakın bir derinlik hissi verir. Grafiklerde neon etkisi yerine okunaklı, erişilebilir vurgular kullanılır.

| Rol | Renk | Kullanım |
|---|---|---|
| Derin arka plan | `#0B0E12` | Ana uygulama zemini |
| Yükseltilmiş yüzey | `#141A22` | Kartlar ve giriş alanları |
| Ana vurgu | `#B8FF3D` | Başlat, tamamla, aktif sekme ve olumlu ilerleme |
| Bilgi vurgusu | `#60A5FA` | Grafik çizgileri, zamanlayıcı ve nötr durumlar |
| Güç vurgusu | `#F97316` | Yoğunluk, set uyarısı ve PR rozetleri |
| Ana metin | `#F5F7FA` | Başlıklar ve temel sayılar |
| İkincil metin | `#9AA6B5` | Etiketler, açıklamalar ve boş durumlar |
| Ayırıcı | `#263141` | Kart sınırları ve grafik kılavuzları |

## Etkileşim ve Erişilebilirlik İlkeleri

Birincil eylemler en az 44 pt dokunma alanına sahip olur. Aktif antrenmanda sayısal girişler büyük, sıralı ve tek elle erişilebilir yapıdadır. Başarı, hata ve zamanlayıcı olayları sınırlı dokunsal geri bildirimle desteklenir. Metin kontrastı, ana eylemlerin yalnızca renk ile anlatılmaması ve grafiklerin metin özetleri erişilebilirlik için korunur.

## Başlangıç Veri Modeli

İlk sürüm, çevrimdışı kullanım için cihazda saklanan programlar, egzersizler, setler, tamamlanan antrenmanlar, ölçümler ve uygulama tercihleriyle çalışır. Tüm metrikler bu kayıtlardan türetilir; kullanıcı verisi yokken ekranlar sıfır veya uydurma değer yerine anlamlı boş durumlar gösterir. Sonraki aşamada, kullanıcı onayıyla çoklu cihaz senkronizasyonu ve gerçek passkey tabanlı hesap erişimi için sunucu tarafı kayıtlar eklenebilir.
