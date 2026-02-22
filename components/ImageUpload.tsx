'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, X, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  error?: string
}

type Mode = 'idle' | 'uploading' | 'done' | 'error'

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [mode, setMode] = useState<Mode>(value ? 'done' : 'idle')
  const [dragging, setDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [urlMode, setUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setMode('uploading')
      setErrorMsg('')
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Upload failed')
        onChange(json.url)
        setMode('done')
      } catch (e: unknown) {
        setErrorMsg(e instanceof Error ? e.message : 'Upload failed')
        setMode('error')
      }
    },
    [onChange],
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      upload(files[0])
    },
    [upload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const clear = () => {
    onChange('')
    setMode('idle')
    setErrorMsg('')
    setUrlInput('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const applyUrl = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    onChange(trimmed)
    setMode('done')
    setUrlMode(false)
  }

  // URL mode: just a plain text input
  if (urlMode) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
            placeholder="https://images.unsplash.com/…"
            autoFocus
            className="flex-1 rounded-xl border border-warm-200 bg-warm-50 px-3 py-2 text-sm outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-200 transition-all"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="rounded-xl bg-terracotta-500 hover:bg-terracotta-600 px-3 py-2 text-sm font-medium text-white transition-colors"
          >
            Use URL
          </button>
        </div>
        <button
          type="button"
          onClick={() => setUrlMode(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to upload
        </button>
      </div>
    )
  }

  // Preview state: image is set
  if (mode === 'done' && value) {
    return (
      <div className="relative group overflow-hidden rounded-2xl border border-warm-200 bg-warm-50">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={value}
            alt="Cover image preview"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
        </div>
        {/* Controls overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-white/90 hover:bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow transition-colors"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-white/90 hover:bg-white p-1.5 text-foreground shadow transition-colors"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2 py-0.5 text-xs text-white/90">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          {value.startsWith('/uploads/') ? 'Uploaded' : 'URL set'}
        </div>
        {/* Hidden file input for replace */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    )
  }

  // Upload zone (idle / uploading / error)
  return (
    <div className="space-y-2">
      <div
        onClick={() => mode !== 'uploading' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload cover image"
        className={cn(
          'group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 outline-none',
          mode === 'uploading'
            ? 'cursor-wait border-terracotta-300 bg-terracotta-50/50'
            : dragging
              ? 'cursor-copy border-terracotta-400 bg-terracotta-50 scale-[1.01]'
              : mode === 'error'
                ? 'cursor-pointer border-destructive/40 bg-destructive/5 hover:border-destructive/60'
                : 'cursor-pointer border-warm-300 bg-warm-50 hover:border-terracotta-300 hover:bg-terracotta-50/30',
        )}
      >
        {mode === 'uploading' ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-terracotta-400" />
            <p className="text-sm font-medium text-terracotta-600">Uploading…</p>
          </>
        ) : mode === 'error' ? (
          <>
            <AlertCircle className="h-8 w-8 text-destructive/70" />
            <div>
              <p className="text-sm font-medium text-destructive">{errorMsg}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Click to try again</p>
            </div>
          </>
        ) : (
          <>
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl border border-warm-200 bg-white shadow-sm transition-transform duration-200',
              dragging ? 'scale-110' : 'group-hover:scale-105',
            )}>
              <ImagePlus className="h-6 w-6 text-terracotta-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {dragging ? 'Drop to upload' : 'Drop a photo here'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                or <span className="text-terracotta-500 font-medium">click to browse</span> · JPG, PNG, WebP · max 10 MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Validation error from form */}
      {error && !errorMsg && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* URL fallback */}
      <button
        type="button"
        onClick={() => setUrlMode(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <LinkIcon className="h-3 w-3" />
        Use an image URL instead
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
