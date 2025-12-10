const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
"use client"
import { useEffect, useState } from "react"
import {
    Download,
    Calendar,
    FolderOpen,
    FileType,
    User,
    Mail,
    MessageSquare,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./pdfthings/Starrating"
import { MoreNotesCard } from "./pdfthings/more_notes"
import ReviewCard from "./pdfthings/review_card"
import { useParams, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { useSelector } from "react-redux"
import { NoteCard } from "./Pdfdisplay"
import { useToast } from "../../hooks/use-toast"
// Mock Data
const pdfData = {
    id: 1,
    title: "Advanced Database Management Systems - Complete Guide",
    description:
        "Comprehensive notes covering advanced DBMS concepts including query optimization, transaction management, concurrency control, and distributed databases. Perfect for semester exams and interview preparation.",
    tags: ["Database", "DBMS", "SQL", "NoSQL", "Transactions"],
    uploader: {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
    },
    uploadDate: "2024-01-15",
    fileType: "PDF",
    folder: "Computer Science / Semester 5",
    pdfUrl: "/placeholder.pdf",
    rating: 4.6,
    totalRatings: 127,
}

const moreNotes = [
    { id: 2, title: "Operating Systems Fundamentals" },
    { id: 3, title: "Computer Networks Protocol Stack" },
    { id: 4, title: "Software Engineering Best Practices" },
    { id: 5, title: "Data Structures and Algorithms" },
    { id: 6, title: "Machine Learning Basics" },
    { id: 7, title: "Web Development with React" },
]
export default function PDFPreviewPage() {
    const { toast } = useToast()
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector(state => state?.Authproject)
    const [userRating, setUserRating] = useState(0)
    const [reviewDisplay, setreviewDisplay] = useState({
        averageRating: 0,
        totalRating: 0
    })
    const [options, setoptions] = useState({
        name: 'submit',
        reviewId: ''
    })
    const [additionalNotes, setadditionalNotes] = useState([])
    const [reviewText, setReviewText] = useState("")
    const [reviews, setReviews] = useState([])
    const [pdfs, setpdfs] = useState(null)
    useEffect(() => {
        async function fetchPdfs() {
            let response = await fetch(`${API_BASE}/api/user/fetchPdfs`)
            let data = await response.json()
            if (data) {
                setadditionalNotes(data.data)
                console.log(data.data, "Hello world")
            }
        }
        fetchPdfs()
    }, [])
    useEffect(() => {
        async function fetchPdf() {
            if (id) {
                try {
                    let response = await fetch(`${API_BASE}/api/user/fetchPdf/` + id, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })

                    if (!response.ok) {
                        const errorText = await response.text()
                        console.error('HTTP error response:', errorText)
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    let data = await response.json()

                    if (data && data.success && data.data && data.data.length > 0) {
                        setpdfs(data.data[0])
                    } else {
                        console.error('No PDF data found:', data)
                    }
                } catch (error) {
                    console.error('Error fetching PDF:', error)
                }
            }
        }
        fetchPdf();
    }, [id, API_BASE])
    useEffect(() => {
        async function fetchreviews() {
            if (id) {
                try {
                    const url = `${API_BASE}/api/user/reviews/fetchReview/` + id;
                    console.log('Fetching reviews from:', url);
                    let reviews = await fetch(url, {
                        credentials: 'include'
                    })
                    console.log('Fetch reviews response status:', reviews.status);
                    if (!reviews.ok) {
                        const errorText = await reviews.text();
                        console.error('Failed to fetch reviews:', reviews.status, errorText);
                        return;
                    }
                    let reviewData = await reviews.json()
                    console.log('Fetched review data:', reviewData);
                    if (reviewData) {
                        setReviews(reviewData?.data || [])
                        const { avgRating, ratingsCount } = reviewData.aggregate || {}
                        setreviewDisplay({
                            averageRating: avgRating || 0,
                            totalRating: ratingsCount || 0
                        })
                    }
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            } else {
                console.warn('No id found in route params, cannot fetch reviews');
            }
        }
        fetchreviews()
    }, [id])
    async function handleOnEdit(review) {
        // If already editing this same review, toggle back to "Submit"
        if (options.name === 'Edit' && options.reviewId === review._id) {
            setoptions({ name: 'submit', reviewId: null })
            setReviewText("")
            setUserRating(0)
            return
        }
        // Enter edit mode for the selected review
        setoptions({
            name: 'Edit',
            reviewId: review._id
        })
        setReviewText(review.content)
        setUserRating(review.rating)
    }
    async function handleOnDelete(id) {
        try {
            let response = await fetch(`${API_BASE}/api/user/reviews/` + id, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Delete review error:', response.status, errorText);
                throw new Error(`Failed to delete review: ${response.status}`);
            }
            let data = await response.json()
            setReviews(prevReviews => prevReviews.filter(review => review._id !== id));

            toast({
                title: "Review Deleted",
                description: "Your review was successfully deleted.",
            })

        } catch (error) {
            console.error('Delete review error:', error.message);
            toast({
                variant: "destructive",
                title: "Delete Failed",
                description: error.message || "Failed to delete review.",
            });
        }
    }
    const handleSubmitReview = async () => {
        const userId = user?._id || user?.user?.userID;

        // Normalize fetched review userId formats
        const alreadyReviewed = reviews.some(
            (r) =>
                r.userId === userId ||
                r.user_id === userId ||
                r.userId?._id === userId ||
                r.userId?.toString() === userId
        );

        // Prevent duplicate review in create mode
        if (!options.reviewId && alreadyReviewed) {
            toast({
                variant: "destructive",
                title: "Already Reviewed",
                description: "You've already submitted a review. You can edit it instead.",
            });
            return;
        }

        // ----------------------- EDIT MODE -----------------------
        if (options.name === "Edit") {
            try {
                const payload = {
                    reviewId: options.reviewId,
                    content: reviewText,
                    rating: userRating,
                };

                const response = await fetch(`${API_BASE}/api/user/reviews/reviewEdit`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error("Failed to update review");

                const updated = await response.json();

                setReviews((prev) =>
                    prev.map((r) =>
                        r._id === options.reviewId ? { ...r, ...updated.review } : r
                    )
                );

                toast({
                    title: "Review Updated",
                    description: "Your review was successfully edited.",
                });

                setoptions({ name: "submit", reviewId: null });
                setReviewText("");
                setUserRating(0);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Edit Failed",
                    description: error.message || "Something went wrong.",
                });
            }
            return;
        }

        // ----------------------- CREATE MODE -----------------------
        try {
            if (!id) {
                throw new Error("Missing upload ID");
            }

            const payload = {
                id, // Backend expects `id` in the payload
                content: reviewText,
                rating: userRating,
            };

            console.log('Submitting review with payload:', payload);
            console.log('API endpoint:', `${API_BASE}/api/user/reviews`);

            const response = await fetch(`${API_BASE}/api/user/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Review submission error:', response.status, errorText);
                throw new Error(`Review submission failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Review submission success:', data);

            setReviews((prev) => [data.review, ...prev]);

            toast({
                title: "Review Submitted",
                description: "Thanks for your feedback!",
            });

            setReviewText("");
            setUserRating(0);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Submit Failed",
                description: error.message || "Something went wrong.",
            });
        }
    };



    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Left - PDF Viewer */}
                    <div className="flex-1 lg:w-2/3">
                        <div className="bg-[#131C2A] rounded-2xl p-6 shadow-lg border border-zinc-800">
                            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
                            <div className="bg-zinc-800 rounded-xl overflow-hidden" style={{ height: "600px" }}>
                                {pdfs?.clouduploads && pdfs.clouduploads.length > 0 ? (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">
                                            PDF URL: {pdfs.clouduploads[0].secure_url}
                                        </p>
                                        <iframe
                                            src={`${pdfs.clouduploads[0].secure_url}#toolbar=0&navpanes=0&scrollbar=0`}
                                            className="w-[100%] h-[600px]"
                                            frameBorder="0"
                                            title="PDF Preview"
                                            onError={(e) => {
                                                console.error('PDF iframe failed to load:', e);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <div className="text-center">
                                            <p className="text-lg mb-2">No PDF available</p>
                                            <p className="text-sm">The PDF file could not be loaded</p>
                                            <p className="text-xs mt-2">PDFs object: {JSON.stringify(pdfs)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right - Metadata + Actions */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#131C2A] rounded-2xl p-6 shadow-lg border border-zinc-800 space-y-6">
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-2xl font-bold mb-3">{pdfs?.title ? pdfs.title.charAt(0).toUpperCase() + pdfs.title.slice(1) : 'Untitled'}</h1>
                                <p className="text-sm text-gray-400">{pdfs?.description ? pdfs.description.charAt(0).toUpperCase() + pdfs.description.slice(1) : 'No description available'}</p>
                            </div>

                            {/* Tags */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {pdfs?.tags?.map((tag, index) => (
                                        <Badge key={index} className="bg-blue-600 text-white  text-xs px-3 py-1 rounded-full">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Uploader Info */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-300">Uploader Information</h3>
                                <div className="text-sm flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>{pdfs?.uploaderName}</span>
                                </div>
                                <div className="text-sm flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{pdfs?.uploaderEmail}</span>
                                </div>
                            </div>

                            {/* File Details */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-300">File Details</h3>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Uploaded on {new Date(pdfs?.createdAt?.split('T')[0]).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <FileType className="w-4 h-4 text-gray-400" />
                                    <span>{pdfs?.fileType} Document</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <FolderOpen className="w-4 h-4 text-gray-400" />
                                    <span>{pdfs?.branch?.toUpperCase()}/{pdfs?.subjectName}</span>
                                </div>
                            </div>
                            {/* Download Button */}
                            {pdfs?.clouduploads && pdfs.clouduploads.length > 0 ? (
                                <a className="mt-2 block" href={pdfs.clouduploads[0].secure_url} download={true} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full bg-blue-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </a>
                            ) : (
                                <Button disabled className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold">
                                    <Download className="w-4 h-4 mr-2" />
                                    PDF Not Available
                                </Button>
                            )}
                            {/* Rating Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-300">Rate this document</h3>
                                <div className="flex items-center space-x-3">
                                    <StarRating rating={userRating} onRatingChange={setUserRating} />
                                    <span className="text-sm text-gray-400">
                                        {userRating > 0 ? `${userRating}/5` : "Click to rate"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <StarRating rating={reviewDisplay.averageRating} readonly size="sm" />
                                    <span>{reviewDisplay.averageRating}({reviewDisplay.totalRating} ratings)</span>
                                </div>
                            </div>

                            {/* Review Form */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Write a Review</span>
                                </h3>
                                <Textarea
                                    placeholder="Share your thoughts about this document..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-gray-100 rounded-xl resize-none"
                                    rows={3}
                                />
                                <Button
                                    onClick={handleSubmitReview}
                                    disabled={!reviewText.trim() || userRating === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl"
                                >
                                    {options.name === 'submit' ? "Submit Review" : "Edit Review"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review, index) => (
                            <ReviewCard onEdit={handleOnEdit} onDelete={handleOnDelete} currentUserId={user?.user} key={index} review={review} />
                        ))}
                    </div>
                </div>

                {/* More Notes */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">More Notes</h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {additionalNotes.map((note, index) => (
                            <div
                                key={index}
                                className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
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
                </div>
            </div>
        </div>
    )
}
