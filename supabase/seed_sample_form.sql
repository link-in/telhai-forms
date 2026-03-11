-- Seed a sample form with all field types and conditional fields.
-- Run this in Supabase SQL editor or via supabase db reset after applying migrations.

INSERT INTO forms (name, slug, schema) VALUES (
  'טופס דוגמה מלא',
  'sample-form',
  '{
    "fields": [
      {
        "name": "fullName",
        "type": "text",
        "label": "שם מלא",
        "placeholder": "הזן את שמך",
        "required": true
      },
      {
        "name": "email",
        "type": "email",
        "label": "דוא״ל",
        "placeholder": "example@mail.com",
        "required": true
      },
      {
        "name": "age",
        "type": "number",
        "label": "גיל",
        "min": 0,
        "max": 120
      },
      {
        "name": "message",
        "type": "textarea",
        "label": "הודעה",
        "placeholder": "כתוב הודעה..."
      },
      {
        "name": "contactType",
        "type": "select",
        "label": "סוג פנייה",
        "required": true,
        "options": [
          { "value": "support", "label": "תמיכה" },
          { "value": "sales", "label": "מכירות" },
          { "value": "other", "label": "אחר" }
        ]
      },
      {
        "name": "supportTopic",
        "type": "text",
        "label": "נושא התמיכה",
        "placeholder": "פרט את הנושא",
        "showWhen": { "field": "contactType", "value": "support" }
      },
      {
        "name": "salesProduct",
        "type": "select",
        "label": "מוצר שמעניין אתכם",
        "options": [
          { "value": "a", "label": "מוצר א'" },
          { "value": "b", "label": "מוצר ב'" }
        ],
        "showWhen": { "field": "contactType", "value": "sales" }
      },
      {
        "name": "otherDetail",
        "type": "textarea",
        "label": "פרטים",
        "showWhen": { "field": "contactType", "value": "other" }
      },
      {
        "name": "newsletter",
        "type": "radio",
        "label": "הרשמה לניוזלטר",
        "options": [
          { "value": "yes", "label": "כן" },
          { "value": "no", "label": "לא" }
        ]
      },
      {
        "name": "interests",
        "type": "multiselect",
        "label": "תחומי עניין",
        "options": [
          { "value": "tech", "label": "טכנולוגיה" },
          { "value": "design", "label": "עיצוב" },
          { "value": "marketing", "label": "שיווק" }
        ]
      },
      {
        "name": "agreeTerms",
        "type": "checkbox",
        "label": "אני מסכים לתנאי השימוש",
        "required": true
      },
      {
        "name": "birthDate",
        "type": "date",
        "label": "תאריך לידה"
      },
      {
        "name": "rating",
        "type": "rating",
        "label": "דרג את החוויה",
        "max": 5
      }
    ]
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, schema = EXCLUDED.schema;
