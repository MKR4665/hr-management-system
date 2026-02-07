import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';

/**
 * Modern Toaster component using Sonner.
 * Place this at the root of your application.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      theme="light"
      toastOptions={{
        className: 'rounded-xl border-slate-200 shadow-xl',
        style: {
          padding: '16px',
        },
      }}
    />
  );
}

/**
 * Compatibility hook to maintain existing interface.
 * Can be used as const { toast } = useToast();
 */
export const useToast = () => {
  return {
    toast: (message, type = 'success') => {
      switch (type) {
        case 'success':
          sonnerToast.success(message);
          break;
        case 'error':
          sonnerToast.error(message);
          break;
        case 'info':
          sonnerToast.info(message);
          break;
        default:
          sonnerToast(message);
      }
    }
  };
};

// Export raw toast for direct usage
export const toast = sonnerToast;
