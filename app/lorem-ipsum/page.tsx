import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import LoremIpsum from '@/components/tools/lorem-ipsum'

export const metadata = toolMetadata('lorem-ipsum')

export default function LoremIpsumPage() {
  return (
    <ToolLayout
      name="Lorem Ipsum Generator"
      description="Generate placeholder text by paragraphs, sentences, or words."
    >
      <LoremIpsum />
    </ToolLayout>
  )
}
