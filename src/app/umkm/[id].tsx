import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DAFTAR_UMKM_KULINER } from "@/data/umkmData";
import { DAFTAR_ULASAN_KULINER } from "@/data/ulasanData";

export default function DetailAuditScreen() {
  const insets = useSafeAreaInsets();
  // Safe area padding agar tombol tidak tertutup status bar / notch di handphone
  const topPadding = Math.max(
    (insets.top || (Platform.OS === "android" ? (StatusBar.currentHeight || 24) : 0)) + 16,
    52
  );

  // Kriteria Modul 2: useLocalSearchParams() untuk membaca parameter URL dinamis (Hal 21-22)
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const router = useRouter();

  // State tab lokal yang tersinkronisasi dengan query parameter (default: "menu")
  const activeTab = tab || "menu";

  // Cari data kuliner berdasarkan ID dari dynamic route
  const gerai = DAFTAR_UMKM_KULINER.find((item) => item.id === id) || DAFTAR_UMKM_KULINER[0];

  // Daftar menu populer untuk gerai ini
  const menuList = gerai.menuPopuler || [];

  // Daftar ulasan pengguna untuk gerai ini
  const ulasanList = DAFTAR_ULASAN_KULINER.filter((rev) => rev.geraiId === gerai.id);

  // Hitung rata-rata rating ulasan
  const rataRataRating =
    ulasanList.length > 0
      ? (
          ulasanList.reduce((acc, curr) => acc + curr.ratingBintang, 0) / ulasanList.length
        ).toFixed(1)
      : "5.0";

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

  // Helper render rating bintang
  const renderStars = (rating: number) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={13}
          color="#F59E0B"
        />
      ))}
    </View>
  );

  // Helper format rupiah
  const formatRupiah = (nominal: number): string => {
    return "Rp " + nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Tombol Kembali (Dibuat agak ke bawah dan mudah dipencet) */}
      <Pressable
        style={styles.backButton}
        onPress={handleKembali}
        hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      >
        <Ionicons name="arrow-back" size={18} color="#28735F" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      {/* =========================================================================
          1. GAMBAR RESTORAN (Sesuai Struktur Sketsa: Bagian Atas)
          ========================================================================= */}
      <Image
        source={gerai.fotoLocal || { uri: gerai.fotoUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      {/* =========================================================================
          2. NAMA RESTORAN, LOKASI, KATEGORI, TAHUN BERDIRI (Sesuai Struktur: Bagian Tengah)
          ========================================================================= */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{gerai.namaUsaha}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{gerai.kategori}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-sharp" size={15} color="#52B79B" style={styles.infoIcon} />
          <Text style={styles.lokasiText}>{gerai.lokasiKota}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={15} color="#74787C" style={styles.infoIcon} />
          <Text style={styles.founded}>Berdiri sejak tahun: {gerai.tahunBerdiri}</Text>
        </View>
      </View>

      {/* =========================================================================
          3. MENU POPULER & ULASAN PENGGUNA (Sesuai Struktur Sketsa: Bagian Bawah)
          ========================================================================= */}
      {/* Tab Switcher menggunakan router.setParams() (Kriteria Modul 2 Hal 38) */}
      <View style={styles.tabSwitchContainer}>
        <Pressable
          style={[styles.tabSwitchBtn, activeTab === "menu" && styles.tabSwitchBtnActive]}
          onPress={() => gantiTab("menu")}
        >
          <Text style={[styles.tabSwitchText, activeTab === "menu" && styles.tabSwitchTextActive]}>
            🍽️ Menu Populer ({menuList.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabSwitchBtn, activeTab === "ulasan" && styles.tabSwitchBtnActive]}
          onPress={() => gantiTab("ulasan")}
        >
          <Text style={[styles.tabSwitchText, activeTab === "ulasan" && styles.tabSwitchTextActive]}>
            ⭐ Ulasan ({ulasanList.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabSwitchBtn, activeTab === "semua" && styles.tabSwitchBtnActive]}
          onPress={() => gantiTab("semua")}
        >
          <Text style={[styles.tabSwitchText, activeTab === "semua" && styles.tabSwitchTextActive]}>
            📋 Semua
          </Text>
        </Pressable>
      </View>

      {/* --- KONTEN MENU POPULER --- */}
      {(activeTab === "menu" || activeTab === "semua") && (
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>🍽️ Menu Populer</Text>
            <Text style={styles.sectionSubtitle}>{menuList.length} Menu Pilihan</Text>
          </View>

          {menuList.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada data menu populer.</Text>
          ) : (
            menuList.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuList.length - 1 && styles.menuItemLast,
                ]}
              >
                <View style={styles.menuInfo}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuName}>{item.nama}</Text>
                    {item.isFavorit && (
                      <View style={styles.favoritBadge}>
                        <Text style={styles.favoritText}>🔥 Favorit</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.menuDesc}>{item.deskripsi}</Text>
                  <Text style={styles.menuPrice}>{formatRupiah(item.harga)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* --- KONTEN ULASAN PENGGUNA --- */}
      {(activeTab === "ulasan" || activeTab === "semua") && (
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>⭐ Ulasan Pengguna</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingBadgeText}>{rataRataRating} / 5.0</Text>
            </View>
          </View>

          {ulasanList.length === 0 ? (
            <View style={styles.emptyUlasanBox}>
              <Ionicons name="chatbubbles-outline" size={32} color="#9DA1A5" />
              <Text style={styles.emptyText}>Belum ada ulasan untuk gerai ini.</Text>
            </View>
          ) : (
            ulasanList.map((rev, index) => (
              <View
                key={rev.id}
                style={[
                  styles.reviewItem,
                  index === ulasanList.length - 1 && styles.reviewItemLast,
                ]}
              >
                {/* Header Ulasan: Avatar + Nama Pengulas + Bintang + Tanggal */}
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {rev.namaPengulas.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.reviewerName}>{rev.namaPengulas}</Text>
                    <View style={styles.reviewMetaRow}>
                      {renderStars(rev.ratingBintang)}
                      <Text style={styles.reviewDate}>• {rev.tanggalUlasan}</Text>
                    </View>
                  </View>
                </View>

                {/* Teks Ulasan */}
                <Text style={styles.reviewContent}>{rev.isiUlasan}</Text>

                {/* Balasan Resmi Pemilik Gerai (Thread Balasan) */}
                {rev.threadBalasan && rev.threadBalasan.length > 0 && (
                  <View style={styles.replyBox}>
                    {rev.threadBalasan.map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <View style={styles.replyHeader}>
                          <Ionicons name="storefront" size={12} color="#28735F" />
                          <Text style={styles.replySender}>{reply.pengirimNama}</Text>
                        </View>
                        <Text style={styles.replyText}>{reply.teksPesan}</Text>
                        <Text style={styles.replyTime}>{reply.waktuKirim}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E4E6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  backText: {
    color: "#28735F",
    fontWeight: "700",
    fontSize: 13,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3033",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#EEF9F5",
    borderColor: "#C1EBDE",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#3D967D",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  infoIcon: {
    marginRight: 6,
  },
  lokasiText: {
    fontSize: 13,
    color: "#74787C",
    flex: 1,
  },
  founded: {
    fontSize: 12,
    color: "#9DA1A5",
  },

  // Tab Switcher Styles
  tabSwitchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 8,
  },
  tabSwitchBtnActive: {
    backgroundColor: "#52B79B",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabSwitchText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#74787C",
  },
  tabSwitchTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3033",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#74787C",
  },

  // Menu List Styles
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3033",
    flex: 1,
  },
  favoritBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  favoritText: {
    fontSize: 10,
    color: "#E65100",
    fontWeight: "600",
  },
  menuDesc: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 3,
    lineHeight: 17,
  },
  menuPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#52B79B",
    marginTop: 4,
  },

  // Review List Styles
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B45309",
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  reviewItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EEF9F5",
    borderWidth: 1,
    borderColor: "#C1EBDE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28735F",
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2C3033",
  },
  reviewMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewDate: {
    fontSize: 11,
    color: "#9DA1A5",
  },
  reviewContent: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
    marginTop: 4,
  },

  // Thread Reply Styles
  replyBox: {
    marginTop: 8,
    backgroundColor: "#EEF9F5",
    borderColor: "#C1EBDE",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  replyItem: {
    marginTop: 2,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  replySender: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#28735F",
  },
  replyText: {
    fontSize: 12,
    color: "#28735F",
    lineHeight: 17,
  },
  replyTime: {
    fontSize: 10,
    color: "#6FA596",
    marginTop: 3,
  },

  // Empty State Styles
  emptyText: {
    fontSize: 13,
    color: "#9DA1A5",
    textAlign: "center",
    paddingVertical: 12,
  },
  emptyUlasanBox: {
    alignItems: "center",
    paddingVertical: 16,
  },
});
