/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationRow } from "@/actions/notifications.actions"

export type NotificationUI = {
  id: string
  userId: string
  type: string
  priority: string
  title: string
  message: string
  isRead: boolean
  entityId: string | null
  entityType: string | null
  data: any
  createdAt: string
  href: string
}

export function mapNotificationToUI(row: NotificationRow): NotificationUI {
  let href = "#"
  if (row.entity_type && row.entity_id) {
    switch (row.entity_type.toLowerCase()) {
      case "shipment":
        href = `/shipments/${row.entity_id}`
        break
      case "document":
        href = `/documents/${row.entity_id}`
        break
      case "client":
        href = `/clients/${row.entity_id}`
        break
      case "boe":
        href = `/boe/${row.entity_id}`
        break
      default:
        href = "#"
    }
  }

  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    priority: row.priority,
    title: row.title,
    message: row.description || "",
    isRead: row.is_read,
    entityId: row.entity_id,
    entityType: row.entity_type,
    data: row.data,
    createdAt: row.created_at,
    href,
  }
}
