import { MenuPopulerItem } from "@/types/umkm";

export interface MealDBItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

function getShortMealDescription(name: string): string {
  const descriptions: Record<string, string> = {
    "15-minute chicken & halloumi burgers": "Burger ayam lezat berpadu keju halloumi panggang gurih dan saus spesial.",
    "Ayam Percik": "Olahan ayam bakar khas bumbu rempah kelapa gurih pedas manis yang meresap.",
    "Belgian Waterzooi Chicken": "Sup krim ayam kental khas Belgia dengan sayuran segar dan kaldu gurih.",
    "Bengali Chicken Curry with Potatoes": "Kari ayam rempah khas Bengali dimasak perlahan bersama kentang empuk.",
    "Brown Stew Chicken": "Ayam rebus bumbu karamel kecap rempah gurih khas Karibia.",
    "Chick-Fil-A Sandwich": "Sandwich fillet ayam krispi renyah dengan acar timun dan roti bun lembut.",
    "Chicken & chorizo rice pot": "Nasi bumbu rempah aromatik dengan potongan ayam empuk dan sosis gurih.",
    "Chicken & mushroom Hotpot": "Hidangan ayam hangat dengan jamur segar dalam kuah kaldu gurih berempah.",
    "Chicken Alfredo Primavera": "Pasta fettuccine ayam lembut dengan saus krim keju alfredo dan sayuran segar.",
    "Chicken and Potato Roti": "Roti pipih isi tumisan daging ayam cincang dan kentang berbumbu rempah harum.",
    "Chicken Basquaise": "Ayam panggang klasik bumbu tomat manis, paprika panggang, dan rempah herba.",
    "Chicken Congee": "Bubur ayam lembut hangat disajikan dengan suwiran ayam gurih dan daun bawang.",
    "Chicken Couscous": "Olahan ayam berpadu butiran couscous lembut dan kuah kaldu rempah mediterania.",
    "Chicken Enchilada Casserole": "Panggang tortilla ayam keju lumer khas Meksiko dengan saus enchilada pedas gurih.",
    "Chicken Fajita Mac and Cheese": "Perpaduan makaroni keju creamy dengan tumisan ayam paprika bumbu fajita.",
  };

  if (descriptions[name]) {
    return descriptions[name];
  }

  const lower = name.toLowerCase();
  if (lower.includes("burger") || lower.includes("sandwich")) {
    return "Burger isi daging ayam empuk gurih dengan roti bun lembut dan saus spesial.";
  }
  if (lower.includes("curry") || lower.includes("kari")) {
    return "Kari ayam kaya rempah tradisional dengan kuah santan gurih dan harum.";
  }
  if (lower.includes("soup") || lower.includes("stew") || lower.includes("pot") || lower.includes("waterzooi")) {
    return "Hidangan kuah hangat berbahan ayam empuk dengan kaldu gurih bernutrisi.";
  }
  if (lower.includes("pasta") || lower.includes("mac") || lower.includes("alfredo") || lower.includes("noodle")) {
    return "Olahan pasta lezat berpadu potongan ayam empuk dan saus creamy pilihan.";
  }
  if (lower.includes("rice") || lower.includes("congee") || lower.includes("nasi")) {
    return "Sajian ayam nikmat berpadu nasi aromatik hangat kaya cita rasa.";
  }

  return "Hidangan ayam pilihan lezat dengan paduan bumbu rempah autentik.";
}

export async function fetchPopularMealsPool(): Promise<MenuPopulerItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

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
      deskripsi: getShortMealDescription(meal.strMeal),
      harga: 18000 + ((parseInt(meal.idMeal, 10) || index) % 12) * 1000,
      isFavorit: index % 2 === 0,
      fotoUrl: meal.strMealThumb,
    }));

    return meals;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Koneksi ke TheMealDB API timeout (lebih dari 12 detik).");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
