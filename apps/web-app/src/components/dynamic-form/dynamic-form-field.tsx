import { FieldMetadata, FieldType } from "@/types/form-field";
import { Star } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface DynamicFormFieldProps {
  id: string;
  title: string;
  type: FieldType;
  metadata: FieldMetadata;
  required?: boolean;
  value?: string | number | readonly string[];
  onChange?: (value: string | number) => void;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  id,
  type,
  metadata,
  value,
  required,
  onChange,
}) => {
  switch (type) {
    case "longText":
      return (
        <Textarea
          id={id}
          placeholder={metadata.placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-h-[100px]"
          required={required}
        />
      );
    case "shortText":
      return (
        <Input
          id={id}
          placeholder={metadata.placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
        />
      );
    case "rating":
      return (
        <div className="flex justify-start space-x-1">
          {Array.from(
            {
              length: (metadata.max || 5) - (metadata.min || 0) + 1,
            },
            (_, i) => i + (metadata.min || 0)
          ).map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              className={`p-0 ${
                (value as number) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => onChange?.(star)}
            >
              <Star className="h-6 w-6 fill-current" />
            </Button>
          ))}
        </div>
      );
    default:
      return null;
  }
};
