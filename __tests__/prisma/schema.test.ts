import { describe, it, expect } from 'vitest'
import { prisma } from '../../lib/prisma/client'

describe('Database Schema', () => {
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

  it('should prevent duplicate email creation', async () => {
    await prisma.user.create({
      data: {
        email: 'unique@example.com',
        password: 'hashedpassword123'
      }
    })

    await expect(prisma.user.create({
      data: {
        email: 'unique@example.com',
        password: 'anotherpassword'
      }
    })).rejects.toThrow()
  })

  it('should create a saved job for a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'jobseeker@example.com',
        password: 'hashedpassword123'
      }
    })

    const savedJob = await prisma.savedJob.create({
      data: {
        jobId: 'job123',
        title: 'Software Engineer',
        company: 'Tech Corp',
        userId: user.id
      }
    })

    expect(savedJob).toBeDefined()
    expect(savedJob.userId).toBe(user.id)
  })
})