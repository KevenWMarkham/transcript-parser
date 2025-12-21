import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ModuleRegistry, createModule, type ModuleDefinition } from './index'

// Mock module for testing
const mockModule: ModuleDefinition = {
  metadata: {
    id: 'test-module',
    name: 'Test Module',
    description: 'A test module',
    icon: '🧪',
    version: '1.0.0',
    author: 'Test Author',
    category: 'other',
    tags: ['test', 'demo'],
    isPremium: false,
  },
  fields: [
    {
      key: 'test-field',
      label: 'Test Field',
      type: 'text',
      required: true,
      placeholder: 'Enter test value',
    },
  ],
}

const secondModule: ModuleDefinition = {
  metadata: {
    id: 'second-module',
    name: 'Second Module',
    description: 'Another test module',
    icon: '🎯',
    version: '1.0.0',
    author: 'Test Author',
    category: 'education',
  },
  fields: [],
}

describe('ModuleRegistry', () => {
  beforeEach(() => {
    // Clear registry before each test
    ;(
      ModuleRegistry as unknown as { modules: Map<string, unknown> }
    ).modules.clear()
  })

  describe('register', () => {
    it('should register a new module', () => {
      ModuleRegistry.register(mockModule)

      expect(ModuleRegistry.has('test-module')).toBe(true)
      expect(ModuleRegistry.get('test-module')).toEqual(mockModule)
    })

    it('should call onActivate hook when registering', () => {
      const onActivate = vi.fn()
      const moduleWithHook: ModuleDefinition = {
        ...mockModule,
        hooks: { onActivate },
      }

      ModuleRegistry.register(moduleWithHook)

      expect(onActivate).toHaveBeenCalledOnce()
    })

    it('should warn when overwriting an existing module', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      ModuleRegistry.register(mockModule)
      ModuleRegistry.register(mockModule)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-module is already registered')
      )

      consoleWarnSpy.mockRestore()
    })

    it('should overwrite existing module when re-registered', () => {
      ModuleRegistry.register(mockModule)

      const updatedModule: ModuleDefinition = {
        ...mockModule,
        metadata: {
          ...mockModule.metadata,
          version: '2.0.0',
        },
      }

      ModuleRegistry.register(updatedModule)

      const retrieved = ModuleRegistry.get('test-module')
      expect(retrieved?.metadata.version).toBe('2.0.0')
    })
  })

  describe('unregister', () => {
    it('should unregister a module', () => {
      ModuleRegistry.register(mockModule)
      expect(ModuleRegistry.has('test-module')).toBe(true)

      ModuleRegistry.unregister('test-module')

      expect(ModuleRegistry.has('test-module')).toBe(false)
      expect(ModuleRegistry.get('test-module')).toBeUndefined()
    })

    it('should call onDeactivate hook when unregistering', () => {
      const onDeactivate = vi.fn()
      const moduleWithHook: ModuleDefinition = {
        ...mockModule,
        hooks: { onDeactivate },
      }

      ModuleRegistry.register(moduleWithHook)
      ModuleRegistry.unregister('test-module')

      expect(onDeactivate).toHaveBeenCalledOnce()
    })

    it('should handle unregistering non-existent module gracefully', () => {
      // Should not throw
      expect(() => ModuleRegistry.unregister('non-existent')).not.toThrow()
    })
  })

  describe('get', () => {
    it('should retrieve a registered module', () => {
      ModuleRegistry.register(mockModule)

      const retrieved = ModuleRegistry.get('test-module')

      expect(retrieved).toEqual(mockModule)
    })

    it('should return undefined for non-existent module', () => {
      const retrieved = ModuleRegistry.get('non-existent')

      expect(retrieved).toBeUndefined()
    })
  })

  describe('getAll', () => {
    it('should return all registered modules', () => {
      ModuleRegistry.register(mockModule)
      ModuleRegistry.register(secondModule)

      const all = ModuleRegistry.getAll()

      expect(all).toHaveLength(2)
      expect(all).toContainEqual(mockModule)
      expect(all).toContainEqual(secondModule)
    })

    it('should return empty array when no modules registered', () => {
      const all = ModuleRegistry.getAll()

      expect(all).toEqual([])
    })
  })

  describe('getByCategory', () => {
    it('should filter modules by category', () => {
      ModuleRegistry.register(mockModule)
      ModuleRegistry.register(secondModule)

      const educationModules = ModuleRegistry.getByCategory('education')

      expect(educationModules).toHaveLength(1)
      expect(educationModules[0].metadata.id).toBe('second-module')
    })

    it('should return empty array when no modules match category', () => {
      ModuleRegistry.register(mockModule)

      const businessModules = ModuleRegistry.getByCategory('business')

      expect(businessModules).toEqual([])
    })

    it('should handle multiple modules in same category', () => {
      const thirdModule: ModuleDefinition = {
        ...mockModule,
        metadata: {
          ...mockModule.metadata,
          id: 'third-module',
          category: 'education',
        },
      }

      ModuleRegistry.register(secondModule)
      ModuleRegistry.register(thirdModule)

      const educationModules = ModuleRegistry.getByCategory('education')

      expect(educationModules).toHaveLength(2)
    })
  })

  describe('has', () => {
    it('should return true for registered module', () => {
      ModuleRegistry.register(mockModule)

      expect(ModuleRegistry.has('test-module')).toBe(true)
    })

    it('should return false for non-registered module', () => {
      expect(ModuleRegistry.has('non-existent')).toBe(false)
    })

    it('should return false after unregistering', () => {
      ModuleRegistry.register(mockModule)
      ModuleRegistry.unregister('test-module')

      expect(ModuleRegistry.has('test-module')).toBe(false)
    })
  })

  describe('lifecycle hooks', () => {
    it('should support async onActivate hook', async () => {
      const onActivate = vi.fn().mockResolvedValue(undefined)
      const moduleWithAsyncHook: ModuleDefinition = {
        ...mockModule,
        hooks: { onActivate },
      }

      ModuleRegistry.register(moduleWithAsyncHook)

      // Wait for async hook to complete
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(onActivate).toHaveBeenCalled()
    })

    it('should support async onDeactivate hook', async () => {
      const onDeactivate = vi.fn().mockResolvedValue(undefined)
      const moduleWithAsyncHook: ModuleDefinition = {
        ...mockModule,
        hooks: { onDeactivate },
      }

      ModuleRegistry.register(moduleWithAsyncHook)
      ModuleRegistry.unregister('test-module')

      // Wait for async hook to complete
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(onDeactivate).toHaveBeenCalled()
    })
  })
})

describe('createModule', () => {
  it('should create a module definition', () => {
    const module = createModule(mockModule)

    expect(module).toEqual(mockModule)
  })

  it('should preserve all module properties', () => {
    const complexModule: ModuleDefinition = {
      ...mockModule,
      templates: [
        {
          id: 'template-1',
          name: 'Template 1',
          description: 'A test template',
          defaultValues: { field1: 'value1' },
        },
      ],
      actions: [
        {
          id: 'action-1',
          label: 'Test Action',
          placement: 'toolbar',
          handler: () => {},
        },
      ],
      settings: [
        {
          key: 'setting-1',
          label: 'Setting 1',
          type: 'boolean',
          defaultValue: true,
        },
      ],
    }

    const created = createModule(complexModule)

    expect(created.templates).toEqual(complexModule.templates)
    expect(created.actions).toEqual(complexModule.actions)
    expect(created.settings).toEqual(complexModule.settings)
  })
})

describe('ModuleFieldSchema', () => {
  it('should support all field types', () => {
    const module: ModuleDefinition = {
      ...mockModule,
      fields: [
        { key: 'text', label: 'Text', type: 'text' },
        { key: 'number', label: 'Number', type: 'number' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'select', label: 'Select', type: 'select', options: [] },
        {
          key: 'multiselect',
          label: 'Multi',
          type: 'multiselect',
          options: [],
        },
        { key: 'textarea', label: 'Textarea', type: 'textarea' },
        { key: 'boolean', label: 'Boolean', type: 'boolean' },
        { key: 'url', label: 'URL', type: 'url' },
      ],
    }

    expect(module.fields).toHaveLength(8)
    expect(module.fields.map(f => f.type)).toEqual([
      'text',
      'number',
      'date',
      'select',
      'multiselect',
      'textarea',
      'boolean',
      'url',
    ])
  })

  it('should support field validation', () => {
    const fieldWithValidation = {
      key: 'age',
      label: 'Age',
      type: 'number' as const,
      validation: {
        min: 0,
        max: 120,
        message: 'Age must be between 0 and 120',
      },
    }

    expect(fieldWithValidation.validation?.min).toBe(0)
    expect(fieldWithValidation.validation?.max).toBe(120)
  })

  it('should support default values', () => {
    const fieldWithDefault = {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    }

    expect(fieldWithDefault.defaultValue).toBe('active')
  })
})
