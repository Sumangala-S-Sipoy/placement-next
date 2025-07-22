"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Users, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactAndParentDetails } from "@/types/profile"

const contactParentSchema = z.object({
  // Student Contact
  email: z.string()
    .email("Please enter a valid email address")
    .refine(email => email.endsWith('@gmail.com'), "Email must be a Gmail address"),
  callingMobile: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  whatsappMobile: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  alternativeMobile: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  
  // Father Details
  fatherName: z.string()
    .min(2, "Father's name is required")
    .transform(val => val.toUpperCase())
    .optional(),
  fatherMobile: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional(),
  fatherEmail: z.string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  fatherOccupation: z.string().optional(),
  fatherDeceased: z.boolean(),
  
  // Mother Details
  motherName: z.string()
    .min(2, "Mother's name is required")
    .transform(val => val.toUpperCase())
    .optional(),
  motherMobile: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional(),
  motherEmail: z.string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  motherOccupation: z.string().optional(),
  motherDeceased: z.boolean()
})

type ContactParentForm = z.infer<typeof contactParentSchema>

interface ContactParentInfoStepProps {
  data: Partial<ContactAndParentDetails>
  onNext: (data: Partial<ContactAndParentDetails>) => Promise<void>
  onPrevious?: () => void
  isLoading: boolean
}

export function ContactParentInfoStep({ data, onNext, onPrevious, isLoading }: ContactParentInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<ContactParentForm>({
    resolver: zodResolver(contactParentSchema),
    defaultValues: {
      email: data.email || "",
      callingMobile: data.callingMobile || "",
      whatsappMobile: data.whatsappMobile || "",
      alternativeMobile: data.alternativeMobile || "",
      fatherName: data.fatherName || "",
      fatherMobile: data.fatherMobile || "",
      fatherEmail: data.fatherEmail || "",
      fatherOccupation: data.fatherOccupation || "",
      fatherDeceased: data.fatherDeceased || false,
      motherName: data.motherName || "",
      motherMobile: data.motherMobile || "",
      motherEmail: data.motherEmail || "",
      motherOccupation: data.motherOccupation || "",
      motherDeceased: data.motherDeceased || false
    }
  })

  const onSubmit = async (formData: ContactParentForm) => {
    await onNext(formData)
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      // Fallback navigation logic or do nothing
      console.log("Previous navigation not available")
    }
  }

  // Helper functions
  const hasError = (fieldName: keyof ContactParentForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof ContactParentForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof ContactParentForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  const fatherDeceased = watch("fatherDeceased")
  const motherDeceased = watch("motherDeceased")

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Student Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>Student Contact Information</span>
            </CardTitle>
            <CardDescription>
              Your personal contact details for communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-1 text-sm font-medium">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
                <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground">(Gmail only)</span>
                {isFieldValid("email") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="your.name@gmail.com"
                className={cn(
                  "w-full",
                  hasError("email") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("email") && "border-green-500"
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="callingMobile" className="flex items-center space-x-1 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Calling Mobile</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("callingMobile") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="callingMobile"
                  {...register("callingMobile")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={cn(
                    "w-full",
                    hasError("callingMobile") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("callingMobile") && "border-green-500"
                  )}
                />
                {errors.callingMobile && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.callingMobile.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappMobile" className="flex items-center space-x-1 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Mobile</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("whatsappMobile") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="whatsappMobile"
                  {...register("whatsappMobile")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={cn(
                    "w-full",
                    hasError("whatsappMobile") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("whatsappMobile") && "border-green-500"
                  )}
                />
                {errors.whatsappMobile && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.whatsappMobile.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternativeMobile" className="flex items-center space-x-1 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Alternative Mobile</span>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                  {isFieldValid("alternativeMobile") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="alternativeMobile"
                  {...register("alternativeMobile")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={cn(
                    "w-full",
                    hasError("alternativeMobile") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("alternativeMobile") && "border-green-500"
                  )}
                />
                {errors.alternativeMobile && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.alternativeMobile.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Father's Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Father's Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="fatherDeceased"
                checked={fatherDeceased}
                onCheckedChange={(checked) => setValue("fatherDeceased", !!checked)}
              />
              <Label htmlFor="fatherDeceased" className="text-sm">
                Father is deceased
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Father's Name</span>
                  {isFieldValid("fatherName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="fatherName"
                  {...register("fatherName")}
                  placeholder="Enter father's full name"
                  className={cn(
                    "w-full",
                    hasError("fatherName") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("fatherName") && "border-green-500"
                  )}
                />
                {errors.fatherName && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fatherName.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherOccupation" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Occupation</span>
                  {isFieldValid("fatherOccupation") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="fatherOccupation"
                  {...register("fatherOccupation")}
                  placeholder="Enter occupation"
                  className={cn(
                    "w-full",
                    hasError("fatherOccupation") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("fatherOccupation") && "border-green-500"
                  )}
                />
                {errors.fatherOccupation && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fatherOccupation.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherMobile" className="flex items-center space-x-1 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Mobile Number</span>
                  {isFieldValid("fatherMobile") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="fatherMobile"
                  {...register("fatherMobile")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={cn(
                    "w-full",
                    hasError("fatherMobile") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("fatherMobile") && "border-green-500"
                  )}
                />
                {errors.fatherMobile && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fatherMobile.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherEmail" className="flex items-center space-x-1 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                  {isFieldValid("fatherEmail") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="fatherEmail"
                  {...register("fatherEmail")}
                  placeholder="father@example.com"
                  className={cn(
                    "w-full",
                    hasError("fatherEmail") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("fatherEmail") && "border-green-500"
                  )}
                />
                {errors.fatherEmail && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fatherEmail.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mother's Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-pink-600" />
              <span>Mother's Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="motherDeceased"
                checked={motherDeceased}
                onCheckedChange={(checked) => setValue("motherDeceased", !!checked)}
              />
              <Label htmlFor="motherDeceased" className="text-sm">
                Mother is deceased
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherName" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Mother's Name</span>
                  {isFieldValid("motherName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="motherName"
                  {...register("motherName")}
                  placeholder="Enter mother's full name"
                  className={cn(
                    "w-full",
                    hasError("motherName") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("motherName") && "border-green-500"
                  )}
                />
                {errors.motherName && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.motherName.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherOccupation" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Occupation</span>
                  {isFieldValid("motherOccupation") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="motherOccupation"
                  {...register("motherOccupation")}
                  placeholder="Enter occupation"
                  className={cn(
                    "w-full",
                    hasError("motherOccupation") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("motherOccupation") && "border-green-500"
                  )}
                />
                {errors.motherOccupation && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.motherOccupation.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherMobile" className="flex items-center space-x-1 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Mobile Number</span>
                  {isFieldValid("motherMobile") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="motherMobile"
                  {...register("motherMobile")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={cn(
                    "w-full",
                    hasError("motherMobile") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("motherMobile") && "border-green-500"
                  )}
                />
                {errors.motherMobile && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.motherMobile.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherEmail" className="flex items-center space-x-1 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                  {isFieldValid("motherEmail") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="motherEmail"
                  {...register("motherEmail")}
                  placeholder="mother@example.com"
                  className={cn(
                    "w-full",
                    hasError("motherEmail") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("motherEmail") && "border-green-500"
                  )}
                />
                {errors.motherEmail && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.motherEmail.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="pt-6 border-t space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Step 2 of 7 - Contact & Family Details
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevious} 
              className="flex-1 md:flex-none md:px-8 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 md:flex-none md:px-8 flex items-center justify-center space-x-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
