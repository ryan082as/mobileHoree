import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`.env tidak ditemukan di ${filePath}`);
  }
  const env = {};
  for (const rawLine of fs.readFileSync(filePath, "utf-8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const eqIndex = line.indexOf("=");
    env[line.slice(0, eqIndex).trim()] = line.slice(eqIndex + 1).trim();
  }
  return env;
}

const env = loadEnv(envPath);
const SUPABASE_URL = env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY belum diatur di .env");
}

const DUMMY_COUNT_PER_STORE = 10000;
const BATCH_SIZE = 500;

const STORES = [
  {
    indexPrefix: "1",
    geraiId: "11111111-1111-4111-8111-111111111101",
    namaUsaha: "Kontainer Cafe UMM",
    email: "kontainer@petarasa.id",
    password: "petarasa123",
    templates: [
      { nama: "Es Kopi Aren Kontainer", desc: "Racikan espresso robusta-arabika dengan susu segar dan gula aren.", harga: 18000 },
      { nama: "Caramel Macchiato Ice", desc: "Espresso lembut dipadu saus karamel gurih dan foam susu dingin.", harga: 24000 },
      { nama: "Matcha Frappe Cream", desc: "Teh hijau matcha premium diblend halus dengan krim susu.", harga: 25000 },
      { nama: "Hazelnut Latte Hangat", desc: "Kopi susu hangat dengan sirup hazelnut klasik yang harum.", harga: 22000 },
      { nama: "Croffle Coklat Crunchy", desc: "Pastry renyah dipanggang hangat dengan topping coklat lumer.", harga: 17000 },
      { nama: "Americano Dingin", desc: "Double shot espresso disajikan dingin untuk teman nugas.", harga: 15000 },
      { nama: "Red Velvet Latte", desc: "Minuman creamy rasa red velvet dengan taburan crumble manis.", harga: 23000 },
      { nama: "Lychee Tea Segar", desc: "Es teh melati dengan buah leci segar dan rasa manis seimbang.", harga: 16000 },
    ],
  },
  {
    indexPrefix: "2",
    geraiId: "11111111-1111-4111-8111-111111111102",
    namaUsaha: "ALMEERA WARTEG",
    email: "almeera@petarasa.id",
    password: "petarasa123",
    templates: [
      { nama: "Nasi Ayam Balado", desc: "Nasi pulen dengan ayam goreng sambal balado merah pedas nikmat.", harga: 17000 },
      { nama: "Nasi Rendang Sapi", desc: "Daging sapi empuk dimasak bumbu rendang khas rumahan.", harga: 24000 },
      { nama: "Paket Ikan Tongkol Suwir", desc: "Ikan tongkol balado pedas lengkap dengan sayur tumis buncis.", harga: 16000 },
      { nama: "Sayur Asem Komplit", desc: "Kuah sayur asem segar isi jagung manis, labu siam, dan melinjo.", harga: 12000 },
      { nama: "Oseng Kikil Pedas", desc: "Kikil sapi kenyal dimasak kecap dan cabai rawit pilihan.", harga: 18000 },
      { nama: "Nasi Telur Dadar Crispy", desc: "Telur dadar tebal bumbu daun bawang disajikan dengan sambal terasi.", harga: 13000 },
      { nama: "Soto Ayam Kampung", desc: "Kuah bening hangat dengan suwiran ayam, soun, dan koya gurih.", harga: 16000 },
      { nama: "Nasi Campur Hemat", desc: "Paket nasi lengkap dengan orek tempe, perkedel, dan bihun goreng.", harga: 14000 },
    ],
  },
  {
    indexPrefix: "3",
    geraiId: "11111111-1111-4111-8111-111111111103",
    namaUsaha: "BAKSO MALANG CAK CULL",
    email: "cakcull@petarasa.id",
    password: "petarasa123",
    templates: [
      { nama: "Bakso Urat Jumbo", desc: "Pentol urat daging sapi kenyal dengan kuah kaldu tulang sumsum.", harga: 24000 },
      { nama: "Bakso Halus Komplit", desc: "Bakso halus isi tahu putih, siomay kukus, dan mie kuning.", harga: 18000 },
      { nama: "Mie Ayam Bakso Spesial", desc: "Mie kenyal bumbu kecap manis dengan topping ayam cincang dan 2 bakso.", harga: 20000 },
      { nama: "Bakso Keju Lumer", desc: "Pentol daging sapi isi potongan keju cheddar yang meleleh di dalam.", harga: 26000 },
      { nama: "Bakso Mercon Pedas", desc: "Bakso daging cincang isi cabai rawit ulek ekstra pedas.", harga: 27000 },
      { nama: "Tahu Walik Crispy", desc: "Tahu goreng renyah isi adonan bakso ikan dan daging sapi.", harga: 12000 },
      { nama: "Siomay Basah Kuah", desc: "Siomay kulit lembut khas Malang disiram kuah kaldu gurih hangat.", harga: 15000 },
      { nama: "Es Teh Manis Segar", desc: "Teh tubruk wangi disajikan dingin untuk pendamping makan bakso.", harga: 6000 },
    ],
  },
];

function makeDeterministicUuid(storePrefix, seqNumber) {
  const padded = String(seqNumber).padStart(12, "0");
  return `d000000${storePrefix}-0000-4000-8000-${padded}`;
}

async function signInOwner(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token || !body.user?.id) {
    throw new Error(`Gagal login pemilik (${email}): ${body.error_description || body.msg || res.status}`);
  }
  return { accessToken: body.access_token, userId: body.user.id };
}

async function countStoreMenus(geraiId, accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/menu_populer?gerai_id=eq.${geraiId}&select=id`,
    {
      method: "HEAD",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        Prefer: "count=exact",
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Gagal hitung menu (${geraiId}): HTTP ${res.status}`);
  }
  const contentRange = res.headers.get("content-range") || "0/0";
  const totalPart = contentRange.split("/")[1];
  return parseInt(totalPart, 10) || 0;
}

async function insertBatch(rows, accessToken) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_populer?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal batch insert: HTTP ${res.status} - ${errText}`);
  }
}

async function seedStoreDummyMenus(store) {
  console.log(`\n=== Memproses ${store.namaUsaha} (${store.email}) ===`);
  const { accessToken, userId } = await signInOwner(store.email, store.password);
  const beforeCount = await countStoreMenus(store.geraiId, accessToken);
  console.log(`Jumlah menu sebelum seed: ${beforeCount}`);

  // Timestamp turun mulai dari 2026-11-20T00:00:00Z sehingga menu baru & starter tetap di paling atas
  const baseEpochMs = Date.parse("2026-11-20T00:00:00Z");

  for (let start = 1; start <= DUMMY_COUNT_PER_STORE; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, DUMMY_COUNT_PER_STORE);
    const batch = [];
    for (let i = start; i <= end; i++) {
      const tpl = store.templates[(i - 1) % store.templates.length];
      const numLabel = String(i).padStart(5, "0");
      const priceDelta = ((i % 7) - 3) * 500;
      batch.push({
        id: makeDeterministicUuid(store.indexPrefix, i),
        gerai_id: store.geraiId,
        user_id: userId,
        nama: `${tpl.nama} #${numLabel}`,
        deskripsi: `${tpl.desc} (Varian menu #${numLabel})`,
        harga: Math.max(5000, tpl.harga + priceDelta),
        is_favorit: false,
        created_at: new Date(baseEpochMs - i * 1000).toISOString(),
      });
    }
    await insertBatch(batch, accessToken);
    if (end % 2000 === 0 || end === DUMMY_COUNT_PER_STORE) {
      console.log(`  Progres ${store.namaUsaha}: ${end}/${DUMMY_COUNT_PER_STORE} dummy menu terkirim`);
    }
  }

  const afterCount = await countStoreMenus(store.geraiId, accessToken);
  console.log(`Total menu di ${store.namaUsaha} sekarang: ${afterCount}`);
  return afterCount;
}

async function main() {
  let grandTotal = 0;
  for (const store of STORES) {
    grandTotal += await seedStoreDummyMenus(store);
  }
  console.log(`\nSelesai! Total keseluruhan baris di tabel menu_populer: ${grandTotal}`);
}

main().catch((err) => {
  console.error("ERROR SEED DUMMY:", err);
  process.exit(1);
});
