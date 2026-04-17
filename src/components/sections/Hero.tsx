import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full bg-[#110000] overflow-hidden pb-32">
      {/* Background Graphic / Red diagonal overlay effect */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-[#3a0000]/60 to-transparent" 
        aria-hidden="true" 
      />
      
      {/* Large faint background text 'W' visible in mockup */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-heading font-bold text-white/[0.03] select-none pointer-events-none z-0" 
        aria-hidden="true"
      >
        W
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-8 items-center min-h-[600px] pt-16 lg:pt-24">
        
        {/* Left Column Area */}
        <div className="max-w-xl text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-brand" />
            <span className="text-brand uppercase tracking-widest text-xs font-bold font-sans">
              KEEP YOUR BODY FITNESS WITH WORKOUTS
            </span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-[1.1] tracking-tight mb-6">
            YOUR FITNESS <br />
            <span className="flex items-center gap-4 mt-2">
              <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20">
                <ArrowRight className="w-6 h-6 text-white" />
              </span>
              YOUR VICTORY
            </span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg mb-10 font-sans max-w-md leading-relaxed">
            Gym workouts are structured exercise sessions conducted in a fitness facility equipped with various exercise machines, free weights, and amenities.
          </p>
          
          <div className="flex flex-wrap items-center gap-8">
            <Link 
              href="/classes" 
              className="bg-brand text-white text-sm font-bold uppercase tracking-wider px-8 py-4 hover:bg-red-700 transition-colors"
            >
              VIEW CLASS SCHEDULE
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-heading font-bold text-white">2k+</span>
              <span className="text-gray-400 text-sm font-medium w-max leading-tight">
                Satisfied <br />Customer
              </span>
            </div>
          </div>
        </div>

        {/* Right Column / Hero Image overlaying */}
        <div className="relative h-full hidden lg:flex justify-end items-end">
          <div className="absolute bottom-[-150px] right-0 w-[800px] h-auto z-10 object-contain pointer-events-none">
            {/* Real placeholder matching the muscular aesthetic */}
            <Image
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2670&auto=format&fit=crop" 
              alt="Muscular man lifting dumbells" 
              className="w-full h-full object-contain [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] contrast-125 saturate-50"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
