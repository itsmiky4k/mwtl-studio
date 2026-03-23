import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: true });
    if (!error) setPosts(data || []);
    setLoading(false);
  }

  async function addPost(post) {
    const { data, error } = await supabase.from("posts").insert([post]).select().single();
    if (!error && data) setPosts((prev) => [...prev, data]);
    return { data, error };
  }

  async function updatePost(id, updates) {
    const { data, error } = await supabase.from("posts").update(updates).eq("id", id).select().single();
    if (!error && data) setPosts((prev) => prev.map((p) => (p.id === id ? data : p)));
    return { data, error };
  }

  async function deletePost(id) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== id));
    return { error };
  }

  return { posts, loading, addPost, updatePost, deletePost, refetch: fetchPosts };
}
