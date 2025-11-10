"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Globe, TrendingUp, Users, Building2, Sparkles, Zap, Clock, CheckCircle, ChevronDown, ChevronUp, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8F1EC' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-3 sm:mb-5">
                <Image src="/trustpilot-logo.png" alt="Trustpilot" width={140} height={40} priority className="h-8 sm:h-10 w-auto" />
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-balance mb-3 sm:mb-5 text-foreground font-bold">
                See if you qualify for a business loan
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-4 sm:mb-6">
                Get up to £2 million to grow your business and turn your plans into reality. Check your eligibility in 1 minute and access same-day funding.
              </p>
              <div className="hidden lg:flex justify-center lg:justify-start">
                <Link href="/assessment">
                  <Button size="lg" className="group bg-tally-purple text-white hover:bg-tally-purple/90 hover:scale-105 active:scale-95 text-xl px-12 py-4 rounded-xl font-bold shadow-2xl hover:shadow-tally-purple/50 transition-all duration-300">
                    Apply now
                    <ArrowRight className="ml-3 h-8 w-8 group-hover:animate-bounce" />
                  </Button>
                </Link>
              </div>
              
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <Image 
                  src="/mid-adult-businessman-giving-presentation-group-industrial-workers-factory (1) (1).jpg" 
                  alt="Business team collaboration" 
                  width={600} 
                  height={400} 
                  priority
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Image */}
          <div className="lg:hidden mt-6 space-y-4">
            <div className="relative">
              <Image 
                src="/mid-adult-businessman-giving-presentation-group-industrial-workers-factory (1) (1).jpg" 
                alt="Business team collaboration" 
                width={600} 
                height={400} 
                priority
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <Link href="/assessment" className="block w-full">
                <Button size="lg" className="w-full bg-tally-purple text-white hover:bg-tally-purple/90 hover:scale-105 active:scale-95 text-base px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-tally-purple/40 transition-all duration-300">
                  Apply now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'oklch(0.35 0.05 280)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">Credit score is not affected</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">Takes under 60 seconds</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <FileText className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">Short and long term finance</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Building2 className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">Government backed options</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Tally Section */}
      <section id="why-tally" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance font-bold">Why Tally?</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
            We make business loans simple, transparent, and accessible. No hassle, no hidden fees, no months of waiting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-tally-blue rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-tally-charcoal">Speed</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Apply in minutes, approved in hours, funded in days. We move at the speed your business needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-tally-coral rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-tally-charcoal">Ease</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Just tell us the basics about your business. It's quick, easy, and only takes a minute. An enquiry won't affect your credit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-tally-purple rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-tally-charcoal">Matching</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  We match you to the best fit FCA regulated lender to handle your enquiry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3 Steps Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance font-bold">How it works</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
            This is an extremely simple and straightforward process that ranges between 24 hours and one week, depending on your particular business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-tally-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">01</span>
              </div>
              <h3 className="font-serif text-2xl mb-4 text-tally-charcoal font-bold">See if you qualify</h3>
              <p className="text-tally-mid-grey leading-relaxed">
                Click the purple "Apply Now" button on this page and fill out your basic business information. It's quick, easy, and only takes a minute
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-tally-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">02</span>
              </div>
              <h3 className="font-serif text-2xl mb-4 text-tally-charcoal font-bold">Review your offers</h3>
              <p className="text-tally-mid-grey leading-relaxed">
                With access to multiple FCA regulated brokers, we compare every option and present you with the best offer for your business.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-tally-coral rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">03</span>
              </div>
              <h3 className="font-serif text-2xl mb-4 text-tally-charcoal font-bold">Approved & funded in 4 hrs</h3>
              <p className="text-tally-mid-grey leading-relaxed">
                Once approved, and with your documents ready, you will get your loan in just a few hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Purposes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance font-bold">What can you use a loan for?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-tally-purple rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-tally-charcoal font-bold">Growth & expansion</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Open a new shop, hire more hands, or push your business into new places.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-tally-blue rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-tally-charcoal font-bold">Cashflow</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Cover the quiet months so you can pay staff, suppliers, and keep things ticking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-tally-coral rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-tally-charcoal font-bold">Stocking up</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Buy the stock you need now, so you're ready when your customers are.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-tally-charcoal font-bold">Upgrading equipment</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Get that shiny new oven, van, or laptop that helps you work faster and better.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-tally-charcoal font-bold">Covering unexpected bills</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Fix that faulty fridge, replace a leaky roof, or pay a surprise invoice without stress.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-tally-charcoal font-bold">Renovations</h3>
                <p className="text-tally-mid-grey leading-relaxed">
                  Refresh your space with a makeover that attracts more customers and keeps your business looking sharp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance font-bold">FAQ</h2>
          <p className="text-center text-muted-foreground mb-12 leading-relaxed">
            Everything you need to know about our business loans
          </p>

          <div className="space-y-4">
            {[
              {
                question: "How quickly can I get my money?",
                answer: "Once approved and with your documents ready, you can receive your funds in as little as 4 hours, with same-day funding available."
              },
              {
                question: "Will checking my eligibility affect my credit score?",
                answer: "No, our initial eligibility check is a soft search and won't impact your credit score. Only when you proceed with a specific lender's full application will a hard credit check be performed."
              },
              {
                question: "How much can I borrow?",
                answer: "You can access business loans from £5,000 up to £2 million, depending on your business needs and eligibility."
              },
              {
                question: "What do I need to apply?",
                answer: "Just basic information about your business. The application is quick and easy, taking only about a minute to complete."
              },
              {
                question: "What are the eligibility requirements?",
                answer: "Generally, you need to be a UK-registered Ltd or LLP trading for 12+ months, with regular turnover. Each lender has specific criteria, but we'll match you with those most likely to approve your application."
              },
              {
                question: "What is Tally exactly—are you a lender?",
                answer: "Tally is a loan matching service. We connect you with the best FCA-regulated brokers who can offer you the most suitable loan for your business."
              },
              {
                question: "Are there any fees to use Tally?",
                answer: "Our service is completely free to you. We're paid by lenders if they successfully provide you with funding. If a lender charges arrangement or broker fees, they must disclose this upfront before you proceed."
              },
              {
                question: "Do I need to provide security or collateral?",
                answer: "It depends on the loan type and amount. We offer both secured loans (backed by property or assets) and unsecured loans (no collateral required). We'll help you understand which option suits your situation best."
              },
              {
                question: "What documents will I need?",
                answer: "Typically: 3-6 months' business bank statements, recent accounts (filed or management accounts), Companies House details, director ID and proof of address, and an explanation of funding purpose. Requirements vary by lender."
              },
              {
                question: "How do I know if I'm getting a good rate?",
                answer: "We connect you with multiple lenders, so you can compare offers. Rates depend on your business profile, loan amount, term, and security provided. We'll help you understand the offers and choose the best fit for your business."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-border bg-card cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent 
                  className="pt-4 pb-4"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-tally-charcoal font-bold pr-4">
                      {faq.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-tally-purple flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-tally-purple flex-shrink-0" />
                    )}
                  </div>
                  {openFAQ === index && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-tally-mid-grey leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-tally-purple text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl sm:text-5xl mb-6 text-balance font-bold">Ready to get started?</h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Apply in minutes, approved in hours, funded in days. Simple, transparent business loans that add up.
          </p>
          <Link href="/assessment">
            <Button
              size="lg"
              className="bg-white text-tally-purple hover:bg-white/90 text-base px-8 rounded-full"
            >
              Apply now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
