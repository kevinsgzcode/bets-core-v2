import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-10 md:pb-16 lg:py-24">
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

        {/* Dashboard Preview */}
        <div className="relative mt-10 w-full max-w-6xl">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <Image
              src="/images/landing/dashboard.jpeg"
              alt="Bets Core dashboard preview"
              width={1400}
              height={900}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>

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
        {/* Sub-headline */}
        <h2 className="max-w-2xl leading-relaxed text-slate-500 sm:text-xl">
          Most bettors don’t really know if they’re winning. Bets Core shows you
          the truth! Bankroll, ROI, streaks, and discipline.
        </h2>
      </div>
    </section>
  );
}
