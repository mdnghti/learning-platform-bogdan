import React from 'react'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import { Cpu } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold">Learning Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
