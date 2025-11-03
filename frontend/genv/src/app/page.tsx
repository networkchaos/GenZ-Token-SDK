import { Header } from "../../components/header"
import { HeroSection } from "../../components/hero-section"
import { TrustedBySection } from "../../components/trusted-by-section"
import { FeaturesSection } from "../../components/features-section"
import { CodeDemoSection } from "../../components/code-demo-section"
import { DashboardPreview } from "../../components/dashboard-preview"
import { ApiDocsSection } from "../../components/api-docs-section"
import { PricingSection } from "../../components/pricing-section"
import { Footer } from "../../components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <Header />
      <main>
        <HeroSection />
         <TrustedBySection />
         <FeaturesSection />
         <CodeDemoSection />
         <DashboardPreview />
         <ApiDocsSection />
         <PricingSection />
        
      </main>
      <Footer />
    </div>
  )
}

/* 

import { FeaturesSection } from "@/components/features-section"
import { CodeDemoSection } from "@/components/code-demo-section"
import { DashboardPreview } from "@/components/dashboard-preview"
import { PricingSection } from "@/components/pricing-section"
import { ApiDocsSection } from "@/components/api-docs-section"
import { TrustedBySection } from "@/components/trusted-by-section"



<TrustedBySection />
        <FeaturesSection />
        <CodeDemoSection />
        <DashboardPreview />
        <ApiDocsSection />
        <PricingSection />

*/ 