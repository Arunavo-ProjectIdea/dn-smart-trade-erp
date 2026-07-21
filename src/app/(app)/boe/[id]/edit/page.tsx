import { notFound } from "next/navigation";
import Link from "next/link";
import { getMockBOEById } from "@/lib/mock-data/boe";
import { BOEForm } from "@/components/erp/boe-form";
import { PageHeader } from "@/components/erp/page-header";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditBOEPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const boe = getMockBOEById(resolvedParams.id);

  if (!boe) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/boe/${boe.id}`} className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <PageHeader 
            title="Edit Bill of Entry" 
            description={`Update information for ${boe.boeNumber}.`}
            className="mb-0"
          />
        </div>
      </div>
      
      <BOEForm initialData={boe} />
    </div>
  );
}
