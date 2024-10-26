// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

// next ui provider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Toaster position="top-right" />
      {children}
    </NextUIProvider>
  );
}
