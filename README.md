# MCP Electron

This is an Electron application built with React, Vite, and TypeScript.

## Icon Optimization

This project implements an optimized approach for using Tabler icons with on-demand loading, which significantly reduces bundle size and improves performance.

### Implementation Details

1. We use `@iconify/react` for on-demand icon loading
2. The custom `Icon` component (`src/ui/components/Icon.tsx`) provides a simple interface for loading Tabler icons
3. Icons are loaded dynamically and only when needed, rather than importing the entire icon library
4. Code splitting is configured to optimize bundle size

### Usage

Instead of importing icons directly from `@tabler/icons-react`:

```tsx
// Old approach (imports entire icon bundle)
import { IconSend, IconAlertCircle } from "@tabler/icons-react";

// Usage
<IconSend size={18} />;
```

Use the custom Icon component:

```tsx
// New optimized approach (on-demand loading)
import Icon from "../components/Icon";

// Usage
<Icon icon="Send" size={18} />;
```

### Benefits

- **Smaller bundle size**: Only loads the icons that are actually used
- **Improved performance**: Reduces initial load time
- **Simplified API**: Consistent interface for all icons
- **Code splitting**: Icons are loaded in separate chunks

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Distribution

```bash
# Build for macOS
npm run dist:mac

# Build for Linux
npm run dist:linux

# Build for Windows
npm run dist:win
```
