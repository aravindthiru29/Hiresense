type ProgressProps = {
  value: number
  className?: string
}

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`progress-track ${className}`.trim()}>
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}
