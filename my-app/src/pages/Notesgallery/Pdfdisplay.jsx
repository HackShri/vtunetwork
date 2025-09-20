"use client"

import { useDebugValue, useEffect, useRef, useState } from "react"
import { FileText, Star, Download, User, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { branches } from "@/common/data"
import { useDispatch } from "react-redux"
import { fetchUserPdfs } from "@/Redux/userPdfs"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { FaGreaterThan } from "react-icons/fa"
// Dummy data

export function NoteCard({ note, isOfficial = false }) {
    const navigate = useNavigate()
    console.log(note, note?.uploaderName, note?.createdAt?.split('T'))

    return (
        <Card className="bg-gray-900 flex-shrink-0 w-[300px] border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                            <FileText className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-100 text-sm leading-tight group-hover:text-white transition-colors">
                                {note?.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{note?.subjectName}</p>
                        </div>
                    </div>
                    {isOfficial && (
                        <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                            Official
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{note?.uploaderName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(note?.createdAt?.split('T')[0]).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-300">{note?.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Download className="h-3 w-3" />
                                <span>{note?.downloads}</span>
                            </div>
                        </div>
                        <Button onClick={() => { note?.uploads == 'grouped' ? navigate('/groupupload/' + note._id) : navigate('/previewpath/' + note?._id) }} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7">
                            View PDF
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function Pdfdisplay() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [selectedBranch, setSelectedBranch] = useState("")
    const [selectedSemester, setSelectedSemester] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("")
    const [filteredUserNotes, setfilteredUserNotes] = useState([])
    const notesRef = useRef()
    useEffect(() => {
        async function fetchQuerypdf() {
            try {
                console.log(selectedBranch, selectedSemester, selectedSubject)
                const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
                let response = await fetch(`${API_BASE}/api/user/filter?branch=${selectedBranch}&semester=${selectedSemester}&subject=${selectedSubject}`)
                let data = await response.json()
                console.log(data)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchQuerypdf()

    }, [selectedBranch, selectedSemester, selectedSubject])
    useEffect(() => {
        console.log('hello user bro ')
        dispatch(fetchUserPdfs()).then((result) => {
            console.log(result.payload)
            if (result.payload.success) {
                console.log(result.payload.data)
                setfilteredUserNotes(result.payload.data)
            }
        }).catch((err) => {

        });
    }, [])

    const availableSubjects =
        selectedBranch && selectedSemester
            ? subjects[selectedBranch]?.[Number.parseInt(selectedSemester)] || []
            : []

    const filteredOfficialNotes = officialNotes.filter((note) => {
        if (selectedBranch && note.branch !== selectedBranch) return false
        if (selectedSemester && note.semester !== Number.parseInt(selectedSemester)) return false
        if (selectedSubject && note.subject !== selectedSubject) return false
        return true
    })

    // const filteredUserNotes = userNotes.filter((note) => {
    //     if (selectedBranch && note.branch !== selectedBranch) return false
    //     if (selectedSemester && note.semester !== Number.parseInt(selectedSemester)) return false
    //     if (selectedSubject && note.subject !== selectedSubject) return false
    //     return true
    // })
    function handleClick() {
        const element = notesRef.current
        const computedStyle = window.getComputedStyle(element);
        const matrix = new DOMMatrix(computedStyle.transform);
        console.log(matrix)
        const currentTranslateX = matrix.m41; // Current translateX
        const newTranslateX = currentTranslateX - 120;

        element.style.transform = `translateX(${newTranslateX}px)`;



    }

    return (
        <div className="min-h-[200vh] bg-gray-950 text-gray-100">
            {/* Navbar */}
            <Header></Header>
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
                <div className="mb-3">
                    <h2 className="text-3xl font-bold text-white mb-2">Engineering Notes</h2>
                    <p className="text-gray-400">Find and download study materials for your courses</p>
                </div>

                {/* Filters */}
                {/* <div className="bg-gray-900 rounded-lg p-4 mb-3 border border-gray-800">
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
                </div> */}

                {/* Official Notes Section */}
                <div className="mb-12 flex flex-col gap-3">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-600/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Official Notes</h3>
                        <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                            {filteredOfficialNotes.length} notes
                        </Badge>
                    </div>
                    {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 */}
                    <div className="relative  w-auto h-auto overflow-hidden">
                        {filteredOfficialNotes.length > 0 ? (
                            <div ref={notesRef} className="relative transition-all  flex gap-4  ">
                                {filteredOfficialNotes.map((note) => (
                                    <NoteCard key={note.id} note={note} isOfficial={true} />
                                ))}


                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No official notes found for the selected filters</p>
                            </div>
                        )}

                        <div className="w-16 flex items-center bg-gray-900 h-full top-0 left-[95%] absolute ">
                            <Button className='flex flex-col' onClick={() => navigate('/search')}>
                                <FaGreaterThan className='w-full'> See More </FaGreaterThan>
                                <span>
                                    See More
                                </span>
                            </Button>

                        </div>

                    </div>


                </div>

                {/* User-Uploaded Notes Section */}
                <div>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">User-Uploaded Notes</h3>
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                            {filteredUserNotes.length} notes
                        </Badge>
                    </div>

                    {filteredUserNotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUserNotes.map((note) => (
                                <NoteCard key={note.id} note={note} isOfficial={false} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No user-uploaded notes found for the selected filters</p>
                        </div>
                    )}
                </div>

                {/* <div>
                    <div className="flex items-center space-x-3 mb-6 mt-5">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">User-Group-Uploaded Notes</h3>
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                            {filteredUserNotes.length} notes
                        </Badge>
                    </div>

                    {filteredUserNotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUserNotes.map((note) => (
                                <NoteCard key={note.id} note={note} isOfficial={false} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No user-uploaded notes found for the selected filters</p>
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    )
}
