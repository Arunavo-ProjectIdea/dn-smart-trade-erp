"use client";

import { use, useState, useEffect } from "react";
import { PageHeader } from "@/components/erp/page-header";
import { ShipmentForm } from "@/components/erp/shipment-form";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Shipment } from "@/lib/types/shipment";
import { getShipmentById } from "@/app/(app)/shipments/actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShipment() {
      setLoading(true);
      const res = await getShipmentById(id);
      if (res.error || !res.data) {
        setError(res.error || "Shipment not found");
      } else {
        setShipment(res.data);
      }
      setLoading(false);
    }
    loadShipment();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-medium">
        Loading shipment for editing...
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
        <PageHeader title="Shipment Not Found" />
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FontAwesomeIcon icon={faCircleExclamation} className="size-12 text-destructive mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No shipment found with ID: {id}</h3>
            <Link href="/shipments" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Back to Shipments
            </Link>
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
