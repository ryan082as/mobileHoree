import { KategoriKuliner, UMKMKulinerData, SkorAspekKuliner } from "@/types/umkm";
import { UlasanKuliner } from "@/types/ulasan";
import { fetchOverpassPlaces, OverpassPlace } from "./overpassService";
import { fetchPopularMealsPool } from "./mealDbService";
import { kalkulasiSkorKuliner, evaluasiKelayakan } from "./assessmentService";

function buildUMKMList(places: OverpassPlace[], mealsPool: any[]): UMKMKulinerData[] {
  const pemilik = [
    "Bpk. Suryo H.",
    "Ibu Siti Aminah",
    "Mas Dimas Raditya",
    "Bpk. H. Wahyudi",
    "Mbak Putri N.",
    "Bpk. Bambang P.",
  ];

  return places.map((place, idx) => {
    const mealStartIndex = (idx * 2) % Math.max(1, mealsPool.length - 2);
    const menus = mealsPool.slice(mealStartIndex, mealStartIndex + 3);
    const mainPhoto =
      menus.length > 0 && menus[0].fotoUrl
        ? menus[0].fotoUrl
        : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500";

    const higiene = 70 + ((idx * 7) % 28);
    const keuangan = 65 + ((idx * 11) % 32);
    const pemasaran = 75 + ((idx * 5) % 23);
    const operasional = 70 + ((idx * 9) % 25);

    const skorAspek: SkorAspekKuliner = {
      higieneSanitasi: higiene,
      keuanganHPP: keuangan,
      pemasaranDigital: pemasaran,
      operasionalDapur: operasional,
    };

    const skorTotal = kalkulasiSkorKuliner(skorAspek);
    const statusKelayakan = evaluasiKelayakan(skorTotal);

    return {
      id: place.id,
      namaUsaha: place.nama,
      namaPemilik: pemilik[idx % pemilik.length],
      kategori: place.kategori as Exclude<KategoriKuliner, "Semua">,
      lokasiKota: place.alamat,
      tahunBerdiri: 2018 + (idx % 6),
      fotoUrl: mainPhoto,
      menuPopuler: menus,
      omzetBulanan: 25000000 + (idx * 5000000),
      labaBersih: 7000000 + (idx * 1500000),
      kapasitasPorsiHarian: 120 + (idx * 20),
      jumlahKaryawan: 3 + (idx % 5),
      pencatatanKeuangan: idx % 2 === 0 ? "Aplikasi Kasir Digital" : "Buku Kas Sederhana",
      sertifikatHalal: idx % 2 === 0,
      izinPIRT_BPOM: idx % 3 !== 0,
      terdaftarOnlineFood: true,
      adopsiQRIS: true,
      skorTotal,
      statusKelayakan,
      skorAspek,
      rekomendasiAsesor:
        skorTotal >= 80
          ? "Pertahankan standar mutu higienitas dapur dan tingkatkan promosi menu paket bundling di platform online food."
          : "Diperlukan standardisasi pencatatan HPP harian dan perbaikan alur sanitasi peralatan masak.",
    };
  });
}

let cachedUMKMList: UMKMKulinerData[] = [];
let cachedUlasanList: UlasanKuliner[] = [];

function generateUlasanForPlaces(places: UMKMKulinerData[]) {
  const reviews: UlasanKuliner[] = [];
  places.forEach((p) => {
    reviews.push({
      id: `rev-${p.id}-1`,
      geraiId: p.id,
      emailPengulas: "mahasiswa.umm@gmail.com",
      namaPengulas: "Ahmad Farhan (Mahasiswa UMM)",
      ratingBintang: 5,
      isiUlasan: `Tempatnya sangat nyaman buat nugas bareng teman kuliah. Menunya lezat dan harganya ramah di kantong mahasiswa!`,
      tanggalUlasan: "2026-11-01",
      threadBalasan: [
        {
          id: `reply-${p.id}-1`,
          pengirimEmail: "owner@petarasa.com",
          pengirimNama: p.namaUsaha,
          role: "pemilik_gerai",
          teksPesan: "Terima kasih banyak atas kunjungannya kak! Ditunggu kedatangannya kembali ya.",
          waktuKirim: "2026-11-02 09:30",
        },
      ],
    });

    reviews.push({
      id: `rev-${p.id}-2`,
      geraiId: p.id,
      emailPengulas: "kuliner.malang@gmail.com",
      namaPengulas: "Rina Kusuma",
      ratingBintang: 4,
      isiUlasan: "Rasa makanannya pas, pelayanan cepat dan tempat bersih. Pembayaran QRIS juga lancar.",
      tanggalUlasan: "2026-11-05",
      threadBalasan: [],
    });
  });
  cachedUlasanList = reviews;
}

export async function fetchAllUMKMFromAPI(): Promise<UMKMKulinerData[]> {
  const [places, mealsPool] = await Promise.all([
    fetchOverpassPlaces(),
    fetchPopularMealsPool(),
  ]);

  if (!places || places.length === 0) {
    throw new Error("Tidak ada data gerai kuliner yang ditemukan dari OpenStreetMap API.");
  }

  const result = buildUMKMList(places, mealsPool);
  cachedUMKMList = result;
  generateUlasanForPlaces(result);
  return result;
}

export async function getDaftarUMKM(): Promise<UMKMKulinerData[]> {
  if (cachedUMKMList.length > 0) {
    // Memenuhi kriteria Pre-built Async: Promise.resolve()
    return Promise.resolve(cachedUMKMList);
  }
  return fetchAllUMKMFromAPI();
}

/**
 * Custom Async Function yang mengembalikan Promise dengan fungsi .resolve() dan .reject()
 * Sesuai Kriteria Penilaian Demo Modul 3
 */
export function getUMKMById(id: string): Promise<UMKMKulinerData> {
  return new Promise((resolve, reject) => {
    if (!id || id.trim() === "") {
      return reject(new Error("ID gerai kuliner tidak boleh kosong."));
    }

    const found = cachedUMKMList.find((item) => item.id === id);
    if (found) {
      return resolve(found);
    }

    fetchAllUMKMFromAPI()
      .then((data) => {
        const item = data.find((g) => g.id === id);
        if (item) {
          resolve(item);
        } else {
          reject(new Error(`Gerai dengan ID "${id}" tidak ditemukan.`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getUlasanByGeraiId(geraiId: string): Promise<UlasanKuliner[]> {
  return cachedUlasanList.filter((item) => item.geraiId === geraiId);
}

export async function deleteUMKMLokal(id: string): Promise<void> {
  cachedUMKMList = cachedUMKMList.filter((item) => item.id !== id);
}
