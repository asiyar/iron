# IronPulse Gelişmiş Modül Platform Notları

## Kamera Form Rehberi

Expo Camera, iOS, Android ve web üzerinde canlı önizleme sağlayabilir. İzin isteği önizleme oluşturulmadan önce yapılmalı; tek seferde yalnızca tek kamera önizlemesi etkin tutulmalı ve görünmeyen ekranlarda önizleme kaldırılmalıdır. İlk uygulama sürümünde görüntüler cihazda kalır; form rehberi çekim hizalaması, kullanıcı onaylı kayıt ve yerel kontrol listesiyle sınırlıdır.

Kaynak: <https://docs.expo.dev/versions/latest/sdk/camera/>

## GLB Anatomi Görüntüleyici

Expo GLView, iOS, Android ve web için OpenGL ES/WebGL oluşturur. Expo Three, Three.js sahnelerinin Expo GL üzerinde çalışmasına yardımcı olur; ağır üç boyutlu kullanımın gerçek cihazda sınanması gerekir. IronPulse GLB modeli, uygulama içi varlık olarak paketlenir ve 21 seçilebilir kas düğümü içerir.

Kaynaklar: <https://docs.expo.dev/versions/latest/sdk/gl-view/> ve <https://github.com/expo/expo-three>
