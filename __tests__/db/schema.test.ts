import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

beforeAll(async () => {
  // Run database migrations before tests
  try {
    execSync('npx prisma migrate dev --name init_test_schema', { stdio: 'inherit' })
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
})

afterAll(async () => {
  // Clean up after tests
  await prisma.$disconnect()
})

describe('Authentication Database Schema', () => {
  it('should create a user with required fields', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed_password_placeholder',
      }
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.createdAt).toBeDefined()
  })

  it('should prevent duplicate email addresses', async () => {
    await prisma.user.create({
      data: {
        email: 'unique@example.com',
        passwordHash: 'hashed_password_placeholder',
      }
    })

    await expect(prisma.user.create({
      data: {
        email: 'unique@example.com',
        passwordHash: 'another_hashed_password',
      }
    })).rejects.toThrow()
  })

  it('should create a saved job for a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'saveduser@example.com',
        passwordHash: 'hashed_password_placeholder',
      }
    })

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: 'job123',
        jobTitle: 'Software Engineer',
        companyName: 'Tech Corp'
      }
    })

    expect(savedJob).toBeDefined()
    expect(savedJob.jobTitle).toBe('Software Engineer')
  })
})