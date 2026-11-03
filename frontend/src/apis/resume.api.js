import api from "../utils/axios"

export const getresume=async()=>{

    try{
    const response = await api.get("/api/resume/get-resume");
    
    return response?.data;
    }catch(error){
      
        return null;
    }
}