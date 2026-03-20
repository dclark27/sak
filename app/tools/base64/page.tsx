import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import Base64 from '@/components/tools/base64'

export const metadata = toolMetadata('base64')

export default function Base64Page() {
  return (
    <ToolLayout
      name="Base64 Encode / Decode"
      description="Encode text to Base64 or decode Base64 back to plain text."
    >
      <Base64 />
    </ToolLayout>
  )
}
