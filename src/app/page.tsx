import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { BMICalculator } from "@/components/sections/BMICalculator";
import { About } from "@/components/sections/About";
import { WorkProcess } from "@/components/sections/WorkProcess";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1 bg-white">
        <Hero />
        <BMICalculator />
        <About />
        <WorkProcess />
      </main>
      <Footer />
    </>
  );
}
