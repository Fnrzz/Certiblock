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

    const user = {
      id: authData.user.id,
      email: authData.user.email,
      role: authData.user.role || "USER",
      name: authData.user.user_metadata.display_name,
    };

    return {
      user,
      jwt: {
        token: authData.session.access_token,
      },
    };
  } catch (error) {
    throw error;
  }
};
