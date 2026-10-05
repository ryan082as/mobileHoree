import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      Alert.alert("Perhatian", "Harap masukkan alamat Gmail yang valid!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Perhatian", "Sandi minimal 6 karakter.");
      return;
    }

    Alert.alert("Login Berhasil", `Selamat datang, ${email}!`, [
      { text: "Lanjut ke Dashboard", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
        <Text style={styles.backText}>Kembali ke Beranda</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="restaurant" size={32} color="#2563eb" />
        </View>

        <Text style={styles.title}>Masuk ke KulinerCheck</Text>
        <Text style={styles.subtitle}>
          Gunakan alamat Gmail Anda dan sandi aplikasi yang telah dibuat.
        </Text>

        <Text style={styles.label}>Akun Gmail</Text>
        <TextInput
          style={styles.input}
          placeholder="contoh@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Sandi Aplikasi</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan sandi..."
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Masuk Sekarang</Text>
        </Pressable>

        <Pressable style={styles.switchRow} onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.switchText}>
            Belum punya akun? <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Daftar di sini</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20, justifyContent: "center" },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  card: { backgroundColor: "#ffffff", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", elevation: 2 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#eff6ff", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  subtitle: { fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 20, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 14, backgroundColor: "#f8fafc" },
  loginBtn: { backgroundColor: "#1e3a8a", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 6 },
  loginBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  switchRow: { marginTop: 16, alignItems: "center" },
  switchText: { fontSize: 13, color: "#64748b" },
});
