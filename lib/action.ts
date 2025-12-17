// lib/actions.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { getApplicantScore } from "./ml-service"; // Import the real service
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function registerApplicant(formData: FormData) {
 const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const resumeFile = formData.get("resumeFile") as File;
  
  // 1. CALL AI FIRST
  const mlResult = await getApplicantScore(resumeFile);

  // 2. Prepare Data
  const rawData = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    gender: formData.get("gender") as "MALE" | "FEMALE" | "OTHER",
    university: formData.get("university") as string,
    cgpa: parseFloat(formData.get("cgpa") as string),
    city: formData.get("city") as string,
    preferredCity: formData.get("preferredCity") as string,
    skills: formData.get("skills") as string,
    resumeUrl: resumeFile.name,
    // SAVE THE AI RESULT HERE
    aiCategory: mlResult.category 
  };

  // 3. Ensure User Exists
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {},
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // 4. Save Profile
  await prisma.applicantProfile.create({
    data: {
      userId: dbUser.id,
      ...rawData,
      isProcessed: true,
    },
  });

  
  // 6. Find Matching Jobs based on AI Category
 const matchingJobs = await prisma.job.findMany({
    where: { 
      category: mlResult.category,
      filledSlots: { lt: prisma.job.fields.totalSlots } // Only if slots are available
    }
  });

  // B. Loop through and create "PENDING" applications automatically
  for (const job of matchingJobs) {
    await prisma.allocationResult.create({
      data: {
        userId: dbUser.id,
        jobId: job.id,
        predictedCategory: mlResult.category,
        confidenceScore: mlResult.confidence,
        status: "PENDING"
      }
    });

    
  }


  redirect("/dashboard");
}

// lib/actions.ts

// ... (keep your existing registerApplicant code here) ...

// --- ADD THESE NEW FUNCTIONS AT THE BOTTOM ---

export async function acceptOffer(formData: FormData) {
  const allocationId = formData.get("allocationId") as string;
  
  await prisma.allocationResult.update({
    where: { id: allocationId },
    data: { status: "ACCEPTED" }
  });
  
  redirect("/dashboard");
}

export async function rejectOffer(formData: FormData) {
  const allocationId = formData.get("allocationId") as string;
  const jobId = formData.get("jobId") as string;

  // 1. Mark status as REJECTED
  await prisma.allocationResult.update({
    where: { id: allocationId },
    data: { status: "REJECTED" }
  });

  // 2. Free up the slot
  await prisma.job.update({
    where: { id: jobId },
    data: { 
      filledSlots: { decrement: 1 } 
    }
  });

  redirect("/dashboard");
}


export async function applyForJob(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const jobId = formData.get("jobId") as string;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { profile: true }
  });

  if (!dbUser?.profile) throw new Error("Profile not found");

  // Prevent duplicate applications
  const existingApplication = await prisma.allocationResult.findUnique({
    where: {
      userId_jobId: {
        userId: dbUser.id,
        jobId: jobId
      }
    }
  });

  if (existingApplication) return redirect("/dashboard");

  // Mock AI Score calculation (since we are just applying)
  // In a real app, you might fetch the resume file here
  const dummyFile = new File(["resume"], dbUser.profile.resumeUrl, { type: "application/pdf" });
  const mlResult = await getApplicantScore(dummyFile);

  await prisma.allocationResult.create({
    data: {
      userId: dbUser.id,
      jobId: jobId,
      predictedCategory: mlResult.category,
      confidenceScore: mlResult.confidence,
      status: "PENDING"
    }
  });

  redirect("/dashboard");
}