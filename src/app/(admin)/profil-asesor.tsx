import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/profilStyles";

export default function ProfilAsesorScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => {
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
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
