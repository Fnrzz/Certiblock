import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      users: data.users || [],
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
