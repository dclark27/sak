import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import TextDiff from '@/components/tools/text-diff'

export const metadata = toolMetadata('text-diff')

export default function TextDiffPage() {
  return (
    <ToolLayout
      name="Text Diff"
      description="Compare two blocks of text and see exactly what changed."
    >
      <TextDiff />
    </ToolLayout>
  )
}
