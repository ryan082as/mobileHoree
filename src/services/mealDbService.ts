import { MenuPopulerItem } from "@/types/umkm";

export interface MealDBItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export async function fetchPopularMealsPool(): Promise<MenuPopulerItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken", {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`TheMealDB API gagal merespons (Status: ${res.status} ${res.statusText})`);
    }

    const data = await res.json();
    if (!data.meals || !Array.isArray(data.meals) || data.meals.length === 0) {
      throw new Error("Tidak ada data menu makanan dari TheMealDB API.");
    }

    const meals: MenuPopulerItem[] = data.meals.slice(0, 15).map((meal: MealDBItem, index: number) => ({
      id: `meal-${meal.idMeal}`,
      nama: meal.strMeal,
      deskripsi: `Menu hidangan ayam spesial bersertifikasi resep kuliner dari TheMealDB API.`,
      harga: 18000 + ((parseInt(meal.idMeal, 10) || index) % 12) * 1000,
      isFavorit: index % 2 === 0,
      fotoUrl: meal.strMealThumb,
    }));

    return meals;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Koneksi ke TheMealDB API timeout (lebih dari 8 detik).");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
