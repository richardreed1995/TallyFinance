"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Clock, Shield, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function QualifiedResultsPage() {
  const router = useRouter()
  const [leadData, setLeadData] = useState<any>(null)

  useEffect(() => {
    const storedLeadData = sessionStorage.getItem("leadData")
    const isQualified = sessionStorage.getItem("isQualified") === "true"

    if (!storedLeadData || !isQualified) {
      router.push("/assessment")
      return
    }

    setLeadData(JSON.parse(storedLeadData))

    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "SubmitApplication")
    }
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
            <h1 className="font-serif text-4xl sm:text-5xl text-balance mb-4 text-foreground font-bold">Congratulations! 🎉</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your loan request has been successfully submitted and you've been matched with a broker who best fits your requirements
            </p>
          </div>

          {/* Broker Information */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground text-center">You've Been Matched with Limitra Finance</h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-8">
                  <Image 
                    src="/limitra-logo.png" 
                    alt="Limitra Finance" 
                    width={200} 
                    height={60} 
                    className="h-16 w-auto"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif text-lg mb-4 text-foreground">About Limitra Finance</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• 10+ years of experience</li>
                      <li>• Over £10 million secured in funding</li>
                      <li>• 250+ clients served</li>
                      <li>• 4.9/5 client satisfaction rating</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-4 text-foreground">Their Funding Solutions</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• Business Loans</li>
                      <li>• Asset Finance</li>
                      <li>• Invoice Finance</li>
                      <li>• Property Finance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground">Next Steps</h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <h3 className="font-serif text-lg mb-6 text-foreground">What Happens Next</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-lg text-foreground">You'll receive a call from them on</p>
                      <p className="text-muted-foreground font-semibold mt-1">From: <span className="text-foreground">{leadData.phone}</span></p>
                      <p className="text-muted-foreground text-sm mt-2">Pick up the phone for a friendly chat about your funding options</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Expert guidance</p>
                      <p className="text-muted-foreground text-sm">Their experienced finance specialists will discuss what you qualify for</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Best possible terms</p>
                      <p className="text-muted-foreground text-sm">They'll search the market to find you the most competitive solution</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loan Details */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground font-bold">Your Loan Request</h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-semibold text-foreground">£{leadData.loanAmount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">How long have you been trading:</span>
                    <span className="font-semibold text-foreground">{leadData.tradingDuration || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Turnover:</span>
                    <span className="font-semibold text-foreground">{leadData.annualTurnover || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Type:</span>
                    <span className="font-semibold text-foreground">{leadData.companyType || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finance Purpose:</span>
                    <span className="font-semibold text-foreground">{leadData.financePurpose || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Personal Credit Profile:</span>
                    <span className="font-semibold text-foreground">{leadData.creditProfile || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Homeowner:</span>
                    <span className="font-semibold text-foreground">{leadData.isHomeowner || 'Not provided'}</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Applicant:</span>
                      <span className="font-semibold text-foreground">{leadData.name || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-foreground">{leadData.email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-semibold text-foreground">{leadData.phone || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                      Pre-qualified
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">How long does it take to get approved?</h3>
                  <p className="text-muted-foreground">
                    Typically, once you speak with our specialist, you could receive initial approval within 24-48 hours. 
                    The final funding can be completed within 1-2 weeks depending on the type of finance.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">Is there any cost to use your service?</h3>
                  <p className="text-muted-foreground">
                    No, there are no upfront costs or fees to use our service. We only get paid if you successfully secure funding. 
                    All costs will be fully disclosed before you commit to anything.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">What if I have bad credit?</h3>
                  <p className="text-muted-foreground">
                    Having less-than-perfect credit doesn't automatically disqualify you. Our experts work with a wide range of lenders 
                    and can often find solutions even if you've had credit issues in the past.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">Will applying affect my credit score?</h3>
                  <p className="text-muted-foreground">
                    The initial conversation won't affect your credit score. We'll only carry out a formal credit check with your 
                    explicit permission and after discussing suitable options with you.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">What information do I need for the call?</h3>
                  <p className="text-muted-foreground">
                    Just have your business details ready - annual turnover, how long you've been trading, and what you're looking to use 
                    the funding for. Our specialist will guide you through the rest.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mb-16">
            <Card className="border-border bg-muted/30">
              <CardContent className="pt-6 pb-6">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Your Information is Secure</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All your personal and business information is encrypted and secure. Limitra Finance will only use this information 
                      to process your funding application and find you the best possible terms. We work with a panel of lenders and will 
                      receive commissions from lenders - this will be fully disclosed throughout your customer journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
