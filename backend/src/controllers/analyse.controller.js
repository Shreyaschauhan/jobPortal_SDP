import fs from "fs";
import fetch from "node-fetch";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { getGeminiOutput } from "../utils/aiConfig.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ======================================================
   FILE UPLOAD VERSION (multer)
====================================================== */
export const analyzeResumeWithFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfText = await extractTextFromPDF(new Uint8Array(pdfBuffer));

    // remove temp file
    fs.unlink(req.file.path, () => {});

    const prompt = buildPrompt(pdfText, req.body);
    const aiResult = await getGeminiOutput(prompt);

    return res.status(200).json(
      new ApiResponse(200, { analysis: aiResult }, "Resume analysis successful")
    );
  } catch (error) {
  console.error("File Resume Analysis Error:", error);

  return res.status(503).json({
    success: false,
    message:
      error.message ||
      "AI service is currently overloaded. Please try again later.",
  });
}
};

/* ======================================================
   URL VERSION (JSON only – NO multer)
====================================================== */
export const analyzeResumeWithUrl = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Resume URL is required",
      });
    }

    const response = await fetch(resumeUrl);
    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume URL",
      });
    }

    const pdfBuffer = await response.arrayBuffer();
    const pdfText = await extractTextFromPDF(
      new Uint8Array(pdfBuffer)
    );

    const prompt = buildPrompt(pdfText, req.body);
    const aiResult = await getGeminiOutput(prompt);

    return res.status(200).json(
      new ApiResponse(200, { analysis: aiResult }, "Resume analysis successful")
    );
  } catch (error) {
    console.error("URL Resume Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
    });
  }
};

/* ======================================================
   PROMPT BUILDER
====================================================== */
const buildPrompt = (pdfText, body) => {
  const { jobDescription = "", analysisOption = "Quick Scan" } = body;

  switch (analysisOption) {
    case "Quick Scan":
      return `
Provide a quick scan of this resume:
- Best-matching profession
- 3 strengths
- 2 improvements
- ATS score out of 100

Resume:
${pdfText}

Job Description:
${jobDescription}
      `;

    case "Detailed Analysis":
      return `
Provide a detailed resume analysis:
- Best profession
- 5 strengths
- 3–5 improvements
- Rate Impact, Brevity, Style, Structure, Skills
- ATS score out of 100

Resume:
${pdfText}

Job Description:
${jobDescription}
      `;

    case "ATS Optimization":
      return `
Optimize this resume for ATS:
- Missing keywords
- Readability improvements
- Optimization points
- ATS compatibility score

Resume:
${pdfText}

Job Description:
${jobDescription}
      `;

    default:
      return `Analyze this resume:\n${pdfText}`;
  }
};
