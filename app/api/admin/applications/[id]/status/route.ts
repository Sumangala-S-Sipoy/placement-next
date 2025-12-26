import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const applicationId = params.id
    const body = await request.json()
    const { status, feedback, interviewDate } = body

    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 })

    // Fetch application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, user: true }
    })

    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    // Update application status
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    })

    // Create notification for applicant on important status changes
    if (status === 'SHORTLISTED' || status === 'INTERVIEW_SCHEDULED') {
      // Notify applicant
      await prisma.notification.create({
        data: {
          userId: application.userId,
          title: status === 'SHORTLISTED' ? 'You have been shortlisted' : 'Interview scheduled',
          message: status === 'SHORTLISTED'
            ? `Your application for ${application.job.title} at ${application.job.companyName} has been shortlisted.`
            : `Interview scheduled for ${application.job.title} at ${application.job.companyName}.`,
          type: status === 'SHORTLISTED' ? 'SHORTLISTED' : 'INTERVIEW_SCHEDULED',
          jobId: application.jobId,
          companyId: application.job.companyId || undefined
        }
      })
    }

    // If interview scheduled with date, create InterviewSchedule record
    if (status === 'INTERVIEW_SCHEDULED' && interviewDate) {
      const iso = new Date(interviewDate).toISOString()
      await prisma.interviewSchedule.create({
        data: {
          jobApplicationId: application.id,
          userId: application.userId,
          companyId: application.job.companyId || '',
          scheduledDate: new Date(iso),
          scheduledTime: new Date(iso).toISOString(),
          mode: 'ONLINE'
        }
      })
    }

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
