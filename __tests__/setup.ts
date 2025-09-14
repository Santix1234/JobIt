import { vi } from 'vitest'

// Mock environment variables and global configurations
vi.mock('next/config', () => ({
  __esModule: true,
  default: () => ({
    publicRuntimeConfig: {},
    serverRuntimeConfig: {}
  })
}))

// Add any global setup needed for tests
console.log('Test suite setup complete.')