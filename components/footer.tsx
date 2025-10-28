import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-tally-purple text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <span className="font-serif text-3xl font-bold text-white mb-6 block">Tally</span>
            <p className="text-sm text-white/80 leading-relaxed">
              Business loans that add up.
              <br />
              Simple, transparent, fast.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Our loans</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Business loans
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Quick decisions
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Fair rates
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Flexible terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/#why-tally" className="hover:text-white transition-colors">
                  Why Tally
                </Link>
              </li>
              <li>
                <Link href="/#who-we-serve" className="hover:text-white transition-colors">
                  Who we help
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-white transition-colors">
                  Apply now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>info@tallyfinance.co.uk</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="space-y-4">
            <div className="text-xs text-white/60 leading-relaxed">
              <p className="font-semibold mb-2">Important Information</p>
              <p>
                TallyFinance.co.uk is a lead generation website operated by Surf Marketing Ltd under the TallyFinance brand. We connect you with trusted businesses that offer specialist financial services. Our service is completely free and you are under no obligation to accept any quotes you receive. TallyFinance is not authorised to give financial advice and we are not liable for any advice provided by third parties. All partner lenders are FCA authorised and regulated.
              </p>
              <p className="mt-2">
                We operate exclusively with incorporated businesses (Ltd/LLP). We do not arrange or introduce consumer credit for sole traders or ordinary partnerships. All partner lenders are FCA-authorised. We are not authorised to carry on regulated consumer-credit activities.
              </p>
              <p className="mt-2 font-semibold">
                *Subject to partner checks and documents. No outcome is guaranteed.
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4 text-xs text-white/60">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </div>
              <p className="text-xs text-white/60">© 2025 Tally. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
