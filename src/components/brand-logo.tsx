import Image from "next/image"
import React from "react"

export interface BrandLogoProps {
  className?: string
  width?: number
  height?: number
  withText?: boolean
  textClassName?: string
}

export function BrandLogo({ className = "", width = 36, height = 36, withText = false, textClassName = "" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div 
        className={`flex items-center justify-center transition-transform group-hover:scale-105 relative shrink-0`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image 
          src="/logo.jpg" 
          alt="DN Smart Trade ERP Logo" 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain" 
          priority
        />
      </div>
      {withText && (
        <span className={`font-bold tracking-tight ${textClassName}`}>
          D.N Trade International
        </span>
      )}
    </div>
  )
}
