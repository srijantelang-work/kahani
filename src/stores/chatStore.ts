import { create } from 'zustand'

export type ChatStep =
    | 'initial'
    | 'media_type'
    | 'genre_selection'
    | 'theme_selection'
    | 'industry_selection'
    | 'generating'
    | 'results'

export interface Message {
    role: 'agent' | 'user'
    content: string
    options?: string[]
    type?: 'media' | 'genre' | 'theme' | 'industry'
}

interface ChatState {
    step: ChatStep
    mediaType: 'movie' | 'tv' | 'book' | null
    genres: string[]
    themes: string[]
    industry: 'bollywood' | 'hollywood' | 'both' | null
    userPrompt: string
    messages: Message[]
    lastProcessedStep: ChatStep | null

    // Actions
    setStep: (step: ChatStep) => void
    setMediaType: (type: 'movie' | 'tv' | 'book') => void
    toggleGenre: (genre: string) => void
    toggleTheme: (theme: string) => void
    setIndustry: (industry: 'bollywood' | 'hollywood' | 'both') => void
    setUserPrompt: (prompt: string) => void
    addMessage: (message: Message) => void
    setLastProcessedStep: (step: ChatStep | null) => void
    resetChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
    step: 'initial',
    mediaType: null,
    genres: [],
    themes: [],
    industry: null,
    userPrompt: '',
    messages: [],
    lastProcessedStep: null,

    setStep: (step) => set({ step }),
    setMediaType: (mediaType) => set({ mediaType, step: 'genre_selection' }),
    toggleGenre: (genre) => set((state) => ({
        genres: state.genres.includes(genre)
            ? state.genres.filter(g => g !== genre)
            : [...state.genres, genre]
    })),
    toggleTheme: (theme) => set((state) => ({
        themes: state.themes.includes(theme)
            ? state.themes.filter(t => t !== theme)
            : [...state.themes, theme]
    })),
    setIndustry: (industry) => set({ industry, step: 'generating' }),
    setUserPrompt: (userPrompt) => set({ userPrompt }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    setLastProcessedStep: (lastProcessedStep) => set({ lastProcessedStep }),
    resetChat: () => set({
        step: 'initial',
        mediaType: null,
        genres: [],
        themes: [],
        industry: null,
        userPrompt: '',
        messages: [],
        lastProcessedStep: null
    })
}))
