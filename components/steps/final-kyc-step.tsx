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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  X, 
  ArrowLeft, 
  GraduationCap,
  Linkedin,
  Github,
  Trophy,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FinalKYCDetails } from "@/types/profile"
import { uploadFile } from "@/lib/upload-helpers"
import { toast } from "sonner"

const finalKYCSchema = z.object({
  finalCgpa: z.number().min(0).max(10, "CGPA should be between 0 and 10"),
  activeBacklogs: z.boolean(),
  backlogSubjects: z.array(z.object({
    code: z.string(),
    title: z.string()
  })).optional(),
  branchMentorName: z.string().min(2, "Branch mentor name is required"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").regex(/linkedin\.com/, "Must be a LinkedIn URL"),
  github: z.string().url("Please enter a valid GitHub URL").regex(/github\.com/, "Must be a GitHub URL").optional().or(z.literal("")),
  leetcode: z.string().url("Please enter a valid LeetCode URL").regex(/leetcode\.com/, "Must be a LeetCode URL").optional().or(z.literal("")),
  resume: z.string().min(1, "Please upload your resume")
}).refine((data) => {
  if (data.activeBacklogs && (!data.backlogSubjects || data.backlogSubjects.length === 0)) {
    return false
  }
  return true
}, {
  message: "Please add at least one backlog subject",
  path: ["backlogSubjects"]
})

type FinalKYCForm = z.infer<typeof finalKYCSchema>

interface FinalKYCStepProps {
  data: Partial<FinalKYCDetails>
  onNext: (data: Partial<FinalKYCDetails>) => Promise<void>
  onPrevious?: () => void
  isLoading: boolean
}

export function FinalKYCStep({ data, onNext, onPrevious, isLoading }: FinalKYCStepProps) {
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadedResume, setUploadedResume] = useState<{name: string, url: string} | null>(
    data.resume ? { name: "Uploaded Resume", url: data.resume } : null
  )
  const [backlogSubjects, setBacklogSubjects] = useState<{code: string, title: string}[]>(
    data.backlogSubjects || []
  )
  const [newBacklogCode, setNewBacklogCode] = useState("")
  const [newBacklogTitle, setNewBacklogTitle] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<FinalKYCForm>({
    resolver: zodResolver(finalKYCSchema),
    defaultValues: {
      finalCgpa: data.finalCgpa || 0,
      activeBacklogs: data.activeBacklogs || false,
      backlogSubjects: data.backlogSubjects || [],
      branchMentorName: data.branchMentorName || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      leetcode: data.leetcode || "",
      resume: data.resume || ""
    }
  })

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingResume(true)
    try {
      const uploadResponse = await uploadFile(file, "resume", {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["application/pdf"]
      })

      if (uploadResponse.success && uploadResponse.url) {
        setUploadedResume({ name: file.name, url: uploadResponse.url })
        setValue("resume", uploadResponse.url)
        toast.success("Resume uploaded successfully!")
      } else {
        toast.error(uploadResponse.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploadingResume(false)
    }
  }

  const removeUploadedResume = () => {
    setUploadedResume(null)
    setValue("resume", "")
  }

  const addBacklogSubject = () => {
    if (newBacklogCode.trim() && newBacklogTitle.trim()) {
      const newSubject = { code: newBacklogCode.trim(), title: newBacklogTitle.trim() }
      const updatedBacklogs = [...backlogSubjects, newSubject]
      setBacklogSubjects(updatedBacklogs)
      setValue("backlogSubjects", updatedBacklogs)
      setNewBacklogCode("")
      setNewBacklogTitle("")
    }
  }

  const removeBacklogSubject = (index: number) => {
    const updatedBacklogs = backlogSubjects.filter((_, i) => i !== index)
    setBacklogSubjects(updatedBacklogs)
    setValue("backlogSubjects", updatedBacklogs)
  }

  const onSubmit = async (formData: FinalKYCForm) => {
    await onNext({
      finalCgpa: formData.finalCgpa,
      activeBacklogs: formData.activeBacklogs,
      backlogSubjects: formData.backlogSubjects,
      branchMentorName: formData.branchMentorName,
      linkedin: formData.linkedin,
      github: formData.github,
      leetcode: formData.leetcode,
      resume: formData.resume
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
  const hasError = (fieldName: keyof FinalKYCForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof FinalKYCForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof FinalKYCForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  const activeBacklogs = watch("activeBacklogs")

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Academic Performance</span>
            </CardTitle>
            <CardDescription>
              Your final CGPA and backlog status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="finalCgpa" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Final CGPA (up to current semester)</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("finalCgpa") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="finalCgpa"
                  {...register("finalCgpa", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="Enter your CGPA (e.g., 8.5)"
                  className={cn(
                    "w-full",
                    hasError("finalCgpa") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("finalCgpa") && "border-green-500"
                  )}
                />
                {errors.finalCgpa && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.finalCgpa.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-1 text-sm font-medium">
                  <span>Active Backlogs</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("activeBacklogs") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("activeBacklogs", value === "true")}>
                  <SelectTrigger className={cn(
                    "w-full",
                    hasError("activeBacklogs") && "border-red-500 focus:ring-red-500",
                    isFieldValid("activeBacklogs") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Do you have active backlogs?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No Active Backlogs</SelectItem>
                    <SelectItem value="true">Yes, I have Active Backlogs</SelectItem>
                  </SelectContent>
                </Select>
                {errors.activeBacklogs && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.activeBacklogs.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Backlog Subjects */}
            {activeBacklogs && (
              <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Label className="text-sm font-medium text-orange-800">
                  Backlog Subjects
                </Label>
                
                {/* Add new backlog */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Subject code (e.g., CS101)"
                    value={newBacklogCode}
                    onChange={(e) => setNewBacklogCode(e.target.value)}
                    className="h-8"
                  />
                  <Input
                    placeholder="Subject title"
                    value={newBacklogTitle}
                    onChange={(e) => setNewBacklogTitle(e.target.value)}
                    className="h-8"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addBacklogSubject}
                    disabled={!newBacklogCode.trim() || !newBacklogTitle.trim()}
                    className="h-8"
                  >
                    Add Subject
                  </Button>
                </div>

                {/* Display added backlogs */}
                {backlogSubjects.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-orange-700">Added Backlog Subjects:</p>
                    <div className="flex flex-wrap gap-2">
                      {backlogSubjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-2">
                          <span>{subject.code} - {subject.title}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-600" 
                            onClick={() => removeBacklogSubject(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {errors.backlogSubjects && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.backlogSubjects.message}</span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mentor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <span>Mentor Information</span>
            </CardTitle>
            <CardDescription>
              Your branch mentor details for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branchMentorName" className="flex items-center space-x-1 text-sm font-medium">
                <span>Branch Mentor Name</span>
                <span className="text-red-500">*</span>
                {isFieldValid("branchMentorName") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Input
                id="branchMentorName"
                {...register("branchMentorName")}
                placeholder="Enter your branch mentor's full name"
                className={cn(
                  "w-full",
                  hasError("branchMentorName") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("branchMentorName") && "border-green-500"
                )}
              />
              {errors.branchMentorName && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.branchMentorName.message}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Profiles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Linkedin className="w-5 h-5 text-blue-700" />
              <span>Professional Profiles</span>
            </CardTitle>
            <CardDescription>
              Your professional and coding profiles for recruiters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center space-x-1 text-sm font-medium">
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>LinkedIn Profile URL</span>
                <span className="text-red-500">*</span>
                {isFieldValid("linkedin") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Input
                id="linkedin"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/your-profile"
                className={cn(
                  "w-full",
                  hasError("linkedin") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("linkedin") && "border-green-500"
                )}
              />
              {errors.linkedin && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.linkedin.message}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center space-x-1 text-sm font-medium">
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile URL</span>
                  <span className="text-gray-500">(Optional)</span>
                  {isFieldValid("github") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="github"
                  {...register("github")}
                  placeholder="https://github.com/your-username"
                  className={cn(
                    "w-full",
                    hasError("github") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("github") && "border-green-500"
                  )}
                />
                {errors.github && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.github.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="leetcode" className="flex items-center space-x-1 text-sm font-medium">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span>LeetCode Profile URL</span>
                  <span className="text-gray-500">(Optional)</span>
                  {isFieldValid("leetcode") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Input
                  id="leetcode"
                  {...register("leetcode")}
                  placeholder="https://leetcode.com/your-username"
                  className={cn(
                    "w-full",
                    hasError("leetcode") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("leetcode") && "border-green-500"
                  )}
                />
                {errors.leetcode && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.leetcode.message}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-orange-600" />
              <span>Resume Upload</span>
            </CardTitle>
            <CardDescription>
              Upload your latest resume (PDF format only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resume" className="flex items-center space-x-1 text-sm font-medium">
                <span>Resume (PDF)</span>
                <span className="text-red-500">*</span>
                {isFieldValid("resume") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              
              {uploadedResume ? (
                <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">{uploadedResume.name}</p>
                        <p className="text-xs text-green-600">Resume uploaded successfully</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={removeUploadedResume}
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
                    Click to upload or drag and drop your resume
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF only, up to 5MB
                  </p>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('resume')?.click()}
                    disabled={uploadingResume}
                  >
                    {uploadingResume ? (
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
              {errors.resume && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.resume.message}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="pt-6 border-t space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Step 7 of 7 - Final KYC Details
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevious} 
              className="flex-1 md:flex-none flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 flex md:flex-none items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Registration</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
