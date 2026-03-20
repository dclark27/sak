'use client'

import { useState, useCallback } from 'react'
import { useCopy } from '@/hooks/use-copy'

function toInterfaceName(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/[^a-zA-Z0-9]/g, '')
}

function inferType(value: unknown, key: string, interfaces: Map<string, string>): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = [...new Set(value.map((v) => inferType(v, key, interfaces)))]
    const inner = types.length === 1 ? types[0] : `(${types.join(' | ')})`
    return `${inner}[]`
  }
  switch (typeof value) {
    case 'string': return 'string'
    case 'number': return 'number'
    case 'boolean': return 'boolean'
    case 'object': {
      const name = toInterfaceName(key) || 'Nested'
      const body = buildInterface(value as Record<string, unknown>, name, interfaces)
      interfaces.set(name, body)
      return name
    }
    default: return 'unknown'
  }
}

function buildInterface(obj: Record<string, unknown>, name: string, interfaces: Map<string, string>): string {
  const lines = Object.entries(obj).map(([k, v]) => {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`
    const type = inferType(v, toInterfaceName(k) || 'Item', interfaces)
    return `  ${safeKey}: ${type};`
  })
  return `interface ${name} {\n${lines.join('\n')}\n}`
}

function jsonToTypeScript(json: string, rootName: string): { output: string; error?: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    return { output: '', error: (e as SyntaxError).message }
  }

  const interfaces = new Map<string, string>()
  let rootType = ''

  if (Array.isArray(parsed)) {
    const inner = parsed.length > 0 ? parsed[0] : null
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      const body = buildInterface(inner as Record<string, unknown>, rootName + 'Item', interfaces)
      interfaces.set(rootName + 'Item', body)
      rootType = `type ${rootName} = ${rootName}Item[]`
    } else {
      rootType = `type ${rootName} = unknown[]`
    }
  } else if (typeof parsed === 'object' && parsed !== null) {
    const body = buildInterface(parsed as Record<string, unknown>, rootName, interfaces)
    interfaces.set(rootName, body)
  } else {
    rootType = `type ${rootName} = ${typeof parsed}`
  }

  const deps: string[] = []
  const seen = new Set<string>()

  function collectDeps(name: string) {
    if (seen.has(name)) return
    seen.add(name)
    const body = interfaces.get(name)
    if (!body) return
    const nested = [...body.matchAll(/:\s*([A-Z][a-zA-Z0-9]*?)(?:\[\])?;/g)].map((m) => m[1])
    nested.forEach(collectDeps)
    deps.push(body)
  }

  interfaces.forEach((_, name) => collectDeps(name))
  if (rootType) deps.push(rootType)

  return { output: deps.join('\n\n') }
}

export default function JsonToTypeScript() {
  const [input, setInput] = useState('')
  const [rootName, setRootName] = useState('Root')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const { isCopied, copy } = useCopy()

  const convert = useCallback(() => {
    const { output: out, error: err } = jsonToTypeScript(input, rootName || 'Root')
    setOutput(out)
    setError(err ?? '')
  }, [input, rootName])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500 shrink-0">Root name</label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="border border-neutral-200 px-2 py-1.5 text-sm font-mono w-32 focus:outline-none focus:border-neutral-400"
          />
        </div>
        <button
          onClick={convert}
          disabled={!input.trim()}
          className="text-sm bg-black text-white px-3 py-1.5 hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Convert
        </button>
        {output && (
          <button
            onClick={() => copy(output)}
            className="text-sm border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50 transition-colors"
          >
            {isCopied() ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setOutput(''); setError('') }}
            placeholder='{"name": "Alice", "age": 30, "tags": ["admin"]}'
            className="w-full h-72 font-mono text-sm border border-neutral-200 px-3 py-2 resize-y focus:outline-none focus:border-neutral-400"
            spellCheck={false}
          />
          {error && <p className="mt-1 text-xs text-red-600 font-mono">{error}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">TypeScript Output</label>
          <pre className={`w-full h-72 font-mono text-sm border border-neutral-200 px-3 py-2 overflow-auto bg-neutral-50 leading-5 ${!output ? 'text-neutral-400 italic' : ''}`}>
            {output || 'TypeScript interfaces will appear here.'}
          </pre>
        </div>
      </div>

      {!input && (
        <p className="text-sm text-neutral-400 text-center py-4">
          Paste JSON on the left and click Convert.
        </p>
      )}
    </div>
  )
}
