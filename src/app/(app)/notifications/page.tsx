import { PageHeader } from "@/components/erp/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="All Notifications"
        description="View and manage all your system alerts and messages."
      />
      
      <div className="flex flex-col gap-4 max-w-4xl">
        <Card>
          <CardContent className="flex items-start gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">New Order #1024</p>
              <p className="text-sm text-muted-foreground">Client X placed a new order.</p>
              <p className="text-xs text-muted-foreground pt-1">2 mins ago</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-start gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">System Update</p>
              <p className="text-sm text-muted-foreground">Server maintenance scheduled at 12 AM.</p>
              <p className="text-xs text-muted-foreground pt-1">1 hour ago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
