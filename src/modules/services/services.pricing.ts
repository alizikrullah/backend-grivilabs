// ============================================================================
// HARGA KARTU HOMEPAGE
// Diturunkan dari tier, bukan disimpan terpisah — supaya angka harga cuma
// diketik di satu tempat dan tidak pernah bisa beda antara halaman depan dan
// halaman layanan.
//
// Aturannya diuji terhadap tiga kartu yang tampil sebelum fitur ini dibuat,
// dan menghasilkan teks yang persis sama:
//   The Hook           1,3jt / 1,7jt / 2,3jt   -> Rp 1.300.000 – Rp 2.300.000
//   Digital Storefront 3,5jt / 4,5jt / 6jt     -> Rp 3.500.000 – Rp 6.000.000
//   The Engine         10jt / 15jt / "Custom"  -> Mulai Rp 10.000.000
// ============================================================================

type PricedTier = { price: string };

const numbersIn = (raw: string): number[] =>
  [...raw.matchAll(/\d[\d.]*/g)]
    .map((m) => Number(m[0].replace(/\./g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export interface DerivedPrice {
  home_price: string;
  home_price_max: string | null;
}

export const derivePrice = (
  tiers: PricedTier[],
  override?: string | null
): DerivedPrice => {
  if (override) return { home_price: override, home_price_max: null };

  const values: number[] = [];
  // Tier tanpa angka sama sekali ("Custom", "Mulai dari Diagnosa") membuat
  // batas atas jadi terbuka, jadi yang ditampilkan "Mulai dari sekian".
  let openEnded = false;

  for (const t of tiers) {
    const nums = numbersIn(t.price ?? "");
    if (nums.length === 0) openEnded = true;
    else values.push(...nums);
  }

  if (values.length === 0) return { home_price: "Hubungi Kami", home_price_max: null };

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (openEnded) return { home_price: `Mulai ${rupiah(min)}`, home_price_max: null };
  if (min === max) return { home_price: rupiah(min), home_price_max: null };
  return { home_price: rupiah(min), home_price_max: rupiah(max) };
};
