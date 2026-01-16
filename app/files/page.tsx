'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { File, Upload, FolderOpen, FileText, Clock, Search, Download, Trash2 } from 'lucide-react';

export default function FilesPage() {
    const { files, deleteFile } = useData();
    const [dragActive, setDragActive] = useState(false);

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                        <FolderOpen className="w-8 h-8 text-[#C7A252]" />
                        Document Storage
                    </h1>
                    <p className="text-[#5a6a7a] mt-1">Upload and manage case documents</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{files.length}</div>
                        <div className="text-sm text-[#8a95a3]">Total Files</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">
                            {new Set(files.map(f => f.fileType)).size}
                        </div>
                        <div className="text-sm text-[#8a95a3]">File Types</div>
                    </div>
                </div>

                <div className={`bg-white border-2 border-dashed rounded-xl p-8 mb-6 text-center ${dragActive ? 'border-[#C7A252]' : 'border-[#E5E7EB]'}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}>
                    <Upload className="w-12 h-12 text-[#C7A252] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#23313E] mb-2">Drop files here</h3>
                    <label className="px-6 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium cursor-pointer">
                        Choose Files
                        <input type="file" className="hidden" multiple />
                    </label>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b border-[#E5E7EB]">
                        <h3 className="font-semibold text-[#23313E]">Files</h3>
                    </div>
                    {files.length === 0 ? (
                        <div className="p-8 text-center">
                            <File className="w-12 h-12 text-[#8a95a3] mx-auto mb-4" />
                            <p className="text-[#5a6a7a]">No files yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E5E7EB]">
                            {files.map((file) => (
                                <div key={file.id} className="p-5 hover:bg-[#F8F9FA]">
                                    <div className="flex items-center gap-4">
                                        <FileText className="w-8 h-8 text-[#C7A252]" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-[#23313E]">{file.title}</h4>
                                            <div className="text-sm text-[#8a95a3]">{file.fileType} • {formatFileSize(file.size)}</div>
                                        </div>
                                        <button onClick={() => deleteFile(file.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
