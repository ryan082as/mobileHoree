import { UlasanKuliner } from "@/types/ulasan";

export const DAFTAR_ULASAN_KULINER: UlasanKuliner[] = [
  {
    id: "rev-01",
    geraiId: "kuliner-01",
    emailPengulas: "dimas.pratama@gmail.com",
    namaPengulas: "Dimas Pratama",
    ratingBintang: 5,
    isiUlasan:
      "Keripik apelnya renyah banget, kemasannya juga aman tahan udara. Cocok banget buat oleh-oleh keluarga!",
    tanggalUlasan: "2026-10-01",
    threadBalasan: [
      {
        id: "msg-01",
        pengirimEmail: "siti.rahmawati@gmail.com",
        pengirimNama: "Siti Rahmawati (Pemilik)",
        role: "pemilik_gerai",
        teksPesan:
          "Terima kasih banyak Mas Dimas atas ulasannya! Kami selalu menjaga kualitas penggorengan higienis.",
        waktuKirim: "2026-10-01 14:30",
      },
      {
        id: "msg-02",
        pengirimEmail: "dimas.pratama@gmail.com",
        pengirimNama: "Dimas Pratama",
        role: "konsumen",
        teksPesan: "Sama-sama Bu, sukses terus usahanya ya!",
        waktuKirim: "2026-10-01 15:10",
      },
    ],
  },
  {
    id: "rev-02",
    geraiId: "kuliner-02",
    emailPengulas: "nadia.safira@gmail.com",
    namaPengulas: "Nadia Safira",
    ratingBintang: 4,
    isiUlasan:
      "Kopi arabikanya nikmat dan aromanya khas lereng gunung. Sedikit masukan di waktu penyajian pas ramai agak lama.",
    tanggalUlasan: "2026-10-03",
    threadBalasan: [
      {
        id: "msg-03",
        pengirimEmail: "fajar.nugraha@gmail.com",
        pengirimNama: "Fajar Nugraha (Pemilik)",
        role: "pemilik_gerai",
        teksPesan:
          "Terima kasih masukannya Kak Nadia! Kami sedang menambah 1 grinder dan barista baru untuk jam sibuk.",
        waktuKirim: "2026-10-03 18:00",
      },
    ],
  },
];
