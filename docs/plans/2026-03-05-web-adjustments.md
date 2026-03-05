# Web Platform Adjustments - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Standardize loading states, add mentor profile page, make dashboard mentee names clickable, and add typewriter animation to report generation.

**Architecture:** 4 independent UI tasks in the Next.js web app. A new reusable loading component replaces inconsistent loading patterns. A new `/perfil` route with form. Dashboard table gets clickable links. Existing `TypewriterText` component gets integrated into the result page.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Lottie, existing component library

---

### Task 1: Create FullScreenGenerationLoading Component

**Files:**
- Create: `components/fullscreen-generation-loading.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/animations/loading-2.json";

interface FullScreenGenerationLoadingProps {
  messages: string[];
  intervalMs?: number;
}

export function FullScreenGenerationLoading({
  messages,
  intervalMs = 3000,
}: FullScreenGenerationLoadingProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [messages.length, intervalMs]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F8F5]">
      <Lottie animationData={loadingAnimation} loop className="w-28" />
      <div className="mt-4 h-6">
        <p
          className={`text-sm text-zinc-400 transition-all duration-400 ${
            visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/fullscreen-generation-loading.tsx
git commit -m "feat: add FullScreenGenerationLoading reusable component"
```

---

### Task 2: Apply FullScreenGenerationLoading to Report Result Page

**Files:**
- Modify: `app/create-mentorado/result/page.tsx`

**Step 1: Replace inline loading with new component**

Changes needed:
1. Remove the `RotatingText` component (lines 23-47) and `LOADING_MESSAGES` array (lines 13-21)
2. Remove `import Lottie from "lottie-react"` and `import loadingAnimation` (lines 5-6)
3. Add import: `import { FullScreenGenerationLoading } from "@/components/fullscreen-generation-loading";`
4. Replace the polling state block (lines 241-264) with:

```tsx
{isPolling && (
  <FullScreenGenerationLoading
    messages={[
      "Analisando as respostas...",
      "Construindo o perfil estratégico...",
      "Identificando padrões comportamentais...",
      "Mapeando desejos e dores...",
      "Gerando diagnóstico profundo...",
      "Estruturando o posicionamento...",
      "Finalizando o documento...",
    ]}
  />
)}
```

**Step 2: Commit**

```bash
git add app/create-mentorado/result/page.tsx
git commit -m "feat: use FullScreenGenerationLoading in report result page"
```

---

### Task 3: Apply FullScreenGenerationLoading to Headlines Page

**Files:**
- Modify: `app/create-mentorado/headlines/page.tsx`

**Step 1: Replace headline loading with new component**

Changes needed:
1. Remove import of `LottieAiLoading` (line 5)
2. Add import: `import { FullScreenGenerationLoading } from "@/components/fullscreen-generation-loading";`
3. Replace the loading block (lines 71-76) with:

```tsx
if (isLoading) {
  return (
    <FullScreenGenerationLoading
      messages={[
        "Analisando o posicionamento...",
        "Criando headlines estratégicas...",
        "Refinando a comunicação...",
        "Testando variações...",
        "Finalizando as headlines...",
      ]}
    />
  );
}
```

4. Also wrap `isRegenerating` state with the same loading. Add a check before the return of the main content:

```tsx
if (isRegenerating) {
  return (
    <FullScreenGenerationLoading
      messages={[
        "Regenerando headlines...",
        "Criando novas variações...",
        "Refinando a comunicação...",
        "Finalizando as headlines...",
      ]}
    />
  );
}
```

**Step 2: Commit**

```bash
git add app/create-mentorado/headlines/page.tsx
git commit -m "feat: use FullScreenGenerationLoading in headlines page"
```

---

### Task 4: Make Sidebar Mentor Name/Avatar Clickable

**Files:**
- Modify: `components/sidebar.tsx`

**Step 1: Wrap mentor avatar+name in a clickable area**

Changes needed:
1. Replace the mentor info block (lines 29-52) — wrap the avatar and name in a `button` or `div` with `onClick={() => router.push("/perfil")}`, and remove the `ChevronsUpDown` button:

```tsx
<button
  type="button"
  onClick={() => router.push("/perfil")}
  className="mb-12 flex w-full items-center gap-3 rounded-lg p-1 transition-colors hover:bg-zinc-50"
>
  <div className="relative h-[25px] w-[25px] overflow-hidden rounded-lg bg-zinc-100">
    {mentor?.avatarUrl && (
      <Image
        src={mentor.avatarUrl}
        alt={mentor.name}
        fill
        className="object-cover"
      />
    )}
  </div>
  <div className="min-w-0 flex-1">
    <p className="truncate text-left text-base font-medium text-zinc-900">
      {mentor?.name ?? "Carregando..."}
    </p>
  </div>
</button>
```

**Step 2: Commit**

```bash
git add components/sidebar.tsx
git commit -m "feat: make sidebar mentor name/avatar navigate to /perfil"
```

---

### Task 5: Create Mentor Profile Page

**Files:**
- Create: `app/perfil/page.tsx`
- Modify: `contexts/auth-context.tsx` (add `updateMentor` method)

**Step 1: Add `updateMentor` to AuthContext**

In `contexts/auth-context.tsx`, add a new method to the context:

```tsx
// Add to AuthContextValue interface:
updateMentor: (updated: Partial<Mentor>) => void;

// Add implementation inside AuthProvider:
const updateMentor = (updated: Partial<Mentor>) => {
  setMentor((prev) => {
    if (!prev) return prev;
    const merged = { ...prev, ...updated };
    localStorage.setItem('mentor', JSON.stringify(merged));
    return merged;
  });
};

// Add to Provider value:
<AuthContext.Provider value={{ token, mentor, login, logout, updateMentor }}>
```

**Step 2: Create the profile page**

```tsx
"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";

export default function PerfilPage() {
  const router = useRouter();
  const { mentor, updateMentor } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(mentor?.name ?? "");
  const [avatarPreview, setAvatarPreview] = useState(mentor?.avatarUrl ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      let avatarUrl = mentor?.avatarUrl;

      if (avatarFile) {
        // Upload avatar as base64 or FormData depending on backend support
        // For now, send as base64 data URL
        const reader = new FileReader();
        avatarUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });
      }

      await api.put("/mentor/profile", { name, avatarUrl });
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
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-24 w-24 overflow-hidden rounded-full bg-zinc-100"
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
                  {mentor?.name?.[0]?.toUpperCase() ?? "?"}
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
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-zinc-400">Clique para alterar a foto</p>
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
```

**Step 3: Commit**

```bash
git add contexts/auth-context.tsx app/perfil/page.tsx
git commit -m "feat: add mentor profile page with avatar and name editing"
```

---

### Task 6: Make Dashboard Mentee Names Clickable

**Files:**
- Modify: `app/home/page.tsx`

**Step 1: Make mentee name a clickable link**

In the mentee row (around line 340), wrap the mentee name `<p>` in a clickable element:

Replace line 340:
```tsx
<p className="truncate text-[12px] font-semibold text-[#71717a]">
  {mentee.name}
</p>
```

With:
```tsx
<button
  type="button"
  onClick={() => router.push(`/mentorados/${mentee.id}`)}
  className="truncate text-[12px] font-semibold text-[#71717a] hover:text-zinc-900 hover:underline"
>
  {mentee.name}
</button>
```

**Step 2: Commit**

```bash
git add app/home/page.tsx
git commit -m "feat: make dashboard mentee names clickable to detail page"
```

---

### Task 7: Add Typewriter Effect to Report Generation

**Files:**
- Modify: `app/create-mentorado/result/page.tsx`
- Modify: `components/typewriter-text.tsx` (extend to support React nodes)

**Step 1: Create a TypewriterReport wrapper component**

The existing `TypewriterText` only handles plain text strings. For the report we need to typewrite the `rawResponse` markdown. Add a new component in the result page that wraps the report content with typewriter on the raw text:

In `app/create-mentorado/result/page.tsx`, add state and logic:

1. Add a new state: `const [showTypewriter, setShowTypewriter] = useState(false);`
2. Add: `const [typewriterComplete, setTypewriterComplete] = useState(false);`
3. When polling finds a completed report AND `generating` is true, set `showTypewriter = true`
4. Import `TypewriterText`

In the polling effect, when report is found completed (around line 135-137), change to:

```tsx
if (found && found.status === "COMPLETED") {
  setReport(found);
  if (generating) setShowTypewriter(true);
  stopPolling();
  if (round === 3) fetchInviteCode();
}
```

In the report completed section (line 330-336), replace the `ReportRenderer` with a conditional:

```tsx
{showTypewriter && !typewriterComplete ? (
  <TypewriterText
    text={report.rawResponse ?? ""}
    speed={5}
    onComplete={() => setTypewriterComplete(true)}
  />
) : (
  <ReportRenderer
    type={report.type}
    structuredContent={report.structuredContent}
    rawResponse={report.rawResponse}
  />
)}
```

5. Hide action buttons while typewriter is running — modify the condition at line 372:

```tsx
{!isPolling && !pollError && (!showTypewriter || typewriterComplete) && (
```

**Step 2: Commit**

```bash
git add app/create-mentorado/result/page.tsx
git commit -m "feat: add typewriter animation during report generation"
```

---

## Execution Order

Tasks are independent and can be executed in order 1→7:

1. **Task 1** — Create `FullScreenGenerationLoading` component
2. **Task 2** — Apply to report result page
3. **Task 3** — Apply to headlines page
4. **Task 4** — Make sidebar mentor clickable
5. **Task 5** — Create mentor profile page
6. **Task 6** — Make dashboard mentee names clickable
7. **Task 7** — Add typewriter effect to report generation
