import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const user = await currentUser();
  
  // 1. Security Check: Verify user is ADMIN
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user?.id },
  });

  if (!dbUser || dbUser.role !== 'ADMIN') {
    return (
      <div className="p-10 text-red-600 font-bold text-center">
        ⛔ Access Denied: You are not an Administrator.
      </div>
    );
  }

  // 2. Fetch Jobs with Applicant Counts
  const jobs = await prisma.job.findMany({
    include: {
      _count: {
        select: { allocations: true } // Counts how many students matched this job
      },
      allocations: {
        where: { status: 'PENDING' } // Only count pending ones for the "Action Needed" badge
      }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/home" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-2 transition">
             <span>← Back to Main Hub</span>
          </Link>
          
        </div>
        {/* Optional: Add UserButton here if you want */}
      </div>
        <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-gray-600 mb-8">Overview of Internship Allocations</p>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold">Job Title</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Slots (Filled/Total)</th>
                <th className="p-4 font-semibold">Pending Applicants</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4 text-gray-600">{job.company}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {job.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {job.filledSlots} / {job.totalSlots}
                  </td>
                  <td className="p-4">
                    {job.allocations.length > 0 ? (
                       <span className="text-orange-600 font-bold">{job.allocations.length} Pending</span>
                    ) : (
                       <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="p-4">
                    {job.allocations.length > 0 && (
                      <form action={`/admin/allocate/${job.id}`} method="POST"> 
                        {/* We will build this button functionality next */}
                        <button className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800">
                          Run Allocation Algo
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}