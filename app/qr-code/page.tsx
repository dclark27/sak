import { toolMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/tool-layout'
import QrCode from '@/components/tools/qr-code'

export const metadata = toolMetadata('qr-code')

export default function QrCodePage() {
  return (
    <ToolLayout
      name="QR Code Generator"
      description="Generate a QR code from any URL or text. Download as PNG."
    >
      <QrCode />
    </ToolLayout>
  )
}
