"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CalendarIcon, User, Upload, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { PersonalInfo } from "@/types/profile"

const personalInfoSchema = z.object({
  firstName: z.string()
    .min(2, "First name is required")
    .transform(val => val.toUpperCase()),
  middleName: z.string()
    .min(1, "Middle name is required (use . if none)"),
  lastName: z.string()
    .min(2, "Last name is required")
    .transform(val => val.toUpperCase()),
  dateOfBirth: z.date(),
  gender: z.enum(["MALE", "FEMALE"]),
  bloodGroup: z.enum([
    "A_POSITIVE", "A_NEGATIVE", 
    "B_POSITIVE", "B_NEGATIVE", 
    "AB_POSITIVE", "AB_NEGATIVE", 
    "O_POSITIVE", "O_NEGATIVE"
  ]),
  stateOfDomicile: z.string().min(2, "State of domicile is required"),
  nationality: z.string(),
  casteCategory: z.enum(["GEN", "OBC", "SC", "ST"]),
  profilePhoto: z.string().optional()
})

type PersonalInfoForm = z.infer<typeof personalInfoSchema>

interface PersonalInfoStepProps {
  data: Partial<PersonalInfo>
  onNext: (data: Partial<PersonalInfo>) => Promise<void>
  isLoading: boolean
}

const BLOOD_GROUPS = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
]

const INDIAN_STATES = [
  "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH",
  "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JHARKHAND", "KARNATAKA",
  "KERALA", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM",
  "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU",
  "TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"
]

export function PersonalInfoStep({ data, onNext, isLoading }: PersonalInfoStepProps) {
  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data.firstName || "",
      middleName: data.middleName || ".",
      lastName: data.lastName || "",
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
      bloodGroup: data.bloodGroup || undefined,
      stateOfDomicile: data.stateOfDomicile || "",
      nationality: "INDIAN",
      casteCategory: data.casteCategory || undefined,
      profilePhoto: data.profilePhoto || ""
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, touchedFields }
  } = form

  const onSubmit = async (formData: PersonalInfoForm) => {
    await onNext(formData)
  }

  // Helper functions
  const hasError = (fieldName: keyof PersonalInfoForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof PersonalInfoForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof PersonalInfoForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  const watchedDate = watch("dateOfBirth")

  return (
    <div className="space-y-8">

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Basic Details</span>
            </CardTitle>
            <CardDescription>
              All fields marked with * are required. Names will be auto-converted to uppercase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center space-x-1 text-sm font-medium">
                  <span>First Name</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("firstName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter your first name"
                  className={cn(
                    "w-full",
                    hasError("firstName") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("firstName") && "border-green-500"
                  )}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.firstName.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Last Name</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("lastName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter your last name"
                  className={cn(
                    "w-full",
                    hasError("lastName") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("lastName") && "border-green-500"
                  )}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.lastName.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName" className="flex items-center space-x-1 text-sm font-medium">
                <span>Middle Name</span>
                <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground">(Use . if none)</span>
                {isFieldValid("middleName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Input
                id="middleName"
                {...register("middleName")}
                placeholder="Middle name or ."
                className={cn(
                  "w-full max-w-md",
                  hasError("middleName") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("middleName") && "border-green-500"
                )}
              />
              {errors.middleName && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.middleName.message}</span>
                </p>
              )}
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center space-x-1 text-sm font-medium">
                      <span>Date of Birth</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("dateOfBirth") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              hasError("dateOfBirth") && "border-red-500",
                              isFieldValid("dateOfBirth") && "border-green-500"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1990-01-01")
                          }
                          captionLayout="dropdown"
                          fromYear={1990}
                          toYear={2010}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Gender</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("gender") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("gender", value as "MALE" | "FEMALE")}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("gender") && "border-red-500 focus:ring-red-500",
                    isFieldValid("gender") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.gender.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Blood Group & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Blood Group</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("bloodGroup") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("bloodGroup", value as any)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("bloodGroup") && "border-red-500 focus:ring-red-500",
                    isFieldValid("bloodGroup") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map(bg => (
                      <SelectItem key={bg.value} value={bg.value}>
                        {bg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bloodGroup && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.bloodGroup.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>State of Domicile</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("stateOfDomicile") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("stateOfDomicile", value)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("stateOfDomicile") && "border-red-500 focus:ring-red-500",
                    isFieldValid("stateOfDomicile") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stateOfDomicile && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.stateOfDomicile.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Nationality & Caste Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Nationality</span>
                  <Badge variant="secondary" className="text-xs">Read-only</Badge>
                </Label>
                <Input
                  value="INDIAN"
                  disabled
                  className="w-full bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Caste Category</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("casteCategory") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("casteCategory", value as any)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("casteCategory") && "border-red-500 focus:ring-red-500",
                    isFieldValid("casteCategory") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GEN">General (GEN)</SelectItem>
                    <SelectItem value="OBC">Other Backward Class (OBC)</SelectItem>
                    <SelectItem value="SC">Scheduled Caste (SC)</SelectItem>
                    <SelectItem value="ST">Scheduled Tribe (ST)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.casteCategory && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.casteCategory.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="pt-6 border-t space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Step 1 of 7 - Personal Information
          </div>
          <div className="flex justify-center">
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
      </Form>
    </div>
  )
}
