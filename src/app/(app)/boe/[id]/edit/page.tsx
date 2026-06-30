import { notFound } from "next/navigation";
import Link from "next/link";
import { getMockBOEById } from "@/lib/mock-data/boe";
import { BOEForm } from "@/components/erp/boe-form";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditBOEPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const boe = getMockBOEById(resolvedParams.id);

  if (!boe) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href={`/boe/${boe.id}`} className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Bill of Entry</h1>
          <p className="text-muted-foreground mt-1">
            Update information for {boe.boeNumber}.
          </p>
        </div>
      </div>
      
      <BOEForm initialData={boe} />
    </div>
  );
}
