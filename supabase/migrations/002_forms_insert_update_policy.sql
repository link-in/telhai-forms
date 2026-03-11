-- Allow dashboard to create and update forms (anon key).
-- In production you may want to restrict to authenticated users only.

CREATE POLICY "Allow insert on forms"
  ON forms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on forms"
  ON forms FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Optional: allow delete so forms can be removed from the dashboard
CREATE POLICY "Allow delete on forms"
  ON forms FOR DELETE
  USING (true);
