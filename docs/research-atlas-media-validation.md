# Atlas ve medya doğrulama notları

## Atlas kaynak kararı

| Kaynak | Doğrulanan kapsam | Lisans / kullanım kararı | URL |
|---|---|---|---|
| Open3Dmodel | Z-Anatomy tabanlı, anatomistlerce gözden geçirilmiş, retopolojisi iyileştirilmiş kas/trunk/ekstremite modelleri | Model içeriği CC BY-SA 4.0; görüntüleyici kodu GPL-3.0. Kendi Expo görüntüleyicimiz korunacak, yalnızca uyumlu model verisi/atfı kullanılacak. | https://anatomytool.org/open3dmodel-about |
| BodyParts3D 4.0 | Yüzeysel kas geometrisi, resmî parça/ad eşleme tabloları | Mevcut native GLB bu kaynaktan türetilmiştir. `FMA7163 → BP9115 → FJ2810` tam cilt gövdesi için olası dış kabuk mesh eşlemesidir. | https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html |
| Body Muscles | Ön/arka görünümde 70+ tıklanabilir SVG kas bölgesi, split chest/abs/traps/lats/hamstrings/calves gibi ayrıntılı alanlar | Apache-2.0. Webde, native GLB'nin yerine değil, profesyonel ve ayrıntılı web atlası olarak kullanılabilir. | https://github.com/vulovix/body-muscles |

Open3Dmodel sayfası, modellerin eğitim amaçlı verildiğini ve mutlak anatomik doğruluk garantisi olmadığını belirtir. Atlas ekranı tıbbi teşhis amacı taşımadığını açıkça belirtmeye devam etmelidir.

### Open3Dmodel ayrıntılı gövde-kas bulgusu

Open3Dmodel'in **Muscles of thorax, abdomen and back** modeli, göğüs, karın, sırt ve omuz kuşağındaki çok sayıda tekil yapıyı anatomist incelemesiyle sunar; model kimliği `muscles-thorax-abdomen` ve barındırılan GLB yolu aşağıdadır.

```
https://caskanatomy.info/open3dviewer/3dmodels/muscles-thorax-abdomen/muscles-thorax-abdomen.glb
```

Kaynak dosya yaklaşık **5.16 MB**, Draco sıkıştırması gerektiriyor ve inceleme sırasında yaklaşık **588.978 GPU yükleme köşesi / 3,15 milyon render köşesi** içeriyordu. Bu, mevcut Expo GL/Expo Three çalışma zamanında ek Draco çözücüsü ve paketleme kotasının üstünde ek yük demektir. Bu nedenle bu sürümde doğrudan paketlemek yerine, zaten paketlenmiş mobil GLB korunur; web ve GLB geri dönüşünde 70+ bölge atlası kullanılır. Model verisi kullanılacak gelecekteki ayrı bir yüksek ayrıntı paketi için CC BY-SA 4.0 atfı gereklidir. Kaynak: https://anatomytool.org/content/open3dmodel-muscles-thorax-abdomen-and-back-english-labels

## Medya doğrulama kararı

Önceki Wikimedia Commons genel araması kaldırılmalıdır. Kategori yalnızca 27 heterojen dosya içerdiğinden, arama sonucu hareketle birebir eşleşmiyordu. Bunun yerine yalnızca hareket adı birebir doğrulanmış Wger API medya kayıtları gösterilmelidir. Wger API her video kaydında lisans, yazar ve doğrudan medya URL'si döndürür; denetimde kullanılan kayıtların video lisans kimliği `2` olup API'de CC BY-SA 4 olarak görünmektedir. Kaynak: https://wger.de/api/v2/exerciseinfo/?language=2&limit=5

| IronPulse hareketi | Doğrulanan açık kaynak adı | Doğrudan video | Yazar | Süre |
|---|---|---|---|---|
| Barbell Bench Press | Bench Press | https://wger.de/media/exercise-video/73/cfb72002-898f-443a-a124-a0bce8a2e6ad.MP4 | Goulart | 21.04 sn |
| Incline Dumbbell Press | Incline Bench Press - Dumbbell | https://wger.de/media/exercise-video/537/b9c937e9-daeb-42a9-be8e-7a77e368478c.MOV | Goulart | 27.49 sn |
| Pull-up | Pull-ups | https://wger.de/media/exercise-video/475/83067ffe-ccb9-4e22-8507-5131b211ce74.MOV | Goulart | 18.77 sn |
| Romanian Deadlift | Romanian Deadlift | https://wger.de/media/exercise-video/507/307e7276-a14d-4ea0-b579-f5b0dbc6f5af.MOV | Goulart | 13.00 sn |
| Leg Press | Leg Press | https://wger.de/media/exercise-video/371/6aae16b4-01b9-4eb4-935c-3250f84d2c59.MOV | Goulart | 34.69 sn |
| Hammer Curl | Hammer Curls | https://wger.de/media/exercise-video/272/df069052-2173-4f24-855f-a0eebe729f24.MOV | Goulart | 10.37 sn |
| Hip Thrust | Hip Thrust | https://wger.de/media/exercise-video/294/45bacf4b-1bb6-4d47-8bd1-9f00eddd4019.MOV | Goulart | 30.19 sn |

Diğer katalog hareketlerinde yalnızca benzer varyasyon videosu veya video olmayan giriş bulundu. Bu hareketler için yanlış video göstermemek esastır: ayrıntılı yazılı form rehberi gösterilecek ve video alanı "doğrulanmış video henüz yok" durumuna alınacaktır. Video gösterildiğinde `expo-web-browser.openBrowserAsync` iOS'ta uygulama içi Safari görünümü, Android'de uygulama içi Chrome Custom Tab açar; web platformu kendi sekme/pencere davranışını kullanır.

## Ticari API notu

MuscleWiki API, hareket bazlı video ve kas haritası sunar ancak doğrudan uygulama kullanımında ücretli API anahtarı gerektirir. Kullanıcının anahtar/bütçe onayı olmadığı için bu sürümde entegre edilmeyecektir. Kaynak: https://api.musclewiki.com/
