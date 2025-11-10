import { useEffect, useState } from "react";
import {
    Download, Eye, Filter, ChevronLeft, ChevronRight,
    ChevronDown, X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { branches, semesters, getSubjects, getSubjectCode } from "@/common/data";
import { fetchQPs, setFilters, clearFilters } from "@/Redux/questionPapers";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function QuestionPapersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { papers = [], loading, error, filters } = useSelector(
        (state) => state.questionPapers
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const notesPerPage = 6;
    const totalPages = Math.ceil((papers?.length || 0) / notesPerPage);
    const startIndex = (currentPage - 1) * notesPerPage;
    const currentNotes = papers?.slice(startIndex, startIndex + notesPerPage) || [];

    // ⏳ Fetch when filters change
    useEffect(() => {
        dispatch(fetchQPs(filters));
    }, [filters.branch, filters.semester, filters.subject, filters.subjectCode]);

    // 🎯 Apply filters from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const branch = params.get("branch") || "";
        const semester = params.get("semester") || "";
        const subject = params.get("subject") || "";
        const subjectCode = params.get("subjectCode") || "";
        const type = "questionpaper";
        if (filters.type) params.append("type", filters.type)
        if (branch || semester || subject || subjectCode) {
            dispatch(setFilters({ branch, semester, subject, subjectCode, type }));
        } else {
            dispatch(setFilters({ type }));
        }
        setCurrentPage(1);
    }, [location.search]);

    const handleFilterChange = (key, value) => {
        if (key === "branch" || key === "semester") {
            dispatch(setFilters({ [key]: value, subject: "", subjectCode: "" }));
        } else if (key === "subject") {
            const subjectCode = getSubjectCode(filters.branch, value || "");
            dispatch(setFilters({ subject: value, subjectCode: subjectCode || "" }));
        } else {
            dispatch(setFilters({ [key]: value }));
        }
        setCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some((f) => f && f !== "questionpaper");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-white text-2xl mb-3">Engineering Question Papers</h1>

                {/* Filters Toggle */}
                <div className="mb-6 flex items-center justify-between">
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
                                {Object.values(filters).filter((f) => f && f !== "questionpaper").length}
                            </span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                    </Button>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dispatch(clearFilters())}
                            className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                    <div className="mt-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
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
                                        {filters.branch && filters.semester &&
                                            getSubjects(filters.branch, filters.semester).map((subject) => (
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
                                    className="w-full h-9 px-3 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-slate-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {loading ? (
                    <p className="text-center text-slate-400 mt-10">
                        Loading question papers...
                    </p>
                ) : error ? (
                    <p className="text-center text-red-400 mt-10">Error: {error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-6">
                        {Array.isArray(currentNotes) && currentNotes.length > 0 ? (
                            currentNotes.map((note, index) => (
                                <div
                                    key={index}
                                    className="group cursor-pointer bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                                            {note.title
                                                ? note.title[0].toUpperCase() + note.title.slice(1)
                                                : "Untitled"}
                                        </h3>
                                        <div className="space-y-1 text-sm text-slate-400 mt-2">
                                            <p>
                                                <span className="text-slate-300">Subject:</span>{" "}
                                                {note.subjectName || "N/A"}
                                            </p>
                                            <p>
                                                <span className="text-slate-300">Code:</span>{" "}
                                                {note.subjectCode || "—"}
                                            </p>
                                            {note.uploadedBy && (
                                                <p>
                                                    <span className="text-slate-300">By:</span>{" "}
                                                    {note.uploadedBy}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                                        <span>{note.downloadCount || 0} downloads</span>
                                        <span>
                                            {note.uploadDate
                                                ? new Date(note.uploadDate).toLocaleDateString()
                                                : "—"}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => navigate("/previewpath/" + note._id)}
                                        size="sm"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                    </Button>
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div className="text-center text-slate-400 mt-10">
                                    No question papers found.
                                </div>
                            )
                        )}
                    </div>
                )}


                {/* Pagination */}
                {(papers?.length || 0) > notesPerPage && (
                    <div className="flex items-center justify-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-slate-600 text-black hover:text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={
                                    currentPage === page
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "border-slate-600 text-black hover:bg-slate-700"
                                }
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border-slate-600 text-black hover:text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                )}

                <div className="text-center mt-4 text-sm text-slate-400">
                    Showing {startIndex + 1}-{Math.min(startIndex + notesPerPage, papers?.length || 0)} of {papers?.length || 0} papers
                </div>
            </div>
        </div>
    );
}
