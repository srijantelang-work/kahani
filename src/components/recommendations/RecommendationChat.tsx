import React, { useEffect, useRef, useState } from 'react'
import { ChatBubble } from './ChatBubble'
import { SelectionPills } from './SelectionPills'
import { useChatStore } from '../../stores/chatStore'
import { useChatRecommendation } from '../../hooks/useChatRecommendation'
import { useGroqContext } from '@/contexts/GroqContext'
import { cn } from '@/lib/utils'

interface RecommendationChatProps {
    onResults: (results: any[]) => void
}

export const RecommendationChat = ({ onResults }: RecommendationChatProps) => {
    const {
        messages,
        step,
        mediaType,
        genres,
        themes,
        industry,
        setMediaType,
        toggleGenre,
        toggleTheme,
        setIndustry,
        setStep,
        addMessage,
        resetChat,
    } = useChatStore()

    const scrollRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const { startChat, handleNextStep, getResults } = useChatRecommendation(setIsGenerating)
    const { error } = useGroqContext()

    const hasStarted = useRef(false)

    // Start chat on mount or reset
    useEffect(() => {
        if (messages.length === 0) {
            if (!hasStarted.current) {
                hasStarted.current = true
                startChat()
            }
        } else {
            // Once we have messages, we allow the ref to be reset if it 
            // becomes 0 again (via Reset Session)
            hasStarted.current = false
        }
    }, [messages.length, startChat])

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Handle step transitions
    useEffect(() => {
        handleNextStep()
    }, [step, handleNextStep])

    const handleMediaSelect = (type: string) => {
        const normalizedType = type.toLowerCase().replace(' show', '') as 'movie' | 'tv' | 'book'
        addMessage({ role: 'user', content: type })
        setMediaType(normalizedType)
    }

    const handleIndustrySelect = async (type: string) => {
        addMessage({ role: 'user', content: type })
        setIndustry(type.toLowerCase() as any)

        setIsGenerating(true)
        const results = await getResults()
        setIsGenerating(false)
        onResults(results)
        setStep('results')
    }

    return (
        <div className="flex h-[600px] w-full max-w-2xl flex-col bg-black/40 rounded-3xl border border-neutral-900 overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-black/60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Assistant Active</span>
                </div>
                <button
                    onClick={resetChat}
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-red-500 transition-colors"
                >
                    Reset Session
                </button>
            </div>

            {/* Chat Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth"
            >
                {messages.map((msg, i) => (
                    <div key={i}>
                        <ChatBubble role={msg.role} content={msg.content} />

                        {/* Show options for the last agent message */}
                        {msg.role === 'agent' && i === messages.length - 1 && (
                            <div className="mt-2 ml-4">
                                {msg.type === 'media' && (
                                    <SelectionPills
                                        options={msg.options || []}
                                        selected={[]}
                                        onSelect={handleMediaSelect}
                                    />
                                )}

                                {msg.type === 'genre' && (
                                    <div className="space-y-3">
                                        <SelectionPills
                                            options={['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Mystery', 'Animation', 'Documentary']}
                                            selected={genres}
                                            onSelect={toggleGenre}
                                            multiSelect
                                        />
                                        <button
                                            onClick={() => setStep('theme_selection')}
                                            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            Done Selecting →
                                        </button>
                                    </div>
                                )}

                                {msg.type === 'theme' && (
                                    <div className="space-y-3">
                                        <SelectionPills
                                            options={msg.options || []}
                                            selected={themes}
                                            onSelect={toggleTheme}
                                            multiSelect
                                        />
                                        <button
                                            onClick={() => {
                                                if (mediaType === 'book') {
                                                    handleIndustrySelect('Both')
                                                } else {
                                                    setStep('industry_selection')
                                                }
                                            }}
                                            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            Continue →
                                        </button>
                                    </div>
                                )}

                                {msg.type === 'industry' && (
                                    <SelectionPills
                                        options={msg.options || []}
                                        selected={[]}
                                        onSelect={handleIndustrySelect}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isGenerating && (
                    <ChatBubble role="agent" content="..." isTyping />
                )}

                {error && (
                    <div className="mx-4 my-2 rounded-xl bg-red-900/20 border border-red-900/30 p-4 animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs text-red-400 font-medium text-center">
                            ⚠️ {error.message}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer / Input (Optional Phase 2) */}
            <div className="p-4 border-t border-neutral-900 bg-black/60">
                <p className="text-[10px] text-center text-neutral-600 font-mono uppercase tracking-widest">
                    AI-Powered Story Discovery Engine
                </p>
            </div>
        </div>
    )
}
