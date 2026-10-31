//  pdf---->  pdf storage---->  pdf text extraction---->  llm ---> agent 
// ----> prompt ---->data--->  save mongodb----> redis ---> delete pdf  --->  resume data(score , msssing skills...)

import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agent.js";
import extrectedText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import fs from "fs";

 export const  uploadResume = async (req, res) =>{
    try{
       const file= req.file;
       if(!file){
        return res.status(400).json({ 
            success: false,
            message: "Resume pdf is required"
         });
       }
       const userId= req.headers["x-user-id"];

       if (!userId) {
         return res.status(400).json({
           success: false,
           message: "User ID is required",
         });
       }

  const resumeText = await  extrectedText(file.path);

  const aiResponse= await resumeAgent(resumeText);

  const resumeData=JSON.parse(aiResponse);
  let resume=await Resume.findOne({userId});
  if(resume){
    await Object.assign(resume,

       { 
        ...resumeData,
         extractedText: resumeText
        }
    )
    await resume.save();
  }else{
    resume= await Resume.create({
        userId,
        extractedText: resumeText,
        ...resumeData
    })
  }


await redis.set(`resume:${userId}`, JSON.stringify(resume));

  // Delete the uploaded PDF file
  await fs.unlink(file.path);



  res.status(200).json({
    success: true,
    message: "Resume uploaded and processed successfully",
    data: resume
  });

    }catch(error){
        console.log(error);

       if(file){
        await fs.unlink(file.path);
       }
       return res.status(500).json({
        success: false,
        message: error.message,
       
       })
        
    }
}



export const getResume = async (req, res) =>{
    try{
        const userId = req.headers["x-user-id"];
    const cache=await redis.get(`resume:${userId}`);
    if(cache){
        return res.status(200).json({
            success:true,
            source:"cache",
            data:JSON.parse(cache)
        })
    }
     const resume=await Resume.findOne({userId});
     if(!resume){
        return res.status(404).json({
            success:false,
            message:"Resume not found"
        })
     }
        await redis.set(`resume:${userId}`, JSON.stringify(resume));
        return res.status(200).json({
            success:true,
            source:"mongodb",
            data:resume
        })


    }catch(error){
console.log(error);

if (file) {
  await fs.unlink(file.path);
}
return res.status(500).json({
  success: false,
  message: error.message,
});
    }

}