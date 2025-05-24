"use client";

import { FormField as FormFieldType } from "@/types/form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { DynamicFormField } from "./dynamic-form-field";

interface DynamicFormProps {
  fields: FormFieldType[];
  clearOnSubmit?: boolean;
  onSubmit?: (
    event: React.FormEvent,
    formAnswers: Record<string, string | number>
  ) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  clearOnSubmit,
  onSubmit,
}) => {
  const [formAnswers, setFormAnswers] = useState<
    Record<string, string | number>
  >({});

  const createFormSchema = (fields: FormFieldType[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      switch (field.type) {
        case "longText":
        case "shortText":
          schemaFields[field.title] = z
            .string()
            .min(1, { message: "This field is required" });
          break;
        case "rating":
          schemaFields[field.title] = z
            .number()
            .min(field.metadata.min || 0)
            .max(field.metadata.max || 5);
          break;
      }
    });
    return z.object(schemaFields);
  };

  const formSchema = createFormSchema(fields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.title] = field.type === "rating" ? 0 : "";
      return acc;
    }, {} as Record<string, string | number>),
  });

  const handleInputChange = (id: string) => (value: string | number) => {
    setFormAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit?.(e, formAnswers);
    if (clearOnSubmit) setFormAnswers({});
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field, index) => (
          <FormField
            key={index}
            control={form.control}
            name={field.title}
            render={() => (
              <DynamicFormField
                id={field.id}
                metadata={field.metadata}
                title={field.title}
                type={field.type}
                value={formAnswers[field.id]}
                required={field.required}
                onChange={handleInputChange(field.id)}
              />
            )}
          />
        ))}
        <Button type="submit" className="w-full">
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
};
