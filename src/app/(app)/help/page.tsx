import { PageHeader } from "@/components/erp/page-header"
import { getUserSupportRequests } from "@/actions/support.actions"
import { HelpCenterClient } from "./help-center-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center | DN Smart Trade ERP",
  description: "Documentation, AI Assistant, and Support for DN Smart Trade ERP.",
}

export default async function HelpPage() {
  const { data: initialSupportRequests = [] } = await getUserSupportRequests()

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <PageHeader 
        title="Help Center"
        description="Documentation, tutorials, support tickets, and AI assistance all in one place."
      />
      
      <HelpCenterClient initialSupportRequests={initialSupportRequests} />
    </div>
  )
}
