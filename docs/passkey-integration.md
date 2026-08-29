# IronPulse Passkey Üretim Entegrasyon Notu

## Mevcut Durum

IronPulse’ın ilk sürümünde iOS Face ID, Touch ID ve Android biyometrisi ile **yerel uygulama kilidi** uygulanmıştır. Bu, cihaz üzerindeki uygulama erişimini korur; sunucuda kullanıcı oturumu oluşturan bir passkey değildir. Passkey ile hesap girişi; kullanıcı hesabı, imzalı oturum, doğrulama uç noktaları ve uygulama-domain ilişkilendirmesi gerektirir.[1]

## Üretim Önkoşulları

| Gereksinim | Amaç | IronPulse için gereken değer |
|---|---|---|
| Doğrulanmış HTTPS domaini | Passkey relying party kimliği | Örneğin `auth.ironpulse.app`; yayın öncesi kullanıcı tarafından belirlenir |
| iOS Associated Domains | iOS’un uygulamayı web kimlik bilgileriyle ilişkilendirmesi | Apple Team ID, yayın bundle ID ve `/.well-known/apple-app-site-association` |
| Android Digital Asset Links | Android Credential Manager ilişkilendirmesi | Yayın paketi adı, imzalama sertifikası SHA-256 değeri ve `/.well-known/assetlinks.json` |
| Kimlik sunucusu ve kullanıcı hesabı | Credential challenge üretme/doğrulama ve oturum yönetimi | Better Auth ya da eşdeğer WebAuthn/FIDO2 sunucu akışı |
| Passkey veri şeması | Credential, public key, sayaç ve cihaz metadatası saklama | Kullanıcı tablosuna bağlı, sunucu tarafında yönetilen kayıtlar |
| Yerel geliştirme derlemesi | Native passkey özelliğinin gerçek cihazda sınanması | Expo Go yerine iOS/Android development veya production build |

## Önerilen Uygulama Sırası

İlk olarak yayın alan adı, iOS Team ID ve Android imzalama parmak izi sağlanmalıdır. Ardından kimlik sunucusuna kayıt/doğrulama challenge uçları ve passkey credential tablosu eklenir. Domain doğrulama dosyaları yayın alanında barındırıldıktan sonra native Expo modülü bağlanır; son adımda gerçek iPhone ve Android cihazlarda kayıt, oturum açma, credential listesi ve iptal akışları test edilir.[2]

> **Kritik sınır:** Passkey üretim entegrasyonu, kontrol edilen bir alan adı ve yayın imzalama kimlikleri olmadan güvenli biçimde etkinleştirilemez. Bu nedenle ilk teslimde yerel biyometrik kilit çalışır durumdadır; sunucu tabanlı passkey oturumu, yayın kimlikleri sağlandığında bu plana göre eklenmelidir.

## Kaynaklar

[1]: https://docs.expo.dev/develop/authentication/ "Expo Authentication — Passkeys and Biometrics"

[2]: https://www.npmjs.com/package/@officialunofficial/react-native-passkeys "React Native Passkeys — iOS and Android setup"
