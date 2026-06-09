import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Timer, CheckCircle, Circle, AlertTriangle, Trophy } from 'lucide-react';

export default function TestTakingDialog({ material, open, onOpenChange }) {
  const [phase, setPhase] = useState('intro'); // intro | taking | results
  const [answers, setAnswers] = useState({}); // { questionId: Set of answerIds }
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(null);
  const timerRef = useRef(null);

  const questions = material?.questions || [];
  const totalPoints = questions.reduce((s, q) => s + (q.points || 1), 0);

  useEffect(() => {
    if (!open) {
      setPhase('intro');
      setAnswers({});
      setScore(null);
      setTimeLeft(null);
      clearInterval(timerRef.current);
    }
  }, [open]);

  const startTest = () => {
    setAnswers({});
    setPhase('taking');
    if (material.timer_minutes > 0) {
      setTimeLeft(material.timer_minutes * 60);
    }
  };

  useEffect(() => {
    if (phase === 'taking' && timeLeft !== null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const toggleAnswer = (questionId, answerId, multiple) => {
    setAnswers(prev => {
      const current = new Set(prev[questionId] || []);
      if (multiple) {
        if (current.has(answerId)) current.delete(answerId);
        else current.add(answerId);
      } else {
        current.clear();
        current.add(answerId);
      }
      return { ...prev, [questionId]: current };
    });
  };

  const submitTest = () => {
    clearInterval(timerRef.current);
    let earned = 0;
    questions.forEach(q => {
      const selected = answers[q.id] || new Set();
      const correctIds = new Set((q.answers || []).filter(a => a.is_correct).map(a => a.id));
      const setsEqual = selected.size === correctIds.size && [...selected].every(id => correctIds.has(id));
      if (setsEqual) earned += (q.points || 1);
    });
    setScore(earned);
    setPhase('results');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!material) return null;

  const answeredCount = Object.keys(answers).filter(k => (answers[k]?.size || 0) > 0).length;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="font-display text-xl">{material.title}</DialogTitle>
            {phase === 'taking' && timeLeft !== null && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-foreground'
              }`}>
                <Timer className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5">

            {/* INTRO */}
            {phase === 'intro' && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{material.title}</h3>
                  {material.description && (
                    <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">{material.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                    <span className="font-semibold">{questions.length}</span> questions
                  </div>
                  <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                    <span className="font-semibold">{totalPoints}</span> total points
                  </div>
                  {material.timer_minutes > 0 && (
                    <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" />
                      <span className="font-semibold">{material.timer_minutes} min</span> time limit
                    </div>
                  )}
                </div>
                <Button size="lg" onClick={startTest} className="gap-2 px-8">
                  Start Test
                </Button>
              </div>
            )}

            {/* TAKING */}
            {phase === 'taking' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{answeredCount} of {questions.length} answered</span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>

                {questions.map((q, idx) => {
                  const selected = answers[q.id] || new Set();
                  return (
                    <div key={q.id || idx} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-sm leading-relaxed">
                          <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                          {q.text}
                        </p>
                        <div className="flex gap-1.5 shrink-0">
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {q.points || 1} {(q.points || 1) === 1 ? 'pt' : 'pts'}
                          </Badge>
                          {q.multiple_correct && (
                            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">Multi</Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(q.answers || []).map((a, aIdx) => {
                          const isSelected = selected.has(a.id);
                          return (
                            <button
                              key={a.id || aIdx}
                              onClick={() => toggleAnswer(q.id, a.id, q.multiple_correct)}
                              className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-left transition-colors ${
                                isSelected
                                  ? 'bg-primary/10 border border-primary/40 text-primary font-medium'
                                  : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                              }`}
                            >
                              {isSelected
                                ? <CheckCircle className="w-4 h-4 shrink-0" />
                                : <Circle className="w-4 h-4 shrink-0 text-muted-foreground" />
                              }
                              {a.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 flex items-center justify-between gap-4">
                  {answeredCount < questions.length && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4" />
                      {questions.length - answeredCount} unanswered
                    </div>
                  )}
                  <Button onClick={submitTest} className="ml-auto gap-2">
                    Submit Test
                  </Button>
                </div>
              </div>
            )}

            {/* RESULTS */}
            {phase === 'results' && score !== null && (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Your Score</p>
                  <p className="font-display text-5xl font-bold text-primary">{score}</p>
                  <p className="text-muted-foreground mt-1">out of {totalPoints} points</p>
                  <p className="mt-2 text-lg font-semibold">
                    {totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0}%
                  </p>
                </div>

                <div className="space-y-3 text-left max-w-md mx-auto">
                  {questions.map((q, idx) => {
                    const selected = answers[q.id] || new Set();
                    const correctIds = new Set((q.answers || []).filter(a => a.is_correct).map(a => a.id));
                    const correct = selected.size === correctIds.size && [...selected].every(id => correctIds.has(id));
                    return (
                      <div key={q.id || idx} className={`p-3 rounded-lg text-sm ${correct ? 'bg-accent/10 border border-accent/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                        <p className="font-medium">{idx + 1}. {q.text}</p>
                        <p className={`text-xs mt-1 ${correct ? 'text-accent' : 'text-destructive'}`}>
                          {correct ? `✓ Correct (+${q.points || 1} pts)` : '✗ Incorrect (0 pts)'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={startTest}>Retake Test</Button>
                  <Button onClick={() => onOpenChange(false)}>Close</Button>
                </div>
              </div>
            )}

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}