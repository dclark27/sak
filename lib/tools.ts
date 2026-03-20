export type Category = 'text' | 'code' | 'data' | 'media' | 'convert'

export interface Tool {
  slug: string
  name: string
  description: string
  category: Category
  keywords: string[]
}

export const TOOLS: Tool[] = [
  {
    slug: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two blocks of text and see exactly what changed.',
    category: 'text',
    keywords: ['diff', 'compare', 'difference', 'delta', 'patch', 'text'],
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON.',
    category: 'code',
    keywords: ['json', 'format', 'pretty print', 'minify', 'validate', 'lint'],
  },
  {
    slug: 'scratchpad',
    name: 'Scratchpad',
    description: 'A persistent notepad that saves automatically in your browser.',
    category: 'text',
    keywords: ['notepad', 'notes', 'scratchpad', 'text', 'write', 'memo'],
  },
  {
    slug: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write Markdown and see a live rendered preview.',
    category: 'text',
    keywords: ['markdown', 'md', 'preview', 'render', 'html', 'write'],
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences, or words.',
    category: 'text',
    keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', 'generate'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens in your browser.',
    category: 'code',
    keywords: ['jwt', 'token', 'decode', 'json web token', 'auth', 'bearer', 'claims'],
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript',
    description: 'Generate TypeScript interfaces from a JSON blob.',
    category: 'code',
    keywords: ['json', 'typescript', 'interface', 'types', 'generate', 'convert'],
  },
  {
    slug: 'qr-code',
    name: 'QR Code Generator',
    description: 'Generate a QR code from any URL or text. Download as PNG.',
    category: 'convert',
    keywords: ['qr', 'qrcode', 'barcode', 'url', 'generate', 'image', 'png'],
  },
  {
    slug: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and back.',
    category: 'convert',
    keywords: ['timestamp', 'epoch', 'unix', 'date', 'time', 'convert', 'utc', 'iso'],
  },
  {
    slug: 'base64',
    name: 'Base64 Encode / Decode',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    category: 'convert',
    keywords: ['base64', 'encode', 'decode', 'convert', 'b64', 'url-safe'],
  },
]

export const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'text', label: 'Text' },
  { value: 'code', label: 'Code' },
  { value: 'data', label: 'Data' },
  { value: 'convert', label: 'Convert' },
  { value: 'media', label: 'Media' },
]
