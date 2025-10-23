"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, CheckCircle2, XCircle, Loader2, Mail, TrendingUp, Shield, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { verifyEmailWithKitt } from "@/app/actions/verify-email"
import { updateAssessmentRecord } from "@/app/actions/update-assessment"

interface ScoreTier {
  min: number
  max: number
  title: string
  subtitle: string
  strengths: string[]
  gaps: string[]
  considerations: string[]
  potentialImpact: {
    label: string
    value: string
    description: string
    numericValue: number
  }[]
  optimisationAreas: {
    area: string
    current: number
    potential: number
  }[]
}

const scoreTiers: ScoreTier[] = [
  {
    min: 0,
    max: 40,
    title: "Foundation Stage",
    subtitle: "Significant opportunities to optimise your wealth strategy",
    strengths: [
      "You've taken the first step by assessing your wealth position",
      "Clear awareness of areas needing attention",
    ],
    gaps: [
      "Limited diversification across asset classes",
      "Minimal use of tax-efficient investment vehicles",
      "No formal wealth management strategy in place",
      "Estate planning not yet established",
      "High potential for fee optimisation",
    ],
    considerations: [
      "Exploring comprehensive wealth management planning options",
      "Understanding tax-efficient allowances (ISAs, pensions, VCTs)",
      "Considering diversification across multiple asset classes and geographies",
      "Reviewing estate and succession planning structures",
      "Analysing current investment fees and structures",
    ],
    potentialImpact: [
      {
        label: "Potential Annual Savings",
        value: "£15,000 - £50,000",
        description: "Through fee optimisation and tax efficiency",
        numericValue: 32500,
      },
      {
        label: "Long-term Wealth Growth",
        value: "25-40% increase",
        description: "Over 10 years with proper diversification",
        numericValue: 32.5,
      },
      {
        label: "Tax Efficiency Gains",
        value: "£10,000 - £30,000/year",
        description: "Through strategic use of allowances",
        numericValue: 20000,
      },
    ],
    optimisationAreas: [
      { area: "Tax Efficiency", current: 25, potential: 90 },
      { area: "Diversification", current: 30, potential: 85 },
      { area: "Fee Structure", current: 20, potential: 80 },
      { area: "Estate Planning", current: 15, potential: 95 },
      { area: "Risk Management", current: 35, potential: 85 },
    ],
  },
  {
    min: 41,
    max: 70,
    title: "Growth Stage",
    subtitle: "Good foundation with clear opportunities for enhancement",
    strengths: [
      "Basic wealth management structure in place",
      "Some diversification across asset types",
      "Awareness of tax-efficient vehicles",
      "Regular portfolio monitoring",
    ],
    gaps: [
      "Inconsistent professional wealth management support",
      "Opportunities for better tax optimisation",
      "Estate planning could be more comprehensive",
      "Pension consolidation opportunities",
      "Limited international diversification",
    ],
    considerations: [
      "Exploring dedicated wealth management support for regular reviews",
      "Understanding available tax allowances and reliefs",
      "Reviewing estate planning structures",
      "Considering pension consolidation for better oversight",
      "Exploring international and currency diversification options",
    ],
    potentialImpact: [
      {
        label: "Potential Annual Savings",
        value: "£8,000 - £25,000",
        description: "Through enhanced tax planning and fee reduction",
        numericValue: 16500,
      },
      {
        label: "Long-term Wealth Growth",
        value: "15-25% increase",
        description: "Over 10 years with optimised strategy",
        numericValue: 20,
      },
      {
        label: "Risk-Adjusted Returns",
        value: "1-2% improvement",
        description: "Through better diversification",
        numericValue: 1.5,
      },
    ],
    optimisationAreas: [
      { area: "Tax Efficiency", current: 55, potential: 90 },
      { area: "Diversification", current: 60, potential: 90 },
      { area: "Fee Structure", current: 50, potential: 85 },
      { area: "Estate Planning", current: 45, potential: 95 },
      { area: "Risk Management", current: 65, potential: 90 },
    ],
  },
  {
    min: 71,
    max: 100,
    title: "Optimisation Stage",
    subtitle: "Strong wealth management foundation with refinement opportunities",
    strengths: [
      "Comprehensive wealth management strategy",
      "Well-diversified portfolio across multiple asset classes",
      "Active use of tax-efficient structures",
      "Regular professional wealth management reviews",
      "Clear retirement and estate planning",
    ],
    gaps: [
      "Potential for further fee optimisation",
      "Opportunities for enhanced international exposure",
      "Alternative investment opportunities to explore",
      "Continuous strategy refinement needed",
    ],
    considerations: [
      "Fine-tuning asset allocation for optimal risk-adjusted returns",
      "Exploring alternative investments (private equity, infrastructure)",
      "Reviewing fee structures across all holdings",
      "Considering advanced estate planning structures",
      "Exploring multi-generational wealth transfer strategies",
    ],
    potentialImpact: [
      {
        label: "Potential Annual Savings",
        value: "£5,000 - £15,000",
        description: "Through fee optimisation and tax refinement",
        numericValue: 10000,
      },
      {
        label: "Long-term Wealth Growth",
        value: "10-15% increase",
        description: "Over 10 years with strategic refinements",
        numericValue: 12.5,
      },
      {
        label: "Legacy Planning Value",
        value: "£50,000 - £200,000+",
        description: "In potential IHT savings",
        numericValue: 125000,
      },
    ],
    optimisationAreas: [
      { area: "Tax Efficiency", current: 80, potential: 95 },
      { area: "Diversification", current: 85, potential: 95 },
      { area: "Fee Structure", current: 75, potential: 90 },
      { area: "Estate Planning", current: 80, potential: 98 },
      { area: "Risk Management", current: 85, potential: 95 },
    ],
  },
]

export default function AssessmentResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [tier, setTier] = useState<ScoreTier | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [isEmailCaptureVisible, setIsEmailCaptureVisible] = useState(true)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "verifying" | "valid" | "invalid">(
    "idle",
  )

  useEffect(() => {
    const storedScore = sessionStorage.getItem("assessmentScore")
    const storedSubmissionId = sessionStorage.getItem("submissionId")
    const isQualified = sessionStorage.getItem("isQualified") === "true"

    if (!storedScore) {
      router.push("/assessment")
      return
    }

    const scoreValue = Number.parseInt(storedScore)
    setScore(scoreValue)
    setSubmissionId(storedSubmissionId)

    const matchedTier = scoreTiers.find((t) => scoreValue >= t.min && scoreValue <= t.max)
    setTier(matchedTier || scoreTiers[0])
  }, [router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

      // Update assessment record with email
      if (submissionId) {
        updateAssessmentRecord(submissionId, { email: email.trim() })
      }

      // Hide email capture and show full report
      setTimeout(() => {
        setIsEmailCaptureVisible(false)
      }, 500)
    } else {
      setEmailVerificationStatus("invalid")
      setEmailError("This email address appears to be invalid. Please check and try again.")
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  if (!score || !tier) {
    return null
  }

  const scoreData = [
    {
      name: "Score",
      value: score,
      fill: "#183D33",
    },
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Image src="/logo-full.png" alt="Vista Private Office" width={280} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      {isEmailCaptureVisible && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-40" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
            <Card className="border-primary/30 shadow-2xl">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl mb-2">View Your Full Report</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address to unlock your personalized wealth optimization report
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
        </>
      )}

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Overall Wealth Optimisation Score</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <ChartContainer
                  config={{
                    score: {
                      label: "Score",
                      color: "#183D33",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      barSize={20}
                      data={scoreData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={10} fill="#183D33" />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" className="text-4xl font-bold fill-foreground">
                          {score}
                        </tspan>
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="text-center mt-3">
                  <p className="font-semibold text-sm text-foreground">{tier.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tier.subtitle}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4 overflow-hidden">
                {tier.optimisationAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-muted-foreground">{area.area}</span>
                      <span className="text-xs font-medium">{area.current}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${area.current}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Optimisation Potential Analysis</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Current performance vs. achievable potential across key wealth management areas
              </p>
            </CardHeader>
            <CardContent className="pb-4 overflow-hidden">
              <ChartContainer
                config={{
                  current: {
                    label: "Current",
                    color: "#9CA3AF",
                  },
                  potential: {
                    label: "Potential",
                    color: "#183D33",
                  },
                }}
                className={isMobile ? "h-[300px]" : "h-[250px]"}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tier.optimisationAreas}
                    layout="vertical"
                    margin={
                      isMobile ? { left: 10, right: 5, top: 5, bottom: 5 } : { left: 80, right: 10, top: 5, bottom: 5 }
                    }
                  >
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: isMobile ? 9 : 10 }} />
                    <YAxis
                      dataKey="area"
                      type="category"
                      width={isMobile ? 90 : 75}
                      tick={{ fontSize: isMobile ? 9 : 10 }}
                      interval={0}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="current" fill="#9CA3AF" radius={[0, 4, 4, 0]} barSize={isMobile ? 12 : 16} />
                    <Bar dataKey="potential" fill="#183D33" radius={[0, 4, 4, 0]} barSize={isMobile ? 12 : 16} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Projected Financial Impact</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {tier.potentialImpact.map((impact, index) => (
                  <div key={index} className="border-l-2 border-primary pl-3">
                    <p className="text-xs text-muted-foreground mb-1">{impact.label}</p>
                    <p className="text-xl font-bold text-foreground mb-1">{impact.value}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{impact.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-medium">Current Strengths</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  {tier.strengths.map((strength, index) => (
                    <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">Areas for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  {tier.gaps.map((gap, index) => (
                    <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-medium">Areas to Explore</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                These are general areas commonly explored by individuals in similar situations. This is not financial
                advice.
              </p>
            </CardHeader>
            <CardContent className="pb-4">
              <ol className="space-y-2.5">
                {tier.considerations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{consideration}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
