export const C = {
  bg: "#eef4f8",
  card: "rgba(255,255,255,0.78)",
  border: "#c8dce8",
  accent: "#2e7da8",
  accentLight: "#dff0f8",
  accentDark: "#1a5570",
  text: "#0c2333",
  textMid: "#3a6a82",
  textLight: "#6a9ab0",
  danger: "#c0392b",
  success: "#1a7a4a",
};

export const F = { head: "'Syne', sans-serif", body: "'Outfit', sans-serif" };

export const css = {
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 20,
    backdropFilter: "blur(8px)",
  },
  label: {
    display: "block",
    color: C.textLight,
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: F.body,
    marginBottom: 7,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.9)",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: C.text,
    fontSize: 14,
    fontFamily: F.body,
    outline: "none",
    boxSizing: "border-box",
  },
  primaryBtn: {
    background: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: 9,
    padding: "11px 22px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: F.body,
    letterSpacing: "0.02em",
  },
  secondaryBtn: {
    background: "transparent",
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: 9,
    padding: "11px 22px",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: F.body,
  },
  disabledBtn: {
    background: C.accentLight,
    color: C.textLight,
    border: "none",
    borderRadius: 9,
    padding: "11px 22px",
    cursor: "not-allowed",
    fontSize: 14,
    fontFamily: F.body,
  },
  chip: (active) => ({
    padding: "7px 14px",
    borderRadius: 8,
    border: `1px solid ${active ? C.accent : C.border}`,
    background: active ? C.accent : "rgba(255,255,255,0.7)",
    color: active ? "#fff" : C.text,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: F.body,
    transition: "all 0.15s",
  }),
};

export const CONTENT_TYPES = [
  { id: "photo", label: "Foto", icon: "◻" },
  { id: "carousel", label: "Carosello", icon: "◫" },
  { id: "reel", label: "Reel", icon: "▷" },
];

export const THEMES = ["Paesaggio", "Street", "Architettura", "Travel", "Altro"];
export const TONES = ["Evocativo", "Descrittivo", "Riflessivo", "Minimalista"];
export const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
export const RATING_TAGS = [
  "Hook forte", "Tono perfetto", "Troppo generico",
  "Voce autentica", "Troppo lungo", "Call to action efficace",
];
export const TYPE_COLOR = { photo: "#3a8fb5", carousel: "#7b5ea7", reel: "#b55a3a" };
export const TYPE_ICON  = { photo: "◻", carousel: "◫", reel: "▷" };
