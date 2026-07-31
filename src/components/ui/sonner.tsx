"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faInfoCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />,
        info: <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4" />,
        warning: <FontAwesomeIcon icon={faCircle} className="h-4 w-4" />,
        error: <FontAwesomeIcon icon={faCircle} className="h-4 w-4" />,
        loading: <FontAwesomeIcon icon={faCircle} className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
