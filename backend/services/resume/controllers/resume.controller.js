//  pdf---->  pdf storage---->  pdf text extraction---->  llm ---> agent
// ----> prompt ---->data--->  save mongodb----> redis ---> delete pdf  --->  resume data(score , msssing skills...)

import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agent.js";
import extrectedText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import fs from "fs";

const asString = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

const asStringList = (value) => {
  if (!Array.isArray(value)) return value ? [asString(value)] : [];
  return value.map(asString).filter(Boolean);
};

const normalizeEducation = (value) => {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return items.map((item) => {
    if (typeof item === "string") return { institution: item };
    return {
      institution: asString(item?.institution),
      degree: asString(item?.degree),
      duration: asString(item?.duration),
      gpa: asString(item?.gpa),
      honors: asString(item?.honors),
      relevantCoursework: asStringList(item?.relevantCoursework),
    };
  });
};

const normalizeProjects = (value) => {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return items.map((item) => {
    if (typeof item === "string") return { name: item };
    return {
      name: asString(item?.name),
      duration: asString(item?.duration),
      description: asString(item?.description),
    };
  });
};

const normalizeExperience = (value) => {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return items.map((item) => {
    if (typeof item === "string") return { responsibilities: [item] };
    return {
      company: asString(item?.company),
      location: asString(item?.location),
      role: asString(item?.role),
      duration: asString(item?.duration),
      responsibilities: asStringList(item?.responsibilities),
    };
  });
};

const normalizeResumeData = (data) => ({
  name: asString(data?.name),
  email: asString(data?.email),
  phone: asString(data?.phone),
  summary: asString(data?.summary),
  score: Number.isFinite(Number(data?.score)) ? Number(data.score) : 0,
  skills: asStringList(data?.skills),
  projects: normalizeProjects(data?.projects),
  education: normalizeEducation(data?.education),
  experience: normalizeExperience(data?.experience),
  strengths: asStringList(data?.strengths),
  weaknesses: asStringList(data?.weaknesses),
  missingSkills: asStringList(data?.missingSkills),
  suggestedRole: asString(data?.suggestedRole),
  recommendations: asStringList(data?.recommendations),
});

const parseResumeResponse = (response) => {
  const content =
    typeof response === "string" ? response : JSON.stringify(response);
  const withoutMarkdown = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = withoutMarkdown.indexOf("{");
  const end = withoutMarkdown.lastIndexOf("}");

  if (start === -1 || end <= start) {
    throw new Error("AI returned no valid JSON object");
  }

  return JSON.parse(withoutMarkdown.slice(start, end + 1));
};

export const uploadResume = async (req, res) => {
  let file;
  try {
    file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Resume pdf is required",
      });
    }
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const resumeText = await extrectedText(file.path);

    const aiResponse = await resumeAgent(resumeText);

    const resumeData = normalizeResumeData(parseResumeResponse(aiResponse));
    let resume = await Resume.findOne({ userId });
    if (resume) {
      await Object.assign(
        resume,

        {
          ...resumeData,
          extractedText: resumeText,
        },
      );
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        extractedText: resumeText,
        ...resumeData,
      });
    }

    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    // Delete the uploaded PDF file
    await fs.promises.unlink(file.path);

    res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Resume upload failed:", error);

    if (file?.path && fs.existsSync(file.path)) {
      await fs.promises.unlink(file.path);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const cache = await redis.get(`resume:${userId}`);
    if (cache) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: JSON.parse(cache),
      });
    }
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }
    await redis.set(`resume:${userId}`, JSON.stringify(resume));
    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: resume,
    });
  } catch (error) {
    console.error("Fetching resume failed:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
