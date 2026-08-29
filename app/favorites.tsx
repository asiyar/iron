import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { EmptyState, SectionTitle, ui } from "@/components/fitness-ui";
import { ScreenHeader } from "@/components/screen-header";
import { useFitness } from "@/lib/fitness-store";

const dateLabel = (value: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export default function FavoritesScreen() {
  const router = useRouter();
  const { data, removeVideoFavorite } = useFitness();
  const favorites = [...data.videoFavorites].sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader back="Profil" eyebrow="Kayıtlılar" title="Favori rehberler." copy="Kaydettiğin egzersiz videoları burada toplanır. Kaynak ve lisans bilgisi her zaman görünür kalır." />

        <SectionTitle title={`${favorites.length} kayıtlı rehber`} />
        {favorites.length ? (
          favorites.map((favorite) => (
            <View key={favorite.exerciseId} style={styles.item}>
              <TouchableOpacity style={styles.itemMain} onPress={() => router.push(`/exercise-library?exerciseId=${favorite.exerciseId}` as never)}>
                <View style={styles.icon}>
                  <MaterialIcons name={favorite.downloadStatus === "saved" ? "download-done" : "play-circle-filled"} size={20} color="#B8FF3D" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} numberOfLines={2}>{favorite.title}</Text>
                  <Text style={styles.meta}>{favorite.provider} · {favorite.license}</Text>
                  {favorite.author ? <Text style={styles.meta}>{favorite.author}</Text> : null}
                  <Text style={styles.saved}>{dateLabel(favorite.savedAt)} tarihinde kaydedildi</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeVideoFavorite(favorite.exerciseId)} style={styles.remove} accessibilityLabel="Favoriden çıkar">
                <MaterialIcons name="bookmark-remove" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <EmptyState
            icon="bookmark-border"
            title="Henüz favori yok"
            copy="Egzersiz kütüphanesinde bir rehberi kaydettiğinde burada listelenir."
            action="Kütüphaneye git"
            onAction={() => router.push("/exercise-library" as never)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 18, padding: 14, marginBottom: 10 },
  itemMain: { flexDirection: "row", alignItems: "center", gap: 13, flex: 1 },
  icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#1B2416", alignItems: "center", justifyContent: "center" },
  title: { color: "#F5F7FA", fontSize: 14, fontWeight: "800" },
  meta: { color: "#9AA6B5", fontSize: 11, marginTop: 2 },
  saved: { color: "#657386", fontSize: 11, marginTop: 4 },
  remove: { padding: 8 },
});
