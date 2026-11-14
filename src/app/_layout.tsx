import React from 'react';
import { Stack } from 'expo-router';

// Kriteria Modul 2: Penerapan _layout.tsx dan <Stack.Screen> (Hal 30-31, 40, 43)
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E6B56', // Hijau toska gelap (sebelumnya #74787C abu-abu)
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#F4F4F4', // Warna Mercury tema FlipPlay
        },
      }}
    >
      {/* 1. Halaman Utama / Dashboard (Header custom di dalam index) */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'petaRasa',
        }}
      />

      {/* 2. Dynamic Route Halaman Detail UMKM ([id].tsx) */}
      <Stack.Screen
        name="umkm/[id]"
        options={{
          headerShown: false,
          title: 'Detail Gerai Kuliner',
        }}
      />

      {/* 3. Catch-All Route: Dokumentasi & Regulasi SOP (docs/[...slug].tsx) */}
      <Stack.Screen
        name="docs/[...slug]"
        options={{
          title: 'Panduan Regulasi & SOP',
          headerBackTitle: 'Beranda',
        }}
      />

      {/* 6. Normal Page: Halaman Profil Tim (about.tsx) */}
      <Stack.Screen
        name="about"
        options={{
          title: 'Profil Tim Pengembang',
          headerBackTitle: 'Beranda',
        }}
      />
    </Stack>
  );
}
