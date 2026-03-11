"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, User } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB — matches backend limit

interface AvatarUploaderProps {
  currentImageUrl?: string;
  onFileSelected: (file: File) => void;
  onError?: (message: string) => void;
  size?: number;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function AvatarUploader({
  currentImageUrl,
  onFileSelected,
  onError,
  size = 96,
  placeholder,
  label = "Enviar foto",
  className = "",
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl ?? currentImageUrl;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      onError?.("A imagem deve ter no máximo 5MB.");
      e.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelected(file);
    e.target.value = "";
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative overflow-hidden rounded-full bg-zinc-100"
        style={{ width: size, height: size }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        ) : placeholder ? (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
            {placeholder}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="size-8 text-zinc-300" fill="currentColor" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-6 text-white" />
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {label && (
        <span
          className="cursor-pointer text-xs text-zinc-500 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700"
          onClick={() => fileInputRef.current?.click()}
        >
          {label}
        </span>
      )}
    </div>
  );
}
