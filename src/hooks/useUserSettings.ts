import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { userSettingsRepository } from '../services/repositories'
import type { UserSettings } from '../types'

export const useUserSettings = () => {
  const { userSettings, setUserSettings, updateUserSettings, setLoading, setError } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setLoading(true)
      let settings = await userSettingsRepository.get()
      
      if (!settings) {
        // Create default settings if none exist
        settings = await userSettingsRepository.create({
          nativeLanguage: 'English',
          targetLanguage: 'Spanish',
          dailyGoal: 20,
          theme: 'system',
          notifications: true,
          soundEnabled: true,
        })
      }
      
      setUserSettings(settings)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load settings')
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<Omit<UserSettings, 'id' | 'createdAt'>>) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const updatedSettings = await userSettingsRepository.update(updates)
      updateUserSettings(updatedSettings)
      return updatedSettings
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update settings')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    return await updateSettings({ theme })
  }

  const updateLanguages = async (nativeLanguage: string, targetLanguage: string) => {
    return await updateSettings({ nativeLanguage, targetLanguage })
  }

  const updateDailyGoal = async (dailyGoal: number) => {
    return await updateSettings({ dailyGoal })
  }

  const updateNotifications = async (notifications: boolean) => {
    return await updateSettings({ notifications })
  }

  const updateSoundEnabled = async (soundEnabled: boolean) => {
    return await updateSettings({ soundEnabled })
  }

  const resetToDefaults = async () => {
    try {
      setIsLoading(true)
      setLoading(true)
      const defaultSettings = await userSettingsRepository.resetToDefaults()
      setUserSettings(defaultSettings)
      return defaultSettings
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset settings')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const exportSettings = async () => {
    try {
      const settings = await userSettingsRepository.exportSettings()
      return settings
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to export settings')
      return null
    }
  }

  const importSettings = async (settings: UserSettings) => {
    try {
      setIsLoading(true)
      setLoading(true)
      const importedSettings = await userSettingsRepository.importSettings(settings)
      setUserSettings(importedSettings)
      return importedSettings
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to import settings')
      throw error
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return {
    userSettings,
    isLoading,
    loadSettings,
    updateSettings,
    updateTheme,
    updateLanguages,
    updateDailyGoal,
    updateNotifications,
    updateSoundEnabled,
    resetToDefaults,
    exportSettings,
    importSettings,
  }
}
