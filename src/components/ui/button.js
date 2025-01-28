import React from "react"
import clsx from "clsx"

const variants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
}

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

export function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  const variantClasses = variants[variant] || variants.default
  const sizeClasses = sizes[size] || sizes.md

  return (
    <button
      className={clsx(
        "rounded-md font-semibold transition-colors focus:outline-none",
        variantClasses,
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
