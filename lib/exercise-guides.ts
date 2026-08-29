export type MotionKind = "push" | "pull" | "fly" | "squat" | "hinge" | "raise" | "curl" | "pushdown" | "calf" | "core";

export type ExerciseGuide = {
  motion: MotionKind;
  setup: string;
  action: string;
  return: string;
  cue: string;
  breathing: string;
  caution: string;
};

export type FormChecklistItem = { id: "setup" | "form" | "breathing"; title: string; detail: string };

export type DetailedExerciseGuide = {
  purpose: string;
  tempo: string;
  execution: { title: string; detail: string }[];
  checkpoints: string[];
  commonMistakes: string[];
  scale: string;
};

const BREATHING_BY_MOTION: Record<MotionKind, string> = {
  push: "Ağırlığı indirirken nefes al; iterken kontrollü nefes ver.",
  pull: "Başlangıçta nefes al; çekerken nefes ver, dönüşte yeniden al.",
  fly: "Kollar açılırken nefes al; göğsü sıkarken yavaşça nefes ver.",
  raise: "Kaldırışta nefes ver; indirirken nefesi sakin ve kontrollü al.",
  squat: "Alçalırken nefes alıp karnını sık; yükselirken kontrollü nefes ver.",
  hinge: "Kalçayı geriye gönderirken nefes al; kalçayı öne sürerken nefes ver.",
  curl: "Ağırlığı kaldırırken nefes ver; aşağı indirirken sakin şekilde nefes al.",
  pushdown: "Bastırırken nefes ver; kontrollü dönüşte nefes al.",
  calf: "Yükselirken nefes ver; topukları indirirken nefes al ve ritmi koru.",
  core: "Nefesi tutma; gövdeyi sıkarken nefes ver, dönüşte burundan nefes al.",
};

const guide = (motion: MotionKind, setup: string, action: string, returnStep: string, cue: string, caution: string): ExerciseGuide => ({ motion, setup, action, return: returnStep, cue, breathing: BREATHING_BY_MOTION[motion], caution });

export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  "barbell-bench-press": guide("push", "Ayaklarını yere sabitle; kürek kemiklerini geriye ve aşağıya al.", "Barı göğüs alt çizgisine kontrollü indir, dirseklerini yaklaşık 45° açıda tut.", "Topuklardan destek alarak barı düz bir hat üzerinde yukarı it.", "Göğüs yukarı, bilekler barın altında.", "Omuzda batma veya keskin ağrı varsa hareketi durdur."),
  "incline-dumbbell-press": guide("push", "Sehpayı hafif eğime ayarla, dumbbell'ları omuz hizasında sabitle.", "Dumbbell'ları üst göğüs hattına doğru indir.", "Kolları kilitlemeden yukarı ve içe doğru it.", "Kaburgayı aşırı kaldırmadan göğsü açık tut.", "Ağırlığı kontrol edemiyorsan daha hafif seç."),
  "cable-fly": guide("fly", "Kabloları omuz yüksekliğine ayarla, öne küçük bir adım at.", "Kolları hafif bükülü halde önde birbirine yaklaştır.", "Göğüste gerilim sürerken kontrollü biçimde başlangıca dön.", "Hareketi ellerle değil göğsü sıkarak başlat.", "Omuz eklemini aşırı geriye taşımaktan kaçın."),
  "pull-up": guide("pull", "Barı omuz genişliğinin biraz dışında tut; gövdeyi sabitle.", "Önce kürek kemiklerini aşağı çek, ardından göğsünü bara yaklaştır.", "Kolları tamamen gevşetmeden kontrollü şekilde aşağı in.", "Dirseklerini yere doğru sürüklediğini düşün.", "Sallanma ve boyunla uzanma yerine kontrollü tekrar kullan."),
  "barbell-row": guide("pull", "Kalçadan öne eğil, sırtı nötr tut ve barı diz hizasında başlat.", "Dirsekleri geriye sürerek barı alt kaburgalara çek.", "Bel açısını koruyarak barı kontrollü indir.", "Karnını sık; barı kollarla değil sırtla çek.", "Bel yuvarlanıyorsa yükü azalt."),
  "lat-pulldown": guide("pull", "Uyluk pedlerini sabitle, göğsü hafif yukarıda tut.", "Barı köprücük kemiğinin önüne doğru çek.", "Kollar uzarken omuzları kulaklara yükseltmeden bırak.", "Dirseklerini ceplere doğru çek.", "Barı ensenin arkasına indirme."),
  "overhead-press": guide("push", "Barı köprücük kemiği önünde, kalçaları ve kaburgayı sabit tut.", "Çeneyi kısa süre geriye çekip barı başın üzerinden it.", "Bar başın üstünde dengedeyken kontrollü başlangıca dön.", "Kalçayı sık, bel boşluğunu büyütme.", "Bel ağrısında hareket açıklığını ve yükü azalt."),
  "lateral-raise": guide("raise", "Dumbbell'ları yanlarda tut, dizleri hafif serbest bırak.", "Kolları omuz hizasına kadar yanlara aç.", "Omuzları kaldırmadan yavaşça aşağı dön.", "Dirsekleri bileklerden çok az önde tut.", "Momentum kullanmak yerine hafif yük tercih et."),
  "barbell-squat": guide("squat", "Barı üst sırtına yerleştir; ayakları dengeli ve yere tam basacak şekilde aç.", "Kalça ve dizleri birlikte bükerek kontrollü alçal.", "Topuğun yerde kalırken ayak tabanından iterek ayağa kalk.", "Dizlerin ayak yönünü takip etsin.", "Belin nötr hattını kaybedersen daha sığ in."),
  "romanian-deadlift": guide("hinge", "Dizleri hafif kır, barı uyluklara yakın başlat.", "Kalçayı geriye göndererek barı bacaklara yakın indir.", "Hamstring gerilimini koruyarak kalçayı öne sür ve yüksel.", "Sırtı değil kalçayı hareket ettir.", "Bar vücuttan uzaklaşıyorsa veya bel yuvarlanıyorsa dur."),
  "leg-press": guide("squat", "Ayakları platforma dengeli yerleştir, belini mindere temaslı tut.", "Dizleri kontrollü bükerek platformu indir.", "Dizleri kilitlemeden platformu topuklardan it.", "Kalçanın minderden kalkmasına izin verme.", "Dizlerinde baskı hissediyorsan hareket derinliğini azalt."),
  "leg-curl": guide("hinge", "Kalçanı pedde sabitle, ayak bileklerini rulonun altına yerleştir.", "Topukları kalçaya doğru çek.", "Hamstring gerilimini koruyarak yavaşça aç.", "Kalçayı pedden kaldırma.", "Belini kullanarak savurma."),
  "barbell-curl": guide("curl", "Dirsekleri gövde yanında sabitle, bilekleri nötr tut.", "Barı omuzlara doğru kaldırırken üst kolu sabit tut.", "Biceps gerilimini koruyarak yavaşça aşağı indir.", "Sadece dirsek eklemini hareket ettir.", "Belden geriye yatıp ağırlığı fırlatma."),
  "triceps-pushdown": guide("pushdown", "Dirsekleri kaburgalara yakın tut, kabloyu kontrollü kavra.", "Dirsekleri sabit tutarak barı aşağı doğru bastır.", "Dirsekler bükülürken kontrollü başlangıca dön.", "Omuzları gevşek, üst kolları sabit tut.", "Bilekleri kırma ve vücudu öne arkaya sallama."),
  "standing-calf-raise": guide("calf", "Ayakların ön kısmını platforma yerleştir, dengeni sabitle.", "Topukları mümkün olduğunca yukarı kaldır.", "Baldır gerilimini hissederek topukları kontrollü indir.", "Üst noktada kısa bir sıkışma uygula.", "Aşırı esneme rahatsızlık verirse hareket mesafesini azalt."),
  "cable-crunch": guide("core", "İpi başının yanında tut, kalçayı sabitleyip diz çök.", "Kaburgaları kalçaya yaklaştıracak şekilde gövdeyi bük.", "Karın kontrolüyle yavaşça başlangıca dön.", "Boyunla çekmek yerine karın kaslarını kullan.", "Belini aşırı yuvarlamak veya boynu zorlamak yerine kısa menzil kullan."),
  "push-up": guide("push", "Ellerini omuz altına al, kalçanı baştan topuğa düz bir çizgide sabitle.", "Göğsü ellerin arasına indirirken dirsekleri hafif geriye yönlendir.", "Avuç içlerinden zemini iterek gövdeyi tek parça hâlinde yükselt.", "Kaburgaları kontrol et; kalçayı sarkıtma.", "Omuz ağrısında elleri yükselterek veya hareket mesafesini azaltarak başla."),
  "machine-chest-press": guide("push", "Koltuğu, tutacaklar göğüs orta hattına gelecek şekilde ayarla.", "Kürek kemiklerini pedde sabit tutarak kolları öne doğru it.", "Dirsekler kilitlenmeden tutacakları yavaşça geri getir.", "İtişi omuzla değil göğüsle başlat.", "Omuzun öne düşmesine izin verme; yükü kontrol edemiyorsan azalt."),
  "dumbbell-row": guide("pull", "Bir el ve dizini sehpaya koy, serbest kolu omuzun altında bırak.", "Dumbbell'ı dirseği kalçaya sürerek alt kaburgaya doğru çek.", "Omuzun öne uzamasına izin vererek kontrollü aşağı in.", "Gövdeyi döndürmeden dirseği geriye taşı.", "Belinle dönerek ağırlığı savurma."),
  "seated-cable-row": guide("pull", "Ayaklarını platforma sabitle, göğsü uzun ve dizleri hafif yumuşak tut.", "Önce kürek kemiklerini geriye al, sonra tutacağı alt kaburgalara çek.", "Kollar uzanırken gövdeyi geriye savurmadan başlangıca dön.", "Dirseklerin ceplere gittiğini düşün.", "Belden aşırı geriye yatma ve omuzları kulaklara çekme."),
  "face-pull": guide("pull", "Halatı göz hizasına ayarla ve hafif çapraz tutuş al.", "Halatı burun-alın hizasına çekerken elleri iki yana aç.", "Kürek kemiklerini kontrollü bırakıp başlangıca dön.", "Dirsekler yüksek, boyun rahat kalsın.", "Çok ağır yükle belden geriye kaçma."),
  "dumbbell-shoulder-press": guide("push", "Dumbbell'ları kulak yanında, bilekler dirseklerin üzerinde başlat.", "Ağırlıkları baş üzerinde kontrollü şekilde birbirine yaklaştırarak it.", "Dirsekler omuz hizasına yaklaşana kadar kontrollü indir.", "Kaburga ve kalçayı sabitle.", "Bel boşluğunu büyütüyorsan yükü veya hareket mesafesini azalt."),
  "reverse-fly": guide("fly", "Kalçadan öne eğil, boynu sırt hattında tut ve kolları aşağı serbest bırak.", "Kolları hafif bükülü tutarak iki yana açıp arka omuzları sık.", "Dumbbell'ları omuz kontrolüyle başlangıca indir.", "Eller yerine dirsekleri yanlara taşı.", "Omuzları kulaklara kaldırma veya momentum kullanma."),
  "hammer-curl": guide("curl", "Dumbbell'ları avuç içleri birbirine bakacak şekilde yanlarda tut.", "Dirsekleri gövde yanında sabitleyerek ağırlıkları omuzlara kaldır.", "Bilek açısını bozmadan kontrollü indir.", "Üst kolu sabit, hareketi dirsekten tut.", "Kalçadan güç alma veya bileği bükme."),
  "skull-crusher": guide("pushdown", "Sehpaya uzan, barı omuzların üzerinde kontrollü sabitle.", "Üst kolları dik tutup dirsekleri bükerek barı alnın gerisine indir.", "Dirsekleri açarak barı başlangıç çizgisine geri getir.", "Dirsekler sabit, üst kollar tavana yakın kalsın.", "Tek başına ağır yük deneme; güvenli bir kaçış alanı bırak."),
  "walking-lunge": guide("squat", "Gövdeyi uzun tutup öne dengeli bir adım at.", "Ön diz ayak yönünü takip ederken arka dizi zemine yaklaştır.", "Ön topuktan itip bir sonraki adıma geç.", "Adımı kalçanı aşağı indirecek kadar uzun tut.", "Dizin içe kaçmasına veya öne devrilmeye izin verme."),
  "hip-thrust": guide("hinge", "Kürek kemiklerini sehpaya yerleştir, barı kalça kıvrımına pedle sabitle.", "Topuklardan iterek kalçayı gövde ve dizler hizasına kaldır.", "Kalçayı geriye alarak barı kontrollü indir.", "Üst noktada kaburgaları aşağıda, çeneyi hafif içerde tut.", "Belden aşırı kavislendirme; hareket kalçada tamamlanmalı."),
  "dumbbell-deadlift": guide("hinge", "Dumbbell'ları bacakların önünde tut, dizleri hafif kır ve gövdeyi uzun tut.", "Kalçayı geriye göndererek ağırlıkları bacaklara yakın indir.", "Topuklardan kuvvet alıp kalçayı öne sürerek yüksel.", "Dumbbell'lar vücuda yakın, sırt nötr kalsın.", "Ağırlıkları öne kaçırma veya belden yuvarlanma."),
  "step-up": guide("squat", "Kutunun yüksekliğini kontrol edebileceğin düzeye ayarla, ayağın tamamını kutuya koy.", "Kutudaki topuktan iterek yüksel ve diğer ayağı yumuşakça getir.", "Aynı kontrolle geri inip taraf değiştir.", "Yükselişi alttaki ayakla zıplayarak değil üstteki ayakla yap.", "Diz kontrolün bozulursa daha alçak bir platform seç."),
  "leg-extension": guide("squat", "Diz eklemini makine ekseniyle hizala ve pedin ayak bileği üstünde olduğundan emin ol.", "Dizleri kontrollü açarak pedleri yukarı kaldır.", "Dizleri kilitlemeden yavaşça başlangıca dön.", "Üst noktada quadriceps'i kısa süre sık.", "Dizde keskin baskı hissedersen menzili ve yükü azalt."),
  "glute-bridge": guide("hinge", "Sırtüstü uzan, dizleri büküp ayakları kalça genişliğinde yerleştir.", "Topuklardan itip kalçayı omuz-diz çizgisine kadar kaldır.", "Kalçayı kontrollü indir; zeminde tamamen gevşemeden devam et.", "Kaburgaları aşağıda tutup kalçayı sık.", "Belden itmek yerine kalça kaslarını kullan."),
  "plank": guide("core", "Dirsekleri omuz altında, ayakları geride ve boynu nötr yerleştir.", "Karın ve kalçayı sıkarak baştan topuğa düz bir çizgi oluştur.", "Nefesi tutmadan bu pozisyonu kontrollü koru.", "Yeri dirseklerinle it, omuzları aktif tut.", "Belin sarkarsa süreyi kısalt veya diz üstü varyasyona dön."),
  "incline-walk": guide("calf", "Yürüyüş bandı eğimini ve hızını konuşabilecek ama zorlanacak seviyede ayarla.", "Kısa, ritmik adımlarla topuktan parmağa geçerek yürü.", "Omuzları gevşek tutup sabit tutacağa yüklenmeden ritmi sürdür.", "Bakış ileride, kalçadan hafif öne eğil.", "Baş dönmesi veya göğüs ağrısında bandı hemen durdur."),
  "running": guide("calf", "Isınmadan sonra tempo aralığını ve dinlenme süresini önceden belirle.", "Kısa ve sessiz adımlarla ritmi artır; kolları geriye-öne salla.", "İnterval sonunda yürüyerek nabzı kontrollü düşür.", "Gövde uzun, adım yere altında kalsın.", "Keskin eklem ağrısında intervali bırakıp yürüyüşe dön."),
  "cycling": guide("squat", "Sele yüksekliğini alt noktada dizde hafif bükülme kalacak şekilde ayarla.", "Pedalı dairesel ve dengeli kuvvetle çevir.", "Direnci nefesini zorlayacak ama kontrolü bozmayacak seviyede tut.", "Dizler pedal yönünü takip etsin.", "Kalçayı selede savurma ve dizde ağrı varsa direnci azalt."),
  "rowing-erg": guide("pull", "Başlangıçta dizleri bük, gövdeyi hafif öne al ve sapı kavra.", "Önce bacaklarla it, sonra gövdeyi aç ve en son sapı alt kaburgalara çek.", "Kolları uzatıp gövdeyi öne alarak dizleri son olarak bük.", "Bacak–gövde–kol sırasını koru.", "Belden ani çekiş yapma veya omuzları yükseltme."),
  "jump-rope": guide("calf", "İpi dirsekler gövde yanında olacak şekilde kısa tutuşla kavra.", "Bileklerden küçük daireler çizerek alçak sıçramalar yap.", "Yumuşak biçimde ayak önüne inip ritmi koru.", "Dizleri yumuşak, omuzları gevşek tut.", "Baldırda keskin ağrı olursa arayı aç ve zemini kontrol et."),
  "burpee": guide("squat", "Ayaklar kalça genişliğinde, gövdeyi dengeli bir başlangıçta tut.", "Çömelip elleri yere koy, ayakları plank pozisyonuna geri gönder ve kontrollü geri topla.", "Topuklardan iterek dikleş; gerekiyorsa alçak sıçramayla tamamla.", "Her tekrarın omurga kontrolünü yeniden kur.", "Bel yorgunken plank geçişini adım adım yap; hız için formu bozma."),
};

export function guideFor(exerciseId: string): ExerciseGuide {
  return EXERCISE_GUIDES[exerciseId] ?? guide("push", "Dengeli bir başlangıç pozisyonu al.", "Hareketi kontrollü hızla uygula.", "Başlangıca kontrollü dön.", "Nefesini ve formunu koru.", "Keskin ağrı veya kontrol kaybında dur.");
}

export function formChecklistFor(exerciseId: string): FormChecklistItem[] {
  const item = guideFor(exerciseId);
  return [
    { id: "setup", title: "Kurulum hazır", detail: item.setup },
    { id: "form", title: "Form odağı", detail: item.cue },
    { id: "breathing", title: "Nefes ritmi", detail: item.breathing },
  ];
}

const MOTION_DETAILS: Record<MotionKind, Omit<DetailedExerciseGuide, "execution">> = {
  push: { purpose: "İtiş zincirinde göğüs, omuz ve triceps kuvvetini; omuz kontrolünü geliştirmek.", tempo: "İndirişte 2–3 saniye, alt noktada kontrol, itişte 1–2 saniye kullan.", checkpoints: ["Omuzlar kulaklardan uzak ve kürek kemikleri dengeli kalsın.", "Bilek, dirsek ve yük mümkün olduğunca aynı çizgide ilerlesin."], commonMistakes: ["Yükü momentumla itmek veya dirsekleri kontrolsüz dışarı açmak.", "Kaburgayı aşırı kaldırıp bel boşluğunu büyütmek."], scale: "Kontrol bozuluyorsa yükü azalt, hareket mesafesini kısalt veya daha stabil bir varyasyona geç." },
  pull: { purpose: "Sırt ve kol çekiş kaslarını, kürek kemiği kontrolüyle birlikte çalıştırmak.", tempo: "Çekişte 1–2 saniye, sıkışmada kısa durak, dönüşte 2–3 saniye kontrol uygula.", checkpoints: ["Çekişi omuzları yükseltmeden dirsek hareketiyle başlat.", "Göğsü uzun tut; boynu öne uzatmadan bakışı sabitle."], commonMistakes: ["Gövdeyi sallayıp tekrar kazanmak.", "Kolları çekip kürek kemiklerini kontrolsüz bırakmak."], scale: "Tekrar kalitesi düşerse daha hafif yük, destekli varyasyon veya daha kısa hareket mesafesi seç." },
  fly: { purpose: "Hedef kası kontrollü uzatma ve sıkıştırma altında izole biçimde çalıştırmak.", tempo: "Açılışta 2–3 saniye, sıkışmada 1 saniye, dönüşte kontrollü ritim kullan.", checkpoints: ["Dirsek açısını baştan sona yumuşak ve sabit tut.", "Omuz eklemini zorlamadan göğüs ya da arka omuz sıkışmasını hisset."], commonMistakes: ["Kolları tamamen kilitlemek veya omuzu geriye zorlamak.", "Ağır yükle bilek ve dirsekten savurmak."], scale: "Gerilimi kaybediyor ya da omuzda rahatsızlık hissediyorsan yükü azalt ve menzili kısalt." },
  raise: { purpose: "Omuz kaslarını eklem kontrolünü koruyarak izole biçimde güçlendirmek.", tempo: "Kaldırışta 1–2 saniye, üstte kısa durak, indirişte 2–3 saniye uygula.", checkpoints: ["Omuzları kulaklara çekmeden boynu rahat tut.", "Yükü hızla değil dirsek ve omuz kontrolüyle taşı."], commonMistakes: ["Belden sallanmak veya yükü omuz hizasının çok üstüne fırlatmak.", "Bileği gereksiz kırmak."], scale: "Daha hafif yükle, tek kol çalışarak veya kısmi hareket mesafesiyle formu geri kazan." },
  squat: { purpose: "Bacak ve kalçayı ayak tabanı, diz ve gövde kontrolüyle birlikte kuvvetlendirmek.", tempo: "Alçalırken 2–3 saniye, dengeli dip nokta, yükselirken 1–2 saniye kullan.", checkpoints: ["Basıncı topuk, başparmak ve küçük parmak tabanına dengeli dağıt.", "Dizler ayak parmaklarının yönünü takip ederken gövde uzun kalsın."], commonMistakes: ["Dizlerin içe kaçması veya topukların yerden kalkması.", "Derinlik uğruna bel nötr hattını kaybetmek."], scale: "Kutuya squat, destekli lunge veya daha kısa mesafe ile kontrollü tekrar kalitesini öncele." },
  hinge: { purpose: "Kalça menteşesiyle hamstring ve kalçayı çalıştırırken omurgayı nötr korumak.", tempo: "Kalça geriye giderken 2–3 saniye, gerilimde kısa durak, kalkışta 1–2 saniye kullan.", checkpoints: ["Ağırlığı vücuda yakın tut ve hareketi kalçanın geriye gitmesiyle başlat.", "Karnı hafifçe sıkıp sırt hattını uzun koru."], commonMistakes: ["Dizleri fazla bükerek hareketi squata çevirmek.", "Belden yuvarlanmak veya yükü bacaklardan uzaklaştırmak."], scale: "Daha hafif yük, yükseltilmiş başlangıç ya da kısa menzil ile kalça menteşesini yeniden kur." },
  curl: { purpose: "Dirsek fleksiyonunu kontrol ederek biceps ve ön kolu hedeflemek.", tempo: "Kaldırışta 1–2 saniye, üstte kısa sıkışma, indirişte 2–3 saniye uygula.", checkpoints: ["Üst kolları gövde yanında sabit tut.", "Bilekleri nötr tutup tekrarın alt kısmını kontrollü tamamla."], commonMistakes: ["Kalçadan savurmak veya omuzları öne taşımak.", "Aşağı inişi bırakmak."], scale: "Yükü azalt, oturarak çalış veya dönüş fazını yavaşlatarak tekrar kontrolünü geri kazan." },
  pushdown: { purpose: "Triceps'i üst kol sabitliğini koruyarak güvenli şekilde çalıştırmak.", tempo: "Aşağı bastırışta 1–2 saniye, alt noktada kısa sıkışma, dönüşte 2–3 saniye kullan.", checkpoints: ["Dirsekler kaburgalara yakın ve omuzlar rahat kalsın.", "Hareket boyunca yalnızca dirsek ekleminin açılıp kapanmasına izin ver."], commonMistakes: ["Üst kolları ileri geri sallamak.", "Bilekleri kırmak veya yükü vücut ağırlığıyla bastırmak."], scale: "Yükü azalt, ip kullan veya daha kısa hareket açıklığıyla dirsek kontrolünü koru." },
  calf: { purpose: "Ayak bileği kontrolüyle baldırı tam fakat ağrısız hareket aralığında çalıştırmak.", tempo: "Yükselişte 1–2 saniye, üstte 1 saniye sıkışma, inişte 2–3 saniye kullan.", checkpoints: ["Desteği parmaklara dengeli dağıt, ayak bileğini içe ya da dışa düşürme.", "Dizleri kilitlemeden dengeyi koru."], commonMistakes: ["Kısa ve hızlı tekrarlar yapmak.", "Destekten gereğinden fazla güç almak."], scale: "Önce vücut ağırlığıyla iki ayaklı çalış; denge oturduğunda yük veya tek taraf ekle." },
  core: { purpose: "Gövde stabilitesini nefes kontrolüyle birleştirerek karın kaslarını çalıştırmak.", tempo: "Kasılmaya kontrollü gir, nefes verirken 1 saniye sık, dönüşü 2–3 saniyede tamamla.", checkpoints: ["Kaburgaları kalça üzerinde tut; boynu ve omuzları gereksiz sıkma.", "Her tekrarda nefes akışını sürdür, karın duvarını nazikçe aktif tut."], commonMistakes: ["Nefesi uzun süre tutmak veya boyundan çekmek.", "Belin sarkmasına izin vermek."], scale: "Menzili, süreyi veya kaldıraç mesafesini azaltarak nötr gövde çizgisini koru." },
};

export function detailedGuideFor(exerciseId: string): DetailedExerciseGuide {
  const item = guideFor(exerciseId);
  const detail = MOTION_DETAILS[item.motion];
  return {
    ...detail,
    execution: [
      { title: "Başlangıç pozisyonu", detail: item.setup },
      { title: "Kontrollü uygulama", detail: item.action },
      { title: "Dönüş ve tekrar", detail: item.return },
      { title: "Nefes ritmi", detail: item.breathing },
    ],
    commonMistakes: [item.caution, ...detail.commonMistakes],
  };
}

const ENGLISH_COACH_CUE: Record<MotionKind, string> = {
  push: "Keep your trunk stable and press on a controlled path.",
  pull: "Keep your chest tall and pull with your back, not momentum.",
  fly: "Keep a soft elbow and squeeze the chest without forcing the shoulder.",
  raise: "Lift smoothly without shrugging or swinging the weight.",
  squat: "Keep your whole foot grounded and let your knees track your toes.",
  hinge: "Send the hips back while keeping the spine long and neutral.",
  curl: "Keep your upper arm still and move only through the elbow.",
  pushdown: "Keep elbows close to your ribs and avoid moving the upper arm.",
  calf: "Use a full but controlled ankle range and pause at the top.",
  core: "Brace the trunk while keeping the neck relaxed and breathing steady.",
};

const ENGLISH_COACH_BREATH: Record<MotionKind, string> = {
  push: "Breathe in on the way down, breathe out as you press.",
  pull: "Breathe in at the start, breathe out as you pull.",
  fly: "Breathe in as the arms open, breathe out as you squeeze.",
  raise: "Breathe out on the lift and breathe in on the return.",
  squat: "Breathe in and brace on the descent, then breathe out as you stand.",
  hinge: "Breathe in as hips travel back, breathe out as hips drive forward.",
  curl: "Breathe out as you curl, breathe in as you lower.",
  pushdown: "Breathe out as you press down, breathe in on the return.",
  calf: "Breathe out as you rise, breathe in as you lower with control.",
  core: "Do not hold your breath; breathe out with the brace and inhale on return.",
};

export function voiceCoachTextFor(exerciseId: string, language: "tr-TR" | "en-US") {
  const item = guideFor(exerciseId);
  if (language === "en-US") return `Set reminder. ${ENGLISH_COACH_CUE[item.motion]} Breathing: ${ENGLISH_COACH_BREATH[item.motion]} Safety: Stop if you feel sharp pain or lose control.`;
  return `Set öncesi hatırlatma. ${item.cue} Nefes: ${item.breathing} Dikkat: ${item.caution}`;
}

export type ExerciseMediaGuide = {
  kind: "verified-video" | "external-video-guide" | "external-technique-guide" | "no-verified-video";
  label: string;
  url?: string;
  provider?: string;
  license?: string;
  author?: string;
  duration?: string;
  availability?: string;
};

const VERIFIED_WGER_VIDEOS: Record<string, Omit<ExerciseMediaGuide, "kind">> = {
  "barbell-bench-press": { label: "Bench Press", url: "https://wger.de/media/exercise-video/73/cfb72002-898f-443a-a124-a0bce8a2e6ad.MP4", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "21 sn" },
  "incline-dumbbell-press": { label: "Incline Bench Press – Dumbbell", url: "https://wger.de/media/exercise-video/537/b9c937e9-daeb-42a9-be8e-7a77e368478c.MOV", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "27 sn" },
  "pull-up": { label: "Pull-ups", url: "https://wger.de/media/exercise-video/475/83067ffe-ccb9-4e22-8507-5131b211ce74.MOV", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "19 sn" },
  "romanian-deadlift": { label: "Romanian Deadlift", url: "https://wger.de/media/exercise-video/507/307e7276-a14d-4ea0-b579-f5b0dbc6f5af.MOV", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "13 sn" },
  "leg-press": { label: "Leg Press", url: "https://wger.de/media/exercise-video/371/6aae16b4-01b9-4eb4-935c-3250f84d2c59.MOV", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "35 sn" },
  "hammer-curl": { label: "Hammer Curls", url: "https://wger.de/media/exercise-video/272/df069052-2173-4f24-855f-a0eebe729f24.MOV", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "10 sn" },
  "hip-thrust": { label: "Hip Thrust", url: "https://wger.de/media/exercise-video/294/45bacf4b-1bb6-4d47-8bd1-9f00eddd4019.MOV", provider: "Wger açık egzersiz verisi", license: "CC BY-SA 4.0", author: "Goulart", duration: "30 sn" },
};

const VERIFIED_EXTERNAL_VIDEO_GUIDES: Record<string, Omit<ExerciseMediaGuide, "kind">> = {
  "barbell-row": { label: "Bent Over Barbell Row: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "lat-pulldown": { label: "Lat Pull Down: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/lat-pull-down.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "overhead-press": { label: "Military Press (AKA Overhead Press)", url: "https://www.muscleandstrength.com/exercises/military-press.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "lateral-raise": { label: "Dumbbell Lateral Raise: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "barbell-squat": { label: "Barbell Back Squat: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/squat.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "leg-press": { label: "Leg Press: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/45-degree-leg-press.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "leg-curl": { label: "Leg Curl: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/leg-curl.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "cable-crunch": { label: "Cable Crunch: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/cable-crunch.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "push-up": { label: "Push Up: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/push-up.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "dumbbell-row": { label: "One Arm Dumbbell Row: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "reverse-fly": { label: "Seated Bent Over Dumbbell Reverse Fly", url: "https://www.muscleandstrength.com/exercises/dumbbell-reverse-fly.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "walking-lunge": { label: "Dumbbell Walking Lunge: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/dumbbell-walking-lunge.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "barbell-curl": { label: "Standing Barbell Curl: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/standing-barbell-curl.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "dumbbell-deadlift": { label: "Dumbbell Deadlift: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "step-up": { label: "Dumbbell Step Up: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/dumbbell-step-up.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "leg-extension": { label: "Leg Extension: Video Exercise Guide & Tips", url: "https://www.muscleandstrength.com/exercises/leg-extension.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "seated-cable-row": { label: "Seated Cable Row Video Exercise Guide", url: "https://www.muscleandstrength.com/exercises/seated-row.html", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "face-pull": { label: "Cable Face Pull Video Exercise Guide", url: "https://www.muscleandstrength.com/exercises/cable-face-pull", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
  "jump-rope": { label: "Jump Rope Exercise Videos", url: "https://www.muscleandstrength.com/exercises/jump-rope", provider: "Muscle & Strength teknik video rehberi", availability: "Sayfa başlığı, erişim ve hareket adı denetlendi" },
};

const VERIFIED_ACE_TECHNIQUE_GUIDES: Record<string, Omit<ExerciseMediaGuide, "kind">> = {
  "plank": { label: "Front Plank | ACE Exercise Library", url: "https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/", provider: "ACE teknik uygulama rehberi", availability: "Sayfa başlığı, HTTPS erişimi ve hareket uygulama adımları denetlendi" },
  "glute-bridge": { label: "Glute Bridge Exercise | ACE Exercise Library", url: "https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/", provider: "ACE teknik uygulama rehberi", availability: "Sayfa başlığı, HTTPS erişimi ve hareket uygulama adımları denetlendi" },
};

export function mediaGuideFor(exerciseId: string): ExerciseMediaGuide {
  const verified = VERIFIED_WGER_VIDEOS[exerciseId];
  if (verified) return { kind: "verified-video", ...verified };
  const external = VERIFIED_EXTERNAL_VIDEO_GUIDES[exerciseId];
  if (external) return { kind: "external-video-guide", ...external };
  const technique = VERIFIED_ACE_TECHNIQUE_GUIDES[exerciseId];
  if (technique) return { kind: "external-technique-guide", ...technique };
  return { kind: "no-verified-video", label: "Doğrulanmış video bekleniyor" };
}
