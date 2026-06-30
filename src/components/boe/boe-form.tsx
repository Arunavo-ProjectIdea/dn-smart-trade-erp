"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  ArrowLeft,
  Calculator,
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockClients } from "@/lib/mock-data/clients";
import {
  BillOfEntry,
  BOEItem,
  mockHSCodes,
  mockPorts,
  mockCustomHouses,
  saveBOE,
} from "@/lib/mock-data/boe";

interface BOEFormProps {
  initialData?: BillOfEntry;
}

export function BOEForm({ initialData }: BOEFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  // State matching BillOfEntry interface
  const [boeNumber, setBoeNumber] = useState(initialData?.boeNumber || "");
  const [boeDate, setBoeDate] = useState(
    initialData?.boeDate || new Date().toISOString().split("T")[0]
  );
  const [port, setPort] = useState(initialData?.port || mockPorts[0]);
  const [customHouse, setCustomHouse] = useState(
    initialData?.customHouse || mockCustomHouses[0]
  );
  const [entryType, setEntryType] = useState<
    "Home Consumption" | "Bond" | "Ex-bond"
  >(initialData?.entryType || "Home Consumption");
  const [importType, setImportType] = useState<"Commercial" | "Non-commercial">(
    initialData?.importType || "Commercial"
  );
  const [lcNumber, setLcNumber] = useState(initialData?.lcNumber || "");
  const [lcDate, setLcDate] = useState(initialData?.lcDate || "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    initialData?.countryOfOrigin || ""
  );
  const [countryOfExport, setCountryOfExport] = useState(
    initialData?.countryOfExport || ""
  );

  // Importer
  const [importerId, setImporterId] = useState(initialData?.importerId || "");
  const [importerName, setImporterName] = useState(
    initialData?.importerName || ""
  );
  const [binNumber, setBinNumber] = useState(initialData?.binNumber || "");
  const [tinNumber, setTinNumber] = useState(initialData?.tinNumber || "");
  const [importerAddress, setImporterAddress] = useState(
    initialData?.address || ""
  );

  // Supplier
  const [supplierName, setSupplierName] = useState(
    initialData?.supplierName || ""
  );
  const [supplierCountry, setSupplierCountry] = useState(
    initialData?.supplierCountry || ""
  );
  const [supplierAddress, setSupplierAddress] = useState(
    initialData?.supplierAddress || ""
  );

  // Shipment details
  const [vesselName, setVesselName] = useState(initialData?.vesselName || "");
  const [voyageNo, setVoyageNo] = useState(initialData?.voyageNo || "");
  const [igmNumber, setIgmNumber] = useState(initialData?.igmNumber || "");
  const [igmDate, setIgmDate] = useState(initialData?.igmDate || "");
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialData?.invoiceNumber || ""
  );
  const [invoiceDate, setInvoiceDate] = useState(
    initialData?.invoiceDate || ""
  );
  const [blNumber, setBlNumber] = useState(initialData?.blNumber || "");
  const [blDate, setBlDate] = useState(initialData?.blDate || "");
  const [grossWeight, setGrossWeight] = useState(initialData?.grossWeight || 0);
  const [netWeight, setNetWeight] = useState(initialData?.netWeight || 0);
  const [currency, setCurrency] = useState(initialData?.currency || "USD");
  const [exchangeRate, setExchangeRate] = useState(
    initialData?.exchangeRate || 110
  );
  const [freight, setFreight] = useState(initialData?.freight || 0);
  const [insurance, setInsurance] = useState(initialData?.insurance || 0);

  // Items State
  const [items, setItems] = useState<BOEItem[]>(initialData?.items || []);

  // Documents checklist
  const [docs, setDocs] = useState({
    commercialInvoice: initialData?.documents?.commercialInvoice ?? true,
    packingList: initialData?.documents?.packingList ?? true,
    billOfLading: initialData?.documents?.billOfLading ?? true,
    insurance: initialData?.documents?.insurance ?? true,
    lcCopy: initialData?.documents?.lcCopy ?? false,
    certificateOfOrigin: initialData?.documents?.certificateOfOrigin ?? true,
  });

  const [remarks, setRemarks] = useState(initialData?.remarks || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete importer selection
  const handleImporterChange = (clientId: string | null) => {
    if (!clientId) return;
    const client = mockClients.find((c) => c.id === clientId);
    if (client) {
      setImporterId(client.id);
      setImporterName(client.companyName);
      setBinNumber(client.binNumber);
      setTinNumber(client.tinNumber);
      setImporterAddress(client.address);
    }
  };

  // Add Item row
  const handleAddItem = () => {
    const newItem: BOEItem = {
      id: `item-${Date.now()}`,
      hsCode: mockHSCodes[0].code,
      description: mockHSCodes[0].description,
      qty: 1,
      unit: "PCS",
      unitPrice: 0,
      value: 0,
      dutyRate: mockHSCodes[0].dutyRate,
      dutyAmount: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove Item row
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update Item row field
  const handleItemFieldChange = (
    id: string,
    field: keyof BOEItem,
    value: string | number
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };

        // Handle HS Code select change
        if (field === "hsCode") {
          const hscodeInfo = mockHSCodes.find((h) => h.code === value);
          if (hscodeInfo) {
            updated.description = hscodeInfo.description;
            updated.dutyRate = hscodeInfo.dutyRate;
          }
        }

        // Recalculate row value: qty * unitPrice
        if (field === "qty" || field === "unitPrice" || field === "hsCode") {
          const qtyVal = field === "qty" ? Number(value) : updated.qty;
          const priceVal =
            field === "unitPrice" ? Number(value) : updated.unitPrice;
          updated.value = qtyVal * priceVal;
        }

        // Recalculate row duty: value * exchangeRate * (dutyRate/100)
        const rate = field === "dutyRate" ? Number(value) : updated.dutyRate;
        updated.dutyAmount = updated.value * exchangeRate * (rate / 100);

        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Recalculate item duty values when exchangeRate changes
  useEffect(() => {
    const updateDuties = async () => {
      setItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          dutyAmount: item.value * exchangeRate * (item.dutyRate / 100),
        }))
      )
    }
    updateDuties()
  }, [exchangeRate]);

  // Calculations
  const invoiceValue = items.reduce((sum, item) => sum + item.value, 0);
  const cifValue = invoiceValue + freight + insurance;
  const assessableValue = cifValue * exchangeRate;

  // Custom duty is sum of row duties
  const customDuty = items.reduce((sum, item) => sum + item.dutyAmount, 0);

  // Supplementary duty = (assessableValue + customDuty) * 10%
  const supplementaryDuty = (assessableValue + customDuty) * 0.1;

  // VAT = (assessableValue + customDuty + supplementaryDuty) * 15%
  const vat = (assessableValue + customDuty + supplementaryDuty) * 0.15;

  // AIT = assessableValue * 5%
  const ait = assessableValue * 0.05;

  // AT = assessableValue * 5%
  const at = assessableValue * 0.05;

  // Grand total duty
  const grandTotal = customDuty + supplementaryDuty + vat + ait + at;

  const handleSave = (status: "Draft" | "Submitted") => {
    if (!importerName) {
      alert("Please select or enter Importer Name.");
      return;
    }

    setIsSubmitting(true);

    const boeData: BillOfEntry = {
      id: initialData?.id || "",
      boeNumber: boeNumber || "PENDING",
      boeDate,
      port,
      customHouse,
      entryType,
      importType,
      lcNumber,
      lcDate,
      countryOfOrigin,
      countryOfExport,
      importerId,
      importerName,
      binNumber,
      tinNumber,
      address: importerAddress,
      supplierName,
      supplierCountry,
      supplierAddress,
      vesselName,
      voyageNo,
      igmNumber,
      igmDate,
      invoiceNumber,
      invoiceDate,
      blNumber,
      blDate,
      grossWeight,
      netWeight,
      currency,
      exchangeRate,
      invoiceValue,
      freight,
      insurance,
      cifValue,
      items,
      assessableValue,
      customDuty,
      supplementaryDuty,
      vat,
      ait,
      at,
      grandTotal,
      documents: docs,
      remarks,
      status,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      saveBOE(boeData);
      setIsSubmitting(false);
      router.push("/boe");
      router.refresh();
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/boe")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit
              ? `Edit BOE - ${initialData.boeNumber}`
              : "Create New Bill of Entry"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit
              ? "Update details for the customs declaration."
              : "Filing details for a new customs declaration."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields: Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: General Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Section 1: General Information
              </CardTitle>
              <CardDescription>
                Declaration type, port of entry, and custom house details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="boeNumber">BOE Number</Label>
                <Input
                  id="boeNumber"
                  value={boeNumber}
                  onChange={(e) => setBoeNumber(e.target.value)}
                  placeholder="Auto-generated if empty"
                  disabled={isEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boeDate">BOE Date *</Label>
                <Input
                  id="boeDate"
                  type="date"
                  value={boeDate}
                  onChange={(e) => setBoeDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port of Entry *</Label>
                <Select
                  value={port}
                  onValueChange={(value) => {
                    if (value) {
                      setPort(value);
                    }
                  }}
                >
                  <SelectTrigger id="port">
                    <SelectValue placeholder="Select port" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPorts.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customHouse">Custom House *</Label>
                <Select
                  value={customHouse}
                  onValueChange={(value) => {
                    if (value !== null) {
                      setCustomHouse(value);
                    }
                  }}
                >
                  <SelectTrigger id="customHouse">
                    <SelectValue placeholder="Select custom house" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomHouses.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryType">Entry Type</Label>
                <Select
                  value={entryType}
                  onValueChange={(val) => { if (val) setEntryType(val as "Home Consumption" | "Bond" | "Ex-bond") }}
                >
                  <SelectTrigger id="entryType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Consumption">
                      Home Consumption
                    </SelectItem>
                    <SelectItem value="Bond">Bond</SelectItem>
                    <SelectItem value="Ex-bond">Ex-bond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="importType">Import Type</Label>
                <Select
                  value={importType}
                  onValueChange={(val) => { if (val) setImportType(val as "Commercial" | "Non-commercial") }}
                >
                  <SelectTrigger id="importType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Non-commercial">
                      Non-commercial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lcNumber">L/C Number</Label>
                <Input
                  id="lcNumber"
                  value={lcNumber}
                  onChange={(e) => setLcNumber(e.target.value)}
                  placeholder="LC-XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lcDate">L/C Date</Label>
                <Input
                  id="lcDate"
                  type="date"
                  value={lcDate}
                  onChange={(e) => setLcDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                <Input
                  id="countryOfOrigin"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  placeholder="e.g. South Korea"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryOfExport">Country of Export</Label>
                <Input
                  id="countryOfExport"
                  value={countryOfExport}
                  onChange={(e) => setCountryOfExport(e.target.value)}
                  placeholder="e.g. China"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Importer Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Section 2: Importer Details
              </CardTitle>
              <CardDescription>
                Select an existing client to autofill registration info.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="importerSelect">Search & Select Importer</Label>
                <Select value={importerId} onValueChange={handleImporterChange}>
                  <SelectTrigger id="importerSelect">
                    <SelectValue placeholder="-- Select Importer (Autofills Details) --" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients
                      .filter(
                        (c) =>
                          c.clientType === "Importer" || c.clientType === "Both"
                      )
                      .map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.companyName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="importerName">Importer Name *</Label>
                  <Input
                    id="importerName"
                    value={importerName}
                    onChange={(e) => setImporterName(e.target.value)}
                    placeholder="Enter Importer Company Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="binNumber">BIN Number</Label>
                  <Input
                    id="binNumber"
                    value={binNumber}
                    onChange={(e) => setBinNumber(e.target.value)}
                    placeholder="BIN-XXXXXXX"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tinNumber">TIN Number</Label>
                  <Input
                    id="tinNumber"
                    value={tinNumber}
                    onChange={(e) => setTinNumber(e.target.value)}
                    placeholder="TIN-XXXXXXX"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="importerAddress">Address</Label>
                  <Textarea
                    id="importerAddress"
                    value={importerAddress}
                    onChange={(e) => setImporterAddress(e.target.value)}
                    placeholder="Registered business address"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Supplier Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Section 3: Supplier / Exporter Details
              </CardTitle>
              <CardDescription>
                Supplier information and origin location.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Exporter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierCountry">Supplier Country</Label>
                <Input
                  id="supplierCountry"
                  value={supplierCountry}
                  onChange={(e) => setSupplierCountry(e.target.value)}
                  placeholder="e.g. South Korea"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supplierAddress">Supplier Address</Label>
                <Textarea
                  id="supplierAddress"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  placeholder="Exporter address details"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Shipment & Invoice Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Section 4: Shipment & Invoice details
              </CardTitle>
              <CardDescription>
                Enter transportation logs, invoicing value, and rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vesselName">Vessel / Flight Name</Label>
                <Input
                  id="vesselName"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  placeholder="e.g. MV Ocean Express"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voyageNo">Voyage / Flight No</Label>
                <Input
                  id="voyageNo"
                  value={voyageNo}
                  onChange={(e) => setVoyageNo(e.target.value)}
                  placeholder="e.g. VY-092"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="igmNumber">IGM Number</Label>
                <Input
                  id="igmNumber"
                  value={igmNumber}
                  onChange={(e) => setIgmNumber(e.target.value)}
                  placeholder="Import General Manifest No"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="igmDate">IGM Date</Label>
                <Input
                  id="igmDate"
                  type="date"
                  value={igmDate}
                  onChange={(e) => setIgmDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blNumber">Bill of Lading (B/L) / AWB No</Label>
                <Input
                  id="blNumber"
                  value={blNumber}
                  onChange={(e) => setBlNumber(e.target.value)}
                  placeholder="BL-XXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blDate">B/L / AWB Date</Label>
                <Input
                  id="blDate"
                  type="date"
                  value={blDate}
                  onChange={(e) => setBlDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grossWeight">Gross Weight (KGs)</Label>
                <Input
                  id="grossWeight"
                  type="number"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="netWeight">Net Weight (KGs)</Label>
                <Input
                  id="netWeight"
                  type="number"
                  value={netWeight}
                  onChange={(e) => setNetWeight(Number(e.target.value))}
                />
              </div>

              <div className="my-2 border-t md:col-span-2 border-dashed border-border" />

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => {
                    if (value !== null) setCurrency(value);
                  }}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="BDT">BDT (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">Exchange Rate (to BDT) *</Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceValue">
                  Invoice Value ({currency}) (Auto calculated)
                </Label>
                <Input
                  id="invoiceValue"
                  type="number"
                  value={invoiceValue}
                  disabled
                  className="bg-muted font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freight">Freight Charges ({currency})</Label>
                <Input
                  id="freight"
                  type="number"
                  value={freight}
                  onChange={(e) => setFreight(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">
                  Insurance Premium ({currency})
                </Label>
                <Input
                  id="insurance"
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cifValue">CIF Value ({currency}) (Auto)</Label>
                <Input
                  id="cifValue"
                  type="number"
                  value={cifValue}
                  disabled
                  className="bg-muted font-bold text-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Goods Information */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Section 5: Goods Information
                </CardTitle>
                <CardDescription>
                  List individual items inside this declaration.
                </CardDescription>
              </div>
              <Button type="button" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No items added yet. Click &quot;Add Item&quot; to begin.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="border p-4 rounded-lg space-y-4 relative bg-card/50"
                    >
                      {/* Row header with item index and delete */}
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-semibold text-xs text-muted-foreground">
                          Item #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">HS Code</Label>
                          <Select
                            value={item.hsCode}
                            onValueChange={(val) =>
                              handleItemFieldChange(item.id, "hsCode", val || "")
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select HS Code" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockHSCodes.map((h) => (
                                <SelectItem key={h.code} value={h.code}>
                                  {h.code} ({h.category})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Product description"
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "qty",
                                Number(e.target.value)
                              )
                            }
                            className="h-9"
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">
                            Unit (e.g. PCS, KGS)
                          </Label>
                          <Input
                            value={item.unit}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "unit",
                                e.target.value
                              )
                            }
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">
                            Unit Price ({currency})
                          </Label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "unitPrice",
                                Number(e.target.value)
                              )
                            }
                            className="h-9"
                            min="0"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold">
                            Value ({currency})
                          </Label>
                          <div className="h-9 px-3 py-1.5 rounded-md bg-muted text-sm font-medium flex items-center border">
                            {item.value.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">CD Duty Rate (%)</Label>
                          <Input
                            type="number"
                            value={item.dutyRate}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "dutyRate",
                                Number(e.target.value)
                              )
                            }
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold">
                            Duty Amount (BDT)
                          </Label>
                          <div className="h-9 px-3 py-1.5 rounded-md bg-muted text-sm font-medium flex items-center border text-success">
                            ৳{" "}
                            {item.dutyAmount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 7: Documents Upload checklist */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Section 7: Document Checklist
              </CardTitle>
              <CardDescription>
                Select documents that are verified and attached with this
                declaration.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                <Checkbox
                  id="commercialInvoice"
                  checked={docs.commercialInvoice}
                  onCheckedChange={(checked) =>
                    setDocs({ ...docs, commercialInvoice: !!checked })
                  }
                />
                <Label
                  htmlFor="commercialInvoice"
                  className="cursor-pointer font-medium text-sm"
                >
                  Commercial Invoice
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                <Checkbox
                  id="packingList"
                  checked={docs.packingList}
                  onCheckedChange={(checked) =>
                    setDocs({ ...docs, packingList: !!checked })
                  }
                />
                <Label
                  htmlFor="packingList"
                  className="cursor-pointer font-medium text-sm"
                >
                  Packing List
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                <Checkbox
                  id="billOfLading"
                  checked={docs.billOfLading}
                  onCheckedChange={(checked) =>
                    setDocs({ ...docs, billOfLading: !!checked })
                  }
                />
                <Label
                  htmlFor="billOfLading"
                  className="cursor-pointer font-medium text-sm"
                >
                  Bill of Lading (B/L)
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                <Checkbox
                  id="insuranceDoc"
                  checked={docs.insurance}
                  onCheckedChange={(checked) =>
                    setDocs({ ...docs, insurance: !!checked })
                  }
                />
                <Label
                  htmlFor="insuranceDoc"
                  className="cursor-pointer font-medium text-sm"
                >
                  Insurance Premium Receipt
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                <Checkbox
                  id="lcCopy"
                  checked={docs.lcCopy}
                  onCheckedChange={(checked) =>
                    setDocs({ ...docs, lcCopy: !!checked })
                  }
                />
                <Label
                  htmlFor="lcCopy"
                  className="cursor-pointer font-medium text-sm"
                >
                  L/C Copy
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                <Checkbox
                  id="certificateOfOrigin"
                  checked={docs.certificateOfOrigin}
                  onCheckedChange={(checked) =>
                    setDocs({ ...docs, certificateOfOrigin: !!checked })
                  }
                />
                <Label
                  htmlFor="certificateOfOrigin"
                  className="cursor-pointer font-medium text-sm"
                >
                  Certificate of Origin
                </Label>
              </div>

              <div className="md:col-span-2 pt-2">
                <Label className="text-xs text-muted-foreground block mb-2">
                  Simulate File Uploads
                </Label>
                <div className="border border-dashed p-4 rounded-md text-center bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Mock File uploader. Files checklist above will be stored in
                    data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Remarks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Section 8: Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Write any comments, issues with customs clearance, notes for inspectors, etc."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Calculations / Summary panel: Right 1 Column */}
        <div className="space-y-6">
          <Card className="sticky top-6 border-primary/20 bg-muted/10">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Section 6: Duty Summary
              </CardTitle>
              <CardDescription>
                Live BDT tax valuations calculated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Assessable Value (AV):
                </span>
                <span className="font-mono font-semibold">
                  ৳{" "}
                  {assessableValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Customs Duty (CD):
                </span>
                <span className="font-mono font-semibold">
                  ৳{" "}
                  {customDuty.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Supplementary Duty (SD):
                </span>
                <span className="font-mono font-semibold">
                  ৳{" "}
                  {supplementaryDuty.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Value Added Tax (VAT):
                </span>
                <span className="font-mono font-semibold">
                  ৳ {vat.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Advance Income Tax (AIT):
                </span>
                <span className="font-mono font-semibold">
                  ৳ {ait.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Advance Tax (AT):</span>
                <span className="font-mono font-semibold">
                  ৳ {at.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-dashed my-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-base">Grand Total (BDT):</span>
                <span className="font-mono font-extrabold text-xl text-primary">
                  ৳{" "}
                  {grandTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-xs space-y-1">
                <div className="font-semibold text-primary">
                  Calculation Rules:
                </div>
                <div className="text-muted-foreground">
                  AV = CIF * Exchange Rate
                </div>
                <div className="text-muted-foreground">
                  CD = Sum of item CD duties
                </div>
                <div className="text-muted-foreground">
                  SD = (AV + CD) * 10%
                </div>
                <div className="text-muted-foreground">
                  VAT = (AV + CD + SD) * 15%
                </div>
                <div className="text-muted-foreground">
                  AIT / AT = AV * 5% each
                </div>
              </div>
            </CardContent>

            <div className="border-t p-4 bg-muted/40 space-y-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => handleSave("Submitted")}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isEdit
                  ? "Update & Submit BOE"
                  : "Submit BOE Document"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-card"
                onClick={() => handleSave("Draft")}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Save Draft Changes"
                  : "Save as Draft"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/boe")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
