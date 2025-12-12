import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, ShieldCheck, TrendingUp } from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
          <div className="flex gap-2 items-center font-bold text-xl text-blue-600">
            <TrendingUp className="h-6 w-6" />
            Bets Core
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-5xl flex-col items-center gap-4 text-center mx-auto px-4">
            {/* Badge */}
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
              Bets Core V2 is Live
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight">
              Stop lying to yourself. <br />
              Track your <span className="text-blue-600">real bets.</span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-2xl leading-normal text-slate-500 sm:text-xl sm:leading-8">
              The house wins because you don't track your losses. Gain strict
              control over your bankroll, analyze your ROI, and treat betting
              like a business.
            </p>

            {/* CTA */}
            <div className="space-x-4 pt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base gap-2 bg-slate-900 hover:bg-slate-800"
                >
                  Start Tracking for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="container space-y-6 bg-white py-8 md:py-12 lg:py-24 mx-auto max-w-7xl px-4 rounded-3xl border border-slate-200 shadow-sm mb-20">
          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative overflow-hidden rounded-lg p-2">
              <div className="flex flex-col justify-between rounded-md p-2">
                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 w-fit">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Bankroll Management</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Stop guessing your balance. Track every deposit, withdrawal,
                    and pending bet with strict financial integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative overflow-hidden rounded-lg p-2">
              <div className="flex flex-col justify-between rounded-md p-2">
                <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 w-fit">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Real ROI Analytics</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Green means profit, Red means loss. Our dashboard calculates
                    your Yield and Win Rate automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative overflow-hidden rounded-lg p-2">
              <div className="flex flex-col justify-between rounded-md p-2">
                <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 w-fit">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Smart Validation</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Prevent bankruptcy. The system won't let you bet money you
                    don't have. Logic over emotions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 md:px-8 md:py-0 border-t bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 max-w-7xl">
          <p className="text-center text-sm leading-loose text-slate-500 md:text-left">
            Built by <span className="font-bold text-slate-900">Kevin</span>.
            Source code available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}
