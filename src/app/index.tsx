import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 1. IMPORT DATA & TYPES (Kriteria: Type & Array of Objects)
import {
  KategoriKuliner,
  RingkasanStatistikKuliner,
  UMKMKulinerData,
} from "@/types/umkm";
import { DAFTAR_UMKM_KULINER } from "@/data/umkmData";

// 2. IMPORT EXTERNAL STYLING (Kriteria: External Styles)
import { styles } from "@/styles/umkmStyles";

// Daftar Kategori Khusus Kuliner untuk Looping Filter
const KATEGORI_KULINER_LIST: KategoriKuliner[] = [
  "Semua",
  "Makanan Berat",
  "Minuman & Kopi",
  "Snack & Oleh-oleh",
  "Frozen Food",
  "Bakery & Pastry",
  "Katering",
];

export default function Index() {
  const router = useRouter();

  // State untuk pencarian dan filter kategori kuliner
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<KategoriKuliner>("Semua");

  // State untuk simulasi kalkulasi omzet cepat kuliner
  const [simOmzet, setSimOmzet] = useState<string>("");
  const [simPorsi, setSimPorsi] = useState<string>("");
  const [simHasil, setSimHasil] = useState<string | null>(null);

  // =========================================================================
  // 3. CUSTOM FUNCTIONS (Kriteria Penilaian: Deklarasi Custom Function)
  // =========================================================================

  /**
   * Custom Function 1: Format angka ke format mata uang Rupiah
   */
  function formatRupiah(nominal: number): string {
    return "Rp " + nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /**
   * Custom Function 2: Menentukan badge warna, label, dan icon berdasarkan skor kuliner
   */
  function getStatusBadge(skor: number) {
    if (skor >= 85) {
      return {
        label: "Sangat Layak",
        bgBadge: "#dcfce7",
        textBadge: "#15803d",
        barColor: "#10b981",
        icon: "checkmark-done-circle" as const,
      };
    } else if (skor >= 70) {
      return {
        label: "Cukup Layak",
        bgBadge: "#dbeafe",
        textBadge: "#1d4ed8",
        barColor: "#3b82f6",
        icon: "checkmark-circle" as const,
      };
    } else if (skor >= 55) {
      return {
        label: "Perlu Pembinaan",
        bgBadge: "#fef3c7",
        textBadge: "#b45309",
        barColor: "#f59e0b",
        icon: "alert-circle" as const,
      };
    } else {
      return {
        label: "Risiko Tinggi",
        bgBadge: "#fee2e2",
        textBadge: "#b91c1c",
        barColor: "#ef4444",
        icon: "close-circle" as const,
      };
    }
  }

  /**
   * Custom Function 3: Menghitung statistik ringkasan dari array UMKM kuliner
   */
  function hitungRingkasan(list: UMKMKulinerData[]): RingkasanStatistikKuliner {
    if (list.length === 0) {
      return { totalUMKM: 0, rataRataSkor: 0, jumlahLayak: 0 };
    }
    const totalSkor = list.reduce((total, item) => total + item.skorTotal, 0);
    const layakCount = list.filter((item) => item.skorTotal >= 70).length;

    return {
      totalUMKM: list.length,
      rataRataSkor: Math.round(totalSkor / list.length),
      jumlahLayak: layakCount,
    };
  }

  /**
   * Custom Function 4: Menangani tombol roadmap lanjutan (Modul 2 & 3)
   */
  function handleComingSoon(namaFitur: string, targetModul: string): void {
    Alert.alert(
      "Roadmap Pengembangan",
      `Fitur "${namaFitur}" dijadwalkan pada implementasi ${targetModul}.\n\nModul 1 berfokus pada fondasi UI Kuliner, Type, Looping, dan Custom Functions.`
    );
  }

  /**
   * Custom Function 5: Simulasi perhitungan kelayakan usaha kuliner instan
   */
  function hitungSimulasiKuliner(): void {
    const omzet = parseInt(simOmzet.replace(/[^0-9]/g, ""), 10);
    const porsi = parseInt(simPorsi.replace(/[^0-9]/g, ""), 10) || 0;

    if (isNaN(omzet) || omzet <= 0) {
      Alert.alert("Perhatian", "Silakan masukkan estimasi omzet bulanan yang valid!");
      return;
    }

    if (omzet >= 25000000 && porsi >= 150) {
      setSimHasil(
        "✅ Prediksi Skor: 85+ (Sangat Layak). Skala dapur siap ekspor/franchise & pengajuan pinjaman bank modal kerja."
      );
    } else if (omzet >= 10000000) {
      setSimHasil(
        "👍 Prediksi Skor: 70-84 (Cukup Layak). Layak KUR Mikro. Prioritas: Sertifikasi Halal dan integrasi Online Food."
      );
    } else {
      setSimHasil(
        "⚠️ Prediksi Skor: < 70 (Perlu Pembinaan). Disarankan mengikuti pelatihan HPP kuliner dan pengurusan P-IRT."
      );
    }
  }

  // Filter Data berdasarkan input pencarian dan kategori chip
  const filteredUMKM = DAFTAR_UMKM_KULINER.filter((item) => {
    const matchCategory =
      selectedCategory === "Semua" || item.kategori === selectedCategory;
    const matchSearch =
      item.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasiKota.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const stats = hitungRingkasan(DAFTAR_UMKM_KULINER);

  // =========================================================================
  // KOMPONEN RENDER KARTU UMKM KULINER
  // =========================================================================
  const renderUMKMCard = ({ item }: { item: UMKMKulinerData }) => {
    const status = getStatusBadge(item.skorTotal);

    return (
      <View style={styles.card}>
        {/* Gambar Foto Makanan / Outlet Kuliner */}
        <Image
          source={{ uri: item.fotoUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <View style={styles.cardBody}>
          {/* Header Kartu: Nama Usaha Kuliner & Sektor */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.namaUsaha}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.kategori}</Text>
            </View>
          </View>

          {/* Pemilik & Kota */}
          <View style={styles.ownerRow}>
            <Ionicons name="restaurant-outline" size={14} color="#64748b" />
            <Text style={styles.ownerText}>
              {item.namaPemilik} • {item.lokasiKota}
            </Text>
          </View>

          {/* Bar Penilaian & Skor (Kriteria: Inline Styles untuk warna dinamis) */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>
                Skor Kelayakan Kuliner:{" "}
                <Text style={{ fontWeight: "bold" }}>{item.skorTotal}/100</Text>
              </Text>
              {/* Inline Style: Warna badge dinamis */}
              <View
                style={[
                  styles.scoreBadgeContainer,
                  { backgroundColor: status.bgBadge },
                ]}
              >
                <Text style={[styles.scoreBadgeText, { color: status.textBadge }]}>
                  {status.label}
                </Text>
              </View>
            </View>

            {/* Inline Style: Lebar dan warna progress bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${item.skorTotal}%`,
                    backgroundColor: status.barColor,
                  },
                ]}
              />
            </View>
          </View>

          {/* Metrik Finansial & Operasional Kuliner */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Omzet / Bln</Text>
              <Text style={styles.metricValue}>{formatRupiah(item.omzetBulanan)}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Laba Bersih</Text>
              <Text style={styles.metricValue}>{formatRupiah(item.labaBersih)}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Kapasitas Dapur</Text>
              <Text style={styles.metricValue}>{item.kapasitasPorsiHarian} Porsi/Hari</Text>
            </View>
          </View>

          {/* Kepatuhan Khusus Kuliner (Halal, P-IRT, Online Food, QRIS) */}
          <View style={styles.complianceRow}>
            <View style={styles.complianceBadge}>
              <Ionicons
                name={item.sertifikatHalal ? "checkmark-circle" : "close-circle"}
                size={14}
                color={item.sertifikatHalal ? "#10b981" : "#94a3b8"}
              />
              <Text style={styles.complianceText}>Halal BPJPH</Text>
            </View>

            <View style={styles.complianceBadge}>
              <Ionicons
                name={item.izinPIRT_BPOM ? "checkmark-circle" : "close-circle"}
                size={14}
                color={item.izinPIRT_BPOM ? "#10b981" : "#94a3b8"}
              />
              <Text style={styles.complianceText}>Izin P-IRT/BPOM</Text>
            </View>

            <View style={styles.complianceBadge}>
              <Ionicons
                name={item.terdaftarOnlineFood ? "checkmark-circle" : "close-circle"}
                size={14}
                color={item.terdaftarOnlineFood ? "#10b981" : "#94a3b8"}
              />
              <Text style={styles.complianceText}>Online Food</Text>
            </View>

            <View style={styles.complianceBadge}>
              <Ionicons
                name={item.adopsiQRIS ? "checkmark-circle" : "close-circle"}
                size={14}
                color={item.adopsiQRIS ? "#10b981" : "#94a3b8"}
              />
              <Text style={styles.complianceText}>QRIS Kasir</Text>
            </View>
          </View>

          {/* Rekomendasi Utama Asesor Kuliner */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              🍽️ <Text style={{ fontWeight: "bold" }}>Rapor Higiene & Bisnis:</Text>{" "}
              {item.rekomendasiAsesor}
            </Text>
          </View>

          {/* Tombol Aksi Detail Evaluasi */}
          <View style={styles.cardActionRow}>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push(`/umkm/${item.id}` as any)}
            >
              <Text style={styles.actionButtonText}>Lihat Audit Lengkap</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  // =========================================================================
  // HEADER BAGIAN ATAS LAYAR
  // =========================================================================
  const renderHeader = () => (
    <View>
      {/* 1. Header App Bar */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>KulinerCheck UMKM v1.0</Text>
          </View>

          {/* Tombol Cepat Auth & Admin */}
          <View style={styles.authButtonsRow}>
            <Pressable
              style={styles.authBtn}
              onPress={() => router.push("/(auth)/login" as any)}
            >
              <Ionicons name="person-circle-outline" size={16} color="#ffffff" />
              <Text style={styles.authBtnText}>Masuk</Text>
            </Pressable>

            <Pressable
              style={styles.authBtn}
              onPress={() => router.push("/(admin)/kelola" as any)}
            >
              <Ionicons name="shield-checkmark-outline" size={16} color="#ffffff" />
              <Text style={styles.authBtnText}>Asesor</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.headerTitle}>Penilaian Bisnis Kuliner UMKM</Text>
        <Text style={styles.headerSubtitle}>
          Sistem Evaluasi Higiene, Kelayakan Finansial & Legalitas Usaha Makanan Minuman
        </Text>
      </View>

      {/* 2. Ringkasan Metrik (KPI Cards) */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="fast-food-outline" size={20} color="#2563eb" />
          <Text style={styles.statValue}>{stats.totalUMKM}</Text>
          <Text style={styles.statLabel}>Gerai Terdata</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="stats-chart-outline" size={20} color="#10b981" />
          <Text style={styles.statValue}>{stats.rataRataSkor}/100</Text>
          <Text style={styles.statLabel}>Rata-rata Skor</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="shield-checkmark" size={20} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.jumlahLayak}</Text>
          <Text style={styles.statLabel}>Siap Modal & KUR</Text>
        </View>
      </View>

      {/* 3. Search Bar (Komponen TextInput Modul 1) */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Cari kedai, produk kuliner, atau kota..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </Pressable>
        )}
      </View>

      {/* 4. Filter Kategori Kuliner (Kriteria: Looping .map()) */}
      <View style={styles.categoryScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={KATEGORI_KULINER_LIST}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryChip,
                  isSelected && { backgroundColor: "#1e3a8a" }, // Inline Style
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && { color: "#ffffff" }, // Inline Style
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* 5. Judul List Section */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Daftar Hasil Audit Kuliner</Text>
        <Text style={styles.sectionCount}>
          Menampilkan {filteredUMKM.length} dari {DAFTAR_UMKM_KULINER.length} gerai
        </Text>
      </View>
    </View>
  );

  // =========================================================================
  // FOOTER BAGIAN BAWAH LAYAR
  // =========================================================================
  const renderFooter = () => (
    <View>
      {/* Panel Simulasi Cek Cepat Kelayakan Kuliner */}
      <View style={styles.simulationBox}>
        <Text style={styles.simulationTitle}>⚡ Simulasi Kelayakan Bisnis Kuliner</Text>
        <Text style={styles.simulationSubtitle}>
          Uji estimasi kelayakan permodalan dan kesiapan izin P-IRT/Halal
        </Text>

        <TextInput
          placeholder="Omzet bulanan (contoh: 25000000)"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={simOmzet}
          onChangeText={setSimOmzet}
          style={styles.simInput}
        />

        <TextInput
          placeholder="Kapasitas porsi per hari (contoh: 150)"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={simPorsi}
          onChangeText={setSimPorsi}
          style={styles.simInput}
        />

        <Pressable style={styles.simButton} onPress={hitungSimulasiKuliner}>
          <Text style={styles.simButtonText}>Hitung Prediksi Kelayakan</Text>
        </Pressable>

        {simHasil && (
          <View style={styles.simResultBox}>
            <Text style={styles.simResultText}>{simHasil}</Text>
          </View>
        )}
      </View>

      {/* Navigasi Cepat Halaman Lain */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e2e8f0",
          }}
          onPress={() => router.push("/evaluasi" as any)}
        >
          <Ionicons name="create-outline" size={20} color="#059669" />
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#334155", marginTop: 4 }}>
            Audit Baru
          </Text>
        </Pressable>

        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e2e8f0",
          }}
          onPress={() => router.push("/docs/halal" as any)}
        >
          <Ionicons name="book-outline" size={20} color="#2563eb" />
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#334155", marginTop: 4 }}>
            Panduan SOP
          </Text>
        </Pressable>

        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e2e8f0",
          }}
          onPress={() => router.push("/about" as any)}
        >
          <Ionicons name="people-outline" size={20} color="#7c3aed" />
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#334155", marginTop: 4 }}>
            Profil Tim
          </Text>
        </Pressable>
      </View>

      {/* Informasi Kelompok Pengembang (Sesuai Syarat Modul) */}
      <View style={styles.footerBox}>
        <Text style={styles.footerText}>Praktikum Pemrograman Mobile</Text>
        <Text style={styles.footerSubtext}>
          Laboratorium Informatika • Universitas Muhammadiyah Malang
        </Text>
      </View>
    </View>
  );

  // =========================================================================
  // 4. LOOPING UTAMA (Kriteria: Looping dengan FlatList)
  // =========================================================================
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUMKM}
        keyExtractor={(item) => item.id}
        renderItem={renderUMKMCard}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 30, alignItems: "center" }}>
            <Ionicons name="restaurant-outline" size={48} color="#94a3b8" />
            <Text style={{ marginTop: 12, color: "#64748b", fontSize: 14 }}>
              Tidak ada usaha kuliner yang cocok dengan filter pencarian.
            </Text>
          </View>
        }
      />
    </View>
  );
}
