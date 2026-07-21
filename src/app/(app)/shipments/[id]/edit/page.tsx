"use client";

import { use } from "react";
import { PageHeader } from "@/components/erp/page-header";
import { ShipmentForm } from "@/components/erp/shipment-form";
import { mockShipmentsList } from "@/lib/mock-data/shipment";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const shipment = mockShipmentsList.find((s) => s.id === id);

  if (!shipment) {
    return (
      <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
        <PageHeader title="Shipment Not Found" />
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="size-12 text-destructive mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No shipment found with ID: {id}</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title={`Edit Shipment ${shipment.shipmentNumber}`} 
        description="Modify shipment information and customs details."
      />
      <ShipmentForm initialData={shipment} />
    </div>
  );
}
