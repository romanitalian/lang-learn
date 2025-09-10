// Core data types
export interface Card {
  id: string
  word: string
  translation: string
  partOfSpeech: string
  examples: string[]
  tags: string[]
  difficulty: number // 0-5 scale
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: string
  cardId: string
  quality: number // 0-5 scale (SRS quality)
  interval: number // days until next review
  repetitions: number
  easeFactor: number // SM-2 ease factor
  lastReviewed: Date
  nextReview: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  id: string
  nativeLanguage: string
  targetLanguage: string
  dailyGoal: number // cards per day
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  soundEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StudySession {
  id: string
  startTime: Date
  endTime?: Date
  cardsStudied: number
  correctAnswers: number
  totalTime: number // in seconds
  sessionType: 'lesson' | 'review' | 'test'
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// SRS Algorithm types
export interface SRSResult {
  interval: number
  repetitions: number
  easeFactor: number
  nextReview: Date
}

export interface SRSQuality {
  again: 0
  hard: 1
  good: 2
  easy: 3
}

// Exercise types
export type ExerciseType = 
  | 'multiple-choice'
  | 'match-pairs'
  | 'typing'
  | 'reorder'
  | 'true-false'
  | 'fill-blanks'
  | 'build-sentence'

export interface Exercise {
  id: string
  type: ExerciseType
  cardId: string
  question: string
  options?: string[]
  correctAnswer: string | string[]
  userAnswer?: string | string[]
  completed: boolean
  timeSpent: number // in seconds
}

// Level test types
export interface LevelTest {
  id: string
  questions: LevelTestQuestion[]
  currentQuestion: number
  totalQuestions: number
  score: number
  level: 'beginner' | 'intermediate' | 'advanced'
  completed: boolean
  startedAt: Date
  completedAt?: Date
}

export interface LevelTestQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: number
  userAnswer?: number
  timeSpent: number
}

// Module and curriculum types
export interface Module {
  id: string
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  order: number
  cards: string[] // card IDs
  prerequisites: string[] // module IDs
  completed: boolean
  progress: number // 0-100
}

export interface Curriculum {
  id: string
  name: string
  description: string
  modules: Module[]
  totalDuration: number // in weeks
  currentModule?: string
  progress: number // 0-100
}

// Import/Export types
export interface ImportData {
  cards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]
  settings?: Partial<UserSettings>
}

export interface ExportData {
  version: string
  exportedAt: Date
  cards: Card[]
  progress: UserProgress[]
  settings: UserSettings
  sessions: StudySession[]
}

// UI State types
export interface AppState {
  isLoading: boolean
  error: string | null
  currentPage: string
  theme: 'light' | 'dark' | 'system'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

