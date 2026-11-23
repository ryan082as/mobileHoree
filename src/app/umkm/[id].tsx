import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createUlasan,
  deleteUlasan,
  getUMKMById,
  getUlasanByGeraiId,
  replyToUlasan,
} from "@/services/umkmService";
import { useAuth } from "@/context/AuthContext";
import { EditTokoModal } from "@/components/EditTokoModal";
import { MenuPaginationBar } from "@/components/MenuPaginationBar";
import { usePaginatedMenus } from "@/hooks/use-paginated-menus";
import { UMKMKulinerData } from "@/types/umkm";
import { UlasanKuliner } from "@/types/ulasan";
import { styles } from "@/styles/detailStyles";

export default function DetailAuditScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    (insets.top || (Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0)) + 16,
    52
  );

  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [gerai, setGerai] = useState<UMKMKulinerData | null>(null);
  const [ulasanList, setUlasanList] = useState<UlasanKuliner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const activeTab = tab || "menu";
  const isStoreOwner = Boolean(user?.id && gerai?.userId === user.id && !gerai?.isSeed);
  const {
    items: menuList,
    totalCount: totalMenuCount,
    totalPages: totalMenuPages,
    page: menuPage,
    pageSize: menuPageSize,
    searchQuery: menuSearchQuery,
    loading: loadingMenus,
    setSearchQuery: setMenuSearchQuery,
    goToPage: goToMenuPage,
  } = usePaginatedMenus(id, 25);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);

    Promise.all([getUMKMById(id), getUlasanByGeraiId(id)])
      .then(([place, reviews]) => {
        if (!isMounted) return;
        setGerai(place);
        setUlasanList(reviews);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        console.error("Gagal memuat detail gerai:", err);
        setErrorMessage(err?.message || "Gagal memuat data gerai dari Supabase.");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  const handleKirimUlasan = async () => {
    if (!gerai || !user) return;
    const cleanText = newComment.trim();
    if (!cleanText) {
      if (Platform.OS !== "web") {
        Alert.alert("Perhatian", "Tuliskan komentar ulasan Anda terlebih dahulu.");
      }
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewerName =
        user.user_metadata?.nama_lengkap ||
        user.email?.split("@")[0] ||
        "Pengguna petaRasa";

      const created = await createUlasan({
        geraiId: gerai.id,
        userId: user.id,
        emailPengulas: user.email || "user@petarasa.id",
        namaPengulas: reviewerName,
        ratingBintang: newRating,
        isiUlasan: cleanText,
      });

      setUlasanList((prev) => [created, ...prev]);
      setNewComment("");
      setNewRating(5);
    } catch (err: any) {
      Alert.alert("Gagal Mengirim", err?.message || "Tidak dapat menyimpan ulasan.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHapusUlasan = async (reviewId: string, reviewerName: string) => {
    if (!isStoreOwner) return;

    const executeDelete = async () => {
      const previous = ulasanList;
      setUlasanList((prev) => prev.filter((item) => item.id !== reviewId));
      try {
        await deleteUlasan(reviewId);
      } catch (err: any) {
        setUlasanList(previous);
        Alert.alert("Gagal Menghapus", err?.message || "Tidak memiliki izin menghapus ulasan ini.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window === "undefined" || window.confirm(`Hapus ulasan dari "${reviewerName}"?`)) {
        executeDelete();
      }
      return;
    }

    Alert.alert("Hapus Ulasan", `Yakin ingin menghapus ulasan dari "${reviewerName}"?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: executeDelete },
    ]);
  };

  const handleKirimBalasan = async (reviewId: string) => {
    if (!gerai || !user || !isStoreOwner) return;
    const cleanReply = replyText.trim();
    if (!cleanReply) {
      if (Platform.OS !== "web") {
        Alert.alert("Perhatian", "Tuliskan isi balasan ulasan Anda terlebih dahulu.");
      }
      return;
    }

    setSubmittingReply(true);
    try {
      const updatedReview = await replyToUlasan({
        reviewId,
        pengirimEmail: user.email || "owner@petarasa.id",
        pengirimNama: gerai.namaUsaha,
        teksPesan: cleanReply,
      });

      setUlasanList((prev) =>
        prev.map((item) => (item.id === reviewId ? updatedReview : item))
      );
      setReplyText("");
      setReplyingToId(null);
    } catch (err: any) {
      Alert.alert("Gagal Membalas", err?.message || "Tidak dapat mengirim balasan ulasan.");
    } finally {
      setSubmittingReply(false);
    }
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
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", paddingTop: topPadding },
        ]}
      >
        <ActivityIndicator size="large" color="#489347" />
        <Text style={{ marginTop: 12, color: "#667D66", fontSize: 13 }}>
          Memuat detail gerai & menu dari Supabase...
        </Text>
      </View>
    );
  }

  if (errorMessage || !gerai) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", padding: 24, paddingTop: topPadding },
        ]}
      >
        <Ionicons name="alert-circle-outline" size={54} color="#ef4444" />
        <Text style={{ marginTop: 12, color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>
          Gangguan Memuat Data
        </Text>
        <Text
          style={{
            marginTop: 6,
            color: "#667D66",
            fontSize: 13,
            textAlign: "center",
            maxWidth: 360,
            lineHeight: 18,
          }}
        >
          {errorMessage || "Data gerai kuliner tidak ditemukan di database."}
        </Text>
        <Pressable
          style={[styles.backButton, { marginTop: 20, alignSelf: "center" }]}
          onPress={handleKembali}
        >
          <Ionicons name="arrow-back" size={18} color="#2B702B" />
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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.bannerContainer}>
        <Image
          source={gerai.fotoLocal ? gerai.fotoLocal : { uri: gerai.fotoUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <Pressable
          style={styles.floatingBackButton}
          onPress={handleKembali}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={20} color="#2B702B" />
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
          <Ionicons name="location-sharp" size={15} color="#489347" style={styles.infoIcon} />
          <Text style={styles.lokasiText}>{gerai.lokasiKota}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={15} color="#667D66" style={styles.infoIcon} />
          <Text style={styles.founded}>Berdiri sejak tahun: {gerai.tahunBerdiri}</Text>
        </View>

        {isStoreOwner && (
          <View
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: "#EDF4EC",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 11, color: "#489347", fontWeight: "600", flex: 1 }}>
              Gerai ini terhubung ke akun Anda
            </Text>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#489347",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
              onPress={() => setShowEditModal(true)}
            >
              <Ionicons name="create-outline" size={14} color="#ffffff" />
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#ffffff" }}>
                Edit Info Toko
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.tabSwitchContainer}>
        <Pressable
          style={[styles.tabSwitchBtn, activeTab === "menu" && styles.tabSwitchBtnActive]}
          onPress={() => gantiTab("menu")}
        >
          <Text style={[styles.tabSwitchText, activeTab === "menu" && styles.tabSwitchTextActive]}>
            🍽️ Menu ({totalMenuCount.toLocaleString("id-ID")})
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
            <Text style={styles.sectionSubtitle}>
              {totalMenuCount.toLocaleString("id-ID")} Menu Pilihan
            </Text>
          </View>

          <MenuPaginationBar
            searchQuery={menuSearchQuery}
            onChangeSearch={setMenuSearchQuery}
            page={menuPage}
            pageSize={menuPageSize}
            totalCount={totalMenuCount}
            totalPages={totalMenuPages}
            loading={loadingMenus}
            onPageChange={goToMenuPage}
          />

          {menuList.length === 0 ? (
            <Text style={styles.emptyText}>
              {loadingMenus
                ? "Memuat menu..."
                : menuSearchQuery
                  ? "Tidak ada menu yang cocok dengan pencarian Anda."
                  : "Belum ada data menu untuk gerai ini."}
            </Text>
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

          {isStoreOwner && (
            <View
              style={{
                backgroundColor: "#E9F5E8",
                borderColor: "#C5E6C2",
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="storefront" size={16} color="#489347" />
              <Text style={{ fontSize: 12, color: "#489347", fontWeight: "600", flex: 1 }}>
                Mode Pemilik UMKM: Anda dapat membalas dan menghapus ulasan pada gerai ini.
              </Text>
            </View>
          )}

          <View
            style={{
              backgroundColor: "#F8FAF9",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#D7E7D4",
              padding: 12,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1B331B", marginBottom: 6 }}>
              Tulis Ulasan Baru
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setNewRating(star)}>
                  <Ionicons
                    name={star <= newRating ? "star" : "star-outline"}
                    size={20}
                    color="#F59E0B"
                  />
                </Pressable>
              ))}
              <Text style={{ fontSize: 12, color: "#4A6E4A", marginLeft: 4 }}>
                ({newRating}/5)
              </Text>
            </View>
            <TextInput
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#D7E7D4",
                borderRadius: 8,
                padding: 10,
                fontSize: 13,
                color: "#1B331B",
                marginBottom: 8,
              }}
              placeholder="Bagikan pengalaman rasa & kebersihan gerai..."
              placeholderTextColor="#94A894"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <Pressable
              style={{
                backgroundColor: "#489347",
                borderRadius: 8,
                paddingVertical: 9,
                alignItems: "center",
                opacity: submittingReview ? 0.65 : 1,
              }}
              onPress={handleKirimUlasan}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "bold" }}>
                  Kirim Ulasan
                </Text>
              )}
            </Pressable>
          </View>

          {ulasanList.length === 0 ? (
            <View style={styles.emptyUlasanBox}>
              <Ionicons name="chatbubbles-outline" size={32} color="#94A894" />
              <Text style={styles.emptyText}>Belum ada ulasan untuk gerai ini.</Text>
            </View>
          ) : (
            ulasanList.map((rev, index) => {
              const isReplyingHere = isStoreOwner && replyingToId === rev.id;
              return (
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
                    {isStoreOwner && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Pressable
                          onPress={() => {
                            if (isReplyingHere) {
                              setReplyingToId(null);
                              setReplyText("");
                            } else {
                              setReplyingToId(rev.id);
                              setReplyText("");
                            }
                          }}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor: "#E9F5E8",
                            borderColor: "#C5E6C2",
                            borderWidth: 1,
                            paddingHorizontal: 8,
                            paddingVertical: 5,
                            borderRadius: 6,
                          }}
                        >
                          <Ionicons name="chatbubble-ellipses-outline" size={14} color="#489347" />
                          <Text style={{ fontSize: 11, fontWeight: "700", color: "#489347" }}>
                            Balas
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleHapusUlasan(rev.id, rev.namaPengulas)}
                          style={{ padding: 6 }}
                        >
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        </Pressable>
                      </View>
                    )}
                  </View>

                  <Text style={styles.reviewContent}>{rev.isiUlasan}</Text>

                  {rev.threadBalasan && rev.threadBalasan.length > 0 && (
                    <View style={styles.replyBox}>
                      {rev.threadBalasan.map((reply) => (
                        <View key={reply.id} style={styles.replyItem}>
                          <View style={styles.replyHeader}>
                            <Ionicons name="storefront" size={12} color="#2B702B" />
                            <Text style={styles.replySender}>{reply.pengirimNama}</Text>
                          </View>
                          <Text style={styles.replyText}>{reply.teksPesan}</Text>
                          <Text style={styles.replyTime}>{reply.waktuKirim}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {isReplyingHere && (
                    <View
                      style={{
                        marginTop: 10,
                        backgroundColor: "#F8FAF9",
                        borderColor: "#C5E6C2",
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#489347", marginBottom: 6 }}>
                        Balas sebagai {gerai.namaUsaha}
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "#ffffff",
                          borderWidth: 1,
                          borderColor: "#D7E7D4",
                          borderRadius: 8,
                          padding: 9,
                          fontSize: 12,
                          color: "#1B331B",
                          marginBottom: 8,
                        }}
                        placeholder="Tulis balasan resmi pemilik gerai..."
                        placeholderTextColor="#94A894"
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                      />
                      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
                        <Pressable
                          style={{ paddingHorizontal: 10, paddingVertical: 7 }}
                          onPress={() => {
                            setReplyingToId(null);
                            setReplyText("");
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: "600", color: "#667D66" }}>
                            Batal
                          </Text>
                        </Pressable>
                        <Pressable
                          style={{
                            backgroundColor: "#489347",
                            paddingHorizontal: 12,
                            paddingVertical: 7,
                            borderRadius: 7,
                            opacity: submittingReply ? 0.65 : 1,
                          }}
                          onPress={() => handleKirimBalasan(rev.id)}
                          disabled={submittingReply}
                        >
                          {submittingReply ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <Text style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                              Kirim Balasan
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      )}

      <EditTokoModal
        store={showEditModal && isStoreOwner ? gerai : null}
        userId={user?.id || ""}
        onClose={() => setShowEditModal(false)}
        onUpdated={(updated) => setGerai(updated)}
      />
    </ScrollView>
  );
}
