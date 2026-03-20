import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import Timestamp from '@/components/tools/timestamp'

export const metadata = toolMetadata('timestamp')

export default function TimestampPage() {
  return (
    <ToolLayout
      name="Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and back."
    >
      <Timestamp />
    </ToolLayout>
  )
}
