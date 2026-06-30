"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BOEForm } from "@/components/boe/boe-form"
import { getBOEById, BillOfEntry } from "@/lib/mock-data/boe"

export default function EditBillOfEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [boe, setBoe] = useState<BillOfEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initData = async () => {
      const item = getBOEById(id)
      if (item) {
        setBoe(item)
      }
      setLoading(false)
    }
    initData()
  }, [id])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading details...</div>
  }

  if (!boe) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-destructive font-semibold">Bill of Entry not found.</div>
        <Button variant="outline" onClick={() => router.push("/boe")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    )
  }

  const isEditable = boe.status === "Draft" || boe.status === "Rejected"

  if (!isEditable) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4 border rounded-lg bg-card shadow-sm mt-10">
        <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
        <h2 className="text-lg font-bold">Document Locked</h2>
        <p className="text-sm text-muted-foreground">
          This Bill of Entry has a status of <strong>{boe.status}</strong>. Only documents in <strong>Draft</strong> or <strong>Rejected</strong> status can be modified.
        </p>
        <Button className="w-full" onClick={() => router.push(`/boe/${boe.id}`)}>
          View Read-Only Details
        </Button>
        <Button variant="outline" className="w-full" onClick={() => router.push("/boe")}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <BOEForm initialData={boe} />
    </div>
  )
}
