'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Play, Pause, RotateCcw, Check } from 'lucide-react'
import { Step } from '@/types/recipe'
import { cn } from '@/lib/utils'

interface StepTimerListProps {
  steps: Step[]
  checkedSteps: Set<number>
  onToggleStep: (index: number) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function StepTimer({ totalSec }: { totalSec: number }) {
  const [remaining, setRemaining] = useState(totalSec)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (remaining <= 0) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [remaining])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current!)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current!)
    setRunning(false)
    setRemaining(totalSec)
  }, [totalSec])

  useEffect(() => () => clearInterval(intervalRef.current!), [])

  const pct = remaining / totalSec
  const finished = remaining === 0

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        finished
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
          : running
            ? 'border-terracotta-300 bg-terracotta-50 text-terracotta-700'
            : 'border-warm-200 bg-warm-50 text-muted-foreground',
      )}
    >
      <Timer className="h-3.5 w-3.5 shrink-0" />
      <span className="tabular-nums min-w-[2.8rem]">{finished ? 'Done!' : formatTime(remaining)}</span>

      {/* Progress ring mini */}
      <svg width="14" height="14" viewBox="0 0 14 14" className="-mx-0.5">
        <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="2" />
        <circle
          cx="7" cy="7" r="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * 5.5}`}
          strokeDashoffset={`${2 * Math.PI * 5.5 * (1 - pct)}`}
          strokeLinecap="round"
          transform="rotate(-90 7 7)"
          className="transition-all duration-1000"
        />
      </svg>

      {!finished && (
        running ? (
          <button onClick={pause} className="hover:opacity-70 transition-opacity" aria-label="Pause">
            <Pause className="h-3 w-3" />
          </button>
        ) : (
          <button onClick={start} className="hover:opacity-70 transition-opacity" aria-label="Start">
            <Play className="h-3 w-3" />
          </button>
        )
      )}

      {(running || remaining < totalSec) && (
        <button onClick={reset} className="hover:opacity-70 transition-opacity" aria-label="Reset">
          <RotateCcw className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export default function StepTimerList({ steps, checkedSteps, onToggleStep }: StepTimerListProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const checked = checkedSteps.has(i)
        return (
          <motion.li
            key={i}
            layout
            className={cn(
              'flex gap-4 rounded-xl border p-4 transition-colors duration-200',
              checked ? 'border-emerald-200 bg-emerald-50/50' : 'border-warm-200 bg-card',
            )}
          >
            {/* Step number / check button */}
            <button
              onClick={() => onToggleStep(i)}
              className={cn(
                'flex-none flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 mt-0.5',
                checked
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-warm-300 bg-warm-50 text-muted-foreground hover:border-terracotta-400 hover:text-terracotta-500',
              )}
              aria-label={checked ? `Uncheck step ${i + 1}` : `Check step ${i + 1}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {checked ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.div>
                ) : (
                  <motion.span key="num" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    {i + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Step content */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm leading-relaxed transition-colors',
                  checked ? 'text-muted-foreground line-through' : 'text-foreground',
                )}
              >
                {step.text}
              </p>
              {step.timerSec && (
                <div className="mt-2">
                  <StepTimer totalSec={step.timerSec} />
                </div>
              )}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
