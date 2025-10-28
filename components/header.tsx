"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-tally-light-grey/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Tally logo.svg" 
              alt="Tally" 
              width={120} 
              height={40} 
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#why-tally" className="text-sm font-bold text-foreground/90 hover:text-foreground transition-colors">
              Why Tally
            </Link>
            <Link href="/#faq" className="text-sm font-bold text-foreground/90 hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/assessment">
              <Button className="bg-tally-purple text-white hover:bg-tally-purple/90 rounded-full font-bold">Apply now</Button>
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="/#why-tally"
                className="text-sm font-bold text-foreground/90 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Tally
              </Link>
              <Link
                href="/#faq"
                className="text-sm font-bold text-foreground/90 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link href="/assessment" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-tally-purple text-white hover:bg-tally-purple/90 rounded-full font-bold">
                  Apply now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
