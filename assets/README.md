# assets/

## images/ — üretilmiş marka görselleri

Bu klasördeki tüm görseller `scripts/generate-brand-assets.py` ile üretilir (Pillow gerektirir):

```bash
npm run assets:brand
```

| Dosya | Kullanım | Boyut |
| --- | --- | --- |
| `icon.png` | Uygulama ikonu | 1024×1024 |
| `favicon.png` | Web sekme ikonu | 48×48 |
| `splash-icon.png` | Açılış ekranı (şeffaf) | 400×400 |
| `android-icon-foreground.png` | Adaptive icon ön plan (%58 güvenli alan) | 432×432 |
| `android-icon-background.png` | Adaptive icon arka plan | 432×432 |
| `android-icon-monochrome.png` | Android themed icon | 432×432 |
| `physique-*.jpg` | Plan üretici hedef kartları (4 adet) | 600×800 |

Görseller programatik olarak çizilir: koyu zemin (#0B0E12) üzerine lime (#B8FF3D) şimşek + nabız çizgisi.
Kendi marka görsellerini kullanacaksan dosyaları aynı adlarla değiştirmen yeterli — script'i çalıştırmasan da olur.

`physique-*.jpg` görselleri kişi fotoğrafı içermez; soyut siluet ve odak çubuklarından oluşur. Böylece
telif ve model izni sorunu olmadan mağazaya gönderilebilir.

## models/ — anatomi modeli

```bash
npm run anatomy:build      # assets/models/ironpulse-muscles.glb üretir
npm run anatomy:validate   # GLB kapsayıcısını ve 21 adlandırılmış kas mesh'ini doğrular
```

`ironpulse-muscles.glb` (≈160 KB), `three` ile üretilen 21 adlandırılmış parçadan oluşur
(`Chest_L`, `Back`, `Quadriceps_R`, `Calf_L` …). Hem native 3B görüntüleyici hem de
`tests/anatomy-glb.test.ts` bu dosyayı kullanır.

Daha gerçekçi bir model istersen `scripts/build_bodyparts3d_glb.mjs`, BodyParts3D arşivinden
(CC-BY-SA 2.1 JP) yüksek çözünürlüklü bir GLB üretir. O modele geçerken
`components/glb-anatomy-viewer.native.tsx` içindeki `MODEL` yolunu güncelle.
