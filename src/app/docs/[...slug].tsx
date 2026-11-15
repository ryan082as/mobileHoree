import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DATA_REGULASI } from "@/data/regulasiData";
import { resolveLegacyRegulasiSlug } from "@/utils/menuDeeplinkParser";

const DAFTAR_SLUG_SOP = [
  { slug: "halal", label: "Sertifikasi Halal" },
  { slug: "pirt", label: "Izin Edar P-IRT" },
  { slug: "higiene", label: "Higiene & Sanitasi" },
] as const;

export default function CatchAllDocsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const router = useRouter();

  // Slug bisa berupa string tunggal atau array path segments
  const currentSlug = Array.isArray(slug) ? slug.join("/") : slug || "halal";
  const rawLastSegment = Array.isArray(slug) ? slug[slug.length - 1] : slug || "halal";
  const resolvedSlug = resolveLegacyRegulasiSlug(rawLastSegment);
  const panduan = DATA_REGULASI[resolvedSlug.slug];

  // Backward compatibility: normalkan URL legacy (mis. /docs/higienitas -> /docs/higiene)
  useEffect(() => {
    if (panduan && (resolvedSlug.wasMapped || (Array.isArray(slug) && slug.length > 1))) {
      router.replace(`/docs/${panduan.slug}` as never);
    }
  }, [panduan, resolvedSlug.wasMapped, slug, router]);

  if (!panduan) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backRow}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        >
          <Ionicons name="arrow-back" size={20} color="#52B79B" />
          <Text style={styles.backText}>Kembali ke Beranda</Text>
        </Pressable>

        <View style={styles.card}>
          <Ionicons name="document-text-outline" size={40} color="#D97706" />
          <Text style={styles.title}>Dokumen SOP Tidak Ditemukan</Text>
          <Text style={styles.ringkasan}>
            Deeplink "/docs/{currentSlug}" tidak cocok dengan regulasi SOP yang tersedia.
          </Text>
          <Text style={styles.sectionTitle}>Pilih SOP Resmi:</Text>
          <View style={styles.chipRow}>
            {DAFTAR_SLUG_SOP.map((item) => (
              <Pressable
                key={item.slug}
                style={styles.chip}
                onPress={() => router.replace(`/docs/${item.slug}` as never)}
              >
                <Text style={styles.chipText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.backRow}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
        <Text style={styles.backText}>Kembali ke Beranda</Text>
      </Pressable>

      {/* Pilihan SOP via Rute Deeplink */}
      <View style={styles.chipRow}>
        {DAFTAR_SLUG_SOP.map((item) => {
          const isActive = item.slug === panduan.slug;
          return (
            <Pressable
              key={item.slug}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => router.replace(`/docs/${item.slug}` as never)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{panduan.judul}</Text>
        <View style={styles.kategoriChip}>
          <Text style={styles.kategoriText}>Kategori: {panduan.kategori}</Text>
        </View>
        <Text style={styles.ringkasan}>{panduan.ringkasan}</Text>

        <Text style={styles.sectionTitle}>Poin-Poin Standar SOP Asesmen:</Text>
        {panduan.isiLengkap.map((poin, idx) => (
          <View key={idx} style={styles.poinItem}>
            <Text style={styles.poinBullet}>•</Text>
            <Text style={styles.poinText}>{poin}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F4" },
  content: { padding: 16, maxWidth: 500, alignSelf: "center", width: "100%" },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  backText: { color: "#52B79B", fontWeight: "600", fontSize: 14 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  chipActive: {
    backgroundColor: "#1E6B56",
    borderColor: "#1E6B56",
  },
  chipText: { fontSize: 12, color: "#2C3033", fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2C3033", marginTop: 4 },
  kategoriChip: {
    backgroundColor: "#E6F4F1", // Background lembut (soft teal)
    borderColor: "#B8E3D8",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 6,
    marginBottom: 6,
  },
  kategoriText: { fontSize: 12, color: "#1E6B56", fontWeight: "600" },
  ringkasan: { fontSize: 13, color: "#74787C", marginVertical: 12, lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#2C3033", marginTop: 8, marginBottom: 8 },
  poinItem: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#E2E4E6", gap: 8 },
  poinBullet: { fontSize: 14, color: "#52B79B", fontWeight: "bold" },
  poinText: { fontSize: 13, color: "#2C3033", flex: 1, lineHeight: 18 },
});
