import Link from "next/link";
import { BOEForm } from "@/components/erp/boe-form";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateBOEPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/boe" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Bill of Entry</h1>
          <p className="text-muted-foreground mt-1">
            Follow the steps to submit a new customs declaration.
          </p>
        </div>
      </div>
      
      <BOEForm />
    </div>
  );
}
