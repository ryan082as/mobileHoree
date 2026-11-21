import {
  createIsolatedSupabaseClient,
  formatSupabaseError,
  supabase,
} from "@/lib/supabase";

export interface StarterUMKMAccount {
  geraiId: string;
  namaUsaha: string;
  namaPemilik: string;
  email: string;
  password: string;
}

/**
 * Daftar akun login pemilik UMKM bawaan yang otomatis dibuatkan di Supabase Auth
 * dan dihubungkan ke gerainya saat migrasi awal berjalan.
 */
export const INITIAL_UMKM_ACCOUNTS: StarterUMKMAccount[] = [
  {
    geraiId: "11111111-1111-4111-8111-111111111101",
    namaUsaha: "Kontainer Cafe UMM",
    namaPemilik: "Pengelola Kontainer Cafe UMM",
    email: "kontainer@petarasa.id",
    password: "petarasa123",
  },
  {
    geraiId: "11111111-1111-4111-8111-111111111102",
    namaUsaha: "ALMEERA WARTEG",
    namaPemilik: "Ibu Almeera",
    email: "almeera@petarasa.id",
    password: "petarasa123",
  },
  {
    geraiId: "11111111-1111-4111-8111-111111111103",
    namaUsaha: "BAKSO MALANG CAK CULL",
    namaPemilik: "Cak Cull",
    email: "cakcull@petarasa.id",
    password: "petarasa123",
  },
];

const INITIAL_GERAI = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    is_public: true,
    is_seed: false,
    nama_usaha: "Kontainer Cafe UMM",
    nama_pemilik: "Pengelola Kampus UMM",
    kategori: "Minuman & Kopi",
    lokasi_kota: "Komplek UMM, Jl. Raya Tlogomas No.246, Malang",
    tahun_berdiri: 2019,
    foto_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&q=80",
    omzet_bulanan: 38000000,
    laba_bersih: 9500000,
    kapasitas_porsi_harian: 250,
    jumlah_karyawan: 5,
    pencatatan_keuangan: "Sistem Kasir Cloud & POS",
    sertifikat_halal: true,
    izin_pirt_bpom: true,
    terdaftar_online_food: true,
    adopsi_qris: true,
    skor_higiene: 94,
    skor_keuangan: 92,
    skor_pemasaran: 90,
    skor_operasional: 92,
    skor_total: 92,
    status_kelayakan: "Sangat Layak",
    rekomendasi_asesor:
      "Kafe ikonik di lingkungan kampus UMM. Standar kebersihan dan pengelolaan keuangan sangat prima, layak kemitraan permodalan.",
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    is_public: true,
    is_seed: false,
    nama_usaha: "ALMEERA WARTEG",
    nama_pemilik: "Ibu Almeera",
    kategori: "Makanan Berat",
    lokasi_kota: "Jl. Karyawiguna (Belakang Kampus UMM Gerbang 3), Malang",
    tahun_berdiri: 2020,
    foto_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
    omzet_bulanan: 42000000,
    laba_bersih: 10800000,
    kapasitas_porsi_harian: 350,
    jumlah_karyawan: 6,
    pencatatan_keuangan: "Buku Kas & Aplikasi Kasir",
    sertifikat_halal: true,
    izin_pirt_bpom: false,
    terdaftar_online_food: true,
    adopsi_qris: true,
    skor_higiene: 85,
    skor_keuangan: 88,
    skor_pemasaran: 84,
    skor_operasional: 87,
    skor_total: 86,
    status_kelayakan: "Sangat Layak",
    rekomendasi_asesor:
      "Perputaran omzet harian sangat tinggi berkat mahasiswa UMM. Disarankan melengkapi Sertifikat Laik Higiene Sanitasi (SLHS).",
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    is_public: true,
    is_seed: false,
    nama_usaha: "BAKSO MALANG CAK CULL",
    nama_pemilik: "Cak Cull",
    kategori: "Makanan Berat",
    lokasi_kota: "Jl. Sigura - Gura No.34, Lowokwaru, Malang",
    tahun_berdiri: 2017,
    foto_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
    omzet_bulanan: 48000000,
    laba_bersih: 12500000,
    kapasitas_porsi_harian: 300,
    jumlah_karyawan: 7,
    pencatatan_keuangan: "Aplikasi POS & Jurnal Kasir",
    sertifikat_halal: true,
    izin_pirt_bpom: true,
    terdaftar_online_food: true,
    adopsi_qris: true,
    skor_higiene: 95,
    skor_keuangan: 93,
    skor_pemasaran: 92,
    skor_operasional: 96,
    skor_total: 94,
    status_kelayakan: "Sangat Layak",
    rekomendasi_asesor:
      "Bakso legendaris kawasan kampus dengan cita rasa autentik konsisten. Siap ekspansi cabang baru dan pengajuan KUR Bank.",
  },
];

const INITIAL_MENUS = [
  {
    id: "22222222-2222-4222-8222-222222222101",
    gerai_id: "11111111-1111-4111-8111-111111111101",
    nama: "Kopi Susu Kontainer",
    deskripsi: "Espresso robusta & arabika blend dengan susu segar dan gula aren asli Malang.",
    harga: 18000,
    is_favorit: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222102",
    gerai_id: "11111111-1111-4111-8111-111111111101",
    nama: "Matcha Latte Ice",
    deskripsi: "Green tea matcha premium dengan susu creamy dan es batu segar.",
    harga: 22000,
    is_favorit: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222103",
    gerai_id: "11111111-1111-4111-8111-111111111101",
    nama: "Croissant Toast Keju",
    deskripsi: "Pastry renyah isi keju cheddar melted gurih teman minum kopi.",
    harga: 16000,
    is_favorit: false,
  },
  {
    id: "22222222-2222-4222-8222-222222222201",
    gerai_id: "11111111-1111-4111-8111-111111111102",
    nama: "Paket Nasi Ayam Lengkuas",
    deskripsi: "Nasi pulen hangat dengan ayam goreng bumbu lengkuas, sambal terasi, dan lalapan.",
    harga: 18000,
    is_favorit: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    gerai_id: "11111111-1111-4111-8111-111111111102",
    nama: "Cumi Basah Hitam Pedas",
    deskripsi: "Tumis cumi tinta hitam segar dengan cabai rawit pedas mantap.",
    harga: 20000,
    is_favorit: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    gerai_id: "11111111-1111-4111-8111-111111111102",
    nama: "Oreg Tempe & Telur Balado",
    deskripsi: "Tempe orek manis renyah dipadu telur bulat saus balado khas warteg.",
    harga: 12000,
    is_favorit: false,
  },
  {
    id: "22222222-2222-4222-8222-222222222301",
    gerai_id: "11111111-1111-4111-8111-111111111103",
    nama: "Bakso Campur Spesial",
    deskripsi: "Bakso halus, bakso urat, pangsit basah, tahu bakso dengan kuah kaldu sapi sumsum.",
    harga: 22000,
    is_favorit: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222302",
    gerai_id: "11111111-1111-4111-8111-111111111103",
    nama: "Bakso Tetelan Mercon",
    deskripsi: "Bakso urat daging sapi melimpah dengan potongan tetelan empuk dan kuah pedas gurih.",
    harga: 28000,
    is_favorit: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222303",
    gerai_id: "11111111-1111-4111-8111-111111111103",
    nama: "Pangsit Goreng Crispy (3 pcs)",
    deskripsi: "Pangsit renyah gurih khas Malang pendamping makan bakso yang renyah.",
    harga: 10000,
    is_favorit: false,
  },
];

const INITIAL_REVIEWS = [
  {
    id: "33333333-3333-4333-8333-333333333101",
    gerai_id: "11111111-1111-4111-8111-111111111101",
    email_pengulas: "mahasiswa.umm@gmail.com",
    nama_pengulas: "Ahmad Farhan (Mahasiswa UMM)",
    rating_bintang: 5,
    isi_ulasan:
      "Tempatnya sangat nyaman buat nugas bareng teman kuliah. Kopinya mantap dan harganya ramah mahasiswa!",
    tanggal_ulasan: "2026-11-15",
    thread_balasan: [
      {
        id: "reply-01",
        pengirimEmail: "owner@kontainercafe.id",
        pengirimNama: "Kontainer Cafe UMM",
        role: "pemilik_gerai",
        teksPesan: "Terima kasih kak! Ditunggu kedatangannya kembali di area kampus.",
        waktuKirim: "2026-11-16 09:30",
      },
    ],
  },
  {
    id: "33333333-3333-4333-8333-333333333201",
    gerai_id: "11111111-1111-4111-8111-111111111102",
    email_pengulas: "kuliner.malang@gmail.com",
    nama_pengulas: "Rina Kusuma",
    rating_bintang: 5,
    isi_ulasan:
      "Lauknya lengkap, ayam lengkuasnya juara dan tempatnya bersih. Bayar pakai QRIS juga cepat!",
    tanggal_ulasan: "2026-11-17",
    thread_balasan: [],
  },
  {
    id: "33333333-3333-4333-8333-333333333301",
    gerai_id: "11111111-1111-4111-8111-111111111103",
    email_pengulas: "dimas.informatika@gmail.com",
    nama_pengulas: "Dimas Prasetyo",
    rating_bintang: 5,
    isi_ulasan: "Kuah kaldunya gurih banget dan tetelannya empuk. Porsinya mengenyangkan.",
    tanggal_ulasan: "2026-11-18",
    thread_balasan: [],
  },
];

let hasSeeded = false;
let migrationInFlight: Promise<void> | null = null;

/**
 * Resets in-memory migration state on sign-out so re-seeding runs cleanly if the DB was reset.
 */
export function resetMigrationState(): void {
  hasSeeded = false;
  migrationInFlight = null;
}

/**
 * If a user signs in with one of the starter UMKM credentials before initial migration ran,
 * provisions that owner's Supabase Auth account automatically and starts their session.
 * Returns null when provisioned & signed in, a string on failure, or undefined if not a starter account.
 */
export async function signInStarterUmkmIfMatched(
  email: string,
  password: string
): Promise<string | null | undefined> {
  const matched = INITIAL_UMKM_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
  );
  if (!matched) return undefined;

  const { data, error } = await supabase.auth.signUp({
    email: matched.email,
    password: matched.password,
    options: {
      data: {
        nama_lengkap: matched.namaPemilik,
        role: "pemilik_umkm",
        nama_usaha: matched.namaUsaha,
      },
    },
  });

  if (error) {
    return error.message;
  }

  if (!data.session) {
    return "Akun UMKM terbuat, namun Confirm email di Supabase Auth masih aktif sehingga belum bisa langsung masuk.";
  }

  return null;
}

async function ensureOwnerSessionClient(
  acc: StarterUMKMAccount,
  activeUser: { id: string; email?: string } | null
) {
  if (
    activeUser?.id &&
    activeUser.email &&
    activeUser.email.toLowerCase() === acc.email.toLowerCase()
  ) {
    return { client: supabase, ownerId: activeUser.id };
  }

  const isolated = createIsolatedSupabaseClient();
  const { data: signInData, error: signInErr } = await isolated.auth.signInWithPassword({
    email: acc.email,
    password: acc.password,
  });

  if (!signInErr && signInData.user) {
    return { client: isolated, ownerId: signInData.user.id };
  }

  const { data: signUpData, error: signUpErr } = await isolated.auth.signUp({
    email: acc.email,
    password: acc.password,
    options: {
      data: {
        nama_lengkap: acc.namaPemilik,
        role: "pemilik_umkm",
        nama_usaha: acc.namaUsaha,
      },
    },
  });

  if (signUpErr || !signUpData.user || !signUpData.session) {
    throw formatSupabaseError(
      signUpErr,
      `Gagal menyiapkan akun pemilik UMKM (${acc.email}). Pastikan opsi 'Confirm email' di Supabase Auth nonaktif.`
    );
  }

  return { client: isolated, ownerId: signUpData.user.id };
}

/**
 * Automatically creates starter UMKM owner Auth accounts and inserts initial starter stores,
 * menus, and reviews linked to their respective owners when public catalog tables are empty.
 */
export async function runInitialMigration(userId: string): Promise<void> {
  if (hasSeeded || !userId) return;
  if (migrationInFlight) return migrationInFlight;

  migrationInFlight = (async () => {
    const { count, error: countError } = await supabase
      .from("umkm_gerai")
      .select("id", { count: "exact", head: true })
      .eq("is_public", true);

    if (countError) {
      throw formatSupabaseError(countError, "Gagal memeriksa tabel awal di Supabase.");
    }

    if ((count ?? 0) > 0) {
      hasSeeded = true;
      return;
    }

    const {
      data: { user: activeUser },
    } = await supabase.auth.getUser();

    for (const gerai of INITIAL_GERAI) {
      const ownerAcc = INITIAL_UMKM_ACCOUNTS.find((a) => a.geraiId === gerai.id);
      if (!ownerAcc) continue;

      const { client: ownerClient, ownerId } = await ensureOwnerSessionClient(
        ownerAcc,
        activeUser ? { id: activeUser.id, email: activeUser.email } : null
      );

      const { error: geraiErr } = await ownerClient
        .from("umkm_gerai")
        .upsert([{ ...gerai, is_seed: false, user_id: ownerId }], {
          onConflict: "id",
          ignoreDuplicates: true,
        });
      if (geraiErr) throw formatSupabaseError(geraiErr, `Gagal mengisi gerai ${gerai.nama_usaha}.`);

      const storeMenus = INITIAL_MENUS.filter((m) => m.gerai_id === gerai.id).map((m) => ({
        ...m,
        user_id: ownerId,
      }));
      if (storeMenus.length > 0) {
        const { error: menuErr } = await ownerClient
          .from("menu_populer")
          .upsert(storeMenus, { onConflict: "id", ignoreDuplicates: true });
        if (menuErr) throw formatSupabaseError(menuErr, `Gagal mengisi menu ${gerai.nama_usaha}.`);
      }

      const storeReviews = INITIAL_REVIEWS.filter((r) => r.gerai_id === gerai.id).map((r) => ({
        ...r,
        user_id: ownerId,
      }));
      if (storeReviews.length > 0) {
        const { error: reviewErr } = await ownerClient
          .from("ulasan_kuliner")
          .upsert(storeReviews, { onConflict: "id", ignoreDuplicates: true });
        if (reviewErr) {
          throw formatSupabaseError(reviewErr, `Gagal mengisi ulasan ${gerai.nama_usaha}.`);
        }
      }
    }

    hasSeeded = true;
  })().catch((err) => {
    migrationInFlight = null;
    throw err;
  });

  return migrationInFlight;
}
