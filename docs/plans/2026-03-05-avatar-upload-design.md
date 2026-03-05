# Avatar Upload via Supabase Storage - Design Document

**Date:** 2026-03-05

## Backend
- `POST /mentor/profile/avatar` — mentor uploads own avatar. Path: `avatars/mentors/{mentorId}.jpg`. Updates `avatarUrl` in DB. Returns `{ url }`.
- `POST /mentor/mentees/:id/avatar` — mentor uploads mentee avatar. Path: `avatars/mentees/{menteeId}.jpg`. Updates `avatarUrl` in DB. Returns `{ url }`.
- Both use `FileInterceptor` with 5MB limit, inject `STORAGE_PROVIDER`.

## Frontend
- `/perfil` page sends file via FormData to `POST /mentor/profile/avatar`, receives URL, updates AuthContext.
- Removes base64 data URL approach.
