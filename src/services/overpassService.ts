export interface OverpassPlace {
  id: string;
  nama: string;
  tipe: "restaurant" | "cafe" | "fast_food" | string;
  alamat: string;
  kategori: string;
  lat: number;
  lon: number;
}

export function fetchOverpassPlaces(): Promise<OverpassPlace[]> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    fetch("https://photon.komoot.io/api/?q=resto+malang&limit=10", {
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) {
          reject(new Error(`OpenStreetMap API gagal merespons (Status: ${res.status} ${res.statusText})`));
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
          reject(new Error("Tidak ada data lokasi gerai yang ditemukan dari OpenStreetMap API."));
          return;
        }

        const places: OverpassPlace[] = data.features
          .filter((item: any) => item.properties?.name && item.properties.name.trim().length > 0)
          .map((item: any) => {
            const p = item.properties;
            const street = p.street ? `${p.street}, ` : "";
            const city = p.city || "Malang";
            const isCafe = p.osm_value === "cafe";
            return {
              id: `osm-${p.osm_id}`,
              nama: p.name,
              tipe: isCafe ? "cafe" : "restaurant",
              alamat: `${street}${city}, Jawa Timur`,
              kategori: isCafe ? "Minuman & Kopi" : "Makanan Berat",
              lat: item.geometry?.coordinates?.[1] || -7.95,
              lon: item.geometry?.coordinates?.[0] || 112.62,
            };
          });

        if (places.length === 0) {
          reject(new Error("Format data lokasi OpenStreetMap tidak sesuai."));
          return;
        }

        resolve(places);
      })
      .catch((error: any) => {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          reject(new Error("Koneksi ke OpenStreetMap API timeout (lebih dari 12 detik)."));
        } else {
          reject(error);
        }
      });
  });
}
