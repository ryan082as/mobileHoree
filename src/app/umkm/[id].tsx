import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DAFTAR_UMKM_KULINER } from "@/data/umkmData";

export default function DetailAuditScreen() {
  // Kriteria Modul 2: useLocalSearchParams() untuk membaca parameter URL dinamis (Hal 21-22)
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const router = useRouter();

  // State tab lokal yang tersinkronisasi dengan query parameter
  const activeTab = tab || "rapor";

  // Cari data kuliner berdasarkan ID dari dynamic route
  const gerai = DAFTAR_UMKM_KULINER.find((item) => item.id === id) || DAFTAR_UMKM_KULINER[0];

  // Kriteria Modul 2: useEffect() dengan Dependency Array (Hal 9-10)
  useEffect(() => {
    console.log(`[Modul 2] Memuat detail gerai: ${gerai.namaUsaha} (ID: ${id}, Tab: ${activeTab})`);
  }, [id, activeTab]);

  // Kriteria Modul 2: Navigasi dengan router.canGoBack() & router.back() (Hal 32, 34)
  const handleKembali = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // Kriteria Modul 2: router.setParams() untuk mengubah parameter URL tanpa reload (Hal 38)
  const gantiTab = (namaTab: string) => {
    router.setParams({ tab: namaTab });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Tombol Kembali */}
      <Pressable style={styles.backRow} onPress={handleKembali}>
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      {/* Banner & Foto Gerai */}
      <Image
        source={gerai.fotoLocal || { uri: gerai.fotoUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />

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

        {/* Tab Switcher menggunakan router.setParams() (Hal 38 Modul 2) */}
        <View style={styles.tabSwitchContainer}>
          <Pressable
            style={[styles.tabSwitchBtn, activeTab === "rapor" && styles.tabSwitchBtnActive]}
            onPress={() => gantiTab("rapor")}
          >
            <Text style={[styles.tabSwitchText, activeTab === "rapor" && styles.tabSwitchTextActive]}>
              📊 4 Pilar Rapor
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabSwitchBtn, activeTab === "legalitas" && styles.tabSwitchBtnActive]}
            onPress={() => gantiTab("legalitas")}
          >
            <Text style={[styles.tabSwitchText, activeTab === "legalitas" && styles.tabSwitchTextActive]}>
              📜 Izin & Legalitas
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Konten Tab 1: Skor & Breakdown 4 Pilar */}
      {activeTab === "rapor" && (
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
      )}

      {/* Konten Tab 2: Izin & Kesiapan Legalitas */}
      {activeTab === "legalitas" && (
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>📜 Dokumen & Kesiapan Perizinan Usaha</Text>
          <View style={styles.pilarItem}>
            <Text style={styles.pilarName}>Sertifikat Halal Resmi</Text>
            <Text style={[styles.pilarValue, { color: gerai.sertifikatHalal ? "#52B79B" : "#ef4444" }]}>
              {gerai.sertifikatHalal ? "✅ Sudah Ada" : "❌ Belum Ada"}
            </Text>
          </View>
          <View style={styles.pilarItem}>
            <Text style={styles.pilarName}>Izin Edar P-IRT / BPOM</Text>
            <Text style={[styles.pilarValue, { color: gerai.izinPIRT_BPOM ? "#52B79B" : "#ef4444" }]}>
              {gerai.izinPIRT_BPOM ? "✅ Terdaftar" : "❌ Belum Ada"}
            </Text>
          </View>
          <View style={styles.pilarItem}>
            <Text style={styles.pilarName}>Terdaftar di GrabFood / GoFood</Text>
            <Text style={[styles.pilarValue, { color: gerai.terdaftarOnlineFood ? "#52B79B" : "#ef4444" }]}>
              {gerai.terdaftarOnlineFood ? "✅ Aktif" : "❌ Belum"}
            </Text>
          </View>
          <View style={styles.pilarItem}>
            <Text style={styles.pilarName}>Pembayaran Digital QRIS</Text>
            <Text style={[styles.pilarValue, { color: gerai.adopsiQRIS ? "#52B79B" : "#ef4444" }]}>
              {gerai.adopsiQRIS ? "✅ Tersedia" : "❌ Belum"}
            </Text>
          </View>
        </View>
      )}

      {/* Catatan Tindak Lanjut Asesor */}
      <View style={[styles.card, { backgroundColor: "#EEF9F5", borderColor: "#C1EBDE" }]}>
        <Text style={[styles.sectionHeader, { color: "#28735F" }]}>💡 Rekomendasi Resmi Asesor</Text>
        <Text style={styles.rekomendasiText}>{gerai.rekomendasiAsesor}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F4" },
  content: {
    padding: 16,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  backText: { color: "#52B79B", fontWeight: "600", fontSize: 14 },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
    backgroundColor: "#EAEAEA",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#2C3033", flex: 1 },
  badge: { backgroundColor: "#EEF9F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, color: "#3D967D", fontWeight: "600" },
  subtitle: { fontSize: 13, color: "#74787C", marginTop: 4 },
  founded: { fontSize: 12, color: "#9DA1A5", marginTop: 2 },
  sectionHeader: { fontSize: 15, fontWeight: "bold", color: "#2C3033", marginBottom: 12 },
  scoreBox: { backgroundColor: "#F4F4F4", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  scoreNumber: { fontSize: 28, fontWeight: "bold", color: "#52B79B" },
  scoreStatus: { fontSize: 13, fontWeight: "600", color: "#28735F", marginTop: 2 },
  pilarItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#E2E4E6" },
  pilarName: { fontSize: 13, color: "#74787C" },
  pilarValue: { fontSize: 13, fontWeight: "bold", color: "#2C3033" },
  rekomendasiText: { fontSize: 13, color: "#28735F", lineHeight: 20 },
  tabSwitchContainer: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    padding: 3,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabSwitchBtnActive: {
    backgroundColor: "#52B79B",
  },
  tabSwitchText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#74787C",
  },
  tabSwitchTextActive: {
    color: "#ffffff",
  },
});
