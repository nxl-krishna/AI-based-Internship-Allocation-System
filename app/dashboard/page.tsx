import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // Fetch User + All Allocations + Job Details
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      profile: true,
      matches: {
        include: { job: true },
        orderBy: { confidenceScore: 'desc' } // Highest score first
      }
    }
  });

  if (!dbUser || !dbUser.profile) {
    redirect("/register");
  }

  const allocations = dbUser.matches; // Get the full array

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Applicant Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {dbUser.profile.fullName}</p>
          </div>
          <div className="text-right">
             <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
               {dbUser.profile.university}
             </span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Your Matched Opportunities ({allocations.length})</h2>
        
        {allocations.length === 0 ? (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            AI is currently analyzing your resume. Check back in a moment.
          </div>
        ) : (
          // GRID LAYOUT: Shows all matches
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {allocations.map((match) => (
              <div key={match.id} className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
                
                {/* Header: Company & Role */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{match.job.title}</h3>
                  <p className="text-gray-600">{match.job.company}</p>
                </div>

                {/* Badges: Location & Score */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    📍 {match.job.location}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-bold
                    ${match.confidenceScore > 0.9 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                  `}>
                    {(match.confidenceScore * 100).toFixed(0)}% Match
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                    ${match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${match.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                    ${match.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {match.status}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}