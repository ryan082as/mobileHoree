import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={localStyles.container} contentContainerStyle={localStyles.content}>
      {/* Header Info */}
      <View style={localStyles.headerCard}>
        <Ionicons name="restaurant" size={48} color="#2563eb" />
        <Text style={localStyles.title}>KulinerCheck UMKM</Text>
        <Text style={localStyles.version}>Versi 1.0.0 (Modul 1-6 Architecture)</Text>
        <Text style={localStyles.desc}>
          Aplikasi Sistem Penilaian Kelayakan & Standar Higiene Bisnis Kuliner UMKM
          untuk mendukung kemandirian usaha dan akses pembiayaan KUR.
        </Text>
      </View>

      {/* Profil Tim Pengembang (3 Anggota Sesuai Syarat Modul) */}
      <View style={localStyles.sectionCard}>
        <Text style={localStyles.sectionTitle}>👥 Tim Pengembang (Kelompok)</Text>
        <View style={localStyles.memberItem}>
          <Text style={localStyles.memberName}>1. Anggota 1 (Frontend & UI/UX)</Text>
          <Text style={localStyles.memberNim}>NIM: 202610370311xxx</Text>
        </View>
        <View style={localStyles.memberItem}>
          <Text style={localStyles.memberName}>2. Anggota 2 (Logic & State Management)</Text>
          <Text style={localStyles.memberNim}>NIM: 202610370311xxx</Text>
        </View>
        <View style={localStyles.memberItem}>
          <Text style={localStyles.memberName}>3. Anggota 3 (Database & API Integration)</Text>
          <Text style={localStyles.memberNim}>NIM: 202610370311xxx</Text>
        </View>
      </View>

      {/* Tombol Kembali */}
      <Pressable style={localStyles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={18} color="#ffffff" />
        <Text style={localStyles.backBtnText}>Kembali ke Dashboard</Text>
      </Pressable>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },
  headerCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#0f172a", marginTop: 8 },
  version: { fontSize: 12, color: "#64748b", marginTop: 4 },
  desc: { fontSize: 13, color: "#475569", textAlign: "center", marginTop: 12, lineHeight: 18 },
  sectionCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b", marginBottom: 12 },
  memberItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  memberName: { fontSize: 13, fontWeight: "600", color: "#0f172a" },
  memberNim: { fontSize: 12, color: "#64748b", marginTop: 2 },
  backBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  backBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
