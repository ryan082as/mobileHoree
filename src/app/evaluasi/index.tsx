import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/evaluasiStyles";

/**
 * Halaman informasi bahwa pendaftaran & perubahan profil/skor gerai UMKM
 * dikelola penuh oleh Admin petaRasa melalui database Supabase.
 */
export default function EvaluasiMandiriScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#489347" />
          <Text style={styles.backText}>Kembali ke Dashboard</Text>
        </Pressable>

        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Ionicons name="lock-closed" size={38} color="#489347" />
          </View>
          <Text style={[styles.title, { textAlign: "center" }]}>
            Pendaftaran & Info Gerai Dikelola Admin
          </Text>
          <Text style={[styles.desc, { textAlign: "center", lineHeight: 19, marginTop: 8 }]}>
            Untuk menjaga keaslian profil usaha, foto, kategori, lokasi, dan penilaian audit,
            data gerai UMKM tidak dapat dibuat atau diubah langsung melalui aplikasi.
          </Text>
          <Text style={[styles.desc, { textAlign: "center", lineHeight: 19, marginBottom: 18 }]}>
            Pemilik UMKM dapat menghubungi Admin petaRasa agar akunnya disiapkan dan dihubungkan
            ke toko di database, kemudian cukup login untuk mengelola daftar menu.
          </Text>

          <Pressable style={styles.submitBtn} onPress={() => router.replace("/")}>
            <Text style={styles.submitBtnText}>Kembali ke Beranda</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
