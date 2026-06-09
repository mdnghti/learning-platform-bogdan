import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ClipboardCheck, Wrench, ArrowRight } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';

function getDueBadge(dateStr) {
  const d = new Date(dateStr);
  if (isPast(d) && !isToday(d)) return { label: 'Overdue', cls: 'bg-destructive/10 text-destructive border-destructive/20' };
  if (isToday(d)) return { label: 'Due Today', cls: 'bg-destructive/10 text-destructive border-destructive/20' };
  if (isTomorrow(d)) return { label: 'Tomorrow', cls: 'bg-accent/10 text-accent border-accent/20' };
  const days = differenceInDays(d, new Date());
  return { label: `In ${days} days`, cls: 'bg-secondary text-muted-foreground border-border' };
}

const typeIcons = {
  test: ClipboardCheck,
  practice: Wrench,
};

export default function UpcomingTasks({ materials, enrolledCourseIds }) {
  const tasks = materials
    .filter(m => (m.type === 'test' || m.type === 'practice') && m.due_date && enrolledCourseIds.includes(m.course_id))
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Upcoming Tasks
        </CardTitle>
        <Link to="/course?tab=test">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View Course <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No upcoming tasks with due dates.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(m => {
              const Icon = typeIcons[m.type] || ClipboardCheck;
              const due = getDueBadge(m.due_date);
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(m.due_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${due.cls}`}>
                    {due.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}