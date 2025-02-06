"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // toast.error(`Algo inesperado aconteceu: ${error.message}`)
        console.error(error);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
