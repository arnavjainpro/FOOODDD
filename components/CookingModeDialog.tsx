'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Check, Timer, Flame } from 'lucide-react'
import { Step } from '@/types/recipe'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { Button } from './ui/button'

interface CookingModeDialogProps {
  steps: Step[]
  title: string
  open: boolean
  onClose: () => void
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function CookingModeDialog({
  steps,
  title,
  open,
  onClose,
}: CookingModeDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  // Wake lock
  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock?.request('screen')
      } catch {
        // Not all browsers/contexts support wake lock
      }
    })()
    return () => {
      wakeLockRef.current?.release().catch(() => {})
    }
  }, [open])

  // Reset when a new step is shown
  useEffect(() => {
    clearInterval(intervalRef.current!)
    setTimerRunning(false)
    const stepTimer = steps[currentStep]?.timerSec
    setTimerRemaining(stepTimer ?? null)
  }, [currentStep, steps])

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current!), [])

  const startTimer = useCallback(() => {
    if (!timerRemaining) return
    setTimerRunning(true)
    intervalRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!)
          setTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [timerRemaining])

  const pauseTimer = useCallback(() => {
    clearInterval(intervalRef.current!)
    setTimerRunning(false)
  }, [])

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((p) => p + 1)
    } else {
      // Last step → done!
      setFinished(true)
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C8462A', '#E07A5F', '#F2A890', '#F6D7C6', '#FFF'],
      })
    }
  }, [currentStep, steps.length])

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1)
  }, [currentStep])

  const toggleCheck = useCallback(() => {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(currentStep)) next.delete(currentStep)
      else next.add(currentStep)
      return next
    })
  }, [currentStep])

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === ' ') { e.preventDefault(); toggleCheck() }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, goNext, goPrev, toggleCheck, onClose])

  if (!open) return null

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const isChecked = checkedSteps.has(currentStep)
  const stepTimerSec = steps[currentStep]?.timerSec

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cooking-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-[#1C1917] text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-white/50">
                Cooking Mode
              </p>
              <h2 className="font-serif text-lg font-semibold text-white/90 truncate max-w-xs">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Exit cooking mode"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/10">
            <motion.div
              className="h-full bg-terracotta-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
            />
          </div>

          {/* Step counter */}
          <div className="flex items-center justify-center gap-2 pt-4 pb-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  'rounded-full transition-all duration-200',
                  i === currentStep
                    ? 'w-6 h-2 bg-terracotta-500'
                    : checkedSteps.has(i)
                      ? 'w-2 h-2 bg-emerald-500'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40',
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Main step content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 text-center max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {finished ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="text-7xl">🎉</div>
                  <h3 className="font-serif text-3xl font-bold text-white">All done!</h3>
                  <p className="text-white/60 text-lg">
                    {title} is ready. Time to eat!
                  </p>
                  <Button
                    onClick={onClose}
                    className="mt-4 bg-terracotta-500 hover:bg-terracotta-600 text-white"
                  >
                    Finish cooking
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6 w-full"
                >
                  <p className="text-sm font-medium tracking-wide text-white/40 uppercase">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                  <p className="text-2xl sm:text-3xl font-serif font-medium leading-relaxed text-white/95">
                    {step.text}
                  </p>

                  {/* Timer */}
                  {stepTimerSec && timerRemaining !== null && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <div
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-4 py-2 text-base font-semibold tabular-nums transition-colors',
                          timerRemaining === 0
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                            : timerRunning
                              ? 'border-terracotta-500 bg-terracotta-500/20 text-terracotta-300'
                              : 'border-white/20 bg-white/5 text-white/70',
                        )}
                      >
                        <Timer className="h-5 w-5" />
                        <span>
                          {timerRemaining === 0 ? 'Done!' : formatTime(timerRemaining)}
                        </span>
                      </div>
                      {timerRemaining > 0 && (
                        <button
                          onClick={timerRunning ? pauseTimer : startTimer}
                          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                        >
                          {timerRunning ? 'Pause' : 'Start timer'}
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          {!finished && (
            <div className="flex items-center justify-between px-6 py-6 border-t border-white/10">
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {/* Check step */}
              <button
                onClick={toggleCheck}
                className={cn(
                  'rounded-full border px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2',
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white',
                )}
              >
                <Check className="h-4 w-4" />
                {isChecked ? 'Checked' : 'Mark done'}
              </button>

              <button
                onClick={goNext}
                className="flex items-center gap-2 rounded-full bg-terracotta-500 hover:bg-terracotta-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Flame className="h-4 w-4" />
                    Finish!
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Keyboard hint */}
          {!finished && (
            <p className="hidden md:block text-center text-xs text-white/25 pb-3">
              ← → to navigate · Space to check step · Esc to exit
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
