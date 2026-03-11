"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { AvatarUploader } from "@/components/avatar-uploader";

export default function PerfilPage() {
  const router = useRouter();
  const { mentor, updateMentor } = useAuth();
  const [name, setName] = useState(mentor?.name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      let avatarUrl = mentor?.avatarUrl;

      if (avatarFile) {
        const result = await api.upload<{ url: string }>(
          "/mentor/profile/avatar",
          avatarFile,
        );
        avatarUrl = result.url;
      }

      await api.put("/mentor/profile", { name });
      updateMentor({ name, avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Erro ao salvar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FBFBFB] font-(family-name:--font-inter)">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 pr-20">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>

        <h1 className="mb-8 text-2xl font-semibold text-zinc-900">Meu Perfil</h1>

        <div className="max-w-md space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-1">
            <AvatarUploader
              currentImageUrl={mentor?.avatarUrl}
              placeholder={mentor?.name?.[0]?.toUpperCase()}
              onFileSelected={setAvatarFile}
              label="Alterar foto"
            />
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={mentor?.email ?? ""}
              disabled
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-400"
            />
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(174.04deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
            }}
          >
            {isSaving ? "Salvando..." : success ? "Salvo com sucesso!" : "Salvar alterações"}
          </button>
        </div>
      </main>
    </div>
  );
}
