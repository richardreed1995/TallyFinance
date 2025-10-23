"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Calendar, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ConsultationThankYouPage() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-3">Thank You!</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We've received your request for a wealth strategy session. Our team will be in touch within 24 hours to
              schedule your consultation.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-xl mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">We'll Review Your Information</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your responses to prepare for your session
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Schedule Your Session</p>
                    <p className="text-sm text-muted-foreground">
                      We'll email you within 24 hours to find a convenient time
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Your Wealth Strategy Session</p>
                    <p className="text-sm text-muted-foreground">
                      A 60-minute consultation to discuss your wealth goals and opportunities
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Check your email for confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">We may call to confirm details</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Session typically scheduled within 1-2 weeks</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
