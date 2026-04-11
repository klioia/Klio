import Grainient from "@/components/Grainient";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { AutomationSection, FeatureSection, FinalCtaSection, PricingSection, ResultsSection } from "@/components/sections";
import { Topbar } from "@/components/topbar";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-page-background">
        <Grainient
          color1="#060010"
          color2="#210e65"
          color3="#B19EEF"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <div className="home-page-overlay" />

      <div className="home-page-content">
        <Topbar />
        <main>
          <Hero />
          <FeatureSection />
          <AutomationSection />
          <PricingSection />
          <ResultsSection />
          <FinalCtaSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
