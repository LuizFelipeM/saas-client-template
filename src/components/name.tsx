"use client";

import { examplesApi } from "@/lib/api/examples-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";

export default function Name() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["examples"],
    queryFn: async () => await examplesApi.greetings("Luiz"),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <span>{data?.message}</span>
      <Button onClick={() => console.log("click")}>Your button</Button>
    </>
  );
}
