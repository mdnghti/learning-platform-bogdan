import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ClipboardCheck, Wrench, Calendar, Timer, Pin } from 'lucide-react'
import { format } from 'date-fns'

const typeConfig = {
  lecture: { icon: FileText, label: 'Lecture', color: 'bg-primary/10 text-primary border-primary/20', iconColor: 'text-primary' },
  test: { icon: ClipboardCheck, label: 'Test', color: 'bg-destructive/10 text-destructive border-destructive/20', iconColor: 'text-destructive' },
  practice: { icon: Wrench, label: 'Practice', color: 'bg-accent/10 text-accent border-accent/20', iconColor: 'text-accent' },
  video: { icon: FileText, label: 'Video', color: 'bg-primary/10 text-primary border-primary/20', iconColor: 'text-primary' },
  document: { icon: FileText, label: 'Document', color: 'bg-primary/10 text-primary border-primary/20', iconColor: 'text-primary' },
  presentation: { icon: FileText, label: 'Presentation', color: 'bg-accent/10 text-accent border-accent/20', iconColor: 'text-accent' },
  file: { icon: FileText, label: 'File', color: 'bg-primary/10 text-primary border-primary/20', iconColor: 'text-primary' },
  link: { icon: FileText, label: 'Link', color: 'bg-primary/10 text-primary border-primary/20', iconColor: 'text-primary' },
}

export default function MaterialCard({ material, isTeacher, onClick }) {
  const config = typeConfig[material.type] || typeConfig.document
  const Icon = config.icon

  return (
    <Card
      className="hover:shadow-md transition-all border-border/50 group cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.color.split(' ')[0]}`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-sm">{material.title}</h3>
                  {material.is_pinned && <Pin className="w-3.5 h-3.5 text-primary shrink-0" />}
                </div>
                {material.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{material.description}</p>
                )}
              </div>
              <Badge variant="outline" className={`shrink-0 text-xs ${config.color}`}>{config.label}</Badge>
            </div>
            {material.due_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(material.due_date), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
