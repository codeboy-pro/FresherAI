import llm from "../config/llm";
import hrInterviewPrompt from "../prompts/hrInterviewPrompt";
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt";



export const interviewAgent=async(data)=>{

    try{
const prompt =
  data?.type?.toLowerCase() === "hr"
    ? hrInterviewPrompt(data)
    : technicalInterviewPrompt(data);
    const response=await llm.invoke(prompt);
    const cleaned=response.content.replace(/```json/g,"")
        .replace(/```/g,"")
        .trim();
  return JSON.parse(cleaned);
    

        
    }catch(error){
  console.log("Interview agent error",error);
  console.log(response.content);
  throw new Error("Failed to generate interview questions. ");

    }


}