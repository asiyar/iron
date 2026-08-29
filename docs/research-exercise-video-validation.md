# Egzersiz Video Kaynak Doğrulaması

Bu araştırma, IronPulse katalog hareketlerine alakasız videolar bağlanmasını önlemek için 27 Ağustos 2026 tarihinde yapıldı. Kaynaklar yalnızca uygulama içi tarayıcıda açılan harici rehberler olarak kullanılacaktır; sahiplik veya video dosyası yeniden yayımı iddiası yoktur.

## Kaynak Kararı

| Kaynak | Bulgular | Uygulama kararı |
|---|---|---|
| Wger REST API | Açık egzersiz verisinde sınırlı sayıda, ad/video kaydı birlikte denetlenebilen CC BY-SA 4.0 medya vardır. | Doğrudan medya yalnızca birebir eşleşme güvenliyse açılır ve kullanıcının açık eylemiyle cihazına kaydedilebilir. |
| Muscle & Strength Video Exercise Guide | Yayımlanmış sitemap üzerinden incelenen 38 adaydan 22'si HTTP 200 ve sayfa başlığı/hareket varyasyonu eşleşmesiyle doğrulandı. | Doğrudan medya yerine, doğrulanmış sayfalar her hareketin ayrıntılı harici video rehberi olarak uygulama içi tarayıcıda açılır; çevrimdışı kaydetme sunulmaz. |
| MuscleWiki API | Geniş video ve ayrıntılı talimat kapsaması sağlar; ancak üretim doğrudan API erişimi ücretli anahtar gerektirir. | Kullanıcı tarafından ayrıca lisanslanmadığı için projeye entegre edilmez. |

## Doğrulanmış Harici Rehberler

| Katalog hareketi | Doğrulanmış sayfa başlığı | URL |
|---|---|---|
| Barbell Bench Press | Barbell Bench Press: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/barbell-bench-press.html |
| Incline Dumbbell Press | Incline Dumbbell Bench Press: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/incline-dumbbell-bench-press.html |
| Barbell Row | Bent Over Row: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html |
| Lat Pulldown | Lat Pull Down: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/lat-pull-down.html |
| Overhead Press | Military Press (AKA Overhead Press): Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/military-press.html |
| Lateral Raise | Dumbbell Lateral Raise: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html |
| Barbell Squat | Barbell Back Squat: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/squat.html |
| Leg Press | Leg Press: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/45-degree-leg-press.html |
| Leg Curl | Leg Curl: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/leg-curl.html |
| Cable Crunch | Cable Crunch: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/cable-crunch.html |
| Push-up | Push Up: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/push-up.html |
| One-arm Dumbbell Row | One Arm Dumbbell Row: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html |
| Reverse Fly | Seated Bent Over Dumbbell Reverse Fly: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/dumbbell-reverse-fly.html |
| Walking Lunge | Dumbbell Walking Lunge: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/dumbbell-walking-lunge.html |
| Barbell Curl | Standing Barbell Curl: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/standing-barbell-curl.html |
| Hip Thrust | Barbell Hip Thrust: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/barbell-hip-thrust |
| Dumbbell Deadlift | Dumbbell Deadlift: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html |
| Dumbbell Step-up | Dumbbell Step Up: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/dumbbell-step-up.html |
| Leg Extension | Leg Extension: Video Exercise Guide & Tips | https://www.muscleandstrength.com/exercises/leg-extension.html |
| Jump Rope | Jump Rope Exercise Videos: Learn How To Do Jump Rope Exercises | https://www.muscleandstrength.com/exercises/jump-rope |
| Seated Cable Row | Seated Cable Row Video Exercise Guide | https://www.muscleandstrength.com/exercises/seated-row.html |
| Face Pull | Cable Face Pull Video Exercise Guide | https://www.muscleandstrength.com/exercises/cable-face-pull |

## Dışlanan Adaylar

Standing Cable Fly bağlantısı "Standing Cable Reverse Fly" başlığına, Romanian Deadlift bağlantısı genel "Stiff Leg Deadlift" başlığına, Standing Calf Raise bağlantısı "Standing Barbell Calf Raise" başlığına ve Skull Crusher bağlantısı "EZ Bar Skullcrusher" başlığına yöneldi. Bu bağlantılar, katalogdaki hareketin ekipman veya varyasyonuyla birebir eşleşmediği için otomatik olarak kullanıcıya video olarak sunulmayacaktır.

## Yeniden Doğrulama

Kaynak URL'leri ve sayfa başlıkları `scripts/validate-external-video-guides.mjs` ile yeniden doğrulanabilir. Wger medya kapsaması `scripts/audit-wger-media.mjs` ile denetlenir. Bağlantı değiştiğinde veya kaynak kaldırıldığında uygulama bunu doğrulanmış video olarak göstermemelidir.
