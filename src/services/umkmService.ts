import { formatSupabaseError, supabase } from "@/lib/supabase";
import {
  KategoriKuliner,
  MenuPopulerItem,
  SkorAspekKuliner,
  StatusKelayakan,
  UMKMKulinerData,
} from "@/types/umkm";
import { UlasanKuliner, PesanThread } from "@/types/ulasan";

const DEFAULT_STORE_PHOTO =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80";

const STARTER_LOCAL_PHOTOS: Record<string, { asset: any; seedFotoUrl: string }> = {
  "11111111-1111-4111-8111-111111111101": {
    asset: require("@/assets/images/Kontainer Cafe UMM.jpg"),
    seedFotoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&q=80",
  },
  "11111111-1111-4111-8111-111111111102": {
    asset: require("@/assets/images/ALMEERA WARTEG.jpg"),
    seedFotoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
  },
  "11111111-1111-4111-8111-111111111103": {
    asset: require("@/assets/images/BAKSO MALANG CAK CULL.jpg"),
    seedFotoUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
  },
};

function mapMenuRow(row: any): MenuPopulerItem {
  return {
    id: row.id,
    nama: row.nama,
    deskripsi: row.deskripsi,
    harga: Number(row.harga) || 0,
    isFavorit: Boolean(row.is_favorit),
    fotoUrl: row.foto_url || undefined,
  };
}

function mapUMKMRow(row: any): UMKMKulinerData {
  const menuRows = Array.isArray(row.menu_populer) ? row.menu_populer : [];
  const starterPhoto = STARTER_LOCAL_PHOTOS[row.id];
  const usesStarterPhoto = Boolean(
    starterPhoto && (!row.foto_url || row.foto_url === starterPhoto.seedFotoUrl)
  );
  const skorAspek: SkorAspekKuliner = {
    higieneSanitasi: Number(row.skor_higiene) || 75,
    keuanganHPP: Number(row.skor_keuangan) || 75,
    pemasaranDigital: Number(row.skor_pemasaran) || 75,
    operasionalDapur: Number(row.skor_operasional) || 75,
  };

  return {
    id: row.id,
    userId: row.user_id || undefined,
    isSeed: Boolean(row.is_seed),
    namaUsaha: row.nama_usaha,
    namaPemilik: row.nama_pemilik,
    kategori: (row.kategori || "Makanan Berat") as Exclude<KategoriKuliner, "Semua">,
    lokasiKota: row.lokasi_kota,
    tahunBerdiri: Number(row.tahun_berdiri) || 2020,
    fotoUrl: row.foto_url || DEFAULT_STORE_PHOTO,
    fotoLocal: usesStarterPhoto ? starterPhoto?.asset : undefined,
    menuPopuler: menuRows.map(mapMenuRow),
    omzetBulanan: Number(row.omzet_bulanan) || 0,
    labaBersih: Number(row.laba_bersih) || 0,
    kapasitasPorsiHarian: Number(row.kapasitas_porsi_harian) || 0,
    jumlahKaryawan: Number(row.jumlah_karyawan) || 1,
    pencatatanKeuangan: row.pencatatan_keuangan || "Buku Kas Sederhana",
    sertifikatHalal: Boolean(row.sertifikat_halal),
    izinPIRT_BPOM: Boolean(row.izin_pirt_bpom),
    terdaftarOnlineFood: Boolean(row.terdaftar_online_food),
    adopsiQRIS: Boolean(row.adopsi_qris),
    skorTotal: Number(row.skor_total) || 75,
    statusKelayakan: (row.status_kelayakan || "Cukup Layak") as StatusKelayakan,
    skorAspek,
    rekomendasiAsesor:
      row.rekomendasi_asesor ||
      "Pertahankan konsistensi mutu sajian, higienitas dapur, dan pencatatan kas harian.",
  };
}

function mapUlasanRow(row: any): UlasanKuliner {
  return {
    id: row.id,
    geraiId: row.gerai_id,
    userId: row.user_id || undefined,
    emailPengulas: row.email_pengulas,
    namaPengulas: row.nama_pengulas,
    ratingBintang: Number(row.rating_bintang) || 5,
    isiUlasan: row.isi_ulasan,
    tanggalUlasan: row.tanggal_ulasan,
    threadBalasan: Array.isArray(row.thread_balasan) ? row.thread_balasan : [],
  };
}

export async function getDaftarUMKM(): Promise<UMKMKulinerData[]> {
  const { data, error } = await supabase
    .from("umkm_gerai")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw formatSupabaseError(error, "Gagal mengambil daftar gerai dari Supabase.");
  }

  return (data || []).map(mapUMKMRow);
}

export async function getUMKMMilikUser(userId: string): Promise<UMKMKulinerData[]> {
  const { data, error } = await supabase
    .from("umkm_gerai")
    .select("*")
    .eq("user_id", userId)
    .eq("is_seed", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw formatSupabaseError(error, "Gagal mengambil daftar gerai milik akun Anda.");
  }

  return (data || []).map(mapUMKMRow);
}

export async function getUMKMById(id: string): Promise<UMKMKulinerData> {
  if (!id || id.trim() === "") {
    throw new Error("ID gerai kuliner tidak valid.");
  }

  const { data, error } = await supabase
    .from("umkm_gerai")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw formatSupabaseError(error, "Detail gerai tidak ditemukan di database Supabase.");
  }

  return mapUMKMRow(data);
}

export interface PaginatedMenusResult {
  items: MenuPopulerItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetches paginated menu items for a store using count=exact and range(),
 * supporting server-side search across tens of thousands of rows without lag.
 */
export async function getMenusByGeraiId(
  geraiId: string,
  options?: { page?: number; pageSize?: number; search?: string }
): Promise<PaginatedMenusResult> {
  const pageSize = Math.max(1, options?.pageSize ?? 25);
  const page = Math.max(0, options?.page ?? 0);
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const cleanSearch = options?.search?.trim() || "";

  let query = supabase
    .from("menu_populer")
    .select("*", { count: "exact" })
    .eq("gerai_id", geraiId)
    .order("created_at", { ascending: false })
    .order("is_favorit", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (cleanSearch) {
    query = query.ilike("nama", `%${cleanSearch}%`);
  }

  const { data, count, error } = await query;
  if (error) {
    throw formatSupabaseError(error, "Gagal memuat daftar menu gerai.");
  }

  const totalCount = count ?? 0;
  return {
    items: (data || []).map(mapMenuRow),
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

export async function getUlasanByGeraiId(geraiId: string): Promise<UlasanKuliner[]> {
  const { data, error } = await supabase
    .from("ulasan_kuliner")
    .select("*")
    .eq("gerai_id", geraiId)
    .order("created_at", { ascending: false });

  if (error) {
    throw formatSupabaseError(error, "Gagal memuat ulasan gerai.");
  }

  return (data || []).map(mapUlasanRow);
}

export interface CreateMenuInput {
  nama: string;
  deskripsi: string;
  harga: number;
  isFavorit?: boolean;
}

export interface UpdateUMKMInput {
  namaUsaha: string;
  namaPemilik: string;
  kategori: Exclude<KategoriKuliner, "Semua">;
  lokasiKota: string;
  tahunBerdiri: number;
  fotoUrl?: string;
}

/**
 * Updates store profile fields for the authenticated store owner only.
 * Audit scores and ownership columns remain locked by Supabase RLS & DB trigger.
 */
export async function updateUMKM(
  id: string,
  userId: string,
  input: UpdateUMKMInput
): Promise<UMKMKulinerData> {
  const cleanYear = Math.max(
    1900,
    Math.min(new Date().getFullYear(), Math.round(input.tahunBerdiri) || 2020)
  );
  const payload: Record<string, any> = {
    nama_usaha: input.namaUsaha.trim(),
    nama_pemilik: input.namaPemilik.trim(),
    kategori: input.kategori,
    lokasi_kota: input.lokasiKota.trim(),
    tahun_berdiri: cleanYear,
  };

  if (input.fotoUrl !== undefined) {
    const cleanFoto = input.fotoUrl.trim();
    payload.foto_url = cleanFoto || null;
  }

  const { data, error } = await supabase
    .from("umkm_gerai")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_seed", false)
    .select("*")
    .single();

  if (error || !data) {
    throw formatSupabaseError(
      error,
      "Gagal memperbarui profil toko. Pastikan Anda login dengan akun pemilik gerai ini."
    );
  }

  return mapUMKMRow(data);
}

export interface CreateUlasanInput {
  geraiId: string;
  userId: string;
  emailPengulas: string;
  namaPengulas: string;
  ratingBintang: number;
  isiUlasan: string;
}

export async function createUlasan(input: CreateUlasanInput): Promise<UlasanKuliner> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("ulasan_kuliner")
    .insert([
      {
        gerai_id: input.geraiId,
        user_id: input.userId,
        email_pengulas: input.emailPengulas,
        nama_pengulas: input.namaPengulas.trim() || input.emailPengulas.split("@")[0],
        rating_bintang: Math.max(1, Math.min(5, input.ratingBintang)),
        isi_ulasan: input.isiUlasan.trim(),
        tanggal_ulasan: today,
        thread_balasan: [],
      },
    ])
    .select("*")
    .single();

  if (error || !data) {
    throw formatSupabaseError(error, "Gagal mengirim ulasan ke Supabase.");
  }

  return mapUlasanRow(data);
}

export async function deleteUlasan(id: string): Promise<void> {
  const { error } = await supabase.from("ulasan_kuliner").delete().eq("id", id);

  if (error) {
    throw formatSupabaseError(error, "Gagal menghapus ulasan.");
  }
}

export interface ReplyUlasanInput {
  reviewId: string;
  pengirimEmail: string;
  pengirimNama: string;
  teksPesan: string;
}

export async function replyToUlasan(input: ReplyUlasanInput): Promise<UlasanKuliner> {
  const cleanReply = input.teksPesan.trim();
  if (!cleanReply) {
    throw new Error("Teks balasan tidak boleh kosong.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("ulasan_kuliner")
    .select("thread_balasan")
    .eq("id", input.reviewId)
    .single();

  if (fetchError || !existing) {
    throw formatSupabaseError(fetchError, "Ulasan tidak ditemukan.");
  }

  const currentThread: PesanThread[] = Array.isArray(existing.thread_balasan)
    ? existing.thread_balasan
    : [];

  const newReply: PesanThread = {
    id: `reply-${Date.now()}`,
    pengirimEmail: input.pengirimEmail,
    pengirimNama: input.pengirimNama,
    role: "pemilik_gerai",
    teksPesan: cleanReply,
    waktuKirim: new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const { data, error } = await supabase
    .from("ulasan_kuliner")
    .update({ thread_balasan: [...currentThread, newReply] })
    .eq("id", input.reviewId)
    .select("*")
    .single();

  if (error || !data) {
    throw formatSupabaseError(error, "Gagal mengirim balasan ulasan. Pastikan Anda pemilik gerai ini.");
  }

  return mapUlasanRow(data);
}

export async function addMenuToUMKM(
  geraiId: string,
  userId: string,
  menu: CreateMenuInput
): Promise<MenuPopulerItem> {
  const { data, error } = await supabase
    .from("menu_populer")
    .insert([
      {
        gerai_id: geraiId,
        user_id: userId,
        nama: menu.nama.trim(),
        deskripsi: menu.deskripsi.trim() || "Menu pilihan dari gerai UMKM.",
        harga: Number(menu.harga) || 15000,
        is_favorit: Boolean(menu.isFavorit),
      },
    ])
    .select("*")
    .single();

  if (error || !data) {
    throw formatSupabaseError(error, "Gagal menambahkan menu ke toko Anda.");
  }

  return mapMenuRow(data);
}

export async function deleteMenuFromUMKM(menuId: string): Promise<void> {
  const { error } = await supabase.from("menu_populer").delete().eq("id", menuId);

  if (error) {
    throw formatSupabaseError(error, "Gagal menghapus menu.");
  }
}
