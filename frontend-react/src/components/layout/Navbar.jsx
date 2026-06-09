import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Cpu, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">Learning Platform</span>
            </Link>
          </div>
        </div>
      </nav>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
