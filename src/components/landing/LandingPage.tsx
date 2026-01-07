import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

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
        <section className="space-y-6 pb-8 pt-10 md:pb-16 lg:py-32">
          <div className="container flex max-w-5xl flex-col items-center gap-6 text-center mx-auto px-4">
            {/* Badge */}
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
              Private beta · Limited access
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight">
              Stop lying to yourself. <br />
              Track your bets{" "}
              <span className="text-blue-600">like a business.</span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-2xl leading-relaxed text-slate-500 sm:text-xl">
              Most bettors don’t really know if they’re winning. Bets Tracker
              shows you the truth — bankroll, ROI, streaks, and discipline.
            </p>

            {/* CTA */}
            <div className="pt-6">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base gap-2 bg-slate-900 hover:bg-slate-800"
                >
                  Start tracking for free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- REALITIES SECTION --- */}
        <section className="container bg-white py-10 md:py-14 lg:py-20 mx-auto max-w-6xl px-6 rounded-3xl border border-slate-200 shadow-sm mb-20">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Reality 1 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">
                You don’t really know your balance.
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bets Core tracks every deposit, bet, and withdrawal
                automatically — so your bankroll is always real, not a guess.
              </p>
            </div>

            {/* Reality 2 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">
                Winning bets ≠ being profitable.
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                See your true ROI, yield, win rate, and streaks over time. No
                spreadsheets. No self-deception.
              </p>
            </div>

            {/* Reality 3 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">
                You can’t bet money you don’t have.
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                The system protects you from emotional or reckless bets by
                enforcing strict bankroll logic.
              </p>
            </div>
          </div>

          {/* Built for */}
          <div className="mt-14 pt-10 border-t border-slate-200 text-center">
            <p className="text-sm uppercase tracking-wide text-slate-400 mb-4">
              Built for people who
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 text-slate-600 text-sm">
              <span>• Bet consistently</span>
              <span>• Care about long-term profitability</span>
              <span>• Are tired of guessing results</span>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 border-t bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 max-w-7xl">
          <p className="text-center text-sm text-slate-500 md:text-left">
            Built by <span className="font-semibold text-slate-900">Kevin</span>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
