"use server";

import { createClient } from "@/lib/supabase/server";
import type { FormSchema } from "@/types/form";

export type FormListItem = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export async function getForms(): Promise<FormListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("id, name, slug, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as FormListItem[];
}

export async function getFormById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("id, name, slug, schema")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as { id: string; name: string; slug: string; schema: FormSchema };
}

export async function createForm(
  name: string,
  slug: string,
  schema: FormSchema
): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("forms")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) throw new Error("כתובת הטופס (slug) כבר בשימוש. בחר כתובת אחרת.");
  const { data, error } = await supabase
    .from("forms")
    .insert({ name, slug, schema })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function updateForm(
  id: string,
  name: string,
  slug: string,
  schema: FormSchema
): Promise<void> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("forms")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (existing) throw new Error("כתובת הטופס (slug) כבר בשימוש. בחר כתובת אחרת.");
  const { error } = await supabase
    .from("forms")
    .update({ name, slug, schema })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteForm(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("forms").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Single action for FormBuilder: create (formId=null) or update (formId set). */
export async function saveForm(
  mode: "new" | "edit",
  formId: string | null,
  name: string,
  slug: string,
  schema: FormSchema
): Promise<void> {
  if (mode === "new" || !formId) {
    await createForm(name, slug, schema);
  } else {
    await updateForm(formId, name, slug, schema);
  }
}
