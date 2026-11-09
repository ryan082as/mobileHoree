import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/evaluasiStyles";

export default function EvaluasiMandiriScreen() {
  const router = useRouter();

  const [namaUsaha, setNamaUsaha] = useState("");
  const [omzet, setOmzet] = useState("");
  const [porsi, setPorsi] = useState("");

  const handleSubmit = () => {
    if (!namaUsaha || !omzet) {
      Alert.alert("Perhatian", "Mohon isi nama usaha dan omzet bulanan!");
      return;
    }

    Alert.alert(
      "Audit Tersimpan",
      `Penilaian untuk ${namaUsaha} berhasil dihitung dan dicatat!`,
      [
        {
          text: "Kembali ke Beranda",
          onPress: () => router.replace("/"),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
        <Text style={styles.backText}>Batal & Kembali</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>📝 Form Penilaian Usaha Kuliner Baru</Text>
        <Text style={styles.desc}>
          Isi indikator berikut untuk menguji kelayakan sertifikasi dan permodalan.
        </Text>

        <Text style={styles.label}>Nama Gerai / Usaha Kuliner</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Kedai Bakso Mas Bro"
          value={namaUsaha}
          onChangeText={setNamaUsaha}
        />

        <Text style={styles.label}>Rata-rata Omzet Bulanan (Rp)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 15000000"
          keyboardType="numeric"
          value={omzet}
          onChangeText={setOmzet}
        />

        <Text style={styles.label}>Kapasitas Porsi per Hari</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 100"
          keyboardType="numeric"
          value={porsi}
          onChangeText={setPorsi}
        />

        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Simpan & Terbitkan Hasil Audit</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
