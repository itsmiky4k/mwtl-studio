import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const INITIAL = {
  role: "assistant",
  content: "Ciao! Sono il tuo assistente per @man_withthelens. Posso aiutarti con brainstorming, analisi dei dati, strategie di crescita e review delle caption. Da dove vuoi partire?",
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) setMessages(data.map((m) => ({ role: m.role, content: m.content })));
      });
  }, []);

  async function addMessage(role, content) {
    const msg = { role, content };
    setMessages((prev) => [...prev, msg]);
    await supabase.from("chat_messages").insert([msg]);
    return msg;
  }

  async function clearHistory() {
    await supabase.from("chat_messages").delete().neq("id", 0);
    setMessages([INITIAL]);
  }

  return { messages, loading, setLoading, addMessage, clearHistory };
}
