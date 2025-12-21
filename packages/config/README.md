# @transcript-parser/config

Shared configuration files for Transcript Parser monorepo (ESLint, TypeScript, Tailwind, PostCSS).

## Installation

```bash
pnpm add -D @transcript-parser/config
```

## Usage

### ESLint Configuration

```javascript
// eslint.config.js
import baseConfig from '@transcript-parser/config/eslint'

export default [
  ...baseConfig,
  // Your custom rules
]
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "@transcript-parser/config/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
import baseConfig from '@transcript-parser/config/tailwind'

export default {
  ...baseConfig,
  content: [
    './src/**/*.{ts,tsx}',
    // Add your paths
  ],
}
```

### PostCSS Configuration

```javascript
// postcss.config.js
import config from '@transcript-parser/config/postcss'

export default config
```

## Included Configurations

### ESLint

- React and React Hooks rules
- TypeScript integration
- Prettier integration
- **Accessibility rules** (eslint-plugin-jsx-a11y)
- Import sorting and organization

### TypeScript

- Modern ES2020 target
- Strict type checking
- Bundler module resolution
- JSX support for React
- Declaration file generation

### Tailwind CSS

- Custom color palette
- Design system tokens
- Animation utilities
- Plugin configurations

### PostCSS

- Tailwind CSS processing
- Autoprefixer
- Modern CSS features

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```

## Included Dependencies

- `eslint` and plugins (React, TypeScript, a11y, Prettier)
- `typescript`
- `tailwindcss`
- `postcss` and plugins

## Benefits

- **Consistency**: Same linting and formatting across all packages
- **Accessibility**: Built-in a11y rules enforce WCAG standards
- **Type Safety**: Strict TypeScript configuration
- **Developer Experience**: Prettier integration for automatic formatting
