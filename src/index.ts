/**
 * @yes/ui — Public API
 *
 * Import components from this barrel.
 * Import token CSS files separately:
 *   import '@yes/ui/tokens/primitives'
 *   import '@yes/ui/tokens/default'
 *   import '@yes/ui/tokens/themes/dark'  // optional
 *
 * Components are added here as they are built.
 * Each export must have a corresponding test and story file.
 */

// ─── Types ────────────────────────────────────────────────────
export type { Tone, Size, StatusVariant, BaseProps, FieldProps } from './types/shared'

// ─── Hooks (public) ───────────────────────────────────────────
export { useId } from './hooks/useId'
export { useFocusTrap } from './hooks/useFocusTrap'
export { useControllable } from './hooks/useControllable'

// ─── Utils (public) ───────────────────────────────────────────
export { cn } from './utils/cn'

// ─── Components ───────────────────────────────────────────────
// Uncomment as components are implemented:
export { Icon } from './components/Icon'
// export { Button } from './components/Button'
// export { Badge } from './components/Badge'
// export { Input } from './components/Input'
// export { Select } from './components/Select'
// export { Textarea } from './components/Textarea'
// export { Checkbox } from './components/Checkbox'
// export { Toggle } from './components/Toggle'
// export { Modal } from './components/Modal'
// export { Drawer } from './components/Drawer'
// export { Spinner } from './components/Spinner'
// export { Toast, ToastContainer } from './components/Toast'
// export { Alert } from './components/Alert'
// export { Badge } from './components/Badge'
// export { Tooltip } from './components/Tooltip'
// export { Tabs } from './components/Tabs'
// export { Accordion } from './components/Accordion'
// export { Card } from './components/Card'
// export { KPICard } from './components/KPICard'
// export { Sidebar } from './components/Sidebar'
// export { Avatar } from './components/Avatar'
// export { EmptyState } from './components/EmptyState'
// export { SkeletonLoader } from './components/SkeletonLoader'
// export { ProgressBar } from './components/ProgressBar'
// export { Pagination } from './components/Pagination'
// export { FilterBar, FilterChip } from './components/FilterBar'
// export { DataTable } from './components/DataTable'
// export { MessageBubble } from './components/MessageBubble'
// export { MessageComposer } from './components/MessageComposer'
// export { ChannelBadge } from './components/ChannelBadge'
// export { AgentStatusIndicator } from './components/AgentStatusIndicator'
// export { FileDropZone } from './components/FileDropZone'
// export { TagInput } from './components/TagInput'
// export { RichTextEditor } from './components/RichTextEditor'
// export { YesUIProvider } from './components/YesUIProvider'
