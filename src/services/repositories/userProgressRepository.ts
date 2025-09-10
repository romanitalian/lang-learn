import { db } from '../database'
import type { UserProgress } from '../../types'

export class UserProgressRepository {
  async create(progress: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProgress> {
    const now = new Date()
    const newProgress: UserProgress = {
      ...progress,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    
    await db.userProgress.add(newProgress)
    return newProgress
  }

  async getById(id: string): Promise<UserProgress | undefined> {
    return await db.userProgress.get(id)
  }

  async getByCardId(cardId: string): Promise<UserProgress | undefined> {
    return await db.userProgress.where('cardId').equals(cardId).first()
  }

  async getAll(): Promise<UserProgress[]> {
    return await db.userProgress.orderBy('createdAt').reverse().toArray()
  }

  async update(id: string, updates: Partial<Omit<UserProgress, 'id' | 'createdAt'>>): Promise<UserProgress | undefined> {
    const existingProgress = await this.getById(id)
    if (!existingProgress) {
      return undefined
    }

    const updatedProgress: UserProgress = {
      ...existingProgress,
      ...updates,
      updatedAt: new Date(),
    }

    await db.userProgress.put(updatedProgress)
    return updatedProgress
  }

  async delete(id: string): Promise<boolean> {
    await db.userProgress.delete(id)
    return true
  }

  async getCardsForReview(): Promise<UserProgress[]> {
    const now = new Date()
    return await db.userProgress
      .where('nextReview')
      .belowOrEqual(now)
      .toArray()
  }

  async getCardsDueToday(): Promise<UserProgress[]> {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    return await db.userProgress
      .where('nextReview')
      .belowOrEqual(today)
      .toArray()
  }

  async getCardsByQuality(quality: number): Promise<UserProgress[]> {
    return await db.userProgress
      .where('quality')
      .equals(quality)
      .toArray()
  }

  async getCardsByInterval(interval: number): Promise<UserProgress[]> {
    return await db.userProgress
      .where('interval')
      .equals(interval)
      .toArray()
  }

  async getCardsByRepetitions(repetitions: number): Promise<UserProgress[]> {
    return await db.userProgress
      .where('repetitions')
      .equals(repetitions)
      .toArray()
  }

  async getCardsByEaseFactor(easeFactor: number): Promise<UserProgress[]> {
    return await db.userProgress
      .where('easeFactor')
      .equals(easeFactor)
      .toArray()
  }

  async getCardsReviewedToday(): Promise<UserProgress[]> {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

    return await db.userProgress
      .where('lastReviewed')
      .between(startOfDay, endOfDay)
      .toArray()
  }

  async getCardsReviewedInRange(startDate: Date, endDate: Date): Promise<UserProgress[]> {
    return await db.userProgress
      .where('lastReviewed')
      .between(startDate, endDate)
      .toArray()
  }

  async getStatistics(): Promise<{
    totalCards: number
    cardsReviewedToday: number
    cardsDueToday: number
    averageEaseFactor: number
    averageInterval: number
    averageRepetitions: number
  }> {
    const [
      totalCards,
      cardsReviewedToday,
      cardsDueToday,
      allProgress
    ] = await Promise.all([
      this.getCount(),
      this.getCardsReviewedToday().then(cards => cards.length),
      this.getCardsDueToday().then(cards => cards.length),
      this.getAll()
    ])

    const averageEaseFactor = allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.easeFactor, 0) / allProgress.length 
      : 0

    const averageInterval = allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.interval, 0) / allProgress.length 
      : 0

    const averageRepetitions = allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.repetitions, 0) / allProgress.length 
      : 0

    return {
      totalCards,
      cardsReviewedToday,
      cardsDueToday,
      averageEaseFactor,
      averageInterval,
      averageRepetitions
    }
  }

  async getCount(): Promise<number> {
    return await db.userProgress.count()
  }

  async bulkCreate(progresses: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<UserProgress[]> {
    const now = new Date()
    const newProgresses: UserProgress[] = progresses.map(progress => ({
      ...progress,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }))

    await db.userProgress.bulkAdd(newProgresses)
    return newProgresses
  }

  async bulkUpdate(progresses: UserProgress[]): Promise<void> {
    const now = new Date()
    const updatedProgresses = progresses.map(progress => ({
      ...progress,
      updatedAt: now,
    }))

    await db.userProgress.bulkPut(updatedProgresses)
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await db.userProgress.bulkDelete(ids)
  }
}

export const userProgressRepository = new UserProgressRepository()

