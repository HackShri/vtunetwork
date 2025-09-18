import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NoteCard } from "./Pdfdisplay";
import { Badge } from "@/components/ui/badge";
import { branches } from "@/common/data";
import { subjects } from "@/common/data";

function Adminnotes() {
    const dispatch = useDispatch()
    const [selectedBranch, setSelectedBranch] = useState("")
    const [selectedSemester, setSelectedSemester] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("")
    const [filteredUserNotes, setfilteredUserNotes] = useState([])

    const availableSubjects =
        selectedBranch && selectedSemester
            ? subjects[selectedBranch]?.[Number.parseInt(selectedSemester)] || []
            : []
    const officialNotes = [
        {
            id: 1,
            title: "Complete Database Systems Notes",
            subject: "Database Systems",
            uploader: "Dr. Sarah Johnson",
            rating: 4.8,
            downloads: 1250,
            uploadDate: "2024-01-15",
            branch: "cse",
            semester: 3,
        },
        {
            id: 2,
            title: "Machine Learning Fundamentals",
            subject: "Machine Learning",
            uploader: "Prof. Michael Chen",
            rating: 4.9,
            downloads: 980,
            uploadDate: "2024-01-20",
            branch: "aiml",
            semester: 3,
        },
        {
            id: 3,
            title: "Digital Signal Processing Guide",
            subject: "DSP",
            uploader: "Dr. Emily Rodriguez",
            rating: 4.7,
            downloads: 756,
            uploadDate: "2024-01-18",
            branch: "ece",
            semester: 4,
        },
        {
            id: 3,
            title: "Digital Signal Processing Guide",
            subject: "DSP",
            uploader: "Dr. Emily Rodriguez",
            rating: 4.7,
            downloads: 756,
            uploadDate: "2024-01-18",
            branch: "ece",
            semester: 4,
        },
        {
            id: 3,
            title: "Digital Signal Processing Guide",
            subject: "DSP",
            uploader: "Dr. Emily Rodriguez",
            rating: 4.7,
            downloads: 756,
            uploadDate: "2024-01-18",
            branch: "ece",
            semester: 4,
        },
    ]
    return <div>
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Navbar */}
            {/* <nav className="bg-gray-900 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <BookOpen className="h-8 w-8 text-blue-400" />
                                <h1 className="text-xl font-bold text-white">StudyNotes</h1>
                            </div>
                            <div className="hidden md:flex items-center space-x-6">
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Home
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Upload
                                </a>
                                <a href="/profile" className="text-gray-300 hover:text-white transition-colors">
                                    Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </nav> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}


                {/* Filters */}
                <div className="bg-gray-900 rounded-lg p-4 mb-3 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                            <Select
                                value={selectedBranch}
                                onValueChange={(value) => {
                                    setSelectedBranch(value)
                                    setSelectedSemester("")
                                    setSelectedSubject("")
                                }}
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id} className="text-gray-100 focus:bg-gray-700">
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                            <Select
                                value={selectedSemester}
                                onValueChange={(value) => {
                                    setSelectedSemester(value)
                                    setSelectedSubject("")
                                }}
                                disabled={!selectedBranch}
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 disabled:opacity-50">
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <SelectItem key={sem} value={sem.toString()} className="text-gray-100 focus:bg-gray-700">
                                            Semester {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedSemester}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 disabled:opacity-50">
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {availableSubjects.map((subject) => (
                                        <SelectItem key={subject} value={subject} className="text-gray-100 focus:bg-gray-700">
                                            {subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Official Notes Section */}
                <div className="mb-12 flex flex-col gap-3">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-600/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Official Notes</h3>
                        <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                            {officialNotes.length} notes
                        </Badge>
                    </div>
                    {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 */}
                    {officialNotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {officialNotes.map((note) => (
                                <NoteCard key={note.id} note={note} isOfficial={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No official notes found for the selected filters</p>
                        </div>
                    )}
                </div>


            </div>
        </div>



    </div>;
}

export default Adminnotes;
