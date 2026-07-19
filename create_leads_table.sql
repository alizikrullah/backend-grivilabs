-- Jalankan command ini di server untuk membuat tabel leads:
--
-- docker exec -i postgresql-gx93hntzxvdxp97shblid0qa \
--   psql -U AEzpMiqrqweNht9i -d directus < create_leads_table.sql

CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    service text,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT leads_pkey PRIMARY KEY (id),
    CONSTRAINT leads_status_check CHECK (
        status = ANY (ARRAY['new'::text, 'contacted'::text, 'closed'::text])
    )
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads USING btree (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads USING btree (created_at DESC);
