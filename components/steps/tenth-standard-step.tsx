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
import { GraduationCap, Upload, AlertCircle, CheckCircle2, ArrowLeft, FileText, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { TenthStandardDetails } from "@/types/profile"
import { uploadFile } from "@/lib/upload-helpers"
import { toast } from "sonner"
import { INDIAN_STATES, STATE_CITIES, DISTRICTS_BY_STATE, BOARDS, MARKS_TYPES, MONTHS } from "@/lib/location-data"

const tenthStandardSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  state: z.string().min(2, "State is required"),
  board: z.enum(["STATE", "CBSE", "ICSE"]),
  passingYear: z.number().min(2000).max(new Date().getFullYear()),
  passingMonth: z.number().min(1).max(12),
  marksType: z.enum(["PERCENTAGE", "SUBJECTS_TOTAL", "OUT_OF_1000"]),
  percentage: z.number().min(0).max(100).optional(),
  subjects: z.number().min(1).optional(),
  totalMarks: z.number().min(0).optional(),
  marksOutOf1000: z.number().min(0).max(1000).optional(),
  marksCard: z.string().min(1, "Please upload marks card")
})

type TenthStandardForm = z.infer<typeof tenthStandardSchema>

interface TenthStandardStepProps {
  data: Partial<TenthStandardDetails>
  onNext: (data: Partial<TenthStandardDetails>) => Promise<void>
  onPrevious?: () => void
  isLoading: boolean
}

export function TenthStandardStep({ data, onNext, onPrevious, isLoading }: TenthStandardStepProps) {
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{name: string, url: string} | null>(
    data.marksCard ? { name: "Uploaded Marks Card", url: data.marksCard } : null
  )
  const [selectedState, setSelectedState] = useState<string>(data.state || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<TenthStandardForm>({
    resolver: zodResolver(tenthStandardSchema),
    defaultValues: {
      schoolName: data.schoolName || "",
      city: data.city || "",
      district: data.district || "",
      pincode: data.pincode || "",
      state: data.state || "",
      board: data.board || undefined,
      passingYear: data.passingYear || new Date().getFullYear(),
      passingMonth: data.passingMonth || 3,
      marksType: data.marksType || undefined,
      percentage: data.percentage || undefined,
      subjects: data.subjects || undefined,
      totalMarks: data.totalMarks || undefined,
      marksOutOf1000: data.marksOutOf1000 || undefined,
      marksCard: data.marksCard || ""
    }
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    try {
      const uploadResponse = await uploadFile(file, "tenthMarksCard", {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      })

      if (uploadResponse.success && uploadResponse.url) {
        setUploadedFile({ name: file.name, url: uploadResponse.url })
        setValue("marksCard", uploadResponse.url)
        toast.success("Marks card uploaded successfully!")
      } else {
        toast.error(uploadResponse.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploadingFile(false)
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    setValue("marksCard", "")
  }

  const onSubmit = async (formData: TenthStandardForm) => {
    await onNext({
      schoolName: formData.schoolName,
      city: formData.city,
      district: formData.district,
      pincode: formData.pincode,
      state: formData.state,
      board: formData.board,
      passingYear: formData.passingYear,
      passingMonth: formData.passingMonth,
      marksType: formData.marksType,
      percentage: formData.percentage,
      subjects: formData.subjects,
      totalMarks: formData.totalMarks,
      marksOutOf1000: formData.marksOutOf1000,
      marksCard: formData.marksCard
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
  const hasError = (fieldName: keyof TenthStandardForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof TenthStandardForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof TenthStandardForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  const marksType = watch("marksType")

  // Generate year options (current year - 20 to current year)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 20 + i)

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* School Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>School Information</span>
            </CardTitle>
            <CardDescription>
              Details about your 10th standard school and location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="flex items-center space-x-1 text-sm font-medium">
                <span>School Name</span>
                <span className="text-red-500">*</span>
                {isFieldValid("schoolName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Input
                id="schoolName"
                {...register("schoolName")}
                placeholder="Enter your school name"
                className={cn(
                  "w-full",
                  hasError("schoolName") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("schoolName") && "border-green-500"
                )}
              />
              {errors.schoolName && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.schoolName.message}</span>
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

        {/* Academic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              <span>Academic Details</span>
            </CardTitle>
            <CardDescription>
              Board, passing year, and examination details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Board</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("board") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("board", value as "STATE" | "CBSE" | "ICSE")}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("board") && "border-red-500 focus:ring-red-500",
                    isFieldValid("board") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOARDS.map(board => (
                      <SelectItem key={board.value} value={board.value}>
                        {board.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.board && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.board.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Passing Year</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("passingYear") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("passingYear", parseInt(value))}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("passingYear") && "border-red-500 focus:ring-red-500",
                    isFieldValid("passingYear") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.passingYear && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.passingYear.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Passing Month</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("passingMonth") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("passingMonth", parseInt(value))}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("passingMonth") && "border-red-500 focus:ring-red-500",
                    isFieldValid("passingMonth") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.passingMonth && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.passingMonth.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marks Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span>Marks Information</span>
            </CardTitle>
            <CardDescription>
              How would you like to enter your marks information?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center space-x-1 text-sm font-medium">
                <span>Marks Type</span>
                <span className="text-red-500">*</span>
                {isFieldValid("marksType") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Select onValueChange={(value) => setValue("marksType", value as "PERCENTAGE" | "SUBJECTS_TOTAL" | "OUT_OF_1000")}>
                <SelectTrigger className={cn(
                  "w-full",
                  hasError("marksType") && "border-red-500 focus:ring-red-500",
                  isFieldValid("marksType") && "border-green-500"
                )}>
                  <SelectValue placeholder="Select marks format" />
                </SelectTrigger>
                <SelectContent>
                  {MARKS_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marksType && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.marksType.message}</span>
                </p>
              )}
            </div>

            {/* Conditional fields based on marks type */}
            {marksType === "PERCENTAGE" && (
              <div className="space-y-2">
                <Label htmlFor="percentage" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Percentage (%)</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("percentage") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="percentage"
                  {...register("percentage", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Enter percentage (e.g., 85.5)"
                  className={cn(
                    "w-full",
                    hasError("percentage") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("percentage") && "border-green-500"
                  )}
                />
                {errors.percentage && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.percentage.message}</span>
                  </p>
                )}
              </div>
            )}

            {marksType === "SUBJECTS_TOTAL" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subjects" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Number of Subjects</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("subjects") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="subjects"
                    {...register("subjects", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="Enter number of subjects"
                    className={cn(
                      "w-full",
                      hasError("subjects") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("subjects") && "border-green-500"
                    )}
                  />
                  {errors.subjects && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.subjects.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalMarks" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Total Marks Obtained</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("totalMarks") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="totalMarks"
                    {...register("totalMarks", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="Enter total marks obtained"
                    className={cn(
                      "w-full",
                      hasError("totalMarks") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("totalMarks") && "border-green-500"
                    )}
                  />
                  {errors.totalMarks && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.totalMarks.message}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {marksType === "OUT_OF_1000" && (
              <div className="space-y-2">
                <Label htmlFor="marksOutOf1000" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Marks out of 1000</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("marksOutOf1000") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="marksOutOf1000"
                  {...register("marksOutOf1000", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="Enter marks out of 1000"
                  className={cn(
                    "w-full",
                    hasError("marksOutOf1000") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("marksOutOf1000") && "border-green-500"
                  )}
                />
                {errors.marksOutOf1000 && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.marksOutOf1000.message}</span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-orange-600" />
              <span>Document Upload</span>
            </CardTitle>
            <CardDescription>
              Upload your 10th standard marks card
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="marksCard" className="flex items-center space-x-1 text-sm font-medium">
                <span>10th Standard Marks Card</span>
                <span className="text-red-500">*</span>
                {isFieldValid("marksCard") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              
              {uploadedFile ? (
                <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                        <p className="text-xs text-green-600">File uploaded successfully</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={removeUploadedFile}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop your marks card
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG up to 10MB
                  </p>
                  <Input
                    id="marksCard"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('marksCard')?.click()}
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
              )}
              {errors.marksCard && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.marksCard.message}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="pt-6 border-t space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Step 4 of 7 - 10th Standard Details
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
