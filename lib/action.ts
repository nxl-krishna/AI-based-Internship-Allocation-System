// lib/actions.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { getApplicantScore } from "./ml-service";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function registerApplicant(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const rawData = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    gender: formData.get("gender") as "MALE" | "FEMALE" | "OTHER",
    university: formData.get("university") as string,
    cgpa: parseFloat(formData.get("cgpa") as string),
    city: formData.get("city") as string,
    preferredCity: formData.get("preferredCity") as string,
    skills: formData.get("skills") as string,
    resumeUrl: formData.get("resumeUrl") as string,
  };

  // 1. Ensure User Exists in DB (Sync Clerk with Prisma)
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {},
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // 2. Save Profile
  await prisma.applicantProfile.create({
    data: {
      userId: dbUser.id,
      ...rawData,
      isProcessed: true, // We are processing immediately below
    },
  });

  // 3. CALL THE MOCK ML SERVICE
  const mlResult = await getApplicantScore(rawData.resumeUrl, rawData.skills);

  // 4. Find Matching Jobs (The "Matchmaker" Step)
  // We look for any job that matches the Predicted Category
  const matchingJobs = await prisma.job.findMany({
    where: { category: mlResult.category }
  });

  // 5. Create Allocation Results (Pending Status)
  for (const job of matchingJobs) {
    await prisma.allocationResult.create({
      data: {
        userId: dbUser.id,
        jobId: job.id,
        predictedCategory: mlResult.category,
        confidenceScore: mlResult.confidenceScore,
        status: "PENDING"
      }
    });
  }

  // Redirect to success page or dashboard
  redirect("/dashboard");
}