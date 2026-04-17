"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const gridCols = 21;
const gridRows = 7;

function GridPattern() {
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-surface-base">
      {Array.from({ length: gridRows * gridCols }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-8 w-8 shrink-0 rounded-[2px]",
            i % 2 === 0
              ? "bg-surface-card"
              : "bg-surface-card shadow-[0px_0px_1px_3px_rgba(0,0,0,0.4)_inset]",
          )}
        />
      ))}
    </div>
  );
}

type AvatarUploadProps = {
  currentUrl?: string;
  name?: string;
  onUploaded: (url: string) => void;
};

export function AvatarUpload({ currentUrl, name, onUploaded }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || currentUrl;
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const upload = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5 MB.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setUploading(true);

      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/portal/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        onUploaded(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  return (
    <div className="space-y-2">
      <span className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
        Profile photo
      </span>

      <motion.div
        whileHover="hover"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          dragActive
            ? "border-brand-green bg-brand-green/5"
            : "border-brand-green/25 hover:border-brand-green/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-8">
          {displayUrl ? (
            <motion.div
              variants={{ hover: { scale: 1.05 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <img
                src={displayUrl}
                alt={name ?? "Avatar"}
                className={cn(
                  "h-24 w-24 rounded-xl object-cover shadow-lg ring-2 ring-brand-green/30 transition-all",
                  uploading && "animate-pulse opacity-70",
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <UploadIcon className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={{
                hover: { y: -4, boxShadow: "0 12px 30px rgba(27, 138, 61, 0.25)" },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex h-24 w-24 items-center justify-center rounded-xl bg-surface-card shadow-md ring-2 ring-brand-green/20"
            >
              {dragActive ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-body text-sm font-bold text-brand-green"
                >
                  Drop it
                </motion.span>
              ) : (
                <UploadIcon className="h-6 w-6 text-text-muted transition-colors group-hover:text-brand-green" />
              )}
            </motion.div>
          )}

          <div className="text-center">
            <p className="font-body text-sm font-bold text-text-secondary group-hover:text-text-primary">
              {uploading
                ? "Uploading…"
                : displayUrl
                  ? "Click or drag to replace"
                  : "Click or drag to upload"}
            </p>
            <p className="mt-1 font-body text-xs text-text-muted">
              JPG, PNG, WebP or GIF · Max 5 MB
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 font-body text-xs font-bold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
