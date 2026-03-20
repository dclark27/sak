import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import MarkdownPreview from '@/components/tools/markdown-preview'

export const metadata = toolMetadata('markdown-preview')

export default function MarkdownPreviewPage() {
  return (
    <ToolLayout
      name="Markdown Preview"
      description="Write Markdown and see a live rendered preview."
    >
      <MarkdownPreview />
    </ToolLayout>
  )
}
