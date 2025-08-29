import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function GET() {
  try {
    let { data: admin_wallets, error } = await supabase
      .from("admin_wallets")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      data: admin_wallets || [],
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
