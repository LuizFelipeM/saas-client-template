export type FieldType = "longText" | "shortText" | "rating";

export interface FieldMetadata {
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FormField {
  id: string;
  title: string;
  type: FieldType;
  required: boolean;
  metadata: FieldMetadata;
}
