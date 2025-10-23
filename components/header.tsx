"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image src="/logo-full.png" alt="Vista Private Office" width={240} height={48} className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/#why-vista" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Why Vista
            </Link>
            <Link href="/#who-we-serve" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Who We Serve
            </Link>
            <Link href="/assessment">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Take Assessment</Button>
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
                href="/#services"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/#why-vista"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Vista
              </Link>
              <Link
                href="/#who-we-serve"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Who We Serve
              </Link>
              <Link href="/assessment" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Take Assessment
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
