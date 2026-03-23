import { useState, useRef, useCallback } from "react";
import { callClaude, parseJSON } from "../lib/claude";
import { C, F, css, CONTENT_TYPES, THEMES, TONES, RATING_TAGS } from "../lib/design";
import { SectionCard, CopyBtn, Stars, Spinner, MiniCalendar } from "../components/UI";

function buildFeedbackContext(posts) {
  const rated = (posts || []).filter((p) => p.variants?.some((v) => v.rating > 0));
  if (!rated.length) return "";
  const good = [], bad = [];
  rated.forEach((p) =>
    p.variants?.forEach((v) => {
      if (v.rating >= 4) good.push({ snippet: v.caption?.slice(0, 100), tags: v.tags });
      if (v.rating <= 2) bad.push({ snippet: v.caption?.slice(0, 100), tags: v.tags });
    })
  );
  return `\n\nFEEDBACK STORICO: Caption apprezzate (4-5★): ${JSON.stringify(good)}. Caption non apprezzate (1-2★): ${JSON.stringify(bad)}. Adatta lo stile di conseguenza.`;
}

export default function PianificaTab({ posts, addPost }) {
  const [step, setStep]     = useState("form");
  const [form, setForm]     = useState({ description: "", contentType: "", theme: "", location: "", tone: "", image: null, imageData: null, imageMime: "image/jpeg" });
  const [date, setDate]     = useState("");
  const [variants, setVariants] = useState([]);
  const [ratings, setRatings]   = useState({});
  const [tags, setTags]         = useState({});
  const [saving, setSaving]     = useState(false);
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, image: file.name, imageData: ev.target.result.split(",")[1], imageMime: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const generate = useCallback(async () => {
    setStep("generating");
    try {
      const fb = buildFeedbackContext(posts);
      const prompt = `Sei un esperto di Instagram per fotografi creativi italiani. Genera 3 varianti di caption Instagram in italiano con toni diversi.
Contenuto: ${form.description}. Tipo: ${form.contentType}. Tema: ${form.theme}. Location: ${form.location || "non specificata"}. Tono preferito: ${form.tone}.${fb}
${form.imageData ? "Ho allegato l'immagine: analizzala per rendere la caption ancora più specifica e visiva." : ""}
Rispondi SOLO con JSON (nessun testo extra):
{"variants":[{"tone":"nome tono","caption":"testo caption completo"},{"tone":"...","caption":"..."},{"tone":"...","caption":"..."}],"hashtags":["h1","h2","h3","h4","h5"],"altText":"alt text SEO-ottimizzato max 80 parole"}`;

      const raw = await callClaude(
        [{ role: "user", content: prompt }],
        "",
        form.imageData || null,
        form.imageMime
      );
      const parsed = parseJSON(raw);
      setVariants(parsed.variants.map((v, i) => ({ ...v, hashtags: parsed.hashtags, altText: parsed.altText, id: i })));
      setStep("output");
    } catch (e) {
      console.error(e);
      alert("Errore nella generazione. Controlla la connessione e riprova.");
      setStep("form");
    }
  }, [form, posts]);

  const savePost = async () => {
    setSaving(true);
    const record = {
      date,
      description: form.description,
      content_type: form.contentType,
      theme: form.theme,
      location: form.location || null,
      tone: form.tone,
      variants: variants.map((v, i) => ({ ...v, rating: ratings[i] || 0, tags: tags[i] || [] })),
      hashtags: variants[0]?.hashtags || [],
      alt_text: variants[0]?.altText || "",
    };
    const { error } = await addPost(record);
    setSaving(false);
    if (error) { alert("Errore nel salvataggio. Riprova."); return; }
    setStep("form");
    setForm({ description: "", contentType: "", theme: "", location: "", tone: "", image: null, imageData: null, imageMime: "image/jpeg" });
    setDate(""); setVariants([]); setRatings({}); setTags({});
  };

  const toggleTag = (vi, tag) =>
    setTags((t) => ({ ...t, [vi]: (t[vi] || []).includes(tag) ? (t[vi] || []).filter((x) => x !== tag) : [...(t[vi] || []), tag] }));

  if (step === "generating") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, gap: 20 }}>
      <Spinner size={40} />
      <p style={{ color: C.textMid, fontFamily: F.body, fontSize: 15 }}>Generazione in corso…</p>
    </div>
  );

  if (step === "output") return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: F.head, color: C.text, fontSize: 20, fontWeight: 600 }}>3 Varianti generate</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep("form")} style={css.secondaryBtn}>← Indietro</button>
          <button onClick={savePost} disabled={saving} style={saving ? css.disabledBtn : css.primaryBtn}>
            {saving ? "Salvataggio…" : "Salva nel calendario"}
          </button>
        </div>
      </div>

      {variants.map((v, i) => (
        <SectionCard key={i} style={{ borderLeft: `4px solid ${C.accent}`, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontFamily: F.body, fontWeight: 600 }}>{v.tone}</span>
            <CopyBtn text={v.caption} />
          </div>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, fontFamily: F.body, whiteSpace: "pre-wrap", marginBottom: 16 }}>{v.caption}</p>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            <p style={{ ...css.label, marginBottom: 8 }}>Valuta questa caption</p>
            <Stars value={ratings[i] || 0} onChange={(r) => setRatings((prev) => ({ ...prev, [i]: r }))} />
            {(ratings[i] > 0) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {RATING_TAGS.map((tag) => (
                  <button key={tag} onClick={() => toggleTag(i, tag)} style={css.chip((tags[i] || []).includes(tag))}>{tag}</button>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      ))}

      {variants[0] && (
        <>
          <SectionCard title="Hashtag (5)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {variants[0].hashtags.map((h) => (
                <span key={h} style={{ background: C.accentLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", color: C.text, fontSize: 13, fontFamily: F.body }}>#{h}</span>
              ))}
            </div>
            <CopyBtn text={variants[0].hashtags.map((h) => `#${h}`).join(" ")} />
          </SectionCard>
          <SectionCard title="Alt Text">
            <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, fontFamily: F.body, marginBottom: 8 }}>{variants[0].altText}</p>
            <p style={{ color: C.textLight, fontSize: 11, fontFamily: F.body, marginBottom: 8 }}>→ Modifica post › Impostazioni avanzate › Alt text</p>
            <CopyBtn text={variants[0].altText} />
          </SectionCard>
        </>
      )}
    </div>
  );

  const valid = form.description && form.contentType && form.theme && date;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <SectionCard>
          <label style={css.label}>Descrivi il contenuto</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Cosa hai fotografato? Momento, luce, sensazione specifica…"
            style={{ ...css.input, height: 90, resize: "vertical" }} />
        </SectionCard>
        <SectionCard>
          <label style={css.label}>Immagine / Frame (opzionale)</label>
          <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: "20px 12px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.5)" }}>
            {form.image
              ? <p style={{ color: C.accent, fontFamily: F.body, fontSize: 13 }}>✓ {form.image}</p>
              : <p style={{ color: C.textLight, fontFamily: F.body, fontSize: 13 }}>Carica foto o frame reel</p>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
        <SectionCard>
          <label style={css.label}>Tipo</label>
          {CONTENT_TYPES.map((ct) => (
            <button key={ct.id} onClick={() => setForm((f) => ({ ...f, contentType: ct.id }))}
              style={{ ...css.chip(form.contentType === ct.id), display: "flex", alignItems: "center", gap: 8, width: "100%", marginBottom: 6 }}>
              <span>{ct.icon}</span> {ct.label}
            </button>
          ))}
        </SectionCard>
        <SectionCard>
          <label style={css.label}>Tema</label>
          {THEMES.map((t) => (
            <button key={t} onClick={() => setForm((f) => ({ ...f, theme: t }))}
              style={{ ...css.chip(form.theme === t), width: "100%", marginBottom: 6 }}>{t}</button>
          ))}
        </SectionCard>
        <SectionCard>
          <label style={css.label}>Tono</label>
          {TONES.map((t) => (
            <button key={t} onClick={() => setForm((f) => ({ ...f, tone: t }))}
              style={{ ...css.chip(form.tone === t), width: "100%", marginBottom: 6 }}>{t}</button>
          ))}
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <SectionCard>
          <label style={css.label}>Location (opzionale)</label>
          <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="Es. Firenze, Toscana" style={css.input} />
        </SectionCard>
        <SectionCard>
          <label style={css.label}>Data di pubblicazione</label>
          <MiniCalendar value={date} onChange={setDate} />
        </SectionCard>
      </div>

      <button onClick={generate} disabled={!valid} style={valid ? css.primaryBtn : css.disabledBtn}>
        ✦ Genera 3 varianti di caption
      </button>
    </div>
  );
}
