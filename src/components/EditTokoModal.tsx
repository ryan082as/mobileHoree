import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateUMKM } from "@/services/umkmService";
import { KategoriKuliner, UMKMKulinerData } from "@/types/umkm";

const KATEGORI_PILIHAN: Exclude<KategoriKuliner, "Semua">[] = [
  "Makanan Berat",
  "Minuman & Kopi",
  "Snack & Oleh-oleh",
  "Frozen Food",
  "Bakery & Pastry",
  "Katering",
];

interface EditTokoModalProps {
  store: UMKMKulinerData | null;
  userId: string;
  onClose: () => void;
  onUpdated: (updatedStore: UMKMKulinerData) => void;
}

/**
 * Reusable modal allowing a logged-in UMKM owner to edit only their own store profile fields
 * while audit scores remain protected by database RLS and triggers.
 */
export function EditTokoModal({ store, userId, onClose, onUpdated }: EditTokoModalProps) {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [kategori, setKategori] = useState<Exclude<KategoriKuliner, "Semua">>("Makanan Berat");
  const [lokasiKota, setLokasiKota] = useState("");
  const [tahunBerdiri, setTahunBerdiri] = useState("2020");
  const [fotoUrl, setFotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (!store) return;
    setNamaUsaha(store.namaUsaha);
    setNamaPemilik(store.namaPemilik);
    setKategori(store.kategori);
    setLokasiKota(store.lokasiKota);
    setTahunBerdiri(String(store.tahunBerdiri || 2020));
    setFotoUrl(store.fotoLocal ? "" : store.fotoUrl || "");
    setErrorText(null);
  }, [store]);

  const handleSave = async () => {
    if (!store || !userId) return;
    if (!namaUsaha.trim() || !namaPemilik.trim() || !lokasiKota.trim()) {
      setErrorText("Nama usaha, nama pemilik, dan lokasi wajib diisi.");
      return;
    }

    setErrorText(null);
    setSaving(true);
    try {
      const parsedYear = parseInt(tahunBerdiri.replace(/[^0-9]/g, ""), 10) || store.tahunBerdiri;
      const updated = await updateUMKM(store.id, userId, {
        namaUsaha,
        namaPemilik,
        kategori,
        lokasiKota,
        tahunBerdiri: parsedYear,
        fotoUrl: store.fotoLocal && !fotoUrl.trim() ? undefined : fotoUrl,
      });
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setErrorText(err?.message || "Gagal menyimpan perubahan profil toko.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={Boolean(store)} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 20,
            maxWidth: 440,
            width: "100%",
            maxHeight: "90%",
            alignSelf: "center",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 17, fontWeight: "bold", color: "#2C3033", marginBottom: 4 }}>
              Edit Profil Toko Saya
            </Text>
            <Text style={{ fontSize: 11, color: "#74787C", marginBottom: 12 }}>
              Perubahan hanya berlaku pada gerai milik akun Anda. Skor audit tetap dikunci Admin.
            </Text>

            {errorText && (
              <View
                style={{
                  backgroundColor: "#FEF2F2",
                  borderColor: "#FECACA",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons name="alert-circle" size={16} color="#B91C1C" />
                <Text style={{ fontSize: 12, color: "#B91C1C", flex: 1 }}>{errorText}</Text>
              </View>
            )}

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Nama Usaha
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
              value={namaUsaha}
              onChangeText={setNamaUsaha}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Nama Pemilik
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
              value={namaPemilik}
              onChangeText={setNamaPemilik}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 6 }}>
              Kategori Kuliner
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 10 }}
            >
              <View style={{ flexDirection: "row", gap: 6 }}>
                {KATEGORI_PILIHAN.map((cat) => {
                  const selected = kategori === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setKategori(cat)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: selected ? "#1E6B56" : "#E2E4E6",
                        backgroundColor: selected ? "#EEF9F5" : "#F9FAFB",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: selected ? "700" : "500",
                          color: selected ? "#1E6B56" : "#53585C",
                        }}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Lokasi Toko
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
              value={lokasiKota}
              onChangeText={setLokasiKota}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              Tahun Berdiri
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
              value={tahunBerdiri}
              onChangeText={setTahunBerdiri}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: "#53585C", marginBottom: 4 }}>
              URL Foto Gerai (Opsional)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E2E4E6",
                borderRadius: 8,
                padding: 10,
                marginBottom: 14,
                color: "#2C3033",
              }}
              placeholder="Kosongkan untuk tetap memakai foto bawaan"
              placeholderTextColor="#9DA1A5"
              autoCapitalize="none"
              autoCorrect={false}
              value={fotoUrl}
              onChangeText={setFotoUrl}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <Pressable style={{ paddingHorizontal: 14, paddingVertical: 10 }} onPress={onClose}>
                <Text style={{ color: "#74787C", fontWeight: "600" }}>Batal</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "#1E6B56",
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 8,
                  opacity: saving ? 0.65 : 1,
                }}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Simpan Perubahan</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
