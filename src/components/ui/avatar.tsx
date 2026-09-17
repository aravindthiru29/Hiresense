type AvatarProps = {
  initials?: string
}

export function Avatar({ initials = 'AI' }: AvatarProps) {
  return <div className="avatar">{initials}</div>
}

export function AvatarImage() {
  return null
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return <div className="avatar">{children}</div>
}
