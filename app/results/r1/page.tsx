"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const trustpilotReviews = [
  {
    name: "J W",
    date: "27 Sept 2025",
    rating: 5,
    title: "Same day working capital",
    quote:
      "We needed a small, short term arrangement of working capital - and Cameron arranged this for us same day, super friendly and easy to work with.",
  },
  {
    name: "Stuart Hewitt",
    date: "20 Feb 2025",
    rating: 5,
    title: "Great service by WCF",
    quote:
      "Cameron and the team have always come up with the result, quick, reliable and supportive from start to finish.",
  },
  {
    name: "Rowan Lyons",
    date: "19 Feb 2025",
    rating: 5,
    title: "Very happy with the service",
    quote: "Very happy with the service provided. Highly recommended.",
  },
  {
    name: "Nicola Martin",
    date: "11 Feb 2025",
    rating: 5,
    title: "Hilary Lewis is outstanding",
    quote:
      "Hilary is an amazing ambassador for Winchester Corporate Finance – personable, knowledgeable, and opened the door to brilliant finance conversations.",
  },
  {
    name: "Jordan Evans",
    date: "17 Jan 2025",
    rating: 5,
    title: "Great, efficient service!!!",
    quote: "Great, efficient service from start to finish!",
  },
  {
    name: "Marc Hartnell",
    date: "13 Jan 2025",
    rating: 5,
    title: "Well done WCF",
    quote:
      "Michael kept me fully informed at every stage and was friendly and personable. I wouldn’t hesitate to use WCF again.",
  },
  {
    name: "Daniel Bassil",
    date: "25 Nov 2024",
    rating: 5,
    title: "Brilliant team",
    quote:
      "Really friendly, knowledgeable and great team to work with. Easy experience all round – thanks to everyone involved.",
  },
  {
    name: "Jarrod Singh",
    date: "25 Nov 2024",
    rating: 5,
    title: "Cameron Miller 5★",
    quote: "Cameron delivered outstanding support throughout the process.",
  },
  {
    name: "Mac Bashir",
    date: "14 Mar 2024",
    rating: 5,
    title: "Kept me updated all the way",
    quote:
      "Cameron was very helpful and kept me updated all the time. The end result was achieved thanks to everyone at Winchester.",
  },
]

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

    const fireSubmitApplicationEvent = () => {
      if (typeof window === "undefined") {
        return false
      }

      const fbq = (window as any).fbq

      if (typeof fbq === "function") {
        fbq("trackCustom", "SubmitApplication")
        return true
      }

      return false
    }

    if (!fireSubmitApplicationEvent()) {
      let attempts = 0
      const maxAttempts = 8
      const interval = window.setInterval(() => {
        attempts += 1
        if (fireSubmitApplicationEvent() || attempts >= maxAttempts) {
          window.clearInterval(interval)
        }
      }, 250)

      return () => window.clearInterval(interval)
    }
  }, [router])

  if (!leadData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl text-balance mb-4 text-foreground font-bold">
              Congratulations! 🎉
            </h1>
          </div>

          {/* Broker Information */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground text-center">
              You&apos;ve Been Matched with Winchester Corporate Finance
            </h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-8">
                  <Image
                    src="/wcf-logo.png"
                    alt="Winchester Corporate Finance logo"
                    width={220}
                    height={70}
                    className="h-16 w-auto"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif text-lg mb-4 text-foreground">
                      About Winchester Corporate Finance
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• Established in 2018 to support UK SMEs</li>
                      <li>• Over £150 million sourced in business funding</li>
                      <li>• 250+ lender relationships across mainstream and niche providers</li>
                      <li>• 4.8/5 Trustpilot rating for service and delivery</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-4 text-foreground">Funding Expertise</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• Business loans from £5,000 to £10 million</li>
                      <li>• Asset & equipment finance solutions</li>
                      <li>• Invoice & cash flow finance support</li>
                      <li>• Bridging & property finance for fast-moving projects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground">
              Next Steps
            </h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <h3 className="font-serif text-lg mb-6 text-foreground">What happens next</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Answer the call</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your phone will ring within the next few minutes. Pick up when you see{" "}
                        <span className="text-foreground font-medium">01243 786258</span> so you can speak to the Winchester team right away.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Chat with your specialist</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Chat to the friendly team at Winchester Corporate Finance. They&apos;ll confirm your details and help you find the best solution.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Pick the best offer</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        They&apos;ll line up tailored offers and help you choose the one that fits. Expect quick follow-up and help with any paperwork.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trustpilot Reviews */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-6 text-foreground">
              Trustpilot reviews
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {trustpilotReviews.map((review) => (
                <Card key={review.name + review.date} className="border-border bg-card">
                  <CardContent className="px-6 py-6 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-foreground">{review.title}</p>
                    <p className="text-sm text-muted-foreground">“{review.quote}”</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Loan Details */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground font-bold">
              Your Loan Request
            </h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-semibold text-foreground">
                      £{leadData.loanAmount?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">How long have you been trading:</span>
                    <span className="font-semibold text-foreground">
                      {leadData.tradingDuration || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Turnover:</span>
                    <span className="font-semibold text-foreground">
                      {leadData.annualTurnover || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Type:</span>
                    <span className="font-semibold text-foreground">
                      {leadData.companyType || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finance Purpose:</span>
                    <span className="font-semibold text-foreground">
                      {leadData.financePurpose || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Personal Credit Profile:</span>
                    <span className="font-semibold text-foreground">
                      {leadData.creditProfile || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Homeowner:</span>
                    <span className="font-semibold text-foreground">
                      {leadData.isHomeowner || "Not provided"}
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Applicant:</span>
                      <span className="font-semibold text-foreground">
                        {leadData.name || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-foreground">
                        {leadData.email || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-semibold text-foreground">
                        {leadData.phone || "Not provided"}
                      </span>
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
            <h2 className="font-serif text-2xl sm:text-3xl text-balance mb-8 text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">
                    How long does it take to get approved?
                  </h3>
                  <p className="text-muted-foreground">
                    Once Winchester Corporate Finance has your details, initial approvals can often
                    be delivered within 24-48 hours. Full funding generally completes within 1-2
                    weeks depending on the facility.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">
                    Is there any cost to use their service?
                  </h3>
                  <p className="text-muted-foreground">
                    There are no upfront fees. Winchester Corporate Finance is paid by the lender
                    only when your funding completes, and all costs are disclosed clearly before you
                    sign anything.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">
                    What if I have less-than-perfect credit?
                  </h3>
                  <p className="text-muted-foreground">
                    They work with a broad panel of lenders and regularly help businesses with
                    complex credit histories access tailored finance solutions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">
                    Will this affect my credit score?
                  </h3>
                  <p className="text-muted-foreground">
                    The initial consultation and soft checks won&apos;t impact your score. A formal
                    credit check only happens with your permission once a suitable product is agreed.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-serif text-lg mb-3 text-foreground">
                    What should I have ready for the call?
                  </h3>
                  <p className="text-muted-foreground">
                    Have details like turnover, trading history, and how you plan to use the funds
                    to hand. The Winchester team will guide you through everything else.
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
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                      Your Information is Secure
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Winchester Corporate Finance keeps your personal and business data encrypted
                      and confidential. It&apos;s only used to progress your application and secure the
                      best terms available. They work with a trusted panel of lenders and disclose any
                      commissions fully, so you stay informed at every step.
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

