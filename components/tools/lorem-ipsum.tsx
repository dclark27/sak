'use client'

import { useState, useCallback } from 'react'
import TabButton from '@/components/ui/tab-button'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Textarea from '@/components/ui/textarea'
import CopyButton from '@/components/ui/copy-button'

// Classic Lorem Ipsum (scrambled Cicero Latin)
const WORDS_LA = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
  'magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation',
  'ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis',
  'aute','irure','in','reprehenderit','voluptate','velit','esse','cillum',
  'eu','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat',
  'non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim',
  'id','est','laborum','perspiciatis','unde','omnis','iste','natus','error',
  'accusantium','doloremque','laudantium','totam','rem','aperiam','eaque','ipsa',
  'ab','illo','inventore','veritatis','quasi','architecto','beatae','vitae',
  'dicta','explicabo','nemo','ipsam','voluptatem','quia','voluptas','aspernatur',
  'odit','fugit','magnam','aliquam','quaerat','minima','nostrum','exercitationem',
  'ullam','corporis','suscipit','laboriosam','aliquid','commodi','consequatur',
]

// Rough word-for-word English translation of the same Cicero passage.
// Intentionally awkward — it's supposed to feel like placeholder text.
const WORDS_EN = [
  'pain','itself','sorrow','is','loves','following','seeking','chosen',
  'but','give','such','time','fallen','so','toil','and','anguish',
  'great','some','indeed','toward','least','mercy','who','our','effort',
  'any','of toil','unless','something','from','those','gain','result','leads',
  'but','blame','in','censure','pleasure','wishes','be','through',
  'well','flee','nothing','equal','except','may be','blinded','desire',
  'not','fault','duty','deserves','gentle','soul','that','is','of labors',
  'whence','all','this','born','mistake','accusation','regret','praised',
  'whole','matter','opening','these','very','inventor','truth','almost',
  'architect','blessed','life','explained','nobody','pleasure','because',
  'rejected','hated','great','body','undertakes','hard work','gain',
]

type Lang = 'la' | 'en'
type Mode = 'paragraphs' | 'sentences' | 'words'

const LOREM_FIRST: Record<Lang, { para: string; sentence: string; word: string }> = {
  la: {
    para: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    word: 'lorem',
  },
  en: {
    para: 'Pain itself, because it is pain, loves and seeks after it. ',
    sentence: 'Pain itself, because it is pain, loves and seeks after it.',
    word: 'pain',
  },
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'paragraphs', label: 'Paragraphs' },
  { value: 'sentences', label: 'Sentences' },
  { value: 'words', label: 'Words' },
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(words: string[]) {
  return words[Math.floor(Math.random() * words.length)]
}

function generateSentence(wordCount: number, words: string[]): string {
  const picked = Array.from({ length: wordCount }, () => pick(words))
  return picked[0].charAt(0).toUpperCase() + picked[0].slice(1) + ' ' + picked.slice(1).join(' ') + '.'
}

function generateParagraph(sentenceCount: number, words: string[]): string {
  return Array.from({ length: sentenceCount }, () => generateSentence(randomInt(8, 18), words)).join(' ')
}

function generateText(mode: Mode, count: number, startWithLorem: boolean, lang: Lang): string {
  const words = lang === 'la' ? WORDS_LA : WORDS_EN
  const first = LOREM_FIRST[lang]

  if (mode === 'paragraphs') {
    return Array.from({ length: count }, (_, i) => {
      const para = generateParagraph(randomInt(3, 6), words)
      return i === 0 && startWithLorem ? first.para + para : para
    }).join('\n\n')
  }
  if (mode === 'sentences') {
    return Array.from({ length: count }, (_, i) =>
      i === 0 && startWithLorem ? first.sentence : generateSentence(randomInt(8, 18), words)
    ).join(' ')
  }
  return Array.from({ length: count }, (_, i) =>
    i === 0 && startWithLorem ? first.word : pick(words)
  ).join(' ')
}

export default function LoremIpsum() {
  const [mode, setMode] = useState<Mode>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [lang, setLang] = useState<Lang>('la')
  const [output, setOutput] = useState(() => generateText('paragraphs', 3, true, 'la'))

  const generate = useCallback(() => {
    setOutput(generateText(mode, count, startWithLorem, lang))
  }, [mode, count, startWithLorem, lang])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {MODES.map((m) => (
            <TabButton key={m.value} active={mode === m.value} onClick={() => setMode(m.value)}>
              {m.label}
            </TabButton>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Count</label>
          <Input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-16 text-sm text-center"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-neutral-500 cursor-pointer">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="accent-black"
          />
          Start with &ldquo;Lorem ipsum&rdquo;
        </label>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={generate}
        >
          Generate
        </Button>
        <CopyButton text={output} className="text-sm px-3 py-1.5" />
        {lang === 'en' && (
          <span className="text-xs text-neutral-400 self-center ml-1">
            ✦ rough translation of the actual Cicero passage
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 font-mono text-xs select-none">
          <button
            onClick={() => setLang('la')}
            title="Classic Lorem Ipsum (Latin)"
            className={`transition-all ${lang === 'la' ? 'text-neutral-800 dark:text-neutral-200 font-semibold' : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 hover:font-medium'}`}
          >
            LA
          </button>
          <span className="text-neutral-200">·</span>
          <button
            onClick={() => setLang('en')}
            title="Rough English translation"
            className={`transition-all ${lang === 'en' ? 'text-neutral-800 dark:text-neutral-200 font-semibold' : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 hover:font-medium'}`}
          >
            EN
          </button>
        </div>
        <Textarea
          readOnly
          value={output}
          className="w-full h-64 text-sm resize-y bg-neutral-50 dark:bg-neutral-900 pl-3 pr-14 scrollbar-hide"
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
      </div>
    </div>
  )
}
