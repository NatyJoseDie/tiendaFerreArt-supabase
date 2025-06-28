import { NextRequest, NextResponse } from "next/server";
import { getUserAndRole } from "@/utils/auth";
// import OpenAI from "openai"; // Descomenta y configura si tienes API Key

export async function POST(req: NextRequest) {
  const auth = await getUserAndRole(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  // Aquí deberías llamar a la API de OpenAI o Genkit
  // Ejemplo:
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const completion = await openai.chat.completions.create({ ... });
  // return NextResponse.json({ text: completion.choices[0].message.content });
  return NextResponse.json({ text: "Descripción generada (simulada) para: " + body.prompt });
}
