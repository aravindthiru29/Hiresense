import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const classes = {
    primary: 'button button-primary',
    secondary: 'button button-secondary',
    ghost: 'button button-ghost',
  }[variant]

  return <button className={`${classes} ${className}`.trim()} {...props} />
}
