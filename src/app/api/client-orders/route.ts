import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserAndRole } from "@/utils/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const auth = await getUserAndRole(req);
  if (!auth || auth.role !== "cliente") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  // Validar body según modelo de pedido
  const { data, error } = await supabase.from("client_orders").insert([body]).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = await getUserAndRole(req);
  if (!auth || auth.role !== "cliente") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Solo pedidos del usuario logueado
  const { data, error } = await supabase
    .from("client_orders")
    .select("*")
    .eq("user_id", auth.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
