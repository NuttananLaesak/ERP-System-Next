export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const text = await res.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.message || "Something went wrong";

    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: { message, status: res.status },
      }),
    );

    throw new Error(message);
  }

  return data;
}
