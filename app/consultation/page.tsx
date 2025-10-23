"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { consultationQuestions } from "@/lib/consultation-data"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, Shield, Users, User, Mail, Phone } from "lucide-react"
import { createConsultationRecord, updateConsultationRecord } from "@/app/actions/update-consultation"

export default function ConsultationPage() {
  const router = useRouter()
  const [showLanding, setShowLanding] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const [leadCaptureStep, setLeadCaptureStep] = useState(0) // 0 = name, 1 = email, 2 = phone
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [consentChecked, setConsentChecked] = useState(false)

  const question = consultationQuestions[currentQuestion]
  const progress = showLeadCapture
    ? ((leadCaptureStep + 1) / 3) * 100
    : ((currentQuestion + 1) / consultationQuestions.length) * 100

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)

            // Get qualification status from sessionStorage
            const isQualified = sessionStorage.getItem("consultationQualified") === "true"

            // Route based on qualification
            if (isQualified) {
              router.push("/consultation/book")
            } else {
              router.push("/consultation/not-qualified")
            }

            return 100
          }
          return prev + 3
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [isLoading, router])

  const handleAnswer = async (optionIndex: number) => {
    const updatedAnswers = { ...answers, [question.id]: optionIndex }
    setAnswers(updatedAnswers)

    if (!submissionId && currentQuestion === 0) {
      const result = await createConsultationRecord()
      if (result.success && result.id) {
        setSubmissionId(result.id)
      }
    }

    if (submissionId) {
      const q = consultationQuestions[currentQuestion]
      const answerLabel = q.options[optionIndex].label

      const fieldMap: Record<number, string> = {
        1: "wealth_manager_status",
        2: "primary_goal",
        3: "biggest_challenge",
        4: "investable_assets",
      }

      const fieldName = fieldMap[q.id]
      if (fieldName) {
        // Fire and forget - don't await
        updateConsultationRecord(submissionId, { [fieldName]: answerLabel })
      }
    }

    if (currentQuestion < consultationQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowLeadCapture(true)
    }
  }

  const handleLeadCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (leadCaptureStep === 0) {
      if (submissionId && name.trim()) {
        const nameParts = name.trim().split(" ")
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(" ") || ""

        // Fire and forget - don't await
        updateConsultationRecord(submissionId, {
          first_name: firstName,
          last_name: lastName,
        })
      }
      setLeadCaptureStep(1)
      return
    }

    if (leadCaptureStep === 1) {
      if (submissionId && email.trim()) {
        // Fire and forget - don't await
        updateConsultationRecord(submissionId, {
          email: email,
        })
      }
      setLeadCaptureStep(2)
      return
    }

    if (submissionId && phone.trim()) {
      // Calculate qualification
      const totalScore = Object.entries(answers).reduce((sum, [qId, optionIndex]) => {
        const q = consultationQuestions.find((qu) => qu.id === Number.parseInt(qId))
        if (!q) return sum
        return sum + q.options[optionIndex].points
      }, 0)

      const assetQuestion = consultationQuestions.find((q) => q.id === 4)
      const assetAnswerIndex = answers[4]
      const isQualified =
        assetQuestion && assetAnswerIndex !== undefined ? !assetQuestion.options[assetAnswerIndex].disqualify : false

      const isHotLead = Object.entries(answers).some(([qId, optionIndex]) => {
        const q = consultationQuestions.find((qu) => qu.id === Number.parseInt(qId))
        return q?.options[optionIndex]?.hotLead
      })

      // Fire and forget - save in background
      updateConsultationRecord(submissionId, {
        phone: phone,
        qualified: isQualified,
        hot_lead: isHotLead,
        score: totalScore,
      })

      // Store results in sessionStorage
      const nameParts = name.trim().split(" ")
      const firstName = nameParts[0]

      sessionStorage.setItem("consultationScore", totalScore.toString())
      sessionStorage.setItem("consultationAnswers", JSON.stringify(answers))
      sessionStorage.setItem("consultationQualified", isQualified.toString())
      sessionStorage.setItem("consultationHotLead", isHotLead.toString())
      sessionStorage.setItem("consultationFirstName", firstName)

      // Show loading immediately without waiting for save
      setIsLoading(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - loadingProgress / 100)}`}
                className="text-primary transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold">{Math.round(loadingProgress)}%</span>
            </div>
          </div>
          <h2 className="font-serif text-2xl mb-2">Reviewing your information...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we process your responses</p>
        </div>
      </div>
    )
  }

  if (showLeadCapture) {
    const stepHeaders = [
      {
        title: "Please enter your name so that we can send you some free information:",
        subtitle: "",
      },
      {
        title: "Where can we send the information to?",
        subtitle: "",
      },
      {
        title: "Now we just need your phone number in case we have any questions",
        subtitle: "",
      },
    ]

    const currentStepHeader = stepHeaders[leadCaptureStep]

    return (
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center">
              <Image src="/logo-full.png" alt="Vista Private Office" width={280} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </header>

        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-4">
              <Progress value={progress} className="h-1.5" />
            </div>

            <div className="max-w-lg mx-auto">
              <div className="mb-6 text-center">
                <h3 className="font-serif text-xl sm:text-2xl mb-2 text-balance leading-relaxed">
                  {currentStepHeader.title}
                </h3>
                {currentStepHeader.subtitle && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{currentStepHeader.subtitle}</p>
                )}
              </div>

              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleLeadCaptureSubmit} className="space-y-6">
                    {leadCaptureStep === 0 && (
                      <div>
                        <Label htmlFor="name" className="mb-2 block">
                          Full name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your first and last name"
                            className="h-11 pl-10 rounded-md"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {leadCaptureStep === 1 && (
                      <div>
                        <Label htmlFor="email" className="mb-2 block">
                          Email address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Your email address"
                            className="h-11 pl-10 rounded-md"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {leadCaptureStep === 2 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="phone" className="mb-2 block">
                            Phone number *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                              placeholder="Your phone number"
                              className="h-11 pl-10 rounded-md"
                              autoFocus
                            />
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
                          <Checkbox
                            id="consent"
                            checked={consentChecked}
                            onCheckedChange={(checked) => setConsentChecked(checked === true)}
                            className="mt-0.5"
                          />
                          <label
                            htmlFor="consent"
                            className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                          >
                            We need the contact information you provide to us to contact you about our products and
                            services. You may unsubscribe from these communications at any time. For information on how
                            to unsubscribe, as well as our privacy practices and commitment to protecting your privacy,
                            please review our Privacy Policy.
                          </label>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-2"
                      disabled={leadCaptureStep === 2 && !consentChecked}
                    >
                      Continue
                    </Button>

                    {leadCaptureStep === 2 && (
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        <Shield className="inline h-3 w-3 mr-1" />
                        Your information is secure and confidential
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showLanding) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center">
              <Image
                src="/logo-full.png"
                alt="Vista Private Office"
                width={240}
                height={32}
                className="h-6 sm:h-8 w-auto"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-start justify-center px-6 sm:px-8 pt-12 sm:pt-16">
          <div className="w-full max-w-lg">
            <div className="text-center mb-6">
              <h1 className="font-serif sm:text-4xl mb-3 text-balance leading-tight text-4xl font-medium">
                Get A Free 60-Minute Wealth Strategy Session
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-serif">
                Get clarity on your wealth with a senior financial adviser. Friendly, no obligation, and completely
                free.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-sm mb-0.5">Senior Advisers</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Expert guidance from experienced professionals
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-sm mb-0.5">£2.5bn AUM</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{"Managed across our entities"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-sm mb-0.5">No Obligation</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Completely free with no commitment required
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => setShowLanding(false)} className="w-full sm:w-auto sm:px-12 h-12">
                Get Started
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Takes less than two minutes. Your details are confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Image src="/logo-full.png" alt="Vista Private Office" width={280} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-4">
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="mb-3">
            <h1 className="font-serif text-lg sm:text-xl mb-1 text-balance leading-tight">{question.question}</h1>
            {question.subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{question.subtitle}</p>}
          </div>

          <div className="space-y-2">
            {question.options.map((option, index) => {
              const Icon = option.icon
              const isSelected = answers[question.id] === index

              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                    isSelected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => handleAnswer(index)}
                >
                  <CardContent className="py-0 px-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground leading-tight">{option.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
