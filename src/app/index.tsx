import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  KategoriKuliner,
  RingkasanStatistikKuliner,
  UMKMKulinerData,
} from "@/types/umkm";
import { getDaftarUMKM, fetchAllUMKMFromAPI } from "@/services/umkmService";
import { styles } from "@/styles/umkmStyles";

const KATEGORI_KULINER_LIST: KategoriKuliner[] = [
  "Semua",
  "Makanan Berat",
  "Minuman & Kopi",
  "Snack & Oleh-oleh",
  "Frozen Food",
  "Bakery & Pastry",
  "Katering",
];

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: KategoriKuliner;
  setSelectedCategory: (cat: KategoriKuliner) => void;
  filteredCount: number;
  totalCount: number;
  onOpenSop: () => void;
  onOpenTeam: () => void;
  onOpenLogin: () => void;
}

function SearchHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredCount,
  totalCount,
  onOpenSop,
  onOpenTeam,
  onOpenLogin,
}: SearchHeaderProps) {
  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.logoCard}>
            <Image
              source={require("@/assets/images/petarasa-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.authButtonsRow}>
            <Pressable style={styles.authBtn} onPress={onOpenSop}>
              <Ionicons name="book-outline" size={14} color="#ffffff" />
              <Text style={styles.authBtnText}>SOP</Text>
            </Pressable>

            <Pressable style={styles.authBtn} onPress={onOpenTeam}>
              <Ionicons name="people-outline" size={14} color="#ffffff" />
              <Text style={styles.authBtnText}>Tim</Text>
            </Pressable>

            <Pressable style={styles.authBtn} onPress={onOpenLogin}>
              <Ionicons name="log-in-outline" size={14} color="#ffffff" />
              <Text style={styles.authBtnText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#74787C" />
        <TextInput
          placeholder="Cari kedai, produk kuliner, atau kota..."
          placeholderTextColor="#9DA1A5"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#74787C" />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {KATEGORI_KULINER_LIST.map((item) => {
          const isSelected = selectedCategory === item;
          return (
            <Pressable
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                isSelected && { backgroundColor: "#52B79B" },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && { color: "#ffffff" },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Daftar Hasil Audit Kuliner</Text>
        <Text style={styles.sectionCount}>
          Menampilkan {filteredCount} dari {totalCount} gerai
        </Text>
      </View>
    </View>
  );
}

function ListFooter() {
  return (
    <View style={styles.footerBox}>
      <Text style={styles.footerText}>Praktikum Pemrograman Mobile</Text>
      <Text style={styles.footerSubtext}>
        Laboratorium Informatika • Universitas Muhammadiyah Malang
      </Text>
    </View>
  );
}

export default function Index() {
  const router = useRouter();

  const [allUMKM, setAllUMKM] = useState<UMKMKulinerData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<KategoriKuliner>("Semua");
  const [filteredUMKM, setFilteredUMKM] = useState<UMKMKulinerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData(forceRefresh = false) {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    const apiPromise = forceRefresh ? fetchAllUMKMFromAPI() : getDaftarUMKM();

    // Memenuhi Kriteria Penilaian Modul 3: Menggunakan .then(), .catch(), dan .finally()
    apiPromise
      .then((data: UMKMKulinerData[]) => {
        setAllUMKM(data);
      })
      .catch((err: any) => {
        console.error("Gagal memuat data API:", err);
        setErrorMessage(err.message || "Gagal menghubungi server API eksternal.");
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  useEffect(() => {
    const hasil = allUMKM.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" || item.kategori === selectedCategory;
      const matchSearch =
        item.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasiKota.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    setFilteredUMKM(hasil);
  }, [searchQuery, selectedCategory, allUMKM]);

  function getStatusBadge(skor: number) {
    if (skor >= 85) {
      return {
        label: "Sangat Layak",
        bgBadge: "#EEF9F5",
        textBadge: "#28735F",
        barColor: "#52B79B",
        icon: "checkmark-done-circle" as const,
      };
    } else if (skor >= 70) {
      return {
        label: "Cukup Layak",
        bgBadge: "#F0F2F3",
        textBadge: "#53585C",
        barColor: "#74787C",
        icon: "checkmark-circle" as const,
      };
    } else if (skor >= 55) {
      return {
        label: "Perlu Pembinaan",
        bgBadge: "#fef3c7",
        textBadge: "#b45309",
        barColor: "#f59e0b",
        icon: "alert-circle" as const,
      };
    } else {
      return {
        label: "Risiko Tinggi",
        bgBadge: "#fee2e2",
        textBadge: "#b91c1c",
        barColor: "#ef4444",
        icon: "close-circle" as const,
      };
    }
  }

  const renderUMKMCard = ({ item }: { item: UMKMKulinerData }) => {
    const status = getStatusBadge(item.skorTotal);

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/umkm/${item.id}`)}
      >
        <Image source={{ uri: item.fotoUrl }} style={styles.cardImage} />

        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.namaUsaha}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>kategori: {item.kategori}</Text>
            </View>
          </View>

          <Text style={styles.lokasiText} numberOfLines={1}>
            lokasi : {item.lokasiKota}
          </Text>

          <View style={styles.penilaianRow}>
            <Text style={styles.penilaianText}>penilaian ⭐</Text>
            <View
              style={[
                styles.scoreBadgeContainer,
                { backgroundColor: status.bgBadge, marginLeft: 8 },
              ]}
            >
              <Text style={[styles.scoreBadgeText, { color: status.textBadge }]}>
                {item.skorTotal}/100 ({status.label})
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUMKM}
        keyExtractor={(item) => item.id}
        renderItem={renderUMKMCard}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <SearchHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredCount={filteredUMKM.length}
            totalCount={allUMKM.length}
            onOpenSop={() => router.push("/docs/halal")}
            onOpenTeam={() => router.push("/about")}
            onOpenLogin={() =>
              Alert.alert(
                "Masuk Akun",
                "Fitur login sedang disiapkan sesuai alur autentikasi kelompok."
              )
            }
          />
        }
        ListFooterComponent={<ListFooter />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={() => loadData(true)}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#52B79B" />
              <Text style={{ marginTop: 12, color: "#74787C", fontSize: 13 }}>
                Memuat gerai kuliner nyata dari OpenStreetMap & TheMealDB...
              </Text>
            </View>
          ) : errorMessage ? (
            <View style={{ padding: 30, alignItems: "center" }}>
              <Ionicons name="cloud-offline-outline" size={54} color="#ef4444" />
              <Text style={{ marginTop: 12, color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>
                Gagal Memuat API Eksternal
              </Text>
              <Text style={{ marginTop: 6, color: "#74787C", fontSize: 13, textAlign: "center", maxWidth: 360, lineHeight: 18 }}>
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
                onPress={() => loadData(true)}
              >
                <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 13 }}>
                  Coba Hubungkan Lagi
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ padding: 30, alignItems: "center" }}>
              <Ionicons name="restaurant-outline" size={48} color="#9DA1A5" />
              <Text style={{ marginTop: 12, color: "#74787C", fontSize: 14 }}>
                Tidak ada usaha kuliner yang cocok dengan filter pencarian.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
