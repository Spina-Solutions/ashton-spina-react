# ashtonspina.com

Personal website and portfolio showcasing projects, travel photography, language learning, and professional experience.

🌐 **Live Site**: [ashtonspina.com](https://ashtonspina.com)

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Strict type safety throughout
- **Vike (formerly vite-plugin-ssr)** - File-system based SSR framework
- **Vite 7** - Next-generation build tooling
- **Tailwind CSS 4** - Utility-first CSS with custom dark mode
- **D3-Geo & TopoJSON** - Interactive world maps for travel/language visualization

### Backend & API
- **Hono** - Ultra-fast web framework (faster than Express)
- **TS-REST** - End-to-end typesafe REST APIs
- **Universal Middleware** - Framework-agnostic middleware layer
- **Node.js 20+** - Runtime environment

### Infrastructure (AWS)
- **AWS CDK** - Infrastructure as Code using TypeScript
- **CloudFront** - Global CDN distribution
- **Lambda@Edge** - Serverless compute for SSR
- **S3** - Static asset storage
- **Route53** - DNS management
- **ACM** - SSL/TLS certificates
- **Deployed to**: `eu-central-1` (primary), `us-east-1` (certificates)

### Development Tools
- **Vitest** - Fast unit testing framework
- **Prettier** - Code formatting
- **ESBuild** - Fast JavaScript bundler
- **Sentry** - Error tracking and monitoring
- **npm-run-all** - Task orchestration

## 📁 Project Structure

```
app/
├── assets/              # Images, videos, photography (274+ photos)
├── cdk/                 # AWS CDK infrastructure code
│   ├── bin/            # CDK app entry point
│   └── lib/            # Stack definitions
├── components/          # Reusable React components
│   ├── PhotoGallery.tsx
│   ├── TravelWorldMap.tsx
│   ├── UnifiedLanguageMap.tsx
│   └── ...
├── content/             # Static content & data
│   ├── experience.ts
│   ├── languages.ts
│   ├── spanish.ts
│   └── vocabGroups.ts
├── layouts/             # Page layouts
│   └── LayoutDefault.tsx
├── pages/               # File-system based routes
│   ├── index/          # Homepage
│   ├── media/          # Media showcase
│   ├── recommendations/ # Personal recommendations
│   └── archive/        # Archived content
├── server/              # Server-side handlers
│   ├── vike-handler.ts
│   └── ts-rest-handler.ts
├── tests/               # Unit tests
├── ts-rest/             # API contracts
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js** >= 20.19.0 (recommended: 22.12.0+)
- **npm** 10+
- AWS CLI configured (for deployments)

### Installation

```bash
cd app
npm install
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Building

```bash
npm run build
```

Outputs to `app/dist/` with both client and server bundles.

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
npm test
```

## 🌍 Deployment

The site is deployed to AWS using CDK:

```bash
# Build and deploy everything
npm run deploy:aws

# Or deploy CDK stacks only
npm run deploy:cdk-deploy-all
```

### Infrastructure Details

- **Domain**: ashtonspina.com (+ www subdomain)
- **Certificate**: ACM certificate in us-east-1 (required for CloudFront)
- **Primary Stack**: eu-central-1
- **Cross-region references** enabled for certificate sharing
- **SSR**: Lambda@Edge functions for server-side rendering

## ✨ Key Features

### Dual Mode Interface
- **Personal Mode** (default): Photos, travel, languages, recommendations
- **Work Mode** (`?mode=work`): Projects, experience, content, media, archive

### Interactive Components
- **Photo Gallery**: Grid-based photography showcase with 274+ images
- **Travel World Map**: D3-based visualization of countries visited
- **Language Learning Maps**: Interactive maps showing Spanish-speaking countries
- **Progress Dashboards**: Track language learning progress
- **Experience Timeline**: Professional work history
- **Dark Mode**: System-aware with manual toggle

### Performance
- Server-side rendering (SSR) for fast initial loads
- Static asset optimization
- Global CDN distribution via CloudFront
- Lazy-loaded images and components

## 🔧 Configuration

### Environment Variables
Required for production:
- `CDK_DEFAULT_ACCOUNT` - AWS account ID
- `CDK_DEFAULT_REGION` - AWS region (eu-central-1)

### Stack Configuration
Edit `app/cdk/bin/infrastructure.ts`:
- `domainName`: Your domain
- `subDomain`: Subdomain (e.g., "www")
- `certificate`: ACM certificate ARN
- `hostedZone`: Route53 hosted zone

### Tailwind Config
Located at `app/tailwind.config.js`:
- Dark mode: `class` based
- Content: All TS/TSX/JS/JSX files in `app/`

## 📊 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest tests |
| `npm run deploy:aws` | Build + deploy to AWS |
| `npm run deploy:cdk-deploy-all` | Deploy CDK stacks |
| `npm run cdk` | Run CDK commands |

## 🏗️ Architecture Highlights

### SSR with Vike
- File-system based routing
- Automatic code-splitting
- Pre-rendering for SEO
- Progressive enhancement

### Type-Safe APIs
- TS-REST for end-to-end type safety
- Shared contracts between client/server
- Runtime validation with Zod

### Component Organization
- Modular, reusable components
- Separation of concerns (data/logic/presentation)
- Custom hooks for state management
- Hierarchical directory structure

### Testing Strategy
- Vitest for unit tests
- Focus on complex logic functions
- Edge case validation
- Isolated, testable functions

## 📝 Development Philosophy

- **Small, focused files**: Logic separated into individual functions
- **Type safety first**: TypeScript strict mode throughout
- **Shared types**: Centralized type definitions in `types/` directory
- **Isolated functions**: Complex logic takes params, returns outputs
- **Comprehensive tests**: Main cases and edge cases covered
- **Hierarchical organization**: Clean directory structure

## 🔍 What Makes This Unique

- **Full-stack TypeScript**: From infrastructure to UI
- **Modern SSR**: Using cutting-edge Vike framework
- **AWS CDK**: Infrastructure defined in code, not YAML
- **International**: Multi-language support, travel content
- **Performance-focused**: Edge computing, CDN, optimization
- **Developer experience**: Fast builds, HMR, type safety

## 📚 Further Documentation

- [AGENTS.md](./AGENTS.md) - AI agent development guide
- [Vike Documentation](https://vike.dev)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Hono Documentation](https://hono.dev)

## 📞 Contact

Built by Ashton Spina - [ashtonspina.com](https://ashtonspina.com)

---

**Last Updated**: October 2025
