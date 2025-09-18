import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import React from "react";
import { useSelector } from "react-redux";
import PDFUploadDialog from "./FileUpload";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const navigate = useNavigate()
    const authState = useSelector(state => state?.Authproject)
    const userFromStore = authState?.user || authState?.user?.user || {}
    const user = {
        name: userFromStore?.username || userFromStore?.name || "User",
        branch: userFromStore?.branch || "",
        semester: userFromStore?.semester || "",
        avatar: userFromStore?.image || "https://i.pravatar.cc/150?u=placeholder",
        bio: userFromStore?.bio || "",
        stats: {
            uploads: userFromStore?.uploadsCount || 0,
            downloads: userFromStore?.downloadsCount || 0,
            subjects: userFromStore?.subjectsCount || 0,
            lastUpload: userFromStore?.lastUpload || "",
        },
        uploads: userFromStore?.uploads || [],
    };

    return (
        <div className="bg-gray-900">


            <div className="max-w-6xl bg-gray-900 min-h-[100vh] mx-auto p-4">


                {/* Hero Profile Card */}
                <div className="flex items-center gap-6 p-6 bg-gray-800 rounded-2xl shadow-md mb-8">
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                    />
                    <div>
                        <h1 className="text-2xl text-gray-300 font-bold">{user.name}</h1>
                        <p className="text-gray-300">{user.branch} - Semester {user.semester}</p>
                        <p className="text-sm mt-2 text-gray-400">{user.bio}</p>

                    </div>
                </div>

                {/* Stats Section */}
                <div className="w-full h-[40px]">
                    <Button onClick={() => navigate('/uploads')} className="w-full">Upload Notes</Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 mt-3 text-white">
                    <StatCard label="Uploads" value={user.stats.uploads} />
                    <StatCard label="Downloads" value={user.stats.downloads} />
                    <StatCard label="Subjects Contributed" value={user.stats.subjects} />
                    <StatCard label="Last Upload" value={user.stats.lastUpload} />

                </div>

                {/* Upload Grid */}
                <div>
                    <h2 className="text-xl text-white  font-semibold mb-4">My Uploaded Notes</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.uploads.map((upload, idx) => (
                            <div key={idx} className="p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all text-white">
                                <h3 className="text-lg font-bold">{upload.title}</h3>
                                <p className="text-sm text-gray-300">{upload.subject}</p>
                                <p className="text-xs text-gray-400">Semester: {upload.semester}</p>
                                <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                                    View PDF
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="bg-gray-800 p-4 rounded-xl shadow text-center">
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>

);

export default UserProfile;
