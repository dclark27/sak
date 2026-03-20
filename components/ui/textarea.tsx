interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`font-mono border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 ${className}`}
      {...props}
    />
  )
}
