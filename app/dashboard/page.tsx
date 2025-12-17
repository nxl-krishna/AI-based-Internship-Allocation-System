import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { acceptOffer, rejectOffer } from "../../lib/action";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { 
      profile: true,
      matches: { include: { job: true } } 
    }
  });

  if (!dbUser?.profile) redirect("/register");

  const userCategory = (dbUser.profile as any).aiCategory; 
  const myApplications = dbUser.matches;

  return (
    <div className="min-h-screen bg-slate-50 text-black p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b pb-4 mb-8">
          <div>
             <Link href="/home" className="text-sm font-bold text-gray-500 hover:text-blue-600 mb-2 block">← Back to Home</Link>
             <h1 className="text-3xl font-bold">Applicant Dashboard</h1>
             <p className="text-gray-600 mt-2">
               AI Profile: <span className="font-bold text-blue-600">{userCategory}</span>
             </p>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        <div className="bg-blue-100 border border-blue-200 text-blue-800 p-4 rounded-xl mb-8 flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold">Auto-Allocation Active</p>
            <p className="text-sm">Our system has automatically applied you to all open <span className="font-bold">{userCategory}</span> positions.</p>
          </div>
        </div>

        {/* YOUR APPLICATIONS GRID */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Active Applications</h2>
          
          {myApplications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed">
              <p className="text-gray-500">No applications found. Please check back later for new openings.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myApplications.map((match) => (
                <div key={match.id} className="p-6 border rounded-xl bg-white shadow-sm relative overflow-hidden">
                  
                  {/* Status Badge Top Right */}
                  <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase
                      ${match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${match.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' : ''}
                      ${match.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                      ${match.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {match.status}
                  </div>

                  <h3 className="font-bold text-lg mt-2">{match.job.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{match.job.company}</p>
                  
                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                    <span>📍 {match.job.location}</span>
                    <span>⚡ AI Score: {(match.confidenceScore * 100).toFixed(0)}%</span>
                  </div>

                  {/* ACTION BUTTONS (Only if Approved) */}
                  {match.status === 'APPROVED' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                       <form action={acceptOffer} className="w-full">
                         <input type="hidden" name="allocationId" value={match.id} />
                         <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold text-sm">
                           Accept
                         </button>
                       </form>
                       <form action={rejectOffer} className="w-full">
                         <input type="hidden" name="allocationId" value={match.id} />
                         <input type="hidden" name="jobId" value={match.job.id} />
                         <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded font-bold text-sm">
                           Decline
                         </button>
                       </form>
                    </div>
                  )}

                  {match.status === 'PENDING' && (
                    <div className="mt-4 pt-4 border-t text-center text-xs text-gray-400">
                      Waiting for Admin Review...
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* OPTIONAL: Link to Manual Job Board */}
       

      </div>
    </div>
  );
}


