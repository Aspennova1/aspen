'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthModalProvider } from "@/components/context/AuthModalContext";
import { AuthProvider } from "@/components/context/AuthContext";
import { Toaster } from 'sonner';

const Providers = ({children}) => {
  return (
    <>
    <AuthProvider>
    <AuthModalProvider>
      <Toaster />
      <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
      </ThemeProvider>
    </AuthModalProvider>
    </AuthProvider>
    </>
  )
}

export default Providers