import * as React from "react"
import { cn } from "@/lib/utils"
import { CC_STYLES } from "@/lib/constants"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(CC_STYLES.input, className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
