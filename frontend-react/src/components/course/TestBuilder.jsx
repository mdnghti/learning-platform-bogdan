import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'

function generateId() { return Math.random().toString(36).substr(2, 9) }

function QuestionEditor({ question, index, onChange, onDelete }) {
  const updateAnswer = (aIdx, field, value) => {
    const answers = question.answers.map((a, i) => i === aIdx ? { ...a, [field]: value } : a)
    onChange({ ...question, answers })
  }

  const addAnswer = () => {
    onChange({ ...question, answers: [...question.answers, { id: generateId(), text: '', is_correct: false }] })
  }

  const removeAnswer = (aIdx) => {
    onChange({ ...question, answers: question.answers.filter((_, i) => i !== aIdx) })
  }

  const toggleCorrect = (aIdx) => {
    const answers = question.answers.map((a, i) => {
      if (question.multiple_correct) return i === aIdx ? { ...a, is_correct: !a.is_correct } : a
      return { ...a, is_correct: i === aIdx }
    })
    onChange({ ...question, answers })
  }

  const toggleMultiple = (val) => {
    const multiple = val === 'multiple'
    const answers = question.answers.map(a => ({ ...a, is_correct: multiple ? a.is_correct : false }))
    onChange({ ...question, multiple_correct: multiple, answers })
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Label>Question {index + 1}</Label>
          <Input value={question.text || ''} onChange={(e) => onChange({ ...question, text: e.target.value })} placeholder="Enter question text" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Select value={question.multiple_correct ? 'multiple' : 'single'} onValueChange={toggleMultiple}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Choice</SelectItem>
              <SelectItem value="multiple">Multiple Choice</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" className="w-16" value={question.points || 1} onChange={(e) => onChange({ ...question, points: parseInt(e.target.value) || 1 })} min={1} />
          <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => onDelete()}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="space-y-2 pl-4 border-l-2 border-border">
        {(question.answers || []).map((a, aIdx) => (
          <div key={a.id || aIdx} className="flex items-center gap-2">
            <button onClick={() => toggleCorrect(aIdx)} className="shrink-0">
              {a.is_correct ? <CheckCircle className="w-5 h-5 text-accent" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
            </button>
            <Input value={a.text || ''} onChange={(e) => updateAnswer(aIdx, 'text', e.target.value)} placeholder="Answer option" className="flex-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeAnswer(aIdx)}><Trash2 className="w-3 h-3" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addAnswer} className="gap-1"><Plus className="w-3 h-3" /> Add Answer</Button>
      </div>
    </div>
  )
}

export default function TestBuilder({ questions, onChange }) {
  const addQuestion = () => {
    onChange([...questions, { id: generateId(), text: '', type: 'single_choice', points: 1, answers: [], multiple_correct: false }])
  }

  const updateQuestion = (idx, q) => {
    onChange(questions.map((old, i) => i === idx ? q : old))
  }

  const deleteQuestion = (idx) => {
    onChange(questions.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Questions ({questions.length})</Label>
        <Button variant="outline" size="sm" onClick={addQuestion} className="gap-1"><Plus className="w-4 h-4" /> Add Question</Button>
      </div>
      {questions.map((q, idx) => (
        <QuestionEditor key={q.id || idx} question={q} index={idx} onChange={(v) => updateQuestion(idx, v)} onDelete={() => deleteQuestion(idx)} />
      ))}
      {questions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No questions yet. Click "Add Question" to start.</p>
      )}
    </div>
  )
}
