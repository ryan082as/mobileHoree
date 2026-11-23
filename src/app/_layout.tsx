import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
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
          backgroundColor: "#489347",
          padding: 24,
        }}
      >
        <StatusBar style="light" />
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: 12,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Image
            source={require("@/assets/images/petarasa-logo.png")}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ color: "#E9F5E8", fontSize: 13, marginTop: 14, fontWeight: "600" }}>
          Memeriksa sesi autentikasi petaRasa...
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#489347",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#F3F7F2",
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
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
