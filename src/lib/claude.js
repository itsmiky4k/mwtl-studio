// Calls Anthropic via a Supabase Edge Function so the API key never hits the browser
export async function callClaude(messages, system = "", imageBase64 = null, imageMime = "image/jpeg") {
  const body = { messages, system };
  if (imageBase64) body.image = { data: imageBase64, mime: imageMime };

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude proxy error: ${err}`);
  }

  const data = await res.json();
  return data.text;
}

export function parseJSON(raw) {
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}
