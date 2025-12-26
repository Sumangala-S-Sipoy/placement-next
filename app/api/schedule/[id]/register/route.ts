import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Events have been removed from the system" }, { status: 404 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Events have been removed from the system" }, { status: 404 })
}
