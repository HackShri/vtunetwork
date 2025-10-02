// src/components/SubjectSlider.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// (ChevronLeftIcon and ChevronRightIcon components remain the same)
const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /> </svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /> </svg> );

const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const SubjectSlider = ({ semester, items, selectedBranch }) => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    // STATE for arrow visibility
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // FUNCTION to check scroll position and update arrow state
    const checkForScrollability = () => {
        const el = scrollContainerRef.current;
        if (el) {
            const hasOverflow = el.scrollWidth > el.clientWidth;
            setCanScrollLeft(el.scrollLeft > 0);
            // Check if we are scrolled to the very end (with a 1px tolerance for subpixel rendering)
            setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        }
    };

    // EFFECT to add/remove event listeners for scroll and resize
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkForScrollability(); // Initial check
            el.addEventListener('scroll', checkForScrollability);
            window.addEventListener('resize', checkForScrollability);

            return () => {
                el.removeEventListener('scroll', checkForScrollability);
                window.removeEventListener('resize', checkForScrollability);
            };
        }
    }, [items]); // Rerun if the list of items changes

    if (!items || items.length === 0) {
        return null;
    }
    
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">{semester.toUpperCase()}</h3>
                <button 
                    onClick={() => navigate(`/notes?branch=${selectedBranch}&semester=${encodeURIComponent(semester)}`)} 
                    className="text-sm text-gray-300 hover:text-white"
                >
                    View All
                </button>
            </div>
            <div className="relative group">
                {/* CONDITIONALLY render left arrow */}
                {canScrollLeft && (
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-full z-20 text-white bg-gradient-to-r from-gray-800 to-transparent px-4 cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center"
                    >
                        <ChevronLeftIcon />
                    </button>
                )}

                {/* The Scrollable List - FIX APPLIED (px-4) */}
                <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar gap-4 py-4 px-4">
                    {items.map(({ subjectName, code }) => (
                        <button
                            key={code + subjectName}
                            onClick={() => navigate(`/notes?branch=${selectedBranch}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subjectName)}`)}
                            className="card-spotlight relative min-w-[220px] md:min-w-[260px] lg:min-w-[300px] rounded-xl border border-gray-700 bg-gray-900 px-6 py-8 text-left transition-all duration-300 ease-in-out hover:bg-gray-800 hover:border-gray-500 hover:scale-105 hover:z-10"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="text-xl md:text-2xl font-extrabold text-white tracking-wide">{code}</div>
                            <div className="mt-2 text-sm md:text-base text-gray-300 line-clamp-2">{subjectName}</div>
                        </button>
                    ))}
                </div>
                
                {/* CONDITIONALLY render right arrow */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-full z-20 text-white bg-gradient-to-l from-gray-800 to-transparent px-4 cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center"
                    >
                        <ChevronRightIcon />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SubjectSlider;