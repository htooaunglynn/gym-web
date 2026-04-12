import Link from "next/link";
import { Check } from "lucide-react";

export function About() {
  const points = [
    "Over 15 years of experience",
    "Certified Trainers",
    "Exceptional work quality",
  ];

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Content */}
        <div className="max-w-xl text-dark">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-10 bg-brand" />
            <span className="text-brand uppercase tracking-widest text-xs font-bold font-sans">
              ABOUT US
            </span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-dark max-w-sm leading-[1.2]">
            We Have Lot Of Experience <br />Gym Training
          </h2>
          
          <p className="text-gray-600 font-sans text-base leading-relaxed mb-8">
            Many individuals benefit from personalized workout plans designed by fitness professionals or personal trainers to address specific fitness goals, such as muscle gain, weight loss, or improved athletic performance.
          </p>

          <ul className="space-y-4 mb-10">
            {points.map((point, index) => (
              <li key={index} className="flex items-center gap-4">
                <span className="w-10 h-[1px] bg-gray-300" aria-hidden="true" />
                <span className="font-sans font-semibold text-dark-gray">{point}</span>
              </li>
            ))}
          </ul>

          <Link 
            href="/about" 
            className="inline-block bg-brand text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-4 hover:bg-red-700 transition-colors"
          >
            GET STARTED
          </Link>
        </div>

        {/* Right Side: Images and Graphics */}
        <div className="relative h-full min-h-[500px] flex items-center justify-center lg:justify-end">
          {/* Angled Red Line effect behind image */}
          <div className="absolute top-10 right-20 w-1 h-[120%] bg-brand/20 -rotate-45 z-0" aria-hidden="true" />
          
          <div className="relative z-10 w-full max-w-lg aspect-square lg:aspect-auto h-full">
            {/* Using realistic replacement image */}
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop" 
              alt="Experienced gym trainer holding barbell" 
              className="w-full h-full object-cover shadow-2xl brightness-95"
            />
          </div>

          {/* Floating Icon Badge component shown in mockup */}
          <div className="absolute top-1/4 left-0 md:left-10 z-20 bg-white rounded-full p-6 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-8 border-gray-50 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-brand" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              aria-hidden="true"
            >
              <path d="M4 8l8 4 8-4M12 12v10" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
