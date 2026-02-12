"use client";

import {  useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ThemeProvider } from "./theme-provider";
import UnauthenticatedView from "@/features/auth/components/unauthenticated-view";
import AuthLoadingView from "@/features/auth/components/auth-loading-view";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
  
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Authenticated>
      
            {children}
          </Authenticated>

          <Unauthenticated>
            <UnauthenticatedView/>
          </Unauthenticated>

          <AuthLoading>
            <AuthLoadingView/>
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    
  );
}
