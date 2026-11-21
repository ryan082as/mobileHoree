import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  addMenuToUMKM,
  deleteMenuFromUMKM,
  getUMKMMilikUser,
} from "@/services/umkmService";
import { useAuth } from "@/context/AuthContext";
import { EditTokoModal } from "@/components/EditTokoModal";
import { MenuPaginationBar } from "@/components/MenuPaginationBar";
import { usePaginatedMenus } from "@/hooks/use-paginated-menus";
import { UMKMKulinerData } from "@/types/umkm";
import { styles } from "@/styles/kelolaStyles";

interface StoreManageCardProps {
  item: UMKMKulinerData;
  menuRefreshNonce: number;
  onPressStore: () => void;
  onPressEdit: () => void;
  onPressUlasan: () => void;
  onPressAddMenu: () => void;
  onDeleteMenu: (menuId: string, menuName: string) => void;
}

function StoreManageCard({
  item,
  menuRefreshNonce,
  onPressStore,
  onPressEdit,
  onPressUlasan,
  onPressAddMenu,
  onDeleteMenu,
}: StoreManageCardProps) {
  const {
    items: menuItems,
    totalCount,
    totalPages,
    page,
    pageSize,
    searchQuery,
    loading,
    setSearchQuery,
    goToPage,
    refresh,
  } = usePaginatedMenus(item.id, 20);

  useEffect(() => {
    if (menuRefreshNonce > 0) {
      refresh(false);
    }
  }, [menuRefreshNonce, refresh]);

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E2E4E6",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Pressable style={styles.itemInfo} onPress={onPressStore}>
          <Text style={styles.itemName}>{item.namaUsaha}</Text>
          <Text style={styles.itemSub}>
            {item.kategori} • Skor: {item.skorTotal} ({item.statusKelayakan})
          </Text>
          <Text style={[styles.itemSub, { fontSize: 11 }]}>{item.lokasiKota}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              alignSelf: "flex-start",
              backgroundColor: "#EEF9F5",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={11} color="#1E6B56" />
            <Text style={{ fontSize: 10, color: "#1E6B56", fontWeight: "600" }}>
              Profil & Menu Terbuka • Nilai Audit Dikunci Admin
            </Text>
          </View>
        </Pressable>
        <View style={[styles.actionBtns, { flexWrap: "wrap", justifyContent: "flex-end" }]}>
          <Pressable style={styles.editBtn} onPress={onPressEdit}>
            <Ionicons name="pencil" size={15} color="#ffffff" />
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#EEF9F5",
              borderColor: "#C1EBDE",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={onPressUlasan}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#1E6B56" />
            <Text style={{ color: "#1E6B56", fontSize: 11, fontWeight: "700" }}>Ulasan</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#1E6B56",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={onPressAddMenu}
          >
            <Ionicons name="add-circle-outline" size={15} color="#ffffff" />
            <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "700" }}>Menu</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#2C3033", marginBottom: 6 }}>
          Daftar Menu ({totalCount.toLocaleString("id-ID")})
        </Text>

        <MenuPaginationBar
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          loading={loading}
          onPageChange={goToPage}
        />

        {menuItems.length === 0 ? (
          <Text style={{ fontSize: 11, color: "#9DA1A5" }}>
            {loading
              ? "Memuat menu..."
              : searchQuery
                ? "Tidak ada menu yang cocok dengan kata kunci."
                : "Belum ada menu. Tekan tombol + Menu untuk menambah menu."}
          </Text>
        ) : (
          menuItems.map((menu) => (
            <View
              key={menu.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: "#475569", flex: 1 }}>
                • {menu.nama} (Rp {menu.harga.toLocaleString("id-ID")})
              </Text>
              <Pressable onPress={() => onDeleteMenu(menu.id, menu.nama)}>
                <Ionicons name="trash-outline" size={15} color="#ef4444" />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

export default function KelolaUMKMAdminScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [dataList, setDataList] = useState<UMKMKulinerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [editingStore, setEditingStore] = useState<UMKMKulinerData | null>(null);
  const [menuTargetStore, setMenuTargetStore] = useState<UMKMKulinerData | null>(null);
  const [menuNama, setMenuNama] = useState("");
  const [menuHarga, setMenuHarga] = useState("15000");
  const [menuDeskripsi, setMenuDeskripsi] = useState("");
  const [savingMenu, setSavingMenu] = useState(false);
  const [menuRefreshNonce, setMenuRefreshNonce] = useState(0);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!user) return;
      if (isRefresh) setRefreshing(true);
      else setIsLoading(true);
      setErrorMessage(null);

      try {
        const list = await getUMKMMilikUser(user.id);
        setDataList(list);
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err?.message || "Gagal memuat toko yang terhubung ke akun Anda.");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const openAddMenuModal = (item: UMKMKulinerData) => {
    setMenuTargetStore(item);
    setMenuNama("");
    setMenuHarga("18000");
    setMenuDeskripsi("");
  };

  const handleSaveNewMenu = async () => {
    if (!menuTargetStore || !user) return;
    if (!menuNama.trim()) {
      Alert.alert("Perhatian", "Mohon isi nama menu terlebih dahulu.");
      return;
    }

    setSavingMenu(true);
    try {
      await addMenuToUMKM(menuTargetStore.id, user.id, {
        nama: menuNama.trim(),
        deskripsi: menuDeskripsi.trim() || "Menu sajian khas dari gerai UMKM pilihan.",
        harga: parseInt(menuHarga.replace(/[^0-9]/g, ""), 10) || 15000,
        isFavorit: false,
      });
      setMenuTargetStore(null);
      setMenuRefreshNonce((v) => v + 1);
    } catch (err: any) {
      Alert.alert("Gagal Tambah Menu", err?.message || "Tidak dapat menyimpan menu.");
    } finally {
      setSavingMenu(false);
    }
  };

  const handleDeleteMenu = async (menuId: string, menuName: string) => {
    const confirmRun = async () => {
      try {
        await deleteMenuFromUMKM(menuId);
        setMenuRefreshNonce((v) => v + 1);
      } catch (err: any) {
        Alert.alert("Gagal Menghapus Menu", err?.message || "Tidak memiliki izin menghapus menu.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window === "undefined" || window.confirm(`Hapus menu "${menuName}"?`)) {
        confirmRun();
      }
      return;
    }

    Alert.alert("Hapus Menu", `Yakin ingin menghapus menu "${menuName}"?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: confirmRun },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#52B79B" />
        <Text style={styles.backText}>Kembali ke Dashboard</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>🏪 Kelola Toko & Menu Saya</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          Akun: {user?.email} • Hanya dapat mengedit profil & menu toko milik akun ini
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#52B79B" />
          <Text style={styles.loadingText}>Memuat toko yang terhubung...</Text>
        </View>
      ) : errorMessage ? (
        <View style={{ padding: 30, alignItems: "center" }}>
          <Ionicons name="cloud-offline-outline" size={54} color="#ef4444" />
          <Text style={{ marginTop: 12, color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>
            Gangguan Koneksi Supabase
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: "#74787C",
              fontSize: 13,
              textAlign: "center",
              maxWidth: 350,
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
            onPress={() => loadData()}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 13 }}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={() => {
            loadData(true);
            setMenuRefreshNonce((v) => v + 1);
          }}
          ListEmptyComponent={
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 14,
                padding: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E2E4E6",
                marginTop: 10,
              }}
            >
              <Ionicons name="storefront-outline" size={42} color="#52B79B" />
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#2C3033", marginTop: 10 }}>
                Belum Ada Toko Terhubung
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#74787C",
                  textAlign: "center",
                  marginTop: 6,
                  lineHeight: 18,
                }}
              >
                Akun pengunjung hanya untuk menjelajah dan memberi ulasan. Jika Anda Pemilik UMKM,
                hubungi Admin petaRasa untuk menghubungkan akun Anda dengan toko Anda di database.
              </Text>
              <View
                style={{
                  marginTop: 12,
                  backgroundColor: "#F4F4F4",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 10, color: "#53585C" }}>UID: {user?.id}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <StoreManageCard
              item={item}
              menuRefreshNonce={menuRefreshNonce}
              onPressStore={() => router.push(`/umkm/${item.id}`)}
              onPressEdit={() => setEditingStore(item)}
              onPressUlasan={() => router.push(`/umkm/${item.id}?tab=ulasan`)}
              onPressAddMenu={() => openAddMenuModal(item)}
              onDeleteMenu={handleDeleteMenu}
            />
          )}
        />
      )}

      <Modal
        visible={Boolean(menuTargetStore)}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuTargetStore(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 20,
              maxWidth: 420,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "bold", color: "#2C3033", marginBottom: 4 }}>
              Tambah Menu Baru
            </Text>
            <Text style={{ fontSize: 12, color: "#74787C", marginBottom: 12 }}>
              Toko: {menuTargetStore?.namaUsaha}
            </Text>

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Nama Menu
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E2E4E6",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
                color: "#2C3033",
              }}
              placeholder="Contoh: Es Kopi Susu Gula Aren"
              placeholderTextColor="#9DA1A5"
              value={menuNama}
              onChangeText={setMenuNama}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Harga (Rp)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E2E4E6",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
                color: "#2C3033",
              }}
              keyboardType="numeric"
              value={menuHarga}
              onChangeText={setMenuHarga}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Deskripsi Menu
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E2E4E6",
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
                color: "#2C3033",
              }}
              placeholder="Deskripsi singkat bahan/rasa menu..."
              placeholderTextColor="#9DA1A5"
              value={menuDeskripsi}
              onChangeText={setMenuDeskripsi}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <Pressable
                style={{ paddingHorizontal: 14, paddingVertical: 10 }}
                onPress={() => setMenuTargetStore(null)}
              >
                <Text style={{ color: "#74787C", fontWeight: "600" }}>Batal</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "#1E6B56",
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 8,
                  opacity: savingMenu ? 0.65 : 1,
                }}
                onPress={handleSaveNewMenu}
                disabled={savingMenu}
              >
                {savingMenu ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Simpan Menu</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <EditTokoModal
        store={editingStore}
        userId={user?.id || ""}
        onClose={() => setEditingStore(null)}
        onUpdated={(updated) =>
          setDataList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        }
      />
    </SafeAreaView>
  );
}
