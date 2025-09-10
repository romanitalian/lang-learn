import { db } from '../database'
import type { Card } from '../../types'

export class CardRepository {
  async create(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    const now = new Date()
    const newCard: Card = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    
    await db.cards.add(newCard)
    return newCard
  }

  async getById(id: string): Promise<Card | undefined> {
    return await db.cards.get(id)
  }

  async getAll(): Promise<Card[]> {
    return await db.cards.orderBy('createdAt').reverse().toArray()
  }

  async update(id: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<Card | undefined> {
    const existingCard = await this.getById(id)
    if (!existingCard) {
      return undefined
    }

    const updatedCard: Card = {
      ...existingCard,
      ...updates,
      updatedAt: new Date(),
    }

    await db.cards.put(updatedCard)
    return updatedCard
  }

  async delete(id: string): Promise<boolean> {
    await db.cards.delete(id)
    return true
  }

  async search(query: string): Promise<Card[]> {
    const lowerQuery = query.toLowerCase()
    return await db.cards
      .filter(card => 
        card.word.toLowerCase().includes(lowerQuery) ||
        card.translation.toLowerCase().includes(lowerQuery) ||
        card.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .toArray()
  }

  async getByTags(tags: string[]): Promise<Card[]> {
    return await db.cards
      .filter(card => 
        tags.some(tag => card.tags.includes(tag))
      )
      .toArray()
  }

  async getByDifficulty(difficulty: number): Promise<Card[]> {
    return await db.cards
      .where('difficulty')
      .equals(difficulty)
      .toArray()
  }

  async getByPartOfSpeech(partOfSpeech: string): Promise<Card[]> {
    return await db.cards
      .where('partOfSpeech')
      .equals(partOfSpeech)
      .toArray()
  }

  async getRandom(count: number): Promise<Card[]> {
    const allCards = await this.getAll()
    const shuffled = allCards.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  async getCount(): Promise<number> {
    return await db.cards.count()
  }

  async bulkCreate(cards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Card[]> {
    const now = new Date()
    const newCards: Card[] = cards.map(card => ({
      ...card,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }))

    await db.cards.bulkAdd(newCards)
    return newCards
  }

  async bulkUpdate(cards: Card[]): Promise<void> {
    const now = new Date()
    const updatedCards = cards.map(card => ({
      ...card,
      updatedAt: now,
    }))

    await db.cards.bulkPut(updatedCards)
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await db.cards.bulkDelete(ids)
  }
}

export const cardRepository = new CardRepository()

