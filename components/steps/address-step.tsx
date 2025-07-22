"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Home, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AddressDetails } from "@/types/profile"

const addressSchema = z.object({
  currentAddress: z.string().min(10, "Current address must be at least 10 characters long"),
  permanentAddress: z.string().optional(),
  sameAsCurrent: z.boolean(),
  country: z.string()
})

type AddressForm = z.infer<typeof addressSchema>

interface AddressStepProps {
  data: Partial<AddressDetails>
  onNext: (data: Partial<AddressDetails>) => Promise<void>
  onPrevious?: () => void
  isLoading: boolean
}

export function AddressStep({ data, onNext, onPrevious, isLoading }: AddressStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      currentAddress: data.currentAddress || "",
      permanentAddress: data.permanentAddress || "",
      sameAsCurrent: data.sameAsCurrent || false,
      country: data.country || "INDIA"
    }
  })

  const onSubmit = async (formData: AddressForm) => {
    // If sameAsCurrent is true, copy current address to permanent address
    if (formData.sameAsCurrent) {
      formData.permanentAddress = formData.currentAddress
    }
    await onNext(formData)
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      console.log("Previous navigation not available")
    }
  }

  // Helper functions
  const hasError = (fieldName: keyof AddressForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof AddressForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof AddressForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  const sameAsCurrent = watch("sameAsCurrent")
  const currentAddress = watch("currentAddress")

  // Auto-fill permanent address when sameAsCurrent is checked
  React.useEffect(() => {
    if (sameAsCurrent) {
      setValue("permanentAddress", currentAddress)
    }
  }, [sameAsCurrent, currentAddress, setValue])

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Current Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-blue-600" />
              <span>Current Address</span>
            </CardTitle>
            <CardDescription>
              The address where you currently reside
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentAddress" className="flex items-center space-x-1 text-sm font-medium">
                <span>Complete Current Address</span>
                <span className="text-red-500">*</span>
                {isFieldValid("currentAddress") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </Label>
              <Textarea
                id="currentAddress"
                {...register("currentAddress")}
                placeholder="Enter your complete current address including house/flat number, street, area, city, state, and pincode"
                rows={4}
                className={cn(
                  "w-full resize-none",
                  hasError("currentAddress") && "border-red-500 focus-visible:ring-red-500",
                  isFieldValid("currentAddress") && "border-green-500"
                )}
              />
              {errors.currentAddress && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.currentAddress.message}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Include: House/Flat No., Street, Area, City, State, Pincode
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center space-x-1 text-sm font-medium">
                <span>Country</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                value="INDIA"
                disabled
                className="w-full bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Currently supporting Indian addresses only
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permanent Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Permanent Address</span>
            </CardTitle>
            <CardDescription>
              The address on your official documents (if different from current address)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsCurrent"
                checked={sameAsCurrent}
                onCheckedChange={(checked) => setValue("sameAsCurrent", !!checked)}
              />
              <Label htmlFor="sameAsCurrent" className="text-sm font-medium">
                Same as current address
              </Label>
            </div>

            {!sameAsCurrent && (
              <div className="space-y-2">
                <Label htmlFor="permanentAddress" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Complete Permanent Address</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("permanentAddress") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Textarea
                  id="permanentAddress"
                  {...register("permanentAddress")}
                  placeholder="Enter your complete permanent address including house/flat number, street, area, city, state, and pincode"
                  rows={4}
                  className={cn(
                    "w-full resize-none",
                    hasError("permanentAddress") && "border-red-500 focus-visible:ring-red-500",
                    isFieldValid("permanentAddress") && "border-green-500"
                  )}
                />
                {errors.permanentAddress && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.permanentAddress.message}</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Include: House/Flat No., Street, Area, City, State, Pincode
                </p>
              </div>
            )}

            {sameAsCurrent && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Permanent address will be same as current address
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  This will automatically copy your current address as permanent address
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Verification Note */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent>
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-amber-800">Important Note</h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• Ensure addresses match your official documents (Aadhar, Passport, etc.)</p>
                  <p>• Include complete details including pincode for accurate verification</p>
                  <p>• Address verification may be required during document submission</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="pt-6 border-t space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Step 3 of 7 - Address Details
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
