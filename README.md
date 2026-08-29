# IronPulse

Expo (React Native) tabanlı antrenman takip uygulaması: antrenman kaydı, 3B/SVG kas atlası, performans analitiği, plan üretici, sağlık verisi senkronizasyonu ve abonelik akışı. Arayüz Türkçedir.

> **Durum:** Depo doğrulandı. Bağımlılıklar gerçekten kuruldu ve proje derlendi:
>
> | Kontrol | Sonuç |
> | --- | --- |
> | `tsc --noEmit` | 0 hata |
> | `vitest` | 28 test geçti, 1 atlandı |
> | `expo export --platform all` | iOS + Android Hermes bundle üretildi |
> | `expo export --platform web` | 30 rota statik olarak dışa aktarıldı |
> | `expo-doctor` | 19/21 (kalan 2 kontrol ağ erişimi gerektirir) |
> | `eslint` | 0 hata, 4 uyarı |
>
> Sürümler **Expo SDK 57 / React Native 0.86 / React 19.2** ile hizalıdır.

---

## Özellikler

- **Antrenman** — şablon oluşturma, canlı oturum, set/tekrar/ağırlık kaydı, dinlenme sayacı, sesli komut (native).
- **Anatomi** — `body-muscles` tabanlı SVG kas atlası (web) ve `expo-gl` + `three` ile GLB model görüntüleyici (native).
- **İlerleme & Performans** — hacim, kişisel rekorlar, seri takibi, toparlanma skoru, deload önerisi, aylık rapor, sürüklenebilir metrik kartları.
- **Plan üretici** — hedef, deneyim seviyesi ve ekipmana göre program oluşturma.
- **Beslenme & toparlanma** — öğün/makro kaydı, barkod tarama, uyku-sıvı-hazır olma günlüğü.
- **Dönüşüm** — hedef ağırlık, çevre ölçümleri, zaman çizelgesi.
- **Topluluk** — program yayınlama, paylaşım kodu, kişisel meydan okumalar.
- **AI koç** — LLM üzerinden öneri; ağ/anahtar yoksa deterministik yedek yanıta düşer.
- **Sağlık** — Apple HealthKit (iOS) ve Health Connect (Android).
- **Abonelik** — RevenueCat; web'de satın alma devre dışı bırakılmış hâlde çalışır.
- **Güvenlik** — biyometrik kilit, SecureStore tabanlı tercihler, güvenlik kartı ekranı.

## Teknoloji

Expo Router · React Native · TypeScript · NativeWind (Tailwind) · tRPC v11 · Drizzle ORM (MySQL) · Reanimated · three / expo-three · Vitest

---

## Hızlı başlangıç

```bash
git clone <bu-repo-url>
cd ironpulse
npm install
npx expo install --fix     # bağımlılıkları kurulu Expo SDK ile hizala (önemli)

cp .env.example .env
npm start
```

### Bağımlılık sürümleri hakkında

`package.json` orijinal dışa aktarımda yoktu; kaynak kod taranarak yeniden üretildi ve ardından
Expo SDK 57'nin `bundledNativeModules.json` listesiyle karşılaştırılarak her paket sabitlendi.
Kurulum bu hâliyle çakışmasız tamamlanır.

İki nokta bilinçli olarak sabitlendi:

- **`three@^0.166`** — `expo-three@8` bundan yenisini kabul etmiyor (`ERESOLVE`).
- **`overrides.expo-three`** — `expo-three` kendi altına react@17 kuruyordu; native derlemede tek react bulunmalı.

### Native modüller ve Expo Go

Şu modüller **Expo Go'da çalışmaz**, development build gerekir:

`expo-gl` · `expo-three` · `@kingstinct/react-native-healthkit` · `react-native-health-connect` · `react-native-purchases` · `expo-speech-recognition` · `react-native-draggable-flatlist`

Web'de bu modüllerin yerine `.web.tsx` uyarlamaları devreye girer; uygulama derlenir ve çalışır, ilgili özellikler devre dışı kalır.

---

## APK / AAB / IPA üretme

`eas.json` dört profil içerir: `development`, `preview`, `production`, `production-apk`.

### Hazırlık

```bash
npm install -g eas-cli
eas login
eas init          # projeyi Expo hesabına bağlar, projectId oluşturur
```

`.env` içinde bundle kimliğini kendi domaininle güncelle — mağazaya gönderim için benzersiz olmalı:

```
EXPO_PUBLIC_BUNDLE_ID=com.senindomainin.ironpulse
EXPO_PUBLIC_SCHEME=ironpulse
```

### Android

```bash
# Cihaza kurulabilir APK (test / yan yükleme)
npm run build:apk          # eas build -p android --profile production-apk

# Google Play için AAB
npm run build:android      # eas build -p android --profile production
```

İlk çalıştırmada EAS bir imzalama anahtarı (keystore) üretmeyi teklif eder; **Yes** de ve anahtarı EAS'te sakla. Kendi keystore'un varsa `eas credentials` ile yükleyebilirsin.

### iOS

```bash
npm run build:ios          # eas build -p ios --profile production
```

IPA üretimi için ücretli bir **Apple Developer Program** üyeliği gerekir. EAS, Apple hesabınla giriş yaptıktan sonra sertifika ve provisioning profile'ı kendisi oluşturur.

### Yerel derleme (EAS olmadan)

```bash
npx expo prebuild --clean

# Android
cd android && ./gradlew assembleRelease      # APK
cd android && ./gradlew bundleRelease        # AAB

# iOS (yalnızca macOS + Xcode)
npx expo run:ios --configuration Release
```

Yerel derlemede imzalama yapılandırmasını kendin kurmalısın; `android/app/build.gradle` içindeki `signingConfigs` bölümünü doldur.

### Mağazaya gönderme

```bash
eas submit -p android --latest
eas submit -p ios --latest
```

### Gönderim öncesi kontrol listesi

- [ ] `EXPO_PUBLIC_BUNDLE_ID` kendi domainine göre ayarlandı
- [ ] `assets/images/` içindeki marka görselleri kendi tasarımınla değiştirildi (veya üretilenler kabul edildi)
- [ ] `app/legal/terms.tsx` ve `app/legal/privacy.tsx` şablon metinleri **kendi bilgilerinle güncellendi** — bunlar hazır şablondur, olduğu gibi yayınlama
- [ ] Gizlilik politikası için genel erişime açık bir URL hazırlandı (her iki mağaza da zorunlu tutar)
- [ ] iOS: HealthKit, kamera, mikrofon ve konuşma tanıma izin metinleri App Store Review notlarında açıklandı
- [ ] Android: Health Connect kullanımı için Play Console'da veri güvenliği formu dolduruldu
- [ ] RevenueCat ürün kimlikleri App Store Connect / Play Console'da oluşturuldu

---

## Klasör yapısı

```
app/                       Expo Router rotaları
├── _layout.tsx            Kök layout (provider zinciri)
├── (tabs)/                6 sekme: index, train, progress, performance, community, profile
├── workout/[id].tsx       Canlı antrenman oturumu
├── community/publish.tsx  Program yayınlama
├── legal/                 terms, privacy
└── *.tsx                  anatomy, nutrition, wellness, transformation, favorites,
                           watch-history, challenges, monthly-report, safety-card,
                           paywall, planner, plan-builder, coach, coach-desk,
                           exercise-library, form-lab, barcode-scan, onboarding, training-setup

components/                Paylaşılan UI (.native/.web uyarlamalarıyla)
lib/                       İş mantığı, store, analitik, entegrasyonlar
  └── _core/               Çerçeve seviyesi (auth, api, theme)
constants/                 OAuth ve tema sabitleri
hooks/                     use-auth
shared/                    İstemci + sunucu ortak tipleri (fitness.ts)
server/                    tRPC router, DB sorguları
  └── _core/               index (Express), trpc, context, env, llm, cookies, systemRouter
drizzle/                   Şema + migration'lar
tests/                     Vitest testleri
scripts/                   GLB üretimi, marka görselleri, medya doğrulama
docs/                      Tasarım notları, araştırma çıktıları, yol haritası
assets/                    İkonlar, splash, GLB modeli (üretilebilir — assets/README.md)
```

---

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run ios` / `android` / `web` | Platform hedefli başlatma |
| `npm run typecheck` | TypeScript kontrolü |
| `npm test` | Vitest |
| `npm run lint` | ESLint |
| `npm run server` | Backend'i (Express + tRPC) çalıştır |
| `npm run db:generate` / `db:migrate` | Drizzle migration |
| `npm run assets:brand` | Marka görsellerini yeniden üret |
| `npm run anatomy:build` / `anatomy:validate` | GLB üretimi ve doğrulaması |
| `npm run build:apk` / `build:android` / `build:ios` | EAS derlemeleri |

---

## Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyala.

- `EXPO_PUBLIC_` ön ekli değişkenler **bundle içine gömülür** — buraya gizli anahtar koyma.
- Ön eksiz değişkenler yalnızca sunucu sürecinde okunur.
- `.env` `.gitignore` içindedir; yalnızca `.env.example` commit edilir.

---

## Orijinal dışa aktarıma göre yapılanlar

Kaynak kod Manus üzerinde üretilmiş, 119 dosyalık düz (klasörsüz) bir dışa aktarım olarak geldi. Yapılanlar:

### Yeniden oluşturulan çerçeve dosyaları

`package.json` · `app/_layout.tsx` · `lib/trpc.ts` · `lib/health-sync.ts` · `lib/_core/api.ts` · `lib/_core/theme.ts` · `hooks/use-auth.ts` · `shared/const.ts` · `server/_core/*` · `global.css` · `tailwind.config.js` · `babel.config.js` · `scripts/load-env.js` · `drizzle.config.ts` · `eslint.config.js` · `eas.json` · `.env.example`

### Yeni yazılan ekranlar

Kodda yönlendirme vardı ama ekran dosyası dışa aktarımda yoktu:

`nutrition` · `wellness` · `transformation` · `favorites` · `watch-history` · `challenges` · `monthly-report` · `safety-card` · `legal/terms` · `legal/privacy`

Hepsi mevcut veri modelini (`shared/fitness.ts`) ve store API'sini kullanır; yeni tip veya yeni depolama alanı eklenmedi.

### Yeni yazılan bileşenler

`charts` (LineChart/BarChart) · `screen-container` · `screen-header` · `legal-document` · `draggable-metric-list.web` · `voice-command-control.web`

### Üretilen varlıklar

10 marka görseli (`scripts/generate-brand-assets.py`) ve 21 adlandırılmış kas mesh'i içeren `ironpulse-muscles.glb` (`scripts/create-anatomy-glb.mjs`). İkisi de script'lerle yeniden üretilebilir.

### Düzeltilen hatalar

Bağımlılıklar kurulup proje gerçekten derlendiğinde ortaya çıkanlar:

**Çalışma anında çökmeye yol açacaklar**

- `StyleSheet.absoluteFillObject` React Native 0.86'da tamamen kaldırılmış — tipten de runtime'dan da. Orijinal koddaki üç dosya (`plan-builder`, `glb-anatomy-viewer.native`, `in-app-video-guide.native`) bu API'yi kullanıyordu; açık `position`/`top`/`left`/`right`/`bottom` değerleriyle değiştirildi.
- `react-native-reanimated/plugin` artık geçerli değil; Reanimated 4 worklet dönüşümünü `react-native-worklets/plugin` sağlıyor. `babel.config.js` güncellendi, `react-native-worklets` bağımlılığa eklendi.
- Eksik native peer bağımlılıkları: `expo-font` (`@expo/vector-icons` için) ve `expo-file-system` (`expo-three` için). Bunlar olmadan native derleme çöker.

**API değişiklikleri**

- `expo-video`: `allowsFullscreen` prop'u kaldırılmış, yerine `fullscreenOptions={{ enable: true }}` geldi.
- `@kingstinct/react-native-healthkit` v14: `requestAuthorization` iki dizi yerine tek bir `{ toRead, toShare }` nesnesi alıyor; `isHealthDataAvailable` → `isHealthDataAvailableAsync`.
- `app.config.ts`: `newArchEnabled` ve `edgeToEdgeEnabled` SDK 57'de kaldırıldı (ikisi de artık varsayılan) ve config şemasını kırıyordu.

**Yapılandırma**

- **RevenueCat env değişkenleri** — `process.env.REVENUECAT_*` Expo istemcisinde okunamaz; `EXPO_PUBLIC_REVENUECAT_*` olarak düzeltildi.
- **`app.config.ts`** — sabit kodlanmış Manus bundle kimliği ve `/manus-storage/` logo yolu kaldırıldı; `EXPO_PUBLIC_BUNDLE_ID` / `EXPO_PUBLIC_SCHEME` ile yapılandırılabilir yapıldı.
- **Web derlemesi** — yalnızca `.native` uyarlaması olan iki bileşen web'i kırıyordu; `.web` karşılıkları eklendi.
- **3B görüntüleyici** — `glb-anatomy-viewer.native.tsx` var olmayan bir modele işaret ediyordu ve düğüm adlarını tam eşleşmeyle arıyordu (`"Chest"`), oysa model taraflı adlar üretiyor (`"Chest_L"`). Bu hâliyle hiçbir kas seçilemezdi. Model yolu ve ön ek eşlemesi düzeltildi; hiçbir platformda kullanılmayan mükerrer `glb-anatomy-viewer.tsx` kaldırıldı.
- **Ortama bağlı testler** — `anatomy-glb.test.ts` ve `revenuecat-credentials.test.ts` koşul sağlanmazsa hata vermek yerine atlanıyor.
- **Vitest** — `react-native` import eden modüller için `react-native-web` alias'ı eklendi.
- **`.gitignore`** — `.env` kuralı sıkılaştırıldı, `devserver.log` ve `inspect.txt` eklendi.

**React Compiler uyumu**

SDK 57'de React Compiler etkin ve lint kuralları katı. 48 hata sıfıra indirildi:

- `useRef(new Animated.Value(...)).current` kalıbı dört dosyada render sırasında ref okuyordu → lazy `useState` ile değiştirildi (aynı kalıcılık, saf render).
- Render içindeki `Date.now()` çağrıları (üç ekran) tek seferlik `useState` referansına alındı.
- `exercise-library` URL parametrelerini effect'te state'e kopyalıyordu → doğrudan başlangıç değeri olarak türetiliyor.
- `revenuecat` web/varsayılan uyarlamalarındaki gereksiz `useEffect`/`useCallback` sarmalayıcıları kaldırıldı.
- Node script'leri için ESLint'e Node global'leri tanıtıldı (`Buffer`, `__dirname`).

### Repoya alınmayanlar

`devserver.log` (163 KB günlük) · `inspect.txt` (260 KB glTF çıktısı) · `config.json` (Manus oturum yapılandırması) · `SKILL.md`, `.safety_warning.md` (Manus araç dosyaları) · `node_modules`'tan sızmış `body-muscles` ve Expo tip dosyaları.

---

## Bilinen sınırlar

- **4 ESLint uyarısı bilinçli olarak bırakıldı.** `biometric-lock`, `glb-anatomy-viewer.native` ve `theme-provider` içinde React Compiler'ın muhafazakâr biçimde işaretlediği üç kalıp var (effect'te setState, render'da ref okuma). Bunlar derlemeyi engellemiyor; cihazda çalıştırıp doğrulamadan güvenlik kilidini ve 3B görüntüleyiciyi yeniden yazmak riskli olduğu için dokunulmadı.

- **Yasal metinler şablondur.** `app/legal/terms.tsx` ve `app/legal/privacy.tsx` hukuki danışmanlık değildir. Mağazaya göndermeden önce kendi şirket bilgilerin ve gerçek veri işleme uygulamalarınla güncelle.
- **`lib/health-sync.ts` temel bir uyarlamadır.** İzin akışı ve bağlantı durumu çalışır; ayrıntılı adım/ağırlık okuma sorguları genişletilmeye açıktır.
- **Backend isteğe bağlıdır.** Uygulamanın çekirdeği (antrenman, analitik, anatomi) tamamen çevrimdışı çalışır. Yalnızca topluluk ve AI koç özellikleri `npm run server` ve bir MySQL bağlantısı gerektirir.

## Lisans

MIT — `LICENSE` dosyasına bak.

Üçüncü taraf içerik: kas atlası verisi [body-muscles](https://github.com/vulovix/body-muscles) (Apache-2.0), anatomi modelleri BodyParts3D (CC-BY-SA 2.1 JP), egzersiz medyası kaynakları için `docs/open-source-content-sources.md`.
