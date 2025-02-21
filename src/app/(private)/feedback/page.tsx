"use client";

import { DynamicForm } from "@/components/dynamic-form/dynamic-form";
import { FormField } from "@/types/form-field";
import { useEffect, useState } from "react";

export default function Feedback() {
  const [formFields, setFormFields] = useState<FormField[]>([]);

  useEffect(() => {
    // Simulating fetching data from the backend
    const fetchFormFields = async () => {
      setFormFields([
        {
          id: "eee295c1-e4ef-48cf-87c6-42d65b955495",
          title: "What do you think about the service?",
          type: "longText",
          required: false,
          metadata: {
            placeholder: "Tell us what you think...",
          },
        },
        {
          id: "6c30b99c-9e73-41ac-b2b1-b5b10ba94dcb",
          title: "How can we improve your experience?",
          type: "shortText",
          required: true,
          metadata: {
            placeholder: "Your suggestions...",
          },
        },
        {
          id: "d751f2eb-a59a-4193-be07-88d491a48d9f",
          title: "How much do you like the experience so far?",
          type: "rating",
          required: true,
          metadata: {
            min: 0,
            max: 5,
          },
        },
      ]);
    };

    fetchFormFields();
  }, []);

  const handleSubmit = (
    e: React.FormEvent,
    formAnswers: Record<string, string | number>
  ) => {
    e.preventDefault();
    // Here you would typically send the formData to your server
    console.log(formAnswers);
    alert("Thank you for your feedback!");
  };

  return (
    <div>
      <main>
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">
              We Value Your Feedback
            </h1>
            <p className="text-center mb-8 text-gray-600">
              Your opinion helps us improve our service. Thank you for taking
              the time to share your thoughts!
            </p>
            <DynamicForm fields={formFields} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}
