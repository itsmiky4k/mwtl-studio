import { useState } from "react";
import { C, F } from "./lib/design";
import { usePosts } from "./hooks/usePosts";
import { useCompetitors } from "./hooks/useCompetitors";
import { useChat } from "./hooks/useChat";
import PianificaTab   from "./tabs/Pianifica";
import CalendarioTab  from "./tabs/Calendario";
import CompetitorsTab from "./tabs/Competitors";
import AssistenteTab  from "./tabs/Assistente";

const TABS = [
  { label: "Pianifica",   icon: "✦" },
  { label: "Calendario",  icon: "◫" },
  { label: "Competitors", icon: "◎" },
  { label: "Assistente",  icon: "◈" },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const { posts, loading: postsLoading, addPost, updatePost, deletePost } = usePosts();
  const { competitors, saveCompetitor } = useCompetitors();
  const { messages, loading: chatLoading, setLoading: setChatLoading, addMessage, clearHistory } = useChat();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${C.bg}; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }
        textarea, input { font-family: 'Outfit', sans-serif !important; }
        textarea:focus, input:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px rgba(46,125,168,0.12) !important; }
        ::placeholder { color: ${C.textLight}; opacity: 0.7; }
        button:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes bounce  { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(150deg, #e4eff7 0%, #eef4f8 50%, #e8f0f6 100%)`, padding: "24px 20px 40px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
            <div>
              <h1 style={{ fontFamily: F.head, fontSize: 21, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
                man_withthelens
              </h1>
              <p style={{ color: C.textLight, fontSize: 10, fontFamily: F.body, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>
                content studio
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.textLight, fontSize: 12, fontFamily: F.body }}>{posts.length} post pianificati</span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: posts.length > 0 ? C.success : C.border }} />
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(255,255,255,0.5)", padding: 4, borderRadius: 13, border: `1px solid ${C.border}` }}>
            {TABS.map((t, i) => (
              <button key={t.label} onClick={() => setTab(i)} style={{
                flex: 1, padding: "9px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === i ? C.accent : "transparent",
                color: tab === i ? "#fff" : C.textMid,
                fontFamily: F.body, fontSize: 13, fontWeight: tab === i ? 600 : 400,
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: 11 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Panels */}
          {tab === 0 && <PianificaTab   posts={posts} addPost={addPost} />}
          {tab === 1 && <CalendarioTab  posts={posts} deletePost={deletePost} loading={postsLoading} />}
          {tab === 2 && <CompetitorsTab competitors={competitors} saveCompetitor={saveCompetitor} />}
          {tab === 3 && (
            <AssistenteTab
              posts={posts}
              messages={messages}
              addMessage={addMessage}
              clearHistory={clearHistory}
              loading={chatLoading}
              setLoading={setChatLoading}
            />
          )}
        </div>
      </div>
    </>
  );
}
