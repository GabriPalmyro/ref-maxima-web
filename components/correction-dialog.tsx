"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface CorrectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (correction: string) => void;
  isSubmitting: boolean;
}

export function CorrectionDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: CorrectionDialogProps) {
  const [text, setText] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (text.trim().length < 5) return;
    onSubmit(text.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900">
            Corrigir relatório
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mb-3 text-sm text-zinc-500">
          Descreva o que precisa ser corrigido. A IA vai regenerar o relatório
          com base no seu feedback.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: O público-alvo deveria ser mulheres de 30-45 anos, não homens. E a dor principal é falta de tempo, não falta de dinheiro."
          rows={5}
          disabled={isSubmitting}
          className="mb-4 w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none disabled:opacity-50"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || text.trim().length < 5}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(174.04deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
            }}
          >
            {isSubmitting ? "Regenerando..." : "Corrigir e regenerar"}
          </button>
        </div>
      </div>
    </div>
  );
}
