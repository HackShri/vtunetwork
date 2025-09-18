    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'pdfFiles'
"use client"

import { useEffect, useState } from "react"
import { CloudUpload, FileText, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/Header"
import { branches, semesters, semSubjects, subjectCodeMap } from "@/common/data"
import { useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"


export default function FileUpload() {
    const { toast } = useToast()
    const user = useSelector(state => state?.Authproject?.user)
    const [uploading, setUploading] = useState(false)
    console.log(user)
    console.log()
    const [files, setFiles] = useState([])
    const [urls, setUrls] = useState([])
    const [displayTag, setdisplayTags] = useState([])
    const initialState = {
        title: "",
        branch: "",
        semester: "",
        subjectName: "",
        description: "",
        tags: "",
        subjectCode: ''
    }
    const [metadata, setMetadata] = useState(initialState)

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files)
        setFiles([...files, ...newFiles])
    }

    const removeFile = (index) => {
        const updated = [...files]
        updated.splice(index, 1)
        setFiles(updated)
    }

    const handleMetadataChange = (e) => {
        setMetadata({ ...metadata, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const { branch, semester, subjectName } = metadata;
        const code = subjectCodeMap?.[branch]?.[semester]?.[subjectName] || "";
        setMetadata(prev => ({ ...prev, subjectCode: code }));
    }, [metadata.branch, metadata.semester, metadata.subjectName]);

    const handleSubmit = async () => {
        if (!files || files.length === 0) {
            toast({
                variant: "destructive",
                title: "No files selected",
                description: "Please select at least one PDF file to upload.",
            });
            return;
        }

        setUploading(true);
        toast({
            title: "Uploading started",
            description: "Please wait while we upload your PDFs...",
        });

        const uploadedUrls = [];

        for (const file of files) {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', UPLOAD_PRESET);
            data.append('folder', UPLOAD_PRESET);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                    method: "POST",
                    body: data
                });
                const datas = await res.json();
                uploadedUrls.push({
                    public_id: datas.public_id,
                    secure_url: datas.secure_url,
                    normal_url: datas.normal_url,
                    original_filename: datas.original_filename,
                    asset_id: datas.asset_id
                });
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Upload failed",
                    description: `Failed to upload ${file.name}.`,
                });
                console.error(`Failed to upload ${file.name}:`, err);
            }
        }

        setUploading(false);
        setUrls(uploadedUrls);

        if (uploadedUrls.length === files.length) {
            toast({
                title: "Upload complete",
                description: `${uploadedUrls.length} file(s) uploaded successfully.`,
            });

            console.log("All uploaded URLs:", uploadedUrls);

            try {
                toast({
                    title: "Saving data",
                    description: "Sending file metadata to server...",
                });

                let response = await fetch(`${API_BASE}/api/user/metaUploads`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clouduploads: uploadedUrls,
                        ...metadata,
                        uploaderEmail: user?.email || user?.user?.email,
                        uploaderName: user?.username || user?.user?.username,
                        tags: displayTag
                    })
                });

                let data = await response.json();

                console.log(data, 'data befroe the toast ')
                toast({
                    title: "Submission successful",
                    description: "Your file metadata was submitted.",
                });
                if (data) {
                    window.location.reload()

                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Metadata upload failed",
                    description: "Error sending metadata to server.",
                });
                console.log(error.message);
            }
        } else {
            toast({
                variant: "destructive",
                title: "Mismatch in file count",
                description: "Not all files uploaded successfully.",
            });
        }
    };



    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex flex-col items-center gap-8 p-6 pt-12">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Upload Files
                    </h1>
                    <p className="text-slate-400 text-lg">Share your academic resources with the community</p>
                </div>

                {/* Main Upload Card */}
                <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-6">
                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <Label className="text-slate-200 text-sm font-medium mb-2 block">Title</Label>
                                <input
                                    name="title"
                                    value={metadata.title}
                                    onChange={handleMetadataChange}
                                    placeholder="Enter a descriptive title"
                                    className="w-full border border-slate-600/50 p-3 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                                />
                            </div>

                            {/* Branch */}
                            <div>
                                <Label className="text-slate-200 text-sm font-medium mb-2 block">Branch</Label>
                                <Select onValueChange={(val) => setMetadata((prev) => ({ ...prev, branch: val }))}>
                                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-12 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white rounded-xl">
                                        {branches.map((b, i) => (
                                            <SelectItem key={i} value={b.id} className="focus:bg-slate-700">
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Semester */}
                            <div>
                                <Label className="text-slate-200 text-sm font-medium mb-2 block">Semester</Label>
                                <Select onValueChange={(val) => setMetadata((prev) => ({ ...prev, semester: val }))}>
                                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-12 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Select Semester" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white rounded-xl">
                                        {semesters.map((sem, i) => (
                                            <SelectItem key={i} value={sem} className="focus:bg-slate-700">
                                                {sem}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>


                            {/* Subject */}
                            <div className="md:col-span-2">
                                <Label className="text-slate-200 text-sm font-medium mb-2 block">Subject</Label>
                                <Select onValueChange={(val) => setMetadata((prev) => ({ ...prev, subjectName: val }))}>
                                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white h-12 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white rounded-xl">
                                        {metadata.branch &&
                                            metadata.semester &&
                                            semSubjects?.[metadata.branch]?.[metadata.semester]?.map((subject, i) => (
                                                <SelectItem key={i} value={subject} className="focus:bg-slate-700">
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Subject Code  */}


                            <div>
                                <Label className="text-white">Subject Code</Label>
                                <div className="bg-slate-800 text-white px-4 py-2 rounded-lg">
                                    {metadata.subjectCode || "—"}
                                </div>
                            </div>
                            {/* Description */}
                            <div className="md:col-span-2">
                                <Label className="text-slate-200 text-sm font-medium mb-2 block">Description</Label>
                                <Textarea
                                    name="description"
                                    value={metadata.description}
                                    onChange={handleMetadataChange}
                                    placeholder="Provide a detailed description of the content..."
                                    className="w-full border border-slate-600/50 p-3 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none min-h-[100px] resize-none"
                                />
                            </div>


                            <div className="md:col-span-2">
                                <Label className="text-slate-200 text-sm font-medium mb-2 block">Tags</Label>
                                <Input
                                    name="tags"
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            setdisplayTags((prev => [...prev, metadata.tags]))
                                            setMetadata({ ...metadata, tags: '' })
                                        }

                                    }
                                    }

                                    value={metadata.tags}
                                    onChange={handleMetadataChange}
                                    placeholder="Provide a detailed description of the content..."
                                    className="w-full border border-slate-600/50 p-3 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none min-h-[50px] resize-none"
                                />
                            </div>

                        </div>
                        <div className="w-full flex gap-3  h-auto">
                            {
                                displayTag.map((items, index) => {
                                    return <div key={index} className="flex gap-2  p-2 items-center rounded-sm  bg-gray-300 ">
                                        {items}
                                        <X
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setdisplayTags(prev => prev.filter((_, i) => i !== index))
                                            }}
                                        />
                                    </div>

                                })
                            }
                        </div>

                        {/* File Upload Area */}
                        <div className="space-y-4">
                            <Label className="text-slate-200 text-sm font-medium">Upload Files</Label>
                            <label className="group w-full h-48 border-2 border-dashed border-slate-600/50 flex flex-col items-center justify-center gap-4 cursor-pointer bg-slate-700/20 rounded-2xl hover:border-blue-500/50 hover:bg-slate-700/30 transition-all duration-300">
                                <div className="p-4 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                                    <CloudUpload
                                        size={32}
                                        className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                                    />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-slate-200 font-medium">Drag & Drop or Click to Upload</p>
                                    <p className="text-slate-400 text-sm">PDF files only, up to 10MB each</p>
                                </div>
                                <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>

                        {/* File Preview */}
                        {files.length > 0 && (
                            <div className="space-y-3">
                                <Label className="text-slate-200 text-sm font-medium">Selected Files ({files.length})</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {files.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="group flex items-center gap-3 p-4 border border-slate-600/50 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200"
                                        >
                                            <div className="p-2 rounded-lg bg-red-500/10">
                                                <FileText className="text-red-400 w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-200 text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-slate-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button
                                                onClick={() => removeFile(idx)}
                                                className="p-1 rounded-full hover:bg-red-500/20 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4 text-red-400 hover:text-red-300" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                            >
                                Upload Files
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
