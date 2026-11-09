import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E6B56',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#F4F4F4',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'petaRasa',
        }}
      />

      <Stack.Screen
        name="umkm/[id]"
        options={{
          headerShown: false,
          title: 'Detail Gerai Kuliner',
        }}
      />

      <Stack.Screen
        name="docs/[...slug]"
        options={{
          title: 'Panduan Regulasi & SOP',
          headerBackTitle: 'Beranda',
        }}
      />

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
