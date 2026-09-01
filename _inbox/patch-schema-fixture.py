from pathlib import Path

path = Path(r"P:/seat-worktrees/property/legacy-design-tools/lib/db/src/__tests__/__fixtures__/schema.sql.template")
content = path.read_text(encoding="utf-8")

def insert_once(content, anchor, block):
    if "CREATE TABLE @@SCHEMA@@.clerk_portal_terms" in content and "clerk_portal_terms_county_idx" in block:
        pass
    if block.strip() in content:
        raise SystemExit(f"block already present")
    idx = content.find(anchor)
    if idx == -1:
        raise SystemExit(f"anchor not found: {anchor[:80]!r}")
    return content[:idx] + block + content[idx:]

clerk_table = """

-- Name: clerk_portal_terms; Type: TABLE; Schema: public; Owner: -

CREATE TABLE @@SCHEMA@@.clerk_portal_terms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    county_fips text NOT NULL,
    portal_id text NOT NULL,
    portal_url text NOT NULL,
    terms_url text,
    terms_text text NOT NULL,
    terms_fetched_at timestamp with time zone NOT NULL,
    automated_search text DEFAULT 'unknown'::text NOT NULL,
    login_required boolean DEFAULT false NOT NULL,
    image_purchase jsonb DEFAULT '{}'::jsonb NOT NULL,
    operator_ruled_at timestamp with time zone,
    operator_ruling_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


"""

records_table = """

-- Name: records_request_jobs; Type: TABLE; Schema: public; Owner: -

CREATE TABLE @@SCHEMA@@.records_request_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    engagement_id uuid NOT NULL,
    place_key text,
    user_id text NOT NULL,
    user_email text,
    parcel_key text NOT NULL,
    county_fips text NOT NULL,
    status text NOT NULL,
    request_payload jsonb,
    scope_searched jsonb,
    live_instant_gis jsonb,
    run_cost jsonb,
    recipe_version text,
    error_code text,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


"""

clerk_pk = """

-- Name: clerk_portal_terms clerk_portal_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY @@SCHEMA@@.clerk_portal_terms
    ADD CONSTRAINT clerk_portal_terms_pkey PRIMARY KEY (id);


"""

records_pk = """

-- Name: records_request_jobs records_request_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY @@SCHEMA@@.records_request_jobs
    ADD CONSTRAINT records_request_jobs_pkey PRIMARY KEY (id);


"""

clerk_idx = """

-- Name: clerk_portal_terms_county_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX clerk_portal_terms_county_idx ON @@SCHEMA@@.clerk_portal_terms USING btree (county_fips);


-- Name: clerk_portal_terms_county_portal_uniq; Type: INDEX; Schema: public; Owner: -

CREATE UNIQUE INDEX clerk_portal_terms_county_portal_uniq ON @@SCHEMA@@.clerk_portal_terms USING btree (county_fips, portal_id);


-- Name: clerk_portal_terms_portal_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX clerk_portal_terms_portal_idx ON @@SCHEMA@@.clerk_portal_terms USING btree (portal_id);


"""

records_idx = """

-- Name: records_request_jobs_active_per_engagement_user_uniq; Type: INDEX; Schema: public; Owner: -

CREATE UNIQUE INDEX records_request_jobs_active_per_engagement_user_uniq ON @@SCHEMA@@.records_request_jobs USING btree (engagement_id, user_id) WHERE (status = ANY (ARRAY['queued'::text, 'running'::text, 'awaiting-purchase-approval'::text]));


-- Name: records_request_jobs_engagement_created_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX records_request_jobs_engagement_created_idx ON @@SCHEMA@@.records_request_jobs USING btree (engagement_id, created_at);


-- Name: records_request_jobs_place_key_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX records_request_jobs_place_key_idx ON @@SCHEMA@@.records_request_jobs USING btree (place_key);


-- Name: records_request_jobs_status_idx; Type: INDEX; Schema: public; Owner: -

CREATE INDEX records_request_jobs_status_idx ON @@SCHEMA@@.records_request_jobs USING btree (status);


"""

records_fk = """

-- Name: records_request_jobs records_request_jobs_engagement_id_engagements_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY @@SCHEMA@@.records_request_jobs
    ADD CONSTRAINT records_request_jobs_engagement_id_engagements_id_fk FOREIGN KEY (engagement_id) REFERENCES @@SCHEMA@@.engagements(id) ON DELETE CASCADE;


"""

content = insert_once(content, "\n\n-- Name: code_atom_fetch_queue; Type: TABLE; Schema: public; Owner: -", clerk_table)
content = insert_once(content, "\n\n-- Name: render_outputs; Type: TABLE; Schema: public; Owner: -", records_table)
content = insert_once(content, "\n\n-- Name: code_atom_fetch_queue code_atom_fetch_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -", clerk_pk)
content = insert_once(content, "\n\n-- Name: render_outputs render_outputs_pkey; Type: CONSTRAINT; Schema: public; Owner: -", records_pk)
content = insert_once(content, "\n\n-- Name: code_atom_fetch_queue_jurisdiction_idx; Type: INDEX; Schema: public; Owner: -", clerk_idx)
content = insert_once(content, "\n\n-- Name: render_outputs_render_role_uniq; Type: INDEX; Schema: public; Owner: -", records_idx)
content = insert_once(content, "\n\n-- Name: render_outputs render_outputs_viewpoint_render_id_viewpoint_renders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -", records_fk)

path.write_text(content, encoding="utf-8", newline="\n")
print("patched ok")
