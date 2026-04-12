import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-20 pb-24 sm:pt-32 sm:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
          Manage your gym with <span className="text-blue-600 dark:text-blue-500">absolute ease</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-600 dark:text-gray-300">
          Everything you need to run your fitness business—from memberships and scheduling to billing and insights, all in one powerful platform.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link href="/signup" className="rounded-md bg-blue-600 px-6 py-3 text-sm flex items-center font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors">
            Start free trial
          </Link>
          <Link href="#features" className="rounded-md px-6 py-3 text-sm flex items-center font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 transition-colors">
            Learn more <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
