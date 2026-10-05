import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilAsesorScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => {
          // Aksi Logout: Navigasi replace ke login
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color="#ffffff" />
        </View>

        <Text style={styles.name}>Budi Santoso, S.E.</Text>
        <Text style={styles.role}>Asesor Kelayakan Bisnis Kuliner</Text>
        <Text style={styles.email}>budi.asesor@gmail.com</Text>

        <View style={styles.divider} />

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ffffff" />
          <Text style={styles.logoutText}>Keluar dari Akun (Logout)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20 },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  card: { backgroundColor: "#ffffff", padding: 24, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#1e3a8a", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  role: { fontSize: 13, color: "#2563eb", fontWeight: "600", marginTop: 2 },
  email: { fontSize: 12, color: "#64748b", marginTop: 4 },
  divider: { width: "100%", height: 1, backgroundColor: "#f1f5f9", marginVertical: 20 },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  logoutText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
