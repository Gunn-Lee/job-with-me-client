"use client";

import { FiUpload, FiFile, FiTrash, FiCheckCircle } from "react-icons/fi";

interface Resume {
  id: number;
  name: string;
  size: string;
}

interface ResumeUploadProps {
  resumes: Resume[];
  activeResumeId: number;
  onUpload: (file: File) => void;
  onDelete: (id: number) => void;
  onSetActive: (id: number) => void;
}

export default function ResumeUpload({ 
  resumes, 
  activeResumeId,
  onUpload, 
  onDelete,
  onSetActive 
}: ResumeUploadProps) {
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Resume Management</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Upload Component */}
        <div className="w-full md:w-1/3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FiUpload className="mx-auto text-gray-400 text-3xl mb-2" />
            <p className="text-sm text-gray-500 mb-4">Upload up to 3 resumes</p>
            <p className="text-xs text-gray-400 mb-4">Supported formats: PDF, DOCX (Max 5MB)</p>
            <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer">
              Select File
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx"
                onChange={handleUpload}
                disabled={resumes.length >= 3}
              />
            </label>
            {resumes.length >= 3 && (
              <p className="text-xs text-red-500 mt-2">Maximum of 3 resumes reached</p>
            )}
          </div>
        </div>
        
        {/* Resume List */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between mb-3">
            <h3 className="text-md font-medium">Your Resumes</h3>
            <p className="text-xs text-gray-500">Click a resume to set as default</p>
          </div>
          
          {resumes.length === 0 ? (
            <p className="text-sm text-gray-500">No resumes uploaded yet</p>
          ) : (
            <ul className="space-y-2">
              {resumes.map(resume => {
                const isActive = resume.id === activeResumeId;
                return (
                  <li 
                    key={resume.id} 
                    className={`border rounded-md p-3 flex justify-between items-center transition-colors border-gray-200 hover:bg-gray-50`}
                    
                  >
                    <div className="flex items-center cursor-pointer hover:drop-shadow" onClick={() => onSetActive(resume.id)}>
                      <FiFile className={`mr-2 text-blue-500'`} />
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium">{resume.name}</p>
                          {isActive && (
                            <span className="ml-2 flex items-center text-green-600 text-xs">
                              <FiCheckCircle className="mr-1" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{resume.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent setting as active when clicking delete
                        onDelete(resume.id);
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FiTrash />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}