import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  User, 
  TrendingUp, 
  Calendar,
  FileText,
  Building
} from "lucide-react"

import data from "./data.json"

export default async function Page() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if user has completed profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id }
  })

  // If profile is not complete, redirect to profile completion
  if (!profile?.isComplete) {
    redirect("/profile")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col">
        <SiteHeader />
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Welcome Section */}
              <div className="mx-4 lg:mx-6 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold mb-2">
                      Welcome back, {session.user.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground text-sm lg:text-base">
                      Your placement dashboard is ready. Track your progress and explore new opportunities.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="sm" className="gap-2">
                      <FileText size={16} />
                      Update Profile
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Building size={16} />
                      Browse Jobs
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <SectionCards />

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 px-4 lg:px-6">
                {/* Main Chart */}
                <div className="xl:col-span-2">
                  <ChartAreaInteractive />
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User size={16} />
                        Profile Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completion</span>
                        <Badge variant="secondary">100%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Verification</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Verified
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Documents</span>
                        <Badge variant="outline">7/7 Uploaded</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp size={16} />
                        This Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Applications</span>
                        <span className="font-semibold">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Interviews</span>
                        <span className="font-semibold">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Offers</span>
                        <span className="font-semibold text-green-600">1</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar size={16} />
                        Upcoming
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Microsoft Interview</p>
                            <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Application Deadline</p>
                            <p className="text-xs text-muted-foreground">Dec 30, 2024</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Applications Table */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Recent Applications</CardTitle>
                        <CardDescription>
                          Track your job applications and their current status
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All Applications
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-hidden">
                      <DataTable data={data} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
