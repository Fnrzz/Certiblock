import { createClient } from "@/utils/supabase/supabaseServer";

export const signOut = async () => {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
    localStorage.removeItem("user");

    console.log("Sign out berhasil.");
  } catch (error) {
    throw new Error("Gagal melakukan sign out: " + error.message);
  }
};
