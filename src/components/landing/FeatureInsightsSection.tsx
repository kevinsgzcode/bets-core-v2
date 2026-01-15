import Image from "next/image";

export function FeatureInsightsSection() {
  return (
    <section className="bg-slate-50 py-5">
      <div className="mx-auto max-w-7xl px-6">
        {/* CARD */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-10 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT — IMAGE */}
            <div className="relative">
              <Image
                src="/images/landing/insights1.png"
                alt="Bets Core performance insights"
                width={900}
                height={600}
                className="rounded-2xl border border-slate-200 shadow-md"
              />
            </div>

            {/* RIGHT — COPY */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                Make decisions based on data <br />
                <span className="text-blue-600">not emotions.</span>
              </h2>

              <p className="text-lg text-slate-500 max-w-xl">
                Winning a bet doesn’t mean you’re doing things right. Bets Core
                helps you understand what’s actually working — and what’s not.
              </p>

              <ul className="space-y-3 text-slate-600 text-base">
                <li>📊 Best performing sport & market</li>
                <li>🔥 Win & losing streaks over time</li>
                <li>📈 Win rate and profitability by category</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
