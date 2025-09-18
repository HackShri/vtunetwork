import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { StarRating } from './pdfthings/Starrating';
import { useParams } from 'react-router-dom';
import GroupHeader from './pdfthings/groupHeader';
import Header from '@/components/Header';
import { NoteCard } from './Pdfdisplay';

export default function PDFList() {
    const id = useParams()
    const [pdfs, setpdfs] = useState([])
    const [maindata, setmaindata] = useState({})
    useEffect(() => {
        const fetchPDFs = async () => {
            try {
                let response = await fetch('https://vtu-network.onrender.com/api/user/fetchpdf/' + id.id);
                let { data } = await response.json();
                if (data) {
                    console.log(data);
                    setpdfs(data[0].clouduploads);
                    setmaindata(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchPDFs();
    }, []);

    console.log(pdfs)
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };


    return (
        <div >

            <div className="mb-8 bg-gray-900 p-7">

                <GroupHeader group={maindata}></GroupHeader>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Notes </h2>

                {/* Mobile: Horizontal scroll */}


                {/* Desktop: Grid layout */}
                <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pdfs.map((pdf) => (
                        <div
                            key={pdf.id}
                            className="bg-zinc-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-700 hover:border-indigo-500/50"
                            onClick={() => onPDFSelect(pdf)}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-red-500/20 rounded-lg flex-shrink-0">
                                    <FileText className="w-8 h-8 text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{pdf.title}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-3">{pdf.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <StarRating rating={pdf.rating} readonly />
                                <span className="text-sm text-gray-400">{pdf.fileSize}</span>
                            </div>

                            {/* <div className="flex flex-wrap gap-2 mb-4">
                            {pdf.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div> */}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <span className="text-sm text-gray-400">{formatDate(pdf.uploadDate)}</span>
                                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    Preview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
