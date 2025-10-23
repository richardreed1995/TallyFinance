import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, Mail, Phone, BarChart3, FileText, TrendingUp, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-4xl sm:text-5xl mb-4">Thank You! Your Report is on the Way</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Check your email in the next 5 minutes for your detailed score breakdown and personalised recommendations.
            </p>
          </div>

          <Card className="border-primary bg-primary/5 mb-12">
            <CardContent className="pt-8 pb-8">
              <h2 className="font-serif text-2xl mb-6 text-center">What Happens Next</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Within 5 minutes</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your comprehensive Wealth Optimisation Report arrives in your inbox
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Within 24-48 hours</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      One of our wealth specialists will call to discuss your results (no obligation)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Within 1 week</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If you'd like to proceed, we'll prepare a complete wealth optimisation strategy
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6 text-center">In The Meantime, Here Are Some Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6 text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-sm mb-2">Free Guide</h3>
                  <p className="text-xs text-muted-foreground">The Hidden Fees Costing You Thousands</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-sm mb-2">Complete Guide</h3>
                  <p className="text-xs text-muted-foreground">Tax-Efficient Investing</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6 text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-sm mb-2">Case Study</h3>
                  <p className="text-xs text-muted-foreground">How We Saved a Client £47,000 in 12 Months</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
