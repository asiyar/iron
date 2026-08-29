import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, SectionTitle, ui } from "@/components/fitness-ui";
import { ScreenHeader } from "@/components/screen-header";

const STOP_SIGNS = [
  "Göğüs ağrısı, baskı hissi veya çeneye/kola yayılan rahatsızlık",
  "Nefes darlığı, baş dönmesi veya bayılma hissi",
  "Ani, keskin veya bir tarafa yerleşen eklem ağrısı",
  "Bir hareket sırasında duyulan çıt sesi ve ardından güç kaybı",
  "Antrenman sonrası geçmeyen, günlerce süren aşırı yorgunluk",
];

const HABITS = [
  { icon: "sports-gymnastics", title: "Isınmayı atlama", copy: "5–10 dakika genel ısınma ve ana harekete özgü hafif setler." },
  { icon: "straighten", title: "Yükten önce teknik", copy: "Hareketi kontrollü tam açıklıkta yapamıyorsan ağırlığı artırma." },
  { icon: "trending-up", title: "Kademeli artış", copy: "Haftalık hacim artışını küçük tut; ani sıçramalar sakatlık riskini yükseltir." },
  { icon: "bedtime", title: "Toparlanmayı planla", copy: "Uyku ve dinlenme günleri antrenmanın kendisi kadar belirleyicidir." },
  { icon: "group", title: "Ağır setlerde gözcü", copy: "Bench press ve squat gibi hareketlerde ya gözcü kullan ya da güvenlik barlarını ayarla." },
];

export default function SafetyCardScreen() {
  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader back="Profil" eyebrow="Güvenlik" title="Antrenman güvenlik kartı." copy="IronPulse bir kayıt ve planlama aracıdır. Aşağıdakiler genel bilgidir, tıbbi tavsiye değildir." />

        <Card accent>
          <View style={styles.alertHead}>
            <MaterialIcons name="report" size={22} color="#FF6B6B" />
            <Text style={styles.alertTitle}>Antrenmanı hemen durdur</Text>
          </View>
          <Text style={ui.body}>Aşağıdakilerden biri olursa seti bırak ve tıbbi yardım al:</Text>
          {STOP_SIGNS.map((sign) => (
            <View key={sign} style={styles.bullet}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>{sign}</Text>
            </View>
          ))}
          <Text style={styles.emergency}>Acil durumda Türkiye&apos;de 112&apos;yi ara. Bulunduğun ülkede geçerli acil numarayı kullan.</Text>
        </Card>

        <SectionTitle title="Temel alışkanlıklar" />
        {HABITS.map((habit) => (
          <View key={habit.title} style={styles.habit}>
            <View style={styles.habitIcon}>
              <MaterialIcons name={habit.icon as keyof typeof MaterialIcons.glyphMap} size={19} color="#B8FF3D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitTitle}>{habit.title}</Text>
              <Text style={styles.habitCopy}>{habit.copy}</Text>
            </View>
          </View>
        ))}

        <SectionTitle title="Uygulamanın sınırları" />
        <Card>
          <Text style={ui.body}>
            IronPulse teşhis koymaz, sakatlık tedavisi önermez, ilaç veya takviye tavsiyesi vermez ve beslenme tedavisi sunmaz.
            Uygulamadaki öneriler yalnızca senin girdiğin antrenman verisinden hesaplanır.
          </Text>
          <Text style={[ui.body, { marginTop: 12 }]}>
            Mevcut bir sağlık durumun, hamilelik, yakın zamanda geçirilmiş bir ameliyat veya süregelen bir ağrın varsa
            antrenman programına başlamadan önce hekimine danış.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  alertHead: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 10 },
  alertTitle: { color: "#FF6B6B", fontSize: 16, fontWeight: "900" },
  bullet: { flexDirection: "row", gap: 9, marginTop: 10, alignItems: "flex-start" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FF6B6B", marginTop: 7 },
  bulletText: { color: "#D7DEE8", fontSize: 13, lineHeight: 19, flex: 1 },
  emergency: { color: "#FF6B6B", fontSize: 12, fontWeight: "800", marginTop: 16, lineHeight: 17 },
  habit: { flexDirection: "row", gap: 13, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 18, padding: 14, marginBottom: 10 },
  habitIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#1B2416", alignItems: "center", justifyContent: "center" },
  habitTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "800" },
  habitCopy: { color: "#9AA6B5", fontSize: 12, marginTop: 3, lineHeight: 17 },
});
