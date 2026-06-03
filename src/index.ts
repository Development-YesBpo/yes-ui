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
export { useResizeObserver } from './hooks/useResizeObserver'

// ─── Utils (public) ───────────────────────────────────────────
export { cn } from './utils/cn'

// ─── Components ───────────────────────────────────────────────
// Uncomment as components are implemented:
export { Icon } from './components/Icon'
export { Button } from './components/Button'
export { Badge } from './components/Badge'
export { Input } from './components/Input'
export { Select } from './components/Select'
export { Textarea } from './components/Textarea'
export { Checkbox } from './components/Checkbox'
export { Toggle } from './components/Toggle'
export { SearchInput } from './components/SearchInput'
export { Modal } from './components/Modal'
export type { ModalProps, ModalSize } from './components/Modal'
export { Drawer } from './components/Drawer'
export type { DrawerProps, DrawerSize } from './components/Drawer'
export { FilterPanel } from './components/FilterPanel'
export type { FilterPanelProps } from './components/FilterPanel'
export { Spinner } from './components/Spinner'
export { Toast, ToastContainer, useToast } from './components/Toast'
export type { ToastItem, ToastVariant } from './components/Toast'
export { Alert } from './components/Alert'
// export { Badge } from './components/Badge'
// export { Tooltip } from './components/Tooltip'
export { Tabs } from './components/Tabs'
export type { TabsProps, TabItem } from './components/Tabs'
// export { Accordion } from './components/Accordion'
export { Card } from './components/Card'
export type { CardProps } from './components/Card'
export { KPICard } from './components/KPICard'
export type { KPICardProps } from './components/KPICard'
export { Widget } from './components/Widget'
export type { WidgetProps } from './components/Widget'
export { Sidebar } from './components/Sidebar'
export type { SidebarProps, NavItem, SidebarUser } from './components/Sidebar'
export { Avatar } from './components/Avatar'
export { EmptyState } from './components/EmptyState'
export { Skeleton } from './components/Skeleton'
// export { ProgressBar } from './components/ProgressBar'
export { Pagination } from './components/Pagination'
export type { PaginationProps } from './components/Pagination'
export { Toolbar } from './components/Toolbar'
export type { ToolbarProps, ActiveFilter } from './components/Toolbar'
export { GroupFilter } from './components/GroupFilter'
export type { GroupFilterProps } from './components/GroupFilter'
export { BulkActionBar } from './components/BulkActionBar'
export type { BulkActionBarProps, BulkAction } from './components/BulkActionBar'
// export { FilterBar, FilterChip } from './components/FilterBar'
// export { DataTable } from './components/DataTable'
export { Table } from './components/Table'
export type { TableColumn, TableProps } from './components/Table'
export { TableAdvanced } from './components/TableAdvanced'
export type { TableAdvancedProps } from './components/TableAdvanced'
export { MessageBubble } from './components/MessageBubble'
export type { MessageBubbleProps, MessageSender } from './components/MessageBubble'
// export { MessageComposer } from './components/MessageComposer'
export { ChannelBadge } from './components/ChannelBadge'
export { Chip } from './components/Chip'

// ─── Wave 7 — Meta Actions ────────────────────────────────────
export { PageHeader } from './components/PageHeader'
export type { PageHeaderProps, BreadcrumbItem } from './components/PageHeader'
export { SegmentedControl } from './components/SegmentedControl'
export type { SegmentedControlProps, SegmentOption } from './components/SegmentedControl'
export { ButtonToolbar, ToolbarButton } from './components/ButtonToolbar'
export type { ButtonToolbarProps, ToolbarButtonProps } from './components/ButtonToolbar'
export { SplitButton } from './components/SplitButton'
export type { SplitButtonProps, SplitButtonItem } from './components/SplitButton'
export { ColumnManager } from './components/ColumnManager'
export type { ColumnManagerProps, ColumnDef } from './components/ColumnManager'
export { ActionMenu } from './components/ActionMenu'
export type { ActionMenuProps, ActionMenuItem } from './components/ActionMenu'
export { AdminBanner } from './components/AdminBanner'
export type { AdminBannerProps, AdminBannerVariant } from './components/AdminBanner'

// ─── Wave 8 — Communication & Layout ──────────────────────────
export { AgentStatusIndicator } from './components/AgentStatusIndicator'
export type {
  AgentStatusIndicatorProps,
  AgentStatus,
  AgentIndicatorSize,
} from './components/AgentStatusIndicator'
export { ConversationItem } from './components/ConversationItem'
export type {
  ConversationItemProps,
  ConversationChannel,
} from './components/ConversationItem'
export { PanelRich } from './components/PanelRich'
export type {
  PanelRichProps,
  PanelContact,
  PanelContactField,
  PanelHistoryItem,
  PanelStatusVariant,
  PanelTab,
} from './components/PanelRich'

// export { FileDropZone } from './components/FileDropZone'
// export { TagInput } from './components/TagInput'
// export { RichTextEditor } from './components/RichTextEditor'
// export { YesUIProvider } from './components/YesUIProvider'

// ─── Charts (Wave 9) ──────────────────────────────────────────────
export { LineChart } from './charts/LineChart'
export type { LineChartProps } from './charts/LineChart'
export type { BaseChartProps, ChartDatum } from './charts/chartTypes'
export { antvTheme, antvThemeDark } from './charts/antvTheme'
export { AreaChart } from './charts/AreaChart'
export type { AreaChartProps } from './charts/AreaChart'
export { BarChart } from './charts/BarChart'
export type { BarChartProps } from './charts/BarChart'
export { HorizontalBarChart } from './charts/HorizontalBarChart'
export type { HorizontalBarChartProps } from './charts/HorizontalBarChart'
export { ComboChart } from './charts/ComboChart'
export type { ComboChartProps } from './charts/ComboChart'
export { WaterfallChart } from './charts/WaterfallChart'
export type { WaterfallChartProps } from './charts/WaterfallChart'
export { PieChart } from './charts/PieChart'
export type { PieChartProps } from './charts/PieChart'
export { DonutChart } from './charts/DonutChart'
export type { DonutChartProps } from './charts/DonutChart'
export { FunnelChart } from './charts/FunnelChart'
export type { FunnelChartProps } from './charts/FunnelChart'
export { RadarChart } from './charts/RadarChart'
export type { RadarChartProps } from './charts/RadarChart'
export { ScatterChart } from './charts/ScatterChart'
export type { ScatterChartProps } from './charts/ScatterChart'
export { BubbleChart } from './charts/BubbleChart'
export type { BubbleChartProps } from './charts/BubbleChart'
export { HeatmapChart } from './charts/HeatmapChart'
export type { HeatmapChartProps } from './charts/HeatmapChart'
export { StatStrip } from './charts/StatStrip'
export type { StatStripProps, StatStripItem } from './charts/StatStrip'
export { PivotTable, TOTAL_ROW_ID } from './charts/PivotTable'
export type { PivotTableProps } from './charts/PivotTable'
export { PivotTableLite } from './charts/PivotTableLite'
export type { PivotTableLiteProps } from './charts/PivotTableLite'
export { MapCard } from './charts/MapCard'
export type { MapCardProps } from './charts/MapCard'
export { ChoroplethMap } from './charts/ChoroplethMap'
export type { ChoroplethMapProps } from './charts/ChoroplethMap'
