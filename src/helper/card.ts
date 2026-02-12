export async function getImplementedCardIds(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SECURE_CONNECTION === 'true' ? 'https://' : 'http://'}${process.env.NEXT_PUBLIC_SERVER_HOST}/api/cards`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
