"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { questions } from "@/lib/assessment-data"
import { CheckSquare, Mail, Lock, CheckCircle2, XCircle, Loader2, User, Phone, PoundSterling, Building, Search, AlertCircle, Shield, Clock, Zap, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { updateAssessmentProgress } from "@/app/actions/update-assessment-progress"
import { verifyEmailWithZeruh } from "@/app/actions/verify-email"
import { searchCompanies, getCompanyDetails, saveCompanyDetails, getCompanyOfficers } from "@/app/actions/companies-house-lookup"
import { sendOTP, verifyOTP } from "@/app/actions/send-otp"

export default function AssessmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle")
  
  // OTP verification states
  const OTP_LENGTH = 6
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])
  const resendIntervalRef = useRef<number | null>(null)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const isSubmittingRef = useRef(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [currentLeadStep, setCurrentLeadStep] = useState(0)
  const [loanAmount, setLoanAmount] = useState<number | null>(null)
  const [loanAmountSlider, setLoanAmountSlider] = useState<number[]>([10000]) // Default to £10k
  const [turnover, setTurnover] = useState<number | null>(null)
  
  // Companies House lookup states
  const [companySearchQuery, setCompanySearchQuery] = useState("")
  const [companySearchResults, setCompanySearchResults] = useState<any[]>([])
  const [isSearchingCompanies, setIsSearchingCompanies] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] = useState(false)
  const [companySearchError, setCompanySearchError] = useState("")
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Tracking parameters
  const [trackingParams, setTrackingParams] = useState<{
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
    clickId?: string
  }>({})

  useEffect(() => {
    // Capture tracking parameters from URL
    const params = {
      utmSource: searchParams.get("utm_source") || undefined,
      utmMedium: searchParams.get("utm_medium") || undefined,
      utmCampaign: searchParams.get("utm_campaign") || undefined,
      utmTerm: searchParams.get("utm_term") || undefined,
      utmContent: searchParams.get("utm_content") || undefined,
      clickId: searchParams.get("click_id") || searchParams.get("fbclid") || searchParams.get("gclid") || undefined
    }
    
    // Only set if we have at least one param
    if (Object.values(params).some(v => v !== undefined)) {
      setTrackingParams(params)
    }
  }, [searchParams])
  
  // Directors selection states
  const [companyOfficers, setCompanyOfficers] = useState<any[]>([])
  const [selectedDirector, setSelectedDirector] = useState<any>(null)
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false)
  const [showDirectorsSelection, setShowDirectorsSelection] = useState(false)

  const otpCode = otpDigits.join("")

  const resetOtpDigits = () => {
    setOtpDigits(Array(OTP_LENGTH).fill(""))
  }

  const clearResendInterval = () => {
    if (resendIntervalRef.current !== null) {
      window.clearInterval(resendIntervalRef.current)
      resendIntervalRef.current = null
    }
  }

  const stopResendCountdown = () => {
    clearResendInterval()
    setResendCountdown(0)
  }

  const startResendCountdown = () => {
    stopResendCountdown()
    setResendCountdown(60)
    resendIntervalRef.current = window.setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          stopResendCountdown()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      clearResendInterval()
    }
  }, [])

  // Initialize assessment record when component mounts
  useEffect(() => {
    const initializeAssessment = async () => {
      const savedSubmissionId = sessionStorage.getItem("submissionId")
      if (savedSubmissionId) {
        setSubmissionId(savedSubmissionId)
      }
    }

    initializeAssessment()
  }, []) // Only run once on mount

  useEffect(() => {
    // Handle question parameter from Companies House lookup
    const questionParam = searchParams.get("question")
    if (questionParam) {
      const questionIndex = parseInt(questionParam) - 1 // Convert to 0-based index
      if (questionIndex >= 0 && questionIndex < questions.length) {
        setCurrentQuestion(questionIndex)
      }
    }
  }, [searchParams, questions.length])

  // Sync slider and input values
  useEffect(() => {
    if (loanAmount !== null) {
      setLoanAmountSlider([loanAmount])
    }
  }, [loanAmount])

  useEffect(() => {
    if (loanAmountSlider[0] !== undefined) {
      setLoanAmount(loanAmountSlider[0])
    }
  }, [loanAmountSlider])

  // Save progress when loan amount or turnover changes
  useEffect(() => {
    if (submissionId && (loanAmount !== null || turnover !== null)) {
      const updatedAnswers = { ...answers }
      if (loanAmount !== null && currentQuestion === 1) { // Question 2 is loan amount
        updatedAnswers[2] = [0] // Default option for scoring
      }
      if (turnover !== null && currentQuestion === 3) { // Question 4 is turnover
        updatedAnswers[4] = [0] // Default option for scoring
      }
      
      if (Object.keys(updatedAnswers).length > 0) {
        // Save in background without blocking UI
        saveProgress(updatedAnswers).catch((error) => {
          console.error("[v0] Error saving progress in background:", error)
        })
      }
    }
  }, [loanAmount, turnover, submissionId])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1)
        // Reset directors selection if going back from it
        if (showDirectorsSelection) {
          setShowDirectorsSelection(false)
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [currentQuestion, showDirectorsSelection])

  useEffect(() => {
    if (currentLeadStep === 3 && showOtpInput) {
      const timeout = setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 150)

      return () => clearTimeout(timeout)
    }
  }, [currentLeadStep, showOtpInput])

  const question = questions[currentQuestion]
  
  // Calculate progress including directors selection as an extra step
  const totalSteps = questions.length + (answers[5]?.[0] === 0 ? 1 : 0) // Add 1 if limited company selected
  
  // For progress calculation, use the current question number
  // Company search is part of question 5, so don't change progress
  const progressStep = currentQuestion + (showDirectorsSelection ? 1 : 0)
  
  const progress = showLeadCapture ? 100 : ((progressStep + 1) / totalSteps) * 100

  // Companies House search functions
  const performCompanySearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCompanySearchResults([])
      return
    }

    setIsSearchingCompanies(true)
    setCompanySearchError("")

    try {
      const result = await searchCompanies(query)
      
      if (result.success && result.data) {
        setCompanySearchResults(result.data.items || [])
      } else {
        setCompanySearchError(result.error || "Failed to search companies")
      }
    } catch (err) {
      setCompanySearchError("An unexpected error occurred")
    } finally {
      setIsSearchingCompanies(false)
    }
  }, [])

  const handleCompanySearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCompanySearchQuery(value)
    setCompanySearchError("")

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debounced search
    if (value.trim().length >= 2) {
      const timeout = setTimeout(() => {
        performCompanySearch(value)
      }, 300) // 300ms delay
      setSearchTimeout(timeout)
    } else {
      setCompanySearchResults([])
    }
  }

  const handleSelectCompany = async (company: any) => {
    setSelectedCompany(company)
    setIsLoadingCompanyDetails(true)
    setCompanySearchError("")

    try {
      // Store basic company info in session for results pages
      sessionStorage.setItem("selectedCompany", JSON.stringify({
        company_number: company.company_number,
        company_name: company.title,
        company_status: company.company_status,
        company_type: company.company_type,
        date_of_creation: company.date_of_creation,
        address_snippet: company.address_snippet
      }))

      // Save company information to database immediately
      if (submissionId) {
        try {
          await updateAssessmentProgress({
            submissionId: submissionId,
            companyNumber: company.company_number,
            companyName: company.title,
            companyStatus: company.company_status,
            companyType: company.company_type,
            companyIncorporationDate: company.date_of_creation,
            companyAddress: {
              address_snippet: company.address_snippet,
              // We'll get full address details from getCompanyDetails if needed
            }
          })
        } catch (dbError) {
          // Silently handle save errors
        }
      }
      
      // Fetch detailed company information
      const detailsResult = await getCompanyDetails(company.company_number)
      if (detailsResult.success && detailsResult.data) {
        const details = detailsResult.data
        
        // Update database with detailed company information
        if (submissionId) {
          try {
            await updateAssessmentProgress({
              submissionId: submissionId,
              companyAddress: details.registered_office_address,
              companySicCodes: details.sic_codes,
              companyDescription: details.description,
              companyJurisdiction: details.jurisdiction,
              companyTypeFull: details.company_type,
              // Add any other fields from the detailed company data
            })
          } catch (dbError) {
            // Silently handle save errors
          }
        }
      }
      
      // Fetch company officers/directors
      setIsLoadingOfficers(true)
      const officersResult = await getCompanyOfficers(company.company_number)
      
      if (officersResult.success && officersResult.data) {
        // Save all company officers to database
        if (submissionId) {
          try {
            await updateAssessmentProgress({
              submissionId: submissionId,
              companyOfficers: officersResult.data.items
            })
          } catch (dbError) {
            // Silently handle save errors
          }
        }
        
        // Filter for directors only
        const directors = officersResult.data.items.filter((officer: any) => 
          officer.officer_role.toLowerCase().includes('director')
        )
        setCompanyOfficers(directors)
        setShowDirectorsSelection(true)
      } else {
        // If no directors found or error, continue normally
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
          } else {
            setShowLeadCapture(true)
          }
        }, 200)
      }
    } catch (err) {
      setCompanySearchError("An unexpected error occurred")
    } finally {
      setIsLoadingCompanyDetails(false)
      setIsLoadingOfficers(false)
    }
  }

  const formatDirectorName = (fullName: string) => {
    // Companies House format is typically "LAST NAME, First Name"
    // We need to convert to "First Name Last Name" in title case
    if (fullName.includes(',')) {
      const parts = fullName.split(',').map(part => part.trim())
      if (parts.length === 2) {
        const firstName = parts[1].toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        const lastName = parts[0].toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        return `${firstName} ${lastName}`
      }
    }
    // If no comma, convert to title case
    return fullName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleSelectDirector = (director: any) => {
    setSelectedDirector(director)
    // Pre-populate name with director's name, properly formatted
    const formattedName = formatDirectorName(director.name)
    setName(formattedName)
    
    // Save comprehensive director information to database
    if (submissionId) {
      try {
        updateAssessmentProgress({
          submissionId: submissionId,
          directorName: director.name,
          directorRole: director.officer_role,
          directorAppointedDate: director.appointed_on,
          directorNationality: director.nationality,
          directorOccupation: director.occupation,
        })
      } catch (dbError) {
        // Silently handle save errors
      }
    }
    
    // Continue to next question and then hide directors selection
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowLeadCapture(true)
      }
      setShowDirectorsSelection(false)
    }, 200)
  }

  const handleSkipDirectors = () => {
    // Continue without selecting a director
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowLeadCapture(true)
      }
      setShowDirectorsSelection(false)
    }, 200)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const saveEmailToSupabase = async (emailAddress: string) => {
    try {
      const databaseFields = mapAnswersToDatabaseFields(answers)
      
      await updateAssessmentProgress({
        submissionId: submissionId || undefined,
        email: emailAddress,
        ...databaseFields,
        ...trackingParams
      })
    } catch (error) {
      // Silently handle save errors
    }
  }

  const getAnswerLabel = (questionId: number, currentAnswers: Record<number, number[]>): string | undefined => {
    const answerIndices = currentAnswers[questionId]
    if (!answerIndices || answerIndices.length === 0) return undefined

    const question = questions.find((q) => q.id === questionId)
    if (!question) return undefined

    if (question.multiSelect) {
      return answerIndices
        .map((idx: number) => question.options[idx]?.label)
        .filter(Boolean)
        .join(", ")
    } else {
      return question.options[answerIndices[0]]?.label
    }
  }

  // Helper function to map answers to database fields
  const mapAnswersToDatabaseFields = (updatedAnswers: Record<number, number[]>) => {
    const question1Answer = updatedAnswers[1]?.[0] // Business owner question
    const question3Answer = updatedAnswers[3]?.[0] // Trading time question
    const question4Answer = updatedAnswers[4]?.[0] // Annual turnover question
    const question5Answer = updatedAnswers[5]?.[0] // Company type question
    const question6Answer = updatedAnswers[6]?.[0] // Finance purpose question
    const question7Answer = updatedAnswers[7]?.[0] // Credit profile question
    const question8Answer = updatedAnswers[8]?.[0] // Homeowner question

    return {
      question1BusinessOwner: question1Answer !== undefined ? question1Answer === 0 : undefined,
      question2LoanAmount: loanAmount ?? undefined,
      question3TradingTime: question3Answer !== undefined ? questions[2].options[question3Answer]?.label : undefined,
      question4AnnualTurnover: turnover ?? undefined,
      question5CompanyType: question5Answer !== undefined ? questions[4].options[question5Answer]?.label : undefined,
      question6FinancePurpose: question6Answer !== undefined ? questions[5].options[question6Answer]?.label : undefined,
      question7CreditProfile: question7Answer !== undefined ? questions[6].options[question7Answer]?.label : undefined,
      question8Homeowner: question8Answer !== undefined ? question8Answer === 0 : undefined,
      currentQuestion: currentQuestion + 1,
      answers: updatedAnswers,
    }
  }

  const saveProgress = async (updatedAnswers: Record<number, number[]>) => {
    const questionsAnswered = Object.keys(updatedAnswers)
      .map(key => parseInt(key))
      .sort((a, b) => a - b)

    const databaseFields = mapAnswersToDatabaseFields(updatedAnswers)

    // Ensure we have a submission ID before trying to save
    if (!submissionId) {
      try {
        const result = await updateAssessmentProgress({
          questionsAnswered,
          isCompleted: false,
          ...databaseFields,
          ...trackingParams
        })
        
        if (result.success && result.data) {
          const newSubmissionId = result.data.id
          setSubmissionId(newSubmissionId)
          sessionStorage.setItem("submissionId", newSubmissionId)
        }
      } catch (error) {
        // Silently handle initialization errors
      }
      return
    }

    updateAssessmentProgress({
      submissionId: submissionId, // Always use existing submission ID
      questionsAnswered: questionsAnswered,
      isCompleted: false,
      ...databaseFields,
      ...trackingParams
    })
      .catch((error) => {
        // Silently handle save errors
      })
  }

  const calculateScoreAndRoute = async () => {
    const totalScore = Object.entries(answers).reduce((sum, [qId, optionIndices]) => {
      const q = questions.find((qu) => qu.id === Number.parseInt(qId))
      if (!q) return sum
      if (q.multiSelect) {
        return sum + optionIndices.reduce((s, idx) => s + q.options[idx].points, 0)
      }
      return sum + q.options[optionIndices[0]].points
    }, 0)

    // Check qualification criteria:
    // 1. Yes business owner (question 1)
    // 2. 12+ months trading (question 3) 
    // 3. Limited company (question 5)
    // 4. Annual turnover over £360k (question 4)
    const businessOwnerAnswer = answers[1]?.[0]
    const tradingTimeAnswer = answers[3]?.[0]
    const companyTypeAnswer = answers[5]?.[0]
    
    const isBusinessOwner = businessOwnerAnswer === 0 // "Yes" option
    const hasTradingTime = tradingTimeAnswer !== undefined && tradingTimeAnswer !== 2 // Not "0-11 months" (12+ months)
    const isLimitedCompany = companyTypeAnswer === 0 // "Limited company" option
    const hasTurnover = turnover !== null && turnover >= 360000 // Use turnover input field, minimum £360k
    
    const isQualified = isBusinessOwner && hasTradingTime && isLimitedCompany && hasTurnover

    const getAnswerLabel = (questionId: number) => {
      const answerIndices = answers[questionId]
      if (!answerIndices || answerIndices.length === 0) {
        return undefined
      }

      const questionData = questions.find((question) => question.id === questionId)
      if (!questionData) {
        return undefined
      }

      return questionData.options[answerIndices[0]]?.label
    }

    const tradingDurationLabel = getAnswerLabel(3)
    const companyTypeLabel = getAnswerLabel(5)
    const financePurposeLabel = getAnswerLabel(6)
    const creditProfileLabel = getAnswerLabel(7)
    const homeownerLabel = getAnswerLabel(8)

    const formattedTurnover = turnover !== null ? `£${turnover.toLocaleString()}` : undefined

    // Create lead data object for results pages
    const leadData = {
      email: email,
      name: name || sessionStorage.getItem("userName") || "",
      phone: phone || sessionStorage.getItem("userPhone") || "",
      loanAmount: loanAmount,
      turnover: turnover,
      tradingDuration: tradingDurationLabel,
      annualTurnover: formattedTurnover,
      companyType: companyTypeLabel,
      financePurpose: financePurposeLabel,
      creditProfile: creditProfileLabel,
      isHomeowner: homeownerLabel,
      score: totalScore,
      isQualified: isQualified,
      answers: answers,
      submissionId: submissionId,
      timestamp: new Date().toISOString()
    }

    const finalDatabaseFields = mapAnswersToDatabaseFields(answers)
    
    try {
      await updateAssessmentProgress({
        submissionId: submissionId || undefined,
        score: totalScore,
        qualificationStatus: isQualified ? "qualified" : "not-qualified",
        email: email,
        firstName: name.split(' ')[0] || undefined,
        lastName: name.split(' ').slice(1).join(' ') || undefined,
        phone: phone,
        consentGiven: true,
        isCompleted: true,
        ...finalDatabaseFields,
        ...trackingParams
      })
    } catch (error) {
      console.error("[v0] Error saving final assessment progress:", error)
    }

    // Store data in sessionStorage for results pages
    sessionStorage.setItem("assessmentScore", totalScore.toString())
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(answers))
    sessionStorage.setItem("isQualified", isQualified.toString())
    sessionStorage.setItem("userEmail", email)
    sessionStorage.setItem("leadData", JSON.stringify(leadData))

    // Route to appropriate results page
    if (isQualified) {
      router.push("/results/r1")
    } else {
      router.push("/results/r2")
    }
  }

  const handleAnswer = async (optionIndex: number) => {
    const option = question.options[optionIndex]

    if (question.multiSelect) {
      const currentAnswers = answers[question.id] || []
      const noneIndex = question.options.findIndex((opt) => opt.label === "None of the above")

      let newAnswers
      if (optionIndex === noneIndex) {
        newAnswers = { ...answers, [question.id]: [optionIndex] }
      } else {
        const updatedCurrentAnswers = currentAnswers.includes(optionIndex)
          ? currentAnswers.filter((i) => i !== optionIndex)
          : [...currentAnswers.filter((i) => i !== noneIndex), optionIndex]
        newAnswers = { ...answers, [question.id]: updatedCurrentAnswers }
      }
      
      setAnswers(newAnswers)
      
      // Save in background without blocking UI
      saveProgress(newAnswers).catch(() => {
        // Silently handle save errors
      })
    } else {
      const updatedAnswers = { ...answers, [question.id]: [optionIndex] }
      setAnswers(updatedAnswers)

      // Save in background without blocking UI
      saveProgress(updatedAnswers).catch(() => {
        // Silently handle save errors
      })

      // Proceed immediately without waiting for save
      setTimeout(() => {
        // Check if this is the company type question and "Limited company" was selected
        if (question.id === 5 && optionIndex === 0) {
          // Stay on the same question to show Companies House lookup
          return
        }
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          setShowLeadCapture(true)
        }
      }, 200)
    }
  }

  const handleContinue = async () => {
    // Save in background without blocking UI
    saveProgress(answers).catch((error) => {
      console.error("[v0] Error saving progress in background:", error)
    })

    // Proceed immediately without waiting for save
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowLeadCapture(true)
    }
  }

  const canContinue = question.multiSelect && answers[question.id]?.length > 0

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    // UK phone number validation
    // Accepts: 10 digits (landline/mobile) or 11 digits (with leading 0)
    // Examples: 01234567890, 07123456789, +447123456789
    if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
      return true
    }
    
    // International format with country code
    if (phoneNumber.startsWith('+')) {
      return digitsOnly.length >= 10
    }
    
    return false
  }

  const handleSendOTP = async () => {
    if (!phone || phone.trim().length === 0) {
      setOtpError("Please enter a valid phone number")
      return
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      setOtpError("Please enter a valid UK phone number")
      return
    }

    setIsSendingOtp(true)
    setOtpError("")

    const result = await sendOTP(phone)

    if (result.success) {
      resetOtpDigits()
      setShowOtpInput(true)
      startResendCountdown()
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 150)
    } else {
      setOtpError(result.error || "Failed to send verification code")
    }

    setIsSendingOtp(false)
  }

  const handleVerifyOTP = async () => {
    if (otpCode.length !== OTP_LENGTH) {
      setOtpError(`Please enter the ${OTP_LENGTH}-digit verification code`)
      return
    }

    if (isSubmittingRef.current || isVerifyingOtp) {
      return
    }

    isSubmittingRef.current = true
    setIsVerifyingOtp(true)
    setOtpError("")

    try {
      const result = await verifyOTP(phone, otpCode)

      if (result.success) {
        // OTP verified successfully - save name and phone to Supabase
        
        // Store name and phone in sessionStorage for results pages
        sessionStorage.setItem("userName", name)
        sessionStorage.setItem("userPhone", phone)
        
        // Proceed to results page
        await calculateScoreAndRoute()
        stopResendCountdown()
      } else {
        setOtpError(result.error || "Invalid verification code. Please try again.")
        setIsVerifyingOtp(false)
        isSubmittingRef.current = false
      }
    } catch (error) {
      setOtpError("An unexpected error occurred. Please try again.")
      setIsVerifyingOtp(false)
      isSubmittingRef.current = false
    }
  }

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const newDigits = [...otpDigits]

    if (!cleaned) {
      newDigits[index] = ""
      setOtpDigits(newDigits)
      setOtpError("")
      return
    }

    newDigits[index] = cleaned.slice(-1)
    setOtpDigits(newDigits)
    setOtpError("")

    if (index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      event.preventDefault()
      const previousIndex = index - 1
      const newDigits = [...otpDigits]
      newDigits[previousIndex] = ""
      setOtpDigits(newDigits)
      setOtpError("")
      otpInputRefs.current[previousIndex]?.focus()
      return
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      otpInputRefs.current[index - 1]?.focus()
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault()
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!pasted) {
      return
    }

    const newDigits = [...otpDigits]
    let nextIndex = index

    for (const char of pasted) {
      if (nextIndex >= OTP_LENGTH) {
        break
      }

      newDigits[nextIndex] = char
      nextIndex += 1
    }

    for (let i = nextIndex; i < OTP_LENGTH; i++) {
      newDigits[i] = ""
    }

    setOtpDigits(newDigits)
    setOtpError("")

    if (nextIndex <= OTP_LENGTH - 1) {
      otpInputRefs.current[nextIndex]?.focus()
    } else {
      otpInputRefs.current[OTP_LENGTH - 1]?.blur()
    }
  }

  const handleLeadStepNext = async () => {
    if (currentLeadStep === 2) {
      // Email step - validate email with Zeru
      if (!email || !validateEmail(email)) {
        setEmailError("Please enter a valid email address")
        return
      }

      setEmailVerificationStatus("verifying")
      setEmailError("")

      try {
        const result = await verifyEmailWithZeruh(email)

        if (result?.success) {
          setEmailVerificationStatus("valid")
          // Save email to Supabase
          await saveEmailToSupabase(email)
          setCurrentLeadStep(3)
          resetOtpDigits()
          setShowOtpInput(false)
          stopResendCountdown()
        } else {
          setEmailVerificationStatus("invalid")
          setEmailError(result?.error || "This email address appears to be invalid. Please check and try again.")
        }
      } catch (err) {
        setEmailVerificationStatus("invalid")
        setEmailError("We couldn't verify your email right now. Please try again.")
      }
    } else if (currentLeadStep === 3) {
      // Phone step - send OTP if not sent yet
      if (!showOtpInput) {
        await handleSendOTP()
      } else {
        // OTP input is showing, verify it
        await handleVerifyOTP()
      }
    } else if (currentLeadStep < 3) {
      setCurrentLeadStep(currentLeadStep + 1)
    }
  }

  const canProceedLeadStep = () => {
    switch (currentLeadStep) {
      case 0:
        return true // Congratulations screen - always can proceed
      case 1:
        return name.trim().length > 0
      case 2:
        return email.trim().length > 0 && validateEmail(email) && emailVerificationStatus !== "verifying"
      case 3:
        if (!showOtpInput) {
          return phone.trim().length > 0 && !isSendingOtp
        } else {
          return otpCode.length === OTP_LENGTH && !isVerifyingOtp
        }
      default:
        return false
    }
  }

  const getLeadStepIcon = (step: number) => {
    if (currentLeadStep > step) return CheckCircle2
    if (currentLeadStep === step) return step === 0 ? CheckCircle2 : step === 1 ? User : step === 2 ? Mail : Phone
    return User
  }

  const getLeadStepTitle = () => {
    const businessOwnerAnswer = answers[1]?.[0]
    const tradingTimeAnswer = answers[3]?.[0]
    const companyTypeAnswer = answers[5]?.[0]
    const isBusinessOwner = businessOwnerAnswer === 0 
    const hasTradingTime = tradingTimeAnswer !== undefined && tradingTimeAnswer !== 2 
    const isLimitedCompany = companyTypeAnswer === 0 
    const hasTurnover = turnover !== null && turnover >= 360000 
    const isQualified = isBusinessOwner && hasTradingTime && isLimitedCompany && hasTurnover

    switch (currentLeadStep) {
      case 0:
        return isQualified ? "Congratulations 🎉" : "Almost there..."
      case 1:
        return "Let's start with your name"
      case 2:
        return "What's your email address?"
      case 3:
        return showOtpInput ? "Enter verification code" : "Last one! We just need your phone number"
      default:
        return ""
    }
  }

  const getLeadStepDescription = () => {
    switch (currentLeadStep) {
      case 0:
        return ""
      case 1:
        return ""
      case 2:
        return ""
      case 3:
        return ""
      default:
        return ""
    }
  }

  // Lead capture screen - shown after assessment completion
  if (showLeadCapture) {
    // Calculate score and qualification status for preview
    const totalScore = Object.entries(answers).reduce((sum, [qId, optionIndices]) => {
      const q = questions.find((qu) => qu.id === Number.parseInt(qId))
      if (!q) return sum
      if (q.multiSelect) {
        return sum + optionIndices.reduce((s, idx) => s + q.options[idx].points, 0)
      }
      return sum + q.options[optionIndices[0]].points
    }, 0)

    // Check qualification criteria:
    // 1. Yes business owner (question 1)
    // 2. 12+ months trading (question 3) 
    // 3. Limited company (question 5)
    // 4. Annual turnover over £360k (question 4)
    const businessOwnerAnswer = answers[1]?.[0]
    const tradingTimeAnswer = answers[3]?.[0]
    const companyTypeAnswer = answers[5]?.[0]
    
    const isBusinessOwner = businessOwnerAnswer === 0 // "Yes" option
    const hasTradingTime = tradingTimeAnswer !== undefined && tradingTimeAnswer !== 2 // Not "0-11 months" (12+ months)
    const isLimitedCompany = companyTypeAnswer === 0 // "Limited company" option
    const hasTurnover = turnover !== null && turnover >= 360000 // Use turnover input field, minimum £360k
    
    const isQualified = isBusinessOwner && hasTradingTime && isLimitedCompany && hasTurnover

    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#F8F1EC' }}>
        {/* Header for lead capture */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-bold text-primary">Tally</span>
                <Image src="/trustpilot-logo.png" alt="Trustpilot" width={150} height={40} className="h-8 w-auto" />
              </div>
            </div>
          </div>
        </header>

        {/* Blurred quote background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">
              {/* Blurred quote content */}
              <div className="mb-6 pb-4 border-b border-border">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Business Finance Quote</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Quote Date</p>
                    <p className="text-xs font-medium">
                      {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-medium mb-3">Your Loan Amount</h3>
                  <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                    <span className="text-4xl font-bold text-muted-foreground">£{loanAmount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="text-center mt-3">
                    <p className="font-semibold text-sm">Pre-approved Amount</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available for immediate drawdown
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-medium mb-3">Quote Summary</h3>
                  <div className="space-y-3">
                    {["Interest Rate", "Term Length", "Monthly Payment", "Total Cost", "Approval Time"].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-muted-foreground">{item}</span>
                          <span className="text-xs font-medium">
                            {index === 0 ? "3.9% - 7.5%" : 
                             index === 1 ? "1-5 years" :
                             index === 2 ? `£${Math.round((loanAmount || 0) * 0.02).toLocaleString()}` :
                             index === 3 ? `£${Math.round((loanAmount || 0) * 1.15).toLocaleString()}` :
                             "24 hours"}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-muted-foreground/30 transition-all" style={{ width: `${Math.floor(Math.random() * 40) + 30}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <h3 className="text-base font-medium mb-3">Funding Options Available</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-xs text-muted-foreground mb-1">Business Loan</p>
                    <p className="text-xl font-bold text-muted-foreground mb-1">£10k - £2m</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Flexible terms from 1-5 years</p>
                  </div>
                  <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-xs text-muted-foreground mb-1">Asset Finance</p>
                    <p className="text-xl font-bold text-muted-foreground mb-1">Up to 100%</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Equipment and vehicle financing</p>
                  </div>
                  <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-xs text-muted-foreground mb-1">Property Finance</p>
                    <p className="text-xl font-bold text-muted-foreground mb-1">Up to 80% LTV</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Commercial property investment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

        {/* Lead capture overlay */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4">
            <div className={`w-full max-w-md ${currentLeadStep === 3 ? "py-32" : "py-12"}`}>
              <Card className="border-primary/30 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl mb-2">{getLeadStepTitle()}</h3>
                    {currentLeadStep === 0 && (
                      <div className="mb-6">
                        {isQualified ? (
                          <>
                            <div className="bg-muted/30 rounded-lg p-6 mb-4">
                              <h4 className="font-semibold text-lg mb-3">Your Pre-Approved Loan</h4>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">£{loanAmount?.toLocaleString() || '0'}</div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Brilliant! You could get your £{loanAmount?.toLocaleString() || '0'} loan in under 4hrs. Just a few quick details and we'll send your personalised quote straight over.
                            </p>
                          </>
                        ) : (
                          <div className="bg-muted/30 rounded-lg p-6 mb-4">
                            <h4 className="font-semibold text-lg mb-3">Assessment Complete</h4>
                            <p className="text-sm text-muted-foreground">
                              We have analysed your details. Please provide your contact information to receive your personalised funding options.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {getLeadStepDescription() && (
                      <p className="text-sm text-muted-foreground mb-6">
                        {getLeadStepDescription()}
                      </p>
                    )}
                  </div>


                  <div className="space-y-4">
                    {currentLeadStep === 1 && (
                      <div>
                        <Label htmlFor="name" className="mb-1.5 block text-sm">
                          Full name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-12 rounded-md bg-white border-2"
                            placeholder="Enter your full name"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {currentLeadStep === 2 && (
                      <div>
                        <Label htmlFor="email" className="mb-1.5 block text-sm">
                          Email address <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              setEmailVerificationStatus("idle")
                              setEmailError("")
                            }}
                            className="pl-10 h-12 rounded-md bg-white border-2"
                            placeholder="Enter your email address"
                            autoFocus
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          We'll email your personalised quote to you
                        </p>
                        {emailVerificationStatus === "verifying" && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">Verifying email address...</p>
                          </div>
                        )}
                        {emailVerificationStatus === "valid" && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <p className="text-xs text-green-600">Email verified successfully</p>
                          </div>
                        )}
                        {emailError && <p className="text-xs text-destructive mt-1.5">{emailError}</p>}
                      </div>
                    )}

                    {currentLeadStep === 3 && !showOtpInput && (
                      <div>
                        <Label htmlFor="phone" className="mb-1.5 block text-sm">
                          Phone number <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10 h-12 rounded-md bg-white border-2"
                            placeholder="Enter your phone number"
                            autoFocus
                            disabled={isSendingOtp}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          We just need your phone number in case we have any questions
                        </p>
                        {otpError && <p className="text-xs text-destructive mt-1.5">{otpError}</p>}
                      </div>
                    )}

                    {currentLeadStep === 3 && showOtpInput && (
                      <div className="space-y-5">
                        <div className="text-center space-y-2">
                          <h4 className="text-lg font-semibold text-foreground">Mobile Phone Verification</h4>
                          <p className="text-sm text-muted-foreground">
                            Enter the {OTP_LENGTH}-digit verification code we sent to {phone}.
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <div className="grid grid-cols-6 gap-3">
                            {otpDigits.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => {
                                  otpInputRefs.current[index] = el
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(event) => handleOtpDigitChange(index, event.target.value)}
                                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                                onPaste={(event) => handleOtpPaste(index, event)}
                                onFocus={(event) => event.target.select()}
                                disabled={isVerifyingOtp}
                                className="h-14 w-12 rounded-lg border-2 border-input bg-white text-center text-2xl font-semibold tracking-wide transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                                aria-label={`Digit ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {otpError && <p className="text-xs text-destructive text-center">{otpError}</p>}

                        <div className="space-y-3">
                          <div className="text-center text-sm text-muted-foreground">
                            Didn't receive a code?{" "}
                            <button
                              type="button"
                              onClick={handleSendOTP}
                            disabled={isSendingOtp || isVerifyingOtp || resendCountdown > 0}
                            className="ml-1 font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                            >
                            {isSendingOtp
                              ? "Resending..."
                              : resendCountdown > 0
                                ? `Resend in ${resendCountdown}s`
                                : "Resend"}
                            </button>
                          </div>

                        <div className="text-center text-sm text-muted-foreground">
                          <button
                            type="button"
                            onClick={() => {
                              setShowOtpInput(false)
                              resetOtpDigits()
                              setOtpError("")
                              stopResendCountdown()
                            }}
                            className="inline-flex items-center gap-1 ml-1 font-medium text-primary hover:underline"
                          >
                            <ChevronLeft className="h-3 w-3" />
                            Use a different phone number
                          </button>
                      </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full h-12"
                      onClick={handleLeadStepNext}
                      disabled={!canProceedLeadStep()}
                    >
                      {currentLeadStep === 0 ? "Get My Quote" : 
                       currentLeadStep === 2 ? (emailVerificationStatus === "verifying" ? "Verifying..." : "Continue") :
                       currentLeadStep === 3 && !showOtpInput ? (isSendingOtp ? "Sending..." : "See My Quote") :
                       currentLeadStep === 3 && showOtpInput ? (isVerifyingOtp ? "Verifying..." : "Get My Quote") :
                       "Continue"}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Your information is secure and confidential</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Legal disclaimer footer - only show on phone number step */}
          {currentLeadStep === 3 && (
            <div className="w-full bg-slate-800 text-slate-100 py-16 px-12 mt-64">
              <div className="max-w-4xl mx-auto">
                <div className="text-sm leading-relaxed space-y-3 text-slate-500">
                  <p>
                    <strong className="text-slate-400">By clicking See My Quote,</strong> you confirm that you have read and agree with our Privacy Policy, Terms & Conditions and agree to be contacted by a reputable Finance Broker/Lender, by Telephone, Email and SMS to discuss your options and provide a quote.
                  </p>
                  <p>
                    To enable our Lenders or Credit Brokers to provide you with the quote they will need to undertake a free eligibility check which will involve a soft search, this will not affect your credit score.
                  </p>
                  <p>
                    TallyFinance.co.uk will occasionally send an SMS and/or email to you to keep you updated on similar business products & services.
                  </p>
                  <p>
                    You can opt-out at any time from receiving marketing communications from Tally Finance.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-600">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-4 text-xs text-slate-700">
                      <Link href="/privacy-policy" className="hover:text-slate-500 transition-colors">
                        Privacy Policy
                      </Link>
                      <Link href="/terms-and-conditions" className="hover:text-slate-500 transition-colors">
                        Terms & Conditions
                      </Link>
                    </div>
                    <p className="text-xs text-slate-700 text-center">
                      © 2025 Tally. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F1EC' }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-primary">Tally</span>
              <Image src="/trustpilot-logo.png" alt="Trustpilot" width={150} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          {currentQuestion === 0 && (
            <div className="mb-6 text-center">
              <h2 className="font-serif text-2xl sm:text-3xl mb-3 text-balance font-bold">
                See if you qualify for a business loan
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Take our quick and easy assessment to discover what business finance options are available to you. 
                Get funded in as little as 4 hours. It only takes a couple of minutes!
              </p>
              <div className="w-16 h-px bg-border mx-auto mt-4" />
            </div>
          )}

          <div className="mb-4">
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="mb-3">
            <h1 className="font-serif text-lg sm:text-xl mb-1 text-balance leading-tight font-bold">
              {showDirectorsSelection 
                ? "Are you one of the company directors?"
                : question.id === 5 && answers[5]?.[0] === 0 
                  ? "Please search for your limited company" 
                  : question.question}
            </h1>
            {showDirectorsSelection ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                We found the following directors for {selectedCompany?.title}. Please select yourself if you're listed.
              </p>
            ) : question.id === 5 && answers[5]?.[0] === 0 ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Just need to verify your company details to continue - this helps us find the best options for you.
              </p>
            ) : question.subtitle && (
              <p className="text-xs text-muted-foreground leading-relaxed">{question.subtitle}</p>
            )}
          </div>

          {/* Special handling for Companies House lookup after company type selection */}
          {question.id === 5 && answers[5]?.[0] === 0 && !showDirectorsSelection ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="companySearch" className="mb-1.5 block text-sm">
                  Company name or number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companySearch"
                    type="text"
                    required
                    value={companySearchQuery}
                    onChange={handleCompanySearchInput}
                    className="pl-10 h-12 rounded-md bg-white border-2"
                    placeholder="Enter your company name or registration number"
                    autoFocus
                  />
                  {isSearchingCompanies && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Simply start typing and we'll search for your company automatically
                </p>
              </div>

              {companySearchError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{companySearchError}</p>
                  </div>
                </div>
              )}

              {companySearchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
                  {companySearchResults.map((company) => (
                    <Card
                      key={company.company_number}
                      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                        selectedCompany?.company_number === company.company_number
                          ? "border-2 border-primary bg-white shadow-lg shadow-primary/20"
                          : "border-border bg-white"
                      }`}
                      onClick={() => handleSelectCompany(company)}
                    >
                      <CardContent className="py-1.5 sm:py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-2">
                              <h4 className="font-medium text-foreground text-xs sm:text-base">{company.title}</h4>
                              <span className={`text-xs px-1 py-0.5 sm:px-2 sm:py-1 rounded-full bg-muted ${
                                company.company_status?.toLowerCase() === "active" 
                                  ? "text-green-600" 
                                  : company.company_status?.toLowerCase() === "dissolved"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}>
                                {company.company_status || "Unknown"}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-0 sm:mb-1">
                              No: {company.company_number}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-0 sm:mb-1">
                              {new Date(company.date_of_creation).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short", 
                                year: "numeric"
                              })}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {company.address_snippet}
                            </p>
                            {company.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-2">
                                {company.description}
                              </p>
                            )}
                          </div>
                          {selectedCompany?.company_number === company.company_number && isLoadingCompanyDetails && (
                            <Loader2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-spin text-primary" />
                          )}
                          {selectedCompany?.company_number === company.company_number && !isLoadingCompanyDetails && (
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-green-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
                        ) : showDirectorsSelection ? (
            <div className="space-y-6">

              {isLoadingOfficers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Fetching company directors...</span>
                </div>
              ) : companyOfficers.length > 0 ? (
                <div className="space-y-3">
                  {companyOfficers.map((director, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                        selectedDirector?.name === director.name
                          ? "border-2 border-primary bg-white shadow-lg shadow-primary/20"
                          : "border-border bg-white"
                      }`}
                      onClick={() => handleSelectDirector(director)}
                    >
                      <CardContent className="py-1.5 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-xs sm:text-base mb-0 sm:mb-1">{director.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-0 sm:mb-1">
                              {director.officer_role}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {new Date(director.appointed_on).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short", 
                                year: "numeric"
                              })}
                            </p>
                            {director.occupation && (
                              <p className="text-xs text-muted-foreground mt-0 sm:mt-1">
                                {director.occupation}
                              </p>
                            )}
                          </div>
                          {selectedDirector?.name === director.name && (
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-green-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    No directors found for this company.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSkipDirectors}
                  className="flex-1 h-12"
                >
                  I'm not listed
                </Button>
                {companyOfficers.length > 0 && (
                  <Button
                    onClick={() => {
                      if (selectedDirector) {
                        handleSelectDirector(selectedDirector)
                      }
                    }}
                    disabled={!selectedDirector}
                    className="flex-1 h-12"
                  >
                    That's me
                  </Button>
                )}
              </div>
            </div>
          ) : question.inputType === "amount" ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="loanAmount" className="mb-1.5 block text-sm">
                  Loan amount (an estimate is fine) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="loanAmount"
                    type="text"
                    required
                    value={loanAmount ? loanAmount.toLocaleString() : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '')
                      if (value === '') {
                        setLoanAmount(null)
                      } else {
                        const numValue = Number(value)
                        if (!isNaN(numValue) && numValue >= 0 && numValue <= 2000000) {
                          setLoanAmount(numValue)
                        }
                      }
                    }}
                    className="pl-10 h-12 rounded-md bg-white border-2"
                    placeholder="Enter loan amount"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Don't worry if you're not sure exactly - we can work with an estimate! Minimum £10,000 • Maximum £2,000,000
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Or use our handy slider</Label>
                <div className="px-1 py-4">
                  <Slider
                    value={loanAmountSlider}
                    onValueChange={setLoanAmountSlider}
                    min={10000}
                    max={2000000}
                    step={1000}
                    className="w-full h-8"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-3">
                    <span>£10k</span>
                    <span>£2m</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12"
                onClick={() => {
                  const updatedAnswers = { ...answers, [question.id]: [0] } // Default to first option for scoring
                  setAnswers(updatedAnswers)
                  // Save in background without blocking UI
                  saveProgress(updatedAnswers).catch((error) => {
                    console.error("[v0] Error saving progress in background:", error)
                  })
                  
                  setTimeout(() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1)
                    } else {
                      setShowLeadCapture(true)
                    }
                  }, 200)
                }}
                disabled={!loanAmount || loanAmount < 10000}
              >
                Continue
              </Button>
            </div>
          ) : question.inputType === "turnover" ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="turnover" className="mb-1.5 block text-sm">
                  Annual turnover <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="turnover"
                    type="text"
                    required
                    value={turnover ? turnover.toLocaleString() : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '')
                      if (value === '') {
                        setTurnover(null)
                      } else {
                        const numValue = Number(value)
                        if (!isNaN(numValue) && numValue >= 0) {
                          setTurnover(numValue)
                        }
                      }
                    }}
                    className="pl-10 h-12 rounded-md bg-white border-2"
                    placeholder="Enter your annual turnover"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                className="w-full h-12"
                onClick={() => {
                  const updatedAnswers = { ...answers, [question.id]: [0] } // Default to first option for scoring
                  setAnswers(updatedAnswers)
                  // Save in background without blocking UI
                  saveProgress(updatedAnswers).catch((error) => {
                    console.error("[v0] Error saving progress in background:", error)
                  })
                  
                  setTimeout(() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1)
                    } else {
                      setShowLeadCapture(true)
                    }
                  }, 200)
                }}
                disabled={!turnover || turnover < 0}
              >
                Continue
              </Button>
            </div>
          ) : (
            <div
              className={`mb-4 ${
                currentQuestion === 0
                  ? "grid grid-cols-2 gap-2"
                  : currentQuestion === 2
                    ? "space-y-2"
                    : question.options.length >= 6
                      ? "grid grid-cols-2 gap-2"
                      : "space-y-2"
              }`}
            >
              {question.options.map((option, index) => {
                const Icon = option.icon
                const isSelected = answers[question.id]?.includes(index)
                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                      isSelected ? "border-2 border-primary bg-white shadow-lg shadow-primary/20" : "border-border bg-white"
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    <CardContent className="py-0 px-3">
                      <div className="flex items-center gap-2">
                        {question.multiSelect ? (
                          isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary flex-shrink-0" />
                          ) : (
                            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )
                        ) : (
                          <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground leading-tight">{option.label}</p>
                          {option.sublabel && (
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{option.sublabel}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Trust Builders - Only show on first question */}
          {currentQuestion === 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <Shield className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-500">Credit score not affected</p>
                </div>
                
                <div className="hidden sm:flex items-center gap-3">
                  <Zap className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-500">Paid in as little as 4 hours</p>
                </div>
                
                <div className="hidden sm:flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-500">Takes under 2 minutes</p>
                </div>
              </div>
            </div>
          )}

          {question.multiSelect && canContinue && (
            <Button onClick={handleContinue} size="lg" className="w-full sm:w-auto">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
