import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DATA_REGULASI } from "@/constants/regulasi";
import { styles } from "@/styles/docsStyles";

export default function CatchAllDocsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const router = useRouter();

  const currentSlug = Array.isArray(slug) ? slug.join("/") : slug || "halal";
  const panduanKey = Array.isArray(slug) ? slug[slug.length - 1] : slug || "halal";
  const panduan = DATA_REGULASI[panduanKey] || DATA_REGULASI["halal"];

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
