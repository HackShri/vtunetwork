    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
"use client"

import { useEffect, useState } from "react"
import { Download, Eye, Filter, ChevronLeft, ChevronRight, ChevronDown, X, User, GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Header from "@/components/Header"
import { useNavigate } from "react-router-dom"
import { branches, semesters, subjects } from "@/common/data"

export default function NotesPage() {
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        branch: "",
        semester: "",
        subject: "",
        subjectCode: "",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)
    const [mockNotes, setmockNotes] = useState([])

    useEffect(() => {
        console.log("It is doing the thing bro okay ")
        const query = new URLSearchParams({
            branch: filters.branch || '',
            semester: filters.semester || '',
            subject: filters.subject || ''
        })
        async function fetchthedata() {
            let response = await fetch(`${API_BASE}/api/user/fetchPdfs?${query}`)
            let data = await response.json()

            if (data) {
                setmockNotes(data?.data)
            }
        }

        fetchthedata()
    }, [filters])
    // User profile setup dialog state
    const [showProfileDialog, setShowProfileDialog] = useState(true)
    const [userProfile, setUserProfile] = useState({
        branch: "",
        semester: "",
    })

    const notesPerPage = 6
    const totalPages = Math.ceil(mockNotes?.length / notesPerPage)
    const startIndex = (currentPage - 1) * notesPerPage
    const currentNotes = mockNotes?.slice(startIndex, startIndex + notesPerPage)

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setCurrentPage(1) // Reset to first page when filters change
    }

    const clearFilters = () => {
        setFilters({ branch: "", semester: "", subject: "", subjectCode: "" })
        setCurrentPage(1)
    }

    const hasActiveFilters = Object.values(filters).some((filter) => filter !== "")

    const handleProfileSubmit = () => {
        if (userProfile.branch && userProfile.semester) {
            // Set default filters based on user profile
            setFilters((prev) => ({
                ...prev,
                branch: userProfile.branch,
                semester: userProfile.semester,
            }))
            setShowProfileDialog(false)
        }
    }

    const handleProfileChange = (key, value) => {
        setUserProfile((prev) => ({ ...prev, [key]: value }))
    }
    console.log(mockNotes)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Profile Setup Dialog */}
            {/* <Dialog open={showProfileDialog} onOpenChange={() => { }}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <GraduationCap className="w-6 h-6 text-blue-400" />
                            Welcome to Study Notes
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Let's set up your profile to show you relevant notes
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">


                        <div>
                            <label className="text-sm font-medium text-slate-200 mb-2 block">Your Branch</label>
                            <Select onValueChange={(val) => handleProfileChange("branch", val)} value={userProfile.branch}>
                                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-10">
                                    <SelectValue placeholder="Select your branch" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-200 mb-2 block">Current Semester</label>
                            <Select onValueChange={(val) => handleProfileChange("semester", val)} value={userProfile.semester}>
                                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-10">
                                    <SelectValue placeholder="Select your semester" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    {semesters.map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                            {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleProfileSubmit}
                            disabled={!userProfile.branch || !userProfile.semester}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Get Started
                        </Button>
                    </div>
                </DialogContent>
            </Dialog> */}

            {/* Header */}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Compact Filter Toggle */}
                <h1 className="text-white text-2xl mb-3">Engineering Notes </h1>
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="border-slate-600 text-black-300 hover:text-white hover:bg-slate-700 flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {Object.values(filters).filter((f) => f !== "").length}
                                </span>
                            )}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        </Button>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Collapsible Filter Panel */}
                    {showFilters && (
                        <div className="mt-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* Branch */}
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Branch</label>
                                    <Select onValueChange={(val) => handleFilterChange("branch", val)} value={filters.branch}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-9 text-sm">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {branches.map((branch) => (
                                                <SelectItem key={branch.id} value={branch.id}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Semester */}
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Semester</label>
                                    <Select onValueChange={(val) => handleFilterChange("semester", val)} value={filters.semester}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-9 text-sm">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {semesters.map((sem) => (
                                                <SelectItem key={sem} value={sem}>
                                                    {sem}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Subject</label>
                                    <Select onValueChange={(val) => handleFilterChange("subject", val)} value={filters.subject}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-9 text-sm">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {filters.branch &&
                                                filters.semester &&
                                                subjects[filters.branch]?.[filters.semester]?.map((subject) => (
                                                    <SelectItem key={subject} value={subject}>
                                                        {subject}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Subject Code */}
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Subject Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CS301"
                                        value={filters.subjectCode}
                                        onChange={(e) => handleFilterChange("subjectCode", e.target.value)}
                                        className="w-full h-9 px-3 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-slate-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {Object.entries(filters).map(
                            ([key, value]) =>
                                value && (
                                    <span
                                        key={key}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                                    >
                                        <span className="capitalize">{key}:</span>
                                        <span>{value}</span>
                                        <button
                                            onClick={() => handleFilterChange(key, "")}
                                            className="hover:bg-blue-500/30 rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ),
                        )}
                    </div>
                )}

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentNotes.map((note, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
                        >
                            {/* Note Header */}
                            <div className="mb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                                        {note.title[0].toUpperCase() + note.title.slice(1,)}
                                    </h3>
                                    {/* <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${note.type === "Official"
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            }`}
                                    >
                                        {note.type}
                                    </span> */}
                                </div>

                                <div className="space-y-1 text-sm text-slate-400">
                                    <p>
                                        <span className="text-slate-300">Subject:</span> {note.subjectName}
                                    </p>
                                    <p>
                                        <span className="text-slate-300">Code:</span> {note.subjectCode}
                                    </p>
                                    {note.uploadedBy ? (
                                        <p>
                                            <span className="text-slate-300">By:</span> {note.uploadedBy}
                                        </p>
                                    ) : <p className="h-[20px]"></p>
                                    }
                                </div>
                            </div>

                            {/* Note Stats */}
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                                <span>{note.downloadCount || 23} downloads</span>
                                <span>{new Date(note.uploadDate).toLocaleDateString()}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button onClick={() => navigate("/previewpath/" + note._id)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                </Button>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-slate-600 text-black hover:text-black hover:bg-slate-700 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={
                                    currentPage === page
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "border-slate-600 text-black  hover:bg-slate-700"
                                }
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-slate-600 text-black hover:text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {/* Results Info */}
                <div className="text-center mt-4 text-sm text-slate-400">
                    Showing {startIndex + 1}-{Math.min(startIndex + notesPerPage, mockNotes.length)} of {mockNotes.length} notes
                </div>
            </div>
        </div>
    )
}
