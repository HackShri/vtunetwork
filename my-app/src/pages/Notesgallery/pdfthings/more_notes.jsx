import { FileText, Eye } from "lucide-react"


export function MoreNotesCard({ note }) {
    return (
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group cursor-pointer">
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 bg-zinc-700 rounded-lg group-hover:bg-zinc-600 transition-colors">
                    <FileText className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-medium text-gray-100 text-sm leading-tight group-hover:text-white transition-colors">
                    {note.title}
                </h3>
                <div className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    <Eye className="h-3 w-3" />
                    <span>View PDF</span>
                </div>
            </div>
        </div>
    )
}
