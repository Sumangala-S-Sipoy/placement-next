"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  User, 
  Users,
  MapPin,
  GraduationCap, 
  FileCheck,
  Briefcase,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft
} from "lucide-react"

// Import step components
import { PersonalInfoStep } from "./steps/personal-info-step"
import { ContactParentInfoStep } from "./steps/contact-parent-info-step"
import { AddressStep } from "./steps/address-step"
import { TenthStandardStep } from "./steps/tenth-standard-step"
import { TwelfthStandardStep } from "./steps/twelfth-standard-step"
import { EngineeringDetailsStep } from "./steps/engineering-details-step"
import { FinalKYCStep } from "./steps/final-kyc-step"

// Import types
import { 
  PersonalInfo, 
  ContactAndParentDetails, 
  AddressDetails, 
  TenthStandardDetails,
  TwelfthStandardDetails,
  EngineeringDetails,
  FinalKYCDetails
} from "@/types/profile"

interface ProfileStep {
  id: number
  title: string
  description: string
  isComplete: boolean
}

const PROFILE_STEPS: ProfileStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself - basic personal details and identity",
    isComplete: false
  },
  {
    id: 2,
    title: "Contact & Family Details", 
    description: "Your contact information and parent/guardian details",
    isComplete: false
  },
  {
    id: 3,
    title: "Address Information",
    description: "Where do you live? Current and permanent address details",
    isComplete: false
  },
  {
    id: 4,
    title: "10th Standard Details",
    description: "Your SSC/10th standard academic performance and documents",
    isComplete: false
  },
  {
    id: 5,
    title: "12th/Diploma Details",
    description: "Your HSC/12th standard or diploma academic performance",
    isComplete: false
  },
  {
    id: 6,
    title: "Engineering Details",
    description: "Your current engineering college and semester performance",
    isComplete: false
  },
  {
    id: 7,
    title: "Final Verification",
    description: "Document verification and complete your placement profile",
    isComplete: false
  }
]

type ProfileData = {
  personalInfo?: Partial<PersonalInfo>
  contactDetails?: Partial<ContactAndParentDetails>
  addressDetails?: Partial<AddressDetails>
  tenthDetails?: Partial<TenthStandardDetails>
  twelfthDetails?: Partial<TwelfthStandardDetails>
  engineeringDetails?: Partial<EngineeringDetails>
  kycDetails?: Partial<FinalKYCDetails>
  completionStep?: number
  isComplete?: boolean
}

export function ProfileCompletion() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState<ProfileStep[]>(PROFILE_STEPS)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user) {
      fetchUserProfile()
    }
  }, [session, status, router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          console.log("Loaded profile data:", data.profile)
          
          // Structure the flat profile data into comprehensive sections
          const structuredProfile: ProfileData = {
            personalInfo: {
              firstName: data.profile.firstName,
              middleName: data.profile.middleName,
              lastName: data.profile.lastName,
              dateOfBirth: data.profile.dateOfBirth ? new Date(data.profile.dateOfBirth) : undefined,
              gender: data.profile.gender,
              bloodGroup: data.profile.bloodGroup,
              stateOfDomicile: data.profile.stateOfDomicile,
              nationality: data.profile.nationality,
              casteCategory: data.profile.casteCategory,
              profilePhoto: data.profile.profilePhoto
            },
            contactDetails: {
              email: data.profile.email,
              callingMobile: data.profile.callingMobile,
              whatsappMobile: data.profile.whatsappMobile,
              alternativeMobile: data.profile.alternativeMobile,
              fatherName: data.profile.fatherName,
              fatherMobile: data.profile.fatherMobile,
              fatherEmail: data.profile.fatherEmail,
              fatherOccupation: data.profile.fatherOccupation,
              fatherDeceased: data.profile.fatherDeceased,
              motherName: data.profile.motherName,
              motherMobile: data.profile.motherMobile,
              motherEmail: data.profile.motherEmail,
              motherOccupation: data.profile.motherOccupation,
              motherDeceased: data.profile.motherDeceased
            },
            addressDetails: {
              currentAddress: data.profile.currentAddress,
              permanentAddress: data.profile.permanentAddress,
              sameAsCurrent: data.profile.sameAsCurrent,
              country: data.profile.country
            },
            tenthDetails: {
              schoolName: data.profile.tenthSchoolName,
              city: data.profile.tenthCity,
              district: data.profile.tenthDistrict,
              pincode: data.profile.tenthPincode,
              state: data.profile.tenthState,
              board: data.profile.tenthBoard,
              passingYear: data.profile.tenthPassingYear,
              passingMonth: data.profile.tenthPassingMonth,
              marksType: data.profile.tenthMarksType,
              percentage: data.profile.tenthPercentage,
              subjects: data.profile.tenthSubjects,
              totalMarks: data.profile.tenthTotalMarks,
              marksOutOf1000: data.profile.tenthMarksOutOf1000,
              marksCard: data.profile.tenthMarksCard
            },
            twelfthDetails: {
              schoolName: data.profile.twelfthSchoolName,
              city: data.profile.twelfthCity,
              district: data.profile.twelfthDistrict,
              pincode: data.profile.twelfthPincode,
              state: data.profile.twelfthState,
              board: data.profile.twelfthBoard,
              passingYear: data.profile.twelfthPassingYear,
              passingMonth: data.profile.twelfthPassingMonth,
              marksType: data.profile.twelfthMarksType,
              percentage: data.profile.twelfthPercentage,
              subjects: data.profile.twelfthSubjects,
              totalMarks: data.profile.twelfthTotalMarks,
              marksOutOf1000: data.profile.twelfthMarksOutOf1000,
              marksCard: data.profile.twelfthMarksCard
            },
            engineeringDetails: {
              collegeName: data.profile.engineeringCollegeName,
              city: data.profile.engineeringCity,
              district: data.profile.engineeringDistrict,
              state: data.profile.engineeringState,
              pincode: data.profile.engineeringPincode,
              branch: data.profile.engineeringBranch,
              entryType: data.profile.engineeringEntryType,
              seatCategory: data.profile.engineeringSeatCategory,
              usn: data.profile.engineeringUsn,
              libraryId: data.profile.engineeringLibraryId,
              residencyStatus: data.profile.engineeringResidencyStatus,
              hostelName: data.profile.engineeringHostelName,
              roomNumber: data.profile.engineeringRoomNumber,
              floorNumber: data.profile.engineeringFloorNumber,
              localCity: data.profile.engineeringLocalCity,
              transportMode: data.profile.engineeringTransportMode,
              busRoute: data.profile.engineeringBusRoute
            },
            kycDetails: {
              finalCgpa: data.profile.kycFinalCgpa,
              activeBacklogs: data.profile.kycActiveBacklogs,
              backlogSubjects: data.profile.kycBacklogSubjects,
              branchMentorName: data.profile.kycBranchMentorName,
              linkedin: data.profile.kycLinkedin,
              github: data.profile.kycGithub,
              leetcode: data.profile.kycLeetcode,
              resume: data.profile.kycResume
            },
            completionStep: data.profile.completionStep,
            isComplete: data.profile.isComplete
          }
          
          setProfile(structuredProfile)
          setCurrentStep(data.profile.completionStep || 1)
          
          // Update step completion status
          setSteps(prev => prev.map(step => ({
            ...step,
            isComplete: step.id < (data.profile.completionStep || 1) || 
                       (step.id === 7 && data.profile.isComplete)
          })))
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const saveProfileStep = async (stepData: Partial<ProfileData>) => {
    setIsLoading(true)
    try {
      // Flatten the step data for API compatibility
      let flattenedData: any = {
        completionStep: currentStep
      }

      // Map comprehensive data structure to flat API structure with correct field names
      if (stepData.personalInfo) {
        const personalInfo = stepData.personalInfo
        flattenedData = { 
          ...flattenedData,
          firstName: personalInfo.firstName,
          middleName: personalInfo.middleName,
          lastName: personalInfo.lastName,
          dateOfBirth: personalInfo.dateOfBirth,
          gender: personalInfo.gender,
          bloodGroup: personalInfo.bloodGroup,
          stateOfDomicile: personalInfo.stateOfDomicile,
          nationality: personalInfo.nationality,
          casteCategory: personalInfo.casteCategory,
          profilePhoto: personalInfo.profilePhoto
        }
      }
      if (stepData.contactDetails) {
        const contactDetails = stepData.contactDetails
        flattenedData = { 
          ...flattenedData,
          email: contactDetails.email,
          callingMobile: contactDetails.callingMobile,
          whatsappMobile: contactDetails.whatsappMobile,
          alternativeMobile: contactDetails.alternativeMobile,
          fatherName: contactDetails.fatherName,
          fatherMobile: contactDetails.fatherMobile,
          fatherEmail: contactDetails.fatherEmail,
          fatherOccupation: contactDetails.fatherOccupation,
          fatherDeceased: contactDetails.fatherDeceased,
          motherName: contactDetails.motherName,
          motherMobile: contactDetails.motherMobile,
          motherEmail: contactDetails.motherEmail,
          motherOccupation: contactDetails.motherOccupation,
          motherDeceased: contactDetails.motherDeceased
        }
      }
      if (stepData.addressDetails) {
        const addressDetails = stepData.addressDetails
        flattenedData = { 
          ...flattenedData,
          currentAddress: addressDetails.currentAddress,
          permanentAddress: addressDetails.permanentAddress,
          sameAsCurrent: addressDetails.sameAsCurrent,
          country: addressDetails.country
        }
      }
      if (stepData.tenthDetails) {
        const tenthDetails = stepData.tenthDetails
        flattenedData = { 
          ...flattenedData,
          tenthSchoolName: tenthDetails.schoolName,
          tenthCity: tenthDetails.city,
          tenthDistrict: tenthDetails.district,
          tenthPincode: tenthDetails.pincode,
          tenthState: tenthDetails.state,
          tenthBoard: tenthDetails.board,
          tenthPassingYear: tenthDetails.passingYear,
          tenthPassingMonth: tenthDetails.passingMonth,
          tenthMarksType: tenthDetails.marksType,
          tenthPercentage: tenthDetails.percentage,
          tenthSubjects: tenthDetails.subjects,
          tenthTotalMarks: tenthDetails.totalMarks,
          tenthMarksOutOf1000: tenthDetails.marksOutOf1000,
          tenthMarksCard: tenthDetails.marksCard
        }
      }
      if (stepData.twelfthDetails) {
        const twelfthDetails = stepData.twelfthDetails
        flattenedData = { 
          ...flattenedData,
          twelfthSchoolName: twelfthDetails.schoolName,
          twelfthCity: twelfthDetails.city,
          twelfthDistrict: twelfthDetails.district,
          twelfthPincode: twelfthDetails.pincode,
          twelfthState: twelfthDetails.state,
          twelfthBoard: twelfthDetails.board,
          twelfthPassingYear: twelfthDetails.passingYear,
          twelfthPassingMonth: twelfthDetails.passingMonth,
          twelfthMarksType: twelfthDetails.marksType,
          twelfthPercentage: twelfthDetails.percentage,
          twelfthSubjects: twelfthDetails.subjects,
          twelfthTotalMarks: twelfthDetails.totalMarks,
          twelfthMarksOutOf1000: twelfthDetails.marksOutOf1000,
          twelfthMarksCard: twelfthDetails.marksCard
        }
      }
      if (stepData.engineeringDetails) {
        const engineeringDetails = stepData.engineeringDetails
        flattenedData = { 
          ...flattenedData,
          engineeringCollegeName: engineeringDetails.collegeName,
          engineeringCity: engineeringDetails.city,
          engineeringDistrict: engineeringDetails.district,
          engineeringState: engineeringDetails.state,
          engineeringPincode: engineeringDetails.pincode,
          engineeringBranch: engineeringDetails.branch,
          engineeringEntryType: engineeringDetails.entryType,
          engineeringSeatCategory: engineeringDetails.seatCategory,
          engineeringUsn: engineeringDetails.usn,
          engineeringLibraryId: engineeringDetails.libraryId,
          engineeringResidencyStatus: engineeringDetails.residencyStatus,
          engineeringHostelName: engineeringDetails.hostelName,
          engineeringRoomNumber: engineeringDetails.roomNumber,
          engineeringFloorNumber: engineeringDetails.floorNumber,
          engineeringLocalCity: engineeringDetails.localCity,
          engineeringTransportMode: engineeringDetails.transportMode,
          engineeringBusRoute: engineeringDetails.busRoute
        }
      }
      if (stepData.kycDetails) {
        const kycDetails = stepData.kycDetails
        flattenedData = { 
          ...flattenedData,
          kycFinalCgpa: kycDetails.finalCgpa,
          kycActiveBacklogs: kycDetails.activeBacklogs,
          kycBacklogSubjects: kycDetails.backlogSubjects,
          kycBranchMentorName: kycDetails.branchMentorName,
          kycLinkedin: kycDetails.linkedin,
          kycGithub: kycDetails.github,
          kycLeetcode: kycDetails.leetcode,
          kycResume: kycDetails.resume
        }
      }
      if (stepData.isComplete !== undefined) {
        flattenedData.isComplete = stepData.isComplete
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(flattenedData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({ ...prev, ...stepData }))
        
        // Mark current step as complete
        setSteps(prev => prev.map(step => ({
          ...step,
          isComplete: step.id <= currentStep
        })))
        
        toast.success("Profile updated successfully!")
        return true
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update profile")
        return false
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error("Error saving profile:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async (stepData: any) => {
    // Structure the data correctly based on current step
    let structuredData: Partial<ProfileData> = {}
    
    switch (currentStep) {
      case 1:
        structuredData = { personalInfo: stepData }
        break
      case 2:
        structuredData = { contactDetails: stepData }
        break
      case 3:
        structuredData = { addressDetails: stepData }
        break
      case 4:
        structuredData = { tenthDetails: stepData }
        break
      case 5:
        structuredData = { twelfthDetails: stepData }
        break
      case 6:
        structuredData = { engineeringDetails: stepData }
        break
      case 7:
        structuredData = { kycDetails: stepData }
        break
    }

    const success = await saveProfileStep(structuredData)
    if (success) {
      if (currentStep < 7) {
        setCurrentStep(prev => prev + 1)
      } else {
        // Profile completion
        const completeProfile = { ...structuredData, isComplete: true }
        await saveProfileStep(completeProfile)
        toast.success("Profile completed successfully! Redirecting to dashboard...")
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getStepIcon = (step: ProfileStep) => {
    const iconProps = { size: 20 }
    
    switch (step.id) {
      case 1:
        return <User {...iconProps} />
      case 2:
        return <Users {...iconProps} />
      case 3:
        return <MapPin {...iconProps} />
      case 4:
        return <GraduationCap {...iconProps} />
      case 5:
        return <GraduationCap {...iconProps} />
      case 6:
        return <Briefcase {...iconProps} />
      case 7:
        return <FileCheck {...iconProps} />
      default:
        return <Circle {...iconProps} />
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={profile.personalInfo || {}}
            onNext={handleNext}
            isLoading={isLoading}
          />
        )
      case 2:
        return (
          <ContactParentInfoStep
            data={profile.contactDetails || {}}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 3:
        return (
          <AddressStep
            data={profile.addressDetails || {}}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 4:
        return (
          <TenthStandardStep
            data={profile.tenthDetails || {}}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 5:
        return (
          <TwelfthStandardStep
            data={profile.twelfthDetails || {}}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 6:
        return (
          <EngineeringDetailsStep
            data={profile.engineeringDetails || {}}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 7:
        return (
          <FinalKYCStep
            data={profile.kycDetails || {}}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const progress = (currentStep / 7) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Mobile-first header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Complete Your Profile</h1>
              <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">
                Welcome to SDMCET Placement Portal! Complete these 7 steps to get ready for placements.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{Math.round(progress)}%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2 sm:h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStep} of 7</span>
              <span>{steps[currentStep - 1]?.title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6 lg:py-8">
        {/* Mobile Step Indicator */}
        <div className="block lg:hidden mb-6">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  currentStep === step.id 
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                    : step.isComplete
                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.isComplete ? (
                  <CheckCircle2 size={16} />
                ) : (
                  step.id
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Step Navigation */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-3 mb-8">
          {steps.map((step) => (
            <Card 
              key={step.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105",
                currentStep === step.id && "ring-2 ring-primary border-primary shadow-lg",
                step.isComplete && "bg-green-50 dark:bg-green-950/20"
              )}
              onClick={() => setCurrentStep(step.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    step.isComplete 
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step.isComplete ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  {step.isComplete && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2 leading-tight">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStepIcon(steps[currentStep - 1])}
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {steps[currentStep - 1]?.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {steps[currentStep - 1]?.description}
                  </CardDescription>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="gap-2"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
