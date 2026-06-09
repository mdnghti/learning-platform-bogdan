import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircuitBoard, ArrowRight, BookOpen } from 'lucide-react';

export default function EnrolledCourseCard({ course, enrollment, materialCount }) {
  if (!course) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
      <div className="h-2 bg-gradient-to-r from-primary to-accent" />
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CircuitBoard className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg">{course.title}</h3>
            {course.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {enrollment?.role_in_course === 'teacher' ? 'Teacher' : 'Student'}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {materialCount} materials
              </div>
            </div>
          </div>
          <Link to="/course">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}