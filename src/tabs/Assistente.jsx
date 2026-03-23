import { useState, useRef, useEffect } from "react";
import { callClaude } from "../lib/claude";
import { C, F, css } from "../lib/design";

const SUGGESTIONS = [
  "Dammi 5 idee di contenuto per la settimana prossima",
  "Analizza i miei dati e dimmi cosa funziona meglio",
  "Come posso migliorare l'hook delle mie caption?",
  "Suggeriscimi location interessanti in Puglia",
];

function buildSystem(posts) {
  const ratedVariants = posts.flatMap((p) => (p.variants || []).filter((v) => v.rating > 0));
  const avgRating = ratedVariants.length
    ? (ratedVariants.reduce((a, v) => a + v.rating, 0) / ratedVariants.length).toFixed(1) : null;
  const topTags = {};
  ratedVariants.forEach((v) => v.tags?.forEach((t) => { topTags[t] = (topTags[t] || 0) + 1; }));
  const sortedTags = Object.entries(topTags).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const themes = [...new Set(posts.map((p) => p.theme).filter(Boolean))];
  const recentPosts = posts.slice(-5).map((p) => `${p.date} — ${p.theme} (${p.content_type})`).join(", ");

  return `Sei un esperto di strategia Instagram e content creation per fotografi creativi italiani. Stai assistendo @man_withthelens, un fotografo italiano che pubblica paesaggi, street, architettura e travel dalla Puglia e non solo.

DATI AGGIORNATI DEL PROFILO:
- Post pianificati in totale: ${posts.length}
- Temi usati: ${themes.join(", ") || "nessuno ancora"}
- Caption valutate: ${ratedVariants.length}
- Rating medio: ${avgRating ? `${avgRating}/5` : "nessuna valutazione ancora"}
- Tag qualitativi più usati: ${sortedTags.join(", ") || "nessuno"}
- Ultimi post pianificati: ${recentPosts || "nessuno"}

Rispondi sempre in italiano, in modo diretto, concreto e creativo. Quando suggerisci idee sii specifico: location, ora del giorno, luce, composizione, tono della caption. Usa i dati reali del profilo per dare consigli personalizzati.`;
}

export default function AssistenteTab({ posts, messages, addMessage, clearHistory, setLoading, loading }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    await addMessage("user", userText);
    setLoading(true);
    try {
      const apiMessages = [...messages, { role: "user", content: userText }]
        .map((m) => ({ role: m.role, content: m.content }));
      const raw = await callClaude(apiMessages, buildSystem(posts));
      await addMessage("assistant", raw);
    } catch {
      await addMessage("assistant", "Errore nella risposta. Controlla la connessione e riprova.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "65vh" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "12px 16px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? C.accent : "rgba(255,255,255,0.88)",
              border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
              color: m.role === "user" ? "#fff" : C.text,
              fontSize: 14, fontFamily: F.body, lineHeight: 1.7, whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.88)", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight, animation: `bounce 0.9s ${i * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => setInput(s)}
              style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.7)", color: C.text, cursor: "pointer", fontSize: 12, fontFamily: F.body }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Scrivi un messaggio… (Invio per inviare, Shift+Invio per andare a capo)"
          style={{ ...css.input, flex: 1, resize: "none", height: 44, paddingTop: 12 }} />
        <button onClick={send} disabled={loading || !input.trim()} style={input.trim() && !loading ? css.primaryBtn : css.disabledBtn}>
          Invia
        </button>
        {messages.length > 1 && (
          <button onClick={clearHistory} style={{ ...css.secondaryBtn, fontSize: 12, padding: "11px 14px", color: C.textLight }}>
            Cancella
          </button>
        )}
      </div>
    </div>
  );
}
