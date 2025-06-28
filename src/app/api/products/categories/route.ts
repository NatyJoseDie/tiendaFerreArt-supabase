import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("category");

  if (error) {
    console.error("Error fetching categories:", error.message);
    return NextResponse.json({ error: "Could not fetch categories" }, { status: 500 });
  }

  // Get unique, sorted categories
  const uniqueCategories = [...new Set(data.map((item: {category: string}) => item.category))].sort();

  return NextResponse.json(uniqueCategories);
}
