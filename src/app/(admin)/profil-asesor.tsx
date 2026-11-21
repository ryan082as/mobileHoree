import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { getUMKMMilikUser } from "@/services/umkmService";
import { UMKMKulinerData } from "@/types/umkm";
import { styles } from "@/styles/profilStyles";

export default function ProfilAsesorScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [ownedStores, setOwnedStores] = useState<UMKMKulinerData[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      getUMKMMilikUser(user.id)
        .then((stores) => setOwnedStores(stores))
        .catch(() => setOwnedStores([]));
    }, [user?.id])
  );

  const isStoreOwner = ownedStores.length > 0;
  const namaLengkap =
    user?.user_metadata?.nama_lengkap || user?.email?.split("@")[0] || "Pengguna petaRasa";
  const roleLabel = isStoreOwner
    ? "Pemilik Gerai UMKM Kuliner"
    : "Pengguna / Non-Pemilik UMKM";

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
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name={isStoreOwner ? "storefront" : "person"} size={34} color="#ffffff" />
        </View>

        <Text style={styles.name}>{namaLengkap}</Text>
        <Text style={styles.role}>{roleLabel}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {isStoreOwner && (
          <Text style={[styles.email, { marginTop: 4, color: "#1E6B56", fontWeight: "700" }]}>
            Toko Terhubung: {ownedStores.map((s) => s.namaUsaha).join(", ")}
          </Text>
        )}

        <View
          style={{
            marginTop: 10,
            backgroundColor: "#F4F4F4",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 10, color: "#74787C" }}>UID: {user?.id || "-"}</Text>
        </View>

        <View style={styles.divider} />

        {isStoreOwner ? (
          <Pressable
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#EEF9F5",
              borderColor: "#52B79B",
              borderWidth: 1,
              paddingVertical: 11,
              borderRadius: 8,
              gap: 8,
              marginBottom: 14,
            }}
            onPress={() => router.push("/(admin)/kelola")}
          >
            <Ionicons name="storefront-outline" size={17} color="#1E6B56" />
            <Text style={{ color: "#1E6B56", fontWeight: "700", fontSize: 13 }}>
              Kelola Toko & Menu Saya
            </Text>
          </Pressable>
        ) : (
          <View
            style={{
              width: "100%",
              backgroundColor: "#EEF9F5",
              borderColor: "#C1EBDE",
              borderWidth: 1,
              borderRadius: 10,
              padding: 12,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 12, color: "#1E6B56", lineHeight: 17, textAlign: "center" }}>
              <Text style={{ fontWeight: "bold" }}>Ingin mendaftarkan toko UMKM Anda? </Text>
              Hubungi Admin petaRasa dengan menyertakan email atau UID Anda di atas agar akun ini
              dihubungkan ke toko Anda di database.
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.logoutBtn, loggingOut && { opacity: 0.65 }]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="log-out-outline" size={18} color="#ffffff" />
          )}
          <Text style={styles.logoutText}>
            {loggingOut ? "Mengeluarkan..." : "Keluar dari Akun (Logout)"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
