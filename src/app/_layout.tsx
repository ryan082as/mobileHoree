import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login" as any);
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E6B56",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 10,
            marginBottom: 16,
          }}
        >
          <Image
            source={require("@/assets/images/petarasa-logo.png")}
            style={{ width: 96, height: 76 }}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ color: "#E2F4EE", fontSize: 13, marginTop: 12, fontWeight: "600" }}>
          Memeriksa sesi autentikasi petaRasa...
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E6B56",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#F4F4F4",
        },
      }}
    >
      <Stack.Screen
        name="(auth)/login"
        options={{
          headerShown: false,
          title: "Masuk petaRasa",
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "petaRasa",
        }}
      />

      <Stack.Screen
        name="umkm/[id]"
        options={{
          headerShown: false,
          title: "Detail Gerai Kuliner",
        }}
      />

      <Stack.Screen
        name="(admin)/kelola"
        options={{
          headerShown: false,
          title: "Kelola Gerai UMKM",
        }}
      />

      <Stack.Screen
        name="(admin)/profil-asesor"
        options={{
          headerShown: false,
          title: "Profil Pengguna",
        }}
      />

      <Stack.Screen
        name="evaluasi/index"
        options={{
          headerShown: false,
          title: "Tambah & Audit Gerai",
        }}
      />

      <Stack.Screen
        name="docs/[...slug]"
        options={{
          title: "Panduan Regulasi & SOP",
          headerBackTitle: "Beranda",
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          title: "Profil Tim Pengembang",
          headerBackTitle: "Beranda",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
