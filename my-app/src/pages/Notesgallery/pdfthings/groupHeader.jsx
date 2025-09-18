import React from 'react';
import { FileText } from 'lucide-react';

const GroupHeader = ({ group }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    console.log(group)

    return (
        <div className="bg-zinc-900 shadow-xl rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100 mb-2">
                            {group[0]?.title}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                            {group[0]?.description}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2">
                        <span className="text-2xl font-bold text-indigo-400">{group[0]?.clouduploads.length}</span>
                        <p className="text-sm text-gray-400">PDFs</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-700">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Uploaded by</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {group[0]?.uploaderName.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-200 font-medium">{group[0]?.uploaderName}</p>
                            <p className="text-gray-400 text-sm">{group[0]?.uploaderEmail}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Upload Date</h3>
                    <p className="text-gray-200 text-lg font-medium">
                        {formatDate(group[0]?.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GroupHeader;