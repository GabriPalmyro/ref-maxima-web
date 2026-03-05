"use client";

interface DraftPost {
  position: number;
  imageUrl: string;
  originalPostId?: string;
}

interface InstagramPhonePreviewProps {
  fullName: string | null;
  biography: string | null;
  profilePicUrl: string | null;
  externalUrl: string | null;
  posts: DraftPost[];
  updatedAt?: string | null;
}

export function InstagramPhonePreview({
  fullName,
  biography,
  profilePicUrl,
  externalUrl,
  posts,
  updatedAt,
}: InstagramPhonePreviewProps) {
  const sortedPosts = [...posts].sort((a, b) => a.position - b.position);

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div>
      {formattedDate && (
        <p className="mb-3 text-center text-xs font-medium text-zinc-400">
          Atualizado em {formattedDate}
        </p>
      )}
    {/* 932px * (1 - 0.65) ≈ 326px — compensates for space left by CSS scale */}
    <div className="origin-top" style={{ transform: "scale(0.65)", marginBottom: "-326px" }}>
    <div
      className="relative mx-auto h-[932px] w-[430px] overflow-hidden rounded-[40px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      style={{
        backgroundImage:
          "linear-gradient(155.23deg, rgb(255, 255, 255) 29.83%, rgb(237, 224, 206) 100%)",
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-8 pt-4">
        <span className="text-[17px] font-semibold text-black">9:41</span>
        <div className="flex items-center gap-1.5">
          {/* Signal */}
          <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="1" fill="black" />
            <rect x="5" y="2.5" width="3" height="9.5" rx="1" fill="black" />
            <rect x="10" y="1" width="3" height="11" rx="1" fill="black" />
            <rect x="15" y="0" width="3" height="12" rx="1" fill="black" />
          </svg>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="black" />
            <path d="M4.5 7.5a5 5 0 017 0" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 4.5a9 9 0 0112 0" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {/* Battery */}
          <svg width="28" height="13" viewBox="0 0 28 13" fill="none">
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="black" strokeOpacity="0.35" />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="black" />
            <path d="M25 4.5v4a2 2 0 000-4z" fill="black" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Profile section */}
      <div className="mt-4 flex items-center gap-6 px-5">
        {/* Profile pic with gradient ring */}
        <div className="relative flex size-[103px] shrink-0 items-center justify-center">
          {/* Gradient ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
              padding: "3px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt={fullName ?? "Profile"}
              className="size-[95px] rounded-full object-cover"
            />
          ) : (
            <div className="flex size-[95px] items-center justify-center rounded-full bg-zinc-200 text-2xl text-zinc-400">
              ?
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-1 justify-around text-center">
          <div>
            <p className="text-[16px] font-semibold tracking-tight text-[#212121]">
              {sortedPosts.length}
            </p>
            <p className="text-[12px] font-medium tracking-tight text-[#212121]">
              Publicacoes
            </p>
          </div>
          <div>
            <p className="text-[16px] font-semibold tracking-tight text-[#212121]">
              --
            </p>
            <p className="text-[12px] font-medium tracking-tight text-[#212121]">
              Seguidores
            </p>
          </div>
          <div>
            <p className="text-[16px] font-semibold tracking-tight text-[#212121]">
              --
            </p>
            <p className="text-[12px] font-medium tracking-tight text-[#212121]">
              Seguindo
            </p>
          </div>
        </div>
      </div>

      {/* Name + Bio */}
      <div className="mt-3 px-5">
        {fullName && (
          <p className="text-[14px] font-semibold tracking-tight text-[#212121]">
            {fullName}
          </p>
        )}
        {biography && (
          <p className="mt-0.5 whitespace-pre-line text-[14px] tracking-tight text-[#212121]">
            {biography}
          </p>
        )}
        {externalUrl && (
          <p className="mt-0.5 text-[14px] tracking-tight text-[#1b538c]">
            {externalUrl.replace(/^https?:\/\//, "")}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-[9px] px-4">
        <div className="flex h-[35px] flex-1 items-center justify-center rounded-[7px] bg-[#3597f0]">
          <span className="text-[14px] font-semibold text-white">Seguir</span>
        </div>
        <div className="flex h-[35px] flex-1 items-center justify-center rounded-[4px] bg-[#efefef]">
          <span className="text-[14px] font-semibold text-[#212121]">
            Mensagem
          </span>
        </div>
        <div className="flex h-[35px] flex-1 items-center justify-center rounded-[4px] bg-[#efefef]">
          <span className="text-[14px] font-semibold text-[#212121]">
            Contactar
          </span>
        </div>
      </div>

      {/* Tab icons */}
      <div className="mt-4 flex border-b border-zinc-200">
        <div className="flex flex-1 items-center justify-center border-b-2 border-black py-2.5">
          {/* Grid icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="8" height="8" stroke="black" strokeWidth="1.5" />
            <rect x="13" y="1" width="8" height="8" stroke="black" strokeWidth="1.5" />
            <rect x="1" y="13" width="8" height="8" stroke="black" strokeWidth="1.5" />
            <rect x="13" y="13" width="8" height="8" stroke="black" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="flex flex-1 items-center justify-center py-2.5 opacity-40">
          {/* Reels icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="20" height="20" rx="3" stroke="black" strokeWidth="1.5" />
            <path d="M1 8h20M8 1l-3 7M17 1l-3 7" stroke="black" strokeWidth="1.5" />
            <path d="M9 13l5 3-5 3V13z" fill="black" />
          </svg>
        </div>
        <div className="flex flex-1 items-center justify-center py-2.5 opacity-40">
          {/* Tagged icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="3" y="3" width="16" height="16" rx="1" stroke="black" strokeWidth="1.5" />
            <circle cx="11" cy="9" r="3" stroke="black" strokeWidth="1.5" />
            <path d="M5 19c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="black" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {sortedPosts.map((post) => (
          <div key={post.position} className="relative aspect-square overflow-hidden">
            <img
              src={post.imageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Bottom home indicator */}
      <div className="absolute bottom-2 left-1/2 h-[5px] w-[123px] -translate-x-1/2 rounded-full bg-black" />
    </div>
    </div>
    </div>
  );
}
