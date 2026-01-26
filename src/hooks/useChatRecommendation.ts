import { useCallback } from 'react'
import { useChatStore, Message } from '../stores/chatStore'
import { useGroqContext, ChatContext } from '../contexts/GroqContext'

export const useChatRecommendation = (setLoading?: (loading: boolean) => void) => {
    const {
        step,
        setStep,
        mediaType,
        genres,
        themes,
        industry,
        userPrompt,
        addMessage,
        messages,
        lastProcessedStep,
        setLastProcessedStep
    } = useChatStore()

    const { generateThemes, generateChatRecommendations } = useGroqContext()

    const startChat = useCallback(() => {
        if (lastProcessedStep === 'initial') return

        setLastProcessedStep('initial')
        const welcomeMsg: Message = {
            role: 'agent',
            content: "Hey! What's the vibe today? Are we looking for a Movie, a TV Show, or a good Book?",
            options: ['Movie', 'TV Show', 'Book'],
            type: 'media'
        }
        addMessage(welcomeMsg)
        setStep('media_type')
    }, [addMessage, setStep, lastProcessedStep, setLastProcessedStep])

    const handleNextStep = useCallback(async () => {
        if (step === lastProcessedStep) return

        if (step === 'genre_selection') {
            setLastProcessedStep('genre_selection')
            const msg: Message = {
                role: 'agent',
                content: `Nice! Any specific genres for your ${mediaType}? You can pick multiple.`,
                type: 'genre'
            }
            addMessage(msg)
        } else if (step === 'theme_selection') {
            setLastProcessedStep('theme_selection')
            // Trigger dynamic themes from Gemini
            setLoading?.(true)
            const suggestedThemes = await generateThemes(mediaType!, genres)
            setLoading?.(false)

            const themeMsg: Message = {
                role: 'agent',
                content: "Awesome. I've curated a few 'moods' based on those genres. Which one peaks your interest?",
                options: suggestedThemes.map(t => t.name),
                type: 'theme'
            }
            addMessage(themeMsg)
        } else if (step === 'industry_selection' && mediaType !== 'book') {
            setLastProcessedStep('industry_selection')
            const industryMsg: Message = {
                role: 'agent',
                content: "Almost there! Should we stick to Hollywood, go for some Bollywood masala, or a mix of both?",
                options: ['Hollywood', 'Bollywood', 'Both'],
                type: 'industry'
            }
            addMessage(industryMsg)
        }
    }, [step, lastProcessedStep, mediaType, genres, addMessage, generateThemes, setLastProcessedStep])

    const getResults = useCallback(async () => {
        const context: ChatContext = {
            mediaType: mediaType!,
            genres,
            themes,
            industry: industry || 'both',
            directors: [],
            userPrompt
        }

        return await generateChatRecommendations(context)
    }, [mediaType, genres, themes, industry, userPrompt, generateChatRecommendations])

    return {
        startChat,
        handleNextStep,
        getResults,
        messages,
        step
    }
}
