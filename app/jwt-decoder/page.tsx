import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import JwtDecoder from '@/components/tools/jwt-decoder'

export const metadata = toolMetadata('jwt-decoder')

export default function JwtDecoderPage() {
  return (
    <ToolLayout
      name="JWT Decoder"
      description="Decode and inspect JSON Web Tokens. Everything stays in your browser."
    >
      <JwtDecoder />
    </ToolLayout>
  )
}
