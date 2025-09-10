import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { cardRepository } from '../services/repositories'
import type { Card } from '../types'

export const useCards = () => {
  const { cards, setCards, addCard, updateCard, deleteCard, setLoading, setError } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const loadCards = async () => {
    try {
      setIsLoading(true)
      setLoading(true)
      const allCards = await cardRepository.getAll()
      setCards(allCards)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load cards')
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const createCard = async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const newCard = await cardRepository.create(cardData)
      addCard(newCard)
      return newCard
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create card')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const updateCardById = async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const updatedCard = await cardRepository.update(id, updates)
      if (updatedCard) {
        updateCard(id, updatedCard)
      }
      return updatedCard
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update card')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const deleteCardById = async (id: string) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const success = await cardRepository.delete(id)
      if (success) {
        deleteCard(id)
      }
      return success
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete card')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const searchCards = async (query: string) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const results = await cardRepository.search(query)
      return results
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search cards')
      return []
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const getCardsByTags = async (tags: string[]) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const results = await cardRepository.getByTags(tags)
      return results
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get cards by tags')
      return []
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const getRandomCards = async (count: number) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const results = await cardRepository.getRandom(count)
      return results
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get random cards')
      return []
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const bulkCreateCards = async (cardsData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const newCards = await cardRepository.bulkCreate(cardsData)
      setCards([...cards, ...newCards])
      return newCards
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to bulk create cards')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  return {
    cards,
    isLoading,
    loadCards,
    createCard,
    updateCard: updateCardById,
    deleteCard: deleteCardById,
    searchCards,
    getCardsByTags,
    getRandomCards,
    bulkCreateCards,
  }
}
