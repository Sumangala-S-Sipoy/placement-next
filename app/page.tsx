import { auth } from "@/lib/auth"
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const session = await auth()
  
  // If user is authenticated, redirect based on their status
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SDMCET Campus Connect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Connect with Your Future
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join SDMCET's comprehensive placement portal to connect with top companies, 
              track your academic progress, and launch your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                  Already have an account?
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Easy Profile Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Complete your academic and personal profile in 7 simple steps
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Monitor your academic performance and placement readiness
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Connect with top companies and explore exciting career paths
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Your data is protected with enterprise-grade security
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold">SDMCET Campus Connect</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2025 SDMCET. All rights reserved. Built for student success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
