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
