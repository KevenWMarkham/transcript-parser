# @transcript-parser/module-sdk

SDK for creating snap-in modules that extend Transcript Parser functionality.

## Installation

```bash
pnpm add @transcript-parser/module-sdk
```

## Quick Start

### Creating a Module

```typescript
import { ModuleDefinition } from '@transcript-parser/module-sdk';
import type { TranscriptData } from '@transcript-parser/types';

export const myModule: ModuleDefinition = {
  id: 'my-custom-module',
  name: 'My Custom Module',
  version: '1.0.0',
  description: 'Process transcripts for my use case',

  // Process transcript data
  process: async (transcript: TranscriptData, context) => {
    // Your custom processing logic
    const processed = await myProcessingFunction(transcript);
    return processed;
  },

  // Optional: Custom UI component
  component: ({ transcript, onUpdate }) => {
    return (
      <div>
        <h2>My Module UI</h2>
        {/* Your custom UI */}
      </div>
    );
  },

  // Optional: Settings UI
  settingsComponent: ({ config, onConfigChange }) => {
    return (
      <div>
        {/* Your settings UI */}
      </div>
    );
  },
};
```

### Registering a Module

```typescript
import { ModuleRegistry } from '@transcript-parser/module-sdk'
import { myModule } from './my-module'

const registry = ModuleRegistry.getInstance()
registry.register(myModule)
```

### Using Modules

```typescript
// Get all registered modules
const modules = registry.getAllModules()

// Get specific module
const module = registry.getModule('my-custom-module')

// Process transcript with module
if (module) {
  const result = await module.process(transcriptData, context)
}
```

## Module Definition Interface

```typescript
interface ModuleDefinition {
  // Required fields
  id: string
  name: string
  version: string
  description: string

  // Processing function
  process: (
    transcript: TranscriptData,
    context: ModuleContext
  ) => Promise<TranscriptData>

  // Optional UI components
  component?: React.FC<ModuleComponentProps>
  settingsComponent?: React.FC<ModuleSettingsProps>

  // Optional metadata
  author?: string
  icon?: string
  tags?: string[]
}
```

## Example Modules

### Real Estate Module

See `modules/real-estate/` for a complete example that:

- Extracts property details from transcripts
- Identifies key information (price, location, features)
- Provides custom UI for viewing extracted data

### Creating Your Own Module

1. **Define your module** with a unique ID
2. **Implement the process function** to transform transcript data
3. **Add optional UI components** for display and settings
4. **Register your module** with the ModuleRegistry
5. **Test your module** with sample transcripts

## Module Context

The `ModuleContext` object provides:

```typescript
interface ModuleContext {
  // User information
  user?: {
    id: number
    name: string
    email: string
  }

  // Application state
  appVersion: string

  // Utility functions
  showToast: (message: string) => void
  updateProgress: (progress: number) => void
}
```

## Best Practices

1. **Use unique IDs**: Ensure your module ID is unique to avoid conflicts
2. **Handle errors gracefully**: Always catch and handle errors in your process function
3. **Validate input**: Check transcript data before processing
4. **Provide feedback**: Use context.showToast and context.updateProgress
5. **Document your module**: Include clear descriptions and examples
6. **Test thoroughly**: Test with various transcript formats and edge cases

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```

## Security Considerations

- **Validate all inputs**: Never trust transcript data without validation
- **Avoid eval()**: Do not execute arbitrary code from transcripts
- **Sanitize outputs**: Clean any data before displaying in UI
- **Respect privacy**: Don't send transcript data to external servers without consent
- **Limit permissions**: Request only the permissions your module needs

## Future Enhancements

- Module marketplace
- Hot-reloading for development
- Module dependencies
- Shared module utilities
- Testing framework for modules
