import { supabase } from "@/lib/supabaseClient";

export const loginUser = async (email, password) => {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(
        authError.message || "Login failed. Please check your credentials."
      );
    }

    return {
      jwt: {
        token: authData.session.access_token,
      },
    };
  } catch (error) {
    throw error;
  }
};
