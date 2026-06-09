import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, ClipboardCheck, Wrench, Bell } from 'lucide-react';

const navItems = [
  { to: '/course', label: 'My Course', icon: BookOpen, color: 'bg-primary/10 text-primary hover:bg-primary/20' },
  { to: '/course?tab=lecture', label: 'Materials', icon: FileText, color: 'bg-accent/10 text-accent hover:bg-accent/20' },
  { to: '/course?tab=test', label: 'Tests', icon: ClipboardCheck, color: 'bg-chart-5/10 text-chart-5 hover:bg-chart-5/20' },
  { to: '/course?tab=practice', label: 'Practice Works', icon: Wrench, color: 'bg-chart-3/10 text-chart-3 hover:bg-chart-3/20' },
  { to: '/notifications', label: 'Notifications', icon: Bell, color: 'bg-chart-4/10 text-chart-4 hover:bg-chart-4/20' },
];

export default function QuickNav() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {navItems.map(item => (
        <Link key={item.to} to={item.to}>
          <Button
            variant="outline"
            className={`w-full h-auto flex-col gap-2 py-5 border-border/50 ${item.color} transition-colors`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}