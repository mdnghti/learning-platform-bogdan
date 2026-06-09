import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, ClipboardCheck, Wrench, Download, Calendar, Timer } from 'lucide-react'
import { format } from 'date-fns'

const typeConfig = {
  lecture: { icon: FileText, label: 'Lecture', color: 'bg-primary/10 text-primary border-primary/20' },
  test: { icon: ClipboardCheck, label: 'Test', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  practice: { icon: Wrench, label: 'Practice', color: 'bg-accent/10 text-accent border-accent/20' },
}

export default function MaterialViewDialog({ material, open, onOpenChange }) {
  if (!material) return null
  const config = typeConfig[material.type] || typeConfig.lecture
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color.split(' ')[0]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">{material.title}</DialogTitle>
              <Badge variant="outline" className={`mt-1 ${config.color}`}>{config.label}</Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-4">
            {material.description && <p className="text-sm text-muted-foreground">{material.description}</p>}

            {material.content && (
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-sm whitespace-pre-wrap">{material.content}</p>
              </div>
            )}

            {material.fileUrl && (
              <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Download className="w-4 h-4" /> Download {material.fileName || 'file'}
                </div>
              </a>
            )}

            {material.due_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" /> Due: {format(new Date(material.due_date), 'MMMM d, yyyy')}
              </div>
            )}

            {material.timer_minutes > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" /> {material.timer_minutes} min timer
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
