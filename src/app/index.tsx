import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
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

  // State untuk status autentikasi Login / Logout
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
        bgBadge: "#EEF9F5",
        textBadge: "#28735F",
        barColor: "#52B79B",
        icon: "checkmark-done-circle" as const,
      };
    } else if (skor >= 70) {
      return {
        label: "Cukup Layak",
        bgBadge: "#F0F2F3",
        textBadge: "#53585C",
        barColor: "#74787C",
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
   * Custom Function: Menangani Aksi Login / Logout di Header
   */
  function handleAuthToggle(): void {
    if (isLoggedIn) {
      Alert.alert(
        "Konfirmasi Logout",
        "Apakah Anda yakin ingin keluar dari akun?",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              setIsLoggedIn(false);
              Alert.alert("Berhasil", "Anda telah keluar dari akun.");
            },
          },
        ]
      );
    } else {
      router.push("/(auth)/login" as any);
    }
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
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/umkm/${item.id}` as any)}
      >
        {/* 1. Gambar UMKM */}
        <Image
          source={item.fotoLocal || { uri: item.fotoUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <View style={styles.cardBody}>
          {/* 2. Baris: Nama UMKM (kiri) & Kategori (kanan) */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.namaUsaha}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>kategori: {item.kategori}</Text>
            </View>
          </View>

          {/* 3. Baris: Lokasi */}
          <Text style={styles.lokasiText}>
            lokasi : {item.lokasiKota}
          </Text>

          {/* 4. Baris: Penilaian ⭐ */}
          <View style={styles.penilaianRow}>
            <Text style={styles.penilaianText}>penilaian ⭐</Text>
            {/* Inline Style: Warna badge dinamis sesuai skor kelayakan (Modul 1) */}
            <View
              style={[
                styles.scoreBadgeContainer,
                { backgroundColor: status.bgBadge, marginLeft: 8 },
              ]}
            >
              <Text style={[styles.scoreBadgeText, { color: status.textBadge }]}>
                {item.skorTotal}/100 ({status.label})
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
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
            <Text style={styles.headerBadgeText}>petaRasa</Text>
          </View>

          {/* Tombol Login / Logout */}
          <View style={styles.authButtonsRow}>
            <Pressable
              style={[
                styles.authBtn,
                isLoggedIn && {
                  backgroundColor: "rgba(239, 68, 68, 0.25)",
                  borderColor: "#f87171",
                },
              ]}
              onPress={handleAuthToggle}
            >
              <Ionicons
                name={isLoggedIn ? "log-out-outline" : "log-in-outline"}
                size={16}
                color="#ffffff"
              />
              <Text style={styles.authBtnText}>
                {isLoggedIn ? "Logout" : "Login"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.headerTitle}>petaRasa</Text>
        <Text style={styles.headerSubtitle}>
          Petunjuk Pasti Kuliner Pilihan.
        </Text>
      </View>

      {/* 2. Search Bar (Komponen TextInput Modul 1) */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#74787C" />
        <TextInput
          placeholder="Cari kedai, produk kuliner, atau kota..."
          placeholderTextColor="#9DA1A5"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#74787C" />
          </Pressable>
        )}
      </View>

      {/* 4. Filter Kategori Kuliner (Kriteria: Looping .map() & Key Prop Sesuai Modul 1 Hal 34-37) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {KATEGORI_KULINER_LIST.map((item) => {
          const isSelected = selectedCategory === item;
          return (
            <Pressable
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                isSelected && { backgroundColor: "#52B79B" }, // Kriteria: Inline Style
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && { color: "#ffffff" }, // Kriteria: Inline Style
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
    <View style={styles.footerBox}>
      <Text style={styles.footerText}>Praktikum Pemrograman Mobile</Text>
      <Text style={styles.footerSubtext}>
        Laboratorium Informatika • Universitas Muhammadiyah Malang
      </Text>
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
            <Ionicons name="restaurant-outline" size={48} color="#9DA1A5" />
            <Text style={{ marginTop: 12, color: "#74787C", fontSize: 14 }}>
              Tidak ada usaha kuliner yang cocok dengan filter pencarian.
            </Text>
          </View>
        }
      />
    </View>
  );
}
