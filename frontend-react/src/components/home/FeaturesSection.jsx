import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText, ClipboardCheck, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: BookOpen,
    title: 'Structured Lectures',
    description: 'Well-organized course materials covering fundamentals to advanced topics.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: FileText,
    title: 'Rich Materials',
    description: 'Access PDFs, presentations, and documents uploaded by your instructor.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: ClipboardCheck,
    title: 'Tests & Assessments',
    description: 'Regular tests to track your understanding and measure progress.',
    color: 'bg-chart-5/10 text-chart-5',
  },
  {
    icon: Wrench,
    title: 'Practice Works',
    description: 'Hands-on assignments and lab exercises to apply what you learn.',
    color: 'bg-chart-3/10 text-chart-3',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Everything You Need to Learn
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive learning platform designed for effective education.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}