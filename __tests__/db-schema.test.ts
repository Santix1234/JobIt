import { expect, describe, it } from 'vitest'
import { prisma } from '../lib/db/prisma'

describe('Authentication Database Schema', () => {
  it('should create a user with valid data', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      }
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.username).toBe('testuser')
  })

  it('should prevent duplicate email', async () => {
    await prisma.user.create({
      data: {
        email: 'unique@example.com',
        password: 'hashedpassword123',
        username: 'uniqueuser'
      }
    })

    await expect(prisma.user.create({
      data: {
        email: 'unique@example.com',
        password: 'anotherpassword',
        username: 'differentuser'
      }
    })).rejects.toThrow()
  })

  it('should save a job for a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'jobsaver@example.com',
        password: 'hashedpassword123',
        username: 'jobsaver'
      }
    })

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: 'job123'
      }
    })

    expect(savedJob).toBeDefined()
    expect(savedJob.userId).toBe(user.id)
  })
})