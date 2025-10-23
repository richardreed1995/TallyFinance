import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Globe, TrendingUp, Users, Building2, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-balance mb-6 text-foreground">
            Perspective. Clarity. Wealth for Generations.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Your independent multi-family office serving ambitious entrepreneurs, internationally active families, and
            discerning wealth creators who demand more than conventional wealth management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
                Take Wealth Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#services">
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Vista Section */}
      <section id="why-vista" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance">Why Vista?</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
            We see what others miss. We plan beyond the horizon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-serif text-2xl mb-3">Uncompromising Independence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No institutional affiliations. No product bias. No conflicts of interest. Our only loyalty is to you
                  and your family's long-term prosperity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-serif text-2xl mb-3">Global Sophistication</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Whether your wealth spans multiple jurisdictions, currencies, or asset classes, we bring clarity to
                  complexity with world-class opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-serif text-2xl mb-3">Built for Generations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Wealth that endures requires more than returns—it demands governance, succession planning, and values
                  that transcend generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance">Our Services</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
            Institutional-grade solutions with boutique attention
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-serif text-xl mb-2">Discretionary & Advisory Portfolio Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bespoke, multi-asset portfolios constructed and managed to your exact specifications—with full
                  transparency and institutional oversight.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-serif text-xl mb-2">Private Markets & Alternative Investments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Exclusive access to private equity, private credit, real assets, and co-investment opportunities
                  typically reserved for institutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-serif text-xl mb-2">Cross-Border Wealth Structuring</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tax-efficient structures, offshore solutions, and multi-jurisdictional planning delivered through our
                  network of regulated entities worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-serif text-xl mb-2">Family Office Services</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Consolidated reporting, succession strategy, philanthropy planning, and coordination with your
                  existing advisors—all from a single, trusted partner.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-serif text-xl mb-2">Digital Asset Integration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We welcome crypto-originated wealth and provide secure custody solutions for clients with digital
                  asset exposure—delivered through regulated partners.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-serif text-xl mb-2">Lifestyle & Specialist Assets</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Curated access to luxury real estate, art, aviation, yachts, and collectibles through our vetted
                  network of global specialists.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Vista Difference */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-16 text-balance">The Vista Difference</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Aligned Interests</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We invest alongside our clients. Your success is our success—financially and reputationally.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Boutique Agility, Global Reach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Locally regulated entities across key jurisdictions, delivering compliance and client protection
                  without bureaucracy.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Technology-Enabled Clarity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time portfolio access, consolidated reporting, and transparent performance analytics—all on a
                  secure, intuitive platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Discretion as Standard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Privacy isn't a luxury—it's a foundation. Your affairs remain confidential, always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section id="who-we-serve" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-4xl sm:text-5xl text-center mb-4 text-balance">Who We Serve</h2>
          <p className="text-center text-muted-foreground mb-12 leading-relaxed">
            Wealth creators who demand more than conventional management
          </p>

          <div className="space-y-4">
            {[
              "Entrepreneurs and founders navigating liquidity events",
              "International families with cross-border complexity",
              "Next-generation wealth inheritors seeking modern stewardship",
              "Family offices requiring independent oversight and access to institutional opportunities",
              "Professionals and executives building meaningful, multi-generational wealth",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl sm:text-5xl mb-6 text-balance">Begin the Conversation</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Wealth management should start with listening, not products. Let's discuss what matters most to you—your
            ambitions, your family's future, and the legacy you wish to build.
          </p>
          <Link href="/assessment">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8"
            >
              Take Your Wealth Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
