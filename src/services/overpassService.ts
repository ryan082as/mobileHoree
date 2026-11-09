export interface OverpassPlace {
  id: string;
  nama: string;
  tipe: "restaurant" | "cafe" | "fast_food" | string;
  alamat: string;
  kategori: string;
  lat: number;
  lon: number;
}

export async function fetchOverpassPlaces(): Promise<OverpassPlace[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://photon.komoot.io/api/?q=resto+malang&limit=10", {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`OpenStreetMap API gagal merespons (Status: ${res.status} ${res.statusText})`);
    }

    const data = await res.json();
    if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
      throw new Error("Tidak ada data lokasi gerai yang ditemukan dari OpenStreetMap API.");
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
      throw new Error("Format data lokasi OpenStreetMap tidak sesuai.");
    }

    return places;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Koneksi ke OpenStreetMap API timeout (lebih dari 8 detik).");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
