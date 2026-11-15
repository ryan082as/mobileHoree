import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { parseMenuDeeplink } from "@/utils/deeplink";

export default function NotFoundScreen() {
  const pathname = usePathname();
  const router = useRouter();

  // Pada platform Web, tangani alias URL lama seperti /sop/higienitas atau /tim
  useEffect(() => {
    if (!pathname || pathname === "/not-found" || pathname === "/+not-found") {
      return;
    }
    const resolution = parseMenuDeeplink(pathname);
    if (resolution.matched && !resolution.notFound && resolution.targetPath !== pathname) {
      router.replace(resolution.targetWithQuery as never);
    }
  }, [pathname, router]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="alert-circle-outline" size={46} color="#D97706" />
        <Text style={styles.title}>Halaman Tidak Ditemukan</Text>
        <Text style={styles.desc}>
          Tautan "{pathname}" tidak dikenali atau belum terdaftar di petaRasa.
        </Text>

        <View style={styles.actions}>
          <Pressable style={styles.primaryBtn} onPress={() => router.replace("/")}>
            <Ionicons name="home-outline" size={16} color="#ffffff" />
            <Text style={styles.primaryBtnText}>Kembali ke Beranda</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={() => router.replace("/docs/halal")}>
            <Text style={styles.secondaryBtnText}>Buka Panduan SOP</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={() => router.replace("/about")}>
            <Text style={styles.secondaryBtnText}>Buka Profil Tim</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E4E6",
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2C3033" },
  desc: { fontSize: 13, color: "#74787C", textAlign: "center", lineHeight: 19 },
  actions: { width: "100%", gap: 8, marginTop: 8 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1E6B56",
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E6F4F1",
    borderWidth: 1,
    borderColor: "#B8E3D8",
  },
  secondaryBtnText: { color: "#1E6B56", fontWeight: "600", fontSize: 13 },
});
