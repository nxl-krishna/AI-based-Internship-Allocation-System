import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { registerApplicant } from "../../lib/action";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function RegisterPage() {
  // 1. Get the current logged-in user
  const user = await currentUser();
  
  if (!user) {
    redirect("/"); // If not logged in, go home
  }

  // 2. CHECK DATABASE: Does a profile already exist for this Clerk ID?
  // We first need to find the User record by Clerk ID, then check for a profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { profile: true } // Include the profile relation
  });

  // 3. THE GUARD CLAUSE
  // If the user exists AND they have a profile, block them from registering again.
  if (dbUser && dbUser.profile) {
    redirect("/dashboard");
  }

  // 4. If no profile exists, show the form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <Link href="/home" className="absolute top-6 right-6 text-sm text-gray-400 hover:text-gray-700 font-medium">
        ✕ Cancel
      </Link>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Applicant Registration</h1>
        <p className="text-gray-500 mb-6">Please fill this form once to be considered for internships.</p>
        
        <form action={registerApplicant} className="space-y-4">
          
          {/* Section 1: Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input name="fullName" required className="w-full border p-2 rounded text-black" defaultValue={user.fullName || ""} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" required className="w-full border p-2 rounded text-black" placeholder="+91 98765..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" className="w-full border p-2 rounded text-black">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Section 2: Academic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input name="university" required className="w-full border p-2 rounded text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CGPA</label>
              <input name="cgpa" type="number" step="0.1" required className="w-full border p-2 rounded text-black" placeholder="8.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current City</label>
              <input name="city" required className="w-full border p-2 rounded text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred City</label>
              <input name="preferredCity" required className="w-full border p-2 rounded text-black" />
            </div>
          </div>

          {/* Section 3: Skills & Resume */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
            <textarea name="skills" required className="w-full border p-2 rounded text-black" placeholder="Python, Java, Machine Learning..." rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resume (PDF Only)</label>
            {/* CHANGED: type="file" and name="resumeFile" */}
            <input 
              name="resumeFile" 
              type="file" 
              accept=".pdf" 
              required 
              className="w-full border p-2 rounded text-black bg-white" 
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}