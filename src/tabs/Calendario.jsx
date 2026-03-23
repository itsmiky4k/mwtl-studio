import { useState } from "react";
import { C, F, css, DAYS, TYPE_COLOR, TYPE_ICON } from "../lib/design";
import { SectionCard } from "../components/UI";

export default function CalendarioTab({ posts, deletePost, loading }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year,  setYear]  = useState(new Date().getFullYear());
  const [selected, setSelected] = useState(null);

  const firstDay  = new Date(year, month, 1).getDay();
  const offset    = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  const fmt = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const byDate = {};
  posts.filter((p) => p.date?.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
    .forEach((p) => { if (!byDate[p.date]) byDate[p.date] = []; byDate[p.date].push(p); });

  const avgRating = (post) => {
    const rated = post.variants?.filter((v) => v.rating > 0);
    if (!rated?.length) return null;
    return (rated.reduce((a, v) => a + v.rating, 0) / rated.length).toFixed(1);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setSelected(null);
  };

  const postsThisMonth = Object.values(byDate).flat().length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
      <SectionCard style={{ marginBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => { month === 0 ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1); }}
            style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 18 }}>‹</button>
          <span style={{ color: C.text, fontFamily: F.head, fontSize: 16, fontWeight: 600, textTransform: "capitalize" }}>{monthName}</span>
          <button onClick={() => { month === 11 ? (setMonth(0), setYear((y) => y + 1)) : setMonth((m) => m + 1); }}
            style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 18 }}>›</button>
        </div>

        {loading ? (
          <p style={{ color: C.textLight, fontFamily: F.body, textAlign: "center", padding: 20 }}>Caricamento…</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {DAYS.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 10, color: C.textLight, fontFamily: F.body, padding: "4px 0", fontWeight: 600 }}>{d}</div>)}
            {Array(offset).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const d = i + 1; const fd = fmt(d);
              const dayPosts = byDate[fd] || [];
              const isSelected = selected?.date === fd;
              return (
                <div key={d} onClick={() => dayPosts.length && setSelected(dayPosts[0])}
                  style={{ minHeight: 54, borderRadius: 8, padding: "4px 4px 4px 6px", background: isSelected ? C.accentLight : dayPosts.length ? "rgba(255,255,255,0.8)" : "transparent", border: `1px solid ${dayPosts.length ? C.border : "transparent"}`, cursor: dayPosts.length ? "pointer" : "default", transition: "all 0.15s" }}>
                  <span style={{ color: C.textMid, fontSize: 11, fontFamily: F.body, fontWeight: 600 }}>{d}</span>
                  {dayPosts.map((p, pi) => (
                    <div key={pi} style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                      <span style={{ color: TYPE_COLOR[p.content_type] || C.accent, fontSize: 10 }}>{TYPE_ICON[p.content_type] || "•"}</span>
                      <span style={{ color: C.textMid, fontSize: 9, fontFamily: F.body, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 38 }}>{p.theme}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          {Object.entries(TYPE_COLOR).map(([t, c]) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, color: C.textLight, fontSize: 11, fontFamily: F.body }}>
              <span style={{ color: c }}>{TYPE_ICON[t]}</span> {t}
            </span>
          ))}
          <span style={{ marginLeft: "auto", color: C.textLight, fontSize: 11, fontFamily: F.body }}>{postsThisMonth} post pianificati</span>
        </div>
      </SectionCard>

      {selected && (
        <div>
          <SectionCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <p style={{ color: C.text, fontFamily: F.head, fontSize: 16, fontWeight: 600 }}>
                  {new Date(selected.date + "T12:00:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p style={{ color: C.textLight, fontSize: 12, fontFamily: F.body, marginTop: 2 }}>
                  {selected.theme} · {selected.content_type}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {avgRating(selected) && (
                  <span style={{ background: "#fff8e0", border: "1px solid #f0c040", borderRadius: 6, padding: "3px 8px", color: "#a07800", fontSize: 12, fontFamily: F.body }}>⭐ {avgRating(selected)}</span>
                )}
                <button onClick={() => handleDelete(selected.id)}
                  style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px", color: C.danger, cursor: "pointer", fontSize: 12, fontFamily: F.body }}>elimina</button>
                <button onClick={() => setSelected(null)}
                  style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
              </div>
            </div>

            <p style={{ color: C.textLight, fontSize: 12, fontFamily: F.body, marginBottom: 14, fontStyle: "italic" }}>
              {selected.description?.slice(0, 120)}{selected.description?.length > 120 ? "…" : ""}
            </p>

            {selected.variants?.map((v, i) => (
              <div key={i} style={{ marginBottom: 14, padding: 12, background: "rgba(255,255,255,0.6)", borderRadius: 8, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: C.accentDark, fontSize: 11, fontFamily: F.body, fontWeight: 600 }}>{v.tone}</span>
                  {v.rating > 0 && <span style={{ color: "#f0a500", fontSize: 13 }}>{"★".repeat(v.rating)}{"☆".repeat(5 - v.rating)}</span>}
                </div>
                <p style={{ color: C.text, fontSize: 13, fontFamily: F.body, lineHeight: 1.6, marginBottom: 6 }}>
                  {v.caption?.slice(0, 200)}{v.caption?.length > 200 ? "…" : ""}
                </p>
                {v.tags?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {v.tags.map((t) => <span key={t} style={{ background: C.accentLight, borderRadius: 5, padding: "2px 7px", fontSize: 10, color: C.accentDark, fontFamily: F.body }}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}

            {selected.hashtags?.length > 0 && (
              <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <p style={{ ...css.label, marginBottom: 8 }}>Hashtag</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selected.hashtags.map((h) => (
                    <span key={h} style={{ background: C.accentLight, borderRadius: 5, padding: "2px 8px", fontSize: 12, color: C.text, fontFamily: F.body }}>#{h}</span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
