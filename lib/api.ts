const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

const KNOWN_MESSAGES: Record<string, string> = {
  'email already exists': 'Já existe um mentorado cadastrado com esse e-mail.',
  'mentee already exists': 'Já existe um mentorado cadastrado com esse e-mail.',
  'mentor not found': 'Mentor não encontrado. Faça login novamente.',
  'mentee not found': 'Mentorado não encontrado.',
  'report not found': 'Relatório não encontrado.',
  'invite not found': 'Convite não encontrado.',
  'invite already used': 'Esse código de convite já foi utilizado.',
  'invite expired': 'Esse código de convite expirou. Gere um novo.',
  'invalid invite code': 'Código de convite inválido. Verifique e tente novamente.',
  'report already exists': 'Esse relatório já foi gerado anteriormente.',
};

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Alguns dados estão incorretos. Verifique os campos e tente novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'O recurso solicitado não foi encontrado.',
  409: 'Este registro já existe. Verifique os dados e tente novamente.',
  422: 'Alguns dados estão incorretos. Verifique os campos e tente novamente.',
  429: 'Muitas tentativas. Aguarde um momento e tente novamente.',
  500: 'Ocorreu um erro inesperado no servidor. Tente novamente em alguns instantes.',
  502: 'O servidor está temporariamente indisponível. Tente novamente em alguns instantes.',
  503: 'O servidor está temporariamente indisponível. Tente novamente em alguns instantes.',
};

function friendlyMessage(status: number, serverMessage?: string): string {
  if (serverMessage) {
    const lower = serverMessage.toLowerCase().trim();
    for (const [key, friendly] of Object.entries(KNOWN_MESSAGES)) {
      if (lower.includes(key)) return friendly;
    }
  }
  return STATUS_MESSAGES[status] ?? 'Algo deu errado. Tente novamente.';
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

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

  if (res.status === 204) return undefined as T;
  return res.json();
}

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

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, file: File, fieldName?: string) =>
    uploadFile<T>(path, file, fieldName),
};
