# Consumer app scaffold

Vite 6 + React 18 + TypeScript 5, file-linked to local `@yes/ui`. Matches the pattern proven in `~/Projects/4Yes/yes-ui-mock-app/`.

## Directory layout

```
<consumer-app>/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
├── README.md
├── .vscode/settings.json
└── src/
    ├── main.tsx                # imports tokens + layout CSS from @yes/ui (only place CSS is imported)
    ├── App.tsx                 # shell: Sidebar + page switcher
    ├── lib/
    │   ├── nav.ts              # nav items
    │   ├── toast.tsx           # ToastProvider context
    │   └── format.ts           # date/score formatters (one-off helpers — NOT in @yes/ui scope)
    ├── data/                   # mock data files mirroring real API shapes
    └── pages/                  # one file per route
```

## package.json template

```json
{
  "name": "<project>-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@yes/ui": "file:../yes-ui",
    "lucide-react": "^1.16.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.9.0",
    "vite": "^6.4.0"
  }
}
```

`lucide-react` is a peer of `@yes/ui` for icon props on `Sidebar.navItems` (the `NavItem.icon` field is typed `LucideIcon`).

## tsconfig.json template

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

## vite.config.ts template

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## index.html template

```html
<!DOCTYPE html>
<html lang="es-CO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><Project Name></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## src/main.tsx template (ONLY place CSS is imported)

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'

import '@yes/ui/tokens/primitives'
import '@yes/ui/tokens/default'
import '@yes/ui/styles/layout'

import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>)
```

## .vscode/settings.json (pin TS workspace)

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## .gitignore

```
node_modules/
dist/
*.log
.DS_Store
.vite/
```
