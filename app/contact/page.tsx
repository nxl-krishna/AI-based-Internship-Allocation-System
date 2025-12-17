export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-10 bg-white text-black">
      <h1 className="text-4xl font-bold mb-6">About the Allocation System</h1>
      
      <div className="max-w-2xl text-lg space-y-4">
        <p>
          This platform utilizes Machine Learning to automate the matching of 
          applicants to internship opportunities.
        </p>
        
        <p>
          <strong>Our Goal:</strong> To replace manual filtering with an intelligent 
          scoring engine that evaluates resumes against job descriptions in real-time.
        </p>
      </div>
    </div>
  );
}