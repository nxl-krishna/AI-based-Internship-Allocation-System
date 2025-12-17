import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId;

  // 1. Fetch Job
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  // 2. Setup Slots
  const womenQuota = Math.ceil(job.totalSlots * 0.30);
  let spotsFilledCurrently = job.filledSlots;
  const spotsAvailable = job.totalSlots - spotsFilledCurrently;

  if (spotsAvailable <= 0) {
    return NextResponse.json({ error: "No slots remaining" }, { status: 400 });
  }

  // --- HELPER FUNCTION: ALLOCATE & CLEANUP ---
  // This function accepts a user AND rejects them from all other jobs instantly
  async function allocateUser(allocationId: string, userId: string) {
    // A. Check if user is ALREADY accepted elsewhere (Safety check)
    const existingAcceptance = await prisma.allocationResult.findFirst({
      where: { userId: userId, status: 'ACCEPTED' }
    });

    if (existingAcceptance) {
      // If they already have a job, mark THIS application as rejected and skip
      await prisma.allocationResult.update({
        where: { id: allocationId },
        data: { status: 'REJECTED' }
      });
      return false; // Did not allocate
    }

    // B. Mark as ACCEPTED for THIS job
    await prisma.allocationResult.update({
      where: { id: allocationId },
      data: { status: 'ACCEPTED' }
    });

    // C. MAGIC STEP: Auto-Reject this user from ALL other pending jobs
    // This ensures they disappear from the "Pending" count of Job B, C, D...
    await prisma.allocationResult.updateMany({
      where: {
        userId: userId,
        status: 'PENDING',
        NOT: { id: allocationId } // Don't reject the one we just accepted!
      },
      data: { status: 'REJECTED' }
    });

    console.log(`✅ Allocated User ${userId} and cleared their other applications.`);
    return true; // Successfully allocated
  }


  // --- PASS 1: WOMEN QUOTA ---
  const womenAlreadyAccepted = await prisma.allocationResult.count({
    where: { jobId: jobId, status: "ACCEPTED", user: { profile: { gender: "FEMALE" } } }
  });
  const womenNeeded = Math.max(0, womenQuota - womenAlreadyAccepted);

  if (womenNeeded > 0) {
    const topWomen = await prisma.allocationResult.findMany({
      where: { jobId: jobId, status: "PENDING", user: { profile: { gender: "FEMALE" } } },
      orderBy: { confidenceScore: "desc" },
      take: womenNeeded + 5 // Fetch a few extras in case top ones are already hired
    });

    for (const match of topWomen) {
      if (spotsFilledCurrently >= job.totalSlots) break; // Safety break
      
      const success = await allocateUser(match.id, match.userId);
      if (success) {
        spotsFilledCurrently++;
        // If we filled the women quota needed, we can stop strictly prioritizing women
        // But usually, we just let the loop run to fill the specific quota count
      }
    }
  }

  // --- PASS 2: GENERAL MERIT ---
  const remainingSlots = job.totalSlots - spotsFilledCurrently;

  if (remainingSlots > 0) {
    const topGeneral = await prisma.allocationResult.findMany({
      where: { jobId: jobId, status: "PENDING" },
      orderBy: { confidenceScore: "desc" },
      take: remainingSlots + 10 // Fetch extras to handle skips
    });

    for (const match of topGeneral) {
      if (spotsFilledCurrently >= job.totalSlots) break;
      
      const success = await allocateUser(match.id, match.userId);
      if (success) {
        spotsFilledCurrently++;
      }
    }
  }

  // 3. Update Job Counters
  await prisma.job.update({
    where: { id: jobId },
    data: { filledSlots: spotsFilledCurrently }
  });

  // 4. Reject remaining PENDING for THIS job if full
  if (spotsFilledCurrently >= job.totalSlots) {
      await prisma.allocationResult.updateMany({
          where: { jobId: jobId, status: "PENDING" },
          data: { status: "REJECTED" }
      });


      
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}