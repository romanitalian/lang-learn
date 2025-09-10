import { db } from '../database'
import type { StudySession } from '../../types'

export class StudySessionRepository {
  async create(session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudySession> {
    const now = new Date()
    const newSession: StudySession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    
    await db.studySessions.add(newSession)
    return newSession
  }

  async getById(id: string): Promise<StudySession | undefined> {
    return await db.studySessions.get(id)
  }

  async getAll(): Promise<StudySession[]> {
    return await db.studySessions.orderBy('createdAt').reverse().toArray()
  }

  async update(id: string, updates: Partial<Omit<StudySession, 'id' | 'createdAt'>>): Promise<StudySession | undefined> {
    const existingSession = await this.getById(id)
    if (!existingSession) {
      return undefined
    }

    const updatedSession: StudySession = {
      ...existingSession,
      ...updates,
      updatedAt: new Date(),
    }

    await db.studySessions.put(updatedSession)
    return updatedSession
  }

  async delete(id: string): Promise<boolean> {
    await db.studySessions.delete(id)
    return true
  }

  async getByType(sessionType: 'lesson' | 'review' | 'test'): Promise<StudySession[]> {
    return await db.studySessions
      .where('sessionType')
      .equals(sessionType)
      .toArray()
  }

  async getCompleted(): Promise<StudySession[]> {
    return await db.studySessions
      .filter(session => session.completed === true)
      .toArray()
  }

  async getInProgress(): Promise<StudySession[]> {
    return await db.studySessions
      .filter(session => session.completed === false)
      .toArray()
  }

  async getToday(): Promise<StudySession[]> {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

    return await db.studySessions
      .where('startTime')
      .between(startOfDay, endOfDay)
      .toArray()
  }

  async getInRange(startDate: Date, endDate: Date): Promise<StudySession[]> {
    return await db.studySessions
      .where('startTime')
      .between(startDate, endDate)
      .toArray()
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<StudySession[]> {
    return await db.studySessions
      .where('startTime')
      .between(startDate, endDate)
      .toArray()
  }

  async getCurrentSession(): Promise<StudySession | undefined> {
    return await db.studySessions
      .filter(session => session.completed === false)
      .first()
  }

  async completeSession(id: string, endTime: Date, totalTime: number): Promise<StudySession | undefined> {
    const existingSession = await this.getById(id)
    if (!existingSession) {
      return undefined
    }
    
    return await this.update(id, {
      endTime,
      totalTime,
      completed: true,
    })
  }

  async getStatistics(): Promise<{
    totalSessions: number
    completedSessions: number
    totalTimeSpent: number
    averageSessionTime: number
    cardsStudied: number
    correctAnswers: number
    accuracy: number
    sessionsToday: number
    sessionsThisWeek: number
    sessionsThisMonth: number
  }> {
    const allSessions = await this.getAll()
    const completedSessions = allSessions.filter(s => s.completed)
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const totalTimeSpent = completedSessions.reduce((sum, s) => sum + s.totalTime, 0)
    const averageSessionTime = completedSessions.length > 0 
      ? totalTimeSpent / completedSessions.length 
      : 0

    const cardsStudied = completedSessions.reduce((sum, s) => sum + s.cardsStudied, 0)
    const correctAnswers = completedSessions.reduce((sum, s) => sum + s.correctAnswers, 0)
    const accuracy = cardsStudied > 0 ? (correctAnswers / cardsStudied) * 100 : 0

    const sessionsToday = allSessions.filter(s => {
      const sessionDate = new Date(s.startTime)
      return sessionDate.toDateString() === new Date().toDateString()
    }).length

    const sessionsThisWeek = allSessions.filter(s => 
      new Date(s.startTime) >= startOfWeek
    ).length

    const sessionsThisMonth = allSessions.filter(s => 
      new Date(s.startTime) >= startOfMonth
    ).length

    return {
      totalSessions: allSessions.length,
      completedSessions: completedSessions.length,
      totalTimeSpent,
      averageSessionTime,
      cardsStudied,
      correctAnswers,
      accuracy,
      sessionsToday,
      sessionsThisWeek,
      sessionsThisMonth,
    }
  }

  async getCount(): Promise<number> {
    return await db.studySessions.count()
  }

  async bulkCreate(sessions: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<StudySession[]> {
    const now = new Date()
    const newSessions: StudySession[] = sessions.map(session => ({
      ...session,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }))

    await db.studySessions.bulkAdd(newSessions)
    return newSessions
  }

  async bulkUpdate(sessions: StudySession[]): Promise<void> {
    const now = new Date()
    const updatedSessions = sessions.map(session => ({
      ...session,
      updatedAt: now,
    }))

    await db.studySessions.bulkPut(updatedSessions)
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await db.studySessions.bulkDelete(ids)
  }
}

export const studySessionRepository = new StudySessionRepository()
