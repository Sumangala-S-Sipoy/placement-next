// Comprehensive Profile Types for Complete Student Registration

export interface PersonalInfo {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE'
  bloodGroup: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE'
  stateOfDomicile: string
  nationality: string
  casteCategory: 'GEN' | 'OBC' | 'SC' | 'ST'
  profilePhoto?: string
}

export interface ContactAndParentDetails {
  // Student Contact Details
  email: string
  callingMobile: string
  whatsappMobile: string
  alternativeMobile?: string
  
  // Parent/Guardian Details
  fatherName?: string
  fatherDeceased: boolean
  fatherMobile?: string
  fatherEmail?: string
  fatherOccupation?: string
  motherName?: string
  motherDeceased: boolean
  motherMobile?: string
  motherEmail?: string
  motherOccupation?: string
}

export interface AddressDetails {
  currentAddress: string
  permanentAddress?: string
  sameAsCurrent: boolean
  country: string
}

export interface TenthStandardDetails {
  schoolName: string
  city: string
  district: string
  pincode: string
  state: string
  board: 'STATE' | 'CBSE' | 'ICSE'
  passingYear: number
  passingMonth: number
  marksType: 'PERCENTAGE' | 'SUBJECTS_TOTAL' | 'OUT_OF_1000'
  percentage?: number
  subjects?: number
  totalMarks?: number
  marksOutOf1000?: number
  marksCard: string
}

export interface TwelfthStandardDetails {
  schoolName: string
  city: string
  district: string
  pincode: string
  state: string
  board: 'STATE' | 'CBSE' | 'ICSE'
  passingYear: number
  passingMonth: number
  marksType: 'PERCENTAGE' | 'SUBJECTS_TOTAL' | 'OUT_OF_1000'
  percentage?: number
  subjects?: number
  totalMarks?: number
  marksOutOf1000?: number
  marksCard: string
}

export interface DiplomaDetails {
  collegeName: string
  city: string
  district: string
  pincode: string
  state: string
  stream: string
  certificate: string
  semesterSgpa?: Array<{semester: number, sgpa: number}>
  yearMarks?: Array<{year: number, marks: number}>
  percentage: number
}

export interface AcademicDetails {
  tenthStandard: TenthStandardDetails
  educationPath: 'twelfth' | 'diploma'
  twelfthStandard?: TwelfthStandardDetails
  diploma?: DiplomaDetails
}

export interface EngineeringDetails {
  collegeName: string
  city: string
  district: string
  pincode: string
  state: string
  branch: 'CSE' | 'ISE' | 'ECE' | 'EEE' | 'ME' | 'CE' | 'AIML' | 'DS'
  entryType: 'REGULAR' | 'LATERAL'
  seatCategory: 'KCET' | 'MANAGEMENT' | 'COMEDK'
  usn: string
  libraryId: string
  residencyStatus: 'HOSTELITE' | 'LOCALITE'
  
  // Hostel Details (conditional)
  hostelName?: string
  roomNumber?: string
  floorNumber?: string
  
  // Local Details (conditional)
  localCity?: string
  transportMode?: 'COLLEGE_BUS' | 'PRIVATE_TRANSPORT' | 'PUBLIC_TRANSPORT' | 'WALKING'
  busRoute?: string
}

export interface SemesterRecord {
  semester: number
  sgpa: number
  cgpa: number
  monthPassed: number
  yearPassed: number
  marksCard: string
  failedSubjects?: Array<{
    code: string
    title: string
    grade: string
  }>
  clearedAfterFailure?: {
    proof: string
    updatedGrade: string
  }
}

export interface EngineeringAcademicRecords {
  semesterRecords: SemesterRecord[]
}

export interface FinalKYCDetails {
  finalCgpa: number
  activeBacklogs: boolean
  backlogSubjects?: Array<{
    code: string
    title: string
  }>
  branchMentorName: string
  linkedin: string
  github?: string
  leetcode?: string
  resume: string
}

export interface ComprehensiveProfile {
  personalInfo: PersonalInfo
  contactAndParentDetails: ContactAndParentDetails
  addressDetails: AddressDetails
  academicDetails: AcademicDetails
  engineeringDetails: EngineeringDetails
  engineeringAcademicRecords: EngineeringAcademicRecords
  finalKYCDetails: FinalKYCDetails
}

// Form validation schemas
export interface FormValidationRules {
  personalInfo: {
    firstName: { required: true, autoUppercase: true }
    middleName: { required: true, defaultValue: '.' }
    lastName: { required: true, autoUppercase: true }
    dateOfBirth: { required: true }
    gender: { required: true, options: ['MALE', 'FEMALE'] }
    bloodGroup: { required: true }
    stateOfDomicile: { required: true }
    nationality: { readonly: true, default: 'INDIAN' }
    casteCategory: { required: true, options: ['GEN', 'OBC', 'SC', 'ST'] }
  }
  contactDetails: {
    email: { required: true, pattern: 'gmail', professional: true }
    callingMobile: { required: true, pattern: '10-digit' }
    whatsappMobile: { required: true }
    alternativeMobile: { optional: true, mustDiffer: true }
  }
  // ... other validation rules
}

// Profile completion status
export interface ProfileCompletionStatus {
  currentStep: number
  totalSteps: 7
  completedSteps: number[]
  isComplete: boolean
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'INCOMPLETE'
}
