import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { signInStarterUmkmIfMatched } from "@/database/migration/seedData";
import { styles } from "@/styles/loginStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const showNotice = (type: "error" | "success", title: string, text: string) => {
    setFeedback({ type, text });
    if (Platform.OS !== "web") {
      Alert.alert(title, text);
    }
  };

  const handleAuth = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = namaLengkap.trim();

    setFeedback(null);

    if (!cleanEmail || !cleanPassword) {
      showNotice("error", "Data Belum Lengkap", "Mohon isi alamat email dan kata sandi Anda.");
      return;
    }

    if (cleanPassword.length < 6) {
      showNotice("error", "Kata Sandi Terlalu Pendek", "Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    if (isRegistering && !cleanName) {
      showNotice("error", "Nama Wajib Diisi", "Mohon isi nama lengkap Anda untuk mendaftar.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              nama_lengkap: cleanName,
              role: "pengguna",
            },
          },
        });

        if (error) {
          showNotice("error", "Pendaftaran Gagal", error.message);
          return;
        }

        if (data.session) {
          router.replace("/");
          return;
        }

        showNotice(
          "success",
          "Pendaftaran Berhasil!",
          "Akun pengguna berhasil didaftarkan. Silakan masuk menggunakan email dan kata sandi Anda."
        );
        setIsRegistering(false);
        setPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          const starterResult = await signInStarterUmkmIfMatched(cleanEmail, cleanPassword);
          if (starterResult === null) {
            router.replace("/");
            return;
          }
          showNotice("error", "Akses Ditolak", starterResult || error.message);
          return;
        }

        router.replace("/");
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      showNotice(
        "error",
        "Gangguan Koneksi",
        err?.message || "Tidak dapat terhubung ke server autentikasi Supabase."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardWrapper}>
            <View style={styles.brandHeader}>
              <View style={styles.logoBox}>
                <Image
                  source={require("@/assets/images/petarasa-logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>AUTENTIKASI SUPABASE</Text>
              </View>
              <Text style={styles.brandTitle}>
                {isRegistering ? "Daftar Akun Pengunjung" : "Masuk ke petaRasa"}
              </Text>
              <Text style={styles.brandSubtitle}>
                {isRegistering
                  ? "Buat akun pengguna untuk menjelajahi gerai kuliner, melihat menu, & memberi ulasan."
                  : "Silakan masuk untuk mengakses daftar gerai & menu kuliner UMKM."}
              </Text>
            </View>

            <View style={styles.formCard}>
              {feedback && (
                <View
                  style={[
                    styles.feedbackBox,
                    feedback.type === "error" ? styles.errorBox : styles.successBox,
                  ]}
                >
                  <Ionicons
                    name={feedback.type === "error" ? "alert-circle" : "checkmark-circle"}
                    size={18}
                    color={feedback.type === "error" ? "#B91C1C" : "#1E6B56"}
                  />
                  <Text
                    style={[
                      styles.feedbackText,
                      feedback.type === "error" ? styles.errorText : styles.successText,
                    ]}
                  >
                    {feedback.text}
                  </Text>
                </View>
              )}

              {isRegistering && (
                <>
                  <Text style={styles.inputLabel}>Nama Lengkap</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color="#74787C" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Contoh: Ahmad Farhan"
                      placeholderTextColor="#9DA1A5"
                      value={namaLengkap}
                      onChangeText={setNamaLengkap}
                      autoCapitalize="words"
                    />
                  </View>
                </>
              )}

              <Text style={styles.inputLabel}>Alamat Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#74787C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="nama@email.com"
                  placeholderTextColor="#9DA1A5"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Text style={styles.inputLabel}>Kata Sandi</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#74787C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#9DA1A5"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#74787C"
                  />
                </Pressable>
              </View>

              <Pressable
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.submitBtnContent}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.submitBtnText}>Memproses...</Text>
                  </View>
                ) : (
                  <View style={styles.submitBtnContent}>
                    <Ionicons
                      name={isRegistering ? "person-add-outline" : "log-in-outline"}
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.submitBtnText}>
                      {isRegistering ? "Daftar Akun Pengguna" : "Masuk ke petaRasa"}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={styles.switchModeBtn}
                onPress={() => {
                  setIsRegistering((prev) => !prev);
                  setFeedback(null);
                }}
              >
                <Text style={styles.switchModeText}>
                  {isRegistering ? "Sudah punya akun? " : "Pengguna baru (Non-Pemilik UMKM)? "}
                  <Text style={styles.switchModeHighlight}>
                    {isRegistering ? "Masuk di sini" : "Daftar di sini"}
                  </Text>
                </Text>
              </Pressable>

              <View
                style={{
                  backgroundColor: "#EEF9F5",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#C1EBDE",
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <Ionicons name="storefront-outline" size={16} color="#1E6B56" style={{ marginTop: 1 }} />
                <Text style={{ flex: 1, fontSize: 11, color: "#1E6B56", lineHeight: 16 }}>
                  <Text style={{ fontWeight: "bold" }}>Pemilik UMKM? </Text>
                  Hubungi Admin petaRasa untuk pembuatan akun yang terhubung dengan toko Anda di
                  database, lalu langsung masuk lewat form Login di atas.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
