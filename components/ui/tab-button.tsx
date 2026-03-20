interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}

export default function TabButton({ active, onClick, children, title }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`text-xs px-3 py-1.5 border font-mono transition-colors ${
        active
          ? 'bg-black text-white border-black'
          : 'border-neutral-200 hover:bg-neutral-50'
      }`}
    >
      {children}
    </button>
  )
}
