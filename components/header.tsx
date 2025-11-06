"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, ArrowRight } from "lucide-react"
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
              priority
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-tally-purple text-white hover:bg-tally-purple/90 hover:scale-105 active:scale-95 text-base px-8 py-4 rounded-xl font-bold transition-all duration-300">
                Apply now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/assessment" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button size="lg" className="w-full bg-tally-purple text-white hover:bg-tally-purple/90 hover:scale-105 active:scale-95 text-base px-8 py-4 rounded-xl font-bold transition-all duration-300">
                  Apply now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
