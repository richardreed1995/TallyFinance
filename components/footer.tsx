import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Image src="/logo-icon.png" alt="Vista" width={64} height={64} className="h-16 w-16 mb-6" />
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Perspective beyond portfolios.
              <br />
              Partnership beyond transactions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>
                <Link href="/#services" className="hover:text-primary-foreground transition-colors">
                  Portfolio Management
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-foreground transition-colors">
                  Private Markets
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-foreground transition-colors">
                  Wealth Structuring
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-foreground transition-colors">
                  Family Office Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>
                <Link href="/#why-vista" className="hover:text-primary-foreground transition-colors">
                  Why Vista
                </Link>
              </li>
              <li>
                <Link href="/#who-we-serve" className="hover:text-primary-foreground transition-colors">
                  Who We Serve
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-primary-foreground transition-colors">
                  Wealth Assessment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Locations</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>London</li>
              <li>Zurich</li>
              <li>Dubai</li>
              <li>Singapore</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/60">
              Vista Private Office is not itself a regulated entity. We operate through a network of locally regulated
              firms.
            </p>
            <p className="text-xs text-primary-foreground/60">© 2025 Vista Private Office. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
