import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, UserProgress, UserSettings, StudySession } from '../types'

interface AppState {
  // UI State
  isLoading: boolean
  error: string | null
  currentPage: string
  theme: 'light' | 'dark' | 'system'
  
  // Data
  cards: Card[]
  userProgress: UserProgress[]
  userSettings: UserSettings | null
  studySessions: StudySession[]
  
  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentPage: (page: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Cards
  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  updateCard: (id: string, updates: Partial<Card>) => void
  deleteCard: (id: string) => void
  
  // User Progress
  setUserProgress: (progress: UserProgress[]) => void
  addUserProgress: (progress: UserProgress) => void
  updateUserProgress: (id: string, updates: Partial<UserProgress>) => void
  deleteUserProgress: (id: string) => void
  
  // User Settings
  setUserSettings: (settings: UserSettings) => void
  updateUserSettings: (updates: Partial<UserSettings>) => void
  
  // Study Sessions
  setStudySessions: (sessions: StudySession[]) => void
  addStudySession: (session: StudySession) => void
  updateStudySession: (id: string, updates: Partial<StudySession>) => void
  deleteStudySession: (id: string) => void
  
  // Utility
  clearAllData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isLoading: false,
      error: null,
      currentPage: '/',
      theme: 'system',
      cards: [],
      userProgress: [],
      userSettings: null,
      studySessions: [],

      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setTheme: (theme) => set({ theme }),

      // Cards Actions
      setCards: (cards) => set({ cards }),
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      updateCard: (id, updates) => set((state) => ({
        cards: state.cards.map(card => 
          card.id === id ? { ...card, ...updates } : card
        )
      })),
      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter(card => card.id !== id)
      })),

      // User Progress Actions
      setUserProgress: (progress) => set({ userProgress: progress }),
      addUserProgress: (progress) => set((state) => ({ 
        userProgress: [...state.userProgress, progress] 
      })),
      updateUserProgress: (id, updates) => set((state) => ({
        userProgress: state.userProgress.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      deleteUserProgress: (id) => set((state) => ({
        userProgress: state.userProgress.filter(p => p.id !== id)
      })),

      // User Settings Actions
      setUserSettings: (settings) => set({ userSettings: settings }),
      updateUserSettings: (updates) => set((state) => ({
        userSettings: state.userSettings ? { ...state.userSettings, ...updates } : null
      })),

      // Study Sessions Actions
      setStudySessions: (sessions) => set({ studySessions: sessions }),
      addStudySession: (session) => set((state) => ({ 
        studySessions: [...state.studySessions, session] 
      })),
      updateStudySession: (id, updates) => set((state) => ({
        studySessions: state.studySessions.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      deleteStudySession: (id) => set((state) => ({
        studySessions: state.studySessions.filter(s => s.id !== id)
      })),

      // Utility Actions
      clearAllData: () => set({
        cards: [],
        userProgress: [],
        userSettings: null,
        studySessions: [],
        error: null,
      }),
    }),
    {
      name: 'lang-learn-storage',
      partialize: (state) => ({
        theme: state.theme,
        userSettings: state.userSettings,
      }),
    }
  )
)
