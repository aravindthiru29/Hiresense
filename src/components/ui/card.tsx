import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`panel ${className}`.trim()} {...props} />
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`panel-header ${className}`.trim()} {...props} />
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`panel-title ${className}`.trim()} {...props} />
}

export function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`panel-content ${className}`.trim()} {...props} />
}
