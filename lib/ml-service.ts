// lib/ml-service.ts

const API_URL=process.env.NEXT_PUBLIC_AI_API_URL || "";

interface MLResponse {
  category: string;
  confidence: number;
}

export async function getApplicantScore(resumeFile: File): Promise<MLResponse> {
  console.log("🚀 Sending PDF to AI Server...");

  try {
    // 1. Prepare the form data (simulation of Python's files={"file": ...})
    const formData = new FormData();
    formData.append("file", resumeFile);

    // 2. Call the API
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.statusText}`);
    }

    // 3. Parse Result
    const result = await response.json();
    
    console.log("✅ AI Success:", result);

    return {
      category: result.category,
      confidence: result.confidence // API returns 0.0 to 1.0
    };

  } catch (error) {
    console.error("❌ AI Connection Failed:", error);
    // Fallback if API fails (so the app doesn't crash)
    return { category: "Unsorted", confidence: 0 };
  }
}