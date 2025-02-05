"use client";
import { axiosInstance } from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export default function Name() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["examples"],
    queryFn: async () =>
      (await axiosInstance.get("/examples", { params: { name: "Luiz" } })).data,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <span>{data.message}</span>;
}
