'use client'

import { useState } from 'react'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'
import Pre from '@/components/ui/pre'
import CopyButton from '@/components/ui/copy-button'

type Status = 'idle' | 'valid' | 'error'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const parse = (value: string): unknown | null => {
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
  }

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
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Input</label>
          {status !== 'idle' && (
            <span className={`text-xs font-mono ${status === 'valid' ? 'text-green-700' : 'text-red-600'}`}>
              {status === 'valid' ? '✓ valid JSON' : '✗ invalid JSON'}
            </span>
          )}
        </div>
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder='{"hello": "world"}'
          className="w-full h-48 text-sm resize-y"
          spellCheck={false}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-mono">{error}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          onClick={format}
          disabled={!input.trim() || status === 'error'}
        >
          Format
        </Button>
        <Button
          onClick={minify}
          disabled={!input.trim() || status === 'error'}
        >
          Minify
        </Button>
        <CopyButton text={output || input} className="text-sm px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed" />
        <Button
          onClick={clear}
          disabled={!input && !output}
          className="ml-auto"
        >
          Clear
        </Button>
      </div>

      {output && (
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Output</label>
          <Pre className="max-h-96">
            {output}
          </Pre>
        </div>
      )}

      {!input && (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-8">
          Paste JSON above to format or validate it.
        </p>
      )}
    </div>
  )
}
