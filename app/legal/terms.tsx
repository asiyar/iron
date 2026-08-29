import { LegalDocument } from "@/components/legal-document";

export default function TermsScreen() {
  return (
    <LegalDocument
      eyebrow="Yasal"
      title="Kullanım şartları."
      updatedAt="28 Ağustos 2026"
      intro="IronPulse'u kullanarak aşağıdaki şartları kabul etmiş olursun."
      sections={[
        {
          heading: "1. Hizmetin kapsamı",
          paragraphs: [
            "IronPulse; antrenman kaydı, planlama ve ilerleme takibi sunan bir mobil uygulamadır. Uygulama bir sağlık hizmeti, tıbbi cihaz veya kişiselleştirilmiş sağlık danışmanlığı değildir.",
            "Uygulamadaki öneriler yalnızca senin girdiğin verilerden hesaplanır ve genel antrenman bilgisi niteliğindedir.",
          ],
        },
        {
          heading: "2. Sağlık sorumluluk reddi",
          paragraphs: [
            "Bir egzersiz programına başlamadan önce, özellikle mevcut bir sağlık durumun varsa, bir hekime danışmalısın.",
            "Antrenman sırasında ağrı, baş dönmesi, nefes darlığı veya göğüs rahatsızlığı hissedersen derhal dur ve tıbbi yardım al. Uygulamanın kullanımından doğan yaralanmalardan geliştirici sorumlu tutulamaz.",
          ],
        },
        {
          heading: "3. Hesap ve içerik",
          paragraphs: [
            "Topluluk özelliklerini kullanmak için hesap oluşturman gerekir. Hesap bilgilerinin güvenliğinden sen sorumlusun.",
            "Yayınladığın programlardan sen sorumlusun. Yanıltıcı, telif hakkı ihlal eden veya başkalarının güvenliğini riske atan içerikleri yayınlayamazsın. Bu kurallara aykırı içerikler kaldırılabilir.",
          ],
        },
        {
          heading: "4. Abonelik ve ödemeler",
          paragraphs: [
            "Premium abonelikler App Store veya Google Play üzerinden işlenir; ödeme, yenileme ve iade işlemleri ilgili mağazanın kurallarına tabidir.",
            "Abonelik, iptal edilmediği sürece dönem sonunda otomatik yenilenir. İptali cihazının mağaza ayarlarından yapabilirsin.",
          ],
        },
        {
          heading: "5. Fikri mülkiyet",
          paragraphs: [
            "Uygulama arayüzü ve kodu geliştiriciye aittir. Anatomi modelleri ve egzersiz medyası, uygulama içinde belirtilen açık lisanslar kapsamında kullanılır ve kaynak gösterimi korunur.",
          ],
        },
        {
          heading: "6. Sorumluluğun sınırlandırılması",
          paragraphs: [
            "Hizmet 'olduğu gibi' sunulur. Yürürlükteki mevzuatın izin verdiği ölçüde, dolaylı veya sonuç niteliğindeki zararlardan sorumluluk kabul edilmez.",
          ],
        },
        {
          heading: "7. Değişiklikler ve iletişim",
          paragraphs: [
            "Bu şartlar güncellenebilir; önemli değişiklikler uygulama içinde duyurulur.",
            "Sorular için uygulama mağazası sayfasındaki destek adresini kullanabilirsin.",
          ],
        },
      ]}
    />
  );
}
