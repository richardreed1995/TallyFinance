"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-tally-light-grey/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-center md:justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Tally logo.svg" 
              alt="Tally" 
              width={100} 
              height={32} 
              priority
              className="h-7 w-auto md:h-8"
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
        </div>
      </div>
    </header>
  )
}
