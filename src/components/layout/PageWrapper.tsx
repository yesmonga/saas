import { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="ml-64 min-h-screen bg-zinc-950">
      {children}
    </main>
  )
}
