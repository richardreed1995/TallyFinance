"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { questions } from "@/lib/assessment-data"
import { CheckSquare, Mail, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { updateAssessmentProgress } from "@/app/actions/update-assessment-progress"
import { verifyEmailWithKitt } from "@/app/actions/verify-email"

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle")
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  useEffect(() => {
    const savedSubmissionId = sessionStorage.getItem("submissionId")
    if (savedSubmissionId) {
      setSubmissionId(savedSubmissionId)
    }
  }, [])

  const question = questions[currentQuestion]
  const progress = showEmailCapture ? 100 : ((currentQuestion + 1) / questions.length) * 100

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const saveEmailToSupabase = async (emailAddress: string) => {
    try {
      await updateAssessmentProgress({
        submissionId: submissionId || undefined,
        email: emailAddress,
        ageRange: getAnswerLabel(1, answers),
        advisorCommunication: getAnswerLabel(2, answers),
        netWorth: getAnswerLabel(3, answers),
        diversification: getAnswerLabel(4, answers),
        feeStructure: getAnswerLabel(5, answers),
        taxStrategy: getAnswerLabel(6, answers),
        financialAdvisor: getAnswerLabel(7, answers),
        primaryGoal: getAnswerLabel(8, answers),
        estatePlan: getAnswerLabel(9, answers),
        riskTolerance: getAnswerLabel(10, answers),
        investmentPortfolio: getAnswerLabel(11, answers),
        rebalancing: getAnswerLabel(12, answers),
        investmentPerformance: getAnswerLabel(13, answers),
      })
    } catch (error) {
      console.error("[v0] Error saving email to Supabase:", error)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailVerificationStatus("verifying")
    setEmailError("")

    const result = await verifyEmailWithKitt(email)

    if (result.success) {
      setEmailVerificationStatus("valid")
      // Save email to Supabase
      await saveEmailToSupabase(email)
      // Calculate score and route to results
      calculateScoreAndRoute()
    } else {
      setEmailVerificationStatus("invalid")
      setEmailError("This email address appears to be invalid. Please check and try again.")
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

  const saveProgress = (updatedAnswers: Record<number, number[]>) => {
    console.log("[v0] Saving progress to Supabase:", {
      submissionId,
      email,
      answers: updatedAnswers,
      currentQuestion: currentQuestion + 1
    })

    updateAssessmentProgress({
      submissionId: submissionId || undefined,
      email: email || undefined,
      ageRange: getAnswerLabel(1, updatedAnswers),
      advisorCommunication: getAnswerLabel(2, updatedAnswers),
      netWorth: getAnswerLabel(3, updatedAnswers),
      diversification: getAnswerLabel(4, updatedAnswers),
      feeStructure: getAnswerLabel(5, updatedAnswers),
      taxStrategy: getAnswerLabel(6, updatedAnswers),
      financialAdvisor: getAnswerLabel(7, updatedAnswers),
      primaryGoal: getAnswerLabel(8, updatedAnswers),
      estatePlan: getAnswerLabel(9, updatedAnswers),
      riskTolerance: getAnswerLabel(10, updatedAnswers),
      investmentPortfolio: getAnswerLabel(11, updatedAnswers),
      rebalancing: getAnswerLabel(12, updatedAnswers),
      investmentPerformance: getAnswerLabel(13, updatedAnswers),
    })
      .then((result) => {
        console.log("[v0] Supabase save result:", result)
        if (result.success && result.data && !submissionId) {
          const newSubmissionId = result.data.id
          setSubmissionId(newSubmissionId)
          sessionStorage.setItem("submissionId", newSubmissionId)
          console.log("[v0] Created new submission ID:", newSubmissionId)
        }
      })
      .catch((error) => {
        console.error("[v0] Error in saveProgress:", error)
      })
  }

  const calculateScoreAndRoute = () => {
    const totalScore = Object.entries(answers).reduce((sum, [qId, optionIndices]) => {
      const q = questions.find((qu) => qu.id === Number.parseInt(qId))
      if (!q) return sum
      if (q.multiSelect) {
        return sum + optionIndices.reduce((s, idx) => s + q.options[idx].points, 0)
      }
      return sum + q.options[optionIndices[0]].points
    }, 0)

    const assetQuestion = questions.find((q) => q.id === 3)
    const assetAnswerIndex = answers[3]?.[0]
    const isQualified =
      assetQuestion && assetAnswerIndex !== undefined
        ? !assetQuestion.options[assetAnswerIndex].disqualify
        : false

    // Create lead data object for results pages
    const leadData = {
      email: email,
      score: totalScore,
      isQualified: isQualified,
      answers: answers,
      submissionId: submissionId,
      timestamp: new Date().toISOString()
    }

    updateAssessmentProgress({
      submissionId: submissionId || undefined,
      score: totalScore,
      qualificationStatus: isQualified ? "qualified" : "not-qualified",
      email: email,
    })

    // Store data in sessionStorage for results pages
    sessionStorage.setItem("assessmentScore", totalScore.toString())
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(answers))
    sessionStorage.setItem("isQualified", isQualified.toString())
    sessionStorage.setItem("userEmail", email)
    sessionStorage.setItem("leadData", JSON.stringify(leadData))

    // Route to appropriate results page
    if (isQualified) {
      // Qualified leads (500k+ assets) go to r1 page with Facebook pixel event
      router.push("/results/r1")
    } else {
      // Unqualified leads go to r2 page
      router.push("/results/r2")
    }
  }

  const handleAnswer = (optionIndex: number) => {
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
      saveProgress(newAnswers)
    } else {
      const updatedAnswers = { ...answers, [question.id]: [optionIndex] }
      setAnswers(updatedAnswers)

      // Save in background without blocking UI
      saveProgress(updatedAnswers)

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          // Show email capture instead of going directly to results
          setShowEmailCapture(true)
        }
      }, 200)
    }
  }

  const handleContinue = () => {
    // Save in background without blocking UI
    saveProgress(answers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Show email capture instead of going directly to results
      setShowEmailCapture(true)
    }
  }

  const canContinue = question.multiSelect && answers[question.id]?.length > 0

  // Email capture screen - shown after assessment completion
  if (showEmailCapture) {
    // Calculate score and qualification status for preview
    const totalScore = Object.entries(answers).reduce((sum, [qId, optionIndices]) => {
      const q = questions.find((qu) => qu.id === Number.parseInt(qId))
      if (!q) return sum
      if (q.multiSelect) {
        return sum + optionIndices.reduce((s, idx) => s + q.options[idx].points, 0)
      }
      return sum + q.options[optionIndices[0]].points
    }, 0)

    const assetQuestion = questions.find((q) => q.id === 3)
    const assetAnswerIndex = answers[3]?.[0]
    const isQualified =
      assetQuestion && assetAnswerIndex !== undefined
        ? !assetQuestion.options[assetAnswerIndex].disqualify
        : false

    return (
      <div className="min-h-screen bg-background relative">
        {/* Blurred report background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">
              {/* Blurred report content */}
              <div className="mb-6 pb-4 border-b border-border">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Wealth Optimisation Report</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Report Date</p>
                    <p className="text-xs font-medium">
                      {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-medium mb-3">Overall Wealth Optimisation Score</h3>
                  <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                    <span className="text-4xl font-bold text-muted-foreground">{totalScore}</span>
                  </div>
                  <div className="text-center mt-3">
                    <p className="font-semibold text-sm">{isQualified ? "Optimisation Stage" : "Foundation Stage"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isQualified ? "Strong wealth management foundation" : "Significant opportunities to optimise"}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-medium mb-3">Assessment Summary</h3>
                  <div className="space-y-3">
                    {["Tax Efficiency", "Diversification", "Fee Structure", "Estate Planning", "Risk Management"].map((area, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-muted-foreground">{area}</span>
                          <span className="text-xs font-medium">{Math.floor(Math.random() * 40) + 30}%</span>
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
                <h3 className="text-base font-medium mb-3">Projected Financial Impact</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-xs text-muted-foreground mb-1">Potential Annual Savings</p>
                    <p className="text-xl font-bold text-muted-foreground mb-1">£15,000 - £50,000</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Through fee optimisation and tax efficiency</p>
                  </div>
                  <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-xs text-muted-foreground mb-1">Long-term Wealth Growth</p>
                    <p className="text-xl font-bold text-muted-foreground mb-1">25-40% increase</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Over 10 years with proper diversification</p>
                  </div>
                  <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-xs text-muted-foreground mb-1">Tax Efficiency Gains</p>
                    <p className="text-xl font-bold text-muted-foreground mb-1">£10,000 - £30,000/year</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Through strategic use of allowances</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

        {/* Email capture overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <Card className="border-primary/30 shadow-2xl bg-background/95 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-2">Assessment Complete!</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address to view your wealth optimisation results
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="mb-1.5 block text-sm">
                      Email address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                        className="pl-10 h-12 rounded-md"
                        placeholder="Your email address"
                        autoFocus
                        disabled={emailVerificationStatus === "verifying"}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailVerificationStatus === "verifying" && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {emailVerificationStatus === "valid" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {emailVerificationStatus === "invalid" && <XCircle className="h-4 w-4 text-destructive" />}
                      </div>
                    </div>
                    {emailError && <p className="text-xs text-destructive mt-1.5">{emailError}</p>}
                  </div>

                  <Button
                    className="w-full h-12"
                    type="submit"
                    disabled={!email || emailVerificationStatus === "verifying"}
                  >
                    {emailVerificationStatus === "verifying" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "View My Report"
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Your information is secure and confidential</span>
                  </div>
                </form>
              </CardContent>
            </Card>
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
          {currentQuestion === 0 && (
            <div className="mb-6 text-center">
              <h2 className="font-serif text-2xl sm:text-3xl mb-3 text-balance">
                What's Your Wealth Optimisation Score?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Take our short assessment to discover how well your wealth is working for you. Find out if you're on
                track, overpaying in fees, or missing tax-saving opportunities.
              </p>
              <div className="w-16 h-px bg-border mx-auto mt-4" />
            </div>
          )}

          <div className="mb-4">
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="mb-3">
            <h1 className="font-serif text-lg sm:text-xl mb-1 text-balance leading-tight">{question.question}</h1>
            {question.subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{question.subtitle}</p>}
          </div>

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
                    isSelected ? "border-primary bg-primary/5" : "border-border"
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
