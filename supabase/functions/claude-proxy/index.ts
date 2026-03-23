// supabase/functions/claude-proxy/index.ts
// Deploy with: supabase functions deploy claude-proxy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { messages, system, image } = await req.json();

    // If an image was passed, inject it into the last user message
    const processedMessages = messages.map((m: any, i: number) => {
      if (i === messages.length - 1 && m.role === "user" && image) {
        return {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: image.mime, data: image.data } },
            { type: "text", text: typeof m.content === "string" ? m.content : m.content },
          ],
        };
      }
      return m;
    });

    const body: any = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: processedMessages,
    };
    if (system) body.system = system;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const text = data.content?.filter((b: any) => b.type === "text").map((b: any) => b.text).join("") ?? "";

    return new Response(JSON.stringify({ text }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
