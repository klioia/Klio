import { Hero } from "@/components/hero";
import { FinalCtaSection, PricingSection, ResultsSection } from "@/components/sections";
import { Topbar } from "@/components/topbar";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <Hero />
      <PricingSection />
      <ResultsSection />
      <FinalCtaSection />
    </>
  );
}
