import Dexie, { type Table } from 'dexie'
import type { Card, UserProgress, UserSettings, StudySession } from '../types'

export class LangLearnDB extends Dexie {
  cards!: Table<Card>
  userProgress!: Table<UserProgress>
  userSettings!: Table<UserSettings>
  studySessions!: Table<StudySession>

  constructor() {
    super('LangLearnDB')
    
    this.version(1).stores({
      cards: 'id, word, translation, partOfSpeech, tags, difficulty, createdAt, updatedAt',
      userProgress: 'id, cardId, quality, interval, repetitions, easeFactor, lastReviewed, nextReview, createdAt, updatedAt',
      userSettings: 'id, nativeLanguage, targetLanguage, dailyGoal, theme, notifications, soundEnabled, createdAt, updatedAt',
      studySessions: 'id, startTime, endTime, cardsStudied, correctAnswers, totalTime, sessionType, completed, createdAt, updatedAt'
    })

    // Add indexes for better performance
    this.version(2).stores({
      cards: 'id, word, translation, partOfSpeech, tags, difficulty, createdAt, updatedAt, [word+translation]',
      userProgress: 'id, cardId, quality, interval, repetitions, easeFactor, lastReviewed, nextReview, createdAt, updatedAt, [cardId+nextReview]',
      userSettings: 'id, nativeLanguage, targetLanguage, dailyGoal, theme, notifications, soundEnabled, createdAt, updatedAt',
      studySessions: 'id, startTime, endTime, cardsStudied, correctAnswers, totalTime, sessionType, completed, createdAt, updatedAt, [sessionType+completed]'
    })
  }
}

export const db = new LangLearnDB()

// Database initialization and error handling
export const initDatabase = async (): Promise<void> => {
  try {
    await db.open()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

// Utility functions for common operations
export const clearAllData = async (): Promise<void> => {
  await db.transaction('rw', [db.cards, db.userProgress, db.userSettings, db.studySessions], async () => {
    await db.cards.clear()
    await db.userProgress.clear()
    await db.userSettings.clear()
    await db.studySessions.clear()
  })
}

export const exportData = async () => {
  const [cards, progress, settings, sessions] = await Promise.all([
    db.cards.toArray(),
    db.userProgress.toArray(),
    db.userSettings.toArray(),
    db.studySessions.toArray()
  ])

  return {
    version: '1.0.0',
    exportedAt: new Date(),
    cards,
    progress,
    settings,
    sessions
  }
}

export const importData = async (data: any) => {
  await db.transaction('rw', [db.cards, db.userProgress, db.userSettings, db.studySessions], async () => {
    if (data.cards) {
      await db.cards.bulkPut(data.cards)
    }
    if (data.progress) {
      await db.userProgress.bulkPut(data.progress)
    }
    if (data.settings) {
      await db.userSettings.bulkPut(data.settings)
    }
    if (data.sessions) {
      await db.studySessions.bulkPut(data.sessions)
    }
  })
}

