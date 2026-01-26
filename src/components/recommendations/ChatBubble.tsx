import React from 'react'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
    role: 'agent' | 'user'
    content: string
    isTyping?: boolean
}

export const ChatBubble = ({ role, content, isTyping }: ChatBubbleProps) => {
    const isAgent = role === 'agent'

    return (
        <div
            className={cn(
                'mb-4 flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300',
                isAgent ? 'justify-start' : 'justify-end'
            )}
        >
            <div
                className={cn(
                    'max-w-[80%] rounded-2xl px-5 py-3 text-sm md:text-base shadow-sm',
                    isAgent
                        ? 'bg-neutral-900 text-white rounded-tl-none border border-neutral-800'
                        : 'bg-gradient-to-r from-red-600 to-red-800 text-white rounded-tr-none'
                )}
            >
                {isTyping ? (
                    <div className="flex gap-1 py-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"></span>
                    </div>
                ) : (
                    <p className="leading-relaxed">{content}</p>
                )}
            </div>
        </div>
    )
}
