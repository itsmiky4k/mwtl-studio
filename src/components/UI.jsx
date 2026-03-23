import { useState } from "react";
import { C, F, css } from "../lib/design";

export function SectionCard({ title, children, style = {} }) {
  return (
    <div style={{ ...css.card, marginBottom: 18, ...style }}>
      {title && <p style={{ ...css.label, marginBottom: 14 }}>{title}</p>}
      {children}
    </div>
  );
}

export function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px", color: copied ? C.accent : C.textLight, cursor: "pointer", fontSize: 11, fontFamily: F.body }}
    >
      {copied ? "✓ copiato" : "copia"}
    </button>
  );
}

export function Stars({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: n <= value ? "#f0a500" : C.border, padding: 0 }}>
          ★
        </button>
      ))}
    </div>
  );
}

export function Spinner({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid ${C.accentLight}`,
      borderTop: `3px solid ${C.accent}`,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  );
}

export function Row({ label, val }) {
  if (!val) return null;
  return (
    <div style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ color: C.textLight, fontSize: 11, fontFamily: F.body, minWidth: 80, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ color: C.text, fontSize: 13, fontFamily: F.body, flex: 1 }}>{val}</span>
    </div>
  );
}

export function MiniCalendar({ value, onChange }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear]   = useState(new Date().getFullYear());
  const today    = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const offset   = firstDay === 0 ? 6 : firstDay - 1;
  const days     = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  const fmt = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isPast = (d) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={() => { month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1); }}
          style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 16 }}>‹</button>
        <span style={{ color: C.text, fontFamily: F.head, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{monthName}</span>
        <button onClick={() => { month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1); }}
          style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 16 }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {["L","M","M","G","V","S","D"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 9, color: C.textLight, fontFamily: F.body, padding: "2px 0", fontWeight: 600 }}>{d}</div>
        ))}
        {Array(offset).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(days).fill(null).map((_, i) => {
          const d = i + 1; const fd = fmt(d); const past = isPast(d);
          return (
            <button key={d} onClick={() => !past && onChange(fd)}
              style={{ background: value === fd ? C.accent : "transparent", border: "none", borderRadius: 5, padding: "5px 2px", cursor: past ? "default" : "pointer", color: value === fd ? "#fff" : past ? C.border : C.text, fontSize: 11, fontFamily: F.body }}>
              {d}
            </button>
          );
        })}
      </div>
      {value && <p style={{ color: C.accent, fontSize: 11, fontFamily: F.body, marginTop: 6 }}>📅 {new Date(value + "T12:00:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</p>}
    </div>
  );
}
