import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApi, materialApi, testApi, userApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CircuitBoard, BookOpen, ClipboardCheck, Users, UserPlus, Lock } from 'lucide-react'
import MaterialCard from '@/components/course/MaterialCard'
import TestTakingDialog from '@/components/course/TestTakingDialog'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function CoursePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [testMaterial, setTestMaterial] = useState(null)

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll().then(r => r.data),
  })

  const course = courses[0]
  const isEnrolled = user && course && user.enrolledCourses?.includes(course._id)
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  const enrollMutation = useMutation({
    mutationFn: () => userApi.enroll(course._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Enrolled successfully!')
    },
  })

  const { data: modules = [] } = useQuery({
    queryKey: ['modules', course?._id],
    queryFn: () => courseApi.getById(course._id).then(r => r.data.modules || []),
    enabled: !!course,
  })

  const { data: tests = [] } = useQuery({
    queryKey: ['tests', course?._id],
    queryFn: () => testApi.getByCourse(course._id).then(r => r.data),
    enabled: !!course,
  })

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold">Login Required</h2>
        <p className="text-muted-foreground">You need to be logged in to view course materials.</p>
        <div className="flex justify-center gap-3">
          <Link to="/login"><Button variant="outline">Sign In</Button></Link>
          <Link to="/register"><Button>Register</Button></Link>
        </div>
      </div>
    )
  }

  if (loadingCourses) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <CircuitBoard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold">No Course Available</h2>
        <p className="text-muted-foreground mt-2">The course hasn't been set up yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-border p-8 sm:p-10 mb-8"
      >
        <div className="absolute top-4 right-4 opacity-10">
          <CircuitBoard className="w-32 h-32" />
        </div>
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Course</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">{course.title}</h1>
        {course.description && <p className="text-muted-foreground mt-3 max-w-2xl">{course.description}</p>}
        <div className="flex items-center gap-4 mt-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /> {course.students?.length || 0} enrolled
          </div>
          {user && !isEnrolled && (
            <Button onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending} className="gap-2 ml-auto">
              <UserPlus className="w-4 h-4" /> Enroll Now
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs defaultValue="modules">
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="modules" className="gap-1.5"><BookOpen className="w-4 h-4" /> Modules</TabsTrigger>
          <TabsTrigger value="tests" className="gap-1.5"><ClipboardCheck className="w-4 h-4" /> Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          {modules.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No modules yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {modules.map((mod, i) => (
                <ModuleSection key={mod._id} module={mod} index={i} isTeacher={isTeacher} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tests">
          {tests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <ClipboardCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No tests yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tests.map(t => (
                <Card key={t._id} className="hover:shadow-md transition-all border-border/50 group cursor-pointer" onClick={() => setTestMaterial(t)}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm">{t.title}</h3>
                      {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{t.questions?.length || 0} questions</span>
                        {t.timeLimit > 0 && <span>{t.timeLimit} min</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TestTakingDialog material={testMaterial} open={!!testMaterial} onOpenChange={(v) => { if (!v) setTestMaterial(null) }} />
    </div>
  )
}

function ModuleSection({ module, index, isTeacher }) {
  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['materials', module._id],
    queryFn: () => materialApi.getByModule(module._id).then(r => r.data),
    enabled: !!module,
  })

  return (
    <div>
      <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">{index + 1}</span>
        {module.title}
      </h3>
      {isLoading ? (
        <div className="space-y-2">{[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : materials.length === 0 ? (
        <p className="text-sm text-muted-foreground pl-8">No materials in this module.</p>
      ) : (
        <div className="space-y-2 pl-8">
          {materials.map(m => <MaterialCard key={m._id} material={m} isTeacher={isTeacher} />)}
        </div>
      )}
    </div>
  )
}
