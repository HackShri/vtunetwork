import { X, Pencil } from 'lucide-react'
import { StarRating } from './Starrating'

export default function ReviewCard({ review, currentUserId, onDelete, onEdit }) {
    const isOwner = currentUserId?.userID === review?.userId
    return (
        <div className="bg-[#131C2A] rounded-xl p-4 border border-zinc-700">
            {/* Header: Reviewer Name + Date + Rating */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-100">{review?.reviewerName}</h4>
                    <p className="text-sm text-gray-400">
                        {review?.createdAt?.split('T')[0]}
                    </p>
                </div>
                <StarRating rating={review?.rating} readonly size="sm" />
            </div>

            {/* Review Content */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{review?.content}</p>

            {/* Edit & Delete Buttons at the Bottom */}
            {isOwner && (
                <div className="flex w-full gap-2 justify-between       p-2 border-t border-zinc-700 mt-2">
                    <button
                        onClick={() => onEdit(review)}
                        className="flex items-center text-blue-400 hover:text-blue-500 text-sm"
                    >
                        <Pencil size={16} className="mr-1" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(review._id)}
                        className="flex items-center text-red-400 hover:text-red-500 text-sm"
                    >
                        <X size={16} className="mr-1" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}
