import Image from "next/image";

export function FeaturePicksSection() {
  return (
    <section className="bg-slate-50 py-5">
      <div className="mx-auto max-w-7xl px-6">
        {/* CARD WRAPPER */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-10 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT — COPY */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-blue-600 tracking-tight">
                Track every pick in seconds,
              </h2>

              <p className="text-lg text-slate-500 max-w-xl">
                From single bets to complex parlays, Bets Core makes logging
                your bets fast, clean, and intuitive no clutter, no confusion
              </p>

              <ul className="space-y-3 text-slate-600 text-base">
                <li>🏈 Sports</li>
                <li>🎁 Bonus</li>
              </ul>
            </div>

            {/* RIGHT — IMAGE */}
            <div className="relative">
              <Image
                src="/images/landing/parlays.png"
                alt="Bets Core stats overview"
                width={900}
                height={600}
                priority
                className="rounded-2xl border border-slate-200 shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
