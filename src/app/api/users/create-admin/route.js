import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { message: "Semua kolom harus diisi." },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

    if (error) throw error;

    await supabase.from("users").update({ role: "ADMIN" }).eq("id", user.id);

    return NextResponse.json(
      { message: `User admin ${user.email} berhasil dibuat.` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
