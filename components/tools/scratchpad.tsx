'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Start typing... your notes are saved automatically."
          className="w-full h-[calc(100vh-280px)] min-h-64 font-mono text-sm border border-neutral-200 px-3 py-2 resize-none focus:outline-none focus:border-neutral-400 leading-6"
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
          <button
            onClick={download}
            disabled={!text}
            className="border border-neutral-200 px-2 py-1 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Download .txt
          </button>
          <button
            onClick={clear}
            disabled={!text}
            className={`border px-2 py-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              confirming ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {confirming ? 'Sure?' : 'Clear'}
          </button>
        </div>
      </div>
    </div>
  )
}
