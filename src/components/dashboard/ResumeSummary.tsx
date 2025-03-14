export default function ResumeSummary() {
  // This would ideally be driven by data from the selected resume
  // For now, using static data for demonstration
  
  const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'Docker', 'Kubernetes', 'CI/CD', 'Agile'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Resume Summary</h2>
      
      <div className="space-y-6">
        
        <div>
          <h3 className="text-md font-medium mb-2">Experience</h3>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="mb-4">
              <div className="flex justify-between">
                <p className="font-medium">Senior Software Engineer</p>
                <p className="text-sm text-gray-500">2020 - Present</p>
              </div>
              <p className="text-sm">TechCorp Inc.</p>
              <p className="text-xs text-gray-600 mt-1">Led development of microservices architecture and mentored junior developers.</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">Software Developer</p>
                <p className="text-sm text-gray-500">2017 - 2020</p>
              </div>
              <p className="text-sm">InnoSoft Solutions</p>
              <p className="text-xs text-gray-600 mt-1">Developed full-stack applications using React and Node.js.</p>
            </div>
          </div>
        </div>
        
        
        <div>
          <h3 className="text-md font-medium mb-2">Skills</h3>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Education Summary */}
        <div>
          <h3 className="text-md font-medium mb-2">Education</h3>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="mb-3">
              <div className="flex justify-between">
                <p className="font-medium">Master of Computer Science</p>
                <p className="text-sm text-gray-500">2015 - 2017</p>
              </div>
              <p className="text-sm">University of Technology</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">Bachelor of Science in Software Engineering</p>
                <p className="text-sm text-gray-500">2011 - 2015</p>
              </div>
              <p className="text-sm">State University</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}