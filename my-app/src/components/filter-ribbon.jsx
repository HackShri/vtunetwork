"use client"

import { useState } from "react"
import { MessageCircle, Send, ChevronDown } from "lucide-react"
import { branches } from "@/common/data"

export default function FilterRibbon({ selectedBranch, selectedType, onBranchChange, onTypeChange }) {
    const [showConnectMenu, setShowConnectMenu] = useState(false)
    const [showBranchMenu, setShowBranchMenu] = useState(false)
    const [showTypeMenu, setShowTypeMenu] = useState(false)

    const types = ["Notes", "Lab Notes", "Question Papers"]

    return (
        <div className="sticky top-[73px] z-40 bg-gray-900 border-b border-gray-800">
            <div className="px-4 md:px-8 lg:px-12 py-4">
                <div className="flex flex-wrap gap-3">
                    {/* Connect Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowConnectMenu(!showConnectMenu)
                                setShowBranchMenu(false)
                                setShowTypeMenu(false)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Connect
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showConnectMenu && (
                            <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[180px]">
                                <a
                                    href="https://wa.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5 text-green-500" />
                                    <span>WhatsApp</span>
                                </a>
                                <a
                                    href="https://t.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
                                >
                                    <Send className="w-5 h-5 text-blue-500" />
                                    <span>Telegram</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Branch Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowBranchMenu(!showBranchMenu)
                                setShowConnectMenu(false)
                                setShowTypeMenu(false)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Branch: {selectedBranch ? branches.find(b => b.id === selectedBranch)?.name : "Select"}
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showBranchMenu && (
                            <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[180px]">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => {
                                            onBranchChange(branch.id)
                                            setShowBranchMenu(false)
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md transition-colors ${
                                            selectedBranch === branch.id ? "bg-gray-700 font-medium" : ""
                                        }`}
                                    >
                                        {branch.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Type Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowTypeMenu(!showTypeMenu)
                                setShowConnectMenu(false)
                                setShowBranchMenu(false)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            {selectedType || "Select Type"}
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showTypeMenu && (
                            <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[180px]">
                                {types.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            onTypeChange(type)
                                            setShowTypeMenu(false)
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md transition-colors ${
                                            selectedType === type ? "bg-gray-700 font-medium" : ""
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
