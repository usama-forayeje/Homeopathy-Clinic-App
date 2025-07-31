"use client"

import { HeroSection } from "./HeroSection"
import { FeaturesSection } from "./FeaturesSection"
import { StatsSection } from "./StatsSection"
import { TestimonialsSection } from "./TestimonialsSection"
import { ContactSection } from "./ContactSection"
import { Footer } from "./Footer"
import { Navigation } from "./Navigation"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
