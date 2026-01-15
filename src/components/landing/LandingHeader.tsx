import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export function LandingHeader() {
  return (
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
  );
}
