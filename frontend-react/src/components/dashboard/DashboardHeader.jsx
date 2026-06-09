import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHeader({ user }) {
  const roleLabel = user?.role === 'teacher' ? 'Teacher' : user?.role === 'admin' ? 'Admin' : 'Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-border p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
        <Cpu className="w-4 h-4" />
        CompElectro Platform
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold">
        Welcome to the Computer Electronics Platform
      </h1>
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-heading font-semibold">{user?.full_name || 'User'}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Badge variant="outline" className="ml-auto text-sm px-3 py-1">
          {roleLabel}
        </Badge>
      </div>
    </motion.div>
  );
}