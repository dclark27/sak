import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import LogoGenerator from '@/components/tools/logo-generator'

export const metadata = toolMetadata('logo-generator')

export default function LogoGeneratorPage() {
  return (
    <ToolLayout
      name="Logo Generator"
      description="Generate random pixel glyphs. Export as PNG, favicon, and app icons."
    >
      <LogoGenerator />
    </ToolLayout>
  )
}
