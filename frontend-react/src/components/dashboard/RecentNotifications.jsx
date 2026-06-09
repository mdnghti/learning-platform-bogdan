import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, ArrowRight, FileText, ClipboardCheck, Wrench, Info } from 'lucide-react';
import { format } from 'date-fns';

const typeIcons = {
  material: FileText,
  test: ClipboardCheck,
  practice: Wrench,
  general: Info,
};

export default function RecentNotifications({ notifications }) {
  const recent = notifications.slice(0, 5);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Latest Notifications
        </CardTitle>
        <Link to="/notifications">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No notifications yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map(n => {
              const Icon = typeIcons[n.type] || Info;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    n.is_read ? 'bg-transparent' : 'bg-primary/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      {!n.is_read && (
                        <Badge className="bg-primary text-primary-foreground text-xs h-5">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(n.created_date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}