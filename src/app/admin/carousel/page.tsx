"use client";

import { useCallback, useEffect, useState } from "react";

type CarouselImage = {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
};

export default function AdminCarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const loadImages = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/carousel");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load carousel images");
        setImages([]);
        return;
      }
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load carousel images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (images.length === 0) {
      setDisplayOrder(0);
      return;
    }
    const max = Math.max(...images.map((i) => i.display_order ?? 0));
    setDisplayOrder(max + 1);
  }, [images]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose an image file");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "carousel");
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        setError(typeof uploadData.error === "string" ? uploadData.error : "Upload failed");
        return;
      }
      const url = uploadData.url as string;
      const createRes = await fetch("/api/admin/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: url,
          alt_text: altText,
          display_order: displayOrder,
        }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        setError(typeof createData.error === "string" ? createData.error : "Failed to save image");
        return;
      }
      setFile(null);
      setAltText("");
      setFileInputKey((k) => k + 1);
      await loadImages();
    } catch {
      setError("Something went wrong while adding the image");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this carousel image?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/carousel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to delete");
        return;
      }
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      setError("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Manage Carousel Images</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Upload images and set alt text and display order for the homepage slideshow.
      </p>

      {error && (
        <div
          className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="mt-6 rounded-xl border border-brand-green/25 bg-surface-card p-5"
      >
        <h2 className="font-display text-lg font-black text-text-primary">Add image</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
              File
            </label>
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:font-body file:text-sm file:font-bold file:text-surface-base"
            />
          </div>
          <div>
            <label
              htmlFor="carousel-alt"
              className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted"
            >
              Alt text
            </label>
            <input
              id="carousel-alt"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted"
              placeholder="Describe the image"
            />
          </div>
          <div>
            <label
              htmlFor="carousel-order"
              className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted"
            >
              Display order
            </label>
            <input
              id="carousel-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving || loading}
          className="mt-4 rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Upload and add"}
        </button>
      </form>

      {loading ? (
        <p className="mt-8 font-body text-sm text-text-secondary">Loading carousel images…</p>
      ) : images.length === 0 ? (
        <p className="mt-8 font-body text-sm text-text-muted">No carousel images yet. Add one above.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex flex-col overflow-hidden rounded-xl border border-brand-green/25 bg-surface-card"
            >
              <div className="relative aspect-video w-full bg-surface-base">
                <img
                  src={img.image_url}
                  alt={img.alt_text || "Carousel preview"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                  Alt text
                </p>
                <p className="mt-1 font-body text-sm text-text-primary">{img.alt_text || "—"}</p>
                <p className="mt-3 font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                  Display order
                </p>
                <p className="mt-1 font-body text-sm text-text-secondary">{img.display_order}</p>
                <button
                  type="button"
                  onClick={() => void handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deletingId === img.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
