import { SkorAspekKuliner, StatusKelayakan } from "@/types/umkm";


export function kalkulasiSkorKuliner(aspek: SkorAspekKuliner): number {
  const skor =
    aspek.higieneSanitasi * 0.3 +
    aspek.keuanganHPP * 0.3 +
    aspek.pemasaranDigital * 0.2 +
    aspek.operasionalDapur * 0.2;

  return Math.round(skor);
}

export function evaluasiKelayakan(skorTotal: number): StatusKelayakan {
  if (skorTotal >= 85) return "Sangat Layak";
  if (skorTotal >= 70) return "Cukup Layak";
  if (skorTotal >= 55) return "Perlu Pembinaan";
  return "Risiko Tinggi";
}

/**
 * Custom Async Function yang memvalidasi kelayakan secara asynchronous
 * Menggunakan new Promise dengan .resolve() dan .reject()
 */
export function verifikasiKelayakanPromise(skorTotal: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof skorTotal !== "number" || isNaN(skorTotal)) {
      return reject(new Error("Skor asesmen tidak valid (harus berupa angka)."));
    }

    if (skorTotal < 0 || skorTotal > 100) {
      return reject(new Error("Skor asesmen di luar rentang (harus 0 - 100)."));
    }

    // Simulasi proses async
    setTimeout(() => {
      if (skorTotal >= 70) {
        resolve(`Lolos Audit: Skor ${skorTotal}/100 memenuhi standar kelayakan & higiene.`);
      } else {
        reject(new Error(`Belum Lolos: Skor ${skorTotal}/100 berada di bawah standar minimum (70).`));
      }
    }, 300);
  });
}
