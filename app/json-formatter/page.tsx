import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import JsonFormatter from '@/components/tools/json-formatter'

export const metadata = toolMetadata('json-formatter')

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      name="JSON Formatter"
      description="Format, validate, and minify JSON."
    >
      <JsonFormatter />
    </ToolLayout>
  )
}
