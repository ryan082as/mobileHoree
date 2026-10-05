import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DAFTAR_UMKM_KULINER } from "@/data/umkmData";

export default function DetailAuditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Cari data kuliner berdasarkan ID dari dynamic route
  const gerai = DAFTAR_UMKM_KULINER.find((item) => item.id === id) || DAFTAR_UMKM_KULINER[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Tombol Kembali */}
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      {/* Banner & Foto Gerai */}
      <Image source={{ uri: gerai.fotoUrl }} style={styles.bannerImage} resizeMode="cover" />

      {/* Profil Usaha */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{gerai.namaUsaha}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{gerai.kategori}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Pemilik: {gerai.namaPemilik} • Lokasi: {gerai.lokasiKota}
        </Text>
        <Text style={styles.founded}>Berdiri sejak tahun: {gerai.tahunBerdiri}</Text>
      </View>

      {/* Skor & Breakdown 4 Pilar */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>📊 Rapor Hasil Evaluasi 4 Pilar Kuliner</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreNumber}>{gerai.skorTotal}/100</Text>
          <Text style={styles.scoreStatus}>Status: {gerai.statusKelayakan}</Text>
        </View>

        <View style={styles.pilarItem}>
          <Text style={styles.pilarName}>1. Higiene & Sanitasi Dapur</Text>
          <Text style={styles.pilarValue}>{gerai.skorAspek.higieneSanitasi}%</Text>
        </View>
        <View style={styles.pilarItem}>
          <Text style={styles.pilarName}>2. Manajemen Keuangan & HPP</Text>
          <Text style={styles.pilarValue}>{gerai.skorAspek.keuanganHPP}%</Text>
        </View>
        <View style={styles.pilarItem}>
          <Text style={styles.pilarName}>3. Pemasaran Digital & Online Food</Text>
          <Text style={styles.pilarValue}>{gerai.skorAspek.pemasaranDigital}%</Text>
        </View>
        <View style={styles.pilarItem}>
          <Text style={styles.pilarName}>4. Operasional Dapur & Karyawan</Text>
          <Text style={styles.pilarValue}>{gerai.skorAspek.operasionalDapur}%</Text>
        </View>
      </View>

      {/* Catatan Tindak Lanjut Asesor */}
      <View style={[styles.card, { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }]}>
        <Text style={[styles.sectionHeader, { color: "#166534" }]}>💡 Rekomendasi Resmi Asesor</Text>
        <Text style={styles.rekomendasiText}>{gerai.rekomendasiAsesor}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  bannerImage: { width: "100%", height: 180, borderRadius: 12, marginBottom: 16 },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#0f172a", flex: 1 },
  badge: { backgroundColor: "#eff6ff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, color: "#2563eb", fontWeight: "600" },
  subtitle: { fontSize: 13, color: "#475569", marginTop: 4 },
  founded: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  sectionHeader: { fontSize: 15, fontWeight: "bold", color: "#1e293b", marginBottom: 12 },
  scoreBox: { backgroundColor: "#f1f5f9", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  scoreNumber: { fontSize: 28, fontWeight: "bold", color: "#1e3a8a" },
  scoreStatus: { fontSize: 13, fontWeight: "600", color: "#059669", marginTop: 2 },
  pilarItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  pilarName: { fontSize: 13, color: "#334155" },
  pilarValue: { fontSize: 13, fontWeight: "bold", color: "#0f172a" },
  rekomendasiText: { fontSize: 13, color: "#166534", lineHeight: 20 },
});
