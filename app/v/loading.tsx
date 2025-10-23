import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Image src="/logo-full.png" alt="Vista Private Office" width={280} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-6">
            <div className="h-8 bg-muted rounded-md w-64 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded-md w-96 mx-auto animate-pulse" />
          </div>

          <Card className="border-primary/30 shadow-lg">
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-28 animate-pulse" />
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              </div>

              <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                <div className="h-4 w-4 bg-muted rounded animate-pulse mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-full animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>

              <div className="h-10 bg-primary/20 rounded-md animate-pulse" />

              <div className="flex items-center justify-center gap-2">
                <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-48 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
