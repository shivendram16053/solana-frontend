import React from 'react'

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full">{children}</table>
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-slate-800">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2 text-left text-gray-300 ${className}`}>{children}</th>
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>
}

