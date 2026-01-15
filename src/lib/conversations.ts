import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export const createConversation = async (userId: string, title: string = "New Chat") => {
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
};

export const getConversations = async () => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Conversation[];
};

export const getConversation = async (id: string) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Conversation | null;
};

export const updateConversationTitle = async (id: string, title: string) => {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", id);

  if (error) throw error;
};

export const deleteConversation = async (id: string) => {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Message[];
};

export const addMessage = async (
  conversationId: string,
  role: "user" | "assistant",
  content: string
) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
};

export const updateMessage = async (id: string, content: string) => {
  const { error } = await supabase
    .from("messages")
    .update({ content })
    .eq("id", id);

  if (error) throw error;
};
