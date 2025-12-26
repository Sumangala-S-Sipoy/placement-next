import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type ScheduleEvent = {
  id: string
  title: string
  description: string | null
  date: Date
  duration: number | null
  location: string | null
  type: string
  company: string | null
  status: string
  isVisible: boolean
  createdBy: string
  maxAttendees: number | null
  attendees: {
    user: {
      id: string
      name: string | null
      email: string
    }
  }[]
}

export async function GET() {
  return NextResponse.json({ error: "Events have been removed from the system" }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ error: "Events have been removed from the system" }, { status: 404 })
}
