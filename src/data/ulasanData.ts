import { UlasanKuliner } from "@/types/ulasan";

export const DAFTAR_ULASAN_KULINER: UlasanKuliner[] = [
  {
    id: "rev-01",
    geraiId: "kuliner-01",
    emailPengulas: "dimas.pratama@gmail.com",
    namaPengulas: "Dimas Pratama",
    ratingBintang: 5,
    isiUlasan:
      "Kopi susu gula arennya enak dan pas manisnya. Suasananya nyaman banget buat nugas dan diskusi bareng teman kampus UMM!",
    tanggalUlasan: "2026-10-12",
    threadBalasan: [
      {
        id: "msg-01",
        pengirimEmail: "pengelola@umm.ac.id",
        pengirimNama: "Pengelola Kampus UMM (Pemilik)",
        role: "pemilik_gerai",
        teksPesan:
          "Terima kasih banyak Mas Dimas atas ulasannya! Kami selalu menjaga kualitas biji kopi dan kenyamanan tempat nugas.",
        waktuKirim: "2026-10-12 14:30",
      },
    ],
  },
  {
    id: "rev-02",
    geraiId: "kuliner-01",
    emailPengulas: "sarah.amanda@gmail.com",
    namaPengulas: "Sarah Amanda",
    ratingBintang: 4,
    isiUlasan:
      "Matcha Latte-nya creamy dan croissant-nya renyah. Lokasi di dalam kampus sangat strategis, kalau sore agak ramai antrenya.",
    tanggalUlasan: "2026-10-15",
    threadBalasan: [
      {
        id: "msg-02",
        pengirimEmail: "pengelola@umm.ac.id",
        pengirimNama: "Pengelola Kampus UMM (Pemilik)",
        role: "pemilik_gerai",
        teksPesan:
          "Terima kasih Kak Sarah atas sarannya, kami sedang mengoptimalkan alur kasir saat jam sibuk sore hari.",
        waktuKirim: "2026-10-15 17:10",
      },
    ],
  },
  {
    id: "rev-03",
    geraiId: "kuliner-02",
    emailPengulas: "fikri.ramadhan@gmail.com",
    namaPengulas: "Fikri Ramadhan",
    ratingBintang: 5,
    isiUlasan:
      "Warteg langganan anak kost belakang kampus UMM. Paket ayam lengkuas dan sambalnya mantap pol, harga sangat terjangkau!",
    tanggalUlasan: "2026-10-14",
    threadBalasan: [
      {
        id: "msg-03",
        pengirimEmail: "almeera@gmail.com",
        pengirimNama: "Ibu Almeera (Pemilik)",
        role: "pemilik_gerai",
        teksPesan:
          "Alhamdulillah matur nuwun Mas Fikri! Senang masakan kami cocok untuk mahasiswa kost.",
        waktuKirim: "2026-10-14 16:00",
      },
    ],
  },
  {
    id: "rev-04",
    geraiId: "kuliner-02",
    emailPengulas: "nadia.safira@gmail.com",
    namaPengulas: "Nadia Safira",
    ratingBintang: 4,
    isiUlasan:
      "Lauknya banyak pilihan dan sayurnya selalu fresh. Cumi hitam pedasnya favorit saya tiap makan siang.",
    tanggalUlasan: "2026-10-16",
    threadBalasan: [],
  },
  {
    id: "rev-05",
    geraiId: "kuliner-03",
    emailPengulas: "ahmad.fauzi@gmail.com",
    namaPengulas: "Ahmad Fauzi",
    ratingBintang: 5,
    isiUlasan:
      "Kuah kaldu sapinya ngaldu banget, tetelannya melimpah dan empuk! Pangsit gorengnya renyah juara se-Sigura-gura.",
    tanggalUlasan: "2026-10-17",
    threadBalasan: [
      {
        id: "msg-04",
        pengirimEmail: "cakcull@gmail.com",
        pengirimNama: "Cak Cull (Pemilik)",
        role: "pemilik_gerai",
        teksPesan:
          "Matur suwun Mas Ahmad! Selalu kami sajikan kaldu sapi segar asli setiap hari.",
        waktuKirim: "2026-10-17 19:20",
      },
    ],
  },
  {
    id: "rev-06",
    geraiId: "kuliner-03",
    emailPengulas: "rina.maharani@gmail.com",
    namaPengulas: "Rina Maharani",
    ratingBintang: 5,
    isiUlasan:
      "Porsi mantap bikin kenyang, tempat bersih dan parkir luas. Wajib coba bakso campur tetelannya kalau ke Malang!",
    tanggalUlasan: "2026-10-18",
    threadBalasan: [],
  },
];
