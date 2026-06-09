import React, { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { Navigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShieldCheck, Users, GraduationCap, Pencil, Trash2, Save, X, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function AdminPanel() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [editUser, setEditUser] = useState(null)
  const [editRole, setEditRole] = useState('')

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then(r => r.data),
    enabled: user?.role === 'admin',
  })

  const updateMutation = useMutation({
    mutationFn: () => adminApi.updateUserRole(editUser._id, editRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User updated')
      setEditUser(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User deleted')
    },
  })

  const students = users.filter(u => u.role === 'student' || !u.role)
  const teachers = users.filter(u => u.role === 'teacher')
  const admins = users.filter(u => u.role === 'admin')

  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-destructive" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">Manage all users of the platform.</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Students', count: students.length, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Teachers', count: teachers.length, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Admins', count: admins.length, color: 'text-destructive', bg: 'bg-destructive/10' },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Users className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList className="bg-secondary mb-6">
          <TabsTrigger value="students" className="gap-2"><GraduationCap className="w-4 h-4" /> Students ({students.length})</TabsTrigger>
          <TabsTrigger value="teachers" className="gap-2"><UserCog className="w-4 h-4" /> Teachers ({teachers.length})</TabsTrigger>
          <TabsTrigger value="admins" className="gap-2"><ShieldCheck className="w-4 h-4" /> Admins ({admins.length})</TabsTrigger>
        </TabsList>

        {['students', 'teachers', 'admins'].map(tab => {
          const list = tab === 'students' ? students : tab === 'teachers' ? teachers : admins
          return (
            <TabsContent key={tab} value={tab}>
              {isLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              ) : list.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No {tab} found.</div>
              ) : (
                <div className="space-y-2">
                  {list.map(u => (
                    <Card key={u._id} className="border-border/50 hover:shadow-md transition-shadow group">
                      <CardContent className="px-5 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">{u.firstName?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{u.role || 'student'}</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditUser(u); setEditRole(u.role || 'student') }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(u._id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display">Edit User Role</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm font-medium">{editUser?.firstName} {editUser?.lastName} ({editUser?.email})</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}><Save className="w-4 h-4 mr-1" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
