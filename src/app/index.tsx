import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { KategoriKuliner, UMKMKulinerData } from "@/types/umkm";
import { getDaftarUMKM, getUMKMMilikUser } from "@/services/umkmService";
import { runInitialMigration } from "@/database/migration/seedData";
import { useAuth } from "@/context/AuthContext";
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
  displayUserName: string;
  isStoreOwner: boolean;
  onOpenSop: () => void;
  onOpenTeam: () => void;
  onOpenKelola: () => void;
  onOpenProfil: () => void;
}

function SearchHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredCount,
  totalCount,
  displayUserName,
  isStoreOwner,
  onOpenSop,
  onOpenTeam,
  onOpenKelola,
  onOpenProfil,
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

            {isStoreOwner && (
              <Pressable style={styles.authBtn} onPress={onOpenKelola}>
                <Ionicons name="storefront-outline" size={14} color="#ffffff" />
                <Text style={styles.authBtnText}>Toko</Text>
              </Pressable>
            )}

            <Pressable style={styles.authBtn} onPress={onOpenProfil}>
              <Ionicons name="person-circle-outline" size={14} color="#ffffff" />
              <Text style={styles.authBtnText}>Profil</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.userSessionBar}>
          <View style={styles.userSessionLeft}>
            <Ionicons name="checkmark-circle" size={14} color="#6EE7B7" />
            <Text style={styles.userSessionText} numberOfLines={1}>
              Halo, {displayUserName}
            </Text>
          </View>

          {isStoreOwner ? (
            <Pressable style={styles.addAuditBtn} onPress={onOpenKelola}>
              <Ionicons name="briefcase-outline" size={13} color="#ffffff" />
              <Text style={styles.addAuditBtnText}>Pemilik UMKM</Text>
            </Pressable>
          ) : (
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.16)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#E2F4EE", fontSize: 11, fontWeight: "600" }}>
                Pengunjung
              </Text>
            </View>
          )}
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
  const { user } = useAuth();

  const [allUMKM, setAllUMKM] = useState<UMKMKulinerData[]>([]);
  const [isStoreOwner, setIsStoreOwner] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<KategoriKuliner>("Semua");
  const [filteredUMKM, setFilteredUMKM] = useState<UMKMKulinerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const loadData = useCallback(
    async (backgroundRefresh = false) => {
      if (backgroundRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setErrorMessage(null);

      try {
        if (user?.id) {
          await runInitialMigration(user.id);
        }
        const [data, ownedStores] = await Promise.all([
          getDaftarUMKM(),
          user?.id ? getUMKMMilikUser(user.id) : Promise.resolve([]),
        ]);
        setAllUMKM(data);
        setIsStoreOwner(ownedStores.length > 0);
        hasLoadedRef.current = true;
      } catch (err: any) {
        console.error("Gagal memuat data Supabase:", err);
        setErrorMessage(err?.message || "Gagal menghubungi database Supabase.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id]
  );

  useFocusEffect(
    useCallback(() => {
      loadData(hasLoadedRef.current);
    }, [loadData])
  );

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
      };
    } else if (skor >= 70) {
      return {
        label: "Cukup Layak",
        bgBadge: "#F0F2F3",
        textBadge: "#53585C",
      };
    } else if (skor >= 55) {
      return {
        label: "Perlu Pembinaan",
        bgBadge: "#fef3c7",
        textBadge: "#b45309",
      };
    } else {
      return {
        label: "Risiko Tinggi",
        bgBadge: "#fee2e2",
        textBadge: "#b91c1c",
      };
    }
  }

  const displayUserName =
    user?.user_metadata?.nama_lengkap ||
    user?.email?.split("@")[0] ||
    "Pengguna";

  const renderUMKMCard = ({ item }: { item: UMKMKulinerData }) => {
    const status = getStatusBadge(item.skorTotal);

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/umkm/${item.id}`)}
      >
        <Image
          source={item.fotoLocal ? item.fotoLocal : { uri: item.fotoUrl }}
          style={styles.cardImage}
        />

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
    <SafeAreaView style={styles.container} edges={["top"]}>
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
            displayUserName={displayUserName}
            isStoreOwner={isStoreOwner}
            onOpenSop={() => router.push("/docs/halal")}
            onOpenTeam={() => router.push("/about")}
            onOpenKelola={() => router.push("/(admin)/kelola")}
            onOpenProfil={() => router.push("/(admin)/profil-asesor")}
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
                Memuat daftar gerai kuliner dari database Supabase...
              </Text>
            </View>
          ) : errorMessage ? (
            <View style={{ padding: 30, alignItems: "center" }}>
              <Ionicons name="cloud-offline-outline" size={54} color="#ef4444" />
              <Text style={{ marginTop: 12, color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>
                Gagal Memuat Data Supabase
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: "#74787C",
                  fontSize: 13,
                  textAlign: "center",
                  maxWidth: 360,
                  lineHeight: 18,
                }}
              >
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
              <Text style={{ marginTop: 12, color: "#74787C", fontSize: 14, textAlign: "center" }}>
                Tidak ada usaha kuliner yang cocok dengan filter pencarian.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
