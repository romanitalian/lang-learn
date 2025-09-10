import { db } from '../database'
import type { UserSettings } from '../../types'

export class UserSettingsRepository {
  private readonly DEFAULT_SETTINGS_ID = 'default-settings'

  async get(): Promise<UserSettings | null> {
    return await db.userSettings.get(this.DEFAULT_SETTINGS_ID) || null
  }

  async create(settings: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSettings> {
    const now = new Date()
    const newSettings: UserSettings = {
      ...settings,
      id: this.DEFAULT_SETTINGS_ID,
      createdAt: now,
      updatedAt: now,
    }
    
    await db.userSettings.add(newSettings)
    return newSettings
  }

  async update(updates: Partial<Omit<UserSettings, 'id' | 'createdAt'>>): Promise<UserSettings> {
    const existingSettings = await this.get()
    if (!existingSettings) {
      throw new Error('Settings not found. Please create settings first.')
    }

    const updatedSettings: UserSettings = {
      ...existingSettings,
      ...updates,
      updatedAt: new Date(),
    }

    await db.userSettings.put(updatedSettings)
    return updatedSettings
  }

  async upsert(settings: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSettings> {
    const existingSettings = await this.get()
    
    if (existingSettings) {
      return await this.update(settings as Partial<Omit<UserSettings, 'id' | 'createdAt'>>)
    } else {
      return await this.create(settings)
    }
  }

  async delete(): Promise<boolean> {
    await db.userSettings.delete(this.DEFAULT_SETTINGS_ID)
    return true
  }

  async getDefaultSettings(): Promise<UserSettings> {
    return {
      id: this.DEFAULT_SETTINGS_ID,
      nativeLanguage: 'English',
      targetLanguage: 'Spanish',
      dailyGoal: 20,
      theme: 'system',
      notifications: true,
      soundEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  async resetToDefaults(): Promise<UserSettings> {
    const defaultSettings = await this.getDefaultSettings()
    return await this.upsert(defaultSettings)
  }

  async updateTheme(theme: 'light' | 'dark' | 'system'): Promise<UserSettings> {
    return await this.update({ theme, updatedAt: new Date() })
  }

  async updateLanguages(nativeLanguage: string, targetLanguage: string): Promise<UserSettings> {
    return await this.update({ nativeLanguage, targetLanguage, updatedAt: new Date() })
  }

  async updateDailyGoal(dailyGoal: number): Promise<UserSettings> {
    return await this.update({ dailyGoal, updatedAt: new Date() })
  }

  async updateNotifications(notifications: boolean): Promise<UserSettings> {
    return await this.update({ notifications, updatedAt: new Date() })
  }

  async updateSoundEnabled(soundEnabled: boolean): Promise<UserSettings> {
    return await this.update({ soundEnabled, updatedAt: new Date() })
  }

  async exportSettings(): Promise<UserSettings | null> {
    return await this.get()
  }

  async importSettings(settings: UserSettings): Promise<UserSettings> {
    const importedSettings: UserSettings = {
      ...settings,
      id: this.DEFAULT_SETTINGS_ID,
      updatedAt: new Date(),
    }

    await db.userSettings.put(importedSettings)
    return importedSettings
  }
}

export const userSettingsRepository = new UserSettingsRepository()

