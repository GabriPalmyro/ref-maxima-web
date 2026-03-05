# Web Platform Adjustments - Design Document

**Date:** 2026-03-05
**Scope:** 4 tasks to improve the web platform UX

---

## Task 1: Padronizar Loading de Geracao de Conteudo

**Problem:** Loading states for report generation and headline generation use different components and patterns. Headlines use `LottieAiLoading` (loading-3.json), reports use raw Lottie with loading-2.json.

**Solution:** Create a reusable `FullScreenGenerationLoading` component:
- Full-screen overlay with `loading-2.json` animation centered
- Receives `messages: string[]` prop with rotating messages
- Messages animate in a vertical carousel (slide up, new message appears)
- 3-second interval between messages
- Apply to both `/create-mentorado/result` (report generation) and `/create-mentorado/headlines` (headline generation)

**Messages for headlines:**
- "Analisando o posicionamento..."
- "Criando headlines estrategicas..."
- "Refinando a comunicacao..."
- "Testando variações..."
- "Finalizando as headlines..."

---

## Task 2: Tela de Perfil do Mentor

**Problem:** No profile page exists. Mentor info only shown in sidebar with no edit capability.

**Solution:**
- New route `/perfil/page.tsx`
- Accessible by clicking mentor avatar or name in sidebar
- Shows: avatar (editable), name (editable), email (read-only)
- Photo edit: click on avatar to upload new image (store as URL via backend `PUT /mentor/profile`)
- Save button calls `PUT /mentor/profile` with updated name and avatarUrl
- After save, update AuthContext so sidebar reflects changes

---

## Task 3: Dashboard Links para Mentorado

**Problem:** Clicking mentee name in dashboard doesn't navigate to their detail page.

**Solution:**
- Make mentee name in dashboard table a clickable `<Link>` to `/mentorados/[id]`
- Keep the eye icon button also navigating to the same page

---

## Task 4: Typewriter na Geracao de Report

**Problem:** When a report finishes generating, it appears all at once. No visual feedback of "AI writing."

**Solution:**
- Use existing `TypewriterText` component in `/create-mentorado/result`
- When polling detects report status changed to COMPLETED, render content with typewriter effect
- Only on first generation (during creation flow), not on revisits
- After typewriter completes, show the action buttons (next round, etc.)
