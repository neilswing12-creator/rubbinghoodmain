import { AmbientLight } from "@/components/AmbientLight";
import { FeatureSection } from "@/components/FeatureSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";
import { Navbar } from "@/components/Navbar";
import { NetworkScene } from "@/components/NetworkScene";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Testimonial } from "@/components/Testimonial";
import { ValueStatement } from "@/components/ValueStatement";
import { features } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <AmbientLight />
      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <ValueStatement />

        <div id="product">
          {features.map((feature, i) => (
            <FeatureSection
              key={feature.id}
              feature={feature}
              align={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>

        <NetworkScene />
        <Testimonial />
        <Metrics />
        <FinalCTA />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
