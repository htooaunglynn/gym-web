import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="relative isolate overflow-hidden bg-blue-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg viewBox="0 0 1024 1024" className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
            <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1d4ed8" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to upgrade your gym?
              <br />
              Start your free trial today.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Join hundreds of gym owners who are scaling their businesses, improving member retention, and saving time on admin work.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link href="/signup" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-900 shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors">
                Get started
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-white hover:text-gray-200 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8 flex justify-center items-center opacity-80 mix-blend-luminosity grayscale">
            <svg className="h-full max-w-none text-blue-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
