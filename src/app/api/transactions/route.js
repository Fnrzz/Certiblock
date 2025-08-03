import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Pastikan Anda mengimpor klien ADMIN

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "";
    const transactionType = searchParams.get("transactionType") || "";
    const searchQuery = searchParams.get("searchQuery") || "";

    let query = supabase.from("transactions").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (transactionType) query = query.eq("transactionType", transactionType);

    if (searchQuery) {
      if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
        query = query.eq('transactionHash', searchQuery);
      } else {
        query = query.ilike('studentId', `%${searchQuery}%`);
      }
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    query = query.order("confirmedAt", { ascending: false });

    const { data: transactions, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      transactions: transactions || [],
      currentPage: page,
      totalPages: totalPages,
      totalCount: count,
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
