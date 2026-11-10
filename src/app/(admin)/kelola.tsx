import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getDaftarUMKM, deleteUMKMLokal } from "@/services/umkmService";
import { UMKMKulinerData } from "@/types/umkm";
import { styles } from "@/styles/kelolaStyles";

export default function KelolaUMKMAdminScreen() {
  const router = useRouter();
  const [dataList, setDataList] = useState<UMKMKulinerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setIsLoading(true);
    setErrorMessage(null);

    getDaftarUMKM()
      .then((list) => {
        setDataList(list);
      })
      .catch((err: any) => {
        console.error(err);
        setErrorMessage(err.message || "Gagal memuat data dari API eksternal.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleHapus = (item: UMKMKulinerData) => {
    Alert.alert("Konfirmasi", `Yakin ingin menghapus data ${item.namaUsaha}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await deleteUMKMLokal(item.id);
          setDataList((prev) => prev.filter((d) => d.id !== item.id));
          Alert.alert("Terhapus", "Data berhasil dihapus.");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Panel Asesor / Admin</Text>
        <Text style={styles.subtitle}>Kelola Data Gerai Kuliner (Live OpenStreetMap & TheMealDB)</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#52B79B" />
          <Text style={styles.loadingText}>Memuat daftar gerai...</Text>
        </View>
      ) : errorMessage ? (
        <View style={{ padding: 30, alignItems: "center" }}>
          <Ionicons name="cloud-offline-outline" size={54} color="#ef4444" />
          <Text style={{ marginTop: 12, color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>
            Gangguan API Eksternal
          </Text>
          <Text style={{ marginTop: 6, color: "#74787C", fontSize: 13, textAlign: "center", maxWidth: 350, lineHeight: 18 }}>
            {errorMessage}
          </Text>
          <Pressable
            style={{
              marginTop: 18,
              backgroundColor: "#52B79B",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
            onPress={loadData}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 13 }}>
              Coba Lagi
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.namaUsaha}</Text>
                <Text style={styles.itemSub}>{item.kategori} • Skor: {item.skorTotal}</Text>
              </View>
              <View style={styles.actionBtns}>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => Alert.alert("Edit Data", `Edit data ${item.namaUsaha} (Modul 3-4).`)}
                >
                  <Ionicons name="pencil" size={16} color="#ffffff" />
                </Pressable>
                <Pressable style={styles.delBtn} onPress={() => handleHapus(item)}>
                  <Ionicons name="trash" size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
