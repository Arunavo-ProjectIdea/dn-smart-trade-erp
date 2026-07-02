import { PageHeader } from "@/components/erp/page-header";
import { ShipmentForm } from "@/components/erp/shipment-form";

export default function CreateShipmentPage() {
  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title="Create New Shipment" 
        description="Initialize a new shipment record by completing the multi-step wizard."
      />
      <ShipmentForm />
    </div>
  );
}
