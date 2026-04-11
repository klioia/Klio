import { Hero } from "@/components/hero";
import {
  DemoSection,
  FinalCtaSection,
  PricingSection,
  ProblemSolutionSection,
  SocialProofSection
} from "@/components/sections";
import { Topbar } from "@/components/topbar";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <Hero />
      <ProblemSolutionSection />
      <DemoSection />
      <PricingSection />
      <SocialProofSection />
      <FinalCtaSection />
    </>
  );
}
