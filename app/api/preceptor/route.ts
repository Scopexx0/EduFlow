import { NextResponse } from "next/server"
import { getPreceptorById } from "@/lib/queries"

export async function GET() {
  const preceptor = await getPreceptorById(1)
  return NextResponse.json(preceptor)
}