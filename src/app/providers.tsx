"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

interface ProvidersProps {
  children: React.ReactNode;
  defaultOpen: boolean;
}

export function Providers({ children, defaultOpen }: ProvidersProps) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // toast.error(`Algo inesperado aconteceu: ${error.message}`)
        console.error(error);
      },
    }),
  });

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
