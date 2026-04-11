import { Hero } from "@/components/hero";
import { AutomationSection, FeatureSection, FinalCtaSection, PricingSection, ResultsSection } from "@/components/sections";
import { Topbar } from "@/components/topbar";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <Hero />
      <FeatureSection />
      <AutomationSection />
      <PricingSection />
      <ResultsSection />
      <FinalCtaSection />
    </>
  );
}
