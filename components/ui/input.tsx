import { fieldBase } from './field-base'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`${fieldBase} ${className}`}
      {...props}
    />
  )
}
