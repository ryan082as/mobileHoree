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
        <Ionicons name="restaurant" size={44} color="#52B79B" />
        <Text style={localStyles.title}>petaRasa UMKM</Text>
        <Text style={localStyles.version}>Versi 2.0.0 — Modul 2 Praktikum Pemrograman Mobile</Text>
        <Text style={localStyles.desc}>
          Petunjuk Pasti Kuliner Pilihan: Aplikasi Sistem Penilaian Kelayakan & Standar Higiene Bisnis Kuliner UMKM
          di lingkungan sekitar Kampus UMM dan Malang Raya.
        </Text>
      </View>

      {/* Profil Tim Pengembang (3 Anggota Sesuai Syarat Modul) */}
      <View style={localStyles.sectionCard}>
        <Text style={localStyles.sectionTitle}>👥 Tim Pengembang (Kelompok)</Text>
        <View style={localStyles.memberItem}>
          <Text style={localStyles.memberName}>1. Anggota 1 (Frontend & UI/UX)</Text>
          <Text style={localStyles.memberNim}>NIM: 202410370110475</Text>
        </View>
        <View style={localStyles.memberItem}>
          <Text style={localStyles.memberName}>2. Anggota 2 (Logic & State Management)</Text>
          <Text style={localStyles.memberNim}>NIM: 202410370110458</Text>
        </View>
        <View style={localStyles.memberItem}>
          <Text style={localStyles.memberName}>3. Anggota 3 (Database & API Integration)</Text>
          <Text style={localStyles.memberNim}>NIM: 202410370110082</Text>
        </View>
      </View>

      {/* Tombol Kembali */}
      <Pressable
        style={localStyles.backBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Ionicons name="arrow-back" size={18} color="#ffffff" />
        <Text style={localStyles.backBtnText}>Kembali ke Dashboard</Text>
      </Pressable>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F4" },
  content: { padding: 16, maxWidth: 500, alignSelf: "center", width: "100%" },
  headerCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#2C3033", marginTop: 8 },
  version: { fontSize: 12, color: "#74787C", marginTop: 4, textAlign: "center" },
  desc: { fontSize: 13, color: "#74787C", textAlign: "center", marginTop: 12, lineHeight: 18 },
  sectionCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#2C3033", marginBottom: 12 },
  memberItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E2E4E6" },
  memberName: { fontSize: 13, fontWeight: "600", color: "#2C3033" },
  memberNim: { fontSize: 12, color: "#74787C", marginTop: 2 },
  backBtn: {
    flexDirection: "row",
    backgroundColor: "#52B79B",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  backBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
