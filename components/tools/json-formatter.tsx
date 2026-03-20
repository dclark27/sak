'use client'

import { useState, useCallback } from 'react'
import { useCopy } from '@/hooks/use-copy'

type Status = 'idle' | 'valid' | 'error'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const { isCopied, copy } = useCopy()

  const parse = useCallback((value: string): unknown | null => {
    try {
      const parsed = JSON.parse(value)
      setStatus('valid')
      setError('')
      return parsed
    } catch (e) {
      setStatus('error')
      setError((e as SyntaxError).message)
      return null
    }
  }, [])

  const format = () => {
    const parsed = parse(input)
    if (parsed !== null) setOutput(JSON.stringify(parsed, null, 2))
  }

  const minify = () => {
    const parsed = parse(input)
    if (parsed !== null) setOutput(JSON.stringify(parsed))
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setStatus('idle')
    setError('')
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    setOutput('')
    if (!value.trim()) {
      setStatus('idle')
      setError('')
      return
    }
    parse(value)
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-neutral-500">Input</label>
          {status !== 'idle' && (
            <span className={`text-xs font-mono ${status === 'valid' ? 'text-green-700' : 'text-red-600'}`}>
              {status === 'valid' ? '✓ valid JSON' : '✗ invalid JSON'}
            </span>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder='{"hello": "world"}'
          className="w-full h-48 font-mono text-sm border border-neutral-200 px-3 py-2 resize-y focus:outline-none focus:border-neutral-400"
          spellCheck={false}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-mono">{error}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={format}
          disabled={!input.trim() || status === 'error'}
          className="text-sm bg-black text-white px-3 py-1.5 hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Format
        </button>
        <button
          onClick={minify}
          disabled={!input.trim() || status === 'error'}
          className="text-sm border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Minify
        </button>
        <button
          onClick={() => copy(output || input)}
          disabled={!input.trim() && !output.trim()}
          className="text-sm border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isCopied() ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={clear}
          disabled={!input && !output}
          className="text-sm border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
        >
          Clear
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Output</label>
          <pre className="border border-neutral-200 p-3 text-xs font-mono overflow-auto max-h-96 bg-neutral-50 leading-5">
            {output}
          </pre>
        </div>
      )}

      {!input && (
        <p className="text-sm text-neutral-400 text-center py-8">
          Paste JSON above to format or validate it.
        </p>
      )}
    </div>
  )
}
