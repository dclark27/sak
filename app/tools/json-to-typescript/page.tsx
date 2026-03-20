import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import JsonToTypeScript from '@/components/tools/json-to-typescript'

export const metadata = toolMetadata('json-to-typescript')

export default function JsonToTypeScriptPage() {
  return (
    <ToolLayout
      name="JSON to TypeScript"
      description="Generate TypeScript interfaces from a JSON blob."
    >
      <JsonToTypeScript />
    </ToolLayout>
  )
}
