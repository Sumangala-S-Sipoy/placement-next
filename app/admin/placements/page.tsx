import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PlacementTrackingView } from "@/components/admin/placement-tracking-view"
import QRCode from "@/components/qr-code"

export default async function PlacementTrackingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Get user with role information
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  const isAdmin = user?.role === 'ADMIN'

  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Fetch placement tracking data (events removed)
  const [
    totalEvents,
    upcomingEvents,
    completedEvents,
    attendeeStats,
    branchWisePlacement,
    recentPlacements
  ] = await Promise.all([
    // Total interview schedules
    prisma.interviewSchedule.count(),

    // Upcoming interviews
    prisma.interviewSchedule.findMany({
      where: { scheduledDate: { gte: new Date() } },
      include: {
        user: { select: { id: true, name: true } },
        jobApplication: { include: { job: { select: { id: true, title: true, companyName: true } } } },
        company: { select: { id: true, name: true } }
      },
      orderBy: { scheduledDate: 'asc' },
      take: 10
    }),

    // Completed interviews (past scheduled dates)
    prisma.interviewSchedule.count({ where: { scheduledDate: { lt: new Date() } } }),

    // Attendee stats - using attendance table as proxy
    prisma.attendance.groupBy({
      by: ['jobId'],
      _count: { jobId: true }
    }),

    // Branch-wise placement data (using profile data as proxy)
    prisma.profile.groupBy({
      by: ['branch'],
      where: {
        branch: { not: null },
        kycStatus: 'VERIFIED'
      },
      _count: { branch: true }
    }),

    // Recent placements (using recent profile updates as proxy)
    prisma.profile.findMany({
      where: {
        kycStatus: 'VERIFIED',
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    })
  ])

  const placementData = {
    overview: {
      totalEvents,
      upcomingEventsCount: upcomingEvents.length,
      completedEvents,
      totalAttendees: attendeeStats.reduce((acc: number, stat: { _count: { status: number } }) => acc + stat._count.status, 0)
    },
    upcomingEvents,
    attendeeStats,
    branchWisePlacement,
    recentPlacements
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
        <h1 className="text-3xl font-bold">Placement Tracking</h1>
      </div>

      {/* QR code section for students to scan and fill the Google Form */}
      <div className="rounded-md border p-4">
        <h2 className="text-lg font-semibold mb-2">Student Registration QR</h2>
        <p className="text-sm text-muted-foreground mb-4">Scan this QR to open the student Google Form and complete registration.</p>
        {process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ? (
          <div className="flex items-center gap-4">
            <QRCode url={process.env.NEXT_PUBLIC_GOOGLE_FORM_URL} size={220} />
            <div>
              <a
                href={process.env.NEXT_PUBLIC_GOOGLE_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline text-primary"
              >
                Open form in a new tab
              </a>
              <p className="text-xs mt-2 text-muted-foreground">Tip: Allow students to scan with their phone camera.</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-600">Set NEXT_PUBLIC_GOOGLE_FORM_URL in your .env to enable the QR code.</p>
        )}
      </div>

      <PlacementTrackingView data={placementData} />
    </div>
  )
}
