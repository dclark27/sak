import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import Scratchpad from '@/components/tools/scratchpad'

export const metadata = toolMetadata('scratchpad')

export default function ScratchpadPage() {
  return (
    <ToolLayout
      name="Scratchpad"
      description="A persistent notepad that saves automatically in your browser."
    >
      <Scratchpad />
    </ToolLayout>
  )
}
