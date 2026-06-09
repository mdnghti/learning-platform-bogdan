import React from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { courseApi, notificationApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Mail, Shield, BookOpen, Bell, CircuitBoard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user } = useAuth()

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll().then(r => r.data),
  })

  const { data: notifications = [], isLoading: loadingNotifs } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: () => notificationApi.getMine().then(r => r.data),
    enabled: !!user,
  })

  const enrolledCourses = courses.filter(c => user?.enrolledCourses?.includes(c._id))

  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'teacher' ? 'Teacher' : 'Student'
  const roleBadgeColor = user?.role === 'admin'
    ? 'bg-destructive/10 text-destructive border-destructive/20'
    : user?.role === 'teacher'
    ? 'bg-accent/10 text-accent border-accent/20'
    : 'bg-primary/10 text-primary border-primary/20'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-border/50">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          <CardContent className="px-6 pb-6 -mt-10">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg border-4 border-card">
                <span className="text-primary-foreground text-3xl font-bold">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email}</div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <Badge variant="outline" className={roleBadgeColor}>{roleLabel}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> My Courses
        </h2>
        {loadingCourses ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : enrolledCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            You haven't enrolled in any course yet. Visit the course page to enroll.
          </div>
        ) : (
          <div className="space-y-3">
            {enrolledCourses.map(course => (
              <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
                <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <CircuitBoard className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-lg">{course.title}</h3>
                      {course.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Recent Notifications
        </h2>
        {loadingNotifs ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">No notifications yet.</div>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 5).map(n => (
              <Card key={n._id} className="border-border/50">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
