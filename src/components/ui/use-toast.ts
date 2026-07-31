import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  return {
    toast: ({ title, description }: { title?: string | React.ReactNode; description?: string | React.ReactNode; variant?: "default" | "destructive" }) => {
      if (description) {
        sonnerToast(title, { description });
      } else {
        sonnerToast(title);
      }
    },
  };
};

export const toast = ({ title, description }: { title?: string | React.ReactNode; description?: string | React.ReactNode; variant?: "default" | "destructive" }) => {
  if (description) {
    sonnerToast(title, { description });
  } else {
    sonnerToast(title);
  }
};
