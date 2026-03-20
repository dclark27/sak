'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export function useCopy(timeout = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const copy = useCallback(async (text: string, key = 'default') => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopiedKey(null), timeout)
  }, [timeout])

  const isCopied = useCallback((key = 'default') => copiedKey === key, [copiedKey])

  return { isCopied, copy }
}
