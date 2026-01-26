import React from 'react'
import { cn } from '@/lib/utils'

interface SelectionPillsProps {
    options: string[]
    selected: string[]
    onSelect: (option: string) => void
    multiSelect?: boolean
    className?: string
}

export const SelectionPills = ({
    options,
    selected,
    onSelect,
    multiSelect = false,
    className,
}: SelectionPillsProps) => {
    return (
        <div className={cn('flex flex-wrap gap-2 py-2', className)}>
            {options.map((option) => {
                const isSelected = selected.includes(option)
                return (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={cn(
                            'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95',
                            isSelected
                                ? 'border-red-600 bg-red-600/10 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                                : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                        )}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
    )
}
