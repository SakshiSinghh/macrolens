'use client'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      'bg-[#0F1623] border border-[#1E2A3B] rounded-md',
      hover && 'hover:border-[#2D7DD2]/40 hover:bg-[#111927] transition-colors cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-b border-[#1E2A3B]', className)}>
      <div>
        <h3 className="text-sm font-semibold text-[#E8EDF5]">{title}</h3>
        {subtitle && <p className="text-xs text-[#7A8FA6] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-4', className)}>{children}</div>
}
