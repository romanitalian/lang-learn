import '@testing-library/jest-dom'

// Mock crypto.randomUUID for tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  }
})

// Mock IndexedDB for tests
const mockIndexedDB = {
  open: vi.fn(() => Promise.resolve()),
  close: vi.fn(),
  transaction: vi.fn(() => ({
    objectStore: vi.fn(() => ({
      add: vi.fn(() => Promise.resolve()),
      get: vi.fn(() => Promise.resolve()),
      put: vi.fn(() => Promise.resolve()),
      delete: vi.fn(() => Promise.resolve()),
      clear: vi.fn(() => Promise.resolve()),
      count: vi.fn(() => Promise.resolve(0)),
      toArray: vi.fn(() => Promise.resolve([])),
      where: vi.fn(() => ({
        equals: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([])),
          first: vi.fn(() => Promise.resolve(undefined))
        })),
        belowOrEqual: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([]))
        })),
        between: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([]))
        }))
      })),
      filter: vi.fn(() => ({
        toArray: vi.fn(() => Promise.resolve([]))
      })),
      orderBy: vi.fn(() => ({
        reverse: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([]))
        })),
        toArray: vi.fn(() => Promise.resolve([]))
      }))
    }))
  }))
}

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB
})

// Mock PWA registration
vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn()
}))

// Mock Dexie
vi.mock('dexie', () => ({
  default: vi.fn(() => ({
    version: vi.fn(() => ({
      stores: vi.fn(() => ({
        stores: vi.fn(() => ({}))
      }))
    })),
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(),
    transaction: vi.fn(() => ({
      objectStore: vi.fn(() => ({
        add: vi.fn(() => Promise.resolve()),
        get: vi.fn(() => Promise.resolve()),
        put: vi.fn(() => Promise.resolve()),
        delete: vi.fn(() => Promise.resolve()),
        clear: vi.fn(() => Promise.resolve()),
        count: vi.fn(() => Promise.resolve(0)),
        toArray: vi.fn(() => Promise.resolve([])),
        where: vi.fn(() => ({
          equals: vi.fn(() => ({
            toArray: vi.fn(() => Promise.resolve([])),
            first: vi.fn(() => Promise.resolve(undefined))
          })),
          belowOrEqual: vi.fn(() => ({
            toArray: vi.fn(() => Promise.resolve([]))
          })),
          between: vi.fn(() => ({
            toArray: vi.fn(() => Promise.resolve([]))
          }))
        })),
        filter: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([]))
        })),
        orderBy: vi.fn(() => ({
          reverse: vi.fn(() => ({
            toArray: vi.fn(() => Promise.resolve([]))
          })),
          toArray: vi.fn(() => Promise.resolve([]))
        }))
      }))
    }))
  }))
}))
