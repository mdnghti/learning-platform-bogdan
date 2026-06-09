import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Zap, CircuitBoard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Computer Electronics Course
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Master the World of{' '}
              <span className="text-primary">Computer Electronics</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Dive deep into digital circuits, microprocessors, and modern computer architecture. 
              Learn through lectures, hands-on practice, and real-world projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/course">
                <Button size="lg" className="gap-2 text-base px-8">
                  Explore Course <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-card rounded-3xl border border-border shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <CircuitBoard className="w-20 h-20 text-primary mx-auto" />
                  <div className="font-display font-bold text-xl">Computer Electronics</div>
                  <p className="text-sm text-muted-foreground px-8">
                    Circuits • Processors • Architecture
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}