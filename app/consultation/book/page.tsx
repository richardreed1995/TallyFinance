"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Phone } from "lucide-react"
import Image from "next/image"

export default function BookSessionPage() {
  const [firstName, setFirstName] = useState("")
  const [isHotLead, setIsHotLead] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem("consultationFirstName") || ""
    const hotLead = sessionStorage.getItem("consultationHotLead") === "true"
    setFirstName(name)
    setIsHotLead(hotLead)

    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "SubmitApplication")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Image src="/logo-full.png" alt="Vista Private Office" width={280} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl mb-3">
              {firstName ? `Congratulations, ${firstName}!` : "Congratulations!"}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {isHotLead
                ? "Based on your responses, we've matched you with a wealth advisor who specializes in your needs. They're excited to speak with you."
                : "You've been successfully matched with a qualified wealth advisor for a complimentary strategy session."}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-xl mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Your Advisor Will Contact You</h3>
                    <p className="text-sm text-muted-foreground">
                      Your matched wealth advisor will reach out within the next 24-48 hours to schedule your
                      complimentary wealth strategy session.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Schedule Your Session</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll find a time that works for you for a 60-minute consultation with your matched advisor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Get Personalised Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      During your session, your advisor will review your wealth strategy and provide tailored
                      recommendations for your situation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Expect Contact Soon</p>
                    <p className="text-xs text-muted-foreground">
                      Your matched advisor will be in touch shortly. Keep an eye on your phone and email.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions? Email us at{" "}
              <a href="mailto:hello@vistaprivateoffice.com" className="text-primary hover:underline">
                hello@vistaprivateoffice.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
