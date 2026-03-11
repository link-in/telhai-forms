/**
 * Form schema types for dynamic forms (stored in Supabase forms.schema JSONB).
 */

export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "rating";

export interface ShowWhenCondition {
  field: string;
  value?: string | number | boolean;
  oneOf?: (string | number | boolean)[];
}

export interface FieldOption {
  value: string | number | boolean;
  label: string;
}

export interface BaseFieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  showWhen?: ShowWhenCondition;
}

export interface SelectLikeFieldConfig extends BaseFieldConfig {
  type: "select" | "radio" | "multiselect";
  options: FieldOption[];
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "phone" | "textarea";
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
}

export interface RatingFieldConfig extends BaseFieldConfig {
  type: "rating";
  max?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectLikeFieldConfig
  | CheckboxFieldConfig
  | DateFieldConfig
  | FileFieldConfig
  | RatingFieldConfig;

export interface FormSchema {
  fields: FieldConfig[];
  successMessage?: string;
}

export interface FormRecord {
  id: string;
  name: string;
  slug: string;
  schema: FormSchema;
  created_at: string;
}

export interface FormSubmissionRecord {
  id: string;
  form_id: string;
  data: Record<string, unknown>;
  created_at: string;
  user_id?: string | null;
}
