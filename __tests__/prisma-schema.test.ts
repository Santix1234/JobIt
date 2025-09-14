import { expect, describe, it } from 'vitest'
import { prisma } from '../lib/prisma/client'

describe('User Authentication Schema', () => {
  it('should have a valid User model', async () => {
    // Test user creation
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      }
    })

    expect(testUser).toBeDefined()
    expect(testUser.email).toBe('test@example.com')
    expect(testUser.username).toBe('testuser')
    expect(testUser.firstName).toBe('Test')
    expect(testUser.lastName).toBe('User')
    expect(testUser.role).toBe('USER')
    expect(testUser.isActive).toBe(true)

    // Clean up
    await prisma.user.delete({ where: { id: testUser.id } })
  })

  it('should enforce unique email constraint', async () => {
    // First user creation
    const firstUser = await prisma.user.create({
      data: {
        email: 'unique@example.com',
        password: 'hashedpassword123'
      }
    })

    // Attempt to create user with same email should throw
    await expect(
      prisma.user.create({
        data: {
          email: 'unique@example.com',
          password: 'anotherpassword'
        }
      })
    ).rejects.toThrow()

    // Clean up
    await prisma.user.delete({ where: { id: firstUser.id } })
  })

  it('should support saved jobs relation', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: 'savejobs@example.com',
        password: 'hashedpassword123',
        savedJobs: {
          create: [
            { jobId: 'job1' },
            { jobId: 'job2' }
          ]
        }
      },
      include: {
        savedJobs: true
      }
    })

    expect(testUser.savedJobs).toHaveLength(2)
    expect(testUser.savedJobs[0].jobId).toBe('job1')
    expect(testUser.savedJobs[1].jobId).toBe('job2')

    // Clean up
    await prisma.user.delete({ where: { id: testUser.id } })
  })
})