import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/styles/aboutStyles";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Ionicons name="restaurant" size={44} color="#52B79B" />
        <Text style={styles.title}>petaRasa UMKM</Text>
        <Text style={styles.version}>Versi 2.0.0 — Modul 2 Praktikum Pemrograman Mobile</Text>
        <Text style={styles.desc}>
          Petunjuk Pasti Kuliner Pilihan: Aplikasi Sistem Penilaian Kelayakan & Standar Higiene Bisnis Kuliner UMKM
          di lingkungan sekitar Kampus UMM dan Malang Raya.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>👥 Tim Pengembang (Kelompok)</Text>
        <View style={styles.memberItem}>
          <Text style={styles.memberName}>1. Anggota 1 (Frontend & UI/UX)</Text>
          <Text style={styles.memberNim}>NIM: 202410370110475</Text>
        </View>
        <View style={styles.memberItem}>
          <Text style={styles.memberName}>2. Anggota 2 (Logic & State Management)</Text>
          <Text style={styles.memberNim}>NIM: 202410370110458</Text>
        </View>
        <View style={styles.memberItem}>
          <Text style={styles.memberName}>3. Anggota 3 (Database & API Integration)</Text>
          <Text style={styles.memberNim}>NIM: 202410370110082</Text>
        </View>
      </View>

      <Pressable
        style={styles.backBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Ionicons name="arrow-back" size={18} color="#ffffff" />
        <Text style={styles.backBtnText}>Kembali ke Dashboard</Text>
      </Pressable>
    </ScrollView>
  );
}
