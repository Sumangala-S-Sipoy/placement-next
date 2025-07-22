"use client"

import React, { useState } from "react"
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
import { Building2, GraduationCap, Home, Bus, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { EngineeringDetails } from "@/types/profile"
import { INDIAN_STATES, STATE_CITIES, DISTRICTS_BY_STATE, ENGINEERING_BRANCHES, SEAT_CATEGORIES, TRANSPORT_MODES } from "@/lib/location-data"

const engineeringDetailsSchema = z.object({
  collegeName: z.string().min(2, "College name is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  state: z.string().min(2, "State is required"),
  branch: z.enum(["CSE", "ISE", "ECE", "EEE", "ME", "CE", "AIML", "DS"]),
  entryType: z.enum(["REGULAR", "LATERAL"]),
  seatCategory: z.enum(["KCET", "MANAGEMENT", "COMEDK"]),
  usn: z.string().min(1, "USN is required"),
  libraryId: z.string().min(1, "Library ID is required"),
  residencyStatus: z.enum(["HOSTELITE", "LOCALITE"]),
  
  // Conditional hostel fields
  hostelName: z.string().optional(),
  roomNumber: z.string().optional(),
  floorNumber: z.string().optional(),
  
  // Conditional local fields
  localCity: z.string().optional(),
  transportMode: z.enum(["COLLEGE_BUS", "PRIVATE_TRANSPORT", "PUBLIC_TRANSPORT", "WALKING"]).optional(),
  busRoute: z.string().optional()
}).refine((data) => {
  if (data.residencyStatus === "HOSTELITE") {
    return data.hostelName && data.roomNumber && data.floorNumber
  }
  if (data.residencyStatus === "LOCALITE") {
    return data.localCity && data.transportMode
  }
  return true
}, {
  message: "Please fill all required fields for your residency status",
  path: ["residencyStatus"]
})

type EngineeringDetailsForm = z.infer<typeof engineeringDetailsSchema>

interface EngineeringDetailsStepProps {
  data: Partial<EngineeringDetails>
  onNext: (data: Partial<EngineeringDetails>) => Promise<void>
  onPrevious?: () => void
  isLoading: boolean
}

export function EngineeringDetailsStep({ data, onNext, onPrevious, isLoading }: EngineeringDetailsStepProps) {
  const [selectedState, setSelectedState] = useState<string>(data.state || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<EngineeringDetailsForm>({
    resolver: zodResolver(engineeringDetailsSchema),
    defaultValues: {
      collegeName: data.collegeName || "",
      city: data.city || "",
      district: data.district || "",
      pincode: data.pincode || "",
      state: data.state || "",
      branch: data.branch || undefined,
      entryType: data.entryType || undefined,
      seatCategory: data.seatCategory || undefined,
      usn: data.usn || "",
      libraryId: data.libraryId || "",
      residencyStatus: data.residencyStatus || undefined,
      hostelName: data.hostelName || "",
      roomNumber: data.roomNumber || "",
      floorNumber: data.floorNumber || "",
      localCity: data.localCity || "",
      transportMode: data.transportMode || undefined,
      busRoute: data.busRoute || ""
    }
  })

  const onSubmit = async (formData: EngineeringDetailsForm) => {
    await onNext({
      collegeName: formData.collegeName,
      city: formData.city,
      district: formData.district,
      pincode: formData.pincode,
      state: formData.state,
      branch: formData.branch,
      entryType: formData.entryType,
      seatCategory: formData.seatCategory,
      usn: formData.usn,
      libraryId: formData.libraryId,
      residencyStatus: formData.residencyStatus,
      hostelName: formData.hostelName,
      roomNumber: formData.roomNumber,
      floorNumber: formData.floorNumber,
      localCity: formData.localCity,
      transportMode: formData.transportMode,
      busRoute: formData.busRoute
    })
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      console.log("Previous navigation not available")
    }
  }

  // Helper functions
  const hasError = (fieldName: keyof EngineeringDetailsForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof EngineeringDetailsForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof EngineeringDetailsForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  const residencyStatus = watch("residencyStatus")
  const transportMode = watch("transportMode")

  return (
    <div className="space-y-8">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* College Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>College Information</span>
            </CardTitle>
            <CardDescription>
              Details about your engineering college and location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="collegeName" className="flex items-center space-x-1 text-sm font-medium">
                <span>College Name</span>
                <span className="text-red-500">*</span>
                {isFieldValid("collegeName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Input
                id="collegeName"
                {...register("collegeName")}
                placeholder="Enter your college name"
                className={cn(
                  "w-full",
                  hasError("collegeName") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("collegeName") && "border-green-500"
                )}
              />
              {errors.collegeName && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.collegeName.message}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center space-x-1 text-sm font-medium">
                  <span>City</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("city") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("city", value)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("city") && "border-red-500 focus:ring-red-500",
                    isFieldValid("city") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedState && STATE_CITIES[selectedState]?.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                    {(!selectedState || !STATE_CITIES[selectedState]) && (
                      <SelectItem value="__placeholder__" disabled>Select state first</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.city.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="flex items-center space-x-1 text-sm font-medium">
                  <span>District</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("district") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("district", value)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("district") && "border-red-500 focus:ring-red-500",
                    isFieldValid("district") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedState && DISTRICTS_BY_STATE[selectedState]?.map(district => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                    {(!selectedState || !DISTRICTS_BY_STATE[selectedState]) && (
                      <SelectItem value="__placeholder__" disabled>Select state first</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.district.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center space-x-1 text-sm font-medium">
                  <span>State</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("state") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => {
                  setValue("state", value)
                  setSelectedState(value)
                  // Clear city and district when state changes
                  setValue("city", "")
                  setValue("district", "")
                }}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("state") && "border-red-500 focus:ring-red-500",
                    isFieldValid("state") && "border-green-500"
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
                {errors.state && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.state.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Pincode</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("pincode") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="pincode"
                  {...register("pincode")}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  className={cn(
                    "w-full",
                    hasError("pincode") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("pincode") && "border-green-500"
                  )}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.pincode.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              <span>Course Details</span>
            </CardTitle>
            <CardDescription>
              Your engineering branch and admission details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Engineering Branch</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("branch") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("branch", value as any)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("branch") && "border-red-500 focus:ring-red-500",
                    isFieldValid("branch") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINEERING_BRANCHES.map(branch => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.branch.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Entry Type</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("entryType") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("entryType", value as "REGULAR" | "LATERAL")}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("entryType") && "border-red-500 focus:ring-red-500",
                    isFieldValid("entryType") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select entry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REGULAR">Regular (1st Year)</SelectItem>
                    <SelectItem value="LATERAL">Lateral Entry (3rd Year)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.entryType && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.entryType.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Seat Category</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("seatCategory") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("seatCategory", value as any)}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("seatCategory") && "border-red-500 focus:ring-red-500",
                    isFieldValid("seatCategory") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select seat category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEAT_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.seatCategory && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.seatCategory.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="usn" className="flex items-center space-x-1 text-sm font-medium">
                  <span>USN</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("usn") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="usn"
                  {...register("usn")}
                  placeholder="Enter your USN"
                  className={cn(
                    "w-full",
                    hasError("usn") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("usn") && "border-green-500"
                  )}
                />
                {errors.usn && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.usn.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="libraryId" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Library ID</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("libraryId") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="libraryId"
                  {...register("libraryId")}
                  placeholder="Enter your library ID"
                  className={cn(
                    "w-full",
                    hasError("libraryId") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("libraryId") && "border-green-500"
                  )}
                />
                {errors.libraryId && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.libraryId.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residency Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-purple-600" />
              <span>Residency Status</span>
            </CardTitle>
            <CardDescription>
              Are you staying in hostel or as a localite?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center space-x-1 text-sm font-medium">
                <span>Residency Status</span>
                <span className="text-red-500">*</span>
                {isFieldValid("residencyStatus") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Select onValueChange={(value) => setValue("residencyStatus", value as "HOSTELITE" | "LOCALITE")}>
                <SelectTrigger className={cn(
                  "w-full",
                  hasError("residencyStatus") && "border-red-500 focus:ring-red-500",
                  isFieldValid("residencyStatus") && "border-green-500"
                )}>
                  <SelectValue placeholder="Select residency status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOSTELITE">Hostelite</SelectItem>
                  <SelectItem value="LOCALITE">Localite</SelectItem>
                </SelectContent>
              </Select>
              {errors.residencyStatus && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.residencyStatus.message}</span>
                </p>
              )}
            </div>

            {/* Hostel Details */}
            {residencyStatus === "HOSTELITE" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="hostelName" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Hostel Name</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("hostelName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="hostelName"
                    {...register("hostelName")}
                    placeholder="Enter hostel name"
                    className={cn(
                      "w-full",
                      hasError("hostelName") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("hostelName") && "border-green-500"
                    )}
                  />
                  {errors.hostelName && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.hostelName.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Room Number</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("roomNumber") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="roomNumber"
                    {...register("roomNumber")}
                    placeholder="Enter room number"
                    className={cn(
                      "w-full",
                      hasError("roomNumber") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("roomNumber") && "border-green-500"
                    )}
                  />
                  {errors.roomNumber && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.roomNumber.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floorNumber" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Floor Number</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("floorNumber") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="floorNumber"
                    {...register("floorNumber")}
                    placeholder="Enter floor number"
                    className={cn(
                      "w-full",
                      hasError("floorNumber") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("floorNumber") && "border-green-500"
                    )}
                  />
                  {errors.floorNumber && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.floorNumber.message}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Local Details */}
            {residencyStatus === "LOCALITE" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="localCity" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Local City</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("localCity") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="localCity"
                      {...register("localCity")}
                      placeholder="Enter your local city"
                      className={cn(
                        "w-full",
                        hasError("localCity") && "border-red-500 focus-visible:ring-red-500",
                        isFieldValid("localCity") && "border-green-500"
                      )}
                    />
                    {errors.localCity && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.localCity.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-1 text-sm font-medium">
                      <span>Transport Mode</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("transportMode") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Select onValueChange={(value) => setValue("transportMode", value as any)}>
                      <SelectTrigger className={cn(
                        "w-full",
                        hasError("transportMode") && "border-red-500 focus:ring-red-500",
                        isFieldValid("transportMode") && "border-green-500"
                      )}>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSPORT_MODES.map(mode => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transportMode && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.transportMode.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {transportMode === "COLLEGE_BUS" && (
                  <div className="space-y-2">
                    <Label htmlFor="busRoute" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Bus Route</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("busRoute") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="busRoute"
                      {...register("busRoute")}
                      placeholder="Enter your bus route"
                      className={cn(
                        "w-full",
                        hasError("busRoute") && "border-red-500 focus-visible:ring-red-500",
                        isFieldValid("busRoute") && "border-green-500"
                      )}
                    />
                    {errors.busRoute && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.busRoute.message}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="pt-6 border-t space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Step 6 of 7 - Engineering Details
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
