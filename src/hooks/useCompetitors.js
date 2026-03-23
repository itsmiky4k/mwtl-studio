import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useCompetitors() {
  const [competitors, setCompetitors] = useState([]);

  useEffect(() => {
    supabase.from("competitors").select("*").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => data && setCompetitors(data));
  }, []);

  async function saveCompetitor(handle, report) {
    const { data, error } = await supabase
      .from("competitors")
      .upsert({ handle, report }, { onConflict: "handle" })
      .select().single();
    if (!error && data) {
      setCompetitors((prev) => [data, ...prev.filter((c) => c.handle !== handle)].slice(0, 5));
    }
    return { data, error };
  }

  return { competitors, saveCompetitor };
}
