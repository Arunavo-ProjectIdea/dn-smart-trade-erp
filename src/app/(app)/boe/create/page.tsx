import Link from "next/link";
import { BOEForm } from "@/components/erp/boe-form";
import { PageHeader } from "@/components/erp/page-header";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateBOEPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/boe" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <PageHeader 
            title="Create Bill of Entry" 
            description="Follow the steps to submit a new customs declaration."
          />
        </div>
      </div>
      
      <BOEForm />
    </div>
  );
}
