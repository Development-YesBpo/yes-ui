# Page component skeleton

Every page in a consumer app follows this shape.

```tsx
import { PageHeader } from '@yes/ui'
import { useAppToast } from '../lib/toast'

export function <Name>Page() {
  const toast = useAppToast()
  return (
    <div className="yes-stack yes-gap-6">
      <PageHeader
        title="<Title>"
        subtitle="<Subtitle>"
        actions={<>{/* action buttons */}</>}
      />
      {/* page body sections */}
    </div>
  )
}
```

## Rules

1. The root element of every page is a `<div>` with a layout utility class. Zero `style={{}}`.
2. Every page uses `PageHeader` for its top section (consistency).
3. Interactions that fire side effects go through `useAppToast()` from `lib/toast`.
4. State stays local (`useState` / `useReducer`) unless three or more sibling components need the same data — then lift to App.
