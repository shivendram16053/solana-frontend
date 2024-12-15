import React from 'react'

export interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={` border border-gray-700 rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ className, children }: CardProps) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
}

export function CardContent({ className, children }: CardProps) {
  return <div className={className}>{children}</div>
}
