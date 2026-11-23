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
  spotlightItems: UMKMKulinerData[];
  onOpenSop: () => void;
  onOpenTeam: () => void;
  onOpenKelola: () => void;
  onOpenProfil: () => void;
  onSelectUMKM: (id: string) => void;
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
  spotlightItems,
  onOpenSop,
  onOpenTeam,
  onOpenKelola,
  onOpenProfil,
  onSelectUMKM,
}: SearchHeaderProps) {
  return (
    <View>
      {/* 1. Top Location & Status Bar */}
      <View style={styles.topBarRow}>
        <View style={styles.locationPill}>
          <Ionicons name="location" size={14} color="#489347" />
          <Text style={styles.locationText} numberOfLines={1}>
            Malang Raya & Kampus UMM
          </Text>
          <Ionicons name="chevron-down" size={12} color="#667D66" />
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable style={styles.topBarActionBtn} onPress={onOpenTeam}>
            <Ionicons name="information-circle-outline" size={18} color="#489347" />
          </Pressable>
        </View>
      </View>

      {/* 2. Hero Green Banner Card (matches middle screen in reference image) */}
      <View style={styles.heroBanner}>
        <View style={styles.heroBannerContent}>
          <View style={styles.heroLeft}>
            <View style={styles.heroTagPill}>
              <Text style={styles.heroTagText}>STANDAR HIGIENE & HALAL</Text>
            </View>
            <Text style={styles.heroTitle}>petaRasa UMKM</Text>
            <Text style={styles.heroSubtitle}>
              Petunjuk Pasti Kuliner Pilihan & Higienis di Lingkungan Kampus
            </Text>
          </View>

          <View style={styles.heroLogoCard}>
            <Image
              source={require("@/assets/images/petarasa-logo.png")}
              style={styles.heroLogoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* User Greeting Strip */}
        <View style={styles.userGreetingStrip}>
          <Text style={styles.userGreetingText} numberOfLines={1}>
            👋 Halo, {displayUserName}
          </Text>
          <View style={styles.userRoleBadge}>
            <Text style={styles.userRoleBadgeText}>
              {isStoreOwner ? "PEMILIK TOKO" : "PENGUNJUNG"}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Quick Action Row */}
      <View style={styles.quickActionsRow}>
        <Pressable
          style={styles.quickActionItem}
          onPress={() => onOpenSop()}
        >
          <View style={styles.quickActionIconWrapper}>
            <Ionicons name="ribbon-outline" size={20} color="#489347" />
          </View>
          <Text style={styles.quickActionLabel}>Halal & Higiene</Text>
        </Pressable>

        <Pressable
          style={styles.quickActionItem}
          onPress={onOpenProfil}
        >
          <View style={styles.quickActionIconWrapper}>
            <Ionicons name="person-outline" size={20} color="#489347" />
          </View>
          <Text style={styles.quickActionLabel}>Profil Asesor</Text>
        </Pressable>

        <Pressable
          style={styles.quickActionItem}
          onPress={onOpenKelola}
        >
          <View style={styles.quickActionIconWrapper}>
            <Ionicons name="storefront-outline" size={20} color="#489347" />
          </View>
          <Text style={styles.quickActionLabel}>Daftar Toko</Text>
        </Pressable>
      </View>

      {/* 4. Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#489347" />
        <TextInput
          placeholder="Cari kedai kuliner, produk, atau kota..."
          placeholderTextColor="#94A894"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#667D66" />
          </Pressable>
        )}
      </View>

      {/* 5. Category Tabs (Horizontal Pill Scroll) */}
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
                isSelected && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 6. Horizontal Spotlight Row (3 square cards in reference image) */}
      {spotlightItems.length > 0 && (
        <View style={styles.spotlightSection}>
          <View style={styles.spotlightHeaderRow}>
            <Text style={styles.spotlightTitle}>⭐ Rekomendasi Teratas</Text>
            <Text style={{ fontSize: 11, color: "#489347", fontWeight: "600" }}>
              Skor Terbaik
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.spotlightScroll}
          >
            {spotlightItems.slice(0, 5).map((umkm) => (
              <Pressable
                key={umkm.id}
                style={styles.spotlightCard}
                onPress={() => onSelectUMKM(umkm.id)}
              >
                <Image
                  source={umkm.fotoLocal ? umkm.fotoLocal : { uri: umkm.fotoUrl }}
                  style={styles.spotlightImage}
                />
                <Text style={styles.spotlightName} numberOfLines={1}>
                  {umkm.namaUsaha}
                </Text>
                <View style={styles.spotlightPriceBadge}>
                  <Text style={styles.spotlightPriceText}>★ {umkm.skorTotal}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 7. Section Title Row */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Daftar Hasil Audit Kuliner</Text>
        <Text style={styles.sectionCount}>
          {filteredCount} dari {totalCount} gerai
        </Text>
      </View>
    </View>
  );
}

function ListFooter() {
  return (
    <View style={styles.footerBox}>
      <Text style={styles.footerText}>petaRasa • Praktikum Pemrograman Mobile</Text>
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
        bgBadge: "#E9F5E8",
        textBadge: "#2B702B",
      };
    } else if (skor >= 70) {
      return {
        label: "Cukup Layak",
        bgBadge: "#EEF2ED",
        textBadge: "#4A6E4A",
      };
    } else if (skor >= 55) {
      return {
        label: "Perlu Pembinaan",
        bgBadge: "#FEF3C7",
        textBadge: "#B45309",
      };
    } else {
      return {
        label: "Risiko Tinggi",
        bgBadge: "#FEE2E2",
        textBadge: "#B91C1C",
      };
    }
  }

  const displayUserName =
    user?.user_metadata?.nama_lengkap ||
    user?.email?.split("@")[0] ||
    "Pengguna";

  // Top 5 stores by score for spotlight row
  const spotlightItems = [...allUMKM].sort((a, b) => b.skorTotal - a.skorTotal);

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
              <Text style={styles.categoryBadgeText}>{item.kategori}</Text>
            </View>
          </View>

          <Text style={styles.lokasiText} numberOfLines={1}>
            📍 {item.lokasiKota}
          </Text>

          <View style={styles.penilaianRow}>
            <View style={styles.penilaianLeft}>
              <Text style={styles.penilaianText}>Nilai Higiene:</Text>
              <View
                style={[
                  styles.scoreBadgeContainer,
                  { backgroundColor: status.bgBadge },
                ]}
              >
                <Text style={[styles.scoreBadgeText, { color: status.textBadge }]}>
                  ⭐ {item.skorTotal}/100 • {status.label}
                </Text>
              </View>
            </View>

            <View style={styles.cardArrowCircle}>
              <Ionicons name="arrow-forward" size={14} color="#489347" />
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
            spotlightItems={spotlightItems}
            onOpenSop={() => router.push("/docs/halal")}
            onOpenTeam={() => router.push("/about")}
            onOpenKelola={() => router.push("/(admin)/kelola")}
            onOpenProfil={() => router.push("/(admin)/profil-asesor")}
            onSelectUMKM={(id) => router.push(`/umkm/${id}`)}
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
              <ActivityIndicator size="large" color="#489347" />
              <Text style={{ marginTop: 12, color: "#667D66", fontSize: 13 }}>
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
                  color: "#667D66",
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
                  backgroundColor: "#489347",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
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
              <Ionicons name="restaurant-outline" size={48} color="#94A894" />
              <Text style={{ marginTop: 12, color: "#667D66", fontSize: 14, textAlign: "center" }}>
                Tidak ada usaha kuliner yang cocok dengan filter pencarian.
              </Text>
            </View>
          )
        }
      />

      {/* 8. Bottom Navigation Bar (matches bottom tabs in reference image) */}
      <View style={styles.bottomNavBar}>
        <Pressable style={styles.bottomNavItem} onPress={() => {}}>
          <Ionicons name="home" size={22} color="#489347" />
          <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>Beranda</Text>
        </Pressable>

        <Pressable
          style={styles.bottomNavItem}
          onPress={() => router.push("/docs/halal")}
        >
          <Ionicons name="grid-outline" size={22} color="#7E967E" />
          <Text style={styles.bottomNavText}>Katalog SOP</Text>
        </Pressable>

        {isStoreOwner && (
          <Pressable
            style={styles.bottomNavItem}
            onPress={() => router.push("/(admin)/kelola")}
          >
            <Ionicons name="storefront-outline" size={22} color="#7E967E" />
            <Text style={styles.bottomNavText}>Toko Saya</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.bottomNavItem}
          onPress={() => router.push("/(admin)/profil-asesor")}
        >
          <Ionicons name="person-outline" size={22} color="#7E967E" />
          <Text style={styles.bottomNavText}>Akun Saya</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
