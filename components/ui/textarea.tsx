import { fieldBase } from './field-base'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`${fieldBase} ${className}`}
      {...props}
    />
  )
}
