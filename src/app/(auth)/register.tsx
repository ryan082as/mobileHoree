import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [namaUsaha, setNamaUsaha] = useState("");

  const handleRegister = () => {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      Alert.alert("Perhatian", "Wajib menggunakan alamat Gmail!");
      return;
    }
    if (!nama || password.length < 6) {
      Alert.alert("Perhatian", "Lengkapi nama dan sandi minimal 6 karakter.");
      return;
    }

    Alert.alert(
      "Pendaftaran Berhasil",
      `Akun untuk ${nama} (${email}) berhasil didaftarkan! Silakan masuk.`,
      [{ text: "Masuk Sekarang", onPress: () => router.replace("/(auth)/login") }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
        <Text style={styles.backText}>Kembali ke Login</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>Daftar Akun Baru</Text>
        <Text style={styles.subtitle}>
          Daftarkan akun pemilik UMKM kuliner atau asesor penilai.
        </Text>

        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama Anda..."
          value={nama}
          onChangeText={setNama}
        />

        <Text style={styles.label}>Alamat Akun Gmail</Text>
        <TextInput
          style={styles.input}
          placeholder="emailanda@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Nama Usaha Kuliner</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Kopi Nusantara"
          value={namaUsaha}
          onChangeText={setNamaUsaha}
        />

        <Text style={styles.label}>Buat Sandi Aplikasi</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimal 6 karakter"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerBtnText}>Daftar Sekarang</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, justifyContent: "center" },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  card: { backgroundColor: "#ffffff", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  title: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  subtitle: { fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 14, backgroundColor: "#f8fafc" },
  registerBtn: { backgroundColor: "#059669", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
  registerBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
