"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function NotQualifiedPage() {
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
            <h1 className="font-serif text-3xl sm:text-4xl mb-3">Thank You for Your Interest</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We appreciate you taking the time to complete our advisor matching questionnaire.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground leading-relaxed">
                Based on your current situation, we're unable to match you with an advisor at this time. Our network of
                advisors typically works with individuals with £500k+ in investable assets.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                As your wealth grows, we'd be delighted to match you with the right advisor in the future.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
