"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
    {
        id: 1,
        title: "Welcome to VTU Network",
        description: "Access all your study materials in one place",
        bgColor: "bg-gradient-to-b from-gray-900 to-gray-800",
    },
    {
        id: 2,
        title: "Latest Notes & Lab Manuals",
        description: "Updated content for all semesters and branches",
        bgColor: "bg-gradient-to-b from-gray-900 to-gray-800",
    },
    {
        id: 3,
        title: "Join Our Community",
        description: "Connect with students across branches",
        bgColor: "bg-gradient-to-b from-gray-900 to-gray-800",
    },
]

export default function BannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToSlide = (index) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    return (
        <div className="relative w-full">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        } ${banner.bgColor}`}
                    >
                        <div className="flex items-center justify-center h-full px-4">
                            <div className="text-center text-white">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                                <p className="text-lg md:text-xl text-gray-300">{banner.description}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Previous banner"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Next banner"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
