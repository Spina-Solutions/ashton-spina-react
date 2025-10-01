# AI Agent Development Guide

This document provides context, conventions, and guidelines for AI agents working on this codebase.

## 🎯 Project Context

This is a personal website for Ashton Spina built with modern web technologies. It showcases:
- Professional projects and experience
- Travel photography (274+ images)
- Language learning progress (focus on Spanish)
- Personal recommendations
- Dual-mode interface (personal vs work)

## 🏗️ Architecture Overview

### Tech Stack Summary
- **Framework**: React 19 + Vike (SSR) + TypeScript
- **Styling**: Tailwind CSS 4 (class-based dark mode)
- **Build**: Vite 7 + ESBuild
- **Server**: Hono + Universal Middleware
- **API**: TS-REST (type-safe REST APIs)
- **Infrastructure**: AWS CDK (Lambda@Edge, CloudFront, S3, Route53)
- **Testing**: Vitest
- **Monitoring**: Sentry

### Directory Structure Pattern
```
app/
├── components/     # Reusable React components (presentation layer)
├── pages/          # File-system routes (Vike convention)
│   └── +Page.tsx   # Route component files
│   └── +data.ts    # Data fetching for routes
│   └── +config.ts  # Route configuration
├── layouts/        # Page layout wrappers
├── server/         # Server-side handlers
├── ts-rest/        # API contracts and definitions
├── types/          # Shared TypeScript types
├── utils/          # Pure utility functions
├── content/        # Static data and content
└── cdk/            # AWS infrastructure as code
```

## 📋 Code Style & Conventions

### General Principles
1. **Small, focused files**: Keep files under 200 lines when possible
2. **Separation of concerns**: Logic → Presentation → State
3. **Type safety first**: Always use TypeScript, avoid `any`
4. **Shared types**: Define types in `types/` directory, reuse everywhere
5. **Pure functions**: Complex logic should be isolated, testable functions
6. **Hierarchical organization**: Group related files in subdirectories

### File Organization Rules
- **Components**: One component per file, named exports for sub-components
- **Pages**: Follow Vike conventions (`+Page.tsx`, `+data.ts`, etc.)
- **Types**: Centralized in `types/` directory
- **Utils**: Pure functions, no side effects
- **Tests**: Co-located with complex logic in `tests/` directory

### Naming Conventions
- **Files**: PascalCase for components (`PhotoGallery.tsx`), kebab-case for configs
- **Components**: PascalCase (`function PhotoGallery()`)
- **Functions**: camelCase (`function calculateProgress()`)
- **Types**: PascalCase (`type LanguageProgress`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_PHOTOS = 100`)

### TypeScript Guidelines
```typescript
// ✅ DO: Define shared types
// types/language.ts
export type Language = {
  code: string;
  name: string;
  level: string;
};

// ✅ DO: Use strict typing
function processLanguages(languages: Language[]): ProcessedLanguage[] {
  return languages.map(lang => ({...}));
}

// ❌ DON'T: Use 'any'
function processData(data: any) { // Bad!
  // ...
}

// ✅ DO: Isolate complex logic
export function calculateLanguageProgress(
  startDate: Date,
  currentLevel: string,
  targetLevel: string
): ProgressMetrics {
  // Complex calculation logic
  return { percentage, daysRemaining, milestone };
}
```

### React Patterns
```typescript
// ✅ DO: Functional components with TypeScript
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);
  
  return (
    <div className="grid gap-4">
      {photos.map(photo => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}

// ✅ DO: Extract sub-components for clarity
function PhotoCard({ photo }: { photo: Photo }) {
  return <div>...</div>;
}

// ✅ DO: Use custom hooks for complex state
function usePhotoSelection(photos: Photo[]) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const selectNext = () => { /* logic */ };
  const selectPrev = () => { /* logic */ };
  return { selected, selectNext, selectPrev };
}
```

### Tailwind CSS Guidelines
```tsx
// ✅ DO: Use utility classes
<div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900">

// ✅ DO: Use dark mode variants
<p className="text-gray-900 dark:text-gray-100">

// ✅ DO: Organize classes logically (layout → spacing → colors → other)
<button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition">

// ❌ DON'T: Use inline styles (except for dynamic values)
<div style={{ color: 'blue' }}> // Use className instead!
```

## 🔧 Common Tasks

### Adding a New Page

1. Create directory in `app/pages/`:
```bash
app/pages/new-page/
├── +Page.tsx       # Main component
├── +config.ts      # Route config (optional)
└── +data.ts        # Data fetching (optional)
```

2. Implement the page:
```typescript
// +Page.tsx
export default function Page({ data }) {
  return <div>...</div>;
}

// +data.ts (if needed)
export async function data() {
  return { /* fetched data */ };
}
```

### Creating a Reusable Component

1. Create file in `app/components/`:
```typescript
// components/NewComponent.tsx
export function NewComponent({ prop1, prop2 }: NewComponentProps) {
  // Implementation
}

type NewComponentProps = {
  prop1: string;
  prop2: number;
};
```

2. If types are shared, move to `types/`:
```typescript
// types/newComponent.ts
export type NewComponentProps = {
  prop1: string;
  prop2: number;
};
```

### Adding a New API Endpoint

1. Define contract in `ts-rest/`:
```typescript
// ts-rest/contracts.ts
export const apiContract = initContract().router({
  newEndpoint: {
    method: 'GET',
    path: '/api/new-endpoint',
    responses: { 200: z.object({ data: z.string() }) },
  },
});
```

2. Implement handler in `server/ts-rest-handler.ts`

### Writing Tests

1. Create test file in `tests/`:
```typescript
// tests/calculateProgress.test.ts
import { describe, it, expect } from 'vitest';
import { calculateProgress } from '../utils/calculateProgress';

describe('calculateProgress', () => {
  it('should calculate correct percentage', () => {
    expect(calculateProgress(0, 100)).toBe(0);
  });
  
  it('should handle edge cases', () => {
    expect(calculateProgress(-1, 100)).toBe(0);
  });
});
```

2. Run tests: `npm test`

### Styling with Tailwind

1. Main CSS file: `app/layouts/tailwind.css`
```css
@config "../tailwind.config.js";
@import "tailwindcss";
```

2. Config: `app/tailwind.config.js`
```javascript
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}'],
};
```

## 🚨 Important Notes

### Things to NEVER Do
1. **Never deploy without user approval** - User has rule against auto-deployment
2. **Never delete the AWS stack** - User has explicit rule
3. **Never commit without user asking** - Let user control git workflow
4. **Never use `any` type** - Maintain type safety
5. **Never create large monolithic files** - Keep files small and focused
6. **Never skip tests for complex logic** - User values test coverage

### Things to ALWAYS Do
1. **Always define types** - Use TypeScript strictly
2. **Always separate logic** - Extract complex calculations
3. **Always test edge cases** - Write comprehensive tests
4. **Always use Tailwind** - No inline styles unless dynamic
5. **Always organize hierarchically** - Group related files
6. **Always check for linter errors** - Fix before finishing

## 🔍 Key Files to Know

### Configuration
- `app/package.json` - Dependencies and scripts
- `app/vite.config.ts` - Vite/build configuration
- `app/tsconfig.json` - TypeScript compiler options
- `app/tailwind.config.js` - Tailwind CSS configuration
- `app/cdk/bin/infrastructure.ts` - AWS infrastructure setup

### Entry Points
- `app/hono-entry.ts` - Server entry (dev/prod)
- `app/hono-entry.node.ts` - Node.js entry
- `app/entry_aws_lambda.ts` - Lambda entry
- `app/pages/+config.ts` - Global Vike config

### Core Components
- `app/layouts/LayoutDefault.tsx` - Main layout wrapper
- `app/components/PhotoGallery.tsx` - Photo display
- `app/components/TravelWorldMap.tsx` - D3 world map
- `app/components/UnifiedLanguageMap.tsx` - Language visualization

### Data Sources
- `app/content/experience.ts` - Work experience data
- `app/content/languages.ts` - Language learning data
- `app/content/spanish.ts` - Spanish vocabulary
- `app/content/media.ts` - Media appearances

## 🛠️ Development Workflow

### Standard Development Flow
1. **Understand requirement** - Read user request carefully
2. **Search codebase** - Use semantic search to understand context
3. **Create plan** - Use todo_write for complex tasks (3+ steps)
4. **Implement changes** - Make edits using proper tools
5. **Test changes** - Run relevant tests
6. **Check for errors** - Use read_lints if you edited files
7. **Verify** - Ensure all todos completed

### When Making Edits
```
1. Read existing code first (read_file)
2. Understand the pattern
3. Make minimal, focused changes
4. Maintain consistency with existing style
5. Update types if needed
6. Add tests for new logic
7. Check for linter errors
```

### Debugging Issues
1. Check browser console for client errors
2. Check server logs for SSR errors
3. Verify file paths (especially imports)
4. Check TypeScript compilation
5. Verify Tailwind classes are valid
6. Test in both light and dark mode

## 📦 Dependencies to Know

### Core Framework
- `vike` - SSR framework, file-system routing
- `vike-react` - React integration for Vike
- `react` & `react-dom` - UI library
- `hono` - Web server framework

### Utilities
- `@ts-rest/core` & `@ts-rest/serverless` - Type-safe APIs
- `@universal-middleware/hono` - Middleware adapter
- `zod` - Runtime validation (v3, not v4 - peer dep conflict)

### UI & Visualization
- `d3-geo` - Geographic projections
- `topojson-client` - TopoJSON parsing
- `world-atlas` - World map data

### Development
- `vitest` - Testing framework
- `@vitejs/plugin-react` - Vite React plugin
- `@tailwindcss/vite` - Tailwind integration
- `tsx` - TypeScript execution

### Infrastructure
- `aws-cdk-lib` - AWS CDK library
- `constructs` - CDK constructs
- `esbuild` - JavaScript bundler

## 🌐 Deployment Context

### AWS Stack Details
- **Region**: Primary in `eu-central-1`, certificates in `us-east-1`
- **Domain**: ashtonspina.com (+ www)
- **CDN**: CloudFront distribution
- **Compute**: Lambda@Edge for SSR
- **Storage**: S3 for static assets
- **DNS**: Route53 hosted zone

### Build Process
1. `npm run build` - Vite builds client + server bundles
2. CDK synthesizes CloudFormation templates
3. Assets uploaded to S3
4. Lambda functions deployed to edge
5. CloudFront distribution updated
6. DNS records configured

### Environment
- **Node Version**: 20.19.0+ required (some packages want 22.12.0+)
- **Package Manager**: npm (not yarn/pnpm)
- **Module System**: ES Modules (`"type": "module"`)

## 🎨 Design Patterns Used

### Mode Switching
The site has dual modes based on URL parameter `?mode=work`:
- **Personal Mode** (default): Photos, travel, languages
- **Work Mode**: Projects, experience, content

Check mode with:
```typescript
const urlParams = new URLSearchParams(window.location.search);
const isWorkMode = urlParams.get('mode') === 'work';
```

### Dark Mode
- Class-based: `dark:` variant in Tailwind
- Toggled via `ThemeToggle` component
- Persisted to localStorage
- System-aware by default

### State Management
- React `useState` for local state
- URL parameters for global state (mode, selected items)
- No Redux/Zustand - keep it simple

### Data Fetching
- Static data from `content/` directory
- API calls via TS-REST
- SSR data fetching in `+data.ts` files

## 📈 Performance Considerations

- **Images**: Lazy loading for photography
- **Code Splitting**: Automatic via Vike
- **SSR**: Fast initial loads, SEO-friendly
- **CDN**: Global edge distribution
- **Bundling**: Vite + ESBuild for speed

## 🧪 Testing Philosophy

User values:
1. **Testing complex logic** - Mathematical calculations, data transformations
2. **Edge case coverage** - Boundary conditions, error states
3. **Isolated functions** - Pure functions that are easy to test
4. **Not everything needs tests** - Simple presentational components can skip

## 🤝 Communication Style

When interacting with the user:
- **Be concise** - No unnecessary verbosity
- **Show, don't tell** - Make changes rather than describing
- **Use tools effectively** - Parallel calls when possible
- **Check your work** - Verify no linter errors
- **Be thorough** - Complete all steps before responding

## 🔄 Common Patterns

### Component Pattern
```typescript
// Presentation component
export function Feature({ data }: FeatureProps) {
  const processed = useProcessedData(data);
  return <FeatureUI processed={processed} />;
}

// Logic hook
function useProcessedData(data: RawData): ProcessedData {
  // Complex processing
  return processed;
}

// UI sub-component
function FeatureUI({ processed }: { processed: ProcessedData }) {
  return <div>...</div>;
}

// Types
type FeatureProps = { data: RawData };
type RawData = { /* ... */ };
type ProcessedData = { /* ... */ };
```

## 🚀 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `cd app && npm run dev` |
| Run tests | `cd app && npm test` |
| Build production | `cd app && npm run build` |
| Preview prod build | `cd app && npm run preview` |
| Deploy to AWS | `cd app && npm run deploy:aws` |
| Format code | `npx prettier --write .` |
| Type check | `tsc --noEmit` |

## 📝 Recent Updates (October 2025)

- All dependencies updated to latest versions
- Tailwind CSS path fixed (`layouts/tailwind.css`)
- Zod kept at v3 for TS-REST compatibility
- Node version warnings (need 20.19.0+)

---

**For Agents**: This project values clean code, type safety, small files, comprehensive tests, and user control. Always ask before deploying or making destructive changes. Focus on making the code better, not just functional.

