import { useState } from "react";
import { callClaude, parseJSON } from "../lib/claude";
import { C, F, css } from "../lib/design";
import { SectionCard, Spinner, Row } from "../components/UI";

export default function CompetitorsTab({ competitors, saveCompetitor }) {
  const [handle,  setHandle]  = useState("");
  const [loading, setLoading] = useState(false);
  const [report,  setReport]  = useState(null);

  const analyze = async () => {
    if (!handle) return;
    setLoading(true); setReport(null);
    try {
      const prompt = `Sei un esperto di strategia Instagram per fotografi. Analizza il profilo @${handle} e fornisci un report strategico.
Rispondi SOLO con JSON:
{"handle":"${handle}","profileType":"descrizione tipo account","captionAnalysis":{"avgLength":"corta/media/lunga","tone":"tono prevalente","hookStyle":"come aprono","ctaStyle":"tipo CTA","keyPatterns":["p1","p2","p3"]},"contentStrategy":{"postTypes":"mix contenuti","themes":["t1","t2"],"frequency":"frequenza stimata"},"hashtags":{"style":"approccio","examples":["h1","h2","h3"]},"strengths":["s1","s2","s3"],"weaknesses":["w1","w2"],"applicableInsights":["insight per @man_withthelens 1","insight 2","insight 3","insight 4"]}`;

      const raw = await callClaude([{ role: "user", content: prompt }]);
      const parsed = parseJSON(raw);
      setReport(parsed);
      await saveCompetitor(handle, parsed);
    } catch {
      alert("Errore nell'analisi. Riprova.");
    }
    setLoading(false);
  };

  return (
    <div>
      <SectionCard>
        <label style={css.label}>Analizza un competitor</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={handle} onChange={(e) => setHandle(e.target.value.replace("@", ""))}
            placeholder="handle senza @ (es. fotografo_italiano)"
            style={{ ...css.input, flex: 1 }}
            onKeyDown={(e) => e.key === "Enter" && analyze()} />
          <button onClick={analyze} disabled={loading || !handle} style={handle && !loading ? css.primaryBtn : css.disabledBtn}>
            {loading ? "Analisi…" : "Analizza"}
          </button>
        </div>

        {competitors.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <p style={{ ...css.label, marginBottom: 8 }}>Analizzati di recente</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {competitors.map((c) => (
                <button key={c.handle} onClick={() => { setHandle(c.handle); setReport(c.report); }}
                  style={css.chip(report?.handle === c.handle)}>@{c.handle}</button>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20 }}>
          <Spinner size={24} />
          <p style={{ color: C.textMid, fontFamily: F.body }}>Analisi in corso…</p>
        </div>
      )}

      {report && !loading && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontFamily: F.head, fontSize: 18, fontWeight: 700 }}>
              {report.handle?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ color: C.text, fontFamily: F.head, fontSize: 18, fontWeight: 600 }}>@{report.handle}</p>
              <p style={{ color: C.textLight, fontSize: 12, fontFamily: F.body }}>{report.profileType}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <SectionCard title="Stile caption">
              <Row label="Lunghezza" val={report.captionAnalysis?.avgLength} />
              <Row label="Tono"      val={report.captionAnalysis?.tone} />
              <Row label="Hook"      val={report.captionAnalysis?.hookStyle} />
              <Row label="CTA"       val={report.captionAnalysis?.ctaStyle} />
              {report.captionAnalysis?.keyPatterns?.map((p, i) => <Row key={i} label={`Pattern`} val={p} />)}
            </SectionCard>
            <SectionCard title="Strategia">
              <Row label="Mix"       val={report.contentStrategy?.postTypes} />
              <Row label="Frequenza" val={report.contentStrategy?.frequency} />
              {report.contentStrategy?.themes?.map((t, i) => <Row key={i} label="Tema" val={t} />)}
              <Row label="Hashtag"   val={report.hashtags?.style} />
            </SectionCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <SectionCard title="Punti di forza">
              {report.strengths?.map((s, i) => (
                <p key={i} style={{ color: C.text, fontSize: 13, fontFamily: F.body, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>✓ {s}</p>
              ))}
            </SectionCard>
            <SectionCard title="Debolezze">
              {report.weaknesses?.map((w, i) => (
                <p key={i} style={{ color: C.text, fontSize: 13, fontFamily: F.body, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>↓ {w}</p>
              ))}
            </SectionCard>
          </div>

          <SectionCard title="💡 Insight applicabili a @man_withthelens" style={{ borderLeft: `4px solid ${C.accent}` }}>
            {report.applicableInsights?.map((ins, i) => (
              <p key={i} style={{ color: C.text, fontSize: 14, fontFamily: F.body, padding: "8px 0", borderBottom: i < report.applicableInsights.length - 1 ? `1px solid ${C.border}` : "none", lineHeight: 1.5 }}>
                <span style={{ color: C.accent, fontWeight: 700, marginRight: 8 }}>{i + 1}.</span>{ins}
              </p>
            ))}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
