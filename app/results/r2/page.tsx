"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface ScoreTier {
  min: number
  max: number
  title: string
  subtitle: string
  strengths: string[]
  gaps: string[]
  considerations: string[]
  optimisationAreas: {
    area: string
    current: number
  }[]
}

const scoreTiers: ScoreTier[] = [
  {
    min: 0,
    max: 40,
    title: "Foundation Stage",
    subtitle: "Building blocks for your financial future",
    strengths: [
      "You've taken the first step by assessing your financial position",
      "Clear awareness of areas needing attention",
    ],
    gaps: [
      "Limited diversification across asset classes",
      "Minimal use of tax-efficient investment vehicles",
      "No formal financial planning strategy in place",
      "Estate planning not yet established",
    ],
    considerations: [
      "Building investable assets through consistent saving",
      "Understanding tax-efficient allowances (ISAs, pensions)",
      "Exploring traditional financial advisory services",
      "Establishing an emergency fund covering 6-12 months of expenses",
      "Considering basic estate planning with a will",
    ],
    optimisationAreas: [
      { area: "Tax Efficiency", current: 25 },
      { area: "Diversification", current: 30 },
      { area: "Fee Structure", current: 20 },
      { area: "Estate Planning", current: 15 },
      { area: "Risk Management", current: 35 },
    ],
  },
  {
    min: 41,
    max: 70,
    title: "Growth Stage",
    subtitle: "Good foundation with opportunities for enhancement",
    strengths: [
      "Basic financial structure in place",
      "Some diversification across asset types",
      "Awareness of tax-efficient vehicles",
      "Regular portfolio monitoring",
    ],
    gaps: [
      "Inconsistent professional financial support",
      "Opportunities for better tax optimisation",
      "Estate planning could be more comprehensive",
      "Limited international diversification",
    ],
    considerations: [
      "Continuing to build investable asset base",
      "Understanding available tax allowances and reliefs",
      "Reviewing estate planning structures",
      "Exploring pension consolidation for better oversight",
      "Considering professional financial advisory services",
    ],
    optimisationAreas: [
      { area: "Tax Efficiency", current: 55 },
      { area: "Diversification", current: 60 },
      { area: "Fee Structure", current: 50 },
      { area: "Estate Planning", current: 45 },
      { area: "Risk Management", current: 65 },
    ],
  },
  {
    min: 71,
    max: 100,
    title: "Optimisation Stage",
    subtitle: "Strong financial foundation",
    strengths: [
      "Comprehensive financial strategy",
      "Well-diversified portfolio across multiple asset classes",
      "Active use of tax-efficient structures",
      "Regular professional financial reviews",
      "Clear retirement and estate planning",
    ],
    gaps: [
      "Potential for further optimisation as assets grow",
      "Opportunities for enhanced international exposure",
      "Continuous strategy refinement needed",
    ],
    considerations: [
      "Maintaining excellent financial habits",
      "Focusing on growing investable assets to £500k+",
      "Exploring asset allocation refinements",
      "Reviewing fee structures",
      "Considering Vista Private Office when reaching £500k+ in investable assets",
    ],
    optimisationAreas: [
      { area: "Tax Efficiency", current: 80 },
      { area: "Diversification", current: 85 },
      { area: "Fee Structure", current: 75 },
      { area: "Estate Planning", current: 80 },
      { area: "Risk Management", current: 85 },
    ],
  },
]

export default function UnqualifiedResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [leadData, setLeadData] = useState<any>(null)
  const [tier, setTier] = useState<ScoreTier | null>(null)

  useEffect(() => {
    const storedScore = sessionStorage.getItem("assessmentScore")
    const storedLeadData = sessionStorage.getItem("leadData")
    const isQualified = sessionStorage.getItem("isQualified") === "true"

    if (!storedScore || !storedLeadData || isQualified) {
      router.push("/assessment")
      return
    }

    const scoreValue = Number.parseInt(storedScore)
    setScore(scoreValue)
    setLeadData(JSON.parse(storedLeadData))

    const matchedTier = scoreTiers.find((t) => scoreValue >= t.min && scoreValue <= t.max)
    setTier(matchedTier || scoreTiers[0])
  }, [router])

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

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Report Header */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Financial Optimisation Report</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Report Date</p>
                <p className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Score Overview Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Overall Financial Optimisation Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score",
                      color: "#183D33",
                    },
                  }}
                  className="h-[200px] sm:h-[240px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      barSize={24}
                      data={scoreData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={10} fill="#183D33" />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" className="text-4xl sm:text-5xl font-bold fill-foreground">
                          {score}
                        </tspan>
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="text-center mt-4">
                  <p className="font-semibold text-foreground">{tier.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{tier.subtitle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-hidden">
                {tier.optimisationAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{area.area}</span>
                      <span className="text-sm font-medium">{area.current}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${area.current}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-muted">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thank you for completing the assessment. Based on your current asset level, Vista Private Office
                specialises in serving clients with £500,000+ in investable assets. We recommend working with a
                traditional financial adviser who can better serve your current needs. We'd be delighted to work with
                you once your investable assets reach our threshold.
              </p>
            </CardContent>
          </Card>

          {/* Key Findings Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-medium">Current Strengths</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {tier.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Gaps */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg font-medium">Areas for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {tier.gaps.map((gap, index) => (
                    <li key={index} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Considerations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-medium">Areas to Explore</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                These are general areas commonly explored by individuals in similar situations. This is not financial
                advice.
              </p>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {tier.considerations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{consideration}</span>
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
