"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, AlertCircle, CheckCircle2, Clock, Shield, Users, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function UnqualifiedResultsPage() {
  const router = useRouter()
  const [leadData, setLeadData] = useState<any>(null)
  const [qualificationReasons, setQualificationReasons] = useState<string[]>([])

  useEffect(() => {
    const storedLeadData = sessionStorage.getItem("leadData")
    const isQualified = sessionStorage.getItem("isQualified") === "true"

    if (!storedLeadData || isQualified) {
      router.push("/assessment")
      return
    }

    const data = JSON.parse(storedLeadData)
    setLeadData(data)

    // Determine why they weren't qualified
    const reasons: string[] = []
    const answers = data.answers || {}

    // Check each qualification criteria
    if (answers[1]?.[0] !== 0) {
      reasons.push("Not a business owner")
    }
    if (answers[3]?.[0] === 0) {
      reasons.push("Trading for less than 12 months")
    }
    if (answers[5]?.[0] !== 0) {
      reasons.push("Not a limited company")
    }
    if (data.turnover === null || data.turnover < 100000) {
      reasons.push("Annual turnover under £100,000")
    }

    setQualificationReasons(reasons)
  }, [router])

  if (!leadData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl font-bold text-primary">Tally</span>
            <Image src="/trustpilot-logo.png" alt="Trustpilot" width={150} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl text-balance mb-4 text-foreground font-bold">Thank You for Your Application</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Unfortunately, we're unable to approve your loan application at this time
            </p>
          </div>

          {/* Qualification Reasons */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground">Why We Couldn't Approve Your Application</h2>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-8 pb-8">
                <div className="flex gap-3 mb-6">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <h3 className="font-serif text-lg font-medium text-destructive">Based on your assessment, the following criteria were not met:</h3>
                </div>
                <ul className="space-y-3">
                  {qualificationReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-destructive mr-3">•</span>
                      <span className="text-destructive">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
              onClick={() => router.push('/consultation')}
            >
              Learn More About Our Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}