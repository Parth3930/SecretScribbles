// utils/supabaseService.js
import { createClient } from "@supabase/supabase-js";

const database_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(database_url, anonKey);

export const fetchUserData = async (token) => {
  try {
    const { data, error } = await supabase
      .from("login")
      .select()
      .eq("token", token)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return null;
  }
};

export const fetchUserCards = async () => {
  try {
    const { data, error } = await supabase.from("text").select();

    if (error) {
      console.error("Error fetching user cards:", error.message);
      return [];
    }

    if (data.length > 2) {
      const firstTwoCards = data.slice(0, 2);
      const remainingCards = data.slice(2);
      return [...firstTwoCards, ...remainingCards];
    }

    return data;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return [];
  }
};

export const deleteUserCard = async (id) => {
  try {
    const { error } = await supabase.from("text").delete().eq("id", id);

    if (error) {
      console.error("Error deleting record:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return false;
  }
};

export default supabase;
