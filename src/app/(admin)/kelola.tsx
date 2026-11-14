import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DAFTAR_UMKM_KULINER } from "@/data/umkmData";

export default function KelolaUMKMAdminScreen() {
  const router = useRouter();

  const handleHapus = (nama: string) => {
    Alert.alert("Konfirmasi", `Yakin ingin menghapus data ${nama}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => Alert.alert("Terhapus", "Data berhasil dihapus.") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Panel Asesor / Admin</Text>
        <Text style={styles.subtitle}>Kelola Data Gerai Kuliner & Hasil Audit (CRUD)</Text>
      </View>

      <FlatList
        data={DAFTAR_UMKM_KULINER}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.namaUsaha}</Text>
              <Text style={styles.itemSub}>{item.kategori} • Skor: {item.skorTotal}</Text>
            </View>
            <View style={styles.actionBtns}>
              <Pressable
                style={styles.editBtn}
                onPress={() => Alert.alert("Edit Data", `Edit data ${item.namaUsaha} (Modul 3-4).`)}
              >
                <Ionicons name="pencil" size={16} color="#ffffff" />
              </Pressable>
              <Pressable style={styles.delBtn} onPress={() => handleHapus(item.namaUsaha)}>
                <Ionicons name="trash" size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  subtitle: { fontSize: 12, color: "#64748b", marginTop: 2 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  itemName: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  itemSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  actionBtns: { flexDirection: "row", gap: 8 },
  editBtn: { backgroundColor: "#2563eb", padding: 8, borderRadius: 8 },
  delBtn: { backgroundColor: "#ef4444", padding: 8, borderRadius: 8 },
});
