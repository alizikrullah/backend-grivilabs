import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import { DIRECTUS_URL, DIRECTUS_STATIC_TOKEN } from "../../config/config.js";

// ─── Konfigurasi konversi ───────────────────────────────────────────────────
//
// Semua gambar disimpan sebagai WebP supaya ukurannya kecil dan seragam.
// Batas 5MB di multer berlaku pada file ASLI sebelum dikonversi — jadi JPG 4MB
// tetap diterima, lalu tersimpan jauh lebih kecil.

const MAX_WIDTH = 1920; // cukup untuk layar besar; foto kamera dikecilkan
const WEBP_QUALITY = 80;

const directusHeaders = { Authorization: `Bearer ${DIRECTUS_STATIC_TOKEN}` };

// ─── Folder ─────────────────────────────────────────────────────────────────
//
// Directus minta ID folder (UUID), bukan namanya. Nama dicari dulu, dibuatkan
// kalau belum ada, lalu hasilnya di-cache supaya tidak query ulang tiap upload.

const folderIdCache = new Map<string, string>();

const resolveFolderId = async (name: string): Promise<string | null> => {
  const cached = folderIdCache.get(name);
  if (cached) return cached;

  try {
    const found = await fetch(
      `${DIRECTUS_URL}/folders?filter[name][_eq]=${encodeURIComponent(name)}&limit=1`,
      { headers: directusHeaders }
    );
    if (found.ok) {
      const { data } = (await found.json()) as { data: { id: string }[] };
      if (data?.[0]?.id) {
        folderIdCache.set(name, data[0].id);
        return data[0].id;
      }
    }

    const created = await fetch(`${DIRECTUS_URL}/folders`, {
      method: "POST",
      headers: { ...directusHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (created.ok) {
      const { data } = (await created.json()) as { data: { id: string } };
      if (data?.id) {
        folderIdCache.set(name, data.id);
        return data.id;
      }
    }
  } catch {
    // Diabaikan — lihat catatan di pemanggilnya.
  }

  return null;
};

// ─── Konversi ───────────────────────────────────────────────────────────────

interface ConvertedFile {
  buffer: Buffer;
  mimetype: string;
  filename: string;
}

const toWebp = async (file: Express.Multer.File): Promise<ConvertedFile> => {
  // Sudah WebP → biarkan apa adanya. Mengonversi ulang hanya menurunkan
  // kualitas tanpa penghematan ukuran yang berarti.
  if (file.mimetype === "image/webp") {
    return {
      buffer: file.buffer,
      mimetype: file.mimetype,
      filename: file.originalname,
    };
  }

  // animated: true → GIF bergerak tetap bergerak setelah jadi WebP. Tanpa ini
  // sharp hanya mengambil frame pertama dan animasinya hilang.
  const input = sharp(file.buffer, { animated: true });
  const { width } = await input.metadata();

  const resized =
    width && width > MAX_WIDTH
      ? input.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : input;

  const buffer = await resized.webp({ quality: WEBP_QUALITY }).toBuffer();
  const filename = file.originalname.replace(/\.[^.]+$/, "") + ".webp";

  return { buffer, mimetype: "image/webp", filename };
};

// ─── Controller ─────────────────────────────────────────────────────────────

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang dikirim" });
    }

    let converted: ConvertedFile;
    try {
      converted = await toWebp(req.file);
    } catch {
      return res
        .status(400)
        .json({ message: "File gambar tidak bisa diproses atau rusak" });
    }

    const formData = new FormData();

    // Kalau folder gagal diambil, upload tetap diteruskan dan filenya masuk ke
    // root. Lebih baik gambar tersimpan di tempat yang kurang rapi daripada
    // upload gagal total hanya karena urusan penempatan folder.
    const folderName =
      typeof req.body?.folder === "string" ? req.body.folder.trim() : "";
    if (folderName) {
      const folderId = await resolveFolderId(folderName);
      if (folderId) formData.append("folder", folderId);
    }

    // Directus mensyaratkan field file berada PALING AKHIR — field teks apa pun
    // yang dikirim setelahnya akan diabaikan.
    const blob = new Blob([new Uint8Array(converted.buffer)], {
      type: converted.mimetype,
    });
    formData.append("file", blob, converted.filename);

    const directusRes = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: directusHeaders,
      body: formData,
    });

    if (!directusRes.ok) {
      const errBody = (await directusRes.json().catch(() => ({}))) as any;
      const errMsg = errBody?.errors?.[0]?.message ?? "Upload ke Directus gagal";
      return res.status(directusRes.status).json({ message: errMsg });
    }

    const { data } = (await directusRes.json()) as { data: { id: string } };
    const url = `${DIRECTUS_URL}/assets/${data.id}`;

    return res.status(200).json({ message: "Upload berhasil", data: { url } });
  } catch (error) {
    next(error);
  }
};
