export function BMICalculator() {
  return (
    <section className="relative z-20 w-full px-4 lg:px-8 mt-[-100px] mb-24">
      <div className="container mx-auto">
        <div className="bg-dark text-white rounded-[40px] rounded-br-[100px] py-16 px-8 md:px-16 shadow-2xl relative overflow-hidden">
          {/* Subtle curved background pattern/shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl" aria-hidden="true" />
          
          <div className="text-center mb-10 relative z-10 text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-brand" />
              <span className="text-brand uppercase tracking-widest text-xs font-bold font-sans">
                BODY MASS INDEX
              </span>
              <div className="h-[1px] w-8 bg-brand" />
            </div>
            <h2 className="font-heading text-4xl font-bold">Calculate Your BMI Now</h2>
          </div>

          <form className="relative z-10 mx-auto max-w-4xl pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <input 
                type="text" 
                placeholder="Weight / KG" 
                className="bg-dark-gray border border-gray-800 text-gray-300 px-6 py-4 outline-none focus:border-brand transition-colors font-sans text-sm w-full"
                aria-label="Weight in KG"
              />
              <input 
                type="text" 
                placeholder="Height / CM" 
                className="bg-dark-gray border border-gray-800 text-gray-300 px-6 py-4 outline-none focus:border-brand transition-colors font-sans text-sm w-full"
                aria-label="Height in CM"
              />
              <input 
                type="text" 
                placeholder="Age" 
                className="bg-dark-gray border border-gray-800 text-gray-300 px-6 py-4 outline-none focus:border-brand transition-colors font-sans text-sm w-full"
                aria-label="Age"
              />
              <div className="relative">
                <select 
                  className="bg-dark-gray border border-gray-800 text-gray-300 px-6 py-4 appearance-none outline-none focus:border-brand transition-colors font-sans text-sm w-full"
                  aria-label="Sex"
                  defaultValue=""
                >
                  <option value="" disabled>Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_250px] gap-6">
              <div className="relative w-full">
                <select 
                  className="bg-dark-gray border border-gray-800 text-gray-300 px-6 py-4 appearance-none outline-none focus:border-brand transition-colors font-sans text-sm w-full"
                  aria-label="Select Activity Factor"
                  defaultValue=""
                >
                  <option value="" disabled>Select Activity Factor</option>
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                </select>
              </div>
              <input 
                type="text" 
                placeholder="Your Mass:" 
                readOnly
                className="bg-dark-gray border border-gray-800 text-gray-300 px-6 py-4 outline-none font-sans text-sm w-full cursor-not-allowed opacity-70"
                aria-label="Your result mass"
              />
              <button 
                type="submit" 
                className="bg-brand text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-4 hover:bg-red-700 transition-colors w-full"
              >
                CALCULATE NOW
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
