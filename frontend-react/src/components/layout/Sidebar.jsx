import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { notificationApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Cpu, Home, BookOpen, User, Bell, LogOut, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const { data: notifications = [] } = useQuery({
    queryKey: ['sidebar-notifications', user?._id],
    queryFn: () => notificationApi.getMine().then(r => r.data),
    enabled: !!user,
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/course', label: 'Course', icon: BookOpen },
    ...(user ? [
      { to: '/dashboard', label: 'My Profile', icon: User },
      { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
      ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: ShieldCheck }] : []),
    ] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle asChild>
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">Learning Platform</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={link.to} onClick={onClose}>
                <Button variant={isActive(link.to) ? 'default' : 'ghost'} className="w-full justify-start gap-3 h-11 text-sm font-medium relative">
                  <link.icon className="w-4 h-4 shrink-0" />
                  {link.label}
                  {link.badge > 0 && (
                    <Badge className="ml-auto bg-destructive text-destructive-foreground text-xs h-5 min-w-5 px-1">{link.badge}</Badge>
                  )}
                </Button>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-2">
          {user ? (
            <>
              <Link to="/dashboard" onClick={onClose} className="block">
                <div className="px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground text-xs font-bold">{user.firstName?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { onClose(); logout() }}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={onClose}><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link to="/register" onClick={onClose}><Button className="w-full">Register</Button></Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
