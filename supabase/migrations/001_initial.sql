-- Forms table: form definitions with JSONB schema
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  schema JSONB NOT NULL DEFAULT '{"fields":[]}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NULL
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);

-- RLS: allow public read on forms (for form display)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forms are viewable by everyone"
  ON forms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert submissions"
  ON form_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Submissions are viewable by everyone (dashboard)"
  ON form_submissions FOR SELECT
  USING (true);

-- Optional: allow service role to manage forms (for admin/seed)
-- CREATE POLICY "Service role can do anything on forms" ON forms FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "Service role can do anything on form_submissions" ON form_submissions FOR ALL USING (auth.role() = 'service_role');
