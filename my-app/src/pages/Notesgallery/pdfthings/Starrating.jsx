"use client"

import { useState } from "react"
import { Star } from "lucide-react"



export function StarRating({ rating, onRatingChange, readonly = false, size = "md" }) {
    const [hoverRating, setHoverRating] = useState(0)

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    }

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value)
        }
    }

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value)
        }
    }

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0)
        }
    }

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating)
                return (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} ${readonly ? "cursor-default" : "cursor-pointer"} transition-colors ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-600 hover:text-yellow-400"
                            }`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                    />
                )
            })}
        </div>
    )
}
