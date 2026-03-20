'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'

const STORAGE_KEY = 'sak-scratchpad'
const CONFIRM_TIMEOUT = 3000

export default function Scratchpad() {
  const [text, setText] = useState('')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [showSaved, setShowSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setText(stored)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (savedTimer.current) clearTimeout(savedTimer.current)
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  const save = useCallback((value: string) => {
    localStorage.setItem(STORAGE_KEY, value)
    setSavedAt(new Date())
    setShowSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setShowSaved(false), 1500)
  }, [])

  const handleChange = (value: string) => {
    setText(value)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(value), 300)
  }

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scratchpad.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    if (confirming) {
      setText('')
      localStorage.removeItem(STORAGE_KEY)
      setSavedAt(null)
      setConfirming(false)
    } else {
      setConfirming(true)
      confirmTimer.current = setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT)
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const lineCount = text ? text.split('\n').length : 0

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Start typing... your notes are saved automatically."
          className="w-full h-[calc(100vh-280px)] min-h-64 text-sm resize-none leading-6"
          spellCheck={false}
          autoFocus
        />
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-4">
          <span>{text.length} chars</span>
          <span>{wordCount} words</span>
          <span>{lineCount} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`transition-opacity duration-300 ${showSaved ? 'opacity-100' : 'opacity-0'}`}>
            Saved
          </span>
          {savedAt && !showSaved && (
            <span className="text-neutral-300">
              Last saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={download}
            disabled={!text}
            className="text-xs px-2 py-1"
          >
            Download .txt
          </Button>
          <button
            onClick={clear}
            disabled={!text}
            className={`text-xs border px-2 py-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              confirming
                ? 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950'
                : 'border-neutral-200 dark:border-neutral-800 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            {confirming ? 'Sure?' : 'Clear'}
          </button>
        </div>
      </div>
    </div>
  )
}
