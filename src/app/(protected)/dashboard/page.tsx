"use client";

import { useState } from "react";
import ResumeUpload from "@/components/dashboard/ResumeUpload";
import ResumeSummary from "@/components/dashboard/ResumeSummary";

export default function Dashboard() {
  const [resumes, setResumes] = useState([
    { id: 1, name: "Software_Engineer_Resume.pdf", size: "245KB" },
    { id: 2, name: "Product_Manager_Resume.pdf", size: "312KB" },
  ]);
  
  // Track the active/default resume by ID
  const [activeResumeId, setActiveResumeId] = useState(2); // Start with the second resume as active
  
  interface UploadFile {
    name: string;
    size: number;
  }

  const handleUpload = (file: UploadFile): void => {
    if (resumes.length < 3) {
      const newResumeId = Date.now();
      setResumes([...resumes, {
        id: newResumeId,
        name: file.name,
        size: `${Math.round(file.size / 1024)}KB`
      }]);
      // Set the newly uploaded resume as active
      setActiveResumeId(newResumeId);
    }
  };
  
  const handleDelete = (id: number): void => {
    setResumes(resumes.filter(resume => resume.id !== id));
    // If the active resume was deleted, set the most recent one as active
    if (id === activeResumeId && resumes.length > 1) {
      const mostRecentId = resumes
        .filter(resume => resume.id !== id)
        .sort((a, b) => b.id - a.id)[0].id;
      setActiveResumeId(mostRecentId);
    }
  };

  const handleSetActiveResume = (id: number): void => {
    setActiveResumeId(id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Resume Upload Component */}
      <ResumeUpload 
        resumes={resumes} 
        activeResumeId={activeResumeId}
        onUpload={handleUpload} 
        onDelete={handleDelete}
        onSetActive={handleSetActiveResume}
      />
      
      {/* Resume Summary Component */}
      <div className="mt-8">
        <ResumeSummary 
          
        />
      </div>
    </div>
  );
}