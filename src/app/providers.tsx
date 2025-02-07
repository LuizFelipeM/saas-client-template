"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast({
          title: "Algo deu errado!",
          description:
            "Tivemos um erro inesperado, por favor, tente novamente ou entre em contato.",
        });
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
