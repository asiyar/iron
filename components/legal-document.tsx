import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ui } from "@/components/fitness-ui";
import { ScreenHeader } from "@/components/screen-header";

export type LegalSection = { heading: string; paragraphs: string[] };

/** Şartlar ve gizlilik sayfalarının paylaştığı düzen. */
export function LegalDocument({ eyebrow, title, updatedAt, intro, sections }: { eyebrow: string; title: string; updatedAt: string; intro: string; sections: LegalSection[] }) {
  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader back="Profil" eyebrow={eyebrow} title={title} copy={intro} />
        <Text style={styles.updated}>Son güncelleme: {updatedAt}</Text>

        {sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>{paragraph}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          Bu metin bir şablondur ve hukuki danışmanlık yerine geçmez. Uygulamayı yayınlamadan önce
          kendi şirket bilgilerin, veri işleme uygulamaların ve yetkili mahkeme bilgin ile güncelle;
          gerekirse bir avukata inceleterek yayınla.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  updated: { color: "#657386", fontSize: 12, marginTop: 16 },
  section: { marginTop: 26 },
  heading: { color: "#F5F7FA", fontSize: 17, fontWeight: "900", letterSpacing: -0.3, marginBottom: 8 },
  paragraph: { color: "#9AA6B5", fontSize: 14, lineHeight: 21, marginBottom: 10 },
  footer: { color: "#657386", fontSize: 11, lineHeight: 17, marginTop: 34, fontStyle: "italic" },
});
