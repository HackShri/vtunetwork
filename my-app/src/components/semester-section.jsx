"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getSubjects, getSubjectCode } from "@/common/data"

export default function SemesterSection({ semester, branch, type, onViewPdfs }) {
    const [scrollPosition, setScrollPosition] = useState(0)
    const subjects = branch ? getSubjects(branch, semester.id.toString()) : []
    const containerRef = React.useRef(null)

    const scroll = (direction) => {
        const container = containerRef.current
        if (!container) return

        const scrollAmount = 200 // Adjust based on your card width + gap
        const newPosition = direction === 'left' 
            ? Math.max(0, scrollPosition - scrollAmount)
            : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)
        
        container.scrollTo({ left: newPosition, behavior: 'smooth' })
        setScrollPosition(newPosition)
    }

    const handleSubjectClick = async (subject) => {
        if (!branch || !semester) return
        
        const subjectCode = getSubjectCode(branch, semester.id.toString(), subject)
        
        // Fetch PDFs for this subject
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            const response = await fetch(`${API_BASE}/api/user/filter?branch=${branch}&semester=${semester.id}&subject=${subject}&type=${type}`)
            const data = await response.json()
            
            if (data?.success) {
                onViewPdfs(data.data, subject)
            }
        } catch (error) {
            console.error('Error fetching PDFs:', error)
        }
    }

    if (!subjects.length) return null

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{semester.title}</h2>
            </div>

            <div className="relative group">
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={scrollPosition <= 0}
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <div 
                    ref={containerRef}
                    className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-2"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {subjects.map((subject, index) => (
                        <div key={index} className="flex-shrink-0">
                            <div 
                                onClick={() => handleSubjectClick(subject)}
                                className="w-[200px] h-[120px] bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors flex items-center justify-center group"
                            >
                                <h3 className="text-lg font-medium text-white text-center group-hover:scale-105 transition-transform">
                                    {subject}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={containerRef.current && scrollPosition >= containerRef.current.scrollWidth - containerRef.current.clientWidth}
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            </div>
        </section>
    )
}
