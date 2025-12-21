import { describe, it, expect } from 'vitest'
import { users, llmUsage } from './schema'

describe('Database Schema', () => {
  describe('users table', () => {
    it('should export users table definition', () => {
      expect(users).toBeDefined()
      expect(users).toHaveProperty('_')
      expect(users).toHaveProperty('id')
      expect(users).toHaveProperty('name')
      expect(users).toHaveProperty('email')
      expect(users).toHaveProperty('createdAt')
    })

    it('should have correct table name', () => {
      expect(
        (users as Record<symbol, unknown>)[Symbol.for('drizzle:Name')]
      ).toBe('users')
    })

    it('should have id column', () => {
      expect(users.id).toBeDefined()
      expect(users.id.name).toBe('id')
    })

    it('should have name column', () => {
      expect(users.name).toBeDefined()
      expect(users.name.name).toBe('name')
    })

    it('should have email column', () => {
      expect(users.email).toBeDefined()
      expect(users.email.name).toBe('email')
    })

    it('should have createdAt column', () => {
      expect(users.createdAt).toBeDefined()
      expect(users.createdAt.name).toBe('created_at')
    })
  })

  describe('llmUsage table', () => {
    it('should export llmUsage table definition', () => {
      expect(llmUsage).toBeDefined()
      expect(llmUsage).toHaveProperty('_')
      expect(llmUsage).toHaveProperty('id')
      expect(llmUsage).toHaveProperty('userId')
      expect(llmUsage).toHaveProperty('model')
      expect(llmUsage).toHaveProperty('inputTokens')
      expect(llmUsage).toHaveProperty('outputTokens')
      expect(llmUsage).toHaveProperty('totalTokens')
      expect(llmUsage).toHaveProperty('estimatedCost')
      expect(llmUsage).toHaveProperty('operation')
      expect(llmUsage).toHaveProperty('metadata')
      expect(llmUsage).toHaveProperty('createdAt')
    })

    it('should have correct table name', () => {
      expect(
        (llmUsage as Record<symbol, unknown>)[Symbol.for('drizzle:Name')]
      ).toBe('llm_usage')
    })

    it('should have id column', () => {
      expect(llmUsage.id).toBeDefined()
      expect(llmUsage.id.name).toBe('id')
    })

    it('should have userId column with foreign key reference', () => {
      expect(llmUsage.userId).toBeDefined()
      expect(llmUsage.userId.name).toBe('user_id')
    })

    it('should have model column', () => {
      expect(llmUsage.model).toBeDefined()
      expect(llmUsage.model.name).toBe('model')
    })

    it('should have token tracking columns', () => {
      expect(llmUsage.inputTokens).toBeDefined()
      expect(llmUsage.inputTokens.name).toBe('input_tokens')

      expect(llmUsage.outputTokens).toBeDefined()
      expect(llmUsage.outputTokens.name).toBe('output_tokens')

      expect(llmUsage.totalTokens).toBeDefined()
      expect(llmUsage.totalTokens.name).toBe('total_tokens')
    })

    it('should have estimatedCost column', () => {
      expect(llmUsage.estimatedCost).toBeDefined()
      expect(llmUsage.estimatedCost.name).toBe('estimated_cost')
    })

    it('should have operation column', () => {
      expect(llmUsage.operation).toBeDefined()
      expect(llmUsage.operation.name).toBe('operation')
    })

    it('should have metadata column for JSON storage', () => {
      expect(llmUsage.metadata).toBeDefined()
      expect(llmUsage.metadata.name).toBe('metadata')
    })

    it('should have createdAt column', () => {
      expect(llmUsage.createdAt).toBeDefined()
      expect(llmUsage.createdAt.name).toBe('created_at')
    })
  })
})
