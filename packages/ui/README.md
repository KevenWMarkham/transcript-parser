# @transcript-parser/ui

Shared UI components for Transcript Parser, including both shadcn/ui base components and custom application-specific components.

## Installation

```bash
pnpm add @transcript-parser/ui
```

## Usage

```tsx
import { Button, Card, TranscriptList } from '@transcript-parser/ui';

function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
      <TranscriptList entries={[]} />
    </Card>
  );
}
```

## Components

### Base Components (shadcn/ui)
- `Button` - Button component with variants
- `Card` - Card container component
- `Dialog` - Modal dialog component
- `Input` - Text input component
- `Checkbox` - Checkbox component
- `Progress` - Progress bar component
- `Skeleton` - Loading skeleton component
- `Slider` - Range slider component
- `Textarea` - Multi-line text input
- `Toast` - Toast notification component
- `Badge` - Badge/tag component

### Custom Components
- `TranscriptList` - Virtual scrolling transcript list
- `TranscriptEntry` - Individual transcript entry
- `VideoPreview` - Video preview component
- `SpeakerAnalytics` - Speaker analytics dashboard
- `SpeakerSummary` - Speaker summary component
- `ExportDialog` - Export options dialog
- `UploadVideo` - Video upload component
- `ProcessingStatus` - Processing status indicator
- `TranscriptFilters` - Filter controls
- `TranscriptSearch` - Search functionality
- `ApiKeySettings` - API key configuration
- `UsageStats` - Usage statistics display

## Utilities
- `cn` - Class name utility (tailwind-merge + clsx)

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```
