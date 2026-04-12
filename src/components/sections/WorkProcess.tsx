export function WorkProcess() {
  const steps = [
    {
      id: "01",
      title: "Gym Movement",
      description: "Many gyms offer tools and resources to track progress, such as fitness apps, workout logs, or integrated gym software.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2670&auto=format&fit=crop"
    },
    {
      id: "02",
      title: "Fitness Practice",
      description: "Gyms are adaptable to various fitness levels and preferences, catering to beginners and advanced individuals alike.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2665&auto=format&fit=crop"
    },
    {
      id: "03",
      title: "Achievement",
      description: "Group fitness classes led by instructors offer structured workouts in a motivating group setting like development.",
      image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?q=80&w=2670&auto=format&fit=crop"
    }
  ];

  return (
    <section className="bg-white py-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-10 bg-brand" />
            <span className="text-brand uppercase tracking-widest text-xs font-bold font-sans">
              WORK PROCESS
            </span>
            <div className="h-[2px] w-10 bg-brand" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark">
            Easy Step To Achieve Your Goals.
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Subtle curved connective line (desktop only) */}
          <div className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-[120px] border-t-2 border-dashed border-gray-200 z-0" aria-hidden="true" />
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative z-10 group">
              
              {/* Circular Image wrapper */}
              <div className="w-[240px] h-[240px] rounded-full overflow-hidden mb-8 border-[12px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Number Badge floating on bottom of circle */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-brand text-white font-bold font-heading flex items-center justify-center rounded-full border-4 border-white">
                  {step.id}
                </div>
              </div>

              <h3 className="font-heading text-2xl font-bold text-dark mb-4 mt-4">
                {step.title}
              </h3>
              
              <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
