import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Upload, Loader2, FileText } from 'lucide-react';

import { toast } from 'sonner';
import TestBuilder from './TestBuilder';

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.ppt,.pptx';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function MaterialFormDialog({ open, onOpenChange, courseId, material, onSaved }) {
  const isEdit = !!material;
  const [form, setForm] = useState({
    title: '', description: '', type: 'lecture', due_date: '', notify_students: false,
    timer_minutes: 0, questions: [],
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (material) {
      setForm({
        title: material.title || '',
        description: material.description || '',
        type: material.type || 'lecture',
        due_date: material.due_date || '',
        notify_students: false,
        timer_minutes: material.timer_minutes || 0,