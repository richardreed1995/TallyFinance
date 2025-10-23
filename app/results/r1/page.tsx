"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ArrowRight, TrendingUp, Shield, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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

export default function QualifiedResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [leadData, setLeadData] = useState<any>(null)
  const [tier, setTier] = useState<ScoreTier | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const storedScore = sessionStorage.getItem("assessmentScore")
    const storedLeadData = sessionStorage.getItem("leadData")
    const isQualified = sessionStorage.getItem("isQualified") === "true"

    if (!storedScore || !storedLeadData || !isQualified) {
      router.push("/assessment")
      return
    }

    const scoreValue = Number.parseInt(storedScore)
    setScore(scoreValue)
    setLeadData(JSON.parse(storedLeadData))

    const matchedTier = scoreTiers.find((t) => scoreValue >= t.min && scoreValue <= t.max)
    setTier(matchedTier || scoreTiers[0])

    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "SubmitApplication")
    }
  }, [router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!score || !tier || !leadData) {
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
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Image src="/logo-full.png" alt="Vista Private Office" width={280} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

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
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground">Tax Efficiency</span>
                    <span className="text-xs font-medium">{tier.optimisationAreas[0].current}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${tier.optimisationAreas[0].current}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground">Diversification</span>
                    <span className="text-xs font-medium">{tier.optimisationAreas[1].current}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${tier.optimisationAreas[1].current}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground">Fee Structure</span>
                    <span className="text-xs font-medium">{tier.optimisationAreas[2].current}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${tier.optimisationAreas[2].current}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground">Estate Planning</span>
                    <span className="text-xs font-medium">{tier.optimisationAreas[3].current}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${tier.optimisationAreas[3].current}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground">Risk Management</span>
                    <span className="text-xs font-medium">{tier.optimisationAreas[4].current}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${tier.optimisationAreas[4].current}%` }}
                    />
                  </div>
                </div>
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

          <Card className="border-primary/20">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-serif text-xl mb-2">Next Steps: Wealth Strategy Session</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    Book a complimentary 45-minute consultation with one of our senior wealth advisers to discuss your
                    unique situation and explore potential strategies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-center md:justify-start">
                    <Button size="default" className="px-6">
                      Request Strategy Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground">No obligation consultation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
