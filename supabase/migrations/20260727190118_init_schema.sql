-- 1. Create ENUM types
CREATE TYPE user_role AS ENUM ('Admin', 'Employee', 'Client');
CREATE TYPE user_status AS ENUM ('Active', 'Inactive', 'Pending');
CREATE TYPE client_type AS ENUM ('Importer', 'Exporter', 'Both');
CREATE TYPE client_status AS ENUM ('Active', 'Pending', 'Inactive');
CREATE TYPE shipment_status AS ENUM ('Pending', 'Booked', 'Loaded', 'In Transit', 'Arrived', 'Customs Clearance', 'Released', 'Delivered', 'Delayed');
CREATE TYPE transport_type AS ENUM ('Sea', 'Air', 'Land');
CREATE TYPE boe_status AS ENUM ('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed');
CREATE TYPE document_category AS ENUM ('Shipment Documents', 'BOE Documents', 'Client Documents', 'Financial Documents', 'Compliance Documents');
CREATE TYPE document_status AS ENUM ('Pending Review', 'Approved', 'Rejected', 'Archived', 'Expired');

-- 2. Create Tables

CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    trade_license_number TEXT UNIQUE,
    bin_number TEXT UNIQUE,
    tin_number TEXT UNIQUE,
    client_type client_type DEFAULT 'Importer',
    status client_status DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_clients_status ON public.clients(status);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    department TEXT,
    role user_role DEFAULT 'Employee',
    status user_status DEFAULT 'Pending',
    username TEXT UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_client_id ON public.profiles(client_id);

CREATE TABLE public.hs_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hscode TEXT NOT NULL,
    tariff_description TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    uom TEXT NOT NULL,
    cd NUMERIC DEFAULT 0,
    vat NUMERIC DEFAULT 0,
    rd NUMERIC DEFAULT 0,
    ait NUMERIC DEFAULT 0,
    sd NUMERIC DEFAULT 0,
    policy_notes TEXT,
    required_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_hscodes_hscode ON public.hs_codes(hscode);

CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    status shipment_status DEFAULT 'Pending',
    exporter TEXT NOT NULL,
    consignee TEXT NOT NULL,
    container_number TEXT,
    container_size TEXT,
    container_type TEXT,
    shipping_line TEXT,
    vessel_name TEXT,
    voyage_number TEXT,
    origin_country TEXT NOT NULL,
    destination_country TEXT NOT NULL,
    loading_port TEXT,
    discharge_port TEXT,
    arrival_port TEXT,
    departure_date DATE,
    eta DATE,
    etd DATE,
    incoterms TEXT,
    transport_type transport_type DEFAULT 'Sea',
    gross_weight NUMERIC,
    net_weight NUMERIC,
    package_count INTEGER,
    package_type TEXT,
    assigned_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_shipments_client_id ON public.shipments(client_id);
CREATE INDEX idx_shipments_assigned_employee_id ON public.shipments(assigned_employee_id);

CREATE TABLE public.shipment_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hs_code TEXT REFERENCES public.hs_codes(hscode) ON DELETE SET NULL,
    quantity NUMERIC NOT NULL,
    weight NUMERIC
);

CREATE TABLE public.shipment_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT,
    location TEXT,
    responsible_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bills_of_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boe_number TEXT UNIQUE NOT NULL,
    shipment_id UUID UNIQUE NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    status boe_status DEFAULT 'Draft',
    duties_import_duty NUMERIC DEFAULT 0,
    duties_vat NUMERIC DEFAULT 0,
    duties_ait NUMERIC DEFAULT 0,
    duties_at NUMERIC DEFAULT 0,
    duties_other_charges NUMERIC DEFAULT 0,
    duties_grand_total NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_boe_shipment_id ON public.bills_of_entry(shipment_id);

CREATE TABLE public.boe_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boe_id UUID NOT NULL REFERENCES public.bills_of_entry(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    hs_code TEXT REFERENCES public.hs_codes(hscode) ON DELETE SET NULL,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    declared_value NUMERIC NOT NULL,
    currency TEXT NOT NULL
);

CREATE TABLE public.boe_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boe_id UUID NOT NULL REFERENCES public.bills_of_entry(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL,
    note TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_type TEXT NOT NULL,
    category document_category NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    boe_id UUID REFERENCES public.bills_of_entry(id) ON DELETE CASCADE,
    uploaded_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status document_status DEFAULT 'Pending Review',
    description TEXT,
    tags TEXT[],
    current_file_url TEXT NOT NULL,
    file_size NUMERIC,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    last_modified TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT doc_association_check CHECK (client_id IS NOT NULL OR shipment_id IS NOT NULL OR boe_id IS NOT NULL)
);
CREATE INDEX idx_documents_client_id ON public.documents(client_id);
CREATE INDEX idx_documents_shipment_id ON public.documents(shipment_id);
CREATE INDEX idx_documents_boe_id ON public.documents(boe_id);

CREATE TABLE public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_size NUMERIC NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changes_note TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.document_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    details TEXT,
    date TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hs_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills_of_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boe_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_activities ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_user_role() RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_client_id() RETURNS UUID AS $$
  SELECT client_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Clients Policies
CREATE POLICY "Employees and Admins have full access to clients" ON public.clients FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own client record" ON public.clients FOR SELECT USING (id = public.get_user_client_id());

-- HS Codes Policies
CREATE POLICY "Anyone authenticated can read hs_codes" ON public.hs_codes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Employees and Admins can modify hs_codes" ON public.hs_codes FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));

-- Shipments Policies
CREATE POLICY "Employees and Admins have full access to shipments" ON public.shipments FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own shipments" ON public.shipments FOR SELECT USING (client_id = public.get_user_client_id());

CREATE POLICY "Employees and Admins access shipment products" ON public.shipment_products FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own shipment products" ON public.shipment_products FOR SELECT USING (shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()));

CREATE POLICY "Employees and Admins access shipment timeline" ON public.shipment_timeline FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own shipment timeline" ON public.shipment_timeline FOR SELECT USING (shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()));

-- BOE Policies
CREATE POLICY "Employees and Admins have full access to boe" ON public.bills_of_entry FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own boe" ON public.bills_of_entry FOR SELECT USING (shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()));

CREATE POLICY "Employees and Admins access boe products" ON public.boe_products FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own boe products" ON public.boe_products FOR SELECT USING (boe_id IN (SELECT id FROM public.bills_of_entry WHERE shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id())));

CREATE POLICY "Employees and Admins access boe timeline" ON public.boe_timeline FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own boe timeline" ON public.boe_timeline FOR SELECT USING (boe_id IN (SELECT id FROM public.bills_of_entry WHERE shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id())));

-- Documents Policies
CREATE POLICY "Employees and Admins have full access to documents" ON public.documents FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own documents" ON public.documents FOR SELECT USING (client_id = public.get_user_client_id() OR shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()) OR boe_id IN (SELECT id FROM public.bills_of_entry WHERE shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id())));

CREATE POLICY "Employees and Admins access document versions" ON public.document_versions FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own document versions" ON public.document_versions FOR SELECT USING (document_id IN (SELECT id FROM public.documents WHERE client_id = public.get_user_client_id() OR shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()) OR boe_id IN (SELECT id FROM public.bills_of_entry WHERE shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()))));

CREATE POLICY "Employees and Admins access document activities" ON public.document_activities FOR ALL USING (public.get_user_role() IN ('Admin', 'Employee'));
CREATE POLICY "Clients can read own document activities" ON public.document_activities FOR SELECT USING (document_id IN (SELECT id FROM public.documents WHERE client_id = public.get_user_client_id() OR shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()) OR boe_id IN (SELECT id FROM public.bills_of_entry WHERE shipment_id IN (SELECT id FROM public.shipments WHERE client_id = public.get_user_client_id()))));
