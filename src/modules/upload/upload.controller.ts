import type { Request, Response, NextFunction } from "express";
import { DIRECTUS_URL, DIRECTUS_STATIC_TOKEN } from "../../config/config.js";

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang dikirim" });
    }

    // Forward file ke Directus Files API menggunakan static token
    const formData = new FormData();
    // Wrap dengan Uint8Array untuk avoid TypeScript SharedArrayBuffer ambiguity
    const blob = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);

    const directusRes = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_STATIC_TOKEN}`,
      },
      body: formData,
    });

    if (!directusRes.ok) {
      const errBody = await directusRes.json().catch(() => ({})) as any;
      const errMsg = errBody?.errors?.[0]?.message ?? "Upload ke Directus gagal";
      return res.status(directusRes.status).json({ message: errMsg });
    }

    const { data } = await directusRes.json() as { data: { id: string } };
    const url = `${DIRECTUS_URL}/assets/${data.id}`;

    return res.status(200).json({ message: "Upload berhasil", data: { url } });
  } catch (error) {
    next(error);
  }
};