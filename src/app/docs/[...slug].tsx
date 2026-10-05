import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DATA_REGULASI } from "@/data/regulasiData";

export default function CatchAllDocsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const router = useRouter();

  // Slug bisa berupa string tunggal atau array path segments
  const currentSlug = Array.isArray(slug) ? slug.join("/") : slug || "halal";
  const panduanKey = Array.isArray(slug) ? slug[slug.length - 1] : slug || "halal";
  const panduan = DATA_REGULASI[panduanKey] || DATA_REGULASI["halal"];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
        <Text style={styles.backText}>Kembali</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.slugPill}>
          <Text style={styles.slugText}>Path: /docs/{currentSlug}</Text>
        </View>

        <Text style={styles.title}>{panduan.judul}</Text>
        <Text style={styles.kategori}>Kategori: {panduan.kategori}</Text>
        <Text style={styles.ringkasan}>{panduan.ringkasan}</Text>

        <Text style={styles.sectionTitle}>Poin-Poin Standar SOP:</Text>
        {panduan.isiLengkap.map((poin, idx) => (
          <View key={idx} style={styles.poinItem}>
            <Text style={styles.poinText}>{poin}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  card: { backgroundColor: "#ffffff", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  slugPill: { backgroundColor: "#f1f5f9", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start", marginBottom: 8 },
  slugText: { fontSize: 11, color: "#64748b", fontFamily: "monospace" },
  title: { fontSize: 18, fontWeight: "bold", color: "#0f172a", marginTop: 4 },
  kategori: { fontSize: 12, color: "#2563eb", fontWeight: "600", marginTop: 2 },
  ringkasan: { fontSize: 13, color: "#475569", marginVertical: 12, lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1e293b", marginTop: 8, marginBottom: 8 },
  poinItem: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  poinText: { fontSize: 13, color: "#334155" },
});
