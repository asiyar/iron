import { LegalDocument } from "@/components/legal-document";

export default function PrivacyScreen() {
  return (
    <LegalDocument
      eyebrow="Yasal"
      title="Gizlilik politikası."
      updatedAt="28 Ağustos 2026"
      intro="IronPulse verilerini mümkün olduğunca cihazında tutar. Bu metin hangi verinin nerede işlendiğini açıklar."
      sections={[
        {
          heading: "1. Cihazında kalan veriler",
          paragraphs: [
            "Antrenmanlar, şablonlar, vücut ağırlığı, ölçümler, beslenme kayıtları, toparlanma günlükleri ve ayarlar cihazının yerel deposunda (AsyncStorage) saklanır ve sunucuya gönderilmez.",
            "Biyometrik kilit tercihi gibi hassas ayarlar işletim sisteminin güvenli deposunda (Keychain / Keystore) tutulur.",
          ],
        },
        {
          heading: "2. Sunucuya gönderilen veriler",
          paragraphs: [
            "Yalnızca şu durumlarda veri sunucuya iletilir: hesap açıp giriş yaptığında (kimlik bilgilerin), bir programı topluluğa yayınladığında (yayınladığın program içeriği) ve AI koç önerisi istediğinde (antrenman sayısı, toplam hacim, rekor sayısı gibi özet sayısal veriler).",
            "AI koç isteğinde ad, e-posta veya ham antrenman geçmişi gönderilmez; yalnızca özetlenmiş sayısal alanlar iletilir.",
          ],
        },
        {
          heading: "3. Sağlık verisi",
          paragraphs: [
            "Apple Health ve Health Connect erişimi tamamen isteğe bağlıdır ve yalnızca sen izin verdiğinde açılır.",
            "Okunan adım, ağırlık ve antrenman verileri yalnızca cihazında işlenir; IronPulse sunucularına veya üçüncü taraflara aktarılmaz. İzni istediğin zaman sistem ayarlarından geri alabilirsin.",
          ],
        },
        {
          heading: "4. Kamera ve mikrofon",
          paragraphs: [
            "Kamera, barkod tarama ve form rehberi için kullanılır; görüntü kaydedilmez ve gönderilmez.",
            "Mikrofon yalnızca sesli antrenman komutları için, sen özelliği açtığında kullanılır. Ses kaydı saklanmaz.",
          ],
        },
        {
          heading: "5. Üçüncü taraf hizmetler",
          paragraphs: [
            "Abonelik yönetimi için RevenueCat, kimlik doğrulama için OAuth sağlayıcısı ve AI önerileri için bir dil modeli sağlayıcısı kullanılır. Her biri kendi gizlilik politikasına tabidir.",
            "Uygulamada reklam takip kimliği toplanmaz ve üçüncü taraf analitik izleyicisi çalıştırılmaz.",
          ],
        },
        {
          heading: "6. Verilerin silinmesi",
          paragraphs: [
            "Cihaz verilerini Profil ekranındaki veri sıfırlama seçeneğiyle veya uygulamayı kaldırarak silebilirsin.",
            "Hesabının ve yayınladığın programların silinmesini talep etmek için mağaza sayfasındaki destek adresine yazabilirsin.",
          ],
        },
        {
          heading: "7. Çocukların gizliliği",
          paragraphs: [
            "IronPulse 13 yaş altındaki kullanıcılara yönelik değildir ve bu yaş grubundan bilerek veri toplamaz.",
          ],
        },
      ]}
    />
  );
}
