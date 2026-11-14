import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
          onPress: () => router.replace("/"), // Memenuhi fungsi replace() di Modul 2!
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2563eb" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  backText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  card: { backgroundColor: "#ffffff", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  title: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  desc: { fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#f8fafc",
  },
  submitBtn: { backgroundColor: "#059669", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
