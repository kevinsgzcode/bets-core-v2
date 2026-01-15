import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureStatsSection } from "@/components/landing/FeatureStatsSection";
import { FeatureInsightsSection } from "./FeatureInsightsSection";
import { FeaturePicksSection } from "./FeaturePicksSection";
import { FooterSection } from "./FooterSection";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* --- HEADER --- */}
      <LandingHeader />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <HeroSection />
        <FeatureStatsSection />
        <FeatureInsightsSection />
        <FeaturePicksSection />
        <FooterSection />
      </main>
    </div>
  );
}
