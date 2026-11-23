import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { getUMKMMilikUser } from "@/services/umkmService";
import { TokenManager } from "@/services/tokenManager";
import { UMKMKulinerData } from "@/types/umkm";
import { styles } from "@/styles/profilStyles";

// Barcode lines generator for realistic ticket rendering (matching Screen 3)
const BARCODE_PATTERN = [
  3, 1, 2, 4, 1, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4,
  1, 2, 1, 3, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 4,
];

export default function ProfilAsesorScreen() {
  const router = useRouter();
  const { user, session, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [ownedStores, setOwnedStores] = useState<UMKMKulinerData[]>([]);
  const [showMemberTicket, setShowMemberTicket] = useState(false);

  // State untuk demonstrasi Persistent Token Manager (expo-secure-store)
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [showFullToken, setShowFullToken] = useState(false);
  const [tokenStatusMessage, setTokenStatusMessage] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      getUMKMMilikUser(user.id)
        .then((stores) => setOwnedStores(stores))
        .catch(() => setOwnedStores([]));

      // Ambil token tersimpan dari SecureStore
      TokenManager.getToken().then((tok) => {
        setStoredToken(tok);
      });
    }, [user?.id])
  );

  // 1. Simpan Token ke SecureStore
  const handleSaveCurrentToken = async () => {
    if (session?.access_token) {
      await TokenManager.saveToken(session.access_token);
      setStoredToken(session.access_token);
      setTokenStatusMessage("Token JWT berhasil disimpan ke SecureStore.");
    } else {
      Alert.alert("Perhatian", "Tidak ada sesi aktif untuk menyimpan token.");
    }
  };

  // 2. Ambil Token dari SecureStore
  const handleFetchToken = async () => {
    const token = await TokenManager.getToken();
    setStoredToken(token);
    setTokenStatusMessage(
      token ? "Token JWT berhasil diambil dari SecureStore." : "SecureStore kosong."
    );
  };

  // 3. Hapus Token dari SecureStore
  const handleDeleteToken = async () => {
    await TokenManager.deleteToken();
    setStoredToken(null);
    setTokenStatusMessage("Token JWT berhasil dihapus dari SecureStore.");
  };

  const isStoreOwner = ownedStores.length > 0;
  const namaLengkap =
    user?.user_metadata?.nama_lengkap || user?.email?.split("@")[0] || "Pengguna petaRasa";
  const displayEmail = user?.email || "pengguna@petarasa.id";

  const performSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.replace("/(auth)/login" as any);
    } catch (err: any) {
      Alert.alert("Gagal Keluar", err?.message || "Terjadi kesalahan saat logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined" ? window.confirm("Apakah Anda yakin ingin keluar?") : true;
      if (confirmed) {
        performSignOut();
      }
      return;
    }

    Alert.alert("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar dari sesi ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: performSignOut,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Area (Lush Green - matches Screen 1 of reference image) */}
        <View style={styles.headerArea}>
          {/* Top navigation row */}
          <View style={styles.headerTopNav}>
            <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
              <Text style={styles.headerBackText}>Kembali</Text>
            </Pressable>

            <View style={styles.headerIconsRight}>
              <Pressable
                style={styles.headerIconBtn}
                onPress={() => setShowMemberTicket(true)}
              >
                <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={styles.headerIconBtn}
                onPress={() => Alert.alert("Notifikasi", "Tidak ada pemberitahuan baru.")}
              >
                <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
                <View style={styles.notifBadgeDot} />
              </Pressable>
            </View>
          </View>

          {/* User profile info */}
          <View style={styles.userInfoRow}>
            <View style={styles.avatarContainer}>
              <Ionicons
                name={isStoreOwner ? "storefront" : "person"}
                size={32}
                color="#489347"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName} numberOfLines={1}>
                {namaLengkap}
              </Text>
              <View style={styles.userBadgeRow}>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeText}>
                    {isStoreOwner ? "MITRA UMKM" : "LEVEL V5"}
                  </Text>
                </View>
                <Text style={styles.roleBadgeText}>
                  {isStoreOwner ? "Pemilik Gerai" : "Asesor Publik"}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Row (matches: 399 Integral, 2 Coupons, 2.6 Wallet in reference) */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>399</Text>
              <Text style={styles.statLabel}>Poin Audit</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {isStoreOwner ? ownedStores.length : "12"}
              </Text>
              <Text style={styles.statLabel}>Gerai Terverifikasi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Reputasi</Text>
            </View>
          </View>

          {/* Silver Member Card (Dark forest green banner matching reference) */}
          <Pressable
            style={styles.memberBannerCard}
            onPress={() => setShowMemberTicket(true)}
          >
            <View style={styles.memberBannerLeft}>
              <View style={styles.memberBannerIcon}>
                <Ionicons name="ribbon" size={16} color="#A8DCA6" />
              </View>
              <View>
                <Text style={styles.memberBannerTitle}>
                  {isStoreOwner ? "Sertifikasi Mitra petaRasa" : "Silver Member petaRasa"}
                </Text>
                <Text style={styles.memberBannerSub}>
                  ID: {user?.id ? user.id.slice(0, 8).toUpperCase() : "GUEST"} • Terdaftar
                </Text>
              </View>
            </View>
            <View style={styles.memberBannerArrow}>
              <Text style={styles.memberBannerCta}>Buka ID</Text>
              <Ionicons name="chevron-forward" size={14} color="#D4F0D2" />
            </View>
          </Pressable>
        </View>

        {/* 2. White Curved Bottom Sheet Container (matches Screen 1 in reference) */}
        <View style={styles.sheetContainer}>
          {/* Section: Menu & Aktivitas (like "My order" in reference) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Menu & Aktivitas</Text>
              <Pressable onPress={() => router.push("/docs/halal")}>
                <Text style={styles.sectionLink}>Semua SOP &gt;</Text>
              </Pressable>
            </View>

            <View style={styles.orderActionsRow}>
              <Pressable
                style={styles.orderActionItem}
                onPress={() => (isStoreOwner ? router.push("/(admin)/kelola") : setShowMemberTicket(true))}
              >
                <View style={styles.orderActionIconBox}>
                  <Ionicons name="storefront" size={20} color="#489347" />
                </View>
                <Text style={styles.orderActionLabel}>
                  {isStoreOwner ? "Toko Saya" : "ID Asesor"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.orderActionItem}
                onPress={() => router.push("/docs/halal")}
              >
                <View style={styles.orderActionIconBox}>
                  <Ionicons name="document-text" size={20} color="#489347" />
                </View>
                <Text style={styles.orderActionLabel}>Standar Halal</Text>
              </Pressable>

              <Pressable
                style={styles.orderActionItem}
                onPress={() => router.push("/docs/higiene")}
              >
                <View style={styles.orderActionIconBox}>
                  <Ionicons name="shield-checkmark" size={20} color="#489347" />
                </View>
                <Text style={styles.orderActionLabel}>Audit Higiene</Text>
              </Pressable>

              <Pressable
                style={styles.orderActionItem}
                onPress={() => router.push("/about")}
              >
                <View style={styles.orderActionIconBox}>
                  <Ionicons name="people" size={20} color="#489347" />
                </View>
                <Text style={styles.orderActionLabel}>Tim Pengembang</Text>
              </Pressable>
            </View>
          </View>

          {/* Section: Layanan Aplikasi (like "My service" grid in reference) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Layanan Aplikasi</Text>
            </View>

            <View style={styles.serviceGrid}>
              <Pressable
                style={styles.serviceItem}
                onPress={() => setShowMemberTicket(true)}
              >
                <View style={styles.serviceIconBox}>
                  <Ionicons name="card-outline" size={20} color="#489347" />
                </View>
                <Text style={styles.serviceLabel}>ID Digital</Text>
              </Pressable>

              <Pressable
                style={styles.serviceItem}
                onPress={() => router.push("/docs/halal")}
              >
                <View style={styles.serviceIconBox}>
                  <Ionicons name="ribbon-outline" size={20} color="#489347" />
                </View>
                <Text style={styles.serviceLabel}>Regulasi Halal</Text>
              </Pressable>

              <Pressable
                style={styles.serviceItem}
                onPress={() => router.push("/docs/bpom")}
              >
                <View style={styles.serviceIconBox}>
                  <Ionicons name="checkmark-done-circle-outline" size={20} color="#489347" />
                </View>
                <Text style={styles.serviceLabel}>BPOM</Text>
              </Pressable>

              <Pressable
                style={styles.serviceItem}
                onPress={() =>
                  Alert.alert(
                    "Hubungi Admin",
                    "Email: admin@petarasa.id\nWhatsApp: +62 812-3456-7890\nLaboratorium Informatika UMM"
                  )
                }
              >
                <View style={styles.serviceIconBox}>
                  <Ionicons name="headset-outline" size={20} color="#489347" />
                </View>
                <Text style={styles.serviceLabel}>Bantuan</Text>
              </Pressable>

              <Pressable
                style={styles.serviceItem}
                onPress={() => router.push("/about")}
              >
                <View style={styles.serviceIconBox}>
                  <Ionicons name="information-circle-outline" size={20} color="#489347" />
                </View>
                <Text style={styles.serviceLabel}>Tentang App</Text>
              </Pressable>

              {isStoreOwner && (
                <Pressable
                  style={styles.serviceItem}
                  onPress={() => router.push("/(admin)/kelola")}
                >
                  <View style={styles.serviceIconBox}>
                    <Ionicons name="create-outline" size={20} color="#489347" />
                  </View>
                  <Text style={styles.serviceLabel}>Edit Menu</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.serviceItem}
                onPress={() =>
                  Alert.alert("Info Akun", `Email: ${displayEmail}\nUID: ${user?.id || "-"}`)
                }
              >
                <View style={styles.serviceIconBox}>
                  <Ionicons name="settings-outline" size={20} color="#489347" />
                </View>
                <Text style={styles.serviceLabel}>Set Akun</Text>
              </Pressable>

              <Pressable style={styles.serviceItem} onPress={handleLogout}>
                <View
                  style={[
                    styles.serviceIconBox,
                    { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
                  ]}
                >
                  <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                </View>
                <Text style={[styles.serviceLabel, { color: "#DC2626" }]}>Keluar</Text>
              </Pressable>
            </View>
          </View>

          {/* Card: Manajemen Token JWT (Expo SecureStore) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="key" size={16} color="#489347" />
                <Text style={styles.sectionTitle}>Token JWT (Expo SecureStore)</Text>
              </View>
              <View
                style={{
                  backgroundColor: storedToken ? "#E9F5E8" : "#FEE2E2",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: storedToken ? "#2B702B" : "#DC2626",
                  }}
                >
                  {storedToken ? "TERSIMPAN" : "KOSONG"}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 11, color: "#667D66", marginBottom: 8, lineHeight: 16 }}>
              Token autentikasi disimpan secara persisten di hardware-encrypted SecureStore perangkat.
            </Text>

            {/* Display token on screen */}
            <View
              style={{
                backgroundColor: "#FAFCF9",
                borderWidth: 1,
                borderColor: "#D7E7D4",
                borderRadius: 12,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#489347" }}>
                  NILAI TOKEN TERSIMPAN:
                </Text>
                {storedToken && (
                  <Pressable onPress={() => setShowFullToken((prev) => !prev)}>
                    <Text style={{ fontSize: 10, color: "#489347", fontWeight: "700" }}>
                      {showFullToken ? "Sembunyikan" : "Tampilkan Semua"}
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  color: storedToken ? "#1B331B" : "#94A894",
                  lineHeight: 16,
                }}
                numberOfLines={showFullToken ? undefined : 2}
                selectable
              >
                {storedToken || "Belum ada token JWT yang tersimpan di SecureStore."}
              </Text>
            </View>

            {tokenStatusMessage ? (
              <Text style={{ fontSize: 10, color: "#489347", marginBottom: 8, fontWeight: "600" }}>
                ℹ️ {tokenStatusMessage}
              </Text>
            ) : null}

            {/* Tombol aksi: Ambil, Simpan, Hapus */}
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#489347",
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={handleFetchToken}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>
                  Ambil Token
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#EBF5EA",
                  borderWidth: 1,
                  borderColor: "#D3E9D0",
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={handleSaveCurrentToken}
              >
                <Text style={{ color: "#2C4C2C", fontSize: 11, fontWeight: "700" }}>
                  Simpan Sesi
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#FEE2E2",
                  borderWidth: 1,
                  borderColor: "#FECACA",
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={handleDeleteToken}
              >
                <Text style={{ color: "#DC2626", fontSize: 11, fontWeight: "700" }}>
                  Hapus Token
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Store Connect Information Banner */}
          {isStoreOwner ? (
            <View style={styles.storeConnectBox}>
              <Text style={styles.storeConnectTitle}>🏪 Gerai Anda Terdaftar</Text>
              <Text style={styles.storeConnectDesc}>
                Gerai: {ownedStores.map((s) => s.namaUsaha).join(", ")}. Anda dapat mengubah profil,
                foto, dan daftar menu gerai Anda melalui menu Kelola Toko.
              </Text>
            </View>
          ) : (
            <View style={styles.storeConnectBox}>
              <Text style={styles.storeConnectTitle}>💡 Pemilik UMKM Kuliner?</Text>
              <Text style={styles.storeConnectDesc}>
                Ingin mendaftarkan kedai kuliner Anda? Hubungi Admin petaRasa untuk sinkronisasi akun
                dan data gerai di database Supabase.
              </Text>
            </View>
          )}

          {/* Logout Button */}
          <Pressable
            style={[styles.logoutBtn, loggingOut && { opacity: 0.65 }]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : (
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            )}
            <Text style={styles.logoutText}>
              {loggingOut ? "Mengeluarkan..." : "Keluar dari Akun (Logout)"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 3. Screen 3 Ticket / Barcode Modal (matches right screen in reference image) */}
      <Modal
        visible={showMemberTicket}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemberTicket(false)}
      >
        <View style={styles.ticketModalOverlay}>
          <View style={styles.ticketCard}>
            {/* Overlapping Floating Avatar */}
            <View style={styles.ticketAvatarFloat}>
              <Ionicons
                name={isStoreOwner ? "storefront" : "person"}
                size={28}
                color="#FFFFFF"
              />
            </View>

            {/* Member Tier Pill */}
            <View style={styles.ticketTierPill}>
              <Text style={styles.ticketTierText}>
                Silver {user?.email ? user.email.slice(0, 3) + "****" + user.email.slice(-7) : "Asesor 180****9873"} &gt;
              </Text>
            </View>

            {/* Stats row inside ticket */}
            <View style={styles.ticketStatsRow}>
              <View style={styles.ticketStatItem}>
                <Text style={styles.ticketStatNum}>399</Text>
                <Text style={styles.ticketStatLabel}>Poin Asesor</Text>
              </View>
              <View style={styles.ticketStatItem}>
                <Text style={styles.ticketStatNum}>2</Text>
                <Text style={styles.ticketStatLabel}>Sertifikat</Text>
              </View>
              <View style={styles.ticketStatItem}>
                <Text style={styles.ticketStatNum}>100%</Text>
                <Text style={styles.ticketStatLabel}>Validasi</Text>
              </View>
            </View>

            {/* Realistic Barcode Graphic (matches reference Screen 3) */}
            <View style={styles.barcodeWrapper}>
              <View style={styles.barcodeLinesContainer}>
                {BARCODE_PATTERN.map((width, idx) => (
                  <View
                    key={idx}
                    style={{
                      width,
                      height: "100%",
                      backgroundColor: idx % 2 === 0 ? "#1B331B" : "transparent",
                    }}
                  />
                ))}
              </View>
              <Text style={styles.barcodeRefreshText}>
                🔄 Diperbarui otomatis setiap 5 detik
              </Text>
            </View>

            <View style={styles.ticketDivider} />

            <Text style={styles.ticketFooterTitle}>Metode verifikasi & audit terintegrasi</Text>

            {/* Partner/Payment Badges */}
            <View style={styles.ticketPartnerBadges}>
              <View style={styles.partnerPill}>
                <Ionicons name="shield-checkmark" size={16} color="#489347" />
              </View>
              <View style={styles.partnerPill}>
                <Ionicons name="ribbon" size={16} color="#FF7A00" />
              </View>
              <View style={styles.partnerPill}>
                <Ionicons name="checkmark-done-circle" size={16} color="#2B5E2A" />
              </View>
            </View>

            {/* Close Button */}
            <Pressable
              style={styles.ticketCloseBtn}
              onPress={() => setShowMemberTicket(false)}
            >
              <Text style={styles.ticketCloseText}>Tutup Kartu Digital</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
