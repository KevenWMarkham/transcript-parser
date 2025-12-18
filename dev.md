# Transcript Parser - Development Setup

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git (for version control and Husky git hooks)

## Setup Tasks

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.5
- Tailwind CSS 3 (utility-first CSS framework)
- shadcn/ui (re-usable component library)
- Drizzle ORM 0.45.1 (database toolkit)
- Jest 30.2.0 (testing framework)
- ESLint 9 with Prettier integration
- Husky (git hooks)
- Commitizen & Commitlint (conventional commits)
- React type definitions and testing libraries

### 2. Start Development Server

```bash
npm run dev
```

This starts the Vite development server with Hot Module Replacement (HMR).
The app will be available at `http://localhost:5173` (or the next available port).

### 3. Build for Production

```bash
npm run build
```

This command:

1. Runs TypeScript compiler (`tsc -b`) to check types
2. Creates an optimized production build in the `dist` folder

### 4. Preview Production Build

```bash
npm run preview
```

Locally preview the production build before deploying.

### 5. Run Tests

```bash
npm test
```

Runs Jest test suite. For watch mode or coverage:

```bash
npm run test:watch      # Watch mode for development
npm run test:coverage   # Generate coverage report
```

### 6. Run Linter

```bash
npm run lint
```

Runs ESLint to check for code quality issues and enforce coding standards.

```bash
npm run lint:fix        # Auto-fix linting issues
```

### 7. Format Code

```bash
npm run format
```

Formats all code using Prettier. To check formatting without changing files:

```bash
npm run format:check
```

### 8. Database Operations (Drizzle ORM)

```bash
npm run db:generate     # Generate SQL migrations from schema
npm run db:push         # Push schema changes directly to DB
npm run db:studio       # Open Drizzle Studio (visual DB editor)
```

## Project Structure

```
transcript-parser/
├── .husky/                 # Git hooks configuration
│   ├── pre-commit          # Pre-commit hook (runs lint-staged)
│   └── commit-msg          # Commit-msg hook (validates commit format)
├── src/
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   │       └── button.tsx  # Button component
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # cn() for class merging
│   ├── db/                 # Database layer
│   │   ├── schema.ts       # Drizzle ORM schema definitions
│   │   └── index.ts        # Database connection setup
│   ├── App.tsx             # Main application component
│   ├── App.test.tsx        # App component tests
│   ├── App.css             # App-specific styles
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles with Tailwind
│   └── vite-env.d.ts       # Vite type definitions
├── drizzle/                # Generated migrations (auto-created)
├── public/                 # Static assets
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── components.json         # shadcn/ui configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── jest.config.ts          # Jest testing configuration
├── jest.setup.ts           # Jest setup file
├── commitlint.config.js    # Commit message linting rules
├── tsconfig.json           # TypeScript base config
├── tsconfig.app.json       # TypeScript app config
├── tsconfig.node.json      # TypeScript Node config
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Prettier ignore patterns
├── package.json            # Project dependencies and scripts
└── .gitignore              # Git ignore rules
```

## Development Workflow

1. Make changes to files in the `src/` directory
2. The dev server will automatically reload with your changes (HMR)
3. TypeScript will provide type checking in your editor
4. Write tests for new components and features
5. Run `npm test` to ensure tests pass
6. Run `npm run lint` periodically to catch code quality issues
7. Run `npm run format` to format your code
8. Stage your changes with `git add`
9. Commit using `npm run commit` (recommended) or `git commit`

## Committing Code

This project enforces **Conventional Commits** to maintain clean git history.

### Option 1: Using Commitizen (Recommended)

```bash
git add .
npm run commit
```

This launches an interactive prompt that guides you through creating a properly formatted commit message.

### Option 2: Manual Commit

```bash
git add .
git commit -m "type(scope): subject"
```

#### Commit Message Format

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

#### Allowed Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools
- **ci**: CI/CD changes
- **build**: Changes affecting build system or dependencies
- **revert**: Reverts a previous commit

#### Examples

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(api): resolve null pointer in user endpoint"
git commit -m "docs: update README with installation steps"
git commit -m "test(utils): add unit tests for date formatter"
```

### Automated Checks on Commit

When you commit, Husky runs these hooks automatically:

1. **Pre-commit Hook** (`.husky/pre-commit`):
   - Runs `lint-staged`
   - Lints and auto-fixes TypeScript/TSX files with ESLint
   - Formats all staged files with Prettier
   - Only processes staged files for faster commits

2. **Commit-msg Hook** (`.husky/commit-msg`):
   - Validates commit message format
   - Ensures message follows Conventional Commits standard
   - Rejects commits with invalid format

If any hook fails, the commit will be rejected. Fix the issues and try again.

## Tech Stack

- **React 18.3**: UI library
- **TypeScript 5.6**: Type-safe JavaScript
- **Vite 6**: Fast build tool and dev server
- **Tailwind CSS 3**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **Drizzle ORM 0.45**: TypeScript ORM for SQL databases
- **Jest 30**: Testing framework with React Testing Library
- **ESLint 9**: Code linting and quality
- **Prettier 3**: Code formatting
- **Husky 9**: Git hooks for pre-commit checks
- **Commitizen**: Interactive commit message tool
- **Commitlint**: Commit message validation
- **lint-staged**: Run linters on staged files only

## Tailwind CSS & shadcn/ui

This project uses Tailwind CSS for styling and shadcn/ui for pre-built, customizable components.

### Tailwind CSS

Tailwind CSS is configured and ready to use. Style your components using utility classes:

```tsx
<div className="flex items-center justify-center p-4 bg-background">
  <h1 className="text-4xl font-bold text-foreground">Hello World</h1>
</div>
```

**Configuration files:**

- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [postcss.config.js](postcss.config.js) - PostCSS configuration
- [src/index.css](src/index.css) - Global styles with Tailwind directives

**Theme customization:**
The project uses CSS variables for theming (light/dark mode support). Customize colors in [src/index.css](src/index.css).

### shadcn/ui Components

shadcn/ui components are pre-configured and ready to use. Components are added to your project (not installed as dependencies).

**Adding new components:**

You can manually add components or use the CLI (if available):

```bash
# Example: manually create components in src/components/ui/
# See https://ui.shadcn.com for component code
```

**Available components:**

- Button - [src/components/ui/button.tsx](src/components/ui/button.tsx)

**Using components:**

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

**Path aliases:**
The project uses `@/*` aliases for imports:

- `@/components` → `src/components`
- `@/lib` → `src/lib`

**Utility function:**

- [src/lib/utils.ts](src/lib/utils.ts) - `cn()` function for merging Tailwind classes

### Adding More Components

Visit [ui.shadcn.com](https://ui.shadcn.com) and copy component code into `src/components/ui/`.

Popular components to add:

- Card, Dialog, Dropdown Menu, Input, Label, Select, Textarea, Toast, etc.

## Drizzle ORM

Drizzle ORM is configured for SQLite by default. To use it:

### 1. Define Your Schema

Edit [src/db/schema.ts](src/db/schema.ts) to define your database tables:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})
```

### 2. Set Up Database Connection

Uncomment and configure the database driver in [src/db/index.ts](src/db/index.ts):

```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema })
```

Note: Install the driver first: `npm install better-sqlite3`

### 3. Generate Migrations

```bash
npm run db:generate     # Creates migration files in drizzle/
```

### 4. Push Changes to Database

```bash
npm run db:push         # Applies schema directly (dev mode)
```

### 5. Visual Database Editor

```bash
npm run db:studio       # Opens Drizzle Studio at localhost
```

### Switching Databases

- **PostgreSQL**: Change `dialect` to `'postgresql'` in [drizzle.config.ts](drizzle.config.ts)
- **MySQL**: Change `dialect` to `'mysql'` in [drizzle.config.ts](drizzle.config.ts)

See the [Drizzle ORM docs](https://orm.drizzle.team/docs/overview) for more information.

## Testing

Tests are written using Jest and React Testing Library:

- Test files should be named `*.test.tsx` or `*.test.ts`
- Place tests next to the components they test
- Use `@testing-library/react` for component testing
- Use `@testing-library/user-event` for simulating user interactions
- Example test: [src/App.test.tsx](src/App.test.tsx)

## Code Quality

### ESLint

- Configured with TypeScript support
- React Hooks rules enforced
- Prettier integration to avoid conflicts
- Auto-fix available with `npm run lint:fix`

### Prettier

- Configured in [.prettierrc](.prettierrc)
- Settings: single quotes, no semicolons, 2-space tabs
- Auto-format with `npm run format`

## Next Steps

- Modify [src/App.tsx](src/App.tsx) to start building your application
- Set up your database schema in [src/db/schema.ts](src/db/schema.ts)
- Install a database driver (e.g., `npm install better-sqlite3` for SQLite)
- Add new components in the `src/` directory with corresponding test files
- Update [index.html](index.html) to change the page title or metadata
- Configure [vite.config.ts](vite.config.ts) for additional build options
- Customize [.prettierrc](.prettierrc) for your preferred code style
- Add more ESLint rules in [eslint.config.js](eslint.config.js) as needed
- Use `npm run commit` for creating conventional commits
