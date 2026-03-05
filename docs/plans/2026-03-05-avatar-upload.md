# Avatar Upload via Supabase Storage - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add avatar upload endpoints for mentor and mentee using the existing Supabase Storage service, and update the frontend profile page to upload files via multipart FormData.

**Architecture:** Inject the global `STORAGE_PROVIDER` into `MentorService`, add two upload endpoints to `MentorController` using `FileInterceptor` (same pattern as `InstagramDraftController`). Frontend adds an `upload` method to `lib/api.ts` and updates the profile page to use it.

**Tech Stack:** NestJS, Multer/FileInterceptor, Supabase Storage, Next.js, FormData

---

### Task 1: Add avatar upload methods to MentorService

**Files:**
- Modify: `ref-maxima-backend/src/mentor/mentor.service.ts`

**Step 1: Inject STORAGE_PROVIDER**

Add to imports:
```typescript
import { Inject } from '@nestjs/common';
import { STORAGE_PROVIDER, StorageProvider } from '../storage/storage.interface';
```

Add to constructor:
```typescript
constructor(
  private readonly prisma: PrismaService,
  private readonly reportService: ReportService,
  private readonly inviteService: InviteService,
  @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
) {}
```

**Step 2: Add uploadMentorAvatar method**

```typescript
async uploadMentorAvatar(
  mentorId: string,
  file: Buffer,
  contentType: string,
): Promise<{ url: string }> {
  const path = `avatars/mentors/${mentorId}`;
  const url = await this.storage.upload(path, file, contentType);
  await this.prisma.mentor.update({
    where: { id: mentorId },
    data: { avatarUrl: url },
  });
  return { url };
}
```

**Step 3: Add uploadMenteeAvatar method**

```typescript
async uploadMenteeAvatar(
  mentorId: string,
  menteeId: string,
  file: Buffer,
  contentType: string,
): Promise<{ url: string }> {
  await this.verifyMenteeBelongsToMentor(mentorId, menteeId);
  const path = `avatars/mentees/${menteeId}`;
  const url = await this.storage.upload(path, file, contentType);
  await this.prisma.mentee.update({
    where: { id: menteeId },
    data: { avatarUrl: url },
  });
  return { url };
}
```

**Step 4: Commit**

```bash
cd ref-maxima-backend
git add src/mentor/mentor.service.ts
git commit -m "feat: add avatar upload methods to MentorService"
```

---

### Task 2: Add avatar upload endpoints to MentorController

**Files:**
- Modify: `ref-maxima-backend/src/mentor/mentor.controller.ts`

**Step 1: Add required imports**

Add to the existing import from `@nestjs/common`:
```typescript
UseInterceptors, UploadedFile
```

Add new imports:
```typescript
import { FileInterceptor } from '@nestjs/platform-express';
```

**Step 2: Add mentor avatar upload endpoint**

Add after the `updateProfile` method:

```typescript
@Post('profile/avatar')
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
)
uploadMentorAvatar(
  @CurrentUser() user: JwtPayload,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.mentorService.uploadMentorAvatar(
    user.sub,
    file.buffer,
    file.mimetype,
  );
}
```

**Step 3: Add mentee avatar upload endpoint**

Add after the existing mentee endpoints:

```typescript
@Post('mentees/:id/avatar')
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
)
uploadMenteeAvatar(
  @CurrentUser() user: JwtPayload,
  @Param('id') menteeId: string,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.mentorService.uploadMenteeAvatar(
    user.sub,
    menteeId,
    file.buffer,
    file.mimetype,
  );
}
```

**Step 4: Commit**

```bash
cd ref-maxima-backend
git add src/mentor/mentor.controller.ts
git commit -m "feat: add avatar upload endpoints for mentor and mentee"
```

---

### Task 3: Add file upload method to frontend API client

**Files:**
- Modify: `ref-maxima-web/lib/api.ts`

**Step 1: Add upload method**

Add a new `upload` method to the `api` object. This method sends FormData without the `Content-Type: application/json` header (browser sets `multipart/form-data` boundary automatically).

Add this function before the `api` export:

```typescript
async function uploadFile<T>(path: string, file: File, fieldName = 'file'): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('mentor');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(friendlyMessage(res.status, body.message));
  }

  return res.json();
}
```

Add to the `api` export object:
```typescript
upload: <T>(path: string, file: File, fieldName?: string) =>
  uploadFile<T>(path, file, fieldName),
```

**Step 2: Commit**

```bash
cd ref-maxima-web
git add lib/api.ts
git commit -m "feat: add file upload method to API client"
```

---

### Task 4: Update profile page to use file upload endpoint

**Files:**
- Modify: `ref-maxima-web/app/perfil/page.tsx`

**Step 1: Replace the handleSave function**

Replace the current `handleSave` (which converts to base64) with one that:
1. If there's a new avatar file, uploads it via `api.upload` first
2. Then saves the name via `api.put`

Replace the entire `handleSave` function:

```typescript
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
```

Note: The `FileReader` / `readAsDataURL` logic is removed entirely. The `avatarFile` is sent directly as a `File` object to the upload endpoint.

**Step 2: Commit**

```bash
cd ref-maxima-web
git add app/perfil/page.tsx
git commit -m "feat: use file upload endpoint for mentor avatar"
```

---

## Execution Order

1. **Task 1** — Backend: MentorService upload methods
2. **Task 2** — Backend: MentorController upload endpoints
3. **Task 3** — Frontend: API client upload method
4. **Task 4** — Frontend: Profile page uses upload endpoint
