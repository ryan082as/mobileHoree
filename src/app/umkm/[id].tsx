import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getUMKMById, getUlasanByGeraiId } from "@/services/umkmService";
import { UMKMKulinerData } from "@/types/umkm";
import { UlasanKuliner } from "@/types/ulasan";
import { styles } from "@/styles/detailStyles";

export default function DetailAuditScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    (insets.top || (Platform.OS === "android" ? (StatusBar.currentHeight || 24) : 0)) + 16,
    52
  );

  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const router = useRouter();

  const [gerai, setGerai] = useState<UMKMKulinerData | null>(null);
  const [ulasanList, setUlasanList] = useState<UlasanKuliner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTab = tab || "menu";

  useEffect(() => {
    function loadData() {
      if (!id) return;
      setIsLoading(true);
      setErrorMessage(null);

      // Mengambil detail gerai & ulasan secara paralel dengan Promise.all() dan .then()
      Promise.all([getUMKMById(id), getUlasanByGeraiId(id)])
        .then(([place, reviews]) => {
          if (place) {
            setGerai(place);
          } else {
            setErrorMessage("Data gerai tidak ditemukan pada respon API.");
          }
          setUlasanList(reviews);
        })
        .catch((err: any) => {
          console.error("Gagal memuat detail gerai:", err);
          setErrorMessage(err.message || "Gagal menghubungi API eksternal.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    loadData();
  }, [id]);

  const menuList = gerai?.menuPopuler || [];

  const rataRataRating =
    ulasanList.length > 0
      ? (
          ulasanList.reduce((acc, curr) => acc + curr.ratingBintang, 0) / ulasanList.length
        ).toFixed(1)
      : "5.0";

  const handleKembali = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const gantiTab = (namaTab: string) => {
    router.setParams({ tab: namaTab });
  };

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

  const formatRupiah = (nominal: number): string => {
    return "Rp " + nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", paddingTop: topPadding }]}>
        <ActivityIndicator size="large" color="#52B79B" />
        <Text style={{ marginTop: 12, color: "#74787C", fontSize: 13 }}>
          Memuat detail gerai & menu dari API...
        </Text>
      </View>
    );
  }

  if (errorMessage || !gerai) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 24, paddingTop: topPadding }]}>
        <Ionicons name="alert-circle-outline" size={54} color="#ef4444" />
        <Text style={{ marginTop: 12, color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>
          Gangguan Memuat Data API
        </Text>
        <Text style={{ marginTop: 6, color: "#74787C", fontSize: 13, textAlign: "center", maxWidth: 360, lineHeight: 18 }}>
          {errorMessage || "Data gerai kuliner tidak ditemukan di server API."}
        </Text>
        <Pressable
          style={[styles.backButton, { marginTop: 20, alignSelf: "center" }]}
          onPress={handleKembali}
        >
          <Ionicons name="arrow-back" size={18} color="#28735F" />
          <Text style={styles.backText}>Kembali ke Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: gerai.fotoUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <Pressable
          style={styles.floatingBackButton}
          onPress={handleKembali}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={20} color="#28735F" />
        </Pressable>
      </View>

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

                <Text style={styles.reviewContent}>{rev.isiUlasan}</Text>

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
