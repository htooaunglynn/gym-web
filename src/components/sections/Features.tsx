export function Features() {
  const features = [
    {
      name: "Membership Management",
      description: "Easily track active memberships, automated renewals, and process cancellations without breaking a sweat.",
      icon: "👥",
    },
    {
      name: "Class Scheduling",
      description: "A centralized calendar allowing members to book classes effortlessly and giving trainers full visibility.",
      icon: "🗓️",
    },
    {
      name: "Automated Billing",
      description: "Set up auto-pay, track failed payments, and manage invoices with our seamless Stripe integration.",
      icon: "💳",
    },
    {
      name: "Performance Analytics",
      description: "Gain deeper insights into gym revenue, member retention rates, and the most popular classes.",
      icon: "📊",
    },
  ];

  return (
    <section id="features" className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-blue-600 dark:text-blue-500">Everything you need</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Streamlined for gym owners
          </p>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
            Our platform provides robust tools to handle day-to-day operations seamlessly so you can focus on your members' gains.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
                    <span className="text-white text-xl" aria-hidden="true">{feature.icon}</span>
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
