import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Ensure you import Image

export default async function LandingPage() {
  const { userId } = await auth();

  // IF LOGGED IN: Go straight to the new Home Hub
  if (userId) {
    redirect("/home");
  }

  // IF GUEST: Show Indian Government Style Page
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
     {/* 4. MARQUEE / TICKER */}
      <div className="bg-orange-50 border-b border-orange-200 py-2 px-4 flex items-center">
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded mr-2 animate-pulse">
          NEW
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
           <p className="text-sm text-red-800 font-medium inline-block animate-marquee">
              📢 Applications for Phase 1 Internships are now open. Last date to apply is 30th December.  ||  
              📢 New companies added:500+ vacancies.
           </p>
        </div>
      </div>

      {/* 5. HERO SECTION */}
      <main className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-left space-y-6">
             <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold border border-green-200">
               🇮🇳 Empowering the Future
             </div>
             
             <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
               Internship Opportunities for <br/>
               <span className="text-orange-600">Indian Youth</span>
             </h2>
             
             <p className="text-lg text-gray-600 leading-relaxed">
               Bridging the gap between academic learning and industry requirements. 
               Apply for internships in top companies and kickstart your career with hands-on experience.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Link href="/about" className="px-8 py-3 bg-blue-900 text-white rounded shadow hover:bg-blue-800 font-semibold text-center">
                 Know More
               </Link>
              
             </div>
          </div>

          {/* Right Side: Stats/Images Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 text-center">
                <div className="text-3xl font-bold text-blue-900">100+</div>
                <div className="text-sm text-gray-500">Internships Live</div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600 text-center">
                <div className="text-3xl font-bold text-green-900">20+</div>
                <div className="text-sm text-gray-500">Partner Companies</div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500 text-center col-span-2">
                <div className="text-xl font-bold text-gray-800">Inclusive growth through skill development</div>
                <div className="text-sm text-gray-500 mt-1">get trained for the future</div>
             </div>
          </div>

        </div>
      </main>

      {/* 6. FOOTER (NIC Style) */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center text-sm border-t-4 border-green-600">
        <div className="flex justify-center gap-4 mb-4">
          <span className="hover:text-white cursor-pointer">Website Policies</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Help & FAQ</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Feedback</span>
        </div>
        <p>
          Content is uploaded for academic project purpose only.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Designed and Developed by krishna rathore 
        </p>
        <div className="mt-4 opacity-50 text-xs">
          Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </footer>
    </div>
  );
}
