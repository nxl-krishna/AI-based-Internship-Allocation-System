// lib/ml-service.ts

// Toggle this in your .env file: USE_REAL_AI="true" or "false"
const USE_REAL_AI = process.env.USE_REAL_AI === "true";

interface MLResponse {
  category: string;
  confidenceScore: number;
}

export async function getApplicantScore(resumeLink: string, skills: string): Promise<MLResponse> {
  
  if (!USE_REAL_AI) {
    console.log("⚠️ [MOCK MODE] Saving AI Credits. Returning dummy data.");
    
    // LOGIC: If skills contain "React", give React role. Else Data Science.
    // This lets you test both scenarios manually!
    if (skills.toLowerCase().includes("react")) {
      return {
        category: "React Developer",
        confidenceScore: 0.92 // 92% Match
      };
    } else {
      return {
        category: "Data Science",
        confidenceScore: 0.88 // 88% Match
      };
    }
  }

  // TODO: PASTE YOUR REAL API CALL HERE LATER
  return { category: "Unsorted", confidenceScore: 0 };
}